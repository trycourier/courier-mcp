import fs from "fs";
import path from "path";
import { z } from "zod";
import CourierMcp from "../index.js";
import { CourierMcpTools } from "./courier-mcp-tools.js";

/**
 * Courier SDK Context Guardrail & Migration Helper
 * Detects active Courier SDK (v7 or v8), provides rules, and scans for invalid usage.
 */
export class SdkContextTools extends CourierMcpTools {
  static readonly tools: string[] = [
    "get_courier_sdk_context",
    "scan_courier_imports",
    "get_courier_sdk_component_map",
  ];

  constructor(mcp: CourierMcp) {
    super(mcp);
  }

  public register() {
    // --- Tool 1: SDK Context Detection ---
    this.registerToolIfNeeded(
      SdkContextTools.tools[0],
      "Detects which Courier React SDK version is used, and provides usage rules and migration hints.",
      {},
      async () => {
        const info = await this.detectSdkVersion();
        return {
          content: [
            {
              type: "text" as const,
              text: this.formatSdkInfo(info),
            },
          ],
        };
      }
    );

    // --- Tool 2: Import Scanner ---
    this.registerToolIfNeeded(
      SdkContextTools.tools[1],
      "Scans source files for mixed or deprecated Courier SDK imports and APIs.",
      { directory: z.string().default("./src") },
      async ({ directory }) => {
        const scan = await this.scanImportsAndCodeUsage(directory);
        return {
          content: [
            {
              type: "text" as const,
              text: scan.message,
            },
          ],
        };
      }
    );

    // --- Tool 3: Component / Hook Mapping ---
    this.registerToolIfNeeded(
      SdkContextTools.tools[2],
      "Returns component and hook mappings between Courier React v7 and v8.",
      {},
      async () => {
        const mapping = this.getComponentMap();
        return {
          content: [
            {
              type: "text" as const,
              text: this.formatComponentMap(mapping),
            },
          ],
        };
      }
    );
  }

  /** Detects active SDK version from package.json */
  private async detectSdkVersion(): Promise<{
    version: "v7" | "v8" | "unknown";
    rules: string;
    usageExample: string;
    migrationHints: string;
  }> {
    try {
      const pkgPath = path.resolve(process.cwd(), "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // v8 detection (new consolidated package)
      if (deps["@trycourier/courier-react"] || deps["@trycourier/courier-react-17"]) {
        return {
          version: "v8",
          rules:
            "Do NOT use CourierProvider or Inbox from v7. Use useCourier() + CourierInbox exclusively.",
          usageExample: `import { useCourier, CourierInbox } from "@trycourier/courier-react";

const { client } = useCourier({ jwt: yourJwtHere });
<CourierInbox client={client} />;`,
          migrationHints: `• Remove @trycourier/react-inbox, @trycourier/react-provider, @trycourier/react-hooks  
• Replace useInbox() → useCourier()  
• Use JWT-based auth, not clientKey  
• Tags, pins, markdown: not supported in v8`,
        };
      }

      // v7 detection (old multi-package)
      if (
        deps["@trycourier/react-inbox"] ||
        deps["@trycourier/react-provider"] ||
        deps["@trycourier/react-hooks"]
      ) {
        return {
          version: "v7",
          rules: "Use CourierProvider + Inbox only. Do NOT mix with useCourier or CourierInbox.",
          usageExample: `import { CourierProvider } from "@trycourier/react-provider";
import { Inbox } from "@trycourier/react-inbox";

<CourierProvider clientKey="YOUR_CLIENT_KEY">
  <Inbox />
</CourierProvider>;`,
          migrationHints: `• Install @trycourier/courier-react  
• Replace useInbox() with useCourier()  
• Remove legacy clientKey and markdown features`,
        };
      }

      return {
        version: "unknown",
        rules:
          "SDK not detected. Ensure @trycourier/courier-react or @trycourier/react-inbox exists in package.json.",
        usageExample: "",
        migrationHints: "",
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error detecting SDK version: ${message}`);
      return {
        version: "unknown",
        rules: "Failed to read package.json for SDK detection.",
        usageExample: "",
        migrationHints: "",
      };
    }
  }

  /** Scans project files for mixed or deprecated SDK imports */
  private async scanImportsAndCodeUsage(
    directory: string
  ): Promise<{ valid: boolean; message: string }> {
    const allFiles = this.getAllFiles(directory);
    let hasV7 = false;
    let hasV8 = false;
    const issues: string[] = [];

    for (const file of allFiles) {
      const code = fs.readFileSync(file, "utf8");
      if (code.includes("@trycourier/react-inbox") || code.includes("@trycourier/react-provider"))
        hasV7 = true;
      if (code.includes("@trycourier/courier-react")) hasV8 = true;

      if (code.match(/\buseInbox\(/)) issues.push(`Deprecated hook useInbox() in ${file}`);
      if (code.match(/\baddTag\(/) || code.match(/\bpinMessage\(/))
        issues.push(`Tags or pins (not supported in v8) used in ${file}`);
    }

    let msg = "";
    if (hasV7 && hasV8) {
      msg +=
        "⚠️ Mixed SDK imports detected. Do not mix CourierProvider/Inbox (v7) with useCourier/CourierInbox (v8).\n";
    } else if (hasV7) msg += "Detected v7-style imports.\n";
    else if (hasV8) msg += "Detected v8-style imports.\n";
    else msg += "No Courier SDK imports detected.\n";

    if (issues.length) {
      msg += "Deprecated or unsupported usage:\n";
      for (const i of issues) msg += ` • ${i}\n`;
    }

    const valid = !(hasV7 && hasV8) && issues.length === 0;
    if (valid) msg = "✅ No conflicts or deprecated usage found.\n" + msg;
    return { valid, message: msg };
  }

  /** Recursive file gatherer */
  private getAllFiles(dir: string): string[] {
    let files: string[] = [];
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) files = files.concat(this.getAllFiles(full));
      else if (/\.(ts|tsx|js|jsx)$/.test(full)) files.push(full);
    }
    return files;
  }

  /** v7→v8 Component / Hook mapping table */
  private getComponentMap(): Array<{ v7: string; v8: string; notes: string }> {
    return [
      { v7: "CourierProvider", v8: "❌ Removed", notes: "Initialize with useCourier() instead." },
      { v7: "Inbox", v8: "CourierInbox", notes: "Standalone component." },
      { v7: "useInbox()", v8: "useCourier()", notes: "Hook renamed and simplified." },
      { v7: "clientKey", v8: "jwt", notes: "JWT required; clientKey removed." },
      { v7: "markMessageRead()", v8: "readMessage()", notes: "Renamed API." },
      { v7: "markMessageArchived()", v8: "archiveMessage()", notes: "Renamed API." },
      { v7: "fetchMessages()", v8: "fetchNextPageOfMessages()", notes: "Pagination support." },
      { v7: "tags / pins", v8: "❌ Not supported", notes: "Feature removed in v8." },
      { v7: "Markdown rendering", v8: "❌ Not supported", notes: "Use custom renderer via renderMessageBody." },
      { v7: "renderMessage()", v8: "renderMessageBody", notes: "New prop pattern for custom messages." },
      { v7: "@trycourier/react-inbox / provider", v8: "@trycourier/courier-react", notes: "Single consolidated package." },
    ];
  }

  /** Formats SDK info for display */
  private formatSdkInfo(info: {
    version: string;
    rules: string;
    usageExample: string;
    migrationHints: string;
  }): string {
    return `Detected Courier SDK: **${info.version}**

**Rules:**
${info.rules}

**Example:**
\`\`\`jsx
${info.usageExample}
\`\`\`

**Migration Hints:**
${info.migrationHints}`;
  }

  /** Formats mapping as Markdown */
  private formatComponentMap(
    map: Array<{ v7: string; v8: string; notes: string }>
  ): string {
    let out = "### Courier React SDK Component & Hook Mapping (v7 → v8)\n\n";
    out += "| v7 | v8 | Notes |\n|----|----|-------|\n";
    for (const row of map) out += `| ${row.v7} | ${row.v8} | ${row.notes} |\n`;
    return out;
  }
}
