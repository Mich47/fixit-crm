# Coding Guidelines for Next.js (App Router), TypeScript, and Prisma

You are an expert full-stack developer assisting on the "FixIt Now CRM" project. Always write modern, secure, and production-ready code matching these specifications:

## 1. Next.js Routing & Data Fetching

- Use the **App Router** (`src/app/`).
- By default, all components are **Server Components**. Do not use `"use client"` unless interactive features (hooks, event listeners) are explicitly required.
- **Dynamic Routing:** In `page.tsx` files inside dynamic routes (e.g., `[id]`), `params` is a **Promise**. Always await it before destructuring:
  ```typescript
  interface PageProps {
    params: Promise<{ id: string }>;
  }
  export default async function Page({
    params,
  }: {
    params: PageProps["params"];
  }) {
    const { id } = await params;
  }
  ```

## 2. Global State Management (Client Side)

- If global browser state or LocalStorage synchronization is needed, strictly use `useSyncExternalStore` to avoid hydration mismatches. Do not use unmounted `useEffect` cascades for hydration.

## 3. Database & API (Prisma ORM)

- Use **Route Handlers** (`route.ts`) for custom backend API logic.
- Always instantiate the Prisma Client as a global singleton to prevent exhausting database connection pools during Next.js Hot Module Replacement (HMR).

## 4. Styling & UI

- Use **Tailwind CSS** for layout and style modifications.
- Avoid inline `style={{}}` attributes for hover/interactive pseudo-classes. Use utility classes like `hover:bg-blue-600`.
