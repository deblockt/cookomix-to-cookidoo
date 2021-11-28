// ==UserScript==
// @name            Import des recette cookomix dans cookidoo
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     Permet d'importer les recette de cookimix dans les recette de cookidoo
// @author          deblockt
// @match           https://cookidoo.fr/created-recipes/*
// @exclude         *
// @icon            https://www.google.com/s2/favicons?domain=cookidoo.fr
// @grant           none
// @license         Apache License 2.0 http://www.apache.org/licenses/
// @copyright       2021, Thomas Deblock
// @homepageURL     https://github.com/deblockt/cookomix-to-cookidoo
// @supportURL      https://github.com/deblockt/cookomix-to-cookidoo/issues
// @contributionURL https://github.com/deblockt/cookomix-to-cookidoo
// @updateURL       https://openuserjs.org/meta/deblock.thomas.62gmail.com/cookomix-importer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('cookimix importer. OK')
    let genericErrorNode = document.querySelector('div[error-code=generic]');
    let newErrorNode = genericErrorNode.cloneNode(true)
    newErrorNode.attributes['error-code'].value = 'CookomiximportIssue'
    newErrorNode.hidden = true
    newErrorNode.querySelector('h2').innerText = 'La recette n\'a pas pu être importée'
    newErrorNode.querySelector('p').innerText = 'Vous n\êtes pas connecté avec le service d\'import cookomix. Merci de vous reconnecter à cookidoo. Si cela ne marche pas après vous être reconnecté, vérifiez que vous n\'utilisez pas un bloquer de publicité'
    document.querySelector('cr-error-modal .core-scrollbar__content').append(newErrorNode)

    function isLogged() {
        return fetch('https://cookimix-exporter.herokuapp.com/is-logged',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include',
            }
        ).then(function(response) {
            return response.json().then(json => json.is_logged)
        })
    }

    let importButton = document.querySelector('core-modal[trigger-id=import-button] button[type=submit]')
    if (importButton) {
        importButton.addEventListener('click', function (event) {
            let urlValue = document.getElementById('recipe_url').value;

            if (urlValue.match('https://www\\.cookomix\\.com/.*')) {
                importButton.disabled = true
                importButton.ariaBusy = true
                isLogged().then(function(isLogged) {
                    if (isLogged) {
                        fetch('https://cookimix-exporter.herokuapp.com/import', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            mode: 'cors',
                            credentials: 'include',
                            body: JSON.stringify({ url: urlValue })
                        }).then(function(response) {
                            response.json().then(function (json) { location.href = json.cookidoo_url })
                        })
                    } else {
                        document.querySelector('core-modal[trigger-id=import-button]').close()
                        importButton.ariaBusy = false
                        importButton.disabled = false
                        document.querySelector('cr-error-modal')._renderError();
                        genericErrorNode.hidden = true
                        newErrorNode.hidden = false
                    }
                })

                event.preventDefault();
            }
        })
    }
})();
