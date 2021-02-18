const Pane = require('./paneClass.js');

module.exports = class PaypalPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        
        this.hide();
        this.setupPayPalButton();
    }

    focus() {
        this.updatePayPalForms()
    }

    setupPayPalButton() {
        document.getElementById("widget-paypal-button").addEventListener("click", () => this.payPalButtonHandler());
    }

    payPalButtonHandler() {
        if (this.widget.recurring) {
            document.getElementById("submitRecurringPaypal").click();
        } else {
            document.getElementById('submitSinglePaypal').click();
        }
        this.widget.nextSlide();
    }

    updatePayPalForms() {
        // Single donation
        this.payPalSingleForm = document.getElementById("payPalSingleForm");
        this.payPalSingleForm.amount.setAttribute("value", this.widget.donationAmount);
        this.payPalSingleForm.custom.setAttribute("value", this.widget.KID + "|undefined");
        // Recurring donation
        this.payPalRecurringForm = document.getElementById("payPalRecurringForm");
        this.payPalRecurringForm.a3.setAttribute("value", this.widget.donationAmount);
        this.payPalRecurringForm.custom.setAttribute("value", this.widget.KID + "|undefined");
    }

    showWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "flex";
    }
    
    hideWaitingScreen() {
        this.paneElement.getElementsByClassName("awaiting-confirmation")[0].style.display = "none";
    }

    submit(state) {
        //Goto result for paypal
        this.widget.nextSlide();
    }
} 