# Install Courier Android SDK

## Add Courier SDK to your build.gradle:

```gradle
dependencies {
    implementation 'com.github.trycourier:courier-android:5.2.12' // Groovy
    implementation("com.github.trycourier:courier-android:5.2.12") // Gradle.kts
}
```

## Initialize Courier

```kotlin
class YourApplication: Application() {
  override fun onCreate() {
    super.onCreate()
    Courier.initialize(this) // This should be done in your Application or Activity class.
  }
}
```

## Authentication

```kotlin
import com.courier.android.Courier

Courier.shared.signIn(
  accessToken = "your_users_jwt", // This should be generated on your backend.
  userId = "your_user_id"
)
```

## Courier Inbox

```xml
<com.courier.android.ui.inbox.CourierInbox xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/courierInbox"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

## Courier Preferences

```xml
<com.courier.android.ui.preferences.CourierPreferencesView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/courierPreferences"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:mode="topic"
/>
```

[All documentation](https://github.com/trycourier/courier-android)