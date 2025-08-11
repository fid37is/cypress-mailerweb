class RegistrationPage {
    // Selectors
    signUpButton() {
        return cy.get('.text-center > .w-full');
    }

    personalAccount() {
        return cy.get('#personal');
    }

    businessAccount() {
        return cy.get('#business');
    }

    continueButton1() {
        return cy.get('.space-y-6 > .bg-primary-600');
    }

    firstNameField() {
        return cy.get('#first_name');
    }

    lastNameField() {
        return cy.get('#last_name');
    }

    emailField() {
        return cy.get('#email');
    }

    continueButton2() {
        return cy.get('.space-y-4 > .flex');
    }

    freeBilling() {
        return cy.get('#free');
    }

    continueButton3() {
        return cy.get('.space-y-6 > .bg-primary-600');
    }

    usernameField() {
        return cy.get('#username');
    }

    continueButton4() {
        return cy.get('.space-y-4 > .justify-center');
    }

    passwordField() {
        return cy.get('#password');
    }

    continueButton5() {
        return cy.get('.space-y-4 > .justify-center');
    }

    dateOfBirthField() {
        return cy.get('#date_of_birth');
    }

    termsCheckbox() {
        return cy.get('#terms-checkbox');
    }

    submitButton() {
        return cy.get('.disabled\\:opacity-50');
    }

    // Methods
    visit() {
        cy.visit('/login');
    }

    startSignUp() {
        this.signUpButton().click();
    }

    selectPersonalAccount() {
        this.personalAccount().click();
        this.continueButton1().click();
    }

    enterPersonalDetails(firstName, lastName, email) {
        this.firstNameField().type(firstName);
        this.lastNameField().type(lastName);
        this.emailField().type(email);
        this.continueButton2().click();
    }

    selectFreeBilling() {
        this.freeBilling().click();
        this.continueButton3().click();
    }

    enterUsername(username) {
        this.usernameField().type(username);
        this.continueButton4().click();
        cy.wait(5000); 
    }

    enterPassword(password) {
        this.passwordField().type(password);
        this.continueButton5().click();
    }

    enterDateOfBirth(dateOfBirth) {
        this.dateOfBirthField().type(dateOfBirth);
        this.termsCheckbox().check();
        this.submitButton().click();
    }

    verifyRegistrationSuccess() {
        cy.url().should('include', '/login');
    }
}

export default RegistrationPage;