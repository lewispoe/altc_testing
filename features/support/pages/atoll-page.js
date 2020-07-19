const {Selector} = require('testcafe');

// Selectors
const select = selector => Selector(selector).with({boundTestRun: testController})

exports.elems = {
    url: () =>'http://localhost:3000/',
};


const selectButton = async (text) => {
    const allButtons = Selector('button').with({boundTestRun: testController});
    const mapIt = async () => {
        const map = new Array(await allButtons.count).fill('').map(async (x, idx) => {const element = await allButtons.nth(idx).with({boundTestRun: testController});return {text: await element.with({boundTestRun: testController}).textContent, element: element}});
        return await Promise.all(map);
    };
    let list = await mapIt();
    return getElement(list, text, 'button');
}
