// app/types/page-meta.d.ts
import "nuxt/app";

declare module "#app" {
  interface PageMeta {
    requiredRole?: number;
  }
}

export {};
