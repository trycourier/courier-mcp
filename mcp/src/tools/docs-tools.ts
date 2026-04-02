import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

const INSTALLATION_GUIDES: Record<string, string> = {
  nodejs: `# Courier Node.js SDK Installation

## Install
\`\`\`bash
npm install @trycourier/courier
\`\`\`

## Quick Start
\`\`\`typescript
import Courier from "@trycourier/courier";

const courier = new Courier({ apiKey: "YOUR_API_KEY" });

const response = await courier.send.message({
  message: {
    to: { user_id: "user-123" },
    template: "YOUR_TEMPLATE_ID",
    data: { name: "World" },
  },
});
console.log(response.requestId);
\`\`\`

## Links
- npm: https://www.npmjs.com/package/@trycourier/courier
- Docs: https://www.courier.com/docs/sdk-libraries/node/
- GitHub: https://github.com/trycourier/courier-node`,

  python: `# Courier Python SDK Installation

## Install
\`\`\`bash
pip install trycourier
\`\`\`

## Quick Start
\`\`\`python
import courier
from courier import Courier

client = Courier(api_key="YOUR_API_KEY")

response = client.send.message(
    message={
        "to": {"user_id": "user-123"},
        "template": "YOUR_TEMPLATE_ID",
        "data": {"name": "World"},
    }
)
print(response.request_id)
\`\`\`

## Links
- PyPI: https://pypi.org/project/trycourier/
- Docs: https://www.courier.com/docs/sdk-libraries/python/
- GitHub: https://github.com/trycourier/courier-python`,

  react: `# Courier React SDK Installation

## Install
\`\`\`bash
npm install @trycourier/courier-react
\`\`\`

## Quick Start
\`\`\`tsx
import { useCourier, CourierInbox } from "@trycourier/courier-react";

function App() {
  const { client } = useCourier({ jwt: "YOUR_JWT_TOKEN" });
  return <CourierInbox client={client} />;
}
\`\`\`

## JWT Authentication
React SDK requires a JWT token for client-side auth. Generate one with the \`generate_jwt_for_user\` tool.

## Links
- npm: https://www.npmjs.com/package/@trycourier/courier-react
- Docs: https://www.courier.com/docs/sdk-libraries/react/
- GitHub: https://github.com/trycourier/courier-react`,

  ios: `# Courier iOS SDK Installation

## Install (Swift Package Manager)
Add to your Package.swift or via Xcode:
\`\`\`
https://github.com/trycourier/courier-ios
\`\`\`

## Quick Start
\`\`\`swift
import Courier_iOS

Courier.shared.signIn(
  userId: "user-123",
  accessToken: "YOUR_JWT_TOKEN"
)
\`\`\`

## JWT Authentication
iOS SDK requires a JWT token. Generate one with the \`generate_jwt_for_user\` tool.

## Links
- Docs: https://www.courier.com/docs/sdk-libraries/ios/
- GitHub: https://github.com/trycourier/courier-ios`,

  android: `# Courier Android SDK Installation

## Install (Gradle)
\`\`\`groovy
implementation "com.courier:android:latest"
\`\`\`

## Quick Start
\`\`\`kotlin
Courier.initialize(context)
Courier.shared.signIn(
  userId = "user-123",
  accessToken = "YOUR_JWT_TOKEN"
)
\`\`\`

## JWT Authentication
Android SDK requires a JWT token. Generate one with the \`generate_jwt_for_user\` tool.

## Links
- Docs: https://www.courier.com/docs/sdk-libraries/android/
- GitHub: https://github.com/trycourier/courier-android`,

  flutter: `# Courier Flutter SDK Installation

## Install
\`\`\`bash
flutter pub add courier_flutter
\`\`\`

## Quick Start
\`\`\`dart
import 'package:courier_flutter/courier_flutter.dart';

await Courier.shared.signIn(
  userId: "user-123",
  accessToken: "YOUR_JWT_TOKEN",
);
\`\`\`

## JWT Authentication
Flutter SDK requires a JWT token. Generate one with the \`generate_jwt_for_user\` tool.

## Links
- pub.dev: https://pub.dev/packages/courier_flutter
- Docs: https://www.courier.com/docs/sdk-libraries/flutter/
- GitHub: https://github.com/trycourier/courier-flutter`,

  'react native': `# Courier React Native SDK Installation

## Install
\`\`\`bash
npm install @trycourier/courier-react-native
\`\`\`

## Quick Start
\`\`\`typescript
import Courier from "@trycourier/courier-react-native";

await Courier.shared.signIn({
  userId: "user-123",
  accessToken: "YOUR_JWT_TOKEN",
});
\`\`\`

## JWT Authentication
React Native SDK requires a JWT token. Generate one with the \`generate_jwt_for_user\` tool.

## Links
- npm: https://www.npmjs.com/package/@trycourier/courier-react-native
- Docs: https://www.courier.com/docs/sdk-libraries/react-native/
- GitHub: https://github.com/trycourier/courier-react-native`,
};

export class DocsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'courier_installation_guide',
  ];

  public register() {

    this.registerToolIfNeeded(
      DocsTools.tools[0],
      'Get the Courier SDK installation guide for a specific platform. For client-side SDKs (React, iOS, Android, Flutter, React Native), also generates a sample JWT.',
      {
        platform: z.enum([
          'nodejs', 'python', 'react', 'ios', 'android', 'flutter', 'react native'
        ]).describe('The platform to get installation guide for'),
        user_id: z.string().optional().describe('User ID for JWT generation (client-side SDKs only). Defaults to "example_user".'),
      },
      async ({ platform, user_id }) => {
        return handleToolCall(async () => {
          const guide = INSTALLATION_GUIDES[platform];
          if (!guide) throw new Error(`Unsupported platform: ${platform}`);

          const clientSdks = ['react', 'ios', 'android', 'flutter', 'react native'];
          if (clientSdks.includes(platform)) {
            const uid = user_id || 'example_user';
            const tokenResponse = await this.mcp.courier.auth.issueToken({
              scope: `user_id:${uid} write:user-tokens inbox:read:messages inbox:write:events read:preferences write:preferences read:brands`,
              expires_in: '1h',
            });
            return {
              guide,
              sample_jwt: {
                user_id: uid,
                token: tokenResponse.token,
                expires_in: '1h',
                note: 'This is a sample token. In production, generate tokens server-side.',
              },
            };
          }

          return { guide };
        });
      },
      { readOnlyHint: true }
    );
  }
}
