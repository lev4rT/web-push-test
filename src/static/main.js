/**
 *
 * @class AjaxModule
 * @classdesc This class uses only by his private methods.
 * Responsible for communication with backend via Ajax.
 */

const csrfTokenMinutesValid = 15;
const secondsInMinute = 60;
const millisecondsInSecond = 1e3;

/**
 * @description AJAX interaction class
 */
class AjaxModule {
    /**
     *
     * @param {Object} ajaxArgs Arguments for ajax GET method
     * @return {Promise<Response<*, Record<string, *>, number>>}
     */
    static getUsingFetch = (ajaxArgs) => {
        return this.#usingFetch({method: 'GET', ...ajaxArgs});
    }

    /**
     *
     * @param {Object} ajaxArgs Arguments for ajax POST method
     * @return {Promise<Response<*, Record<string, *>, number>>}
     */
    static postUsingFetch = (ajaxArgs) => {
        return this.#usingFetch({method: 'POST', ...ajaxArgs});
    }

    /**
     *
     * @param {Object} ajaxArgs Arguments for ajax DELETE method
     * @return {Promise<Response<*, Record<string, *>, number>>}
     */
    static deleteUsingFetch = (ajaxArgs) => {
        return this.#usingFetch({method: 'DELETE', ...ajaxArgs});
    }

    /**
     *
     * @param {Object} ajaxArgs Arguments for ajax PUT method
     * @return {Promise<Response<*, Record<string, *>, number>>}
     */
    static putUsingFetch = (ajaxArgs) => {
        return this.#usingFetch({method: 'PUT', ...ajaxArgs});
    }


    /**
     *
     * @param {Object} ajaxArgs arguments for ajax
     * @return {Promise<Response>}
     * @description all these functions above using this private function to communicate with backend.
     */
    static #usingFetch = async(ajaxArgs) => {
        if (!ajaxArgs.data && ajaxArgs.body) {
            ajaxArgs.body = JSON.stringify(ajaxArgs.body);
        }

        const init = {
            method: ajaxArgs.method,
            body: (ajaxArgs.body) ? ajaxArgs.body : null,
            credentials: 'include',
            mode: 'cors',
        };

        if (ajaxArgs.data) {
            init['enctype'] = 'multipart/form-data';
        } else {
            init['headers'] = {
                'Content-Type': 'application/json',
            };
        }

        return fetch(ajaxArgs.url, init);
    }
}

// register SW, register push, send push
async function send() {
    console.log('register SW');
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });
    console.log('SW Registered', register);

    console.log('Registering push');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    console.log('push Registered');


    console.log('Sending Push');
    await AjaxModule.postUsingFetch({
        url: 'http://localhost:3000/subscribe',
        body: subscription,
    })
    console.log("Push Sent...");
}

const publicVapidKey = 'BKhQg9WxKG5N7TSV6JgKDOWKhYbGwXRvQTCH_T2qo-0oY9LNBW4GhKXeVeaE7yHqp70PuYka6l2WQ87oEYHwfIs';

if ('serviceWorker' in navigator) {
    send().catch(err => console.error(err));
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

document.getElementById('button-push').addEventListener('click', (evt) => {
    evt.preventDefault();
    AjaxModule.getUsingFetch({
        url: "http://localhost:3000/test",
    }).then((response) => {
        return response.json();
    }).then((response) => {
        console.log(response)
    }).catch((err) => console.log(err))
})