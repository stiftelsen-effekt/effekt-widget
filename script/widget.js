function DonationWidget(widgetElement) {
    var _self = this;

    this.assetsUrl = "https://effekt.blob.core.windows.net/effekt-widget/";

    this.localStorage = window.localStorage;

    this.element = widgetElement;
    this.wrapper = this.element.parentElement;
    this.activeError = false;

    this.submitOnAmount = true;

    this.slider = this.element.getElementsByClassName("slider")[0];
    if (!this.slider) throw Error("No slider element in widget");

    this.progress = this.element.getElementsByClassName("progress")[0];
    if (!this.progress) throw new Error("No progress element in slider");

    this.error = this.element.getElementsByClassName("error")[0];
    if (!this.error) throw new Error("No error element in slider");

    this.width = this.element.clientWidth;
    this.currentSlide = 0;

    this.panes = this.element.getElementsByClassName("pane");
    this.activePanes = 0;
    for (var i = 1; i < this.panes.length; i++) {
        if(!this.panes[i].classList.contains("hidden")) this.activePanes++;
    }

    var notDefaultPanes = ["shares"]

    this.defaultPanes = 90;

    this.slider.style.width = (this.panes.length * this.width) + "px";

    for (var i = 0; i < this.panes.length; i++) {
        var pane = this.panes[i];
        pane.style.width = this.width + "px";

        if (i == 0) {
            pane.submit = submitUser;
            pane.focus = focusUser;
        } else if (i == 1) {
            pane.submit = submitAmount;
            pane.focus = focusAmount;
            setupSelectSplitCheckbox();
        } else if (i == 2) {
            pane.submit = submitDonation;
            pane.focus = focusDonation;
            setupDonationSplitPane(pane);
        } else if (i == this.panes.length-1) {
             //No submit function needed on last pane
        } else {
            throw new Error("No submit function specified for a pane");
        }

        if (i != panes.length-1) insertNextButton(pane, (i == 0)); //No next button on last pane
        if (i != 0 && i != panes.length-1) insertPrevButton(pane); //No prev button on first and last pane
        if (i != panes.length-1) submitOnEnter(pane); //Do not submit on enter on last pane
    }

    this.panes[0].focus();

    setupSelectOnClick();
    setupSavedUser();

    /* Setup helpers */
    function insertNextButton(pane, lonely) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("frwd");

        if (lonely) btn.classList.add("lonely");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

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
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            prevSlide();
        })
    }

    function submitOnEnter(pane) {
        var inputs = pane.querySelectorAll("input[type=text], input[type=number]");
        if (inputs.length > 0) {
            for (var i = 0; i < inputs.length; i++) {
                if (i == inputs.length-1) {
                    inputs[i].addEventListener("keydown", function(e) {
                        if (_self.activeError) hideError();
                        if (e.keyCode == 13) {
                            pane.submit();
                        }
                    });
                } else {
                    (function() {
                        var next = inputs[i+1];
                        inputs[i].addEventListener("keydown", function(e) {
                            console.log("Keydown")
                            if (_self.activeError) hideError();
                            if (e.keyCode == 13) {
                                next.focus();
                            }
                        });
                    }());
                }
            }
            
        }
    }

    function setupSavedUser() {
        if (_self.localStorage) {
            _self.panes[0].getElementsByClassName("name")[0].value = _self.localStorage.getItem("donation-name");
            _self.panes[0].getElementsByClassName("email")[0].value = _self.localStorage.getItem("donation-email");
        }
    }

    /* Submission functions */
    function submitUser() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        var email = this.getElementsByClassName("email")[0].value;
        var name = this.getElementsByClassName("name")[0].value;

        _self.request("users", "POST", {email: email, name: name}, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) error("Når ikke server. Forsøk igjen senere.");
                else if (err == "Malformed request") error("Ikke en gyldig email");

                nxtBtn.classList.remove("loading");
                return;
            }

            if (_self.localStorage) {
                console.log("set")
                _self.localStorage.setItem("donation-name", name);
                _self.localStorage.setItem("donation-email", email);
            }

            _self.KID = data.content.KID;
            _self.nextSlide();
        });
    }

    function submitAmount() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        _self.donationAmount = parseInt(this.getElementsByClassName("amount")[0].value);

        console.log(_self.submitOnAmount)
        if (_self.submitOnAmount) {
            _self.panes[2].style.display = "none";
            postDonation({
                KID: _self.KID,
                amount: _self.donationAmount
            }, nxtBtn);
        } else {
            _self.nextSlide();

            setTimeout(function() {
                nxtBtn.classList.remove("loading");
            }, 200);
        }        
    }

    function submitDonation() {
        var nxtBtn = this.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        var donationSplit = _self.organizations.map((org) => {
            return {
                id: org.id,
                split: (_self.sharesType == "decimal" ? (org.setValue / _self.donationAmount) * 100 : org.setValue)
            }
        })

        postDonation({
            KID: _self.KID,
            amount: _self.donationAmount,
            organizations: donationSplit
        }, nxtBtn); 
    }

    function postDonation(postData, nxtBtn) {
        console.log(postData);
        _self.request("donations", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }

            var resultPane = _self.element.getElementsByClassName("result")[0];

            resultPane.getElementsByClassName("amount")[0].innerHTML = _self.donationAmount + "kr";
            var KIDstring = data.content.KID.toString();
            KIDstring = KIDstring.slice(0,3) + " " + KIDstring.slice(3,5) + " " + KIDstring.slice(5);
            resultPane.getElementsByClassName("KID")[0].innerHTML = KIDstring;
            
            _self.nextSlide();
        });
    }

    /* Focusing functions */
    function focusUser() {
        var input = this.getElementsByClassName("name")[0];
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

        _self.setSplitValues();

        setTimeout(function() {
            pane.getElementsByTagName("input")[0].focus();
        }, 200);
    }

    /* Setup select split checkbox */
    function setupSelectSplitCheckbox() {
        var checkbox = document.getElementById("check-select-split");

        checkbox.addEventListener("change", function(e) {
            if (!this.checked) {
                _self.element.getElementsByClassName("shares")[0].classList.remove("hidden");
                _self.submitOnAmount = false;
                _self.activePanes++;
            }
            else {
                _self.element.getElementsByClassName("shares")[0].classList.add("hidden");
                _self.submitOnAmount = true;
                _self.activePanes--;
            }
            updateSliderProgress();
        });
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
                        //console.log(org);

                        var li = document.createElement("li");
                        //li.setAttribute("data-id", org._id);

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

                    submitOnEnter(pane);
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

        var pane = _self.panes[slidenum];
        
        if (pane.classList.contains("hidden")) {
            if (_self.currentSlide < slidenum) slidenum++;
            else if (_self.currentSlide > slidenum) slidenum--;
        }
        
        pane = _self.panes[slidenum];

        if (pane.getElementsByClassName("btn").length > 0) {
            //If pane has button, make room for those
            var padding = 90;
        } else {
            var padding = 50;
        }
        _self.element.style.height = (pane.getElementsByClassName("inner")[0].clientHeight + padding) + "px";
        pane.focus();

        _self.currentSlide = slidenum;
        updateSliderProgress();
    }

    this.nextSlide = function() {
        this.goToSlide(this.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(this.currentSlide -  1);
    }

    //Progress bar
    function updateSliderProgress() {
        _self.progress.style.width = (100 / (_self.activePanes)) * _self.currentSlide + "%";
        console.log((100 / (_self.activePanes)) * _self.currentSlide);
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
    //var api_url = "https://effektapi.azurewebsites.net/"
    var api_url = "http://effekt.harnes.me:3000/";

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

    //UI snazzyness
    function setupSelectOnClick() {
        var elems = _self.panes[_self.panes.length - 1].getElementsByClassName("select-on-click");

        for (var i = 0; i < elems.length; i++) {
            elems[i].addEventListener("click", selectNodeText);
        }
    }

    function selectNodeText() {
        var node = this;

        if ( document.selection ) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    //Activate UI
    this.show = function() {
        _self.wrapper.style.zIndex = 100000;

        _self.element.classList.add("active");
        _self.wrapper.classList.add("active");
        _self.panes[0].focus();
    }

    /* Return */
    var properties = {
        element: this.element,
        panes: this.panes,
        goToSlide: this.goToSlide,
        slider: this.slider,
        setsplit: this.setSplitValues,
        show: this.show,
        _self: _self
    }
    return properties;
}