type HttpRequestParams = {
  headers?: Record<string, string>;
  url: string;
  body?: any;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function performRequest({
  headers,
  url,
  method,
  body,
}: {
  headers: Record<string, string>;
  url: string;
  method: HttpMethod;
  body?: any;
}): Promise<Response> {

  // Merge the headers with the default headers
  const mergedHeaders = {
    ...headers,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    headers: mergedHeaders,
    method,
    body: JSON.stringify(body),
  });

}

export default class Http {
  static async get({ headers, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      headers: headers || {},
      url,
      method: 'GET',
    });
  }

  static async post({ headers, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      headers: headers || {},
      url,
      method: 'POST',
      body,
    });
  }

  static async put({ headers, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      headers: headers || {},
      url,
      method: 'PUT',
      body,
    });
  }

  static async patch({ headers, url, body }: HttpRequestParams): Promise<Response> {
    return performRequest({
      headers: headers || {},
      url,
      method: 'PATCH',
      body,
    });
  }

  static async delete({ headers, url }: HttpRequestParams): Promise<Response> {
    return performRequest({
      headers: headers || {},
      url,
      method: 'DELETE',
    });
  }
}
