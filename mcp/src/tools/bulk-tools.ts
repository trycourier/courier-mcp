import { z } from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";
import { handleToolCall } from "../utils/error-handler.js";

export class BulkTools extends CourierMcpTools {

  static readonly tools: string[] = [
    'create_bulk_job',
    'add_bulk_users',
    'run_bulk_job',
    'get_bulk_job',
    'list_bulk_users',
  ];

  public register() {

    this.registerToolIfNeeded(
      BulkTools.tools[0],
      'Create a new bulk job for sending messages to multiple recipients. Workflow: create_bulk_job → add_bulk_users → run_bulk_job.',
      {
        message: z.record(z.any()).describe('Bulk message definition with event/template and content'),
      },
      async ({ message }) => {
        return handleToolCall(() => this.mcp.courier.bulk.createJob({ message } as any));
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      BulkTools.tools[1],
      'Add users to an existing bulk job.',
      {
        job_id: z.string().describe('The bulk job ID'),
        users: z.array(z.record(z.any())).describe('Array of user objects to add'),
      },
      async ({ job_id, users }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.bulk.addUsers(job_id, { users } as any);
          return { success: true, job_id, users_added: users.length };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      BulkTools.tools[2],
      'Run a bulk job, triggering delivery to all added users.',
      {
        job_id: z.string().describe('The bulk job ID to run'),
      },
      async ({ job_id }) => {
        return handleToolCall(async () => {
          await this.mcp.courier.bulk.runJob(job_id);
          return { success: true, job_id, message: 'Bulk job started' };
        });
      },
      { readOnlyHint: false, idempotentHint: false }
    );

    this.registerToolIfNeeded(
      BulkTools.tools[3],
      'Get the status of a bulk job.',
      {
        job_id: z.string().describe('The bulk job ID'),
      },
      async ({ job_id }) => {
        return handleToolCall(() => this.mcp.courier.bulk.retrieveJob(job_id));
      },
      { readOnlyHint: true }
    );

    this.registerToolIfNeeded(
      BulkTools.tools[4],
      'List the users in a bulk job.',
      {
        job_id: z.string().describe('The bulk job ID'),
        cursor: z.string().optional().describe('Pagination cursor'),
      },
      async ({ job_id, cursor }) => {
        return handleToolCall(() => this.mcp.courier.bulk.listUsers(job_id, cursor ? { cursor } : {}));
      },
      { readOnlyHint: true }
    );
  }
}
