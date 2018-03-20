const DonationPane = require('./donation.js');
const Pane = require('./paneClass.js');

module.exports = class AmountPane extends Pane {
    constructor(config) {
        super(config);
        super.setCustomfocus(this);

        this.setupSelectSplitCheckbox();
    }

    submit() {
        var widget = this.widget;

        var nxtBtn = this.paneElement.getElementsByClassName("btn")[1];
        nxtBtn.classList.add("loading");
    
        widget.donationAmount = this.getDonationAmount();
    
        if (widget.donationAmount > 0) {
            if (this.submitOnNext) {
                widget.registerDonation({
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

    customFocus() {
        var input = this.paneElement.getElementsByClassName("amount")[0];
        this.widget.element.style.height = "";
    
        setTimeout(function () {
            input.focus();
        }, 200);
    }

    //Convenience functions
    getDonationAmount() {
        return parseInt(this.paneElement.getElementsByClassName("amount")[0].value);
    }

    setupSelectSplitCheckbox() {
        var widget = this.widget;
    
        var selectSplit = document.getElementById("check-select-split");
        var selectRecommended = document.getElementById("check-select-recommended");
        this.submitOnNext = true;
    
        selectSplit.addEventListener("change", function(e) {
            widget.panes.find(function (pane) { return pane instanceof DonationPane; }).show();
            this.submitOnNext = false;
            widget.updateSliderProgress();
        });
    
        selectRecommended.addEventListener("change", function(e) {
            widget.panes.find(function (pane) { return pane instanceof DonationPane; }).hide();
            this.submitOnNext = true;
            widget.updateSliderProgress();
        })
    }
} 