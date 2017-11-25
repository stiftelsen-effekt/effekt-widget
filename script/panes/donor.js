module.exports = {
  submit: submitUser,
  focus: focusUser
}

function submitUser(widget, pane) {
    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    var email = pane.getElementsByClassName("email")[0].value;
    var name = pane.getElementsByClassName("name")[0].value;

    widget.request("users", "POST", {email: email, name: name}, function(err, data) {
        if (err == 0 || err) {
            if (err == 0) error("Når ikke server. Forsøk igjen senere.");
            else if (err == "Malformed request") error("Ikke en gyldig email");
 
            nxtBtn.classList.remove("loading");
            return;
        }

        if (widget.localStorage) {
            console.log("set")
            widget.localStorage.setItem("donation-name", name);
            widget.localStorage.setItem("donation-email", email);
        }

        widget.email = email;
        widget.KID = data.content.KID;
        widget.nextSlide();

        setTimeout(function() {
            nxtBtn.classList.remove("loading");
        }, 200);
    });
}

function focusUser(widget, pane) {
    var input = pane.getElementsByClassName("name")[0];
    setTimeout(function () {
        input.focus();
    }, 200);
}
