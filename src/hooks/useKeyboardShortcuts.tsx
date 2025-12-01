import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Alt+D - Dashboard
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // Alt+P - Profile
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        navigate('/my-profile');
      }

      // Alt+S - Settings
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        navigate('/settings');
      }

      // Alt+N - Notifications
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        navigate('/notifications');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};
