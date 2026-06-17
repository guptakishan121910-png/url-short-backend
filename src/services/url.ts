import { ApiError } from "../errors.js";

const blockedProtocols = new Set(["javascript:", "data:", "file:", "vbscript:"]);

export function normalizeUrl(input: string) {
  const value = input.trim();

  if (!value) {
    throw new ApiError(400, "INVALID_URL", "URL is required");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new ApiError(400, "INVALID_URL", "Enter a valid absolute URL");
  }

  if (blockedProtocols.has(parsed.protocol) || !["http:", "https:"].includes(parsed.protocol)) {
    throw new ApiError(400, "UNSAFE_URL", "Only http and https URLs are allowed");
  }

  if (!parsed.hostname || parsed.hostname === "localhost") {
    throw new ApiError(400, "UNSAFE_URL", "Public URLs only; localhost is not allowed");
  }

  return parsed.toString();
}

export function validateAlias(alias?: string) {
  if (!alias?.trim()) {
    return undefined;
  }

  const value = alias.trim();
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(value)) {
    throw new ApiError(
      400,
      "INVALID_ALIAS",
      "Aliases must be 3-32 characters using letters, numbers, dashes, or underscores"
    );
  }

  return value;
}
