/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('A standard bank donation runs through', () => {
        cy.get('#donation-btn').click({force: true})

        cy.get("#donation-widget-container").should('have.class', 'active')

        cy.get('#donation-widget .pane.payment-method .payment-methods .method.bank').click({force: true})

        cy.onPaneNumber(1)

        let random = Math.random().toString(36).substring(7)
        let randommail =random + '@testeffekt.com'
        cy.getFromPane('basic', `.name`).type(random, {force: true})
        cy.getFromPane('basic', `.email`).type(randommail, {force: true})

        cy.getFromPane(`basic`, `#check-privacy-policy`).not('[disabled]').check({force: true}).should('be.checked')
        cy.submitPane('basic')

        cy.onPaneNumber(2)

        cy.getFromPane(`amount`, `#check-select-recommended`).not('[disabled]').should('be.checked')
        cy.submitPane('amount')
        cy.onPaneNumber(3, 20000)

        cy.getFromPane(`referral`, `#referral-list li`).first().click({force: true})
        //Referrals are simply hidden when submitting, so offset should remain 3
        cy.onPaneNumber(3)

        cy.getFromPane(`result`, `.email:first-child`).first().should('have.text', randommail)
    })
})