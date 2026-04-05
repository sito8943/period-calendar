export const joinClasses = (...classes: Array<string | undefined>): string =>
  classes.filter(Boolean).join(" ");
