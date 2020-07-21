const testControllerHolder = require('../support/testControllerHolder');
const fs = require('fs');
const createTestCafe = require('testcafe');
const { AfterAll, setDefaultTimeout, Before, After, Status } = require('cucumber');
const timeout = 100000;

let isTestCafeError = false;
let attachScreenshotToReport = null;
let cafeRunner = null;
let n = 0;

function createTestFile() {
    fs.writeFileSync('cucumbertest.js',
    'import errorHandling from "./features/support/errorHandling.js";\n' +
    'import testControllerHolder from "./features/support/testControllerHolder.js";\n\n' +

    'fixture("fixture")\n' +

    'test\n' +
    '("test", testControllerHolder.capture)')
}
// Create a runner function with configurations like src, screenshots, browsers.
function runTest(iteration, browser) {
    createTestCafe('localhost', 1337 + iteration, 1338 + iteration)
        .then(function (tc) {
            cafeRunner = tc;
            const runner = tc.createRunner();
            return runner
                .src('./cucumbertest.js')
                .screenshots('reports/screenshots/', true)
                .browsers(browser)
                .run();
        });
}
// Setting the default time out value
setDefaultTimeout(timeout);

Before(function () {
    runTest(n, this.setBrowser());
    createTestFile();
    n += 2;
    return this.waitForTestController.then(function (testController) {
        return testController.maximizeWindow();
    });
});
// After hook runs after each Cucumber test. It is used to unlink the test and make testController "null".
// It calls the testControllerHolder.free function. 
After(function () {
    fs.unlinkSync('cucumbertest.js');
    testControllerHolder.free();
});
After(async function (testCase) {
    const world = this;
    if (testCase['result']['status'] === Status.FAILED) {
        isTestCafeError = true;
        attachScreenshotToReport = world.attachScreenshotToReport;
        errorHandling.addErrorToController();
        await errorHandling.ifErrorTakeScreenshot(testController)
    }
});
// AfterAll hook runs after all the tests execution. It check the last runs status to be "test-done-confirmation",
// and then, close the cafeRunner and exit the process.
// It checks with a wait timeout of 500.
AfterAll(function () {
    let intervalId = null;
    function waitForTestCafe() {
        intervalId = setInterval(checkLastResponse, 500);
    }
    function checkLastResponse() {
        if (testController.testRun.lastDriverStatusResponse === 'test-done-confirmation') {
            cafeRunner.close();
            process.exit();
        }
    }
    waitForTestCafe();
});

const getIsTestCafeError = function () {
    return isTestCafeError;
};

const getAttachScreenshotToReport = function (path) {
    return attachScreenshotToReport(path);
};
exports.getIsTestCafeError = getIsTestCafeError;
exports.getAttachScreenshotToReport = getAttachScreenshotToReport;
