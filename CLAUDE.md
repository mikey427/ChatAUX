# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

ChatAUX is a monorepo containing an AI Playlist Generator application with the following structure:

- **Root**: Manages workspace-level scripts and shared dependencies
- **Backend**: Express.js API with TypeScript, Prisma ORM, and user authentication
- **Frontend**: Currently minimal setup (placeholder)

## Development Commands

### Backend Development
- **Development server**: `npm run dev:backend` (uses tsx to run TypeScript directly)
- **Build**: `npm run build:backend` (compiles TypeScript to dist/)
- **Production**: `npm run start:backend` (runs compiled JavaScript from dist/)

### Backend-only Commands (from backend/ directory)
- **Development**: `npm run dev` (runs tsx src/index.ts)
- **Build**: `npm run build` (TypeScript compilation)
- **Start**: `npm run start` (runs dist/index.js)

## Architecture Notes

### Backend Architecture
- **ES Modules**: Uses ES module syntax with .js extensions in imports
- **Path aliases**: Configured for @config, @middlewares, @controllers, @routes, @utils
- **TypeScript**: Strict configuration with modern ESNext target
- **Database**: Prisma ORM (generated client files were recently removed, needs regeneration)
- **Authentication**: JWT-based auth with bcryptjs hashing and cookie-parser
- **Validation**: Zod for runtime type checking

### Key Dependencies
- Express 5.x with CORS and cookie support
- Prisma ORM for database operations
- JWT for authentication tokens
- Zod for schema validation
- bcryptjs for password hashing

### File Organization
Backend follows a structured approach:
- Controllers handle request/response logic (currently minimal stubs)
- TypeScript path mapping enables clean imports
- Strict TypeScript configuration with advanced type checking

### Development Notes
- Uses tsx for development (no nodemon needed)
- ES modules throughout (type: "module" in backend package.json)
- Prisma client needs to be regenerated after the recent cleanup
- Frontend workspace exists but is currently minimal