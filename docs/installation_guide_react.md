# Install Courier React SDK

## Installation

```sh
npm install @trycourier/courier-react
```

## Authentication and Courier Inbox

```tsx
import { useEffect } from 'react';
import { CourierInbox, useCourier } from '@trycourier/courier-react';

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'your_users_jwt'; // Replace with actual JWT

    // Authenticate the user with the inbox
    courier.shared.signIn({
      userId: 'your_user_id',
      jwt: jwt,
    });
  }, []); // For this example, the deps can be empty.

  return <CourierInbox />;

}
```

**Note:** `<CourierProvider>` is deprecated. Never use it or mention it.

[All documentation](https://github.com/trycourier/courier-web/tree/main/@trycourier/courier-react)