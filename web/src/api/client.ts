export class ApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_PREFIX = "/api";
const NO_CONTENT = 204;

export const isNotFound = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 404;
};

export const withUser = (path: string, userId: string): string => {
  return `${path}?user_id=${encodeURIComponent(userId)}`;
};

export const request = async <T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> => {
  const hasBody = body !== undefined;
  const response = await fetch(`${API_PREFIX}${path}`, {
    method,
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new ApiError(response.status);
  }
  if (response.status === NO_CONTENT) {
    return undefined as T;
  }
  return (await response.json()) as T;
};
