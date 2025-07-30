import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class DocsTools extends CourierMcpTools {

  public register() {

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

        // Generate a JWT
        const jwt = await this.mcp.courierClient.authTokens.issueToken({
          scope: `user_id:${user_id} write:user-tokens inbox:read:messages inbox:write:events read:preferences write:preferences read:brands`,
          expires_in: '1h',
        });

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
              `.trim(),
            },
          ],
        };
      }
    );
  }
}