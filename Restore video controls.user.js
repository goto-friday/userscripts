// ==UserScript==
// @name         Restore video controls
// @namespace    http://tampermonkey.net/
// @version      1
// @description  https://drewdevault.com/2021/06/27/You-cant-capture-the-nuance.html
// @author       You
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fixControls(video) {
        if (video.style.objectFit == 'cover') {
            // It's in a story; controls aren't useful
            return;
        }

        video.parentElement.querySelector('div').style.display = 'none';

        const tagsLabel = document.querySelector('svg[aria-label="Tags"]')
        if (tagsLabel) {
            const tagsBtn = tagsLabel.parentElement.parentElement.parentElement; // ugly
            tagsBtn.style.top = 0;
            tagsBtn.style.bottom = 'unset';
            tagsBtn.style.display = 'unset';

            video.insertAdjacentElement('afterend', tagsBtn);
        }

        const muteBtn = document.querySelector('button[aria-label="Toggle audio"]');
        if (!muteBtn.querySelector('svg[aria-label="Video has no audio"]')) {
            muteBtn.click();
        }

        // Without the following the video gets repeatedly muted
        // For some reason this only works when wrapped in setTimeout...
        setTimeout(() => {
            if (video.muted) {
                const video2 = document.createElement('video');
                video2.style.display = 'none';
                video.insertAdjacentElement('afterend', video2);
            }
        });

        video.controls = true;
    }

    const video = document.querySelector('video');

    if (video) {
        // Video is displayed at top of page upon load
        fixControls(video);
    }

    // Else video is presented in popup upon user clicking on thumbnail
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    checkNode(node);
                });
            }
        }
    });

    function checkNode(node) {
        if (node.nodeName === 'VIDEO') {
            fixControls(node);
        } else {
            // Only expecting one video element
            node.childNodes.forEach(childNode => {
                checkNode(childNode);
            });
        }
    }

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();