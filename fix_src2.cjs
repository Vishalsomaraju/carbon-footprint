const fs = require('fs');

function repl(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
}

// AuthContext
repl('e:/carbon-footprint/src/contexts/AuthContext.tsx', /const signIn = async \(\) => \{/, 'const signIn = async (): Promise<void> => {');
repl('e:/carbon-footprint/src/contexts/AuthContext.tsx', /const signOut = async \(\) => \{/, 'const signOut = async (): Promise<void> => {');

// useActivities
repl('e:/carbon-footprint/src/hooks/useActivities.ts', /export const useActivities = \(\) => \{/, 'export const useActivities = (): UseActivitiesReturn => {');
repl('e:/carbon-footprint/src/hooks/useActivities.ts', /catch \(err: any\) \{/g, 'catch (err: unknown) {');

// useAsync
repl('e:/carbon-footprint/src/hooks/useAsync.ts', /export function useAsync<T, E = any>\(/, 'export function useAsync<T, E = unknown>(');
repl('e:/carbon-footprint/src/hooks/useAsync.ts', /asyncFunction: \(\) => Promise<T>/, 'asyncFunction: () => Promise<T>,'); // wait regex
repl('e:/carbon-footprint/src/hooks/useAsync.ts', /execute: async \(\) => \{/, 'execute: async (): Promise<void> => {');
repl('e:/carbon-footprint/src/hooks/useAsync.ts', /catch \(error: any\) \{/, 'catch (error: unknown) {');

// useAuth
repl('e:/carbon-footprint/src/hooks/useAuth.ts', /const login = async \(\) => \{/, 'const login = async (): Promise<void> => {');
repl('e:/carbon-footprint/src/hooks/useAuth.ts', /const logout = async \(\) => \{/, 'const logout = async (): Promise<void> => {');
repl('e:/carbon-footprint/src/hooks/useAuth.ts', /catch \(err: any\) \{/g, 'catch (err: unknown) {');

// useGeminiInsights
repl('e:/carbon-footprint/src/hooks/useGeminiInsights.ts', /const generateInsights = async \(activities: Activity\[\]\) => \{/, 'const generateInsights = async (activities: Activity[]): Promise<void> => {');

// AppLayout
repl('e:/carbon-footprint/src/layouts/AppLayout.tsx', /const handleMenuToggle = \(\) => \{/, 'const handleMenuToggle = (): void => {');
repl('e:/carbon-footprint/src/layouts/AppLayout.tsx', /const handleSignOut = async \(\) => \{/, 'const handleSignOut = async (): Promise<void> => {');

// AuthPage
repl('e:/carbon-footprint/src/pages/AuthPage.tsx', /const handleGoogleSignIn = async \(\) => \{/, 'const handleGoogleSignIn = async (): Promise<void> => {');

// analyticsService
repl('e:/carbon-footprint/src/services/analyticsService.ts', /export const trackEvent = \(eventName: string, eventParams\?: Record<string, any>\) => \{/, 'export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {');
repl('e:/carbon-footprint/src/services/analyticsService.ts', /export const trackError = \(error: any, context\?: Record<string, any>\) => \{/, 'export const trackError = (error: unknown, context?: Record<string, unknown>): void => {');

// authService
repl('e:/carbon-footprint/src/services/authService.ts', /export const signInWithGoogle = async \(\) => \{/, 'export const signInWithGoogle = async (): Promise<User> => {');
repl('e:/carbon-footprint/src/services/authService.ts', /export const signOutUser = async \(\) => \{/, 'export const signOutUser = async (): Promise<void> => {');

// geminiService
repl('e:/carbon-footprint/src/services/geminiService.ts', /catch \(error: any\) \{/, 'catch (error: unknown) {');

console.log('Source files patched');
