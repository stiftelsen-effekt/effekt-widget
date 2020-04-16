/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('Opens up the widget', () => {
        cy.get('#donation-btn').click()

        cy.get("#donation-widget-container").should('have.class', 'active')

        cy.get('#donation-widget .pane.payment-method .payment-methods .method.bank').click()

        //Cypress reads the computed matrix value instead of translateX(-320px)
        cy.get('#donation-widget .slider').should('have.css', 'transform', 'matrix(1, 0, 0, 1, -320, 0)')

        let random = Math.random().toString(36).substring(7);
        cy.get(`${pane('basic')} .name`).type(random)
        cy.get(`${pane('basic')} .email`).type(random + '@testeffekt.com')

        cy.get(`${pane('basic')} #check-privacy-policy`).not('[disabled]').check().should('be.checked')
        submitPane('basic')
    })
})

/* Helper functions */
const pane = (paneName) => {
    return `#donation-widget .pane.${paneName}`
}

const submitPane = (paneName) => {
    cy.get(`${pane('basic')} .btn.frwd`).click()
}