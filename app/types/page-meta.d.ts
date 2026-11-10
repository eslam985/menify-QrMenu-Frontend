import "nuxt/app";

declare module "#app" {
  interface PageMeta {
    requiredRole?: number;
  }
}

export {};
