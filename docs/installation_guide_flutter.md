# Install Courier Flutter SDK

## Installation

```sh
flutter pub add courier_flutter
```

## Authentication

```dart
import 'package:courier_flutter/courier_flutter.dart';

_signIn() async {
  await Courier.shared.signIn(
    accessToken: 'your_users_jwt', // This should be generated on your backend.
    userId: 'your_user_id',
  );
}
```

## Courier Inbox

```dart
import 'package:courier_flutter/ui/inbox/courier_inbox.dart';

@override
Widget build(BuildContext context) {
  return CourierInbox(
    onMessageClick: (message, index) {
      message.isRead ? message.markAsUnread() : message.markAsRead();
    },
  );
}
```

## Courier Preferences

```dart
import 'package:courier_flutter/ui/preferences/courier_preferences.dart';

@override
Widget build(BuildContext context) {
  return CourierPreferences(
    mode: TopicMode(),
  );
}
```

[All documentation](https://github.com/trycourier/courier-flutter)