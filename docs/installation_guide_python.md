# Install Courier Python SDK

## Installation

```sh
pip install courier
```

## Send a Notification

```python
from courier import Courier

// You can get your auth token here: https://app.courier.com/settings/api-keys
client = Courier(auth_token="YOUR_AUTH_TOKEN")

resp = client.send_message(
    message={
        "to": {
            "user_id": "${user_id}"
        },
        "content": {
            "title": "Hello from Courier!",
            "body": "This is a test notification."
        },
        "routing": {
            "method": "single",
            "channels": ["push"]
        }
    }
)
print(resp)
```
