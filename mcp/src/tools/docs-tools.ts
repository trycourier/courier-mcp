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
        const jwt = await this.mcp.courierClient2.authToken.issueToken({
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

    // // Flutter documentation tools
    // this.mcp.tool(
    //   'flutter_readme',
    //   'Details about the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/README.md',
    //       responseType: 'text',
    //     });
    //   }
    // );

    // this.mcp.tool(
    //   'flutter_authentication_guide',
    //   'Authentication guide for the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/1_Authentication.md',
    //       responseType: 'text',
    //     });
    //   }
    // );

    // this.mcp.tool(
    //   'flutter_inbox_guide',
    //   'Inbox guide for the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/2_Inbox.md',
    //       responseType: 'text',
    //     });
    //   }
    // );

    // this.mcp.tool(
    //   'flutter_push_notifications_guide',
    //   'Push notifications guide for the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/3_PushNotifications.md',
    //       responseType: 'text',
    //     });
    //   }
    // );

    // this.mcp.tool(
    //   'flutter_preferences_guide',
    //   'Preferences guide for the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/4_Preferences.md',
    //       responseType: 'text',
    //     });
    //   }
    // );

    // this.mcp.tool(
    //   'flutter_client_guide',
    //   'API Client guide for the Courier Flutter SDK.',
    //   {},
    //   async () => {
    //     return await Http.get({
    //       url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/5_Client.md',
    //       responseType: 'text',
    //     });
    //   }
    // );
  }
}