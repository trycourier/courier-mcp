import { CourierClient, CourierClientOptions } from '../client/courier-client.js';
import { CourierMcpLogger } from './logger.js';
import { TextContent } from './types.js';
import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  client?: CourierClient;
  route?: string;
  url?: string;
  body?: any;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  client,
  route,
  url,
  method,
  body,
}: {
  client?: CourierClient;
  route?: string;
  url?: string;
  method: HttpMethod;
  body?: any;
}): Promise<Response> {

  // Validate the Courier Client
  if (client && !client?.options?.apiKey) {
    throw new Error('api_key is required in the Courier MCP config. Get your API key from https://app.courier.com/settings/api-keys.');
  }

  const fullUrl = url ? url : `${client?.options?.baseUrl}${route ?? ''}`;

  // Use CourierMcpLogger for logging based on log level
  client?.logger.debug('Perform Request:');
  client?.logger.debug(
    JSON.stringify(
      {
        url: fullUrl,
        headers: {
          'Authorization': `Bearer ${client?.options?.apiKey}`,
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

  // Perform the request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT,
  };

  // Add the Authorization header if the API key is present
  if (client?.options?.apiKey) {
    headers['Authorization'] = `Bearer ${client?.options?.apiKey}`;
  }

  return fetch(fullUrl, {
    headers,
    method,
    body: JSON.stringify(body),
  });

}

export const toJson = async (client: CourierClient, res: Response): Promise<TextContent> => {
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
    client.logger.error('Error parsing response to JSON');
    client.logger.error(JSON.stringify(e, null, 2));

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
  static async get({ client, route, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      client,
      route,
      url,
      method: 'GET',
    });
  }

  static async post({ client, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      client,
      route,
      url,
      method: 'POST',
      body,
    });
  }

  static async put({ client, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      client,
      route,
      url,
      method: 'PUT',
      body,
    });
  }

  static async patch({ client, route, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      client,
      route,
      url,
      method: 'PATCH',
      body,
    });
  }

  static async delete({ client, route, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      client,
      route,
      url,
      method: 'DELETE',
    });
  }
}
