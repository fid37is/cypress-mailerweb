import LoginPage from '../PageObjects/LoginPage';

describe('Login Test Suite with POM', () => {
    const loginPage = new LoginPage();

    beforeEach(() => {
        loginPage.visit(); // Navigate to login page
        cy.fixture('test_data.json').as('userData'); // Load fixture data
    });

    it('Logs in with valid credentials', () => {
        cy.get('@userData').then((user) => {
            loginPage.enterEmail(user.username); // Enter email and click continue
            loginPage.login(user.password); // Enter password and sign in
            loginPage.verifyDashboard(); // Verify dashboard navigation
        });
    });

    it('Fails to log in with invalid email', () => {
        loginPage.enterEmail('wronguser@example.com'); // Invalid email
        loginPage.verifyErrorMessage('No account found with this email address'); // Verify error on email page
    });
});