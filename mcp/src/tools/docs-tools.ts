import z from "zod";
import { CourierMcpTools } from "./tools.js";
import Http, { toText } from "../utils/http.js";
import { TextContent } from "../utils/types.js";

export class DocsTools extends CourierMcpTools {

  // Default user ID for the installation guides
  private readonly DEFAULT_USER_ID = 'example_user';

  private addJWT(user_id: string, jwt: string, content: TextContent): TextContent {
    return {
      content: [
        {
          type: 'text' as const,
          text: `${user_id} JWT Access Token: ${jwt}\n\n${content}`,
        },
      ],
    }
  }

  // Helper to generate JWT
  private async getJwt(user_id: string): Promise<string> {
    const res = await this.mcp.client.authTokens.issueToken({
      scope: `user_id:${user_id} write:user-tokens inbox:read:messages inbox:write:events read:preferences write:preferences read:brands`,
      expires_in: '1h',
    });
    return res.content[0].text;
  };

  private async getDocsWithJWT(url: string, user_id: string): Promise<TextContent> {
    const [res, jwt] = await Promise.all([
      Http.get({
        options: this.mcp.client.options,
        url: url,
      }),
      this.getJwt(user_id)
    ]);
    const text = await toText(res);
    return this.addJWT(user_id, jwt, text);
  }

  private async getDocs(url: string): Promise<TextContent> {
    const res = await Http.get({
      options: this.mcp.client.options,
      url: url,
    });
    return await toText(res);
  }

  public register() {

    // Flutter installation guide
    this.mcp.registerTool(
      'flutter_installation_guide',
      {
        title: 'Courier Flutter SDK Installation Guide',
        description: 'Example instructions to integrate Courier Inbox, Preferences, and Push Notifications into your Flutter application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.').default(this.DEFAULT_USER_ID),
        },
      },
      async ({ user_id }) => {
        return await this.getDocsWithJWT('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_flutter.md', user_id);
      }
    );

    // React Native installation guide
    this.mcp.registerTool(
      'react_native_installation_guide',
      {
        title: 'Courier React Native SDK Installation Guide',
        description: 'Instructions to integrate Courier into your React Native application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.').default(this.DEFAULT_USER_ID),
        },
      },
      async ({ user_id }) => {
        return await this.getDocsWithJWT('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_react_native.md', user_id);
      }
    );

    // Android installation guide
    this.mcp.registerTool(
      'android_installation_guide',
      {
        title: 'Courier Android SDK Installation Guide',
        description: 'Instructions to integrate Courier into your native Android application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.').default(this.DEFAULT_USER_ID),
        },
      },
      async ({ user_id }) => {
        return await this.getDocsWithJWT('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_android.md', user_id);
      }
    );

    // iOS installation guide
    this.mcp.registerTool(
      'ios_installation_guide',
      {
        title: 'Courier iOS SDK Installation Guide',
        description: 'Instructions to integrate Courier into your native iOS application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.').default(this.DEFAULT_USER_ID),
        },
      },
      async ({ user_id }) => {
        return await this.getDocsWithJWT('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_ios.md', user_id);
      }
    );

    // React (Web) installation guide
    this.mcp.registerTool(
      'react_installation_guide',
      {
        title: 'Courier React SDK Installation Guide',
        description: 'Instructions to integrate Courier into your React web application.',
        inputSchema: {
          user_id: z.string().describe('The unique identifier for the user.').default(this.DEFAULT_USER_ID),
        },
      },
      async ({ user_id }) => {
        return await this.getDocsWithJWT('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_react.md', user_id);
      }
    );

    // Node.js installation guide
    this.mcp.registerTool(
      'node_installation_guide',
      {
        title: 'Courier Node.js SDK Installation Guide',
        description: 'Instructions to send notifications using Courier from a Node.js backend.',
      },
      async () => {
        return await this.getDocs('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_node.md');
      }
    );

    // Python installation guide
    this.mcp.registerTool(
      'python_installation_guide',
      {
        title: 'Courier Python SDK Installation Guide',
        description: 'Instructions to send notifications using Courier from a Python backend.',
      },
      async () => {
        return await this.getDocs('https://github.com/trycourier/courier-mcp/blob/main/docs/installation_guide_python.md');
      }
    );
  }
}