# Install Courier Node SDK

## Installation

```sh
npm install @trycourier/courier
```

## Send a Notification

```js
const { CourierClient } = require("@trycourier/courier");

// You can get your auth token here: https://app.courier.com/settings/api-keys
const courier = CourierClient({ authorizationToken: "YOUR_AUTH_TOKEN" });

async function sendNotification() {
  await courier.send({
    message: {
      to: {
        user_id: "${user_id}"
      },
      content: {
        title: "Hello from Courier!",
        body: "This is a test notification."
      },
      routing: {
        method: "single",
        channels: ["push"]
      }
    }
  });
}
```
