import z from "zod";
import { CourierMcpTools } from "./courier-mcp-tools.js";

export class BrandsTools extends CourierMcpTools {

  public register() {
    // Create a brand
    this.server.tool(
      'create_brand',
      'Create a new brand.',
      {
        id: z.string().optional(),
        name: z.string(),
        settings: z.object({
          colors: z.record(z.any()).optional(),
          inapp: z.record(z.any()).optional(),
          email: z.record(z.any()).optional(),
        }).optional(),
        snippets: z.record(z.any()).optional(),
        idempotency_key: z.string().optional(),
        idempotency_expiry: z.string().optional(),
      },
      async ({ id, name, settings, snippets, idempotency_key, idempotency_expiry }) => {
        try {
          const request: any = { id, name, settings, snippets };
          if (id === undefined) delete request.id;
          if (settings === undefined) delete request.settings;
          if (snippets === undefined) delete request.snippets;

          const requestOptions: any = {};
          if (idempotency_key !== undefined) requestOptions.idempotencyKey = idempotency_key;
          if (idempotency_expiry !== undefined) requestOptions.idempotencyExpiry = idempotency_expiry;

          const response = await this.server.courierClient.brands.create(request, requestOptions);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // Get a brand by ID
    this.server.tool(
      'get_brand',
      'Fetch a specific brand by brand ID.',
      {
        brand_id: z.string(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ brand_id, timeout_in_seconds, max_retries }) => {
        try {
          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.brands.get(brand_id, requestOptions);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // List brands
    this.server.tool(
      'list_brands',
      'Get the list of brands.',
      {
        cursor: z.string().optional(),
        limit: z.number().optional(),
        timeout_in_seconds: z.number().optional(),
        max_retries: z.number().optional(),
      },
      async ({ cursor, limit, timeout_in_seconds, max_retries }) => {
        try {
          const request: any = {};
          if (cursor !== undefined) request.cursor = cursor;
          if (limit !== undefined) request.limit = limit;

          const requestOptions: any = {};
          if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
          if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

          const response = await this.server.courierClient.brands.list(request, requestOptions);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(err, null, 2),
              },
            ],
          };
        }
      }
    );

    // // Delete a brand by ID
    // this.server.tool(
    //   'delete_brand',
    //   'Delete a brand by brand ID.',
    //   {
    //     brand_id: z.string(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ brand_id, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       const response = await this.server.courierClient.brands.delete(brand_id, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );

    // // Replace a brand by ID
    // this.server.tool(
    //   'replace_brand',
    //   'Replace an existing brand with the supplied values.',
    //   {
    //     brand_id: z.string(),
    //     name: z.string(),
    //     settings: z.object({
    //       colors: z.record(z.any()).optional(),
    //       inapp: z.record(z.any()).optional(),
    //       email: z.record(z.any()).optional(),
    //     }).optional(),
    //     snippets: z.record(z.any()).optional(),
    //     timeout_in_seconds: z.number().optional(),
    //     max_retries: z.number().optional(),
    //   },
    //   async ({ brand_id, name, settings, snippets, timeout_in_seconds, max_retries }) => {
    //     try {
    //       const request: any = { name, settings, snippets };
    //       if (settings === undefined) delete request.settings;
    //       if (snippets === undefined) delete request.snippets;

    //       const requestOptions: any = {};
    //       if (timeout_in_seconds !== undefined) requestOptions.timeoutInSeconds = timeout_in_seconds;
    //       if (max_retries !== undefined) requestOptions.maxRetries = max_retries;

    //       const response = await this.server.courierClient.brands.replace(brand_id, request, requestOptions);

    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(response, null, 2),
    //           },
    //         ],
    //       };
    //     } catch (err: any) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(err, null, 2),
    //           },
    //         ],
    //       };
    //     }
    //   }
    // );
  }
}
