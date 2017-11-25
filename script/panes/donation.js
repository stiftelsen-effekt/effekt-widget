var rounding = require('../lib/rounding.js'); 

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

function submitDonation() {
    var widget = this.widget;
    var pane = this.pane;

    var donationSplit = widget.organizations.map(function(org) {
        return {
            id: org.id,
            split: (widget.sharesType == "decimal" ? (org.setValue / widget.donationAmount) * 100 : org.setValue)
        }
    })

    if (rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})) === '100') {
        var nxtBtn = pane.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        widget.postDonation({
            donor: {
                name: widget.name,
                email: widget.email
            },
            amount: widget.donationAmount,
            organizations: donationSplit
        }, nxtBtn);
    }
    else {
        widget.error("Du må fordele alle midlene");
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

/* Setup donation split pane */
function setup(pane) {
    setupModeButton(pane);
    setupDonationList(pane);
}

function setupDonationList(pane) {
    var widget = this.widget;

    setTimeout(function() {
        widget.request("organizations/active", "GET", { }, function(err, data) {
            if (err == 0) {
                setNoApiError();
            } else {
                widget.organizations = data.content;

                var list = pane.getElementsByClassName("organizations")[0];
                var leftover = 0;

                widget.splitSharesTotal = pane.getElementsByClassName("total")[0];

                for (var i = 0; i < widget.organizations.length; i++) {
                    var org = widget.organizations[i];
                    org.element = createListItem(org);

                    list.appendChild(org.element);
                }

                function createListItem(org) {
                    console.log(org);

                    var li = document.createElement("li");
                    //li.setAttribute("data-id", org._id);

                    var span = document.createElement("span");
                    span.innerHTML = org.name;

                    li.appendChild(span);

                    var info = document.createElement("div");
                    info.classList.add("info");
                    console.log(org.infoUrl)
                    info.onclick = function() { console.log(org.infoUrl); window.open(org.infoUrl, "_blank"); }

                    li.appendChild(info);

                    var inputWrapper = document.createElement("div");
                    inputWrapper.classList.add("input-wrapper");

                    li.appendChild(inputWrapper);

                    var input = document.createElement("input");
                    input.setAttribute("type", "number");
                    input.setAttribute("step", "10");
                    input.setAttribute("min", "0");

                    org.inputElement = input;

                    input.addEventListener("input", function(e) {
                        var val;
                        if (this.value.length > 0) val = this.value;
                        else val = "0";

                        org.setValue = val;
                        updateTotalShares();
                    });

                    inputWrapper.appendChild(input);

                    return li;
                }

                function createInfoListItem(org) {
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
        });
    }, 10)
}

function setSplitValues() {
    var widget = this.widget;

    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        if (typeof org.setValue === "undefined") {
            org.setValue = Math.round(widget.donationAmount * (org.standardShare / 100));
        }

        org.inputElement.value = org.setValue;
    }

    updateTotalShares();
}

function organizationValuesToPercent() {
    var widget = this.widget;

    var input = widget.organizations.map(function(org) {return org.setValue} );
    var converted = rounding.toPercent(input, widget.donationAmount, 2);
    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        org.setValue = converted[i];
        org.inputElement.value = org.setValue;
    }
    updateTotalShares();
}

function organizationValuesToAmount() {
    var widget = this.widget;

    var input = widget.organizations.map(function(org) {return org.setValue});
    var converted = rounding.toAbsolute(widget.donationAmount, input);
    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        org.setValue = converted[i];
        org.inputElement.value = org.setValue;
    }
    updateTotalShares();
}

function updateTotalShares() {
    var widget = this.widget;

    var total = rounding.sumWithPrecision(widget.organizations.map(function(org) {return org.setValue}));
    if (!isNaN(total)) {
        if (widget.sharesType == "decimal") {
            if (total == widget.donationAmount) setDonationSplitValidAmount();
            else {
                widget.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av " + widget.donationAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "kr";
                setDonationSplitInvalidAmount();
            }
        } else if (widget.sharesType == "percentage") {
            if (total == 100) setDonationSplitValidAmount();
            else {
                widget.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av 100%"; 
                setDonationSplitInvalidAmount();
            }
        }
    }
}

function setDonationSplitValidAmount() {
    var widget = this.widget;

    widget.splitSharesTotal.classList.add("total-hidden");
    //Hardcoded slide 2, update later
    widget.panes[2].getElementsByClassName("btn")[0].classList.remove("inactive");
}

function setDonationSplitInvalidAmount() {
    var widget = this.widget;

    widget.splitSharesTotal.classList.remove("total-hidden");
    //Hardcoded slide 2, update later
    widget.panes[2].getElementsByClassName("btn")[0].classList.add("inactive");
}

function setupModeButton(pane) {
    var widget = this.widget;

    var btn = pane.getElementsByClassName("mode-switch")[0];
    var organizationList = pane.getElementsByClassName("organizations")[0];

    widget.sharesType = "decimal";
    var hasSwitched = false;
    btn.addEventListener("click", function(e) {
        if (hasSwitched) {
            btn.classList.remove("switched");
            widget.sharesType = "decimal";
            organizationList.classList.remove("percentage-mode");
            organizationValuesToAmount();
            hasSwitched = false;
        } else {
            btn.classList.add("switched");
            widget.sharesType = "percentage";
            organizationList.classList.add("percentage-mode");
            organizationValuesToPercent();
            hasSwitched = true;
        }
    });
}