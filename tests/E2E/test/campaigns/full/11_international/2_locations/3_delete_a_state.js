const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {State} = require('../../../../selectors/BO/international/locations.js');
const {Menu} = require('../../../../selectors/BO/menu.js');
const common_scenarios = require('../../../common_scenarios/locations');

let deleteState = {
  name: 'AA',
  iso_code: 'AA',
  country: 'United States',
  zone: 'North America'
};

scenario('delete a state', client => {
  test('should open the browser', () => client.open());
  test('should log in successfully in the Back Office', () => client.signInBO(AccessPageBO));
  test('should go to the "Locations" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.locations_submenu));
  test('should go to the "States" tab', () => client.waitForExistAndClick(State.state_tab));
  common_scenarios.checkStateByName(deleteState.name, client);
  common_scenarios.deleteState(deleteState.name, client);
  test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));
  common_scenarios.addState(deleteState.name, deleteState.iso_code, deleteState.country, deleteState.zone, 'YES', State.status_state.replace('%status', "'active_on'"), client);
}, 'states', true);
