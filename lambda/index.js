'use strict';
const Alexa = require('alexa-sdk');
const https = require('https');
const fetch = require('node-fetch');
let url ='https://api.btcmarkets.net/market/ETH/AUD/tick';

const APP_ID = undefined;

const SKILL_NAME = 'crypto tracker';
const HELP_MESSAGE = 'Crypto tracker gives you the value in AUD of a selected group of cryptocurrencies being traded on BTC Markets... what can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Thanks for using crypto tracker, Goodbye!';
const SALES_REPROMPT = `Would you like to ask another question?`;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'NewSession': function () {
        console.log('New Session Request');
        this.emit(':ask', 'Welcome to Crypto Tracker! You can ask me what the latest Bitcoin price is.', 'Would you like to get the price of a cryptocurrency?');
    },

    'LaunchRequest': function () {
        console.log('Launch Request');
        this.emit('NewSession');
    },
    'PricingIntent': function () {
        console.log('Price Request');
        const cryptoValue = this.event.request.intent.slots.crypto.value;
        console.log('The Crypto is: '+JSON.stringify(cryptoValue));

        switch(cryptoValue) {
            case 'ethereum' || 'ETH' || 'Ethereum':
                console.log('switch - ethereum');
                url = 'https://api.btcmarkets.net/market/ETH/AUD/tick';
                break;
            case 'bitcoin' || 'BTC' || 'Bitcoin':
            console.log('switch - ethereum');
                url = 'https://api.btcmarkets.net/market/BTC/AUD/tick';
                break;
            default:
            console.log('switch - default');
                url = 'https://api.btcmarkets.net/market/ETC/AUD/tick';
        }

        fetch(url)
        .then(res => res.json())
        .then(json => {console.log(json),
            this.emit(':ask', `The crypto value is ${json.lastPrice}`, 'would you like to hear another cryptocurrency price?')
        }
        )
        .catch(error => {
            console.log(error);
        });

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
