const {Translations} = require('../selectors/BO/international/translations');

class Translation extends CommonClient {

  selectModuleToTranslation(value) {
    return this.client
      .execute(function () {
        document.querySelector('#form_modify_translations_module').style = "";
      })
      .selectByVisibleText(Translations.moduleTranslationSelect, value)
      .then(() => this.client.getValue(Translations.moduleTranslationSelect))
      .then((module) => global.module = module);
  }
}
