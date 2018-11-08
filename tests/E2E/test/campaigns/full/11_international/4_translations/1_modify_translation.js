const {AccessPageBO} = require('../../../../selectors/BO/access_page');
const {AccessPageFO} = require('../../../../selectors/FO/access_page');
const {HomePage} = require('../../../../selectors/FO/home_page');
const {ModulePage} = require('../../../../selectors/BO/module_page');
const {OrderPage} = require('../../../../selectors/BO/order');
const {CreateOrder} = require('../../../../selectors/BO/order');
const {Translations} = require('../../../../selectors/BO/international/translations');
const {Localization} = require('../../../../selectors/BO/international/localization');
const {Email} = require('../../../../selectors/BO/advancedParameters/email');
const {Customer} = require('../../../../selectors/BO/customers/customer');
const {Menu} = require('../../../../selectors/BO/menu.js');
const {AddProductPage} = require('../../../../selectors/BO/add_product_page');
const orderScenarios = require('../../../common_scenarios/order');
const productScenarios = require('../../../common_scenarios/product');
const commonScenarios = require('../../../common_scenarios/localization');
const translation_scenarios = require('../../../common_scenarios/translation');
const customerScenarios = require('../../../common_scenarios/customer');

let promise = Promise.resolve();

let languageData = {
  name: 'Français (French)',
  iso_code: 'fr',
  language_code: 'fr',
  date_format: 'd/m/Y',
  date_format_full: 'd/m/Y H:i:s',
  flag_file: 'language_french_flag.png',
  no_picture_file: 'no_image_available.png',
  is_rtl: 'off',
  status: 'on'
};
let productData = {
  name: 'P1',
  quantity: "10",
  price: '5',
  image_name: 'image_test.jpg',
  reference: 'test_1',
  type: 'combination',
  attribute: {
    1: {
      name: 'color',
      variation_quantity: '10'
    }
  }
};
let customerData = {
  first_name: 'test',
  last_name: 'demo',
  email_address: 'test@prestashop.com',
  password: '123456789'
};
let customerDatatwo = {
  first_name: 'testdemo',
  last_name: 'demo',
  email_address: 'testdemo@prestashop.com',
  password: '123456789'
};

let descriptionFrenshData = [
  'Connexion',
  'Pas de compte ? Créez-en-un',
  'Prénom',
  'Nom',
  'E-mail',
  'Mot de passe',
  'Enregistrer'
];


scenario('Modify translation', () => {
  scenario('Installed the "' + languageData.name + '" language', client => {
    test('should open the browser', () => client.open());
    test('should log in successfully in BO', () => client.signInBO(AccessPageBO));
    test('should go to "Localization" page', () => client.goToSubtabMenuPage(Menu.Improve.International.international_menu, Menu.Improve.International.localization_submenu));
    test('should click on "Languages" tab', () => client.waitForExistAndClick(Menu.Improve.International.languages_tab));
    test('should set "French" in the "Name" field', () => client.waitAndSetValue(Localization.languages.filter_name_input, "French"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Localization.languages.filter_search_button));
    test('should verify that the "' + languageData.name + '" language installed', () => {
      return promise
        .then(() => client.isVisible(Localization.languages.table_lang_col.replace('%txt', languageData.name)))
        .then(() => {
          if (global.isVisible) {
            return promise.then(() => client.pause(0));
          } else {
            commonScenarios.createLanguage(languageData);
          }
        });
    });
  }, 'common_client');
  scenario('Enabled log mail in advanced parameters', client => {
    test('should go to "E-mail" page', () => {
      return promise
        .then(() => client.accessToBO(AccessPageBO))
        .then(() => client.goToSubtabMenuPage(Menu.Configure.AdvancedParameters.advanced_parameters_menu, Menu.Configure.AdvancedParameters.email_submenu));
    });
    test('should check then close the "Symfony" toolbar', () => {
      return promise
        .then(() => {
          if (global.ps_mode_dev) {
            client.waitForExistAndClick(AddProductPage.symfony_toolbar);
          }
        })
        .then(() => client.pause(1000));
    });
    test('should set the "Log Emails" to "YES"', () => client.waitForVisibleAndClick(Email.log_email_status.replace('%status', "'form_email_config_log_emails_1'")));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Email.save_email_button));
    test('should verify that the setting "Log Emails" enabled are saved with the successful message ', () => client.checkTextValue(Email.success_alert, "The settings have been successfully updated."));
  }, 'common_client');
  productScenarios.createProduct(AddProductPage, productData);
  orderScenarios.createOrderBO(OrderPage, CreateOrder, productData);
  scenario('Modify translation', client => {
    translation_scenarios.typeOfTranslation("Français (French)", client, "Email translations", "Subject");
    test('should set "Welcome" in search translations input', () => client.waitAndSetValue(Translations.translation_search_input, "Welcome"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should Change the translation from "Welcome!" to "Bienvenue !!!"', () => client.waitAndSetValue(Translations.welcome_textarea, "Bienvenue !!!", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    test('should click on "View my shop"', () => {
      return promise
        .then(() => client.waitForExistAndClick(AccessPageBO.shopname, 3000))
        .then(() => client.switchWindow(1));
    });
    customerScenarios.createAccountFO(client, customerData, 'fr', descriptionFrenshData);
    /**
     * we must log out in the front office to continue the scenario, which is not mentioned in the test scenario
     */
    test('should logout successfully from the Front Office', () => client.signOutFO(AccessPageFO));
    test('should go to the back office', () => client.switchWindow(0));
    test('should log in successfully in BO', () => client.signInBO(AccessPageBO));
    test('should go to "Email" page', () => client.goToSubtabMenuPage(Menu.Configure.AdvancedParameters.advanced_parameters_menu, Menu.Configure.AdvancedParameters.email_submenu));
    test('should set "Bienvenue !!!" in the "Subject" field', () => client.waitAndSetValue(Email.subject_email_input, "Bienvenue !!!"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Email.search_button));
    test('should verify that the email table contains a result that a subject is "Bienvenue !!!"', () => client.isExisting(Email.email_table_subject_column.replace('%txt', "Bienvenue")));
    test('should click on "Reset" button', () => client.waitForVisibleAndClick(Email.reset_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Email translations", "Body", "Core (no theme selected)");
    test('should click on "Core emails" button', () => client.waitForExistAndClick(Translations.translation_email_type_body_button.replace('%txt', "Core emails")));
    test('should click on "account" button', () => client.scrollWaitForVisibleAndClick(Translations.core_email_button.replace('%txt', "account")));
    test('should click on "Edit HTML version"', () => client.waitForExistAndClick(Translations.edit_html_version_button, 3000));
    /**
     * @TODO: https://github.com/PrestaShop/PrestaShop/issues/9599
     * the selector "subject_account" to be available after fixing the bug
     * test('should edit the subject from "Bienvenue !!!" to "Bienvenue !!!!!!"', () => client.waitAndSetValue(Translations.subject_account, "Bienvenue !!!!!!"));
     */
    test('should edit the body from "Bonjour" to "Salut"', () => client.setEditorText(Translations.edit_body_account, "Salut"));
    // test('should click on "Save" button', () => client.waitForExistAndClick(Translations.translation_save_button));
    /**
     * @TODO: https://github.com/PrestaShop/PrestaShop/issues/11322
     * the selector "successuful_alert_message" to be available after fixing the bug
     * test('should verify the appearance of the green message "Successful update"', () => client.checkTextValue(Translations.successuful_alert_message, "Successful update"));
     */
    test('should go to the front office', () => client.switchWindow(1));
    customerScenarios.createAccountFO(client, customerDatatwo, 'fr', descriptionFrenshData);
    /**
     * @TODO: Look at your mailbox, verify you have an email with the subject "Bienvenue !!!!!!, click on it and verify you have "Salut" in the content of the email
     */
    test('should go to the back office', () => client.switchWindow(0));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Themes translations", '', "classic");
    test('should click on "Shop" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Shop")));
    test('should click on "Pdf" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Pdf")));
    test('should Change the translation for the string "Invoice" to "Factureee"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Invoice"), "Factureee", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    /**
     * @TODO: https://github.com/PrestaShop/PrestaShop/issues/11042
     */
    translation_scenarios.changeLanguageBO("Français (French)", client, 3000);
    test('should go to "Order" page', () => client.goToSubtabMenuPage(Menu.Sell.Orders.orders_menu, Menu.Sell.Orders.orders_submenu));
    test('should choose an order with the status "Awaiting check payment"', () => client.waitAndSelectByVisibleText(OrderPage.status_select_order_tab, "En attente du paiement par chèque"));
    test('should click on "View" button', () => client.waitForExistAndClick(OrderPage.view_order_button.replace('%NUMBER', 1)));
    test('should change the status for "Payment accepted"', () => client.updateStatus("Paiement accepté"));
    test('should click on "Update Status" button', () => client.waitForExistAndClick(OrderPage.update_status_button));
    test('should get the invoice name file', () => {
      return promise
        .then(() => client.waitForExistAndClick(OrderPage.document_submenu))
        .then(() => client.getTextInVar(OrderPage.download_delivery_button.replace('%i', 1), "invoiceFileName"))
        .then(() => global.invoiceFileName = tab["invoiceFileName"].replace('#', ''));
    });
    test('should click on "View invoice" button', () => {
      return promise
        .then(() => client.waitForVisibleAndClick(OrderPage.view_invoice_button))
        .then(() => client.pause(2000));
    });
    test('should open the file and verify if in the top right corner is written "Factureee"', () => client.checkDocument(global.downloadsFolderPath, global.invoiceFileName, "Factureee".toUpperCase()));
    translation_scenarios.changeLanguageBO("English (English)", client, 3000);
    translation_scenarios.typeOfTranslation("Français (French)", client, "Themes translations", '', "classic");
    test('should click on "Featured products"', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Featuredproducts"), 2000));
    test('should click on "Shop"', () => client.waitForExistAndClick(Translations.feature_product_shop));
    test('should Change the translation "All products" for "Tous les produitssss"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "All products"), "Tous les produitssss", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    test('should go to the front office', () => client.switchWindow(1));
    test('should set the language to "French"', () => client.changeLanguage('fr'));
    /**
     * @TODO: https://github.com/PrestaShop/PrestaShop/issues/9973
     */
    test('should verify that the link changed from "All products" to "Tous les produitssss"', () => client.checkTextValue(HomePage.all_product_link, "Tous les produitssss"));
    test('should go to the back office', () => client.switchWindow(0));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Installed modules translations", '', '', "Featured products");
    test('should click on "Admin" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Admin")));
    test('should set "Number of products to be displayed" in search translations input', () => client.waitAndSetValue(Translations.translation_search_input, "Number of products to be displayed"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should Change the translation from "Number of products to be displayed" to "Nombre de produits à afficherrrrr"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Number of products to be displayed"), "Nombre de produits à afficherrrrr", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    translation_scenarios.changeLanguageBO("Français (French)", client);
    test('should go to "Modules" page', () => client.goToSubtabMenuPage(Menu.Improve.Modules.modules_menu, Menu.Improve.Modules.modules_manager_submenu));
    test('should click on "Installed modules" tab', () => client.waitForExistAndClick(Menu.Improve.Modules.installed_modules_tabs));
    test('should set "Featured products" in search modules field', () => client.waitAndSetValue(ModulePage.search_input, "Featured products"));
    test('should click on "Search" button', () => client.waitForExistAndClick(ModulePage.modules_search_button));
    test('should click on "Configure" button', () => client.waitForExistAndClick(ModulePage.configure_module_theme_button.split('%moduleTechName').join("ps_featuredproducts")));
    test('should verify that the first label is "Nombre de produits à afficherrrrr"', () => client.checkTextValue(ModulePage.module_label.replace("%txt", "Nombre de produits à afficherrrrr"), "Nombre de produits à afficherrrrr"));
    translation_scenarios.changeLanguageBO("English (English)", client);
    translation_scenarios.typeOfTranslation("Français (French)", client, "Installed modules translations", '', '', "Featured products");
    test('should click on "Shop" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Shop")));
    test('should Change the translation from "All products" to "Tous les produitsssss"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "All products"), "Tous les produitsssss", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    test('should go to the front office', () => client.switchWindow(1));
    test('should set the language to "French"', () => client.changeLanguage('fr'));
    /**
     * @TODO: https://github.com/PrestaShop/PrestaShop/issues/9791
     */
    test('should verify that the link con the home page is "Tous les produitsssss"', () => client.checkTextValue(HomePage.all_product_link, "Tous les produitssss"));
    test('should go to the back office', () => client.switchWindow(0));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    test('should click on "Actions" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Actions")));
    test('should Change the translation from "Edit" to "Modifierrrrrrr"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Edit"), "Modifierrrrrrr", 3000));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    translation_scenarios.changeLanguageBO("Français (French)", client);
    test('should go to "Customers" page', () => client.goToSubtabMenuPage(Menu.Sell.Customers.customers_menu, Menu.Sell.Customers.customers_submenu));
    test('should verify that the button "edit" translate to "Modifierrrrrrr"', () => client.isExisting(Customer.edit_button.replace('%title', "Modifierrrrrrr")));
    translation_scenarios.changeLanguageBO("English (English)", client);
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    test('should click on "Modules" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Modules")));
    test('should click on "Banner" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Banner")));
    test('should click on "Admin" link', () => client.waitForExistAndClick(Translations.admin_banner_tree));
    test('should Change the translation from "Banner image" to "Image de la bannièreeee"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Banner image"), "Image de la bannièreeee", 3000));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    translation_scenarios.changeLanguageBO("Français (French)", client);
    test('should go to "Modules" page', () => client.goToSubtabMenuPage(Menu.Improve.Modules.modules_menu, Menu.Improve.Modules.modules_manager_submenu));
    test('should click on "Installed modules" tab', () => client.waitForExistAndClick(Menu.Improve.Modules.installed_modules_tabs));
    test('should set "Banner" in search modules field', () => client.waitAndSetValue(ModulePage.search_input, "Banner"));
    test('should click on "Search" button', () => client.waitForExistAndClick(ModulePage.modules_search_button));
    test('should click on "Configure" button', () => client.waitForExistAndClick(ModulePage.configure_module_theme_button.split('%moduleTechName').join("ps_banner")));
    test('should verify that the first label is "Image de la bannièreeee"', () => client.checkTextValue(ModulePage.module_label.replace('%txt', "Image de la bannièreeee"), "Image de la bannièreeee"));
    translation_scenarios.changeLanguageBO("English (English)", client);
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    /**
     * We should using the "Search" input, because there's many pages and we need to use pagination
     */
    test('should set "Sell" in search translations field', () => client.waitAndSetValue(Translations.translation_search_input, "Sell"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should click on "Navigation" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Navigation"), 3000));
    test('should click on "Menu" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Menu")));
    /**
     * the contents of the "textarea" will be erased during pagination if we do not save it, so we should save the changed value before changing another textarea
     */
    test('should Change the translation from "Sell" to "Vendreee"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Sell"), "Vendreee", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should remove "Sell" from the input search', () => client.waitForExistAndClick(Translations.close_search_input));
    test('should set "Catalog" in search translations field', () => client.waitAndSetValue(Translations.translation_search_input, "Catalog", 3000));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should click on "Navigation" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Navigation"), 3000));
    test('should click on "Menu" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Menu")));
    test('should Change the translation from "Catalog" to "Catalogueee"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Catalog"), "Catalogueee", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(Translations.close_validation_button));
    translation_scenarios.changeLanguageBO("Français (French)", client);
    test('should verify that the string "Vendre" becomes "Vendreee"', () => client.checkTextValue(Menu.Sell.sell_menu_group_label.replace('%txt', 'Vendreee'), "Vendreee", 3000));
    test('should verify that the string "Catalog" becomes "Catalogueee"', () => client.checkTextValue(Menu.Sell.Catalog.catalog_menu_label.replace('%txt', 'Catalogueee'), "Catalogueee"));
    /**
     * we have to return the state of the shop to the initial state
     */
    translation_scenarios.changeLanguageBO("English (English)", client);
    translation_scenarios.typeOfTranslation("Français (French)", client, "Email translations", "Subject");
    test('should set "Welcome" in search translations input', () => client.waitAndSetValue(Translations.translation_search_input, "Welcome"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should Change the translation from "Welcome!" to "Bienvenue !"', () => client.waitAndSetValue(Translations.welcome_textarea, "Bienvenue !", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Email translations", "Body", "Core (no theme selected)");
    test('should click on "Core emails" button', () => client.waitForExistAndClick(Translations.translation_email_type_body_button.replace('%txt', "Core emails")));
    test('should click on "account" button', () => client.scrollWaitForVisibleAndClick(Translations.core_email_button.replace('%txt', "account")));
    test('should click on "Edit HTML version"', () => client.waitForExistAndClick(Translations.edit_html_version_button, 3000));
    test('should edit the subject from "Bienvenue !!!" to "Bienvenue !"', () => client.waitAndSetValue(Translations.subject_account, "Bienvenue !"));
    test('should edit the body from "Salut" to "Bonjour"', () => client.setEditorText(Translations.edit_body_account, "Bonjour"));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.translation_save_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Themes translations", '', "classic");
    test('should click on "Shop" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Shop")));
    test('should click on "Pdf" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Pdf")));
    test('should Change the translation for the string "Invoice" to "Facture"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Invoice"), "Facture", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Themes translations", '', "classic");
    test('should click on "Featured products"', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Featuredproducts"), 2000));
    test('should click on "Shop"', () => client.waitForExistAndClick(Translations.feature_product_shop));
    test('should Change the translation "All products" for "Tous les produits"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "All products"), "Tous les produits", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Installed modules translations", '', '', "Featured products");
    test('should click on "Admin" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Admin")));
    test('should set "Number of products to be displayed" in search translations input', () => client.waitAndSetValue(Translations.translation_search_input, "Number of products to be displayed"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should Change the translation from "Number of products to be displayed" to "Nombre de produits à afficher"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Number of products to be displayed"), "Nombre de produits à afficher", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Installed modules translations", '', '', "Featured products");
    test('should click on "Shop" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Shop")));
    test('should Change the translation from "All products" to "Tous les produits"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "All products"), "Tous les produits", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    test('should click on "Actions" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Actions")));
    test('should Change the translation from "Edit" to "Modifier"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Edit"), "Modifier", 3000));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    test('should click on "Modules" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Modules")));
    test('should click on "Banner" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 2).replace('%txt', "Banner")));
    test('should click on "Admin" link', () => client.waitForExistAndClick(Translations.admin_banner_tree));
    test('should Change the translation from "Banner image" to "Image de la bannière"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Banner image"), "Image de la bannière", 3000));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Translations.save_translation_button));
    translation_scenarios.typeOfTranslation("Français (French)", client, "Back office translations");
    test('should set "Sell" in search translations field', () => client.waitAndSetValue(Translations.translation_search_input, "Sell"));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should click on "Navigation" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Navigation"), 3000));
    test('should click on "Menu" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Menu")));
    test('should Change the translation from "Sell" to "Vendre"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Sell"), "Vendre", 3000));
    test('should click on "Save" button', () => client.waitForExistAndClick(Translations.save_translation_button));
    test('should remove "Sell" from the input search', () => client.waitForExistAndClick(Translations.close_search_input));
    test('should set "Catalog" in search translations field', () => client.waitAndSetValue(Translations.translation_search_input, "Catalog", 4000));
    test('should click on "Search" button', () => client.waitForExistAndClick(Translations.search_button));
    test('should click on "Navigation" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Navigation"), 3000));
    test('should click on "Menu" link', () => client.waitForExistAndClick(Translations.translations_tree.replace('%i', 1).replace('%txt', "Menu")));
    test('should Change the translation from "Catalog" to "Catalogue"', () => client.waitAndSetValue(Translations.textarea_translation.replace('%txt', "Catalog"), "Catalogue", 3000));
    test('should click on "Save" button', () => client.scrollWaitForExistAndClick(Translations.save_translation_button));
    customerScenarios.deleteCustomer(customerData.email_address);
    customerScenarios.deleteCustomer(customerDatatwo.email_address);
  }, 'order');
}, 'common_client', true);


