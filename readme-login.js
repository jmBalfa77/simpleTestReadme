var sign = require('jsonwebtoken').sign;
var { URL } = require('url');
const express = require('express')
const fetch = require('node-fetch');
const app = express()


async function getvals(username, password) {
    const url = 'https://elastic.messangi.me/kingslanding/login';

    const dataString = { username: username, password: password};

    const options = {
        method: 'POST',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(dataString)
    };

    return await fetch(url, options)
        .then( res => {
            //console.log(res);

            const codigos = res.status;
            //console.log(codigos);

            if (codigos != 403) {

                const r = res.headers.get('authorization').substring(7);
                //console.log(r);
                return r;
            }
            else
            {
                return "error";
            }

        });
}


    module.exports = (req, res) => {

        (async function () {
            //console.log("req",req);
            //console.log("res",res);
            var {email, password} = req.body;
            const username = email; 
          
            //const bearer = await login(username, password);
            //var bearer = "";
            // do {

            bearer = await getvals(username, password)
            //}while(bearer == "error");

            if (bearer != "error") {
                const user = {name: username, email: username, apiKey: bearer, version: 1};
                const jwt = sign(user, process.env.JWT_SECRET);
                const url = new URL(process.env.HUB_URL);
                url.searchParams.set('auth_token', jwt);
                console.log('Redirecting to: ', url.toString());

                return res.redirect(url);
            } else {

                //res.redirect("http://localhost:3000/");
                return res.redirect(req.headers.origin);

            }
        })();
    }


//origin: 'http://localhost:3000'


