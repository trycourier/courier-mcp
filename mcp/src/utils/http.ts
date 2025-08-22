export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function performRequest({
  headers,
  url,
  method,
  body,
}: {
  headers?: Record<string, string>;
  url: string;
  method: HttpMethod;
  body?: any;
}): Promise<Response> {

  // Merge the headers with the default headers
  const mergedHeaders = {
    ...(headers ?? {}),
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    headers: mergedHeaders,
    method,
    body: JSON.stringify(body),
  });

}
