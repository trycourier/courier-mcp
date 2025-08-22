import z from "zod";
import { CourierMcpTools } from "./tools.js";
import { performRequest } from "../utils/http.js";
import { TextContent } from "../utils/types.js";
import CourierMcp from "../index.js";
import { CourierMcpLogger } from "../utils/logger.js";

export class DocsTools extends CourierMcpTools {

  private readonly logger: CourierMcpLogger;
  private readonly DEFAULT_USER_ID = 'example_user';
  private readonly BASE_DOCS_URL = 'https://raw.githubusercontent.com/trycourier/courier-mcp/refs/heads/main/docs/';

  constructor(mcp: CourierMcp) {
    super(mcp);
    this.logger = new CourierMcpLogger(mcp.client.options);
  }

  // This grabs the docs from url and gets an example jwt, then it will combine them into a single response to the LLM
  private async getDocsWithJwt(url: string, user_id: string): Promise<TextContent> {
    const [docs, jwt] = await Promise.all([
      this.getDocs(url),
      this.getJwt(user_id)
    ]);
    return this.combineJwtAndDocs(user_id, jwt, docs);
  }

  // Gets the docs from the url
  private async getDocs(url: string): Promise<string> {
    const res = await performRequest({ url, method: 'GET' });
    const text = await res.text();
    this.logger.debug(`Docs fetched from URL: ${url}`);
    this.logger.debug(`Docs text: ${text}`);
    return text;
  }

  // Helper to generate JWT
  private async getJwt(user_id: string): Promise<string> {
    const res = await this.mcp.client.authTokens.issueToken({
      scope: `user_id:${user_id} write:user-tokens inbox:read:messages inbox:write:events read:preferences write:preferences read:brands`,
      expires_in: '1h',
    });
    return res.content[0].text;
  };

  // Combines JWT and docs into a single response
  private combineJwtAndDocs(user_id: string, jwt: string, docs: string): TextContent {
    return {
      content: [
        {
          type: 'text' as const,
          text: `${user_id} JWT Access Token: ${jwt}\n\n${docs}`,
        },
      ],
    }
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
        return await this.getDocsWithJwt(`${this.BASE_DOCS_URL}installation_guide_flutter.md`, user_id);
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
        return await this.getDocsWithJwt(`${this.BASE_DOCS_URL}installation_guide_react_native.md`, user_id);
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
        return await this.getDocsWithJwt(`${this.BASE_DOCS_URL}installation_guide_android.md`, user_id);
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
        return await this.getDocsWithJwt(`${this.BASE_DOCS_URL}installation_guide_ios.md`, user_id);
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
        return await this.getDocsWithJwt(`${this.BASE_DOCS_URL}installation_guide_react.md`, user_id);
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
        const docs = await this.getDocs(`${this.BASE_DOCS_URL}installation_guide_node.md`);
        return {
          content: [
            {
              type: 'text' as const,
              text: docs,
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
      },
      async () => {
        const docs = await this.getDocs(`${this.BASE_DOCS_URL}installation_guide_python.md`);
        return {
          content: [
            {
              type: 'text' as const,
              text: docs,
            },
          ],
        };
      }
    );
  }
}