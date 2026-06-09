const fs = require('fs');

function R(file, search, replace) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.split(search).join(replace);
  fs.writeFileSync(file, c);
}

// CategorySelect.tsx
R('e:/carbon-footprint/src/components/features/CategorySelect.tsx', 
  'const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {', 
  'const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {');

// CommuteForm.tsx
R('e:/carbon-footprint/src/components/features/CommuteForm.tsx', 
  'const handleSubmit = (e: React.FormEvent) => {', 
  'const handleSubmit = (e: React.FormEvent): void => {');

// FootprintChart.tsx
R('e:/carbon-footprint/src/components/features/FootprintChart.tsx', 
  'const grouped = activities.reduce((acc, curr) => {', 
  'const grouped = activities.reduce((acc: Record<string, unknown>, curr) => {');
R('e:/carbon-footprint/src/components/features/FootprintChart.tsx', 
  '{} as Record<string, any>', 
  '{} as Record<string, unknown>');
R('e:/carbon-footprint/src/components/features/FootprintChart.tsx', 
  '(a: any, b: any)', 
  '(a: {date: string}, b: {date: string})');
R('e:/carbon-footprint/src/components/features/FootprintChart.tsx', 
  'React.memo(({ activities }) => {',
  'React.memo(({ activities }): React.ReactElement => {');

// AuthContext.tsx
R('e:/carbon-footprint/src/contexts/AuthContext.tsx', 
  'onAuthStateChanged(auth, (currentUser) => {', 
  'onAuthStateChanged(auth, (currentUser): void => {');

// useAsync.ts
R('e:/carbon-footprint/src/hooks/useAsync.ts', 'extends any[]', 'extends unknown[]');
R('e:/carbon-footprint/src/hooks/useAsync.ts', 'extends any[]', 'extends unknown[]');
R('e:/carbon-footprint/src/hooks/useAsync.ts', 
  'export function useAsync<T, Args extends unknown[]>(asyncFunction: AsyncFunction<T, Args>) {', 
  'export function useAsync<T, Args extends unknown[]>(asyncFunction: AsyncFunction<T, Args>): { execute: (...args: Args) => Promise<T>; data: T | null; loading: boolean; error: Error | null; setData: React.Dispatch<React.SetStateAction<T | null>> } {');
R('e:/carbon-footprint/src/hooks/useAsync.ts', 'catch (err: any)', 'catch (err: unknown)');

// useAuth.ts
R('e:/carbon-footprint/src/hooks/useAuth.ts', 
  'export const useAuth = () => {', 
  'export const useAuth = (): { user: User | null; loading: boolean; error: Error | null; login: () => Promise<User>; logout: () => Promise<void> } => {');

// useGeminiInsights.ts
R('e:/carbon-footprint/src/hooks/useGeminiInsights.ts', 
  'export const useGeminiInsights = () => {', 
  'export const useGeminiInsights = (): { insights: string; loading: boolean; error: string | null; getInsights: (activities: Activity[]) => Promise<void> } => {');

// AppLayout.tsx
R('e:/carbon-footprint/src/layouts/AppLayout.tsx', 
  '({ children }) => {', 
  '({ children }): React.ReactElement => {');

// AuthPage.tsx
R('e:/carbon-footprint/src/pages/AuthPage.tsx', 
  'export const AuthPage: React.FC = () => {', 
  'export const AuthPage: React.FC = (): React.ReactElement => {');

// DashboardPage.tsx
R('e:/carbon-footprint/src/pages/DashboardPage.tsx', 
  'export const DashboardPage: React.FC = () => {', 
  'export const DashboardPage: React.FC = (): React.ReactElement => {');

// analyticsService.ts
R('e:/carbon-footprint/src/services/analyticsService.ts', 
  'eventParams?: Record<string, any>', 
  'eventParams?: Record<string, unknown>');
R('e:/carbon-footprint/src/services/analyticsService.ts', 
  'error: any', 
  'error: unknown');
R('e:/carbon-footprint/src/services/analyticsService.ts', 
  'context?: Record<string, any>', 
  'context?: Record<string, unknown>');

// authService.ts
R('e:/carbon-footprint/src/services/authService.ts', 
  'const signInWithGoogle = async () => {', 
  'const signInWithGoogle = async (): Promise<User> => {');
R('e:/carbon-footprint/src/services/authService.ts', 
  'const logout = async () => {', 
  'const logout = async (): Promise<void> => {');

// geminiService.ts
R('e:/carbon-footprint/src/services/geminiService.ts', 
  'catch (error: any)', 
  'catch (error: unknown)');

// --- Test files ---
const testFiles = fs.readdirSync('e:/carbon-footprint/src/test', {recursive: true}).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
testFiles.forEach(file => {
  const p = 'e:/carbon-footprint/src/test/' + file;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/=> children/g, ': import("react").ReactNode => children');
  c = c.replace(/\(\) => <div/g, '(): import("react").ReactElement => <div');
  c = c.replace(/\(\) => \(/g, '(): import("react").ReactElement => (');
  c = c.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  c = c.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
  c = c.replace(/as any\b/g, 'as unknown');
  c = c.replace(/: any\b/g, ': unknown');
  c = c.replace(/<any>/g, '<unknown>');
  c = c.replace(/vi\.fn\(\) as unknown/g, 'vi.fn() as import("vitest").Mock');
  fs.writeFileSync(p, c);
});

console.log('Fixed explicitly.');
