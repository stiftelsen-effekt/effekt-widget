context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('A standard bank donation runs through', () => {
        cy.get('#donation-widget .pane.payment-method .payment-methods .method.bank').click()
        cy.onPaneOffset(1)

        cy.fillDonorInfo()
        cy.nextPane('basic')
        cy.onPaneOffset(2)

        cy.get('[data-cy=check-select-recommended-input]').not('[disabled]').should('be.checked')
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.getInPane('referral', '#referral-list li').first().click()
        //Referrals are simply hidden when submitting, so offset should remain 3
        cy.onPaneOffset(3)
        cy.get('@randomMail').then((randomEmail) => {
            cy.getInPane('result', '.email:first-child').first().should('have.text', randomEmail)
        })
    })
})
