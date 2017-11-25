function DonationWidget() {
    var _self = undefined;

    this.setup = function (self, widgetElement) {
        _self = self;
        console.log(_self);

        this.assetsUrl = "https://api.gieffektivt.no/static/";
        
        this.localStorage = window.localStorage;
    
        this.element = widgetElement;
        this.wrapper = this.element.parentElement;
        this.activeError = false;
    
        this.submitOnAmount = true;
    
        this.slider = this.element.getElementsByClassName("slider")[0];
        if (!this.slider) throw Error("No slider element in widget");
    
        this.progress = this.element.getElementsByClassName("progress")[0];
        if (!this.progress) throw new Error("No progress element in slider");
    
        this.errorElement = this.element.getElementsByClassName("error")[0];
        if (!this.error) throw new Error("No error element in slider");
    
        this.closeBtn = this.element.getElementsByClassName("close-btn")[0];
        if (!this.closeBtn) throw new Error("No close button element in widget")
    
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
                var donorPane = require('./panes/donor.js')(_self, _self.panes[0])

                pane.submit = function() {
                    donorPane.submit() 
                };
                pane.focus = function() {
                    universalPaneFocus(self, donorPane.pane);
                    donorPane.focus();
                };
            } else if (i == 1) {
                var amountPane = require('./panes/amount.js')(_self, _self.panes[1])
                
                pane.submit = function() { 
                    amountPane.submit(_self, this) 
                };
                pane.focus = function() { 
                    amountPane.focus(_self, this) 
                };
            } else if (i == 2) {
                var donationPane = require('./panes/donation.js')(_self, _self.panes[2])

                pane.submit = function() { 
                    donationPane.submit(_self, this) 
                };
                pane.focus = function() { 
                    donationPane.focus(_self, this) 
                };
            } else if (i == this.panes.length-1) {
                    //No submit function needed on last pane
            } else {
                throw new Error("No submit function specified for a pane");
            }
    
            if (i != this.panes.length-1) insertNextButton(pane, (i == 0)); //No next button on last pane
            if (i != 0 && i != this.panes.length-1) insertPrevButton(pane); //No prev button on first and last pane
            if (i != this.panes.length-1) submitOnEnter(pane); //Do not submit on enter on last pane
        }

        setupCloseBtn();
        setupSelectOnClick();
    }

    function universalPaneFocus(widget, pane) {
        var allInputs = widget.element.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("tabindex", "-1");
        }

        var paneInputs = pane.getElementsByTagName("input");
        for (var i = 0; i < paneInputs.length; i++) {
            paneInputs[i].setAttribute("tabindex", i+1);
        }
    }

    /* Setup helpers */
    function setupCloseBtn() {
        _self.closeBtn.addEventListener("click", function() {
            _self.close();
        })
    }

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
            pane.submit(_self, pane)
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
                        var valid = true;
                        if (this.type == "number") {
                            valid = numberInputWhitelistCheck(e);
                        }

                        if (_self.activeError) hideError();
                        if (e.keyCode == 109) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        if (e.keyCode == 13) {
                            pane.submit(_self, pane);
                        }
                        return valid;
                    });
                } else {
                    (function() {
                        var next = inputs[i+1];
                        inputs[i].addEventListener("keydown", function(e) {
                            var valid = true;
                            if (this.type == "number") {
                                valid = numberInputWhitelistCheck(e);
                            }

                            if (_self.activeError) hideError();
                            if (e.keyCode == 109) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (e.keyCode == 13) {
                                next.focus();
                            }

                            return valid;
                        });
                    }());
                }
            }

        }
    }

    function numberInputWhitelistCheck(e) {
        var valid = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 9 || e.keyCode == 46 || e.keyCode == 38 || e.keyCode == 40;

        if (e.path[0].getAttribute("nocomma") != "true" && !valid) {
            valid = e.keyCode == 188 || e.keyCode == 190
        }
        
        if (!valid) {
            e.preventDefault();
            e.stopPropagation(); 
        }

        return valid;
    }

    function postDonation(postData, nxtBtn) {
        _self.request("donations", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) _self.error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) _self.error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }
            nxtBtn.classList.remove("loading");

            var resultPane = _self.element.getElementsByClassName("result")[0];

            resultPane.getElementsByClassName("amount")[0].innerHTML = _self.donationAmount + "kr";
            var KIDstring = data.content.KID.toString();
            KIDstring = KIDstring.slice(0,3) + " " + KIDstring.slice(3,5) + " " + KIDstring.slice(5);
            resultPane.getElementsByClassName("KID")[0].innerHTML = KIDstring;
            resultPane.getElementsByClassName("email")[0].innerHTML = _self.email;

            _self.nextSlide();
        });
    }
    this.postDonation = postDonation;

    /* Slider control */
    this.goToSlide = function(slidenum) {
        if (slidenum < 0 || slidenum > this.panes.length - 1) throw Error("Slide under 0 or larger than set")
        _self.slider.style.transform = "translateX(-" + (slidenum * _self.width) + "px)";

        var pane = _self.panes[slidenum];

        if (pane.classList.contains("hidden")) {
            if (_self.currentSlide < slidenum) slidenum++;
            else if (_self.currentSlide > slidenum) slidenum--;
        }

        console.log("Going to pane:")
        console.log(pane)
        pane = _self.panes[slidenum];

        if (pane.getElementsByClassName("btn").length > 0) {
            //If pane has button, make room for those
            console.log("Has button");
            var padding = 90;
        } else {
            console.log("Does not have button");
            var padding = 50;
        }

        var height = pane.getElementsByClassName("inner")[0].clientHeight + padding;
        console.log("Height: " + height);
        if (height < 300) height = 300;
        _self.element.style.height = height + "px";
        pane.focus(_self, pane);

        _self.currentSlide = slidenum;
        updateSliderProgress();
    }

    this.nextSlide = function() {
        this.goToSlide(_self.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(_self.currentSlide -  1);
    }

    //Progress bar
    function updateSliderProgress() {
        _self.progress.style.width = (100 / (_self.activePanes)) * _self.currentSlide + "%";
    }
    this.updateSliderProgress = updateSliderProgress;

    /* Error element */
    this.error = function(msg) {
        _self.activeError = true;
        _self.errorElement.innerHTML = msg;
        _self.errorElement.classList.add("active");
        _self.panes[_self.currentSlide].getElementsByClassName("loading")[0].classList.remove("loading");

        setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        _self.errorElement.classList.remove("active");
        _self.activeError = false;
    }

    function setNoApiError() {
        var noApiErrorElement = document.getElementById("no_api_error");

        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
    }

    /* Network helpers */
    var api_url = "https://api.gieffektivt.no/";
    //var api_url = "http://localhost:3000/";

    console.log(this)

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
        var widget = _self;

        document.body.classList.add("widget-active");
        _self.wrapper.style.zIndex = 100000;

        _self.element.classList.add("active");
        _self.wrapper.classList.add("active");
        var activePane = _self.panes[_self.currentSlide];
        activePane.focus(_self, activePane);

        //User is engaged in form, activate "are you sure you want to leave" prompt on attempt to navigate away
        window.onbeforeunload = function() {
            return true;
        };
    }

    this.close = function() {
        document.body.classList.remove("widget-active");
        _self.element.classList.remove("active");
        _self.wrapper.classList.remove("active");

        window.onbeforeunload = null;

        setTimeout(function() {
            _self.wrapper.style.zIndex = -1;
            if (_self.currentSlide == _self.panes.length-1) { 
                _self.goToSlide(0);
                _self.panes[2].classList.remove("hidden");
                document.getElementById("check-select-recommended").click();
            }
        }, 800);
    } 

    /* Return */
    var properties = {
        element: this.element,
        panes: this.panes,
        goToSlide: this.goToSlide,
        nextSlide: this.nextSlide,
        slider: this.slider,
        setsplit: this.setSplitValues,
        show: this.show,
        close: this.close,
        error: this.error,
        request: this.request,
        updateSliderProgress: this.updateSliderProgress,
        postDonation: this.postDonation,
        setup: this.setup
    }
    return properties;
} 

window.DonationWidget = DonationWidget;
