import RegistrationPage from '../pageObjects/RegistrationPage';

describe('Registration Test Suite with POM', () => {
    const regPage = new RegistrationPage();

    // Generate unique user data
    const generateUniqueUser = () => {
        const timestamp = Date.now();
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: `john.doe${timestamp}@example.com`,
            username: `johndoe${timestamp}`,
            password: `Pass${timestamp}`,
            dateOfBirth: '1990-01-01' // Format: YYYY-MM-DD
        };
    };

    beforeEach(() => {
        regPage.visit();
    });

    it('Registers a new personal free account with unique data', () => {
        const user = generateUniqueUser();
        regPage.startSignUp();
        regPage.selectPersonalAccount();
        regPage.enterPersonalDetails(user.firstName, user.lastName, user.email);
        regPage.selectFreeBilling();
        regPage.enterUsername(user.username);
        regPage.enterPassword(user.password);
        regPage.enterDateOfBirth(user.dateOfBirth);
        regPage.verifyRegistrationSuccess();
    });
});