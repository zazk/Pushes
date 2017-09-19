let request = require("request");
var apn = require("apn");

// Set up apn with the APNs Auth Key
var apnProvider = new apn.Provider({
    token: {
        key: "AuthKey_72GUHT34Q7.p8", // Path to the key p8 file
        keyId: "72GUHT34Q7", // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
        teamId: "AT37MU8G47" // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
    },
    production: true // Set to true if sending a notification to a production iOS app
});

// Enter the device token from the Xcode console
var deviceToken =
    //"E2D3BCCFC52AC7F9F27C4D96AAAFF3FD2346EA1C0D8E1D393CDC00142998E33B"  ;
    "B9170F6AC8D39D84CFE61229F55E00A9A4823D748755C40C0C8180988C992163";

// Prepare a new notification
var notification = new apn.Notification();

// Specify your iOS app's Bundle ID (accessible within the project editor)
notification.topic = "com.cocoa.dev";

// Set expiration to 1 hour from now (in case device is offline)
notification.expiry = Math.floor(Date.now() / 1000) + 3600;

// Set app badge indicator
notification.badge = 3;

// Play ping.aiff sound when the notification is received
notification.sound = "ping.aiff";

// Display the following message (the actual notification text, supports emoji)
notification.alert = "App Notification Testing \u270C";

// Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
notification.payload = { id: 123 };

// Get the Tokens
var options = {
    url: "http://w.areminds.com/ids.txt",
    method: "GET",
    json: true
};

request(options, function(error, response, body) {
    if (error) {
        console.log(error);
    } else {
        let rows = body.split("\n");
        rows.forEach(token => {
            console.log("TOKEN", token);
            // Actually send the notification
            apnProvider.send(notification, token).then(function(result) {
                // Check the result for any failed devices
                console.log(result, result.failed);
            });
        });
        console.log(rows);
    }
});
