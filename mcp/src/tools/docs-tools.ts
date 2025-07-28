import Http from "../http.js";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class DocsTools extends CourierMcpTools {

  public register() {
    // Flutter documentation tools
    this.server.tool(
      'flutter_readme',
      'Details about the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/README.md',
          responseType: 'text',
        });
      }
    );

    this.server.tool(
      'flutter_authentication_guide',
      'Authentication guide for the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/1_Authentication.md',
          responseType: 'text',
        });
      }
    );

    this.server.tool(
      'flutter_inbox_guide',
      'Inbox guide for the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/2_Inbox.md',
          responseType: 'text',
        });
      }
    );

    this.server.tool(
      'flutter_push_notifications_guide',
      'Push notifications guide for the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/3_PushNotifications.md',
          responseType: 'text',
        });
      }
    );

    this.server.tool(
      'flutter_preferences_guide',
      'Preferences guide for the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/4_Preferences.md',
          responseType: 'text',
        });
      }
    );

    this.server.tool(
      'flutter_client_guide',
      'API Client guide for the Courier Flutter SDK.',
      {},
      async () => {
        return await Http.get({
          url: 'https://raw.githubusercontent.com/trycourier/courier-flutter/master/Docs/5_Client.md',
          responseType: 'text',
        });
      }
    );
  }
}