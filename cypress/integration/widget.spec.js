/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('Goes through the mutual functionality between all donation methods', () => {
        cy.get('#donation-btn').click({force: true})
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('#donation-widget .pane.payment-method .payment-methods .method.bank').click({force: true})
        
        onPaneOffset(1)

        let random = Math.random().toString(36).substring(7)
        let randommail = random + '@testeffekt.com'
        cy.get(`${pane('basic')} .name`).type(random, {force: true})
        cy.get(`${pane('basic')} .email`).type(randommail, {force: true})
        cy.get(`${pane('basic')} #check-tax-deduction`).not('[disabled]').check({force: true}).should('be.checked')
        cy.get(`${pane('basic')} #check-privacy-policy`).click()
        cy.get(`${pane('basic')} .ssn`).type("123456789")

        submitPane('basic')
        onPaneOffset(2)
        goBack('basic')
        onPaneOffset(1)
        submitPane('basic')
        onPaneOffset(2)

        cy.get(`${pane('amount')} #check-select-single`).click({force: true})
        cy.get(`${pane('amount')} #check-select-split`).click({force: true})
        submitPane('amount')
        onPaneOffset(3)
        goBack('amount')
        onPaneOffset(2)
        submitPane('amount')
        onPaneOffset(3)

        submitPane('shares')
        //cy.get(`${pane('referral')} #referral-list li`).first().click({force: true})

        //TODO: Check that shares work properly
        //TODO: Check that all backwards buttons work properly

        //cy.get(`${pane('referral')} #referral-list li`).first().click({force: true})
        //Referrals are simply hidden when submitting, so offset should remain 3
        //onPaneOffset(3)
    })
})

/* Helper functions */
const pane = (paneName) => {
    return `#donation-widget .pane.${paneName}`
}

const submitPane = (paneName) => {
    cy.get(`${pane(paneName)} .btn.frwd`).click({force: true})
}

const goBack = (paneName) => {
    cy.get(`${pane(paneName)} .btn.back`).click({force: true})
}

const onPaneOffset = (offsetNumber) => {
    //Cypress reads the computed matrix value instead of translateX(-320px)
    cy.get('#donation-widget .slider').should('have.css', 'transform', `matrix(1, 0, 0, 1, ${-320*offsetNumber}, 0)`)
}