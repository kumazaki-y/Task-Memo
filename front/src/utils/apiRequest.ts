export const apiRequest = async <T = Record<string, unknown>>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object,
): Promise<T> => {
  try {
    const accessToken = localStorage.getItem('access-token') ?? '';
    const client = localStorage.getItem('client') ?? '';
    const uid = localStorage.getItem('uid') ?? '';

    if (accessToken === '' || client === '' || uid === '') {
      throw new Error('Missing authentication headers');
    }

    const headers = {
      'Content-Type': 'application/json',
      'access-token': accessToken,
      client,
      uid,
    };

    const response = await fetch(url, {
      method,
      headers,
      body:
        body !== null && body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${method} request`);
    }

    const data = (await response.json()) as T;

    if (data === null || typeof data === 'undefined') {
      throw new Error('Received null or undefined data');
    }

    return data as T;
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    throw error;
  }
};
