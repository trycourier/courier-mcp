import { CourierClientOptions } from '../client/courier-client.js';
import { CourierMcpLogger } from './logger.js';
import { TextContent } from './types.js';
import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  options: CourierClientOptions | undefined;
  route?: string;
  url?: string;
  body?: any;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  options,
  route,
  url,
  method,
  body,
}: {
  options?: CourierClientOptions;
  route?: string;
  url?: string;
  method: HttpMethod;
  body?: any;
}): Promise<Response> {

  // Validate the options
  if (options && !options?.apiKey) {
    throw new Error('api_key is required in the Courier MCP config. Get your API key from https://app.courier.com/settings/api-keys.');
  }

  const fullUrl = url ? url : `${options?.baseUrl}${route ?? ''}`;

  // Use CourierMcpLogger for logging based on log level
  if (options) {
    const logger = new CourierMcpLogger(options);
    logger.debug('Perform Request:');
    logger.debug(
      JSON.stringify(
        {
          url: fullUrl,
          headers: {
            'Authorization': `Bearer ${options.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT,
          },
          method,
          body,
        },
        null,
        2
      )
    );
  }

  // Perform the request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT,
  };
  if (options?.apiKey) {
    headers['Authorization'] = `Bearer ${options.apiKey}`;
  }
  return fetch(fullUrl, {
    headers,
    method,
    body: JSON.stringify(body),
  });

}

export const toJson = async (options: CourierClientOptions, res: Response): Promise<TextContent> => {
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
    const logger = new CourierMcpLogger(options);
    logger.error('Error parsing response to JSON');
    logger.error(JSON.stringify(e, null, 2));

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

export default class Http {
  static async get({ options, route, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      url,
      method: 'GET',
    });
  }

  static async post({ options, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      url,
      method: 'POST',
      body,
    });
  }

  static async put({ options, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      url,
      method: 'PUT',
      body,
    });
  }

  static async patch({ options, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      url,
      method: 'PATCH',
      body,
    });
  }

  static async delete({ options, route, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      url,
      method: 'DELETE',
    });
  }
}
