
const pane = (paneName) => {
    return `#donation-widget .pane.${paneName}`
}

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