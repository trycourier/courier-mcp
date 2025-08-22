import { HttpMethod, performRequest } from "../utils/http.js";
import { CourierMcpLogger } from "../utils/logger.js";
import { TextContent } from "../utils/types.js";
import { USER_AGENT } from "../utils/version.js";
import { CourierClientOptions } from "./courier-client.js";

export class BaseClient {

  private readonly options: CourierClientOptions;
  readonly logger: CourierMcpLogger;

  constructor(options: CourierClientOptions) {
    this.options = options;
    this.logger = new CourierMcpLogger(options);
  }

  protected request(
    method: HttpMethod,
    url: string,
    body?: any
  ) {

    // Create the headers
    const headers = {
      'Authorization': `Bearer ${this.options.apiKey}`,
      'User-Agent': USER_AGENT,
    };

    // Create the full URL
    const fullUrl = `${this.options.baseUrl}${url}`;

    // Log the request
    this.logger.debug(`Request: ${method} ${fullUrl}`);
    this.logger.debug(`Body: ${JSON.stringify(body, null, 2)}`);

    // Perform the request
    return performRequest({
      headers,
      url: fullUrl,
      method,
      body,
    });

  }

  protected async json(res: Response): Promise<TextContent> {
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
      this.logger.error('Error parsing response to JSON');
      this.logger.error(JSON.stringify(e, null, 2));

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