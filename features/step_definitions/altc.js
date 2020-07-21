const { Given, When, Then } = require('cucumber');
const atollPage = require('../support/pages/atoll-page');
const { Selector } = require('testcafe');

Given(/^I am on the example home page$/, async () => {
    const url = atollPage.elems.url();
    await testController.navigateTo(url);
});

Then('I should see {string}', async function (string) {
    const main = Selector('header').with({ boundTestRun: testController })
    const header = main.find('p').with({ boundTestRun: testController });

    await testController.expect(header.innerText).contains(string)
});


When('I select {string} on the from-station dropdown', async function (string) {
    const fromSelect = Selector('#from-station').with({ boundTestRun: testController });
    const fromOption = fromSelect.find('option').with({ boundTestRun: testController });

    await testController
        .click(fromSelect)
        .click(fromOption.withText(string))

});

When('I select {string} on the to-station dropdown', async function (string) {
    const toSelect = Selector('#to-station').with({ boundTestRun: testController });
    const toOption = toSelect.find('option').with({ boundTestRun: testController });

    await testController
        .click(toSelect)
        .click(toOption.withText(string))

});

When('I click the submit button on the Home page', async function () {
    const submitButton = Selector('.penca-button').with({ boundTestRun: testController });

    await testController.click(submitButton)
});

Then('the results table should exist', async function () {
    let results = Selector('.results').with({ boundTestRun: testController })
    let table = results.find('table').with({ boundTestRun: testController })

    await table.exists;
});

Then('the error {string} should display', async function (error) {
    let results = Selector('.results').with({ boundTestRun: testController })
    let err = results.find('h2').with({ boundTestRun: testController })

    await testController.expect(err.innerText).contains(error);
});