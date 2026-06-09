# Contributing to CarbonWise

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth development process and maintain high code quality.

## Code Style

- We use **ESLint** and **Prettier** for code formatting.
- Every file MUST contain a JSDoc `@module` declaration at the top.
- All functions MUST have explicit return types.
- Avoid "magic values" in code; place all constants in `src/constants/index.ts`.
- Components should ideally remain under 80 lines of code. Extract sub-components if they grow too large.
- All asynchronous calls MUST be wrapped in `try/catch` blocks, invoking `trackError()` in the catch block.

## Branch Naming

Please use the following prefixes for branch names:

- `feature/` for new features (e.g., `feature/dark-mode`)
- `fix/` for bug fixes (e.g., `fix/header-alignment`)
- `docs/` for documentation updates
- `refactor/` for code refactoring
- `test/` for adding or fixing tests

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add Google Maps Distance Matrix integration`
- `fix: resolve crash on null activity category`
- `docs: update setup instructions in README`
- `test: add branch coverage for DashboardPage`

## Pull Request Checklist

Before submitting a Pull Request, ensure that your branch passes all automated checks:

1. **Linting:** Run `npm run lint` and resolve any errors.
2. **Type Checking:** Run `npx tsc --noEmit` and resolve any TypeScript errors.
3. **Tests Pass:** Run `npm run test` to verify no regressions.
4. **Coverage:** Run `npm run test:coverage`. Branch, Statement, Function, and Line coverage **MUST be ≥70%**.
