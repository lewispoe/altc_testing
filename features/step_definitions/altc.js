const {Given, When, Then} = require('cucumber');
const atollPage = require('../support/pages/atoll-page');

Given(/^I am on the example home page$/, async () => {
    const url = atollPage.elems.url();
    await testController.navigateTo(url);
});