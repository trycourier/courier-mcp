import { USER_AGENT } from './version.js';

type HttpRequestParams = {
  url: string;
  headers?: Record<string, any>;
  body?: any;
  responseType?: 'json' | 'text'; // allow caller to specify response type
};

function withJsonContentType(
  headers?: Record<string, any>,
  skipIfFormData?: boolean,
  body?: any
): Record<string, any> {
  let result = { ...(headers || {}) };
  // If skipIfFormData is true and body is FormData, don't set content-type
  if (!(skipIfFormData && body instanceof FormData)) {
    if (!result['Content-Type']) {
      result['Content-Type'] = 'application/json';
    }
  }
  // Always set a user agent
  result['User-Agent'] = USER_AGENT;
  return result;
}

export default class Http {
  static async get({ url, headers, responseType = 'json' }: HttpRequestParams) {
    try {
      const mergedHeaders = withJsonContentType(headers);
      const res = await fetch(url, {
        headers: mergedHeaders,
        method: 'GET',
      });
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
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } else {
        const text = await res.text();
        return {
          content: [
            {
              type: 'text' as const,
              text: text,
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(err, null, 2),
          },
        ],
      };
    }
  }

  static async post({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    try {
      const mergedHeaders = withJsonContentType(headers, true, body);
      const res = await fetch(url, {
        headers: mergedHeaders,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
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
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } else {
        const text = await res.text();
        return {
          content: [
            {
              type: 'text' as const,
              text: text,
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(err, null, 2),
          },
        ],
      };
    }
  }

  static async put({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    try {
      const mergedHeaders = withJsonContentType(headers, true, body);
      const res = await fetch(url, {
        headers: mergedHeaders,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
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
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } else {
        const text = await res.text();
        return {
          content: [
            {
              type: 'text' as const,
              text: text,
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(err, null, 2),
          },
        ],
      };
    }
  }

  static async patch({ url, headers, body, responseType = 'text' }: HttpRequestParams) {
    try {
      const mergedHeaders = withJsonContentType(headers, true, body);
      const res = await fetch(url, {
        headers: mergedHeaders,
        method: 'PATCH',
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
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
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } else {
        const text = await res.text();
        return {
          content: [
            {
              type: 'text' as const,
              text: text,
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(err, null, 2),
          },
        ],
      };
    }
  }

  static async delete({ url, headers, responseType = 'text' }: HttpRequestParams) {
    try {
      const mergedHeaders = withJsonContentType(headers);
      const res = await fetch(url, {
        headers: mergedHeaders,
        method: 'DELETE',
      });
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
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } else {
        const text = await res.text();
        return {
          content: [
            {
              type: 'text' as const,
              text: text,
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(err, null, 2),
          },
        ],
      };
    }
  }
}
