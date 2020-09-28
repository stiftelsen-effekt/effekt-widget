context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('A standard vipps donation runs through', () => {
        cy.get('#donation-btn').click({force: true})
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-vipps]').click({force: true})
        cy.onPaneOffset(1)

        cy.fillDonorInfo()
        cy.nextPane('basic')
        cy.onPaneOffset(2)

        cy.getInPane('amount', '[data-cy=amount]').type(500)
        cy.get('[data-cy=check-select-recommended]').not('[disabled]').should('be.checked')
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.getInPane('referral', '#referral-list li').first().click({force: true})
        //Referrals are simply hidden when submitting, so offset should remain 3
        cy.onPaneOffset(3)
    })
})