const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {Menu} = require('../../../../selectors/BO/menu.js');
const {State} = require('../../../../selectors/BO/international/locations.js');
const common_scenarios = require('../../../common_scenarios/locations');
let promise = Promise.resolve();

scenario('Bulk action ', client => {
  test('should open the browser', () => client.open());
  test('should log in successfully in the Back Office', () => client.signInBO(AccessPageBO));
  test('should go to the "Locations" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.locations_submenu));
  test('should go to the "States" tab', () => client.waitForExistAndClick(State.state_tab));
  test('should display all the available states', () => {
    return promise
      .then(() => client.waitForExistAndClick(State.display_state_button))
      .then(() => client.waitForExistAndClick(State.choose_number_state.replace('%A', 1000)));
  });

  scenario('Select, unSelect all the states available Bulk actions', client => {
    common_scenarios.selectUnselectStateBulkAction('Select all', 'checked', "'icon-check-sign'", client);
    common_scenarios.selectUnselectStateBulkAction('unSelect all', 'unchecked', "'icon-check-empty'", client, false);
  }, 'states');

  scenario('Enable, Disable selection Bulk action', client => {
    test('should select the state "Arizona"', () => client.scrollToWaitForExistAndClick(State.check_box_by_text.replace('%txt', "Arizona").replace('%isoCode', 'AZ'), 300));
    test('should select the state "Alaska"', () => client.waitForExistAndClick(State.check_box_by_text.replace('%txt', "Alaska").replace('%isoCode', 'AK')));
    test('should select the state "California"', () => client.waitForExistAndClick(State.check_box_by_text.replace('%txt', "California").replace('%isoCode', 'CA')));
    test('should click on "Bulk actions" button', () => client.waitForExistAndClick(State.bulk_action_button));
    test('should click on "Disable Selection"', () => client.waitForVisibleAndClick(State.drop_down_menu_bulk_action.replace('%click', "'submitBulkdisableSelectionstate'")));
    test('should verify that "Arizona" state is disabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "Arizona").replace('%title', "Disabled")));
    test('should verify that "Alaska" state is disabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "Alaska").replace('%title', "Disabled")));
    test('should verify that "California" state is disabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "California").replace('%title', "Disabled")));
    test('should click on "Bulk actions" button', () => client.waitForExistAndClick(State.bulk_action_button));
    test('should click on "Enable Selection"', () => client.waitForVisibleAndClick(State.drop_down_menu_bulk_action.replace('%click', "'submitBulkenableSelectionstate'")));
    test('should verify that "Arizona" state is enabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "Arizona").replace('%title', "Enabled")));
    test('should verify that "Alaska" state is enabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "Alaska").replace('%title', "Enabled")));
    test('should verify that "California" state is enabled', () => client.isExisting(State.state_enable_disable_by_text.replace('%txt', "California").replace('%title', "Enabled")));
  }, 'states');

  // Related to #9971
  scenario('Assign to a new zone Bulk action', client => {
    test('should click on "Bulk actions" button', () => client.waitForExistAndClick(State.bulk_action_button));
    test('should click on "Assign to a new zone" button', () => client.waitForVisibleAndClick(State.drop_down_menu_bulk_action.replace('%click', "'submitBulkAffectZonestate'")));
    test('should select "Africa" as a new Zone', () => client.waitAndSelectByVisibleText(State.assign_new_zone_select, "Africa"));
    test('should click on "Save" button', () => client.waitForVisibleAndClick(State.assign_to_a_new_zone_button));
    test('should verify that you are assigned successfully the zone to the selection with the green message', () => client.checkTextValue(State.success_alert_text, "×\nThe zone was well assigned to the selection."));
    test('should verify that the state "Arizona" is in the "Africa" zone', () => client.checkTextValue(State.state_column_zone_by_text.replace('%txt', "Arizona"), "Africa"));
    test('should verify that the state "Alaska" is in the "Africa" zone', () => client.checkTextValue(State.state_column_zone_by_text.replace('%txt', "Alaska"), "Africa"));
    test('should verify that the state "California" is in the "Africa" zone', () => client.checkTextValue(State.state_column_zone_by_text.replace('%txt', "California"), "Africa"));
  }, 'states');
  ///////

  scenario('Delete selected Bulk action', client => {
    test('should select the state "Arizona"', () => client.scrollToWaitForExistAndClick(State.check_box_by_text.replace('%txt', "Arizona").replace('%isoCode', 'AZ'), 300));
    test('should select the state "Alaska"', () => client.waitForExistAndClick(State.check_box_by_text.replace('%txt', "Alaska").replace('%isoCode', 'AK')));
    test('should select the state "California"', () => client.waitForExistAndClick(State.check_box_by_text.replace('%txt', "California").replace('%isoCode', 'CA')));
    test('should click on "Bulk actions" button', () => client.waitForExistAndClick(State.bulk_action_button));
    test('should click on "Delete selected"', () => client.waitForVisibleAndClick(State.drop_down_menu_bulk_action.replace('%click', "'submitBulkdeletestate'")));
    test('should click on "OK" button in alert message', () => client.alertAccept());
    test('should verify that "Arizona", "Alaska" and "California" are deleted with green message', () => client.checkTextValue(State.success_alert_text, "×\nThe selection has been successfully deleted."));
    test('should verify if the "Arizona" state was deleted from the list of states', () => {
      return promise
        .then(() => client.waitAndSetValue(State.tab_input_name, "Arizona"))
        .then(() => client.waitAndSetValue(State.iso_code_input_search, "AZ"));
    });
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should verify that the state "Arizona" disappear from the list of state after deletion', () => client.isNotExisting(State.column_state_table.replace('%ID', 3)));
    test('should verify if the "Alaska" state was deleted from the list of states', () => {
      return promise
        .then(() => client.waitAndSetValue(State.tab_input_name, "Alaska"))
        .then(() => client.waitAndSetValue(State.iso_code_input_search, "AK"));
    });
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should verify that the state "Alaska" disappear from the list of state after deletion', () => client.isNotExisting(State.column_state_table.replace('%ID', 3)));
    test('should verify if the "California" state was deleted from the list of states', () => {
      return promise
        .then(() => client.waitAndSetValue(State.tab_input_name, "California"))
        .then(() => client.waitAndSetValue(State.iso_code_input_search, "CA"));
    });
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should verify that the state "California" disappear from the list of state after deletion', () => client.isNotExisting(State.column_state_table.replace('%ID', 3)));
    test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));
    common_scenarios.addState('Arizona', 'AZ', 'United States', 'North America', 'Yes', State.status_state.replace('%status', "'active_on'"), client);
    common_scenarios.addState('Alaska', 'AK', 'United States', 'North America', 'Yes', State.status_state.replace('%status', "'active_on'"), client);
    common_scenarios.addState('California', 'CA', 'United States', 'North America', 'Yes', State.status_state.replace('%status', "'active_on'"), client);
  }, 'states');
}, 'states', true);
