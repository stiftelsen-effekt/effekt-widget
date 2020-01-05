var DonorPane = require('./panes/donor.js');
var PaymentMethodPane = require('./panes/paymentMethod.js');
var AmountPane = require('./panes/amount.js');
var SharesPane = require('./panes/shares.js');
var ReferralPane = require('./panes/referral.js');
var PaypalPane = require('./panes/payPal.js');
var VippsPane = require('./panes/vipps.js');
var ResultPane = require('./panes/result.js');

function DonationWidget() {
    var _self = undefined;

    /* Network helpers */
    this.networkHelper = require('./helpers/network.js');
    this.request = this.networkHelper.request.bind(this.networkHelper);

    this.setup = function (self, widgetElement) {
        _self = self;

        this.assetsUrl = "https://storage.googleapis.com/effekt-widget/assets/";
        
        this.localStorage = window.localStorage; 
    
        this.element = widgetElement;
        this.wrapper = this.element.parentElement;
        this.activeError = false;
        this.errorElement = widgetElement.getElementsByClassName("error")[0];
    
        this.submitOnAmount = true;
        this.closeBtn = widgetElement.getElementsByClassName("close-btn")[0];

        this.progress = widgetElement.getElementsByClassName("progress")[0];
    
        this.width = this.element.clientWidth;
        this.currentSlide = 0;
    
        this.panes = [];
        var paneElements = this.element.getElementsByClassName("pane");
    
        this.slider = this.element.getElementsByClassName("slider")[0];
        this.slider.style.width = (paneElements.length * this.width) + "px";
  
        this.panes[0] = new DonorPane({
            widget: _self, 
            paneElement: paneElements[0],
            hasPrevBtn: false,
            hasNextBtn: true
        });
        
        this.panes[1] = new PaymentMethodPane({
            widget: _self, 
            paneElement: paneElements[1],
            hasPrevBtn: true,
            hasNextBtn: false
        });
        
        this.panes[2] = new AmountPane({
            widget: _self, 
            paneElement: paneElements[2],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        this.panes[3] = new SharesPane({
            widget: _self, 
            paneElement: paneElements[3],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        this.panes[4] = new ReferralPane({
            widget: _self,
            paneElement: paneElements[4],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        this.panes[5] = new PaypalPane({
            widget: _self,
            paneElement: paneElements[5],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        this.panes[6] = new VippsPane({
            widget: _self,
            paneElement: paneElements[6],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        this.panes[7] = new ResultPane({
            widget: _self,
            paneElement: paneElements[7],
            hasPrevBtn: false,
            hasNextBtn: false
        });

        if (this.panes.length != paneElements.length) throw new Error("Missing Javascript object for some HTML panes");

        //General setup helpers
        setupCloseBtn();
        setupSelectOnClick();
    }

    function setupCloseBtn() {
        _self.closeBtn.addEventListener("click", function() {
            _self.close();
        })
    }

    this.setMethod = function(method) {
        _self.method = method;
        _self.getPane(AmountPane).paneElement.setAttribute("class", "pane amount " + method);
    }

    this.registerDonation = function(nxtBtn) {
        const postData = {
            donor: {
                name: this.name,
                email: this.email,
                ssn: this.ssn
            },
            amount: this.donationAmount
        }

        if (this.donationSplit) {
            postData.organizations = this.donationSplit;
        }

        _self.request("donations/register", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) _self.error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) _self.error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }
            nxtBtn.classList.remove("loading");
            
            _self.KID = data.content.KID;
            _self.donorID = data.content.donorID;

            if (data.content.hasAnsweredReferral) {
                _self.panes[3].hide();
            }

            if (_self.method === "BANK") {
                _self.registerBankPending();
            }

            _self.nextSlide();
        });
    }

    this.registerBankPending = function() {
        const postData = {
            KID: _self.KID,
            sum: _self.donationAmount
        };
        _self.request("donations/bank/pending", "POST", postData, function(err, data) {
            if (err) _self.error("Sending av epost feilet");
        });
    }

    /* Slider control */
    this.goToSlide = function(slidenum) {

        //Recursively walk farward until visible pane found
        function walkToVisibleSlideAndReturnIndex(slidenum) {
            if (_self.panes[slidenum].visible) return slidenum;
            //If moving forward, traverse forwards, if moving backwards, traverse backwards
            else return walkToVisibleSlideAndReturnIndex((_self.currentSlide < slidenum) ? slidenum+1 : slidenum-1);
        }
        slidenum = walkToVisibleSlideAndReturnIndex(slidenum);
        
        if (slidenum < 0 || slidenum > _self.panes.length - 1) throw Error("Slide under 0 or larger than set")

        var visiblePanesInFront = getVisiblePanesInFront(slidenum);

        _self.slider.style.transform = "translateX(-" + (visiblePanesInFront * _self.width) + "px)";

        _self.currentSlide = slidenum;
        this.updateSliderProgress();

        //Fix for occational render bug
        setTimeout(function() {
            _self.element.style.overflow = "hidden";
            _self.element.getElementsByClassName("inner")[0].style.position = "static";

            setTimeout(function() {
                _self.element.getElementsByClassName("inner")[0].style.position = "";
                _self.element.style.overflow = "";
            }, 5);
        }, 500);

        var pane = _self.panes[slidenum];
        pane.focus();
        pane.resizeWidgetToFit();
    }

    this.nextSlide = function() {
        this.goToSlide(_self.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(_self.currentSlide -  1);
    }

    function getVisiblePanesInFront(slidenum) {
        return _self.panes.slice(0,slidenum).reduce(function(acc, pane) { 
            if (pane.visible) return acc+1;
            else return acc;
        }, 0);
    }

    //Progress bar
    this.updateSliderProgress = function() {
        var totalVisiblePanes = _self.panes.reduce(function(acc, pane) {  
            if (pane.visible) return acc+1;
            else return acc;
        }, 0);
        _self.progress.style.width = (100 / (totalVisiblePanes)) * (getVisiblePanesInFront(_self.currentSlide)+1) + "%";
    }

    /* Error element */
    this.error = function(msg) {
        _self.activeError = true;
        _self.errorElement.innerHTML = msg;
        _self.errorElement.classList.add("active");
        _self.panes[_self.currentSlide].paneElement.getElementsByClassName("loading")[0].classList.remove("loading");

        setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        _self.errorElement.classList.remove("active");
        _self.activeError = false;
    }
    this.hideError = hideError;

    this.setNoApiError = function() {
        var noApiErrorElement = document.getElementById("no_api_error");

        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
    }

    //UI snazzyness
    function setupSelectOnClick() {
        var elems = _self.panes[_self.panes.length - 1].paneElement.getElementsByClassName("select-on-click");

        for (var i = 0; i < elems.length; i++) {
            elems[i].addEventListener("click", selectNodeText);
        }
    }

    function selectNodeText(e) {
        e.preventDefault();
        e.stopPropagation();

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
        activePane.resizeWidgetToFit();

        _self.active = true;

        //User is engaged in form, activate "are you sure you want to leave" prompt on attempt to navigate away
        window.onbeforeunload = function() {
            return true;
        };
    }

    this.close = function() {
        document.body.classList.remove("widget-active");
        _self.element.classList.remove("active");
        _self.wrapper.classList.remove("active");
        _self.element.style.maxHeight = "";

        window.onbeforeunload = null;

        _self.active = false;

        setTimeout(function() {
            _self.wrapper.style.zIndex = -1;
            if (_self.currentSlide == _self.panes.length-1) { 
                //On result pane
                //Reset widget to default state
                _self.goToSlide(0);
                _self.getPane(SharesPane).hide();
                _self.getPane(VippsPane).hide();
                _self.getPane(PaypalPane).hide();
                _self.method = null;
                document.getElementById("check-select-recommended").click();
            }
        }, 500);
    }

    //Helpers
    this.getPane = function(PaneType) {
        return _self.panes.find(function (pane) { return pane instanceof PaneType; });
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
        setNoApiError: this.setNoApiError,
        request: this.request,
        updateSliderProgress: this.updateSliderProgress,
        registerDonation : this.registerDonation,
        registerBankPending: this.registerBankPending,
        prevSlide: this.prevSlide,
        hideError: this.hideError,
        setup: this.setup,
        network: this.networkHelper,
        getPane: this.getPane,
        setMethod: this.setMethod
    }
    return properties;
} 

window.DonationWidget = DonationWidget; 