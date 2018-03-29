var assert = require('assert');
var _ = require('../pages/main.page');

describe('Vippsdonasjon', function() {
    it('Åpne siden og klikk på start-knapp', function() {
        _.open();
        _.startButton.click();
    });
    it('Fyll inn navn, men ikke epost og få feilmelding', function() {
        _.nameInput.setValue('Navn Navnesen');
        _.donorNextButton.click();
        assert.equal('Ikke en gyldig mail', _.errorElement.getText());
    });
    it('Fyll inn epost, gå videre og se ingen feilmelding', function() {
        _.emailInput.setValue('navn@navnesen.no');
        _.donorNextButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('error', _.errorElement.getAttribute('class'));
    });
    it('Forsøk å gå videre og få feilmelding', function() {
        _.amountNextButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('error active', _.errorElement.getAttribute('class'));
        assert.equal('Du må angi en sum', _.errorElement.getText());
    });
    it('Fyll inn mengde, velg "velg selv", gå videre og se ingen feilmelding', function() {
        _.amountInput.setValue('5');
        _.amountChooseCheckbox.click();
        _.amountNextButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('error', _.errorElement.getAttribute('class'));
    });
    it('Se 4 til AMF og 1 til SCI', function() {
        assert.equal(4, _.splitAMFInput.getValue());
        assert.equal(1, _.splitSCIInput.getValue());
    });
    it('Sett SCI til 0, prøv å gå videre og få feilmelding', function() {
        _.splitSCIInput.setValue('0');
        _.splitNextButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('error active', _.errorElement.getAttribute('class'));
        assert.equal('Du må fordele alle midlene', _.errorElement.getText());
    });
    it('Bytt til prosentvisning og se AMF = 80 og SCI = 0', function() {
        _.splitModeButton.click();
        assert.equal(80, _.splitAMFInput.getValue());
        assert.equal(0, _.splitSCIInput.getValue());
    });
    it('Sett SCI til 20, prøv å gå videre og se ingen feilmelding', function() {
        _.splitSCIInput.setValue('20');
        _.splitNextButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('error', _.errorElement.getAttribute('class'));
    });
    it('Trykk på Vipps-knappen og sjekk at vipps-guide har blitt aktiv', function() {
        _.methodVippsButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('vipps-guide active', _.vippsGuideElement.getAttribute('class'));
    });

    // Tester av hjelpebildene her!

    it('Trykk på spørsmålstegn nr. 1 og sjekk at riktig bilde har display: block', function() {
        _.vippsHelp1.click();
        assert.equal('block', _.vippsPicture1.getCssProperty('display').value);
    });
    it('Trykk på "Lukk skjermbilde" og sjekk at riktig bilde har display: none', function() {
        _.vippsCloseScreenshotButton.click();
        assert.equal('none', _.vippsPicture1.getCssProperty('display').value);
    });
    it('Trykk på spørsmålstegn nr. 2 og sjekk at riktig bilde har display: block', function() {
        _.vippsHelp2.click();
        assert.equal('block', _.vippsPicture2.getCssProperty('display').value);
    });
    it('Trykk på "Lukk skjermbilde" og sjekk at riktig bilde har display: none', function() {
        _.vippsCloseScreenshotButton.click();
        assert.equal('none', _.vippsPicture2.getCssProperty('display').value);
    });it('Trykk på spørsmålstegn nr. 3 og sjekk at riktig bilde har display: block', function() {
        _.vippsHelp3.click();
        assert.equal('block', _.vippsPicture3.getCssProperty('display').value);
    });
    it('Trykk på "Lukk skjermbilde" og sjekk at riktig bilde har display: none', function() {
        _.vippsCloseScreenshotButton.click();
        assert.equal('none', _.vippsPicture3.getCssProperty('display').value);
    });it('Trykk på spørsmålstegn nr. 4 og sjekk at riktig bilde har display: block', function() {
        _.vippsHelp4.click();
        assert.equal('block', _.vippsPicture4.getCssProperty('display').value);
    });
    it('Trykk på "Lukk skjermbilde" og sjekk at riktig bilde har display: none', function() {
        _.vippsCloseScreenshotButton.click();
        assert.equal('none', _.vippsPicture4.getCssProperty('display').value);
    });it('Trykk på spørsmålstegn nr. 5 og sjekk at riktig bilde har display: block', function() {
        _.vippsHelp5.click();
        assert.equal('block', _.vippsPicture5.getCssProperty('display').value);
    });
    it('Trykk på "Lukk skjermbilde" og sjekk at riktig bilde har display: none', function() {
        _.vippsCloseScreenshotButton.click();
        assert.equal('none', _.vippsPicture5.getCssProperty('display').value);
    });

    it('Trykk på "Ferdig"-knappen og sjekk at result-pane har "vipps"-klassen', function() {
        _.vippsDoneButton.click();
        // Har klassene error og active når feilmelding vises
        assert.equal('pane result vipps', _.resultPane.getAttribute('class'));
    });
});