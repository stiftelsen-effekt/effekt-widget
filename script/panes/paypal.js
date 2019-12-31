const Pane = require('./paneClass.js');

module.exports = class PaypalPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        
        this.hide();
    }

    focus() {
        //WS
    }

    submit() {
        //Goto result for paypal
    }
} 