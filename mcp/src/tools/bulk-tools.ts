import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class BulkTools extends CourierMcpTools {
  public register() {
    // Create a bulk job
    this.server.tool(
      "create_bulk_job",
      "Create a new bulk job.",
      {
        message: z.object({
          brand: z.string().optional(),
          data: z.record(z.any()).optional(),
          event: z.string().optional(),
          locale: z.string().optional(),
          override: z.record(z.any()).optional(),
          message: z.record(z.any()).optional(),
        }),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ message, idempotency_key, idempotency_expiry }) => {
        try {
          const request: any = { message };
          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          const response = await this.server.courierClient.bulk.createJob(request, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Ingest users into a bulk job
    this.server.tool(
      "ingest_bulk_users",
      "Ingest user data into a bulk job.",
      {
        job_id: z.string(),
        users: z.array(
          z.object({
            preferences: z.record(z.any()).optional(),
            profile: z.record(z.any()).optional(),
            recipient: z.string().optional(),
            data: z.record(z.any()).optional(),
            to: z.any().optional(),
          })
        ),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ job_id, users, idempotency_key, idempotency_expiry }) => {
        try {
          const request: any = { users };
          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          await this.server.courierClient.bulk.ingestUsers(job_id, request, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: "Users ingested successfully.",
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Run a bulk job
    this.server.tool(
      "run_bulk_job",
      "Run a bulk job.",
      {
        job_id: z.string(),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ job_id, idempotency_key, idempotency_expiry }) => {
        try {
          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          await this.server.courierClient.bulk.runJob(job_id, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: "Bulk job run successfully.",
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Get a bulk job
    this.server.tool(
      "get_bulk_job",
      "Get a bulk job by job ID.",
      {
        job_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ job_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.bulk.getJob(job_id, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Get users of a bulk job
    this.server.tool(
      "get_bulk_job_users",
      "Get users of a bulk job.",
      {
        job_id: z.string(),
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ job_id, cursor, limit, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.bulk.getUsers(job_id, request, requestOptions);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );
  }
}
