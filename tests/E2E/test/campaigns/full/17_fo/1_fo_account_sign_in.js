const {AccessPageFO} = require('../../../selectors/FO/access_page');


require('../../high/09_customer/1_create_customer'); /*create customer*/


let customerData = {
  first_name: 'demo',
  last_name: 'demo',
  email_address: global.adminEmail,
  password: '123456789',
  birthday: {
    day: '18',
    month: '12',
    year: '1991'
  }
};

// Test 1

scenario('Login in the FO with existing customer',() => {
    scenario('Open the browser and connect to the FO', client => {
        test('should open the browser', () => client.open());
        test('should go to the login page in FO ', () => client.accessToFO(AccessPageFO));
        test('should click the button "Sign in"', () => client.waitForExistAndClick(AccessPageFO.sign_in_button));
        test('should check the customer mail', () => client.waitAndSetValue(AccessPageFO.login_input,date_time + customerData.email_address)); //enter an unexisting mail
        test('should check the customer password', () => client.waitAndSetValue(AccessPageFO.password_inputFO, "123456789"));
        test('Should login successfully in the FO', () => client.waitForExistAndClick(AccessPageFO.sign_out_button));
        test('Should verify the redirection to the account page',() => client.isExisting(AccessPageFO.not_found_error_message)); //Verify you are redirected to the "my account" page
    }, 'customer');
}, 'customer',true);

// Test 2

scenario('Login in the FO with a wrong customer mail', () => {
  scenario('Open the browser and connect to the Front Office', client => { //go in FO
    test('should open the browser', () => client.open());
    test('should go to the login page ', () => client.accessToFO(AccessPageFO));
    test('should click the button "Sign in"', () => client.waitForExistAndClick(AccessPageFO.sign_in_button));
    test('should enter the customer mail', () => client.waitAndSetValue(AccessPageFO.login_input, "tests@test.com")); //enter an unexisting mail
    test('should enter the customer password', () => client.waitAndSetValue(AccessPageFO.password_inputFO, "123456789"));//enter an unexisting password
    test('Should login in the FO', () => client.waitForVisibleAndClick(AccessPageFO.login_button));//Click the button Sign in
    test('Should not authenticate', () => client.isExisting(AccessPageFO.authenticate_failed));//Error: authentification failed
  },'customer');
},'customer', true);

// Test 3
scenario('Login in the FO with a wrong customer password', () => {
  scenario('Open the browser and connect to the FO', client => {
    test('should open the browser', () => client.open());
    test('should go to the login page ', () => client.accessToFO(AccessPageFO));
    test('should click the button "Sign in"', () => client.waitForExistAndClick(AccessPageFO.sign_in_button));
    test('should enter the customer mail', () => client.waitAndSetValue(AccessPageFO.login_input, date_time + customerData.email_address)); //enter an existing mail
    test('should enter the customer password', () => client.waitAndSetValue(AccessPageFO.password_inputFO, "12345"));//enter an unexisting password
    test('Should login in the FO', () => client.waitForVisibleAndClick(AccessPageFO.login_button));//Click the button Sign in
    test('Should not authenticate', () => client.isExisting(AccessPageFO.authenticate_failed));//Error: authentification failed
  },'customer', true);
},'customer');
