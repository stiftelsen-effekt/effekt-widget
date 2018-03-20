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
    }

    submit() {
        var pane = this.paneElement;
        var widget = this.widget;
    
        var nxtBtn = pane.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");
    
        var email = pane.getElementsByClassName("email")[0].value.trim();
        var name = pane.getElementsByClassName("name")[0].value.trim();
    
        //Validate input
        if (name.length < 2 || name.length > 32) { //Invalid name
            widget.error("Ikke et gyldig navn");
            return;
        } 
    
        if (!emailvalidation.valid(email)) { //Invalid email
            widget.error("Ikke en gyldig mail");
            return;
        }
    
        widget.name = name;
        widget.email = email;
    
        if (window.localStorage) {
            window.localStorage.setItem("donation-name", name);
            window.localStorage.setItem("donation-email", email);
        }
    
        widget.nextSlide();
        
        setTimeout(function() {
            nxtBtn.classList.remove("loading");
        }, 200);
    }

    customFocus() {
        console.log("User focus");

        var input = this.paneElement.getElementsByClassName("name")[0];
        setTimeout(function () {
            input.focus();
        }, 200);
    }
}