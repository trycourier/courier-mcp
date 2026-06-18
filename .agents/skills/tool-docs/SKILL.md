---
name: tool-docs
description: Keep the docs in sync with the set of tools the MCP server exposes. Use whenever you add, remove, or rename a tool — i.e. any change to a `static readonly tools` array under mcp/src/tools/. The tool count and tool listings are duplicated across the README, both plugin manifests, and the public docs site, and every copy must be updated in the same change.
---

# Keep tool docs in sync

The MCP server's public surface is the set of tools it registers. The canonical source of truth is the `static readonly tools: string[]` array in each `mcp/src/tools/*.ts` class, aggregated by `CourierMcpToolsRegistry` (`mcp/src/utils/courier-mcp-tools-registry.ts`):

- `defaultTools` — every tool except the diagnostic `ConfigTools` (`get_environment_config`). This is what the hosted server exposes.
- `allAvailableTools` — `defaultTools` plus the diagnostic tools (available in local installs only).

When that set changes, several docs duplicate it and drift. Update all of them in the same PR.

## Get the current tool list & counts

The tool set comes straight from the `static readonly tools` arrays. This reads them without a build (robust even if `tsc` is failing on unrelated errors):

```bash
node -e "
const fs=require('fs'), d='mcp/src/tools', names=new Set();
for (const f of fs.readdirSync(d)) {
  if (!f.endsWith('.ts')) continue;
  const m=fs.readFileSync(d+'/'+f,'utf8').match(/readonly tools\s*:\s*string\[\]\s*=\s*\[([\s\S]*?)\]/);
  if (m) for (const x of m[1].matchAll(/'([a-z][a-z0-9_]+)'/g)) names.add(x[1]);
}
const a=[...names].sort(); console.log(a.join('\n')); console.log('TOTAL:', a.length);
"
```

The split between **default** and **diagnostic (local-only)** is defined by `CourierMcpToolsRegistry`: `defaultTools` is every tool except `ConfigTools` (`get_environment_config`); `allAvailableTools` adds it back. After a successful build you can read the exact counts straight from it:

```bash
node --input-type=module -e '
import { CourierMcpToolsRegistry as R } from "./mcp/dist/utils/courier-mcp-tools-registry.js";
console.log("total:", R.allAvailableTools.length, "| default:", R.defaultTools.length);
'
```

## Docs to update

| File | What to update |
|------|----------------|
| `README.md` | The intro line ("… through **N** tools …"), the "**D** default tools … plus **X** diagnostic" line, and the per-category tables under **Default tools** and **Diagnostic tools (local only)** |
| `.plugin/plugin.json` | `description` — the "**N** tools for the full Courier API" count |
| `.cursor-plugin/plugin.json` | `description` — same count; keep it byte-identical to `.plugin/plugin.json` |
| Public docs site (separate repo) | `trycourier/mintlify-docs` → `tools/mcp.mdx`: the count sentence under **Available Tools** and the per-category tables (each tool links to its `/api-reference/...` page). If the repo is checked out as a sibling directory, update it and open a PR there; otherwise call out that a docs-site PR is still needed. |

Group tools by API resource, mirroring the tables already in `README.md`. Put the diagnostic tool(s) in their own "local only" section and exclude them from the "default" count.

## Add a coverage test for every new tool

`mcp/src/__tests__/tools-coverage.test.ts` has one test per tool — it calls the tool and asserts the underlying SDK method was invoked. Add a case for each new tool, then run:

```bash
npm --prefix mcp test
```

`registry.test.ts` also asserts default-vs-diagnostic membership and that there are no duplicate tool names, so it will fail if a new tool class isn't wired into the registry.

## Notes

- If you add a tool that sends live traffic (`send_*`), carries `destructiveHint`, or mutates a provider integration, also add it to `RECOMMENDED_CLIENT_DISABLED_TOOLS` (`mcp/src/policy/recommended-client-disabled-tools.ts`). That's a client-policy list, not docs, but it drifts the same way.
- This skill lives at `.agents/skills/tool-docs/SKILL.md` (the cross-tool Agent Skills standard path). Cursor and Codex discover it there natively; Claude Code reads it via a file symlink at `.claude/skills/tool-docs/SKILL.md`.
