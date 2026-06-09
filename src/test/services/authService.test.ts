/**
 * @module __tests__/authService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithRedirect, signOut } from 'firebase/auth';

import { authService } from '../../services/authService';

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    getAuth: vi.fn(),
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider: vi.fn(() => ({
      addScope: vi.fn(),
      setCustomParameters: vi.fn(),
    })),
  };
});

vi.mock('../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('authService', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  describe('signInWithGoogle', (): void => {
    it('should call signInWithRedirect', async (): Promise<void> => {
      vi.mocked(signInWithRedirect).mockResolvedValueOnce(undefined as never);

      await authService.signInWithGoogle();

      expect(signInWithRedirect).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if sign in fails', async (): Promise<void> => {
      const mockError = new Error('Sign in failed');
      vi.mocked(signInWithRedirect).mockRejectedValueOnce(mockError);

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
