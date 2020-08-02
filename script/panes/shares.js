var Pane = require('./paneClass.js')
var rounding = require('../lib/rounding.js'); 

module.exports = class SharesPane extends Pane {
    constructor(config) {
        super(config);

        this.setupDonationList(this.widget, this.paneElement);
        super.setCustomfocus(this);
    }

    submit() {
        var widget = this.widget;
        var pane = this.paneElement;

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
        
        if (rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})) === '100') {
            var nxtBtn = pane.getElementsByClassName("btn")[1];
            nxtBtn.classList.add("loading"); 

            widget.donationSplit = donationSplit;
    
            widget.registerDonation(nxtBtn);
        }
        else {
            var nxtBtn = pane.getElementsByClassName("btn")[1];
            nxtBtn.classList.add("loading");
            widget.error("Du må fordele alle midlene");
        }
    }

    customFocus() {
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

        for (var i = 0; i < widget.organizations.length; i++) {
            var org = widget.organizations[i];
            
            org.setValue = org.standardShare;
    
            org.inputElement.value = org.setValue;
        }
    
        this.updateTotalShares();
    }

    updateTotalShares() {
        var widget = this.widget;
    
        var total = rounding.sumWithPrecision(widget.organizations.map(function(org) {return org.setValue}));
        if (!isNaN(total)) {
            if (total == 100) this.setDonationSplitValidAmount();
            else {
                this.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString() + " av 100%"; 
                this.setDonationSplitInvalidAmount();
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
        span.classList.add("orgName")
        span.innerHTML = org.name;
    
        li.appendChild(span);

        let hoverField = document.createElement("div");
        hoverField.classList.add("hover-field")

        let tooltip = document.createElement("span")
        tooltip.classList.add("tooltip")
        tooltip.innerText = org.shortDesc
        hoverField.appendChild(tooltip)

        let info = document.createElement("div");
        info.classList.add("info-icon")
        let isMobile = window.matchMedia('(max-width: 640px)').matches;
        if (!isMobile) {
            info.onclick = function() { window.open(org.infoUrl, "_blank"); }
        }
        hoverField.appendChild(info);
        li.appendChild(hoverField)
    
        var inputWrapper = document.createElement("div");
        inputWrapper.classList.add("input-wrapper");
    
        li.appendChild(inputWrapper);
    
        var input = document.createElement("input");
        input.setAttribute("type", "tel");
        input.setAttribute("inputmode", "numeric");
        input.setAttribute("nocomma", "true");
        input.setAttribute("data-cy", org.abbriv + "-share")
    
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
}