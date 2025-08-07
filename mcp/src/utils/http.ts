import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  url: string;
  headers?: Record<string, any>;
  body?: any;
  responseType?: 'json' | 'text';
};

function withJsonContentType(
  headers?: Record<string, any>,
  skipIfFormData?: boolean,
  body?: any
): Record<string, any> {
  let result = { ...(headers || {}) };
  if (!(skipIfFormData && body instanceof FormData)) {
    if (!result['Content-Type']) {
      result['Content-Type'] = 'application/json';
    }
  }
  result['User-Agent'] = USER_AGENT;
  return result;
}

function addStatusToText(text: string, status: number): string {
  return `Status: ${status}\n${text}`;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  url,
  method,
  headers,
  body,
  responseType = 'text',
  skipIfFormData = false,
}: {
  url: string;
  method: HttpMethod;
  headers?: Record<string, any>;
  body?: any;
  responseType?: 'json' | 'text';
  skipIfFormData?: boolean;
}) {
  try {
    const mergedHeaders = withJsonContentType(headers, skipIfFormData, body);
    const fetchOptions: RequestInit = {
      headers: mergedHeaders,
      method,
    };
    if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
    }
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    let data;
    if (responseType === 'json') {
      data = await res.json();
      return {
        content: [
          {
            type: 'text' as const,
            text: addStatusToText(JSON.stringify(data, null, 2), res.status),
          },
        ],
      };
    } else {
      const text = await res.text();
      return {
        content: [
          {
            type: 'text' as const,
            text: addStatusToText(text, res.status),
          },
        ],
      };
    }
  } catch (err: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: addStatusToText(JSON.stringify(err, null, 2), err?.status || 0),
        },
      ],
    };
  }
}

export default class Http {
  static async get({ url, headers, responseType = 'json' }: HttpRequestParams) {
    return performRequest({ url, method: 'GET', headers, responseType });
  }

  static async post({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({ url, method: 'POST', headers, body, responseType, skipIfFormData: true });
  }

  static async put({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({ url, method: 'PUT', headers, body, responseType, skipIfFormData: true });
  }

  static async patch({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    return performRequest({ url, method: 'PATCH', headers, body, responseType, skipIfFormData: true });
  }

  static async delete({ url, headers, responseType = 'text' }: HttpRequestParams) {
    return performRequest({ url, method: 'DELETE', headers, responseType });
  }
}
