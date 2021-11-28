// ==UserScript==
// @name            Import des recette cookomix dans cookidoo [ partie login ]
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     Permet d'importer les recette de cookimix dans les recette de cookidoo
// @author          deblockt
// @match           https://login.vorwerk.com/account/login*
// @exclude         *
// @icon            https://www.google.com/s2/favicons?domain=cookidoo.fr
// @grant           none
// @license         Apache-2.0
// @copyright       2021, Thomas Deblock
// @homepageURL     https://github.com/deblockt/cookomix-to-cookidoo
// @supportURL      https://github.com/deblockt/cookomix-to-cookidoo/issues
// @contributionURL https://github.com/deblockt/cookomix-to-cookidoo
// @updateURL       https://github.com/deblockt/cookomix-to-cookidoo/edit/main/cookomix-importer.js
// ==/UserScript==


(function() {
    'use strict';

    let submitButton = document.getElementById('j_submit_id')

    submitButton.addEventListener('click', function(event) {
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value

        fetch('https://cookimix-exporter.herokuapp.com//login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({'username': email, 'password': password})
        }).then((response) => {
           document.getElementById('j_login_form_id').submit()
        })
        event.preventDefault()
    })
})();
