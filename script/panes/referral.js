const Pane = require('./paneClass.js');

module.exports = class AmountPane extends Pane {
    constructor(config) {
        super(config);

        this.setupReferralList();
    }

    setupReferralList() {
        var _self = this;
        var listElement = document.getElementById("referral-list");;
        this.widget.request("referrals/types", "GET", null, function(err, data) {
            //TODO: Handle error
            _self.buildReferralList(data.content, listElement);
        });
    }

    buildReferralList(referralTypes, listElement) {
        var _self = this;
        for (let i = 0; i < referralTypes.length; i++) {
            let referralType = referralTypes[i];
            let li = document.createElement("li");
            li.innerHTML = referralType.name;
            li.addEventListener("click", function() {
                _self.submit(referralType.ID);
            });
            listElement.appendChild(li);
        }
    }

    focus() {

    }

    submit(referralID) {
        var _self = this;

        if (typeof referralID !== "undefined") {
            //User pressed an option
            var postData = {
                referralTypeID: referralID,
                donorID: _self.widget.donorID
            }
    
            this.widget.request("referrals/", "POST", postData, function (err, data) {
                _self.hide();
                _self.widget.nextSlide();
            })
        }
        else {
            //User did not select a referral option
            _self.widget.nextSlide();
        }
    }
} 