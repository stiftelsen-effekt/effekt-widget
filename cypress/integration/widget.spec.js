/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('Goes through mutual functionality between all donation methods', () => {
        cy.get('#donation-btn').click({force: true})
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('#donation-widget .pane.payment-method .payment-methods .method.bank').click({force: true})
        cy.onPaneOffset(1)

        let random = Math.random().toString(36).substring(7)
        let randommail = random + '@testeffekt.com'
        cy.getInPane('basic', '.name').type(random, {force: true})
        cy.getInPane('basic', '.email').type(randommail, {force: true})
        cy.getInPane('basic', '#check-tax-deduction').not('[disabled]').check({force: true}).should('be.checked')
        cy.getInPane('basic', '#check-privacy-policy').click()
        cy.getInPane('basic', '.ssn').type("123456789")
        cy.nextPane('basic')
        cy.onPaneOffset(2)

        cy.getInPane('amount', '#check-select-single').click({force: true})
        cy.getInPane('amount', '#check-select-split').click({force: true})
        cy.nextPane('amount')
        cy.onPaneOffset(3)
        cy.server()
        cy.route('POST', '/donations/register*').as('register')
        cy.route('POST', '/donations/bank/pending*').as('pending')

        cy.nextPane('shares')

        
        cy.onPaneOffset(4)

        cy.prevPane('referral')
        cy.prevPane('shares')
        cy.prevPane('amount')
        cy.onPaneOffset(1)
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        cy.nextPane('amount')
        cy.onPaneOffset(3)
        cy.nextPane('shares')
        cy.onPaneOffset(4)

         //TODO: Check that shares work properly

        //Referrals are simply hidden when submitting, so offset should remain 4
        cy.getInPane('referral', '#referral-list li').first().click({force: true})

        cy.wait(['@register', '@pending']).then((xhrs) => {
            console.log(xhrs[0].responseBody)
            console.log(xhrs[1].responseBody)
        })
        //cy.onPaneOffset(4)
       
    })
})