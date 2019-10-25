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
        var resultPane = this.widget.panes.find(function (pane) { return pane instanceof DonationPane; })
        
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
        this.setupBankScreen();
        this.setupButtonVisibility();
    } 
    
    updatePayPalForms() {
        // Single donation
        this.payPalSingleForm = document.getElementById("payPalSingleForm");
        this.payPalSingleForm.amount.setAttribute("value", this.widget.donationAmount);
        if (this.clientWsID) this.payPalSingleForm.custom.setAttribute("value", this.widget.KID + "|" + this.clientWsID);
        // Recurring donation
        this.payPalRecurringForm = document.getElementById("payPalRecurringForm");
        this.payPalRecurringForm.a3.setAttribute("value", this.widget.donationAmount);
        if (this.clientWsID) this.payPalRecurringForm.custom.setAttribute("value", this.widget.KID + "|" + this.clientWsID);
    }

    setupWebSocket() {
        this.socket = new WebSocket("ws://api.gieffektivt.no");
        var _self = this;
        
        this.socket.addEventListener("message", (msg) => { _self.onSocketMessage(msg); });
        this.socket.addEventListener("close", () => { console.log("Socket closed"); })
        this.socket.addEventListener("open", this.keepWebsocketAlive.bind(this));
    }

    keepWebsocketAlive() { 
        var timeout = 20000;
        if (this.socket.readyState == this.socket.OPEN) {  
            this.socket.send('');  
        }  
        this.websocketTimerId = setTimeout(this.keepWebsocketAlive.bind(this), timeout);  
    }  
    cancelWebsocketKeepAlive() {  
        if (this.websocketTimerId) {  
            clearTimeout(this.websocketTimerId);  
        }  
    }
    
    setupButtons() {
        var _self = this;
        this.payPalBtn = this.paneElement.getElementsByClassName("paypal")[0];
        this.payPalBtn.addEventListener("click", () => {
            _self.payPalButtonHandler();
        });

        this.vippsBtn = this.paneElement.getElementsByClassName("vipps")[0];
        this.vippsBtn.addEventListener("click", () => {
            _self.openVippsGuide();
            //show vipps guide
        });

        this.bankBtn = this.paneElement.getElementsByClassName("bank")[0];
        this.bankBtn.addEventListener("click", () => {
            _self.bankButtonHandler();
        })
    }

    setupButtonVisibility() {
        // Skjuler Vipps-knapp om recurring donation er valgt og sørger for at den viser hvis ikke
        if (this.widget.recurring) {
            this.vippsBtn.classList.add("hidden");
        } else {
            this.vippsBtn.classList.remove("hidden");
        }
    }

    payPalButtonHandler() {
        if (this.widget.recurring) {
            document.getElementById("submitRecurringPaypal").click();
        } else {
            document.getElementById('submitSinglePaypal').click();
        }
        this.showWaitingScreen();
    }
    
    showWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "flex";
    }

    hideWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "none";
    }

    onSocketMessage(msg) {
        console.log("Socket message: ", msg);

        if (!this.clientWsID) {
            this.clientWsID = msg.data;
            this.updatePayPalForms();
        }
        else {
            if (msg.data == "PAYPAL_VERIFIED") {
                this.submit("DONATION_RECIEVED");
                this.cancelWebsocketKeepAlive();
                this.socket.close();
            }
            else if (msg.data == "PAYPAL_ERROR") {
                this.widget.error("Feil i PayPal");
                this.hideWaitingScreen();
            }
        }
    }

    bankButtonHandler() {
        const postData = {
            KID: this.widget.KID,
            sum: this.widget.donationAmount
        };
        this.widget.request("donations/bank/pending", "POST", postData, function() {});

        this.submit("BANK_PENDING");
    }

    setupBankScreen() {
        document.getElementById("bank-amount").innerHTML = this.widget.donationAmount + " kr";
        document.getElementById("bank-kid").innerHTML = this.widget.KID;
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
}