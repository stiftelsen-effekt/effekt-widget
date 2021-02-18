var Pane = require('./paneClass.js') 

module.exports = class ResultPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;

        super.setCustomfocus(this);
    }

    submit() {
        //Should never be called
        throw new Error("Cannot submit the final pane");
    }
    
    customFocus() {
        if (this.widget.method === "BANK") {
            this.setResultState("BANK_PENDING");
            this.setupBankFields();
        }
        else if (this.widget.method === "VIPPS") {
            this.setResultState("VIPPS_PENDING");
        }
        else if (this.widget.method === "PAYPAL") {
            this.setResultState("DONATION_RECIEVED");
        } 
        else {
            this.widget.error("Donasjonskanal " + this.widget.method + " ikke støttet");
        }

        this.hideDefaultEmailFromUI();
    }

    hideDefaultEmailFromUI(){
        var elems = document.getElementsByClassName('emailSentMessage');

        for(var i = 0; i != elems.length; ++i)
        {
            if (this.widget.email  === "anon@gieffektivt.no") {
                elems[i].style.visibility = "hidden";
            }
        }
    }

    setupBankFields() {
        document.getElementById("bank-kid").innerHTML = this.widget.KID.toString().replace(/\s/g, '');
    }
    
    setResultState(state) {
        var emailFields = this.paneElement.getElementsByClassName("email")
        for (var i = 0; i < emailFields.length; i++) {
            emailFields[i].innerHTML = this.widget.email;
        }

        if (state == "DONATION_RECIEVED") {
            this.paneElement.setAttribute("class", "pane result confirmed");
        } else if (state == "VIPPS_PENDING") {
            this.paneElement.setAttribute("class", "pane result vipps");
        } else if (state == "BANK_PENDING") {
            this.paneElement.setAttribute("class", "pane result bank");
        }
    }
}