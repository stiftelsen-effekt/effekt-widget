/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')
    })

    it('Goes through mutual functionality between all donation methods', () => {

        //TODO: Replace all classes and id's with cy-data

        cy.get('#donation-btn').click({force: true}) //Hvorfor er denne knappen forskjellig i local og prod?
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-bank]').click({force: true})
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
        cy.request('GET', 'https://data.gieffektivt.no/organizations/active').then((response) => {
            let orgs = response.body.content

            //TODO: Assert sum of shares not higher or lower than 100
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('101')
            cy.get('[data-cy=btn-frwd]').should('have.class', 'inactive')
            cy.get('[data-cy=total]').should('not.have.class', 'total-hidden')

            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('99')
            cy.get('[data-cy=btn-frwd]').should('have.class', 'inactive')
            cy.get('[data-cy=total]').should('not.have.class', 'total-hidden')

            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('100')
            cy.get('[data-cy=btn-frwd]').should('not.have.class', 'inactive')
            cy.get('[data-cy=total]').should('have.class', 'total-hidden')


            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            //Dynamically fills in all shares to equal 100 (Only works for less than 10 organizations)
            for (i = 0; i < orgs.length; i++) {
                if (i != orgs.length-1) {
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type('10')
                }
                else {
                    //Gives the remaining percentage to the bottom organization
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(100-(orgs.length-1)*10)
                }
            }
        })
        
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

        //Referrals are simply hidden when submitting, so offset should remain 4
        cy.getInPane('referral', '#referral-list li').first().click({force: true})

        cy.wait(['@register', '@pending']).then((xhrs) => {
            console.log(xhrs[0].responseBody)
            console.log(xhrs[1].responseBody)

            //TODO: Assert
            //xhr.responseCode == 200 NÅR ALT ER RIKTIG
            //xhr.responseCode == 400 NÅR DET IKKE SUMMER TIL 100, ELLER ER - i tallene, ELLER inneholder ugyldige tegn
        })
        //cy.onPaneOffset(4)
       
    })
})