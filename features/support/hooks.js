// const fs = require('fs');
// const createTestCafe = require('testcafe');
const testControllerHolder = require('../support/testControllerHolder');
// const { AfterAll, setDefaultTimeout, Before, After, Status } = require('cucumber');
// const errorHandling = require('../support/errorHandling');
// const TIMEOUT = 20000;

const fs = require('fs');
const createTestCafe = require('testcafe');
// const testControllerHolder = require('./testControllerHolder');
const {AfterAll, setDefaultTimeout, Before, After} = require('cucumber');
const timeout = 100000;
// let cafeRunner = null;

let isTestCafeError = false;
let attachScreenshotToReport = null;
let cafeRunner = null;
let n = 0;

function createTestFile() {
        fs.writeFileSync('cucumbertest.js',
            'import testControllerHolder from "./features/support/testControllerHolder.js";\n\n' +
            'fixture("cucumberfixture")\n' +
            'test\n' +
            '("test", testControllerHolder.capture)')
    }
    // Create a runner function with configurations like src, screenshots, browsers.
    function runTest(browser) {
        createTestCafe('localhost', 1337, 1338)
            .then(function(tc) {
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
    /*
    50
    1. Before hook runs before each Cucumber test.
    51
    2. It calls the "runTest" function, which contains the runner configuration.
    52
    3. Then, it calls the "createTestFile" function. It generates a dummy file, cucumbertest.js, behaving as the source of the tests.
    53
    4. Then, it calls the waitForTestController of cucumberWorld.js to add testController to Cucumber’s world scope.
    54
    5. Then, it also maximizes the test controller window.
    55
    */
    Before(function() {
        runTest('chrome');
        createTestFile();
        return this.waitForTestController.then(function(testController) {
            return testController.maximizeWindow();
        });
    });
    // After hook runs after each Cucumber test. It is used to unlink the test and make testController "null".
    // It calls the testControllerHolder.free function. 
    After(function() {
        fs.unlinkSync('cucumbertest.js');
        testControllerHolder.free();
    });
    // AfterAll hook runs after all the tests execution. It check the last runs status to be "test-done-confirmation",
    // and then, close the cafeRunner and exit the process.
    // It checks with a wait timeout of 500.
    AfterAll(function() {
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
// exports.getIsTestCafeError = getIsTestCafeError;
// exports.getAttachScreenshotToReport = getAttachScreenshotToReport;
