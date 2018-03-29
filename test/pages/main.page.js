var Page = require('./page');

var WidgetPage = Object.create(Page, {
    widgetElement:  { get: function() { return browser.element('#donation-widget'); } },
    startButton:    { get: function() { return browser.element('#donationBtn'); } },
    donorPane: { get: function() { return browser.element('.pane.basic'); } },
    amountPane: { get: function() { return browser.element('.pane.amount'); } },
    splitPane: { get: function() { return browser.element('.pane.shares'); } },
    methodPane: { get: function() { return browser.element('.pane.payment-method'); } },
    resultPane: { get: function() { return browser.element('.pane.result'); } },
    errorElement: { get: function() { return browser.element('#donation-widget .inner .error')} },

    

    // Donor-pane
    donorNextButton: { get: function() { return browser.element('.pane.basic .btn-container .btn.frwd'); } },
    nameInput: { get: function() { return browser.element('.pane.basic .inner .name'); } },
    emailInput: { get: function() { return browser.element('.pane.basic .inner .email'); } },

    // Amount-pane
    amountNextButton: { get: function() { return browser.element('.pane.amount .btn-container .btn.frwd'); } },
    amountPrevButton: { get: function() { return browser.element('.pane.amount .btn-container .btn.back'); } },
    amountInput: { get: function() { return browser.element('.pane.amount .inner .amount-wrapper input'); } },
    amountRecommendedCheckbox: { get: function() { return browser.element('.pane.amount .inner .select-split label.box[for=check-select-recommended]'); } },
    amountChooseCheckbox: { get: function() { return browser.element('.pane.amount .inner .select-split label.box[for=check-select-split]'); } },

    // Split-pane
    splitNextButton: { get: function() { return browser.element('.pane.shares .btn-container .btn.frwd'); } },
    splitPrevButton: { get: function() { return browser.element('.pane.shares .btn-container .btn.back'); } },
    splitModeButton: { get: function() { return browser.element('.pane.shares .inner .share-distribution .mode-switch'); } },
    splitAMFInput: { get: function() { return browser.element('#donation-widget > div.inner > div.slider > div.pane.shares.scrollable > div.inner > div > ul.organizations > li:nth-child(1) > div.input-wrapper > input[type="tel"]'); } },
    splitSCIInput: { get: function() { return browser.element('#donation-widget > div.inner > div.slider > div.pane.shares.scrollable > div.inner > div > ul.organizations > li:nth-child(2) > div.input-wrapper > input[type="tel"]'); } },


    // Payment method pane
    methodPrevButton: { get: function() { return browser.element('.pane.payment-method .btn-container .btn.back'); } },
    methodVippsButton: { get: function() { return browser.element('.pane.payment-method .inner .selection .payment-methods .method.vipps'); } },
    methodPaypalButton: { get: function() { return browser.element('.pane.payment-method .inner .selection .payment-methods form .method.paypal'); } },

    // Vipps
    vippsGuideElement: { get: function() { return browser.element('.pane.payment-method .inner .vipps-guide'); } },
    vippsDoneButton: { get: function() { return browser.element('#vipps-finished'); } },
    vippsCancelButton: { get: function() { return browser.element('#vipps-cancel'); } },

    // Paypal
    paypalPrevButton: { get: function() { return this.methodPrevButton; } },

    open: { value: function() {
        Page.open.call(this, 'widget.htm');
    } },
});

module.exports = WidgetPage;