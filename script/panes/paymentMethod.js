var Pane = require('./paneClass.js')
var PayPalPane = require('./payPal.js')
var VippsPane = require('./vipps.js')

module.exports = class PaymentMethodPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);

        this.resizableOnMobile = true;

        this.setupButtons();
    }

    submit() {
        
    }
    
    customFocus() {
        //this.updatePayPalForms();
        //this.setupWebSocket();
        //this.setupVippsGuide();
        //this.setupBankScreen();
        //this.setupButtonVisibility();
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
    
    setupButtons() {
        var _self = this;
        this.payPalBtn = this.paneElement.getElementsByClassName("paypal")[0];
        this.payPalBtn.addEventListener("click", () => {
            this.setMethod("PAYPAL");
            this.showPane(PayPalPane);
            this.widget.nextSlide();
        });

        this.vippsBtn = this.paneElement.getElementsByClassName("vipps")[0];
        this.vippsBtn.addEventListener("click", () => {
            this.setMethod("VIPPS");
            this.showPane(VippsPane);
            this.widget.nextSlide();
        });

        this.bankBtn = this.paneElement.getElementsByClassName("bank")[0];
        this.bankBtn.addEventListener("click", () => {
            this.setMethod("BANK");
            this.widget.nextSlide();
        })
    }

    setMethod(method) {
        this.widget.method = method;
    }

    showPane(PaneType) {
        var paypalPane = this.widget.panes.find(function (pane) { return pane instanceof PaneType; });
        paypalPane.show();
    }
}