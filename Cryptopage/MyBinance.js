const api = require(['binance'])
const binanceRest = new api.BinanceRest({
    key: 'api-key', // Get this from your account on binance.com
    secret: 'api-secret', // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false
    /*
     * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
     * default those keys will be replaced with more descriptive, longer ones.
     */
});

// You can use promises
binanceRest.allOrders({
        symbol: 'BNBBTC'  // Object is transformed into a query string, timestamp is automatically added
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

/*
 * Or you can provide a callback.  Also, instead of passing an object as the query, routes
 * that only mandate a symbol, or symbol and timestamp, can be passed a string.
 */
binanceRest.allOrders('BNBBTC', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});

/*
 * WebSocket API
 *
 * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
 * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
 * client if you want direct access(https://www.npmjs.com/package/ws).
 */
const binanceWS = new api.BinanceWS();

binanceWS.onDepthUpdate('BNBBTC', (data) => {
    console.log(data);
});

binanceWS.onAggTrade('BNBBTC', (data) => {
    console.log(data);
});

binanceWS.onKline('BNBBTC', '1m', (data) => {
    console.log(data);
});

/*
 * onUserData requires an instance of BinanceRest in order to make the necessary startUserDataStream and
 * keepAliveUserDataStream calls.  The webSocket instance is returned by promise rather than directly
 * due to needing to request a listenKey from the server first.
 */
binanceWS.onUserData(binanceRest, (data) => {
        console.log(data);
    }, 60000) // Optional, how often the keep alive should be sent in milliseconds
    .then((ws) => {
        // websocket instance available here
    });
