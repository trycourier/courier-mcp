# Install Courier iOS SDK

## Installation

Add Courier SDK to your Podfile:
```ruby
pod 'Courier_iOS'
```

## Authentication

```swift
Task {
    await Courier.shared.signIn(userId: "your_user_id", accessToken: "your_users_jwt") // The user's jwt should be generated on your backend.
}
```

## Inbox

```swift
import Courier_iOS

let inbox = CourierInboxView(
  didClickInboxMessageAtIndex: { message, index in
    message.isRead ? message.markAsUnread() : message.markAsRead()
    print(index, message)
  }
)
```

## Preferences

```swift
import Courier_iOS

let preferences = CourierPreferencesView(
  mode: .topic
)
```

## Documentation

All documentation: https://github.com/trycourier/courier-ios
