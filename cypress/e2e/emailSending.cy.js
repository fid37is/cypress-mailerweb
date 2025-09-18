// cypress/e2e/emailSending.cy.js
import LoginPage from '../PageObjects/LoginPage';
import EmailPage from '../pageObjects/EmailPage';

describe('Email Sending Regression Tests with Yopmail', () => {
  const loginPage = new LoginPage();
  const emailPage = new EmailPage();
  const toEmail = 'basicuseremail@yopmail.com';
  const ccEmail = 'ccuseremail@yopmail.com';
  const bccEmail = 'bccuseremail@yopmail.com';

  beforeEach(() => {
    // Log in (after login, user is already on email page)
    loginPage.visit();
    cy.fixture('test_data.json').as('testData');
    cy.get('@testData').then((data) => {
      loginPage.enterEmail(data.username);
      loginPage.login(data.password);
      loginPage.verifyDashboard(); // Verify login success
    });
    // No navigation - already on email page after login
  });

  it('Sends a basic email without CC/BCC', () => {
    cy.get('@testData').then((data) => {
      // Compose and send email
      emailPage.clickCompose();
      emailPage.fillTo(toEmail);
      emailPage.fillSubject(data.email.subject);
      emailPage.fillBody(data.email.body);
      emailPage.clickSend();
      emailPage.handleSendConfirmation();
      emailPage.verifyEmailSent();

      // Log email for manual verification
      cy.log(`Check Yopmail inbox: ${toEmail}`);
    });
  });

  it('Sends an email with CC', () => {
    cy.get('@testData').then((data) => {
      // Compose and send email
      emailPage.clickCompose();
      emailPage.fillTo(toEmail);
      emailPage.clickCcButton();
      emailPage.fillCc(ccEmail);
      emailPage.fillSubject(data.email.subject);
      emailPage.fillBody(data.email.body);
      emailPage.clickSend();
      emailPage.handleSendConfirmation();
      emailPage.verifyEmailSent();

      // Log emails for manual verification
      cy.log(`Check Yopmail inboxes: To: ${toEmail}, CC: ${ccEmail}`);
    });
  });

  it('Sends an email with CC and BCC', () => {
    cy.get('@testData').then((data) => {
      // Compose and send email
      emailPage.clickCompose();
      emailPage.fillTo(toEmail);
      emailPage.clickCcButton();
      emailPage.fillCc(ccEmail);
      emailPage.clickBccButton();
      emailPage.fillBcc(bccEmail);
      emailPage.fillSubject(data.email.subject);
      emailPage.fillBody(data.email.body);
      emailPage.clickSend();
      emailPage.handleSendConfirmation();
      emailPage.verifyEmailSent();

      // Log emails for manual verification
      cy.log(`Check Yopmail inboxes: To: ${toEmail}, CC: ${ccEmail}, BCC: ${bccEmail} (Note: BCC may not be visible in inbox)`);
    });
  });
});