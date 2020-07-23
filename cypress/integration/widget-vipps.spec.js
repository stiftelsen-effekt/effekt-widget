context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('A standard vipps donation runs through', () => {
        cy.get('#donation-btn').click({force: true})

        cy.get("#donation-widget-container").should('have.class', 'active')

        cy.get('#donation-widget .pane.payment-method .payment-methods .method.vipps').click({force: true})

        onPaneOffset(1)

        let random = Math.random().toString(36).substring(7)
        let randommail = random + '@testeffekt.com'
        cy.get(`${pane('basic')} .name`).type(random, {force: true})
        cy.get(`${pane('basic')} .email`).type(randommail, {force: true})

        cy.get(`${pane('basic')} #check-privacy-policy`).not('[disabled]').check({force: true}).should('be.checked')
        submitPane('basic')

        onPaneOffset(2)

        cy.get(`${pane('amount')} #check-select-recommended`).not('[disabled]').should('be.checked')
        submitPane('amount')
        onPaneOffset(3)

        cy.get(`${pane('referral')} #referral-list li`).first().click({force: true})
        //Referrals are simply hidden when submitting, so offset should remain 3
        onPaneOffset(3)
        
    })
})

/* Helper functions */
const pane = (paneName) => {
    return `#donation-widget .pane.${paneName}`
}

const submitPane = (paneName) => {
    cy.get(`${pane(paneName)} .btn.frwd`).click({force: true})
}

const onPaneOffset = (offsetNumber) => {
    //Cypress reads the computed matrix value instead of translateX(-320px)
    cy.get('#donation-widget .slider').should('have.css', 'transform', `matrix(1, 0, 0, 1, ${-320*offsetNumber}, 0)`)
}