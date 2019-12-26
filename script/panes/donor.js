var emailvalidation = require('email-validation');
const Pane = require('./paneClass.js');

module.exports = class DonorPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);
     
        if (window.localStorage) {
            this.paneElement.getElementsByClassName("name")[0].value = window.localStorage.getItem("donation-name");
            this.paneElement.getElementsByClassName("email")[0].value = window.localStorage.getItem("donation-email");
        }

        this.resizableOnMobile = true;
        
        this.checkTaxDeductionElement = this.paneElement.querySelector("#check-tax-deduction");
        this.checkPrivacyPolicyElement = this.paneElement.querySelector("#check-privacy-policy");

        //Setup checkbox listener
        this.checkTaxDeductionElement.addEventListener("change", this.ssnCheckChanged.bind(this));
        this.chosenTaxDeduction = false;
    }

    submit() {
        var pane = this.paneElement;
        var widget = this.widget;
    
        var nxtBtn = pane.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");
    
        var email = pane.getElementsByClassName("email")[0].value.trim();
        var name = pane.getElementsByClassName("name")[0].value.trim();
        var ssn = pane.getElementsByClassName("ssn")[0].value.trim();
    
        //Validate input
        if (name.length < 2 || name.length > 32) { //Invalid name
            widget.error("Ikke et gyldig navn");
            return;
        } 
    
        if (!emailvalidation.valid(email)) { //Invalid email
            widget.error("Ikke en gyldig mail");
            return;
        }

        if (!this.checkPrivacyPolicyElement.checked) {
            widget.error("Du må godkjenne personværnserklæringen.");
            return;
        }
    
        widget.name = name;
        widget.email = email;
        
        if (this.chosenTaxDeduction) {
            if (ssn.length != 11 && ssn.length != 9) {
                widget.error("Oppgi 9 eller 11 siffer");
                return;
            }

            if (isNaN(ssn)) {
                widget.error("Personnummer kan bare inneholde tall");
                return;
            }

            widget.ssn = ssn;
        }
        else {
            widget.ssn = null;
        }
    
        if (window.localStorage) {
            window.localStorage.setItem("donation-name", name);
            window.localStorage.setItem("donation-email", email);
        }
    
        widget.nextSlide();
        
        setTimeout(function() {
            nxtBtn.classList.remove("loading");
        }, 200);
    }

    ssnCheckChanged(e) {
        if (e.target.checked) {
            this.paneElement.getElementsByClassName("ssn")[0].style.display = "";
            this.chosenTaxDeduction = true;
            this.resizeWidgetToFit();
        }  
        else {
            this.paneElement.getElementsByClassName("ssn")[0].style.display = "none";
            this.chosenTaxDeduction = false;
            this.resizeWidgetToFit();
        }
        
    }

    customFocus() {
        var input = this.paneElement.getElementsByClassName("name")[0];
        setTimeout(function () {
            input.focus();
        }, 200);
    }
}