import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

// NOTE: The published @trycourier/courier SDK does not yet expose a typed
// `preferenceSections` resource (the endpoints are in the API spec but the SDK
// has not been regenerated). Until it is, these tools call the SDK's raw HTTP
// methods (`courier.post/get/put/delete`). When the typed resource ships, swap
// these for `this.mcp.courier.preferenceSections.*` calls.
const CHANNEL_CLASSIFICATIONS = ['direct_message', 'email', 'push', 'sms', 'webhook', 'inbox'] as const;

export class PreferenceSectionsTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'list_preference_sections',
    'create_preference_section',
    'get_preference_section',
    'replace_preference_section',
    'archive_preference_section',
    'publish_preferences',
    'list_preference_topics',
    'create_preference_topic',
    'get_preference_topic',
    'replace_preference_topic',
    'archive_preference_topic',
  ];

  public register() {

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[0],
      "List the workspace's preference sections. Each section embeds its topics.",
      {},
      async () => {
        return handleToolCall(() => this.mcp.courier.get('/preferences/sections'));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[1],
      'Create a preference section in your workspace. The section id is generated and returned. Add topics afterwards with create_preference_topic.',
      {
        name: z.string().describe('Human-readable name for the section'),
        routing_options: z.array(z.enum(CHANNEL_CLASSIFICATIONS)).optional().describe('Default channels for the section. Defaults to empty if omitted.'),
        has_custom_routing: z.boolean().optional().describe('Whether the section defines custom routing for its topics'),
      },
      async ({ name, routing_options, has_custom_routing }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name };
          if (routing_options !== undefined) body.routing_options = routing_options;
          if (has_custom_routing !== undefined) body.has_custom_routing = has_custom_routing;
          return this.mcp.courier.post('/preferences/sections', { body });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[2],
      'Retrieve a preference section by id, including its topics.',
      {
        section_id: z.string().describe('Id of the preference section'),
      },
      async ({ section_id }) => {
        return handleToolCall(() => this.mcp.courier.get(`/preferences/sections/${encodeURIComponent(section_id)}`));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[3],
      'Replace a preference section. Full document replacement; missing optional fields are cleared. Topics attached to the section are unaffected.',
      {
        section_id: z.string().describe('Id of the preference section'),
        name: z.string().describe('Human-readable name for the section'),
        routing_options: z.array(z.enum(CHANNEL_CLASSIFICATIONS)).optional().describe('Default channels for the section. Omit to clear.'),
        has_custom_routing: z.boolean().optional().describe('Whether the section defines custom routing for its topics'),
      },
      async ({ section_id, name, routing_options, has_custom_routing }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name };
          if (routing_options !== undefined) body.routing_options = routing_options;
          if (has_custom_routing !== undefined) body.has_custom_routing = has_custom_routing;
          return this.mcp.courier.put(`/preferences/sections/${encodeURIComponent(section_id)}`, { body });
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[4],
      'Archive a preference section. The section must be empty: delete its topics first, otherwise the request fails with 409.',
      {
        section_id: z.string().describe('Id of the preference section to archive'),
      },
      async ({ section_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.delete(`/preferences/sections/${encodeURIComponent(section_id)}`);
          return { success: true, message: `Preference section ${section_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[5],
      "Publish the workspace's preferences page. Takes a snapshot of every section with its topics under a new published version, making the current state visible on the hosted preferences page.",
      {},
      async () => {
        return handleToolCall(() => this.mcp.courier.post('/preferences/publish'));
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    // --- Preference topic sub-resource tools ---

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[6],
      'List the topics in a preference section.',
      {
        section_id: z.string().describe('Id of the preference section'),
      },
      async ({ section_id }) => {
        return handleToolCall(() => this.mcp.courier.get(`/preferences/sections/${encodeURIComponent(section_id)}/topics`));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[7],
      'Create a subscription preference topic inside a section. The topic id is generated and returned. Fails with 404 if the section does not exist.',
      {
        section_id: z.string().describe('Id of the preference section to create the topic in'),
        name: z.string().describe('Human-readable name for the preference topic'),
        default_status: z.enum(['OPTED_OUT', 'OPTED_IN', 'REQUIRED']).describe('Default subscription status applied when a recipient has not set their own'),
        routing_options: z.array(z.enum(CHANNEL_CLASSIFICATIONS)).optional().describe('Default channels delivered for this topic. Defaults to empty if omitted.'),
        allowed_preferences: z.array(z.enum(['snooze', 'channel_preferences'])).optional().describe('Preference controls a recipient may customize for this topic'),
        include_unsubscribe_header: z.boolean().optional().describe('Whether to include a list-unsubscribe header on emails for this topic'),
        topic_data: z.record(z.any()).optional().describe('Arbitrary metadata associated with the topic'),
      },
      async ({ section_id, name, default_status, routing_options, allowed_preferences, include_unsubscribe_header, topic_data }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, default_status };
          if (routing_options !== undefined) body.routing_options = routing_options;
          if (allowed_preferences !== undefined) body.allowed_preferences = allowed_preferences;
          if (include_unsubscribe_header !== undefined) body.include_unsubscribe_header = include_unsubscribe_header;
          if (topic_data !== undefined) body.topic_data = topic_data;
          return this.mcp.courier.post(`/preferences/sections/${encodeURIComponent(section_id)}/topics`, { body });
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[8],
      'Retrieve a topic within a section. Returns 404 if the section or topic does not exist, or the topic belongs to a different section.',
      {
        section_id: z.string().describe('Id of the preference section'),
        topic_id: z.string().describe('Id of the subscription preference topic'),
      },
      async ({ section_id, topic_id }) => {
        return handleToolCall(() =>
          this.mcp.courier.get(`/preferences/sections/${encodeURIComponent(section_id)}/topics/${encodeURIComponent(topic_id)}`)
        );
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[9],
      'Replace a topic within a section. Full document replacement; missing optional fields are cleared.',
      {
        section_id: z.string().describe('Id of the preference section'),
        topic_id: z.string().describe('Id of the subscription preference topic'),
        name: z.string().describe('Human-readable name for the preference topic'),
        default_status: z.enum(['OPTED_OUT', 'OPTED_IN', 'REQUIRED']).describe('Default subscription status applied when a recipient has not set their own'),
        routing_options: z.array(z.enum(CHANNEL_CLASSIFICATIONS)).optional().describe('Default channels delivered for this topic. Omit to clear.'),
        allowed_preferences: z.array(z.enum(['snooze', 'channel_preferences'])).optional().describe('Preference controls a recipient may customize. Omit to clear.'),
        include_unsubscribe_header: z.boolean().optional().describe('Whether to include a list-unsubscribe header on emails for this topic'),
        topic_data: z.record(z.any()).optional().describe('Arbitrary metadata associated with the topic. Omit to clear.'),
      },
      async ({ section_id, topic_id, name, default_status, routing_options, allowed_preferences, include_unsubscribe_header, topic_data }) => {
        return handleToolCall(() => {
          const body: Record<string, any> = { name, default_status };
          if (routing_options !== undefined) body.routing_options = routing_options;
          if (allowed_preferences !== undefined) body.allowed_preferences = allowed_preferences;
          if (include_unsubscribe_header !== undefined) body.include_unsubscribe_header = include_unsubscribe_header;
          if (topic_data !== undefined) body.topic_data = topic_data;
          return this.mcp.courier.put(
            `/preferences/sections/${encodeURIComponent(section_id)}/topics/${encodeURIComponent(topic_id)}`,
            { body }
          );
        });
      },
      { readOnlyHint: false, idempotentHint: true }
    );

    this.registerToolIfNeeded(
      PreferenceSectionsTools.tools[10],
      'Archive a topic within a section.',
      {
        section_id: z.string().describe('Id of the preference section'),
        topic_id: z.string().describe('Id of the subscription preference topic to archive'),
      },
      async ({ section_id, topic_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.delete(
            `/preferences/sections/${encodeURIComponent(section_id)}/topics/${encodeURIComponent(topic_id)}`
          );
          return { success: true, message: `Preference topic ${topic_id} archived` };
        });
      },
      { destructiveHint: true, idempotentHint: true }
    );
  }
}
