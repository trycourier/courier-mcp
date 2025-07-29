type HttpRequestParams = {
  url: string;
  headers?: Record<string, any>;
  body?: any;
  responseType?: 'json' | 'text'; // allow caller to specify response type
};

export default class Http {
  static async get({ url, headers, responseType = 'json' }: HttpRequestParams) {
    try {
      const res = await fetch(url, {
        headers,
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
      const res = await fetch(url, {
        headers,
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
}
