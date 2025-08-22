import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { performRequest } from "../utils/http.js";
import CourierMcp from "../index.js";
import { CourierMcpLogger } from "../utils/logger.js";

export class DocsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'courier_installation_guide',
  ];

  private readonly logger: CourierMcpLogger;
  private readonly DEFAULT_USER_ID = 'example_user';
  private readonly BASE_DOCS_URL = 'https://raw.githubusercontent.com/trycourier/courier-mcp/refs/heads/main/docs';

  constructor(mcp: CourierMcp) {
    super(mcp);
    this.logger = new CourierMcpLogger(mcp.client.options);
  }

  // This grabs the docs from url and gets an example jwt, then it will combine them into a single response to the LLM
  private async getDocsAndSampleJwt(url: string, user_id: string): Promise<string> {
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
  private combineJwtAndDocs(user_id: string, jwt: string, docs: string): string {
    return `${user_id} JWT Access Token: ${jwt}\n\n${docs}`;
  }

  public register() {

    // Courier installation guide
    this.registerToolIfNeeded(
      DocsTools.tools[0],
      'Courier SDK and Platform Installation Guide',
      {
        platform: z.enum([
          'nodejs',
          'python',
          'react',
          'ios',
          'android',
          'flutter',
          'react native'
        ]).describe('The platform you are using to integrate Courier. Supported values: nodejs, python, react, ios, android, flutter, react native.'),
        user_id: z.string().describe('The unique identifier for the user.').optional(),
      },
      async ({ platform, user_id }) => {
        let docs: string;
        switch (platform) {
          case 'nodejs':
            docs = await this.getDocs(`${this.BASE_DOCS_URL}/installation_guide_node.md`);
            break;
          case 'python':
            docs = await this.getDocs(`${this.BASE_DOCS_URL}/installation_guide_python.md`);
            break;
          case 'react':
            docs = await this.getDocsAndSampleJwt(`${this.BASE_DOCS_URL}/installation_guide_react.md`, user_id ?? this.DEFAULT_USER_ID);
            break;
          case 'ios':
            docs = await this.getDocsAndSampleJwt(`${this.BASE_DOCS_URL}/installation_guide_ios.md`, user_id ?? this.DEFAULT_USER_ID);
            break;
          case 'android':
            docs = await this.getDocsAndSampleJwt(`${this.BASE_DOCS_URL}/installation_guide_android.md`, user_id ?? this.DEFAULT_USER_ID);
            break;
          case 'flutter':
            docs = await this.getDocsAndSampleJwt(`${this.BASE_DOCS_URL}/installation_guide_flutter.md`, user_id ?? this.DEFAULT_USER_ID);
            break;
          case 'react native':
            docs = await this.getDocsAndSampleJwt(`${this.BASE_DOCS_URL}/installation_guide_react_native.md`, user_id ?? this.DEFAULT_USER_ID);
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }
        return {
          content: [
            {
              type: 'text' as const,
              text: docs,
            },
          ],
        }
      }
    );
  }
}