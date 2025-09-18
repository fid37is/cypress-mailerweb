// cypress/support/pages/LoginPage.js

class LoginPage {
    // Define selectors
    usernameField() {
        return cy.get('#email');
    }

    continueButton() {
        return cy.get('.bg-primary-600');
    }

    passwordField() {
        return cy.get('#password'); 
    }

    loginButton() {
        return cy.get('.bg-primary-600');
    }

    errorMessage() {
        return cy.get('.error-message');
    }

    // Methods to interact with the page
    visit() {
        cy.visit('/login');
    }

    enterEmail(email) {
        this.usernameField().type(email);
        this.continueButton().click();
    }

    login(password) {
        this.passwordField().type(password);
        this.loginButton().click();
        cy.wait(15000);
    }

    verifyErrorMessage(expectedMessage) {
        cy.get('.text-red-500 > p').should('contain', expectedMessage);
    }

    verifyDashboard() {
        cy.url().should('include', 'm/all'); 
        // Silenced for environments without mail view - uncomment when available
        // cy.get('.h-12 > :nth-child(2) > .flex').should('contain', 'Switch to Mail View');
    }
}

export default LoginPage;