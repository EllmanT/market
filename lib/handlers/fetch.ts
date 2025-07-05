interface FetchOptions extends RequestInit {
  timeOut?: number;
  formData?: FormData;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-errors";

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeOut = 100000,
    headers: customHeaders = {},
    formData,
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeOut);

  const isFormData = formData instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData
    ? {
        Accept: "application/json", // Let browser set the boundary automatically
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    ...restOptions,
    body: isFormData ? formData : JSON.stringify(restOptions.body),
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `HTTP ERROR : ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    const err = isError(error) ? error : new Error("An unknown error occurred");

    if (err.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeOut}ms`);
    } else {
      logger.error(`Error fetching ${url}`, err.message);
    }

    return handleError(err) as ActionResponse<T>;
  }
}

