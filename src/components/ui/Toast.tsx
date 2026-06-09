/**
 * @module components/ui/Toast
 * @description Toast notification component.
 */

import React, { useEffect, useState } from 'react';

interface Props {
  readonly message: string;
  readonly type?: 'success' | 'error';
  readonly onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ message, type = 'success', onDismiss }): React.ReactElement | null => {
  const [visible, setVisible] = useState(true);

  useEffect((): (() => void) => {
    const timer = setTimeout((): void => {
      setVisible(false);
      setTimeout(onDismiss, 300); // allow animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed bottom-4 right-4 ${bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50`}>
      <span className="font-medium">{message}</span>
      <button onClick={() => setVisible(false)} className="text-white/80 hover:text-white">&times;</button>
    </div>
  );
};
