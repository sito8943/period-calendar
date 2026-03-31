export const isPathActive = (pathname: string, path: string): boolean =>
  path === "/" ? pathname === "/" : pathname.startsWith(path);
