import { CourierClientOptions } from '../client/courier-client.js';
import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  options: CourierClientOptions;
  route: string;
  body?: any;
  responseType?: 'json' | 'text';
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  options,
  route,
  method,
  body,
  responseType = 'text',
}: {
  options: CourierClientOptions;
  route: string;
  method: HttpMethod;
  headers?: Record<string, any>;
  body?: any;
  responseType?: 'json' | 'text';
}) {

  // Validate the options
  if (!options.apiKey) {
    throw new Error('API_KEY is required in the Courier MCP config. Get your API key from https://app.courier.com/settings/api-keys.');
  }

  try {

    // Perform the request
    const res = await fetch(`${options.baseUrl}${route}`, {
      headers: {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      method,
      body,
    });

    // Handle the response
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    // Handle the response body 
    if (responseType === 'json') {
      const json = await res.json();
      return respond(json);
    } else {
      const text = await res.text();
      return respond(text);
    }
  } catch (err: any) {
    return respond(err);
  }
}

const respond = (content: any) => {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(content, null, 2),
      },
    ],
  };
}

export default class Http {
  static async get({ options, route, responseType = 'json' }: HttpRequestParams) {
    return performRequest({
      options,
      route,
      method: 'GET',
      responseType,
    });
  }

  static async post({ options, route, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({
      options,
      route,
      method: 'POST',
      body,
      responseType,
    });
  }

  static async put({ options, route, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({
      options,
      route,
      method: 'PUT',
      body,
      responseType,
    });
  }

  static async patch({ options, route, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({
      options,
      route,
      method: 'PATCH',
      body,
      responseType,
    });
  }

  static async delete({ options, route, responseType = 'text' }: HttpRequestParams) {
    return performRequest({
      options,
      route,
      method: 'DELETE',
      responseType,
    });
  }
}
