import { jsonResponse } from "./response";

export function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status);
}

export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404);
}

export function badRequestResponse(message = "Bad request") {
  return errorResponse(message, 400);
}
