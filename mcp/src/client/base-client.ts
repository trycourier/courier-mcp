import Http, { HttpMethod } from "../utils/http.js";
import { TextContent } from "../utils/types.js";
import { USER_AGENT } from "../utils/version.js";
import { CourierClient } from "./courier-client.js";

export class BaseClient {

  readonly client: CourierClient;

  constructor(client: CourierClient) {
    this.client = client;
  }

  protected request(
    method: HttpMethod,
    url: string,
    body?: any
  ) {

    // Create the headers
    const headers = {
      'Authorization': `Bearer ${this.client.options.apiKey}`,
      'User-Agent': USER_AGENT,
    };

    // Create the full URL
    const fullUrl = `${this.client.options.baseUrl}${url}`;

    // Log the request
    this.client.logger.debug(`Request: ${method} ${fullUrl}`);
    this.client.logger.debug(`Body: ${JSON.stringify(body, null, 2)}`);

    // Perform the request
    switch (method) {
      case 'GET':
        return Http.get({ headers, url: fullUrl });
      case 'POST':
        return Http.post({ headers, url: fullUrl, body });
      case 'PUT':
        return Http.put({ headers, url: fullUrl, body });
      case 'PATCH':
        return Http.patch({ headers, url: fullUrl, body });
      case 'DELETE':
        return Http.delete({ headers, url: fullUrl });
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

  }

  protected async toJson(res: Response): Promise<TextContent> {
    try {
      const data = await res.json();
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (e) {

      // Log the error
      this.client.logger.error('Error parsing response to JSON');
      this.client.logger.error(JSON.stringify(e, null, 2));

      // Return an empty response
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({}, null, 2),
          },
        ],
      };
    }
  }

}