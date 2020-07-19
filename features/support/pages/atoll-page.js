const {Selector} = require('testcafe');

// Selectors
const select = selector => Selector(selector).with({boundTestRun: testController})
const selectWithExactText = (selector, text) => Selector(selector).withExactText(text).with({boundTestRun: testController})

const findAutocompleteChooser = async() => {
    const labelForInput = await findAnElementByTextContent('label', 'Enter station name');
    return labelForInput.parent().child('div').child('input');
}


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

function getElement(list, textContent, elementType) {
    const find = list.find(x => x.text === textContent);
    if (find) {
        console.log("I found the element for: <" + elementType + '> and content: ' + textContent);
        return find.element.with({boundTestRun: testController});
    } else {
        console.log("Failed to find the element for: <" + elementType + '> and content: ' + textContent);
        console.log(list.map(x => x.text));
    }
    throw "Unable to find element <" + elementType + ">,  with text: " + textContent;
}

async function findAnElementByTextContent(elementType, textContent) {
    const parentContainer = Selector(elementType).with({boundTestRun: testController});
    const mapDataByText = async () => {
        const map = new Array(await parentContainer.count).fill('').map(async (x, idx) => {const element = await parentContainer.nth(idx);return {text: await element.textContent, element: element}});
        return await Promise.all(map);
    };
    let list = await mapDataByText();
    return getElement(list, textContent, elementType);
}