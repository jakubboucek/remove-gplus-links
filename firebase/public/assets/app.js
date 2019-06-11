document.addEventListener('DOMContentLoaded', () => {
    const permissions = [
        'https://www.google.com/m8/feeds'
    ];

    const app = firebase.app();
    let token;

    const auth = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        permissions.forEach((perm) => provider.addScope(perm));
        firebase.auth().signInWithPopup(provider).then((response) => {
            token = response.credential.accessToken;
            console.log(token);
        });

    };

    const vue = new Vue({
        el: '#app',
        data: {},
        methods: {
            signIn: auth
        }
    });


    const gs = new GoogleScript(
        "MPvwfpzrIThutAMpQ8yrDkl_VCDNGuL86",
        "**REDACTED**"
    );
    let contacts = new Contacts(gs);

    console.log(contacts.getAffectedContacts());

});

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
}
