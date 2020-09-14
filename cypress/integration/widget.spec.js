/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('./widget-host-local.htm')

        sessionStorage.clear()
    })

    it('Goes through the mutual functionality between all donation methods', () => {
        cy.get('#donation-btn').click({force: true})
        cy.get("#donation-widget-container").should('have.class', 'active')
        cy.get('[data-cy=method-bank]').click({force: true})
        cy.onPaneOffset(1)

        let randomName = Math.random().toString(36).substring(7)
        let randomMail = randomName + '@testeffekt.com'
        let ssn = "123456789"
        cy.get('[data-cy=name]').type(randomName, {force: true})
        cy.get('[data-cy=name]').should('have.value', randomName)
        cy.get('[data-cy=email]').type(randomMail, {force: true})
        cy.get('[data-cy=email]').should('have.value', randomMail)
        cy.get('[data-cy=check-tax-deduction]').not('[disabled]').check({force: true}).should('be.checked')
        cy.get('[data-cy=check-privacy-policy]').click()
        cy.get('[data-cy=ssn]').type(ssn)
        cy.nextPane('basic')
        cy.onPaneOffset(2)
        
        cy.get('[data-cy=check-select-split]').click({force: true})
        cy.nextPane('amount')
        cy.onPaneOffset(3)

        cy.server()
        let organizationsSplit = []
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


            cy.get(`[data-cy=${orgs[0].abbriv}-share]`).type('{backspace}{backspace}{backspace}')
            //Fills in all shares to equal 100
            for (i = 0; i < orgs.length; i++) { 
                if (i != orgs.length - 1) {
                    let split = parseInt(orgs.length)

                    organizationsSplit.push({id: orgs[i].id, split: split.toString()})
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(split)
                }
                else {
                    let remainder = parseInt(100 - (orgs.length-1) * orgs.length)

                    organizationsSplit.push({id: orgs[i].id, split: remainder.toString()})
                    cy.get(`[data-cy=${orgs[i].abbriv}-share]`).type(remainder)
                }
            }
        })
        
        cy.route('POST', '/donations/register*').as('register')
        cy.route('POST', '/donations/bank/pending*').as('pending')
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
        cy.getInPane('referral', '#referral-list li').first().click({force: true})
        cy.onPaneOffset(4)

        const assertRegisterObject = {
            donor: {
                name: randomName,
                email: randomMail,
                ssn: ssn,
                newsletter: false
            },
            amount: null,
            method: 'BANK',
            organizations: organizationsSplit
        }

        cy.wait(['@register', '@pending']).then((xhrs) => {
            const registerRequest = xhrs[0].request
            const pendingRequest = xhrs[1].request

            registerObjectURLEncoded = "data=" + encodeURIComponent(JSON.stringify(assertRegisterObject))
            expect(registerRequest.body).to.be.eq(registerObjectURLEncoded)

            expect(registerRequest.status).to.equal(200)
            expect(pendingRequest.status).to.equal(200)
        })
    })
})
