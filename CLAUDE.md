# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Description

This application allows users to track the expiration dates of various trainings, informs them whether they meet all required training requirements or if some of their trainings have expired. They can configure reminders that are sent at a configurable time ahead of the the expiration date.

## Language

The application language is German. All user interface elements should be displayed in German. We use an informal tone of voice with "du" instead of "Sie".

## Project Structure

This is a monorepo using pnpm workspaces with Firebase integration. The project is structured as:

- **packages/web**: React frontend application built with Vite, Material-UI, and TypeScript
- **packages/functions**: Firebase Cloud Functions for backend services (Node.js 24)
- **Root**: Workspace configuration and build orchestration

## Key Commands

### Development

- `pnpm start`: Start the web development server (runs `vite` in web package)
- `pnpm build`: Full production build (compiles TypeScript and builds all packages)
- `pnpm compile`: TypeScript compilation across all packages
- `pnpm lint`: Run ESLint across all packages
- `pnpm clean`: Clean all build artifacts and TypeScript build info

### Package-specific commands

- Web package: `pnpm --filter @agt-tauglich/web start|build|lint`
- Functions package: No specific dev commands (uses TypeScript compilation)

## Architecture Overview

### Frontend (packages/web)

- React 19 with TypeScript
- Material-UI for components and theming
- Tanstack Router for routing
- Firebase SDK for authentication and Firestore
- Vite for build tooling with PWA plugin
- Lazy loading for code splitting

### Backend (packages/functions)

- Firebase Cloud Functions in europe-west1 region
- Admin SDK for Firestore operations
- Scheduled functions for reminder system
- TypeScript types and data models integrated within the functions package

## Firebase Configuration

The project uses Firebase for:

- Hosting (serves web package dist from packages/web/dist)
- Firestore database with custom rules and indexes
- Cloud Functions (deployed from packages/functions)

Functions are configured for Node.js 24 runtime and ignore src/ directory during deployment.

## Build System

- Uses TypeScript project references (tsconfig.build.json)
- pnpm workspace for dependency management
- Volta for Node.js version management (22.19.0)
- Build process: clean → compile → package-specific builds
