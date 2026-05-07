import { describe, it, expect } from "vitest";
import { RECOMMENDED_CLIENT_DISABLED_TOOLS } from "../policy/recommended-client-disabled-tools.js";
import { CourierMcpToolsRegistry } from "../utils/courier-mcp-tools-registry.js";

describe("RECOMMENDED_CLIENT_DISABLED_TOOLS", () => {
  it("lists only names that exist in the tool registry", () => {
    const all = new Set(CourierMcpToolsRegistry.allAvailableTools);
    for (const name of RECOMMENDED_CLIENT_DISABLED_TOOLS) {
      expect(all.has(name), `not registered: ${name}`).toBe(true);
    }
  });

  it("is de-duplicated and sorted", () => {
    const unique = new Set(RECOMMENDED_CLIENT_DISABLED_TOOLS);
    expect(RECOMMENDED_CLIENT_DISABLED_TOOLS.length).toBe(unique.size);
    const sorted = [...RECOMMENDED_CLIENT_DISABLED_TOOLS].sort((a, b) => a.localeCompare(b));
    expect(RECOMMENDED_CLIENT_DISABLED_TOOLS).toEqual(sorted);
  });
});
