var Pane = require('./paneClass.js')
var DonationPane = require('./result.js')

module.exports = class PaymentMethodPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);

        this.resizableOnMobile = true;

        this.setupButtons();
    }

    submit(state) {
        var resultPane = widget.panes.find(function (pane) { return pane instanceof DonationPane; })
        
        if (state == "DONATION_RECIEVED") {
            resultPane.setResultState("DONATION_RECIEVED");
        } else if (state == "BANK_PENDING") {
            resultPane.setResultState("BANK_PENDING");
        } else if (state == "VIPPS_PENDING") {
            resultPane.setResultState("VIPPS_PENDING");
        }

        this.widget.nextSlide();
    }
    
    customFocus() {
        this.updatePayPalForms();
        this.setupWebSocket();
        this.setupVippsGuide();
    } 
    
    updatePayPalForms() {
        // Single donation
        this.payPalSingleForm = document.getElementById("payPalSingleForm");
        this.payPalSingleForm.amount.setAttribute("value", this.widget.donationAmount);
        // Recurring donation
        this.payPalRecurringForm = document.getElementById("payPalRecurringForm");
        this.payPalRecurringForm.a3.setAttribute("value", this.widget.donationAmount);
    }
    
    setupWebSocket() {
        var socket = new WebSocket("wss://api.gieffektivt.no:443");
        var _self = this;
        socket.addEventListener("message", (msg) => { _self.onSocketMessage(msg); });
    }
    
    setupButtons() {
        var _self = this;
        this.payPalBtn = this.paneElement.getElementsByClassName("paypal")[0];
        this.payPalBtn.addEventListener("click", () => {
            _self.showPayPalDetails();
        });

        this.payPalSingleBtn = document.getElementById("paypalSingleBtn");
        this.payPalSingleBtn.addEventListener("click", () => {
            _self.payPalSingleButtonClicked();
        });

        this.payPalRecurringBtn = document.getElementById("paypalRecurringBtn");
        this.payPalRecurringBtn.addEventListener("click", () => {
            _self.payPalRecurringButtonClicked();
        });

        // Hides paypal-details element on click outside of buttons
        this.paneElement.addEventListener("click", event => {
            let classes = event.target.classList;
            if (!(classes.contains("paypal-single") || classes.contains("paypal-recurring") || classes.contains("paypal"))) {
                this.hidePayPalDetails();
            }
        });

        this.vippsBtn = this.paneElement.getElementsByClassName("vipps")[0];
        this.vippsBtn.addEventListener("click", () => {
            _self.openVippsGuide();
            //show vipps guide
        });
    }

    payPalSingleButtonClicked() {
        document.getElementById('submitSinglePaypal').click();
        this.showWaitingScreen();
    }

    payPalRecurringButtonClicked() {
        document.getElementById('submitRecurringPaypal').click();
        this.showWaitingScreen();
    }
    
    showWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "flex";
    }

    onSocketMessage(msg) {
        console.log(msg.data)
        if (!this.clientWsID) {
            this.clientWsID = msg.data;
            this.payPalSingleForm.custom.setAttribute("value", this.widget.KID + "|" + this.clientWsID);
            this.payPalRecurringForm.custom.setAttribute("value", this.widget.KID + "|" + this.clientWsID);
        } 
        else {
            if (msg.data == "PAYPAL_VERIFIED") {
                this.submit("DONATION_RECIEVED");
            }
            else if (msg.data == "PAYPAL_ERROR") {
                this.widget.error("Feil i PayPal");
            }
        }
    }

    setupVippsGuide() {
        var _self = this;

        var finishedBtn = document.getElementById("vipps-finished");
        finishedBtn.addEventListener("click", function() {
            _self.submit("VIPPS_PENDING");
        });
        var cancelBtn = document.getElementById("vipps-cancel");
        cancelBtn.addEventListener("click", function() {
            _self.paneElement.getElementsByClassName("vipps-guide")[0].classList.remove("active");
            _self.paneElement.getElementsByClassName("selection")[0].classList.add("active");
            _self.hasButton = true;
            _self.resizeWidgetToFit();
        });

        let vippsGuide = _self.paneElement.getElementsByClassName("vipps-guide")[0];
        let helperImages = vippsGuide.getElementsByClassName("helper-images")[0];
        //Setup helper buttons
        var explanatoryButtons = this.paneElement.getElementsByClassName("explanatory-image");
        for (var i = 0; i < explanatoryButtons.length; i++) {
            explanatoryButtons[i].addEventListener("click", function(e) {
                let index = parseInt(this.getAttribute("data-index"));
                let helperImage = helperImages.getElementsByClassName("explanation-image")[index];
                _self.widget.closeBtn.style.display = "none";

                helperImages.style.display = "block";
                helperImage.style.display = "block";
            });
        }

        let explanationImages = helperImages.getElementsByClassName("explanation-image");

        var closeButton = helperImages.getElementsByClassName("close-btn")[0];
        closeButton.addEventListener("click", function() {
            let explanationImages = helperImages.getElementsByClassName("explanation-image");

            for (var i = 0; i < explanationImages.length; i++) {
                explanationImages[i].style.display = "none";
            }

            helperImages.style.display = "none";
            _self.widget.closeBtn.style.display = "block";
        });
    }

    openVippsGuide() {
        this.hasButton = false;
        let vippsGuide = this.paneElement.getElementsByClassName("vipps-guide")[0];
        vippsGuide.classList.add("active");
        this.paneElement.getElementsByClassName("selection")[0].classList.remove("active");

        //Hide explanation images
        let helperImages = vippsGuide.getElementsByClassName("helper-images")[0];
        let explanationImages = helperImages.getElementsByClassName("explanation-image");
        for (var i = 0; i < explanationImages.length; i++) {
            explanationImages[i].style.display = "none";
        }
        helperImages.style.display = "none";

        //Add KID and amount to info text
        document.getElementById("vipps-donation-amount").innerHTML = this.widget.donationAmount + " kr";
        document.getElementById("vipps-donation-kid").innerHTML = this.widget.KID;

        var _self = this;
        _self.resizeWidgetToFit();
    }

    showPayPalDetails() {
        var _self = this;
        let paypalBtn = _self.paneElement.getElementsByClassName("paypal")[0];
        let vippsBtn = _self.paneElement.getElementsByClassName("vipps")[0];
        let detailsElement = document.getElementById("paypal-details");

        paypalBtn.classList.add("hidden");
        vippsBtn.classList.add("hidden");
        detailsElement.classList.add("visible");

        _self.resizeWidgetToFit();
    }

    hidePayPalDetails() {
        var _self = this;
        let paypalBtn = _self.paneElement.getElementsByClassName("paypal")[0];
        let vippsBtn = _self.paneElement.getElementsByClassName("vipps")[0];
        let detailsElement = document.getElementById("paypal-details");

        paypalBtn.classList.remove("hidden");
        vippsBtn.classList.remove("hidden");
        detailsElement.classList.remove("visible");

        _self.resizeWidgetToFit();
    }
}