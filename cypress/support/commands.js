// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getPane", (paneName) => cy.get(`#donation-widget .pane.${paneName}`))
Cypress.Commands.add("getFromPane", (paneName, selector) => cy.get(`#donation-widget .pane.${paneName} ${selector}`))
Cypress.Commands.add("submitPane", (paneName) => cy.getFromPane(paneName, `.btn.frwd`).click())
Cypress.Commands.add("onPaneNumber", (paneNumber) => cy.get('#donation-widget .slider').should('have.css', 'transform', `matrix(1, 0, 0, 1, ${-320*paneNumber}, 0)`))