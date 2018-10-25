const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {State} = require('../../../../selectors/BO/international/locations.js');
const {Menu} = require('../../../../selectors/BO/menu.js');
const common_scenarios = require('../../../common_scenarios/locations');

let stateData = {
  name: 'Fuerteventura',
  iso_code: 'FU',
  country: 'Spain',
  zone: 'Canaries'
};
let editState = {
  name: 'Lanzarote',
  iso_code: 'LAN',
  country: 'Spain',
  zone: 'Canaries'
};

scenario('Edit a state', client => {
  test('should open the browser', () => client.open());
  test('should log in successfully in the Back Office', () => client.signInBO(AccessPageBO));
  test('should go to the "Locations" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.locations_submenu));
  test('should go to the "States" tab', () => client.waitForExistAndClick(State.state_tab));
  common_scenarios.addState(stateData.name, stateData.iso_code, stateData.country, stateData.zone, 'No', State.status_state.replace('%status', "'active_off'"), client);
  common_scenarios.checkStateByName(stateData.name, client);
  common_scenarios.editState(editState.name, editState.iso_code, editState.country, editState.zone, "'active_on'", client);
  test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));

  scenario('Verify that the edited state appear in the list of states', client => {
    test('should set the "Name" field to "' + editState.name + '"', () => client.client.waitAndSetValue(State.name_input_search, editState.name));
    test('should set the "ISO code" field to "' + editState.iso_code + '"', () => client.client.waitAndSetValue(State.iso_code_input_search, editState.iso_code));
    test('should set the "Zone" select to "' + editState.zone + '"', () => client.waitAndSelectByVisibleText(State.zone_search, editState.zone));
    test('should set the "Country" select to "' + editState.country + '"', () => client.waitAndSelectByVisibleText(State.country_search, editState.country));
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should verify that the "Name" displayed equal to"' + editState.name + '"', () => client.checkTextValue(State.state_table_column.replace('%ID', 1).replace('%W', 3), editState.name));
    test('should verify that the "ISO code" displayed equal to"' + editState.iso_code + '"', () => client.checkTextValue(State.state_table_column.replace('%ID', 1).replace('%W', 4), editState.iso_code));
    test('should verify that the "Zone" displayed equal to"' + editState.zone + '"', () => client.checkTextValue(State.state_table_column.replace('%ID', 1).replace('%W', 5), editState.zone));
    test('should verify that the "Country" displayed equal to"' + editState.country + '"', () => client.checkTextValue(State.state_table_column.replace('%ID', 1).replace('%W', 6), editState.country));
    test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));
  }, 'states');
}, 'states', true);
