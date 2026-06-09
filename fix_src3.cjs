const fs = require('fs');
const glob = require('fs').readdirSync;

function walk(dir) {
  let results = [];
  const list = glob(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const allFiles = walk('e:/carbon-footprint/src');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Test files specific
  if (file.includes('/test/')) {
    content = content.replace(/it\('([^']+)', \(\) => \{/g, "it('$1', (): void => {");
    content = content.replace(/it\('([^']+)', async \(\) => \{/g, "it('$1', async (): Promise<void> => {");
    content = content.replace(/describe\('([^']+)', \(\) => \{/g, "describe('$1', (): void => {");
    content = content.replace(/beforeEach\(\(\) => \{/g, "beforeEach((): void => {");
    content = content.replace(/afterEach\(\(\) => \{/g, "afterEach((): void => {");
    content = content.replace(/\(match: any\)/g, "(match: unknown)");
    content = content.replace(/error: any/g, "error: unknown");
    content = content.replace(/value: any/g, "value: unknown");
    content = content.replace(/ReactNode \| any/g, "ReactNode | unknown");
    content = content.replace(/: Record<string, any>/g, ": Record<string, unknown>");
    content = content.replace(/vi\.mock\('([^']+)', \(\) => \(\{/g, "vi.mock('$1', (): Record<string, unknown> => ({");
    content = content.replace(/vi\.mock\('\.\/store\/AuthContext', \(\) => \(\{/g, "vi.mock('./store/AuthContext', (): Record<string, unknown> => ({");
    content = content.replace(/export const mockNavigate = vi\.fn\(\);/g, "export const mockNavigate: import('vitest').Mock = vi.fn();");
    content = content.replace(/const mockMathRandom = vi\.fn\(\);/g, "const mockMathRandom: import('vitest').Mock = vi.fn();");
    content = content.replace(/as any\b/g, "as unknown");
  }

  // Source files fixes based on lint output
  if (file.endsWith('AuthContext.tsx')) {
    content = content.replace(/return \(\) => unsubscribe\(\);/, 'return (): void => unsubscribe();');
    content = content.replace(/export const useAuthContext = \(\) => useContext\(AuthContext\);/, 'export const useAuthContext = (): AuthContextType => useContext(AuthContext);');
  }
  if (file.endsWith('useActivities.ts')) {
    content = content.replace(/export const useActivities = \(\) => \{/, 'export const useActivities = (): { activities: Activity[]; loading: boolean; error: string | null; fetchActivities: () => Promise<void>; addActivity: (activity: Omit<Activity, "id">) => Promise<void>; } => {');
    content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
  }
  if (file.endsWith('useAsync.ts')) {
    content = content.replace(/export function useAsync<T, E = any>\(/, 'export function useAsync<T, E = unknown>(');
    content = content.replace(/asyncFunction: \(\) => Promise<T>/g, 'asyncFunction: () => Promise<T>');
    content = content.replace(/execute: async \(\) => \{/g, 'execute: async (): Promise<void> => {');
    content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  }
  if (file.endsWith('useAuth.ts')) {
    content = content.replace(/const login = async \(\) => \{/g, 'const login = async (): Promise<void> => {');
    content = content.replace(/const logout = async \(\) => \{/g, 'const logout = async (): Promise<void> => {');
    content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
  }
  if (file.endsWith('useGeminiInsights.ts')) {
    content = content.replace(/const generateInsights = async \(activities: Activity\[\]\) => \{/g, 'const generateInsights = async (activities: Activity[]): Promise<void> => {');
  }
  if (file.endsWith('AppLayout.tsx')) {
    content = content.replace(/const handleMenuToggle = \(\) => \{/g, 'const handleMenuToggle = (): void => {');
    content = content.replace(/const handleSignOut = async \(\) => \{/g, 'const handleSignOut = async (): Promise<void> => {');
  }
  if (file.endsWith('AuthPage.tsx')) {
    content = content.replace(/const handleGoogleSignIn = async \(\) => \{/g, 'const handleGoogleSignIn = async (): Promise<void> => {');
  }
  if (file.endsWith('analyticsService.ts')) {
    content = content.replace(/export const trackEvent = \(eventName: string, eventParams\?: Record<string, any>\) => \{/g, 'export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {');
    content = content.replace(/export const trackError = \(error: any, context\?: Record<string, any>\) => \{/g, 'export const trackError = (error: unknown, context?: Record<string, unknown>): void => {');
  }
  if (file.endsWith('authService.ts')) {
    content = content.replace(/export const signInWithGoogle = async \(\) => \{/g, 'export const signInWithGoogle = async (): Promise<User> => {');
    content = content.replace(/export const signOutUser = async \(\) => \{/g, 'export const signOutUser = async (): Promise<void> => {');
  }
  if (file.endsWith('geminiService.ts')) {
    content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  }
  if (file.endsWith('CategorySelect.tsx')) {
    content = content.replace(/onChange=\{\(e\) => onCategoryChange/, 'onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => onCategoryChange');
  }
  if (file.endsWith('CommuteForm.tsx')) {
    content = content.replace(/onChange=\{\(e\) => setDistance/, 'onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setDistance');
  }
  if (file.endsWith('FootprintChart.tsx')) {
    content = content.replace(/\{children\}: any/g, '{children}: {children: React.ReactNode}');
    content = content.replace(/\{ payload, label, active \}: any/g, '{ payload, label, active }: {payload: unknown[], label: string, active: boolean}');
  }

  fs.writeFileSync(file, content);
});

console.log('Advanced patch complete');
