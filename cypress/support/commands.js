
const pane = (paneName) => {
    return `#donation-widget .pane.${paneName}`
}

Cypress.Commands.add('fillDonorInfo', () => {
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
  })

Cypress.Commands.add('nextPane', (paneName) => {
    cy.get(`${pane(paneName)} [data-cy=btn-frwd]`).click({force: true})
  })

Cypress.Commands.add('prevPane', (paneName) => {
    cy.get(`${pane(paneName)} [data-cy=btn-back]`).click({force: true})
})

Cypress.Commands.add('onPaneOffset', (offsetNumber) => {
    //Cypress reads the computed matrix value instead of translateX(-320px)
    cy.get('#donation-widget [data-cy=slider]').should('have.css', 'transform', `matrix(1, 0, 0, 1, ${-320*offsetNumber}, 0)`)
})

Cypress.Commands.add('getInPane', (paneName, element) => {
    return cy.get(`#donation-widget .pane.${paneName} ${element}`)
})
