function DonationWidget(widgetElement) {
    var _self = this;

    var getTranslateXRegEx = /\.*translateX\((.*)px\)/i;

    this.element = widgetElement;
    this.activeError = false;

    this.slider = this.element.getElementsByClassName("slider")[0];
    if (!this.slider) throw Error("No slider element in widget");

    this.progress = this.element.getElementsByClassName("progress")[0];
    if (!this.progress) throw new Error("No progress element in slider");

    this.error = this.element.getElementsByClassName("error")[0];
    if (!this.error) throw new Error("No error element in slider");

    this.width = this.element.clientWidth;
    this.currentSlide = 0;

    this.panes = this.element.getElementsByClassName("pane");

    var notDefaultPanes = ["shares"]

    console.log(this.panes)

    /*
    var something = this.panes.reduce(function(acc, elem) {
        if (notDefaultPanes.every(function(className, i, array) { 
            console.log(elem)
            console.log(array)
            return elem.classList.contains(className);
         })) return acc;
        else return acc + 1;
    },0);
    */
    this.panes.reduce(function(acc, elem) {
        return acc;
    }, 0);

    this.defaultPanes = 90;

    this.slider.style.width = (this.panes.length * this.width) + "px";

    for (var i = 0; i < this.panes.length; i++) {
        var pane = this.panes[i];
        pane.style.width = this.width + "px";

        if (i == 0) {
            pane.submit = submitEmail;
            pane.focus = focusEmail;
        } else if (i == 1) {
            pane.submit = submitAmount;
            pane.focus = focusAmount;
        } else if (i == 2) {
            pane.submit = submitDonation;
            pane.focus = focusDonation;
            setupDonationSplitPane(pane);
        } else if (i == this.panes.length-1) {
             //No submit function needed on last pane
        } else {
            throw new Error("No submit function specified for a pane");
        }

        if (i != panes.length) insertNextButton(pane);
        if (i != 0 && i != panes.length) insertPrevButton(pane);
        if (i != panes.length) submitOnEnter(pane);
        
    }

    this.panes[0].focus();

    /* Setup helpers */
    function insertNextButton(pane) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("frwd");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = "assets/next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = "assets/loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            pane.submit()
        })
    }

    function insertPrevButton(pane) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("back");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = "assets/next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = "assets/loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            prevSlide();
        })
    }

    function submitOnEnter(pane) {
        var inputs = pane.getElementsByTagName("input");
        if (inputs.length == 1) {
            inputs[0].addEventListener("keydown", function(e) {
                if (_self.activeError) hideError();
                if (e.keyCode == 13) {
                    pane.submit();
                }
            });
        }
    }

    /* Submission functions */
    function submitEmail() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        var email = this.getElementsByClassName("email")[0].value;

        _self.request("users", "POST", {email: email}, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) error("Når ikke server. Forsøk igjen senere.");
                else if (err == 400) error("Ikke en gyldig email");

                nxtBtn.classList.remove("loading");
                return;
            }
            
            _self.nextSlide();
        });
    }

    function submitAmount() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        _self.donationAmount = parseInt(this.getElementsByClassName("amount")[0].value);

        _self.nextSlide();

        setTimeout(function() {
            nxtBtn.classList.remove("loading");
        }, 200);
    }

    function submitDonation() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        _self.nextSlide();

        setTimeout(function() {
            nxtBtn.classList.remove("loading");
        }, 200);
    }

    /* Focusing functions */
    function focusEmail() {
        var input = this.getElementsByClassName("email")[0];
        setTimeout(function () {
            input.focus();
        }, 200);
    }

    function focusAmount() {
        var input = this.getElementsByClassName("amount")[0];

        _self.element.style.height = "";

        setTimeout(function () {
            input.focus();
        }, 200);
    }

    function focusDonation() {        
        var organizations = this.getElementsByClassName("organizations")[0];
        var pane = this;

        _self.element.style.height = (_self.element.clientHeight + organizations.clientHeight - 34) + "px";

        _self.setSplitValues();

        setTimeout(function() {
            pane.getElementsByTagName("input")[0].focus();
        }, 200);
    }

    /* Setup donation split pane */
    function setupDonationSplitPane(pane) {
        setupModeButton(pane);
        setupDonationList(pane);
    }

    function setupDonationList(pane) {
        setTimeout(function() {
            _self.request("organizations/active", "GET", { }, function(err, data) {
                if (err == 0) {
                    setNoApiError();
                } else {
                    _self.organizations = data.content;

                    var list = pane.getElementsByClassName("organizations")[0];
                    var leftover = 0;

                    _self.splitSharesTotal = pane.getElementsByClassName("total")[0];

                    for (var i = 0; i < _self.organizations.length; i++) {
                        var org = _self.organizations[i];
                        org.element = createListItem(org);

                        list.appendChild(org.element);
                    }

                    function createListItem(org) {
                        var li = document.createElement("li");

                        var span = document.createElement("span");
                        span.innerHTML = org.name;

                        li.appendChild(span);

                        var info = document.createElement("div");
                        info.classList.add("info");


                        info.addEventListener("click", function(e) {
                            showOrganizationInfo(org);
                        });

                        li.appendChild(info);

                        var inputWrapper = document.createElement("div");
                        inputWrapper.classList.add("input-wrapper");

                        li.appendChild(inputWrapper);

                        var input = document.createElement("input");
                        input.setAttribute("type", "number");

                        org.inputElement = input;

                        input.addEventListener("input", function(e) {
                            var val;
                            if (this.value.length > 0) val = parseFloat(this.value);
                            else val = 0;
                            
                            org.setValue = val;
                            updateTotalShares();
                        });

                        inputWrapper.appendChild(input);

                        return li;
                    }

                    function createInfoListItem(org) {
                        var li = document.createElement("li");
                        
                        var header = document.createElement("div");
                        header.classList.add("header");

                        header.style.backgroundImage = org.headerImage;

                        var headerText = document.createElement("h3");
                        headerText.innerHTML = org.name;

                        header.appendChild(headerText);

                        li.appendChild(header);

                        var content = document.createElement("div");
                        content.classList.add("content");

                        var contentParagraph = document.createElement("p");
                        contentParagraph.innerHTML = org.longDesc;

                        content.appendChild(contentParagraph);



                        return li;
                    }
                }
            });
        }, 10) 
    }

    function showOrganizationInfo(org) {
        //Will allways be split share slide
        var overlay = _self.panes[_self.currentSlide].elem.getElementsByClassName("overlay-organizations")[0];

        overlay.classList.add("visible");
    }

    this.setSplitValues = function() {
        for (var i = 0; i < _self.organizations.length; i++) {
            var org = _self.organizations[i];

            if (typeof org.setValue === "undefined") {
                org.setValue = Math.round(_self.donationAmount * (org.standardShare / 100));
            }

            org.inputElement.value = org.setValue;
        }

        updateTotalShares();
    }

    function organizationValuesToPercent() {
        for (var i = 0; i < _self.organizations.length; i++) {
            var org = _self.organizations[i];

            org.setValue = parseFloat(((org.setValue / _self.donationAmount) * 100).toFixed(1));
            org.inputElement.value = org.setValue;
        }
        updateTotalShares();
    }

    function organizationValuesToAmount() {
        for (var i = 0; i < _self.organizations.length; i++) {
            var org = _self.organizations[i];

            org.setValue = Math.round((org.setValue / 100) * _self.donationAmount);
            org.inputElement.value = org.setValue;
        }
        updateTotalShares();
    }

    function updateTotalShares() {
        var total = _self.organizations.reduce(function(acc, elem) { return acc + elem.setValue; }, 0);
        if (!isNaN(total)) {
            if (_self.sharesType == "decimal") {
                if (total == _self.donationAmount) setDonationSplitValidAmount();
                else {
                    _self.splitSharesTotal.innerHTML = total + " / " + _self.donationAmount;
                    setDonationSplitInvalidAmount();
                }
            } else if (_self.sharesType == "percentage") {
                if (total == 100) setDonationSplitValidAmount();
                else {
                    _self.splitSharesTotal.innerHTML = total + " / 100"; 
                    setDonationSplitInvalidAmount();
                }
            }
        }
    }

    function setDonationSplitValidAmount() {
        _self.splitSharesTotal.classList.add("hidden");
        _self.panes[_self.currentSlide].getElementsByClassName("btn")[0].classList.remove("inactive");
    }

    function setDonationSplitInvalidAmount() {
        _self.splitSharesTotal.classList.remove("hidden");
        _self.panes[_self.currentSlide].getElementsByClassName("btn")[0].classList.add("inactive");
    }

    function setupModeButton(pane) {
        var btn = pane.getElementsByClassName("mode-switch")[0];
        var organizationList = pane.getElementsByClassName("organizations")[0];

        _self.sharesType = "decimal";
        var hasSwitched = false;
        btn.addEventListener("click", function(e) {
            if (hasSwitched) {
                btn.classList.remove("switched");
                _self.sharesType = "decimal";
                organizationList.classList.remove("percentage-mode");
                organizationValuesToAmount();
                hasSwitched = false;
            } else {
                btn.classList.add("switched");
                _self.sharesType = "percentage";
                organizationList.classList.add("percentage-mode");
                organizationValuesToPercent();
                hasSwitched = true;
            }
        });
    }

    /* Slider control */
    this.goToSlide = function(slidenum) {
        if (slidenum < 0 || slidenum > this.panes.length - 1) throw Error("Slide under 0 or larger than set")
        _self.slider.style.transform = "translateX(-" + (slidenum * _self.width) + "px)";

        _self.progress.style.width = (100 / (_self.panes.length-1)) * slidenum + "%";

        _self.panes[slidenum].focus();

        _self.currentSlide = slidenum;
    }

    this.nextSlide = function() {
        this.goToSlide(this.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(this.currentSlide -  1);
    }

    /* Error element */
    var errorTimeout;
    function error(msg) {
        _self.activeError = true;
        _self.error.innerHTML = msg;
        _self.error.classList.add("active");

        errorTimeout = setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        //Error timeout remove
        console.log(errorTimeout)
        //if (errorTimeout) errorTimeout.clear();

        _self.error.classList.remove("active");
        _self.activeError = false;
    }

    function setNoApiError() {
        var noApiErrorElement = document.getElementById("no_api_error");

        /*
        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
        */
    }

    /* Network helpers */
    var api_url = "http://localhost:3000/";

    this.request = function(endpoint, type, data, cb) {
        var http = new XMLHttpRequest();
        var url = api_url + endpoint;

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200 ) {
                    var response = JSON.parse(this.responseText);

                    if (response.status == 200) {
                        cb(null, response);
                    }
                    else if (response.status == 400) {
                        cb(response.content, null);
                    }
                } else {
                    cb(this.status, null); 
                }
            }
        };

        if (type == "POST") {
            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            http.send("data=" + encodeURIComponent(JSON.stringify(data)));
        } else if (type == "GET") {
            http.open("GET", url, true);
            http.send(data);
        }
    }

    /* Return */
    var properties = {
        element: this.element,
        panes: this.panes,
        goToSlide: this.goToSlide,
        slider: this.slider,
        setsplit: this.setSplitValues
    }
    return properties;
}