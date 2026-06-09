const fs = require('fs');

function repl(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
}

// ActivityForm
repl('e:/carbon-footprint/src/components/features/ActivityForm.tsx', 
  /export const ActivityForm = \(\{\s*onSubmit,\s*initialData,\s*isLoading\s*\}\s*:\s*ActivityFormProps\) => \{/, 
  'export const ActivityForm = ({ onSubmit, initialData, isLoading }: ActivityFormProps): React.ReactElement => {'
);

// UI Components
repl('e:/carbon-footprint/src/components/ui/Button.tsx',
  /export const Button = \(\{([^)]+)\}\s*:\s*ButtonProps\) => \{/,
  'export const Button = ({$1}: ButtonProps): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/components/ui/Card.tsx',
  /export const Card = \(\{([^)]+)\}\s*:\s*CardProps\) => \{/,
  'export const Card = ({$1}: CardProps): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/components/ui/FormField.tsx',
  /export const FormField = \(\{([^)]+)\}\s*:\s*FormFieldProps\) => \{/,
  'export const FormField = ({$1}: FormFieldProps): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/components/ui/Input.tsx',
  /export const Input = \(\{([^)]+)\}\s*:\s*InputProps\) => \{/,
  'export const Input = ({$1}: InputProps): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/components/ui/LoadingSpinner.tsx',
  /export const LoadingSpinner = \(\{([^)]*)\}\s*:\s*LoadingSpinnerProps\) => \{/,
  'export const LoadingSpinner = ({$1}: LoadingSpinnerProps): React.ReactElement => {'
);

// AuthContext
repl('e:/carbon-footprint/src/contexts/AuthContext.tsx',
  /export const AuthProvider = \(\{ children \}: \{ children: ReactNode \}\) => \{/,
  'export const AuthProvider = ({ children }: { children: ReactNode }): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/contexts/AuthContext.tsx',
  /export const useAuthContext = \(\) => \{/,
  'export const useAuthContext = (): AuthContextType => {'
);

// useCommute
repl('e:/carbon-footprint/src/hooks/useCommute.ts',
  /export const useCommute = \(\) => \{/,
  'export const useCommute = (): UseCommuteReturn => {'
);
repl('e:/carbon-footprint/src/hooks/useCommute.ts',
  /const calculateEmissions = \(distanceKm: number, type: string\) => \{/,
  'const calculateEmissions = (distanceKm: number, type: string): number => {'
);

// useGeminiInsights
repl('e:/carbon-footprint/src/hooks/useGeminiInsights.ts',
  /export const useGeminiInsights = \(\) => \{/,
  'export const useGeminiInsights = (): UseGeminiInsightsReturn => {'
);
repl('e:/carbon-footprint/src/hooks/useGeminiInsights.ts',
  /const generateInsights = async \(activities: Activity\[\]\) => \{/,
  'const generateInsights = async (activities: Activity[]): Promise<void> => {'
);
repl('e:/carbon-footprint/src/hooks/useGeminiInsights.ts',
  /catch \(err: any\) \{/,
  'catch (err: unknown) {'
);

// AppLayout
repl('e:/carbon-footprint/src/layouts/AppLayout.tsx',
  /export const AppLayout = \(\) => \{/,
  'export const AppLayout = (): React.ReactElement => {'
);
repl('e:/carbon-footprint/src/layouts/AppLayout.tsx',
  /const handleSignOut = async \(\) => \{/,
  'const handleSignOut = async (): Promise<void> => {'
);

// AuthPage
repl('e:/carbon-footprint/src/pages/AuthPage.tsx',
  /const handleGoogleSignIn = async \(\) => \{/,
  'const handleGoogleSignIn = async (): Promise<void> => {'
);

// analyticsService
repl('e:/carbon-footprint/src/services/analyticsService.ts',
  /export const trackEvent = \(eventName: string, eventParams\?: Record<string, any>\) => \{/,
  'export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {'
);
repl('e:/carbon-footprint/src/services/analyticsService.ts',
  /export const trackError = \(error: any, context\?: Record<string, any>\) => \{/,
  'export const trackError = (error: unknown, context?: Record<string, unknown>): void => {'
);

// authService
repl('e:/carbon-footprint/src/services/authService.ts',
  /export const signInWithGoogle = async \(\) => \{/,
  'export const signInWithGoogle = async (): Promise<User> => {'
);
repl('e:/carbon-footprint/src/services/authService.ts',
  /export const signOutUser = async \(\) => \{/,
  'export const signOutUser = async (): Promise<void> => {'
);

// geminiService
repl('e:/carbon-footprint/src/services/geminiService.ts',
  /catch \(error: any\) \{/,
  'catch (error: unknown) {'
);

console.log('Source files patched');
