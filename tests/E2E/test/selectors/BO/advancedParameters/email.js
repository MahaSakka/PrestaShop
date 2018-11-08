module.exports = {
  Email:{
    log_email_status: '//*[@id="main-div"]//label[@for=%status]',
    save_email_button: '//*[@id="main-div"]//div[@class="card"]//button[@class="btn btn-primary"]',
    success_alert: '//*[@id="main-div"]//div[@class="alert-text"]',
    subject_email_input: '//*[@id="EmailLogs_subject"]',
    search_button: '//*[@id="emaillogs_grid_table"]//button[@title="Search"]',
    reset_button: '//*[@id="emaillogs_grid_table"]//button[@type="reset"]',
    email_table_subject_column: '//*[@id="emaillogs_grid_table"]//td[contains(text(),"%txt")]',
  }
};
