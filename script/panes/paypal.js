const Pane = require('./paneClass.js');

module.exports = class PaypalPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        
        this.hide();
        this.setupPayPalButton();
    }

    focus() {
        this.setupWebSocket()
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
        this.showWaitingScreen();
    }

    setupWebSocket() {
        if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
            this.socket = new WebSocket("wss://api.gieffektivt.no");
            var _self = this;
            
            this.socket.addEventListener("message", (msg) => { _self.onSocketMessage(msg); });
            this.socket.addEventListener("close", () => { console.log("Socket closed"); })
            this.socket.addEventListener("open", this.keepWebsocketAlive.bind(this));

            this.keepWebsocketAlive();
        }
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