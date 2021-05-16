const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(bodyParser.json());

const publicVapidKey = 'BKhQg9WxKG5N7TSV6JgKDOWKhYbGwXRvQTCH_T2qo-0oY9LNBW4GhKXeVeaE7yHqp70PuYka6l2WQ87oEYHwfIs';
const privateVapidKey = 'lyiBlA7VfT3WBkY2W9BJy2atYLGreM7-klaDNoOlxvk';

webPush.setVapidDetails('mailto:test@test.ru', publicVapidKey, privateVapidKey);

const originsWhitelist = [
    'http://localhost:7777'     //this is my front-end url for development

];
const corsOptions = {
    origin: function(origin, callback){
        console.log(origin);
        const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        console.log(isWhitelisted);
        callback(null, isWhitelisted);
    },
    credentials:true
}
app.options('*', cors(corsOptions));


app.post('/subscribe', cors(corsOptions), (req, res) => {
    // Get Push Subscription Object
    const subscription = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({title: 'push test!'});


    webPush.sendNotification(subscription, payload).catch(err => console.error(err));
})

app.get('/test', cors(corsOptions), (req, res) => {
    res.status(201).json({text: "ok, gotcha"});
})

const port = 3000;
app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port: ${port}`);
})