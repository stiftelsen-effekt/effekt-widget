var Pane = require('./paneClass.js')
var PayPalPane = require('./paypal.js')
var VippsPane = require('./vipps.js')

module.exports = class PaymentMethodPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);

        this.resizableOnMobile = true;

        this.setupButtons();
    }
    
    submit(method) {
        this.widget.setMethod(method);
        this.widget.nextSlide();
    }
    
    customFocus() {
    }

    resetPaymentPanes() {
        this.widget.getPane(VippsPane).hide();
        this.widget.getPane(PayPalPane).hide();
    }
    
    setupButtons() {
        this.payPalBtn = this.paneElement.getElementsByClassName("paypal")[0];
        this.payPalBtn.addEventListener("click", () => {
            this.resetPaymentPanes();
            this.widget.getPane(PayPalPane).show();
            this.submit("PAYPAL");
        });

        this.vippsBtn = this.paneElement.getElementsByClassName("vipps")[0];
        this.vippsBtn.addEventListener("click", () => {
            this.resetPaymentPanes();
            this.widget.getPane(VippsPane).show();
            this.submit("VIPPS");
        });

        this.bankBtn = this.paneElement.getElementsByClassName("bank")[0];
        this.bankBtn.addEventListener("click", () => {
            this.resetPaymentPanes();
            this.submit("BANK");
        })
    }
}