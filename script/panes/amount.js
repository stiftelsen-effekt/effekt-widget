module.exports = function(widget, pane) { 
    this.widget = widget;
    this.pane = pane;

    setupSelectSplitCheckbox();

    pane.dispatchEvent(new CustomEvent('ready', pane));

    return {
        submit: submitAmount,
        focus: focusAmount,
        widget: widget,
        pane: pane
    } 
}

function submitAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    widget.donationAmount = parseInt(pane.getElementsByClassName("amount")[0].value);

    if (widget.donationAmount > 0) {
        if (widget.submitOnAmount) {
            widget.panes[2].classList.add("hidden");
            widget.postDonation({
                donor: {
                    name: widget.name,
                    email: widget.email
                },
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
        widget.error("Du må angi en sum");
        nxtBtn.classList.remove("loading");
    }
}

function focusAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var input = pane.getElementsByClassName("amount")[0];

    widget.element.style.height = "";

    setTimeout(function () {
        input.focus();
    }, 200);
}

/* Setup select split checkbox */
function setupSelectSplitCheckbox() {
    var widget = this.widget;

    var selectSplit = document.getElementById("check-select-split");
    var selectRecommended = document.getElementById("check-select-recommended");

    selectSplit.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.remove("hidden");
        widget.submitOnAmount = false;
        widget.activePanes++;
        widget.updateSliderProgress();
    });

    selectRecommended.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.add("hidden");
        widget.submitOnAmount = true;
        widget.activePanes--;
        widget.updateSliderProgress();
    })
}