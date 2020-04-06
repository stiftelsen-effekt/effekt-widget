const Pane = require('./paneClass.js');

module.exports = class ReferralPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        this.setupReferralList();

        this.referralID = null;
        this.otherComment = null;
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

            if (referralType.name === "Annet") {
                li.addEventListener("click", function() {
                    _self.referralID = referralType.ID;
                    _self.handleOtherOption(listElement);
                });
            }
            else {
                li.addEventListener("click", function() {
                    _self.referralID = referralType.ID;
                    _self.submit();
                });
            }
            
            listElement.appendChild(li);
        }
    }

    handleOtherOption(listElement) {
        var _self = this;
        listElement.classList.add("hidden");
        let inputElement = document.getElementById("other-referral-freetext");
        inputElement.classList.remove("hidden");
        inputElement.addEventListener("change", function(event) {
            _self.otherComment = event.target.value;
        })
    }

    focus() {

    }

    submit() {
        var _self = this;

        if (_self.referralID !== null) {
            //User pressed an option
            var postData = {
                referralTypeID: _self.referralID,
                donorID: _self.widget.donorID,
                otherComment: _self.otherComment
            };
    
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