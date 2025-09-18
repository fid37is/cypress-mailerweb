// cypress/PageObjects/EmailPage.js
class EmailPage {
  clickCompose() {
    cy.get('.mb-4 > .flex > .inline-flex').click();
    cy.contains('NEW MESSAGE').should('be.visible');
  }

  clickCcButton() {
    cy.contains('Cc').click();
    cy.get('#flyingEmailInput-cc').should('be.visible');
  }

  clickBccButton() {
    cy.contains('Bcc').click();
    cy.get('#flyingEmailInput-bcc').should('be.visible');
  }

  fillTo(email) {
    cy.get('#flyingEmailInput-recipient_emails').clear().type(email);
  }

  fillCc(email) {
    cy.get('#flyingEmailInput-cc').clear().type(email);
  }

  fillBcc(email) {
    cy.get('#flyingEmailInput-bcc').clear().type(email);
  }

  fillSubject(subject) {
    cy.get('#subject').clear().type(subject);
  }

  fillBody(body) {
    cy.get('.rsw-ce.w-full.relative.z-10').clear().type(body);
  }

  clickSend() {
    cy.contains('Send').click();
  }

  handleSendConfirmation() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="send-confirmation-modal"]').length > 0) {
        cy.get('[data-cy="send-confirmation-modal"]').within(() => {
          cy.contains('Send anyway').click();
        });
      }
    });
  }

  verifyEmailSent() {
    cy.contains('Email sent successfully').should('be.visible');
  }
}

export default EmailPage;