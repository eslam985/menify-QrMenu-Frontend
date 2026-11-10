const UrlRe: RegExp = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
const numIntRe: RegExp = /^[0-9]\d*$/;
const phoneRe: RegExp = /^(\+\d{2})?\d{11,16}$/;

const usernameRe: RegExp =
  /^[a-zA-Z0-9\u0621-\u064A]+(?:[ ._-][a-zA-Z0-9\u0621-\u064A]+)*$/;

const matchRegex = (input: string, regx: RegExp): boolean => regx.test(input);

const slugify = (str: string): string => {
  if (!str || typeof str !== "string") return "";

  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
};

export { usernameRe, phoneRe, UrlRe, numIntRe, slugify, matchRegex };
