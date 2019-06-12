document.addEventListener('DOMContentLoaded', () => {
    const scriptId = "MPvwfpzrIThutAMpQ8yrDkl_VCDNGuL86";
    const permissions = [
        'https://www.google.com/m8/feeds'
    ];

    const app = new Vue(
        {
            el: '#app',
            data: {
                loading: true,
                signed: false,
                contactApi: null,
                contacts: [],
            },
            methods: {
                signIn: function() {
                    const vue = this;
                    vue.loading = true;
                    const auth = new AppLogin(permissions);
                    auth.login().then(token => {
                        const gs = new GoogleScript(scriptId, token);
                        vue.contactApi = new Contacts(gs);
                        vue.signed = true;
                    }).catch(error => {
                        throw error;
                    }).finally(()=>{
                        vue.loading = false;
                    });
                },
                loadContacts: function () {
                    const vue = this;
                    vue.loading = true;
                    vue.contactApi.getAffectedContacts().then(contacts=>{
                        vue.contacts = contacts;
                    }).catch(error => {
                        throw error;
                    }).finally(()=>{
                        vue.loading = false;
                    });
                }
            }
        }
    );

    app.loading = false;
});

class AppLogin {
    constructor(permissions) {
        this.permissions = permissions;
        this.isLogged = false;
    }

    async login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.permissions.forEach(perm => provider.addScope(perm));

        const response = await firebase.auth().signInWithPopup(provider);

        this.isLogged = true;
        return response.credential.accessToken;
    }
}

class Contacts {
    constructor(googleScript) {
        if (googleScript instanceof GoogleScript === false) {
            throw new Error("googleScript must be instance of GoogleScript");
        }

        this.gs = googleScript;
    }

    async getAffectedContacts() {
        return await this.gs.run('getAffectedContacts');
    }
}

class GoogleScript {
    constructor(scriptId, accessToken) {
        this.endpoint = "https://script.googleapis.com/v1/scripts/" + scriptId + ":run";
        this.accessToken = accessToken;
    }

    async run(method, parameters) {
        let bodyObj = {
            "function": method,
            "parameters": Array.isArray(parameters) ? parameters : [],
        };

        let response = await fetch(this.endpoint, {
            body: JSON.stringify(bodyObj),
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            redirect: 'error',
            referrer: 'client'
        });

        let body = await response.json();

        if (response.ok && body.done === true && body.hasOwnProperty('response')) {
            return body.response.result;
        } else {
            throw body;
        }
    }

    async test() {
        const token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const response = await this.run("checkConnectivity", [token]);
        if (response !== token) {
            throw new Error("Connection to GS API failed - connectivity return another token (cache?): " + response + " instead of " + token);
        }
        return true;
    }
}
