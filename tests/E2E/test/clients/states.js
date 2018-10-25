let CommonClient = require('./common_client');
global.statesTable = [];
global.statesSortedTable = [];

class State extends CommonClient {

  getStatePageNumber(selector) {
    return this.client
      .execute(function (selector) {
        return document.getElementById(selector).getElementsByTagName("tbody")[0].children.length;
      }, selector)
      .then((count) => {
        global.statesNumber = count.value;
      });
  }
}

module.exports = State;
