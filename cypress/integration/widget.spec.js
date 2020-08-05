/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('Goes through mutual functionality between all donation methods', () => {

        cy.get('#donation-btn').click({force: true})
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-bank]').click({force: true})
        cy.onPaneOffset(1)

        let random = Math.random().toString(36).substring(7)
        let randommail = random + '@testeffekt.com'
        cy.get('[data-cy=name]').type(random, {force: true})
        cy.get('[data-cy=email]').type(randommail, {force: true})
        cy.get('[data-cy=check-tax-deduction]').not('[disabled]').check({force: true}).should('be.checked')
        cy.get('[data-cy=check-privacy-policy]').click()
        cy.get('[data-cy=ssn]').type("123456789")
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        
        cy.get('[data-cy=check-select-split]').click({force: true})
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.server()
        cy.request('GET', 'https://data.gieffektivt.no/organizations/active').then((response) => {
            let orgs = response.body.content

            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('101')
            cy.get('[data-cy=btn-frwd]').should('have.class', 'inactive')
            cy.get('[data-cy=total]').should('not.have.class', 'total-hidden')
            cy.nextPane('shares')
            cy.onPaneOffset(3)

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


            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            //Fills in all shares to equal 100
            for (i = 0; i < orgs.length; i++) {
                if (i != orgs.length-1) {
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(orgs.length)
                }
                else {
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(100-(orgs.length-1)*orgs.length)
                }
            }
        })
        
        cy.route('POST', '/donations/register*').as('register')
        cy.route('POST', '/donations/bank/pending*').as('pending')
        cy.nextPane('shares')
        cy.onPaneOffset(4)

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
        cy.getInPane('referral', '#referral-list li').first().click({force: true})

        cy.wait(['@register', '@pending']).then((xhrs) => {
            console.log(xhrs[0].responseBody)
            console.log(xhrs[1].responseBody)

            //expect(xhrs[0].responseBody.status).to.equal(200)
            
            //expect(xhrs[1].responseBody.status).to.equal(200)

            //TODO: Assert
            //xhr.responseCode == 200 NÅR ALT ER RIKTIG
            //xhr.responseCode == 400 NÅR DET IKKE SUMMER TIL 100, ELLER ER - i tallene, ELLER inneholder ugyldige tegn
        })
        //cy.onPaneOffset(4)
       
    })
})