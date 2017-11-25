module.exports = {
  submit: submitDonation,
  focus: focusDonation
}

function submitDonation(widget, pane) {
    var donationSplit = widget.organizations.map(function(org) {
        return {
            id: org.id,
            split: (widget.sharesType == "decimal" ? (org.setValue / widget.donationAmount) * 100 : org.setValue)
        }
    })

    console.log(rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})));
    if (rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})) === '100') {
        var nxtBtn = pane.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        postDonation({
            KID: widget.KID,
            amount: widget.donationAmount,
            organizations: donationSplit
        }, nxtBtn);
    }
    else {
        error("Du må fordele alle midlene");
    }
}

function focusDonation(widget, pane) {
    var organizations = pane.getElementsByClassName("organizations")[0];
    var pane = pane;

    widget.setSplitValues();

    setTimeout(function() {
        pane.getElementsByTagName("input")[0].focus();
    }, 200);
}
