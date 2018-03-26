var Pane = require('./paneClass.js')
var DonationPane = require('./result.js')

module.exports = class PaymentMethodPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);

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
        this.updatePayPalForm();
        this.setupWebSocket();
    } 
    
    updatePayPalForm() {
        this.payPalForm = document.getElementById("payPalForm");
        this.payPalForm.amount.setAttribute("value", this.widget.donationAmount);
    }
    
    setupWebSocket() {
        var socket = new WebSocket("ws://api.gieffektivt.no:8080");
        var _self = this;
        socket.addEventListener("message", (msg) => { _self.onSocketMessage(msg); });
    }
    
    setupButtons() {
        var _self = this;
        this.payPalBtn = this.paneElement.getElementsByClassName("paypal")[0];
        this.payPalBtn.addEventListener("click", () => {
            _self.payPalButtonClicked(); 
        });

        this.vippsBtn = this.paneElement.getElementsByClassName("vipps")[0];
        this.vippsBtn.addEventListener("click", () => {
            _self.setupVippsGuide();
            //show vipps guide
        });
    }

    payPalButtonClicked() {
        document.getElementById('submitPaypal').click();
        this.showWaitingScreen();
    }
    
    showWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "flex";
    }

    onSocketMessage(msg) {
        console.log(msg.data)
        if (!this.clientWsID) {
            this.clientWsID = msg.data;
            this.payPalForm.custom.setAttribute("value", this.widget.KID + "|" + this.clientWsID);
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
        
        //Add KID and amount to info text
        document.getElementById("vipps-donation-amount").innerHTML = this.widget.donationAmount + "kr";
        document.getElementById("vipps-donation-kid").innerHTML = this.widget.KID;

        this.paneElement.getElementsByClassName("vipps-guide")[0].classList.add("active");
        this.paneElement.getElementsByClassName("selection")[0].classList.remove("active");

        var finishedBtn = document.getElementById("vipps-finished");
        finishedBtn.addEventListener("click", function() {
            _self.submit("VIPPS_PENDING");
        });
        var cancelBtn = document.getElementById("vipps-cancel");
        cancelBtn.addEventListener("click", function() {
            _self.paneElement.getElementsByClassName("vipps-guide")[0].classList.remove("active");
            _self.paneElement.getElementsByClassName("selection")[0].classList.add("active");
            _self.resizeWidgetToFit();
        });

        this.resizeWidgetToFit();
    }
}