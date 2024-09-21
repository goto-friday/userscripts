// ==UserScript==
// @name         Disable dblclick
// @namespace    http://tampermonkey.net/
// @version      2024-09-21
// @description  disable "double click to like" behavior
// @author       You
// @match        https://www.instagram.com/direct/t/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const matchStr = 'div[aria-label="Double tap to like"]';

    function disableDblClick(elem) {
        elem.addEventListener('dblclick', event => {
            event.stopImmediatePropagation();
            event.preventDefault();
        }, true);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches(matchStr)) {
                    disableDblClick(node);
                } else if (node.nodeType === 1 && node.querySelector(matchStr)) {
                    node.querySelectorAll(matchStr).forEach(disableDblClick);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();