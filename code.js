// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 256, height: 504 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    const unitsNumber = 0;
    const tensNumber = 1;
    const hundredsNumber = 2;
    const thousandsNumber = 3;
    var numberSize = 0;
    if (msg.type === 'submit-layers') {
        const nodes = [];
        var numberOfSelectedLayers = 0;
        var numberOfTextLayers = 0;
        for (const node of figma.currentPage.selection) {
            numberOfSelectedLayers++;
            if (node.type === "TEXT") {
                numberOfTextLayers++;
                if (node.hasMissingFont) {
                    figma.notify("One of your selected text layers has missing fonts.", { error: true, timeout: 12500 });
                }
                node.fontName; // Output: figma.mixed
                node.getRangeFontName(0, 1); // Output: { family: 'Inter', style: 'Bold' }
                // node.getRangeFontName(5, 11) // Output: { family: 'Inter', style: 'Regular' }
                // node.getRangeFontName(4, 6) // Output: figma.mixed
                node.getStyledTextSegments(['fontName']);
                yield Promise.all(node.getRangeAllFontNames(0, node.characters.length)
                    .map(figma.loadFontAsync));
                let msgSize = msg.sizeOfNumber;
                if (msgSize == "units") {
                    numberSize = unitsNumber;
                }
                else if (msgSize == "tens") {
                    numberSize = tensNumber;
                }
                else if (msgSize == "hundreds") {
                    numberSize = hundredsNumber;
                }
                else if (msgSize == "thousands") {
                    numberSize = thousandsNumber;
                }
                else { }
                let amount = getRandomAmount(numberSize, msg.hasDecimals);
                // Add comma to thousands number
                if (msgSize == "thousands") {
                    let insertAtPosition = 1;
                    let stringToInsert = ',';
                    let arrGivenString = [...amount];
                    arrGivenString.splice(insertAtPosition, 0, stringToInsert);
                    let output = arrGivenString.join('');
                    node.characters = (msg.hasCcyCode) ? msg.currencyCode + output : output;
                }
                else {
                    node.characters = (msg.hasCcyCode) ? msg.currencyCode + amount : amount;
                }
            }
            if (numberOfTextLayers === 0) {
                figma.notify("No text layers selected.", { error: true, timeout: 1250 });
            }
        }
        if (numberOfSelectedLayers === 0) {
            figma.notify("Please select a text layer.", { timeout: 1200 });
        }
        // figma.currentPage.selection = nodes;
        // figma.viewport.scrollAndZoomIntoView(nodes);
    }
    function getRandomAmount(size, hasDecimals) {
        var precision = 0;
        var multiplier = 0;
        if (size == unitsNumber) {
            precision = (hasDecimals) ? 100 : 1;
            multiplier = 1;
        }
        else if (size == tensNumber) {
            precision = (hasDecimals) ? 1000 : 10;
            multiplier = 10;
        }
        else if (size == hundredsNumber) {
            precision = (hasDecimals) ? 10000 : 100;
            multiplier = 100;
        }
        else if (size == thousandsNumber) {
            precision = (hasDecimals) ? 100000 : 1000;
            multiplier = 1000;
        }
        else {
        }
        return (Math.floor(Math.random() * (10 * precision - 1 * precision) + 1 * precision) / (1 * precision) * multiplier).toFixed((hasDecimals) ? 2 : 0);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //figma.closePlugin();
});
