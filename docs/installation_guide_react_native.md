# Install Courier React Native SDK

## Installation

```sh
npm install @trycourier/react-native
```

## Authentication

```ts
import Courier from '@trycourier/react-native';

Courier.shared.signIn({
  accessToken: 'your_users_jwt', // This should be generated on your backend.
  userId: 'your_user_id',
});
```

## Courier Inbox

```ts
import Courier from '@trycourier/react-native';
import { CourierInbox } from '@trycourier/react-native';

<CourierInbox
  onClickInboxMessageAtIndex={(message, index) => {
    message.read ? Courier.shared.unreadMessage({ messageId: message.messageId }) : Courier.shared.readMessage({ messageId: message.messageId })
  }}
/>
```

## Courier Preferences

```ts
import { CourierPreferencesView } from '@trycourier/courier-react-native';

<CourierPreferences mode={{ type: 'topic' }} />
```

[All documentation](https://github.com/trycourier/courier-react-native)