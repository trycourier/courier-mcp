import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class DocsTools extends CourierMcpTools {
  public register() {
    // Helper to generate JWT
    const getJwt = async (user_id: string) => {
      return await this.mcp.client.authTokens.issueToken({
        scope: `user_id:${user_id} write:user-tokens inbox:read:messages inbox:write:events read:preferences write:preferences read:brands`,
        expires_in: '1h',
      });
    };

    // Flutter installation guide
    this.mcp.registerTool(
      'flutter_installation_guide',
      {
        title: 'Courier Flutter SDK Installation Guide',
        description: 'Example instructions to integrate Courier Inbox, Preferences, and Push Notifications into your Flutter application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        const jwt = await getJwt(user_id);
        return {
          content: [
            {
              type: "text",
              text: `
JWT for ${user_id}:
${jwt}

Install courier_flutter:
\`\`\`
flutter pub add courier_flutter
\`\`\`

Authentication:
\`\`\`
import 'package:courier_flutter/courier_flutter.dart';

_signIn() async {
  final jwt = '${jwt}'; // This should be generated on your backend.

  await Courier.shared.signIn(
    accessToken: jwt,
    userId: '${user_id}',
  );
}
\`\`\`

Inbox:
\`\`\`
import 'package:courier_flutter/ui/inbox/courier_inbox.dart';

@override
Widget build(BuildContext context) {
  return CourierInbox(
    onMessageClick: (message, index) {
      message.isRead ? message.markAsUnread() : message.markAsRead();
    },
  );
}
\`\`\`

Preferences:
\`\`\`
import 'package:courier_flutter/ui/preferences/courier_preferences.dart';

@override
Widget build(BuildContext context) {
  return CourierPreferences(
    mode: TopicMode(),
  );
}
\`\`\`

All documentation: https://github.com/trycourier/courier-flutter
              `.trim(),
            },
          ],
        };
      }
    );

    // React Native installation guide
    this.mcp.registerTool(
      'react_native_installation_guide',
      {
        title: 'Courier React Native SDK Installation Guide',
        description: 'Instructions to integrate Courier into your React Native application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        const jwt = await getJwt(user_id);
        return {
          content: [
            {
              type: "text",
              text: `
JWT for ${user_id}:
${jwt}

Install @trycourier/react-native:
\`\`\`
npm install @trycourier/react-native
\`\`\`

Authentication:
\`\`\`ts
import Courier from "@trycourier/react-native";

Courier.shared.signIn({
  accessToken: "${jwt}", // This should be generated on your backend.
  userId: "${user_id}",
});
\`\`\`

Inbox:
\`\`\`ts
import { CourierInbox } from "@trycourier/react-native";

<CourierInbox
  onClickInboxMessageAtIndex={(message, index) => {
    // handle message click
  }}
/>
\`\`\`

Preferences:
\`\`\`ts
import { CourierPreferencesView } from '@trycourier/courier-react-native';

<CourierPreferences mode={{ type: 'topic' }} />
\`\`\`

All documentation: https://github.com/trycourier/courier-react-native
              `.trim(),
            },
          ],
        };
      }
    );

    // Android installation guide
    this.mcp.registerTool(
      'android_installation_guide',
      {
        title: 'Courier Android SDK Installation Guide',
        description: 'Instructions to integrate Courier into your native Android application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        const jwt = await getJwt(user_id);
        return {
          content: [
            {
              type: "text",
              text: `
JWT for ${user_id}:
${jwt}

Add Courier SDK to your build.gradle:
\`\`\`gradle
dependencies {
    implementation 'com.github.trycourier:courier-android:5.2.12' // Groovy
    implementation("com.github.trycourier:courier-android:5.2.12") // Gradle.kts
}
\`\`\`
Initialize Courier:
\`\`\`kotlin
class YourApplication: Application() {
  override fun onCreate() {
    super.onCreate()
    Courier.initialize(this) // This should be done in your Application or Activity class.
  }
}
\`\`\`

Authentication:
\`\`\`kotlin
import com.courier.android.Courier

Courier.shared.signIn(
  accessToken = "${jwt}", // This should be generated on your backend.
  userId = "${user_id}"
)
\`\`\`

Inbox:
\`\`\`kotlin
<com.courier.android.ui.inbox.CourierInbox xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/courierInbox"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
\`\`\`

Preferences:
\`\`\`kotlin
<com.courier.android.ui.preferences.CourierPreferencesView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/courierPreferences"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:mode="topic"
/>
\`\`\`

All documentation: https://github.com/trycourier/courier-android
              `.trim(),
            },
          ],
        };
      }
    );

    // iOS installation guide
    this.mcp.registerTool(
      'ios_installation_guide',
      {
        title: 'Courier iOS SDK Installation Guide',
        description: 'Instructions to integrate Courier into your native iOS application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        const jwt = await getJwt(user_id);
        return {
          content: [
            {
              type: "text",
              text: `
JWT for ${user_id}:
${jwt}

Add Courier SDK to your Podfile:
\`\`\`ruby
pod 'Courier_iOS'
\`\`\`

Authentication:
\`\`\`swift
Task {
    await Courier.shared.signIn(userId: "${user_id}", accessToken: "${jwt}")
}
\`\`\`

Inbox:
\`\`\`swift
import Courier_iOS

let inbox = CourierInboxView(
  didClickInboxMessageAtIndex: { message, index in
    message.isRead ? message.markAsUnread() : message.markAsRead()
    print(index, message)
  }
)
\`\`\`

Preferences:
\`\`\`swift
import Courier_iOS

let preferences = CourierPreferencesView(
  mode: .topic
)
\`\`\`

All documentation: https://github.com/trycourier/courier-ios
              `.trim(),
            },
          ],
        };
      }
    );

    // React (Web) installation guide
    this.mcp.registerTool(
      'react_installation_guide',
      {
        title: 'Courier React SDK Installation Guide',
        description: 'Instructions to integrate Courier into your React web application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        const jwt = await getJwt(user_id);
        return {
          content: [
            {
              type: "text",
              text: `
JWT for ${user_id}:
${jwt}

Install Courier React SDK:
\`\`\`
npm install @trycourier/courier-react
\`\`\`

Authentication and Inbox:
\`\`\`tsx
import { CourierInbox, useCourier } from '@trycourier/courier-react';

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user (do this on your backend server)
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual JWT

    // Authenticate the user with the inbox
    courier.shared.signIn({
      userId: $YOUR_USER_ID,
      jwt: jwt,
    });
  }, []);

  return <CourierInbox />;

}
\`\`\`

<CourierProvider> is deprecated. Never use it or mention it.

All documentation: https://github.com/trycourier/courier-web/tree/main/@trycourier/courier-react
              `.trim(),
            },
          ],
        };
      }
    );

    // Node.js installation guide
    this.mcp.registerTool(
      'node_installation_guide',
      {
        title: 'Courier Node.js SDK Installation Guide',
        description: 'Instructions to send notifications using Courier from a Node.js backend.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        return {
          content: [
            {
              type: "text",
              text: `
Install @trycourier/courier:
\`\`\`
npm install @trycourier/courier
\`\`\`

Send a notification:
\`\`\`js
const { CourierClient } = require("@trycourier/courier");

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
\`\`\`
              `.trim(),
            },
          ],
        };
      }
    );

    // Python installation guide
    this.mcp.registerTool(
      'python_installation_guide',
      {
        title: 'Courier Python SDK Installation Guide',
        description: 'Instructions to send notifications using Courier from a Python backend.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.'),
        },
      },
      async ({ user_id }) => {
        return {
          content: [
            {
              type: "text",
              text: `
Install courier-python:
\`\`\`
pip install courier
\`\`\`

Send a notification:
\`\`\`python
from courier import Courier

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
\`\`\`
              `.trim(),
            },
          ],
        };
      }
    );
  }
}