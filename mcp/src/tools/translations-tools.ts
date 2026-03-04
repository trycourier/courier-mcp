import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class TranslationsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'get_translation',
    'update_translation',
  ];

  public register() {

    this.registerToolIfNeeded(
      TranslationsTools.tools[0],
      'Get a translation for a specific locale (e.g. "en_US", "fr_FR").',
      {
        locale: z.string().describe('Locale code (e.g. en_US, fr_FR)'),
        domain: z.string().default('default').describe('Translation domain (only "default" is supported currently)'),
      },
      async ({ locale, domain }) => {
        return handleToolCall(() => this.mcp.courier.translations.retrieve(locale, { domain }));
      }
    );

    this.registerToolIfNeeded(
      TranslationsTools.tools[1],
      'Create or update a translation for a specific locale.',
      {
        locale: z.string().describe('Locale code (e.g. en_US, fr_FR)'),
        body: z.string().describe('Translation content (PO file format)'),
        domain: z.string().default('default').describe('Translation domain'),
      },
      async ({ locale, body, domain }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.translations.update(locale, { body, domain });
          return { success: true, locale };
        });
      }
    );
  }
}
