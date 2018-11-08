const {AccessPageBO} = require('../../selectors/BO/access_page');
const {AccessPageFO} = require('../../selectors/FO/access_page');
const {accountPage} = require('../../selectors/FO/add_account_page');
const {Employee} = require('../../selectors/BO/employee_page');
const {Menu} = require('../../selectors/BO/menu.js');
const {Translations} = require('../../selectors/BO/international/translations');

let promise = Promise.resolve();

module.exports = {
  changeLanguageBO: function (language, client, pause = 0) {
    test('should click on "your profile" button to change the language to "' + language + '"', () => {
      return promise
        .then(() => client.pause(pause))
        .then(() => client.waitForVisibleAndClick(AccessPageBO.info_employee, 3000))
        .then(() => client.waitForVisibleAndClick(AccessPageBO.your_profil));
    });
    test('should select the language "' + language + '"', () => client.waitAndSelectByVisibleText(Employee.language_select, language));
    test('should click on "Save" button', () => client.waitForExistAndClick(Employee.save_button, 3000));
  },
  createAccountFO: function (first_name, last_name, email_address, password, client, language = 'French', languageSymbol = 'fr') {
    test('should set the language to "' + language + '"', () => client.changeLanguage(languageSymbol));
    test('should click on "Connexion" button', () => client.waitForExistAndClick(AccessPageFO.sign_in_button));
    test('should click on "Pas de compte ? Créez-en-un"', () => client.waitForExistAndClick(AccessPageFO.create_account_button));
    test('should set the "Prénom" input', () => client.waitAndSetValue(accountPage.firstname_input, first_name));
    test('should set the "Nom" input', () => client.waitAndSetValue(accountPage.lastname_input, last_name));
    test('should set the "E-mail" input', () => client.waitAndSetValue(accountPage.email_input, email_address));
    test('should set the "Mot de passe" input', () => client.waitAndSetValue(accountPage.password_input, password));
    test('should click on "Enregistrer" button', () => client.waitForExistAndClick(accountPage.save_account_button));
  },
  typeOfTranslation: function (language, client, typeTranslation, typeEmail = '', theme = '', module = '') {
    test('should go to "Translations" page', () => {
      return promise
        .then(() => client.pause(3000))
        .then(() => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.translations_submenu));
    });
    test('should choose "' + typeTranslation + '" as a "Type of translation"', () => client.waitAndSelectByVisibleText(Translations.translations_type, typeTranslation, 3000));
    switch (typeTranslation) {
      case "Email translations" :
        test('should choose "' + typeEmail + '" as a type of email content', () => client.waitAndSelectByVisibleText(Translations.translation_type_email_content, typeEmail));
        if (typeEmail === 'Body') {
          test('should choose "' + theme + '" as a type of theme', () => client.waitAndSelectByVisibleText(Translations.translation_theme, theme));
        }
        test('should choose "' + language + '" as a language ', () => client.waitAndSelectByVisibleText(Translations.translations_language, language));
        test('should click on "Modify" button', () => client.waitForExistAndClick(Translations.modify_button));
        break;
      case "Themes translations":
        test('should choose "' + theme + '" as a theme', () => client.waitAndSelectByVisibleText(Translations.translation_theme, theme));
        test('should choose "' + language + '" as a language ', () => client.waitAndSelectByVisibleText(Translations.translations_language, language));
        test('should click on "Modify" button', () => client.waitForExistAndClick(Translations.modify_button));
        break;
      case "Installed modules translations" :
        test('should choose "' + module + '" as a module', () => client.selectTwoByValue(Translations.moduleTranslationHiddenSelect, Translations.moduleTranslationHiddenSelect, "selectedModule", module));
        test('should choose "' + language + '" as a language ', () => client.waitAndSelectByVisibleText(Translations.translations_language, language));
        test('should click on "Modify" button', () => client.waitForExistAndClick(Translations.modify_button));
        break;
      case "Back office translations" :
        test('should choose "' + language + '" as a language ', () => client.waitAndSelectByVisibleText(Translations.translations_language, language));
        test('should click on "Modify" button', () => client.waitForExistAndClick(Translations.modify_button));
        break;
    }
  }
};
