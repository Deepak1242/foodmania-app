import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { loginState } from '../atom/atom';

function AuthChecker({ children }) {
  const [state, setState] = useAtom(loginState);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we have a login state in localStorage
        const savedState = localStorage.getItem('loginState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // If we have a user and they're logged in, keep the state
          if (parsedState.isLogin && parsedState.user) {
            setState({
              isLogin: true,
              user: parsedState.user,
              loading: false
            });
          } else {
            // If the saved state is not valid, clear it
            localStorage.removeItem('loginState');
            setState({
              isLogin: false,
              user: {},
              loading: false
            });
          }
        } else {
          // No saved state, set to not logged in
          setState({
            isLogin: false,
            user: {},
            loading: false
          });
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // If there's an error parsing, clear the login state
        localStorage.removeItem('loginState');
        setState({
          isLogin: false,
          user: {},
          loading: false
        });
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#0d327b] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return children;
}

export default AuthChecker;