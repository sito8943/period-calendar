import { AuthRouteQueryParam } from "lib";

const recoveryAccessTokenParams = [
  AuthRouteQueryParam.AccessToken,
  AuthRouteQueryParam.AccessTokenLegacy,
  AuthRouteQueryParam.Token,
] as const;

const getHashParams = (hash: string): URLSearchParams => {
  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const hashQuery = rawHash.includes("?")
    ? rawHash.slice(rawHash.indexOf("?") + 1)
    : rawHash;
  return new URLSearchParams(hashQuery);
};

export const buildAuthRedirectUrl = (path: string): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return new URL(path, window.location.origin).toString();
};

export const extractAuthQueryParamFromLocation = (
  hash: string,
  search: string,
  key: string,
): string | null => {
  const searchParams = new URLSearchParams(search);
  const hashParams = getHashParams(hash);

  const fromSearch = searchParams.get(key);
  if (fromSearch && fromSearch.length > 0) return fromSearch;

  const fromHash = hashParams.get(key);
  if (fromHash && fromHash.length > 0) return fromHash;

  return null;
};

export const extractRecoveryAccessTokenFromLocation = (
  hash: string,
  search: string,
): string | null => {
  for (const key of recoveryAccessTokenParams) {
    const token = extractAuthQueryParamFromLocation(hash, search, key);
    if (token) return token;
  }

  return null;
};

export const extractAuthSessionTokensFromLocation = (
  hash: string,
  search: string,
): { accessToken: string; refreshToken: string } | null => {
  const accessToken = extractRecoveryAccessTokenFromLocation(hash, search);
  const refreshToken = extractAuthQueryParamFromLocation(
    hash,
    search,
    AuthRouteQueryParam.RefreshToken,
  );

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
  };
};

export const hasAuthErrorParamsInLocation = (
  hash: string,
  search: string,
): boolean => {
  const searchParams = new URLSearchParams(search);
  const hashParams = getHashParams(hash);

  return (
    searchParams.has(AuthRouteQueryParam.Error) ||
    searchParams.has(AuthRouteQueryParam.ErrorDescription) ||
    hashParams.has(AuthRouteQueryParam.Error) ||
    hashParams.has(AuthRouteQueryParam.ErrorDescription)
  );
};
