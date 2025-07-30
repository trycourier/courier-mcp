import z from "zod";
import { CourierMcpTools } from "./tools.js";

export class BulkTools extends CourierMcpTools {

  // Not needed for now..
  // public register() {
  //   // Create a bulk job
  //   this.mcp.tool(
  //     "create_bulk_job",
  //     "Create a new bulk job.",
  //     {
  //       message: z.object({
  //         brand: z.string().optional(),
  //         data: z.record(z.any()).optional(),
  //         event: z.string().optional(),
  //         locale: z.string().optional(),
  //         override: z.record(z.any()).optional(),
  //         message: z.record(z.any()).optional(),
  //       }),
  //       idempotency_key: z.string().optional(),
  //       idempotency_expiry: z.string().optional(),
  //     },
  //     async ({ message, idempotency_key, idempotency_expiry }) => {
  //       const request: any = { message };
  //       const requestOptions: any = {};
  //       if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
  //       if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

  //       return await this.mcp.client.bulk.createJob(request, requestOptions);
  //     }
  //   );

  //   // Ingest users into a bulk job
  //   this.mcp.tool(
  //     "ingest_bulk_users",
  //     "Ingest user data into a bulk job.",
  //     {
  //       job_id: z.string(),
  //       users: z.array(
  //         z.object({
  //           preferences: z.record(z.any()).optional(),
  //           profile: z.record(z.any()).optional(),
  //           recipient: z.string().optional(),
  //           data: z.record(z.any()).optional(),
  //           to: z.any().optional(),
  //         })
  //       ),
  //       idempotency_key: z.string().optional(),
  //       idempotency_expiry: z.string().optional(),
  //     },
  //     async ({ job_id, users, idempotency_key, idempotency_expiry }) => {
  //       const request: any = { users };
  //       const requestOptions: any = {};
  //       if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
  //       if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

  //       return await this.mcp.client.bulk.ingestUsers(job_id, request, requestOptions);
  //     }
  //   );

  //   // Run a bulk job
  //   this.mcp.tool(
  //     "run_bulk_job",
  //     "Run a bulk job.",
  //     {
  //       job_id: z.string(),
  //       idempotency_key: z.string().optional(),
  //       idempotency_expiry: z.string().optional(),
  //     },
  //     async ({ job_id, idempotency_key, idempotency_expiry }) => {
  //       const requestOptions: any = {};
  //       if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
  //       if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

  //       return await this.mcp.client.bulk.runJob(job_id, requestOptions);
  //     }
  //   );

  //   // Get a bulk job
  //   this.mcp.tool(
  //     "get_bulk_job",
  //     "Get a bulk job by job ID.",
  //     {
  //       job_id: z.string(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ job_id }) => {
  //       return await this.mcp.client.bulk.getJob(job_id);
  //     }
  //   );

  //   // Get users of a bulk job
  //   this.mcp.tool(
  //     "get_bulk_job_users",
  //     "Get users of a bulk job.",
  //     {
  //       job_id: z.string(),
  //       cursor: z.string().optional(),
  //       limit: z.number().optional(),
  //       timeout_in_seconds: z.number().optional(),
  //       max_retries: z.number().optional(),
  //     },
  //     async ({ job_id, cursor, limit }) => {
  //       const request: any = {};
  //       if (cursor !== undefined) request.cursor = cursor;
  //       if (limit !== undefined) request.limit = limit;

  //       return await this.mcp.client.bulk.getUsers(job_id, request);
  //     }
  //   );
  // }
}
