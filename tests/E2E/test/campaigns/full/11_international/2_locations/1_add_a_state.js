const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {Menu} = require('../../../../selectors/BO/menu.js');
const {State} = require('../../../../selectors/BO/international/locations.js');
const common_scenarios = require('../../../common_scenarios/locations');
let promise = Promise.resolve();

let stateData = {
  name: 'Fuerteventura',
  iso_code: 'FU',
  country: 'Spain',
  zone: 'Canaries'
};
let stateSearch = {
  id_search: ['2', '9'],
  name_search: 'Fue',
  iso_code_search: ['A', 'N'],
  zone_search: ['Europe', 'North America'],
  country_search: ['Australia', 'Canada']
};
/**
 * TODO: add a Zone :Canaries / add a country: Spain
 */
scenario('Add a state ', client => {
  test('should open the browser', () => client.open());
  test('should log in successfully in the Back Office', () => client.signInBO(AccessPageBO));
  test('should go to the "Locations" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.locations_submenu));
  test('should go to the "States" tab', () => client.waitForExistAndClick(State.state_tab));
  test('should click on the "Add new state" button', () => client.waitForExistAndClick(State.add_new_state_button));
  test('should click on the "Cancel" button', () => client.waitForExistAndClick(State.cancel_state_button));
  test('should verify that you are go back to the list of states page', () => client.checkTextValue(State.state_text_page, "States"));
  common_scenarios.addState(stateData.name, stateData.iso_code, stateData.country, stateData.zone, 'No', State.status_state.replace('%status', "'active_off'"), client);
  common_scenarios.checkStateByName(stateData.name, client);
  test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));

  scenario('Sort the "State" table', client => {
    test('should display all the available states', () => {
      return promise
        .then(() => client.waitForExistAndClick(State.display_state_button))
        .then(() => client.waitForExistAndClick(State.choose_number_state.replace('%A', 1000)));
    });
    common_scenarios.sortState(State.state_table_column.replace('%W', 2), 'id_state', true);
    common_scenarios.sortState(State.state_table_column.replace('%W', 3), 'name');
    common_scenarios.sortState(State.state_table_column.replace('%W', 4), 'iso_code');
    common_scenarios.sortState(State.state_table_column.replace('%W', 5), 'zone');
    common_scenarios.sortState(State.state_table_column.replace('%W', 6), 'country');
  }, 'states');

  scenario('Search the state by "Status" enabled and disabled ', () => {
    common_scenarios.searchStateByStatus('Yes', 'action-enabled');
    common_scenarios.searchStateByStatus('No', 'action-disabled');

  }, 'states');
  common_scenarios.searchState(State.id_input_search, 'ID', stateSearch.id_search[0], '2');
  common_scenarios.searchState(State.name_input_search, 'Name', stateSearch.name_search, '3');
  common_scenarios.searchState(State.iso_code_input_search, 'ISO code', stateSearch.iso_code_search[0], '4');
  common_scenarios.searchState(State.zone_search, 'Zone', stateSearch.zone_search[0], '5', true);
  common_scenarios.searchState(State.country_search, 'Country', stateSearch.country_search[0], '6', true);

  scenario('Search the state with different search options', client => {
    test('should set the "Zone" select to "' + stateSearch.zone_search[1] + '"', () => client.waitAndSelectByVisibleText(State.zone_search, stateSearch.zone_search[1]));
    test('should set the "Country" select to "' + stateSearch.country_search[1] + '"', () => client.waitAndSelectByVisibleText(State.country_search, stateSearch.country_search[1]));
    test('should set the "ISO code" field to "' + stateSearch.iso_code_search[1] + '"', () => client.client.waitAndSetValue(State.iso_code_input_search, stateSearch.iso_code_search[1]));
    test('should set the "ID" field to "' + stateSearch.id_search[1] + '"', () => client.client.waitAndSetValue(State.id_input_search, stateSearch.id_search[1]));
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should get the number of "States" displayed', () => client.getStatePageNumber('table-state'));
    test('should verify that all results are in "' + stateSearch.zone_search[1] + '" zone, "' + stateSearch.country_search[1] + '" country, contains a "' + stateSearch.id_search[1] + '" in ID, contains a "' + stateSearch.iso_code_search[1] + '" in ISO code', () => {
      for (let j = 0; j < global.statesNumber; j++) {
        promise = client.checkTextValue(State.state_table_column.replace('%ID', j + 1).replace('%W', '2'), stateSearch.id_search[1], 'contain');
        promise = client.checkTextValue(State.state_table_column.replace('%ID', j + 1).replace('%W', '4'), stateSearch.iso_code_search[1], 'contain');
        promise = client.checkTextValue(State.state_table_column.replace('%ID', j + 1).replace('%W', '5'), stateSearch.zone_search[1], 'contain');
        promise = client.checkTextValue(State.state_table_column.replace('%ID', j + 1).replace('%W', '6'), stateSearch.country_search[1], 'contain');
      }
      return promise
    });
    test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));
    common_scenarios.deleteState(stateData.name, client);
  }, 'states');
}, 'states', true);
