const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {Addresses} = require('../../../../selectors/BO/customers/addresses');
const {Customer} = require('../../../../selectors/BO/customers/customer');
const {Menu} = require('../../../../selectors/BO/menu.js');
const {AccessPageFO} = require('../../../../selectors/FO/access_page');
const {accountPage}= require('../../../../selectors/FO/add_account_page');

let promise = Promise.resolve();

let addressData = {
  first_name: 'demo',
  last_name: 'demo',
  company: 'prestashop',
  vat_number: '0123456789',
  address: '12 rue d\'amsterdam',
  second_address: 'RDC',
  ZIP: '75009',
  city: 'Paris',
  country: 'France',
  home_phone: '0123456789',
};
let newAddressData = {
  first_name: 'John',
  last_name: 'demo',
  company: 'prestashop',
  address: '125 rue de marseille',
  ZIP: '75500',
  city: 'Marseille',
  country: 'France',
};
scenario('Login in the Back Office', client => {
  test('should open the browser', () => client.open());
  test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
}, 'customer');

scenario('Change the required fields addresses parameter and save it ', client => {
    test('should go to the "Addresses" page', () => client.goToSubtabMenuPage(Menu.Sell.Customers.customers_menu, Menu.Sell.Customers.addresses_submenu));
    test('should click on "set required fields for this section"',() => client.waitForVisibleAndClick(Addresses.required_fields_button));
    test('should check all fields',() => client.waitForVisibleAndClick(Addresses.select_all_field_name));
    test('should save all fields checked ',() => client.waitForVisibleAndClick(Addresses.submit_field));
    test('should verify the appearance of the green validation',() => client.checkTextValue(Addresses.alert_success,'×\nSuccessful update.'));
},'customer');

scenario('Login in the Front Office', client => {
  test('should open the Front Office in new window', () => {
    return promise
      .then(() => client.waitForExistAndClick(AccessPageBO.shopname))
      .then(() => client.switchWindow(1));
  });
  test('should login successfully in the Front Office', () => client.signInFO(AccessPageFO));
  test('should set the language to "English"', () => client.changeLanguage());
}, 'customer');

scenario('Add a first address and verify the necessary fields ',client => {
  test('should click on the "my account" link in the header',() => client.waitForVisibleAndClick(AccessPageFO.account_link));
  test('should click on the "Add first address" button', () => client.waitForExistAndClick(AccessPageFO.address_information_link));
  test('should set the "first name" field',() =>client.waitAndSetValue(accountPage.firstname_input, addressData.first_name));
  test('should set the "last name" field',() =>client.waitAndSetValue(accountPage.lastname_input, addressData.last_name));
  test('should choose the "Country" field',() =>client.waitAndSelectByVisibleText(accountPage.choose_country_input, addressData.country));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "company" field',() => client.checkElementValidation(accountPage.company_input, "Veuillez renseigner ce champ."));
  test('should set the "company" field',() => client.waitAndSetValue(accountPage.company_input, addressData.company));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "VAT number" field',() => client.checkElementValidation(accountPage.vat_number_input, "Veuillez renseigner ce champ."));
  test('should set the "VAT number" field',() => client.waitAndSetValue(accountPage.vat_number_input, addressData.vat_number));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "address" field',() => client.checkElementValidation(accountPage.adr_address, "Veuillez renseigner ce champ."));
  test('should set the "address" field',() => client.waitAndSetValue(accountPage.adr_address,addressData.address+ date_time));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "address complement" field',() => client.checkElementValidation(accountPage.address_Complement_input, "Veuillez renseigner ce champ."));
  test('should set the "address complement" field',() => client.waitAndSetValue(accountPage.address_Complement_input, addressData.second_address));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "zip/postal Code" field',() => client.checkElementValidation(accountPage.adr_postcode, "Veuillez renseigner ce champ."));
  test('should set the "zip/postal Code" field',() => client.waitAndSetValue(accountPage.adr_postcode, addressData.ZIP));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "city" field',() => client.checkElementValidation(accountPage.adr_city, "Veuillez renseigner ce champ."));
  test('should set the "city" field',() => client.waitAndSetValue(accountPage.adr_city, addressData.city));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should check the "phone" field',() => client.checkElementValidation(accountPage.phone_input, "Veuillez renseigner ce champ."));
  test('should set the "phone" field',() => client.waitAndSetValue(accountPage.phone_input, addressData.home_phone));
  test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
  test('should verify that you are redirect successfully with the green message ', () => client.checkTextValue(accountPage.save_notification,'Address successfully added!'));
},'customer');

scenario('Go to the back office', client => {
  test('should go to the back office', () => client.switchWindow(0));
}, 'customer');
scenario('Verify that the address is displayed with all the fields filled in the Back Office', client => {
  test('should filter by address input', () => client.waitAndSetValue(Addresses.filter_by_address_input,addressData.address+ date_time));
  test('should click on "Search" to display all the fields', () => client.waitForExistAndClick(Addresses.search_button));
  test('should get the address ID', () => client.getTextInVar(Addresses.address_id, 'address_id'));
  test('should click on "Edit" ', () => client.waitForExistAndClick(Customer.edit_address_button));
  test('should verify that the "first name" value equal to '+ addressData.first_name ,() => client.checkAttributeValue(Customer.first_name_input,'value',addressData.first_name));
  test('should verify that the "last name" value equal to ' + addressData.last_name ,() => client.checkAttributeValue(Customer.last_name_input,'value',addressData.last_name));
  test('should verify that the "address" value equal to ' + addressData.address+ date_time ,() => client.checkAttributeValue(Customer.address_input,'value',addressData.address+ date_time));
  test('should verify that the "company" value equal to ' + addressData.company ,() => client.checkAttributeValue(Customer.company_input,'value',addressData.company));
  test('should verify that the "VAT number" value equal to ' + addressData.vat_number ,() => client.checkAttributeValue(Customer.vat_number_input,'value',addressData.vat_number));
  test('should verify that the "Address(2)" value equal to ' + addressData.second_address ,() => client.checkAttributeValue(Customer.address2_input,'value',addressData.second_address));
  test('should verify that the "Zip/postal code" value equal to ' + addressData.ZIP ,() => client.checkAttributeValue(Customer.zip_postal_code_input,'value',addressData.ZIP));
  test('should verify that the "city" value equal to' + addressData.city ,() => client.checkAttributeValue(Customer.city_input,'value',addressData.city));
  test('should verify that the "country" value equal to ' + addressData.country ,() => client.isSelected(Customer.country_input.replace('%ID','France')));
  test('should verify that the "home phone" value equal to' + addressData.home_phone ,() => client.checkAttributeValue(Customer.phone_input,'value',addressData.home_phone));
  test('should return to the "Addresses" page', () => client.goToSubtabMenuPage(Menu.Sell.Customers.customers_menu, Menu.Sell.Customers.addresses_submenu));
  test('should click on "set required fields for this section"',() => client.waitForVisibleAndClick(Addresses.required_fields_button));
  test('should uncheck all fields',() => {
    return promise
      .then(() => client.waitForVisibleAndClick(Addresses.select_all_field_name))
      .then(() => client.waitForVisibleAndClick(Addresses.select_all_field_name));
  });
  test('should save successfully all fields unchecked', () => {
  return promise
    .then(() => client.waitForVisibleAndClick(Addresses.submit_field))
    .then(() => client.checkTextValue(Addresses.alert_success,'×\nSuccessful update.'));
  });
},'customer');

scenario('Go in front office to create a new address ',client => {
  test('should go to the Front Office in new window', () => client.switchWindow(1));
  test('should click on the "my account" link in the header',() => client.waitForVisibleAndClick(AccessPageFO.account_link));
  test('should click on the "ADDRESSES" button', () => client.waitForExistAndClick(AccessPageFO.add_address_button));
  scenario('Check customer address in the Front Office', client => {
    test('should check "Address" informations', () => {
      return promise
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.first_name + " " + addressData.last_name, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.company, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.address+ date_time, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.second_address, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.ZIP + " " + addressData.city, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.country, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), addressData.home_phone, "contain"));
    });
  },'customer');
  scenario('Add a new address', client => {
    test('should click on "Create new address"',() => client.waitForVisibleAndClick(accountPage.create_new_address_button));
    scenario('Verify if the fields "Alias", "Company", "VAT number", "Address Complement", "Phone" are well displayed as optional' , client => {
      test('should verify that the "Alias" field is displayed as optional', () => client.waitForVisible(Addresses.optional_text.replace('%ID', 1)));
      test('should verify that the "Company" field is displayed as optional', () => client.waitForVisible(Addresses.optional_text.replace('%ID', 4)));
      test('should verify that the "VAT number" field is displayed as optional', () => client.waitForVisible(Addresses.optional_text.replace('%ID', 5)));
      test('should verify that the "Address Complement" field is displayed as optional', () => client.waitForVisible(Addresses.optional_text.replace('%ID', 7)));
      test('should verify that the "Phone" field is displayed as optional', () => client.waitForVisible(Addresses.optional_text.replace('%ID', 11)));
    },'customer');
    scenario('Fill the fields "First name", "Last name", "Company", "Address", "Zip/Postal Code", "City", "Country" and save a new address',client => {
      test('should set the "first name" field ',() =>client.waitAndSetValue(accountPage.firstname_input,newAddressData.first_name ));
      test('should set the "last name" field',() =>client.waitAndSetValue(accountPage.lastname_input,newAddressData.last_name));
      test('should set the "company" field',() => client.waitAndSetValue(accountPage.company_input,newAddressData.company));
      test('should set the "address" field',() => client.waitAndSetValue(accountPage.adr_address,newAddressData.address + date_time));
      test('should set the "zip/postal Code" field',() => client.waitAndSetValue(accountPage.adr_postcode,newAddressData.ZIP));
      test('should set the "city" field',() => client.waitAndSetValue(accountPage.adr_city, newAddressData.city));
      test('should choose the "Country" field',() =>client.waitAndSelectByVisibleText(accountPage.choose_country_input, newAddressData.country));
      test('should click on "Save"',() => client.waitForExistAndClick(accountPage.adr_save));
      test('should verify that you are redirect successfully to the addresses', () => client.checkTextValue(accountPage.save_notification,'Address successfully added!'));
      },'customer');
  },'customer');
},'customer');

scenario('Go to the back office and verify that the address is displayed with all the fields filled ',client => {
  test('should go to back office', () => client.switchWindow(0));
  test('should filter by address input', () => client.waitAndSetValue(Addresses.filter_by_address_input,newAddressData.address + date_time));
  test('should click on "Search" to display all the fields', () => client.waitForExistAndClick(Addresses.search_button));
  test('should get the address ID', () => client.getTextInVar(Addresses.address_id, 'address_id'));
  test('should click on "Edit" ', () => client.waitForExistAndClick(Customer.edit_address_button));
  test('should verify that the "first name" value equal to ' + newAddressData.first_name ,() => client.checkAttributeValue(Customer.first_name_input,'value', newAddressData.first_name));
  test('should verify that the "last name" value equal to ' + newAddressData.last_name ,() => client.checkAttributeValue(Customer.last_name_input,'value', newAddressData.last_name));
  test('should verify that the "address" value equal to ' + newAddressData.address + date_time ,() => client.checkAttributeValue(Customer.address_input,'value', newAddressData.address+ date_time));
  test('should verify that the "company" value equal to ' + newAddressData.company ,() => client.checkAttributeValue(Customer.company_input,'value', newAddressData.company));
  test('should verify that the "Zip/postal code" value equal to ' + newAddressData.ZIP ,() => client.checkAttributeValue(Customer.zip_postal_code_input,'value', newAddressData.ZIP));
  test('should verify that the "city" value equal to ' + newAddressData.city ,() => client.checkAttributeValue(Customer.city_input,'value',newAddressData.city));
  test('should verify that the "country value equal to ' + newAddressData.country ,() => client.isSelected(Customer.country_input.replace('%ID','France')));
},'customer');

scenario('Go in front office to verify that the new address is displayed with all the fields filled in the Back Office ',client => {
  test('should go to the front office in new window', () => client.switchWindow(1));
  test('should click on the "my account" link in the header',() => client.waitForVisibleAndClick(AccessPageFO.account_link));
  test('should click on the "ADDRESSES" button', () => client.waitForExistAndClick(AccessPageFO.add_address_button));
  scenario('Verify that the address is displayed with all the fields filled in the Back Office', client => {
    test('should check "Address" informations', () => {
      return promise
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), newAddressData.first_name + " " + newAddressData.last_name, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), newAddressData.company, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), newAddressData.address+ date_time, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), newAddressData.ZIP + " " + newAddressData.city, "contain"))
        .then(() => client.checkTextValue(AccessPageFO.address_information.replace('%ID', global.tab['address_id']), newAddressData.country, "contain"));
    });
  },'customer');
},'customer');



