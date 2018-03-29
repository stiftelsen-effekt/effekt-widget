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
        console.log("Result focus");
    }
    
    setResultState(state) {
        var emailFields = this.paneElement.getElementsByClassName("email")
        for (var i = 0; i < emailFields.length; i++) {
            emailFields[i].innerHTML = this.widget.email;
        }

        if (state == "DONATION_RECIEVED") {
            this.paneElement.classList.add("confirmed");
        } else if (state == "VIPPS_PENDING") {
            this.paneElement.classList.add("vipps");
        } else if (state == "BANK_PENDING") {
            this.paneElement.classList.add("bank");

            this.paneElement.classList.add
        }
    }
}