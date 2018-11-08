module.exports = {
  AccessPageBO: {
    login_input: '#email',
    password_inputBO: '#passwd',
    login_buttonBO: '[name="submitLogin"]',
    menuBO: '//ul[@class="main-menu"]',
    shopname: '//*[@id="header_shopname"]',
    info_employee: '//*[@id="employee_infos"]/a | //*[@id="header-employee-container"]',
    your_profil: '//*[@id="employee_links"]//a[contains(@class, "admin-link")] | //*[@id="header-employee-container"]//a[contains(@class, "profile-link")]',
    sign_out: '//*[@id="header_logout"]'
  }
};
