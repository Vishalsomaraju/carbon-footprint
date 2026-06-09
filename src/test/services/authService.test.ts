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
    it('should call signInWithPopup', async (): Promise<void> => {
      vi.mocked(signInWithPopup).mockResolvedValueOnce({ user: { uid: '123' } } as any);

      await authService.signInWithGoogle();

      expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if sign in fails with normal error', async (): Promise<void> => {
      const mockError = new Error('Sign in failed');
      vi.mocked(signInWithPopup).mockRejectedValueOnce(mockError);

      await expect(authService.signInWithGoogle()).rejects.toThrow('Sign in failed');
    });
    
    it('should return null if user closed popup', async (): Promise<void> => {
      const mockError = new Error('Popup closed');
      (mockError as any).code = 'auth/popup-closed-by-user';
      vi.mocked(signInWithPopup).mockRejectedValueOnce(mockError);

      const result = await authService.signInWithGoogle();
      expect(result).toBeNull();
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
