function DonationWidget() {
    var _self = undefined;

    this.setup = function (self, widgetElement) {
        _self = self;

        this.assetsUrl = "https://api.gieffektivt.no/static/";
        
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
  
        var DonorPane = require('./panes/donor.js');
        this.panes[0] = new DonorPane({
            widget: _self, 
            paneElement: paneElements[0],
            hasPrevBtn: false,
            hasNextBtn: true
        });

        var AmountPane = require('./panes/amount.js');
        this.panes[1] = new AmountPane({
            widget: _self, 
            paneElement: paneElements[1],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        var DonationPane = require('./panes/donation.js');
        this.panes[2] = new DonationPane({
            widget: _self, 
            paneElement: paneElements[2],
            hasPrevBtn: true,
            hasNextBtn: true
        });

        var PaymentMethodPane = require('./panes/paymentMethod.js');
        this.panes[3] = new PaymentMethodPane({
            widget: _self, 
            paneElement: paneElements[3],
            hasPrevBtn: true,
            hasNextBtn: false
        });

        var ResultPane = require('./panes/result.js');
        this.panes[4] = new ResultPane({
            widget: _self,
            paneElement: paneElements[4],
            hasPrevBtn: false,
            hasNextBtn: false
        });

        if (this.panes.length != paneElements.length) throw new Error("Missing Javascript object for some HTML panes");


        //General setup helpers
        setupCloseBtn();
        setupSelectOnClick();
    }

    /* Setup helpers */
    function setupCloseBtn() {
        _self.closeBtn.addEventListener("click", function() {
            _self.close();
        })
    }

    this.registerDonation = function(postData, nxtBtn) {
        _self.request("donations/register", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) _self.error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) _self.error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }
            nxtBtn.classList.remove("loading");

            /* move to result pane initialization */
            /*
            var resultPane = _self.element.getElementsByClassName("result")[0];
            var KIDstring = data.content.KID.toString();
            KIDstring = KIDstring.slice(0,3) + " " + KIDstring.slice(3,5) + " " + KIDstring.slice(5);
            resultpane.pane.getElementsByClassName("KID")[0].innerHTML = KIDstring;
            resultpane.pane.getElementsByClassName("email")[0].innerHTML = _self.email;
            resultPane.pane.getElementsByClassName("amount")[0].innerHTML = _self.donationAmount + "kr";
            */
            
            _self.KID = data.content.KID;
            _self.nextSlide();
        });
    }

    /* Slider control */
    this.goToSlide = function(slidenum) {
        console.log("Going to slide number: " + slidenum);

        if (slidenum < 0 || slidenum > _self.panes.length - 1) throw Error("Slide under 0 or larger than set")

        var visiblePanesInFront = getVisiblePanesInFront(slidenum);
        //console.log("Visible in front: " + visiblePanesInFront);

        _self.slider.style.transform = "translateX(-" + (visiblePanesInFront * _self.width) + "px)";

        _self.currentSlide = slidenum;
        this.updateSliderProgress();

        var pane = _self.panes[slidenum];

        if (pane.hasButton) var padding = 90;
        else var padding = 50;

        //Height is size of the inner content of pane + padding
        var height = pane.paneElement.getElementsByClassName("inner")[0].clientHeight + padding;

        //What?
        if (slidenum == _self.panes.length-1) _self.element.style.maxHeight = "3000px";

        if (height < 300) height = 300;
        _self.element.style.height = height + "px";

        //Fix for occational render bug
        setTimeout(function() {
            _self.element.style.overflow = "hidden";
            _self.element.getElementsByClassName("inner")[0].style.position = "static";

            setTimeout(function() {
                _self.element.getElementsByClassName("inner")[0].style.position = "";
                _self.element.style.overflow = "";
            }, 5);
        }, 500);

        pane.focus();
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
        _self.panes[_self.currentSlide].getElementsByClassName("loading")[0].classList.remove("loading");

        setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        _self.errorElement.classList.remove("active");
        _self.activeError = false;
    }
    this.hideError = hideError;

    function setNoApiError() {
        var noApiErrorElement = document.getElementById("no_api_error");

        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
    }

    /* Network helpers */
    this.request = require('./helpers/network.js').request;

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
                _self.goToSlide(0);
                _self.panes[2].hide();
                document.getElementById("check-select-recommended").click();
            }
        }, 500);
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
        prevSlide: this.prevSlide,
        hideError: this.hideError,
        setup: this.setup
    }
    return properties;
} 

window.DonationWidget = DonationWidget;
