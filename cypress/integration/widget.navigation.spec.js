/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')

        sessionStorage.clear()
    })

    it('Checks that navigation through panes work correctly', () => {
        cy.get('#donation-btn').click()
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-bank]').click()
        cy.onPaneOffset(1)

        cy.fillDonorInfo()
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        
        cy.get('[data-cy=check-select-split]').click()
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.server()
        
        cy.request('GET', 'https://data.gieffektivt.no/organizations/active').then((response) => {
            let orgs = response.body.content

            //Checks that nextPane is inactive if share is more than 100
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('101')
            cy.get('[data-cy=btn-frwd]').should('have.class', 'inactive')
            cy.get('[data-cy=total]').should('not.have.class', 'total-hidden')
            cy.nextPane('shares')
            cy.onPaneOffset(3)

            //Checks that nextPane is inactive if share is less than 100
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('99')
            cy.get('[data-cy=btn-frwd]').should('have.class', 'inactive')
            cy.get('[data-cy=total]').should('not.have.class', 'total-hidden')
            cy.nextPane('shares')
            cy.onPaneOffset(3)

            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('100')
            cy.get('[data-cy=btn-frwd]').should('not.have.class', 'inactive')
            cy.get('[data-cy=total]').should('have.class', 'total-hidden')
        })


        cy.nextPane('shares')
        cy.onPaneOffset(4)

        //Back to start 
        cy.prevPane('referral')
        cy.onPaneOffset(3)
        cy.prevPane('shares')
        cy.onPaneOffset(2)
        cy.prevPane('amount')
        cy.onPaneOffset(1)
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        cy.nextPane('amount')
        cy.onPaneOffset(3)
        cy.nextPane('shares')
        cy.onPaneOffset(4)

        //Referrals are simply hidden when submitting, so offset should remain 4
        cy.getInPane('referral', '#referral-list li').first().click()
        cy.onPaneOffset(4)
    })
})