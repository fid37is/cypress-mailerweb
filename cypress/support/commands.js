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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// cypress/support/commands.js

import LoginPage from '../PageObjects/LoginPage';

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.enterEmail(email);
    loginPage.login(password);
    loginPage.verifyDashboard(); // Ensure login success
  }, {
    validate: () => {
      cy.getCookie('venmail_session').should('exist'); // Adjust to actual cookie name
    },
    cacheAcrossSpecs: true // Persist session across test files
  });
});