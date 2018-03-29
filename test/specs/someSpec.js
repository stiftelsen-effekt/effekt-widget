// var assert = require('assert');
// var widgetPage = require('../pages/main.page');

// describe('Donor-pane', function() {
//     it('Klikk på start knapp og sjekk at donation-widget blir aktiv', function() {
//         widgetPage.open();
//         widgetPage.startButton.click();
//         assert.equal('active', browser.getAttribute('#donation-widget', 'class'));
//     });
//     it('skal gi feilmelding ved ugyldig navn', function() {
//         //widgetPage.open();
//         //widgetPage.startButton.click();
//         //widgetPage.nameInput.setValue('vegard');
//         //widgetPage.emailInput.setValue('vegard');
//         widgetPage.donorNextButton.click();

//         assert.equal('Ikke et gyldig navn', widgetPage.errorElement.getText());
//     });
//     it('skal gi feilmelding ved ugyldig epost', function() {
//         //widgetPage.open();
//         //widgetPage.startButton.click();
//         widgetPage.nameInput.setValue('vegard');
//         widgetPage.emailInput.setValue('vegard');
//         widgetPage.donorNextButton.click();

//         assert.equal('Ikke en gyldig mail', widgetPage.errorElement.getText());
//     });
//     // it('donor-pane skal være synlig når donor-pane vises', function() {
//     //     //widgetPage.open();
//     //     //widgetPage.startButton.click();
//     //     assert.equal(true, browser.isVisibleWithinViewport('.pane.basic'))
//     // });
//     // it('amount-pane skal ikke være synlig når donor-pane vises', function() {
//     //     // widgetPage.open();
//     //     // widgetPage.startButton.click();
//     //     assert.equal(false, browser.isVisibleWithinViewport('.pane.amount'))
//     // });
// });