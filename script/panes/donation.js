var Pane = require('./paneClass.js')
var rounding = require('../lib/rounding.js'); 

module.exports = class DonationPane extends Pane {
    constructor(config) {
        super(config);

        this.setupDonationList(this.widget, this.paneElement);
        this.setupModeButton();

        super.setCustomfocus(this);
    }

    submit() {
        var widget = this.widget;
        var pane = this.paneElement;
    
        if (this.sharesType == "decimal") {
            var percentSplit = rounding.toPercent(widget.organizations.map(function(org) { return org.setValue; }), widget.donationAmount, 12);
    
            var donationSplit = widget.organizations.map(function(org, i) {
                if (org.setValue != "0") {
                    return {
                        id: org.id,
                        split: percentSplit[i]
                    } 
                } else {
                    return false;
                }
            }).filter(function(item) { return item })
        } 
        else {
            var donationSplit = widget.organizations.map(function(org) {
                if (org.setValue != "0") {
                    return {
                        id: org.id,
                        split: org.setValue
                    }
                } else {
                    return false;
                }
            }).filter(function(item) { return item })
        }
        
        console.log("Split: "+ rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})))
        if (rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})) === '100') {
            var nxtBtn = pane.getElementsByClassName("btn")[1];
            nxtBtn.classList.add("loading"); 
    
            widget.registerDonation({
                donor: {
                    name: widget.name,
                    email: widget.email
                },
                amount: widget.donationAmount,
                organizations: donationSplit
            }, nxtBtn);
        }
        else {
            var nxtBtn = pane.getElementsByClassName("btn")[1];
            nxtBtn.classList.add("loading");
            widget.error("Du må fordele alle midlene");
        }
    }

    customFocus() {
        var widget = this.widget;
        var paneElement = this.paneElement;

        this.setSplitValues();

        setTimeout(function() {
            paneElement.getElementsByTagName("input")[0].focus();
        }, 200);
    }

    setDonationSplitValidAmount() {
        this.splitSharesTotal.classList.add("total-hidden");
        this.paneElement.getElementsByClassName("btn")[1].classList.remove("inactive");
    }
    
    setDonationSplitInvalidAmount() {
        this.splitSharesTotal.classList.remove("total-hidden");
        this.paneElement.getElementsByClassName("btn")[1].classList.add("inactive");
    }

    setSplitValues() {
        var widget = this.widget;

        if (this.sharesType == "decimal") {
            var absoluteSplit = rounding.toAbsolute(
                widget.donationAmount,
                widget.organizations.map(function (org) {return org.standardShare})                
            );
        
            for (var i = 0; i < widget.organizations.length; i++) {
                var org = widget.organizations[i];
                
                org.setValue = absoluteSplit[i];
        
                org.inputElement.value = org.setValue;
            }
        } else {
        
            for (var i = 0; i < widget.organizations.length; i++) {
                var org = widget.organizations[i];
                
                org.setValue = org.standardShare;
        
                org.inputElement.value = org.setValue;
            }
        }
    
        this.updateTotalShares();
    }

    updateTotalShares() {
        var widget = this.widget;
    
        var total = rounding.sumWithPrecision(widget.organizations.map(function(org) {return org.setValue}));
        if (!isNaN(total)) {
            if (this.sharesType == "decimal") {
                if (total == widget.donationAmount) this.setDonationSplitValidAmount();
                else {
                    this.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av " + widget.donationAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "kr";
                    this.setDonationSplitInvalidAmount();
                }
            } else if (this.sharesType == "percentage") {
                if (total == 100) this.setDonationSplitValidAmount();
                else {
                    this.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av 100%"; 
                    this.setDonationSplitInvalidAmount();
                }
            }
        }
    }

    setupDonationList(widget, pane) {
        var _self = this;
        setTimeout(function() {
            widget.request("organizations/active", "GET", { }, function(err, data) {
                if (err == 0) {
                    _self.widget.setNoApiError();
                } else {
                    widget.organizations = data.content;
    
                    var list = pane.getElementsByClassName("organizations")[0];
                    var leftover = 0;
    
                    _self.splitSharesTotal = pane.getElementsByClassName("total")[0];
    
                    for (var i = 0; i < widget.organizations.length; i++) {
                        var org = widget.organizations[i];
                        org.element = _self.createListItem(org);
    
                        list.appendChild(org.element);
                    }
                }
            });
        }, 10)
    }

    /*
    Helper functions building HTML elements for organization list
    */

    createListItem(org) {
        var _self = this;

        var li = document.createElement("li");
    
        var span = document.createElement("span");
        span.innerHTML = org.name;
    
        li.appendChild(span);
    
        var info = document.createElement("div");
        info.classList.add("info");
        info.onclick = function() { window.open(org.infoUrl, "_blank"); }
    
        li.appendChild(info);
    
        var inputWrapper = document.createElement("div");
        inputWrapper.classList.add("input-wrapper");
    
        li.appendChild(inputWrapper);
    
        var input = document.createElement("input");
        input.setAttribute("type", "tel");
        input.setAttribute("inputmode", "numeric");
        input.setAttribute("nocomma", "true");
    
        org.inputElement = input;
    
        input.addEventListener("keyup", function(e) {
            var val;
            if (this.value.length > 0) val = this.value;
            else val = "0";
    
            org.setValue = val;
            _self.updateTotalShares();
        });
    
        input.addEventListener("focus", function(e) {
            if (e.target.value == "0") e.target.value = "";
        })
    
        input.addEventListener("blur", function(e) {
            if (e.target.value.length == 0) e.target.value = "0";
        })
    
        inputWrapper.appendChild(input);
    
        return li;
    }
    
    createInfoListItem(org) {
        var li = document.createElement("li");
    
        var header = document.createElement("div");
        header.classList.add("header");
    
        header.style.backgroundImage = org.headerImage;
    
        var headerText = document.createElement("h3");
        headerText.innerHTML = org.name;
    
        header.appendChild(headerText);
    
        li.appendChild(header);
    
        var content = document.createElement("div");
        content.classList.add("content");
    
        var contentParagraph = document.createElement("p");
        contentParagraph.innerHTML = org.longDesc;
    
        content.appendChild(contentParagraph);
    
        return li;
    }

    /*
    Switching between % and absolute values
    */
    setupModeButton() {
        console.log("Setup mode btn")
        var widget = this.widget;
        var pane = this.paneElement;

        var btn = pane.getElementsByClassName("mode-switch")[0];
        console.log(btn);
        var organizationList = pane.getElementsByClassName("organizations")[0];

        this.sharesType = "decimal";
        var hasSwitched = false;

        var _self = this;
        btn.addEventListener("click", function(e) {
            if (_self.hasSwitched) {
                btn.classList.remove("switched");
                _self.sharesType = "decimal";
                organizationList.classList.remove("percentage-mode");
                _self.organizationValuesToAmount();
                _self.hasSwitched = false;
            } else {
                btn.classList.add("switched");
                _self.sharesType = "percentage";
                organizationList.classList.add("percentage-mode");
                _self.organizationValuesToPercent();
                _self.hasSwitched = true;
            }
        });
    }

    organizationValuesToPercent() {
        var widget = this.widget;

        var input = widget.organizations.map(function(org) {return org.setValue} );
        var converted = rounding.toPercent(input, widget.donationAmount, 2);
        for (var i = 0; i < widget.organizations.length; i++) {
            var org = widget.organizations[i];

            org.setValue = converted[i];
            org.inputElement.value = org.setValue;
            org.inputElement.setAttribute("nocomma",  "false");
        }
        this.updateTotalShares(); 
    }

    organizationValuesToAmount() {
        var widget = this.widget;

        var input = widget.organizations.map(function(org) {return org.setValue});
        var converted = rounding.toAbsolute(widget.donationAmount, input);
        for (var i = 0; i < widget.organizations.length; i++) {
            var org = widget.organizations[i];

            org.setValue = converted[i];
            org.inputElement.value = org.setValue;
            org.inputElement.setAttribute("nocomma",  "true");
        }
        this.updateTotalShares();
    }
}

/*
module.exports = function(widget, pane) {
    this.pane = pane;
    this.widget = widget;

    setup(pane);

    return {
        submit: submitDonation,
        focus: focusDonation,
        widget: widget,
        pane: pane
    }
}
function focusDonation() {
    var widget = this.widget;
    var pane = this.pane;

    var organizations = pane.getElementsByClassName("organizations")[0];

    setSplitValues();

    setTimeout(function() {
        pane.getElementsByTagName("input")[0].focus();
    }, 200);
}

*/
