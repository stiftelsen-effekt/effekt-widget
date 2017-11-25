module.exports = {
  submit: submitAmount,
  focus: focusAmount
}

function submitAmount(widget, pane) {
    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    widget.donationAmount = parseInt(pane.getElementsByClassName("amount")[0].value);

    if (widget.donationAmount > 0) {
        if (widget.submitOnAmount) {
            widget.panes[2].style.display = "none";
            postDonation({
                KID: widget.KID,
                amount: widget.donationAmount
            }, nxtBtn);
        } else {
            widget.nextSlide();

            setTimeout(function() {
                nxtBtn.classList.remove("loading");
            }, 200);
        }
    }
    else {
        error("Du må angi en sum");
        nxtBtn.classList.remove("loading");
    }
}

function focusAmount(widget, pane) {
    var input = pane.getElementsByClassName("amount")[0];

    widget.element.style.height = "";

    setTimeout(function () {
        input.focus();
    }, 200);
}
