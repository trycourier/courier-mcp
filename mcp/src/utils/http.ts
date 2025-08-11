import { CourierClientOptions } from '../client/courier-client.js';
import { CourierMcpLogger } from './logger.js';
import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  options: CourierClientOptions;
  route: string;
  body?: any;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  options,
  route,
  method,
  body,
}: {
  options: CourierClientOptions;
  route: string;
  method: HttpMethod;
  body?: any;
}): Promise<Response> {

  // Validate the options
  if (!options.apiKey) {
    throw new Error('api_key is required in the Courier MCP config. Get your API key from https://app.courier.com/settings/api-keys.');
  }
  // Use CourierMcpLogger for logging if showLogs is enabled
  const logger = new CourierMcpLogger(options);
  logger.log('Perform Request:');
  logger.log(
    JSON.stringify(
      {
        url: `${options.baseUrl}${route}`,
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

  // Perform the request
  return fetch(`${options.baseUrl}${route}`, {
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    method,
    body: JSON.stringify(body),
  });

}

export const toJson = async (res: Response): Promise<{ content: { type: 'text', text: string }[] }> => {
  let data: any;
  try {
    // Try to parse JSON, but handle empty response bodies gracefully
    data = await res.json();
  } catch (e) {
    // If parsing fails, fallback to empty object
    data = {};
  }
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export const toText = async (res: Response): Promise<{ content: { type: 'text', text: string }[] }> => {
  const text = await res.text();
  return {
    content: [
      {
        type: 'text' as const,
        text,
      },
    ],
  };
}

export default class Http {
  static async get({ options, route }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      method: 'GET',
    });
  }

  static async post({ options, route, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      method: 'POST',
      body,
    });
  }

  static async put({ options, route, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      method: 'PUT',
      body,
    });
  }

  static async patch({ options, route, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      method: 'PATCH',
      body,
    });
  }

  static async delete({ options, route }: HttpRequestParams): Promise<Response> {
    return performRequest({
      options,
      route,
      method: 'DELETE',
    });
  }
}
