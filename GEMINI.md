# Gemini Project Context: stitcher

## 1. Project Overview

This is a low-code visual development platform named "stitcher". It allows users to build web pages by dragging and dropping components. The platform is built using Vue 3, TypeScript, and Vite.

The core purpose is to provide a visual editor to construct UIs, supporting multiple underlying component libraries such as Element Plus, Ant Design Vue, and Naive UI. The editor's own interface is built with `shadcn-vue` and Tailwind CSS.

**Key Technologies:**
- **Framework:** Vue 3
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **Drag & Drop:** `vue-draggable-plus`
- **Styling:** Tailwind CSS (primary) and SCSS
- **Testing:** Vitest for unit tests, Playwright for E2E tests.

The project architecture is well-documented in `docs/技术架构文档.md`, which outlines a modular structure including an editor, canvas, component library, property panel, and code generator.

## 2. Key Commands

All commands should be run using `pnpm`.

- **Installation:**
  ```sh
  pnpm install
  ```

- **Development Server:**
  To run the app in development mode with hot-reloading.
  ```sh
  pnpm dev
  ```

- **Production Build:**
  To type-check, compile, and minify for production.
  ```sh
  pnpm build
  ```

- **Run Unit Tests:**
  Executes unit tests using Vitest.
  ```sh
  pnpm test:unit
  ```

- **Run End-to-End (E2E) Tests:**
  Executes E2E tests using Playwright.
  ```sh
  pnpm test:e2e
  ```

- **Linting and Formatting:**
  To check and fix code style issues.
  ```sh
  pnpm lint
  pnpm format
  ```

## 3. Development Conventions

The project follows a set of established conventions outlined in `docs/技术架构文档.md` and `docs/开发规范.md`.

- **Directory Structure:** The project uses a modular structure located under `src/modules/` for core features like the canvas, editor, and property panel. Shared components are in `src/components/`, and Pinia stores are in `src/stores/`.
- **Coding Style:**
  - Vue components should use the `<script setup>` syntax and the Composition API.
  - Code style is enforced by ESLint and Prettier. Run `pnpm lint` and `pnpm format` before committing.
  - Commit messages should follow the Conventional Commits specification, as indicated by the presence of `.commitlintrc.js`.
- **Styling:**
  - **Tailwind CSS is the preferred method** for styling, especially for the editor's own UI. Utility-first classes should be used whenever possible.
  - SCSS can be used for more complex styling scenarios.
  - Component styles should be scoped using `<style scoped>`.
- **State Management:** Global state is managed by Pinia. New stores should be created in the `src/stores/` directory.
- **Design Reference:** All UI development must strictly adhere to the design prototypes located in `src/design/`. The `code.html` file is the primary reference.
