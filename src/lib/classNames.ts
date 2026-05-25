type ClassNameValue = string | false | null | undefined;

export const classNames = (...classes: ClassNameValue[]): string =>
  classes.filter(Boolean).join(" ");
