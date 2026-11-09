// src/utils/regex.ts
const UrlRe: RegExp = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
const numIntRe: RegExp = /^[0-9]\d*$/;
const phoneRe: RegExp = /^(\+\d{2})?\d{11,16}$/;

// Username: Arabic/English letters + digits, words separated by ONE of ( . _ - space ).
// No leading/trailing/double separators, no tabs/newlines.
// The separator is not part of the word class, so there is no ReDoS ambiguity.
const usernameRe: RegExp =
  /^[a-zA-Z0-9\u0621-\u064A]+(?:[ ._-][a-zA-Z0-9\u0621-\u064A]+)*$/;

const matchRegex = (input: string, regx: RegExp): boolean => regx.test(input);

/** Latin-only slug that matches the DB CHECK: ^[a-z0-9]+(-[a-z0-9]+)*$ */
const slugify = (str: string): string => {
  // 1. حماية تامة ضد البيانات الفارغة أو الخاطئة
  if (!str || typeof str !== "string") return "";

  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // إزالة علامات النطق اللاتينية
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // استبدال أي رموز مسافات بـ شرطة واحدة
    .replace(/^-+|-+$/g, "") // تنظيف الشُرط الزائدة من الأطراف
    .slice(0, 60); // 🌟 ضمان ألا يزيد الرابط عن 60 حرفاً لتوافق قاعدة البيانات
};

export { usernameRe, phoneRe, UrlRe, numIntRe, slugify, matchRegex };
