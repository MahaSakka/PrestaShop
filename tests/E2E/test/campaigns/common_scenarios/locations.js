const {State} = require('../../selectors/BO/international/locations.js');

let promise = Promise.resolve();

module.exports = {
  sortState: async function (selector, sortBy, isNumber = false) {
    global.elementsTable = [];
    global.elementsSortedTable = [];
    scenario('Check the sort of states by "' + sortBy.toUpperCase() + '"', client => {
      test('should get the number of "States"', () => client.getStatePageNumber('table-state'));
      test('should click on "Sort by ASC" icon', async () => {
        for (let j = 0; j < global.statesNumber; j++) {
          await client.getTableField(selector, j);
        }
        await client.waitForExistAndClick(State.sort_button.replace('%SORTBY', sortBy).replace('%SORTWAY', 'asc'));
      });
      test('should check that the states is well sorted by ASC', async () => {
        for (let j = 0; j < global.statesNumber; j++) {
          await client.getTableField(selector, j, true);
        }
        await client.checkSortTable(isNumber);
      });
      test('should click on "Sort by DESC" icon', async () => await client.waitForExistAndClick(State.sort_button.replace('%SORTBY', sortBy).replace('%SORTWAY', 'desc')));
      test('should check that the states is well sorted by DESC', async () => {
        for (let j = 0; j < global.statesNumber; j++) {
          await client.getTableField(selector, j, true);
        }
        await client.checkSortTable(isNumber, 'DESC');
      });
    }, 'states');
  },
  addState: function (name, iso_code, country, zone, status, selectorStatus, client) {
    test('should click on "Add new state" button', () => client.waitForExistAndClick(State.add_new_state_button));
    test('should set the "Name" input', () => client.waitAndSetValue(State.name_input, name));
    test('should set the "ISO code" input', () => client.waitAndSetValue(State.iso_code_input, iso_code));
    test('should choose the "Country" select', () => client.waitAndSelectByVisibleText(State.country_select, country));
    test('should choose the "Zone" select', () => client.waitAndSelectByVisibleText(State.zone_select, zone));
    test('should set the "Status" to "' + status + '"', () => client.waitForExistAndClick(selectorStatus));
    test('should click on "Save" button', () => client.waitForExistAndClick(State.save_state_button));
    test('should verify that you are redirect successfully with the green message ', () => client.checkTextValue(State.success_alert_text, "×\nSuccessful creation."));
  },
  checkStateByName: function (name, client) {
    test('should verify if the "' + name + '"in the list of states', () => client.waitAndSetValue(State.tab_input_name, name));
    test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
    test('should verify that the state appear in the list after research', () => client.checkTextValue(State.column_state_table.replace('%ID', 3), name));
  },
  searchStateByStatus: function (status, action) {
    scenario('Search the state which enabled filter list set to "' + status + '"', client => {
      test('should choose "' + status + '" from enabled filter list', () => client.waitAndSelectByVisibleText(State.enabled_select, status));
      test('should get the number of "States" displayed', () => client.getStatePageNumber('table-state'));
      test('should verify that the "States" displayed have the field list set to "' + status + '"', () => {
        for (let j = 0; j < global.statesNumber; j++) {
          promise = client.isExisting(State.disabled_enabled_state.replace('%ID', j).replace('%class', action));
        }
        return promise
      });
      test('should click on "Reset" button', () => client.waitForVisibleAndClick(State.reset_button));
    }, 'states');
  },
  searchState: function (Selector, searchField, searchValue, columnId, select = false) {
    scenario('Search the state that the "' + searchField + '" field contains "' + searchValue + '"', client => {
      if (select) {
        test('should set the "' + searchField + '" to "' + searchValue + '" value', () => client.waitAndSelectByVisibleText(Selector, searchValue));
      } else {
        test('should set the "' + searchField + '" select to "' + searchValue + '" value', () => client.waitAndSetValue(Selector, searchValue));
      }
      test('should click on "Search" button', () => client.waitForExistAndClick(State.search_button));
      test('should get the number of "States" that the "' + searchField + '" field contains "' + searchValue + '"', () => client.getStatePageNumber('table-state'));
      test('should verify that only the "States" displayed which the "' + searchField + '" field contains "' + searchValue + '"', () => {
        for (let j = 0; j < global.statesNumber; j++) {
          promise = client.checkTextValue(State.state_table_column.replace('%ID', j + 1).replace('%W', columnId), searchValue, 'contain');
        }
        return promise
      });
      test('should click on "Reset"  button', () => client.waitForVisibleAndClick(State.reset_button));
    }, 'states');
  }
};


