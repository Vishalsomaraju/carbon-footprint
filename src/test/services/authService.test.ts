/**
 * @module __tests__/authService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithPopup, signOut } from 'firebase/auth';

import { authService } from '../../services/authService';

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    getAuth: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider: vi.fn((): import("react").ReactElement => ({
      addScope: vi.fn(),
      setCustomParameters: vi.fn()
    }))
  };
});

vi.mock('../../config', (): Record<string, unknown> => ({
  auth: {},
  googleProvider: {}
}));

describe('authService', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  describe('signInWithGoogle', (): void => {
    it('should call signInWithPopup and return the user', async (): Promise<void> => {
      const mockUserCredential = { user: { uid: 'user-123', email: 'test@example.com' } };
      vi.mocked(signInWithPopup).mockResolvedValueOnce(mockUserCredential as import('vitest').Mock);

      const user = await authService.signInWithGoogle();

      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(user.uid).toBe('user-123');
    });

    it('should throw an error if sign in fails', async (): Promise<void> => {
      const mockError = new Error('Sign in failed');
      vi.mocked(signInWithPopup).mockRejectedValueOnce(mockError);

      await expect(authService.signInWithGoogle()).rejects.toThrow('Sign in failed');
    });
  });

  describe('logout', (): void => {
    it('should call signOut', async (): Promise<void> => {
      vi.mocked(signOut).mockResolvedValueOnce(undefined);

      await authService.logout();

      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });
});
