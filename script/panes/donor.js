var emailvalidation = require('email-validation');

module.exports = function(widget, pane) {
    this.widget = widget;
    this.pane = pane;

    if (window.localStorage) {
        pane.getElementsByClassName("name")[0].value = window.localStorage.getItem("donation-name");
        pane.getElementsByClassName("email")[0].value = window.localStorage.getItem("donation-email");
    }

    return {
        submit: submitUser,
        focus: focusUser,
        pane: pane,
        widget: widget
    }
}

function submitUser() {
    console.log(this)

    var pane = this.pane;
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
        console.log(widget)

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

function focusUser() {
    console.log(this);

    var input = this.pane.getElementsByClassName("name")[0];
    setTimeout(function () {
        input.focus();
    }, 200);
}
