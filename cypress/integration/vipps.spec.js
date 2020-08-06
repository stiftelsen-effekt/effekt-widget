/// <reference types="cypress" />

context('Actions', () => {
    it('Walks through widget to vipps page', () => {
        cy.visit('./widget-host-local.htm')
        cy.get('#donation-btn').click()

        cy.get("#donation-widget-container").should('have.class', 'active')

        cy.get('#donation-widget .pane.payment-method .payment-methods .method.vipps').click()

        cy.onPaneNumber(1)

        let random = Math.random().toString(36).substring(7)
        let randommail = random + '@testeffekt.com'
        cy.getFromPane('basic', `.name`).type(random)
        cy.getFromPane('basic', `.email`).type(randommail)

        cy.getFromPane('basic', `#check-privacy-policy`).not('[disabled]').check().should('be.checked')
        cy.submitPane('basic')

        cy.onPaneNumber(2)

        cy.getFromPane('amount', `#check-select-recommended`).not('[disabled]').should('be.checked')
        cy.getFromPane('amount', 'input.amount').type('89')
        cy.submitPane('amount')
        cy.onPaneNumber(3)

        cy.getFromPane('referral', `#referral-list li`).first().click()
        //Referrals are simply hidden when submitting, so offset should remain 3
        cy.onPaneNumber(3)

        cy.getFromPane('vipps', `a`)
            .should('have.attr', 'href').and('include', 'vipps.no')
            .then((href) => {
                let token = href.split("token=")[1]

                if (process.env.NODE_ENV === "dev") {
                    cy.window().then((window) => {
                        cy.request({
                            url: `${window.widget.network.api_url}vipps/integration-test/${token}`,
                            timeout: 10000
                        }).should('have.property', 'status', 200)
                    })
                }
            })
    })
})