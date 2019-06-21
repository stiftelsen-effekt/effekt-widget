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
        widget.recurring = this.getRecurringBoolean();

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
    
        setTimeout(function () {
            input.focus();
        }, 200);
    }

    //Convenience functions
    getDonationAmount() {
        return parseInt(this.paneElement.getElementsByClassName("amount")[0].value);
    }

    getRecurringBoolean() {
        return document.getElementById("check-select-recurring").checked;
    }

    setupSelectSplitCheckbox() {
        var widget = this.widget;
    
        var selectSplit = document.getElementById("check-select-split");
        var selectRecommended = document.getElementById("check-select-recommended");
        this.submitOnNext = true;

        var _this = this;
    
        selectSplit.addEventListener("change", function(e) {
            widget.panes.find(function (pane) { return pane instanceof DonationPane; }).show();
            _this.submitOnNext = false;
            widget.updateSliderProgress();
        });
    
        selectRecommended.addEventListener("change", function(e) {
            widget.panes.find(function (pane) { return pane instanceof DonationPane; }).hide();
            _this.submitOnNext = true;
            widget.updateSliderProgress();
        })
    }
} 