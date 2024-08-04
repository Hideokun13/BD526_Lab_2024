const https = require('https');
const querystring = require('querystring');

exports.handler = async (event) => {
    // console.log("Received event:", JSON.stringify(event, null, 2));

    const message = event;
    const nodeID = message.NodeID;
    const temperature = message.Temperature;
    const humidity = message.Humidity;

    const lineNotifyToken = 'YOUR_LINE_NOTIFY_TOKEN';
    const lineNotifyApi = 'https://notify-api.line.me/api/notify';

    const postData = querystring.stringify({
        'message': `\nNodeID: ${nodeID}\nTemperature: ${temperature}°C\nHumidity: ${humidity}%`
    });

    const options = {
        hostname: 'notify-api.line.me',
        path: '/api/notify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + lineNotifyToken,
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify('Notification sent!')
                });
            });
        });

        req.on('error', (e) => {
            console.error(e);
            reject({
                statusCode: 500,
                body: JSON.stringify('Failed to send notification')
            });
        });

        req.write(postData);
        req.end();
    });
};
