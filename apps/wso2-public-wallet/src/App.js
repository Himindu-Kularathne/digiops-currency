import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from './LayoutView';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect, useState } from 'react';
import "./App.css";

function App() {
  const { state, signIn } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      if (!state?.isAuthenticated) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay
          await signIn();
        } catch (error) {
          console.error("Authentication failed:", error);
        }
      }
      setLoading(false);
    };

    authenticateUser();
  }, [state?.isAuthenticated, signIn]);

  if (loading) {
    return <div className="loading-screen">Authenticating...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/*" element={state.isAuthenticated ? <LayoutView /> : <div>Unauthorized Access</div>} />
      </Routes>
    </Router>
  );
}

export default App;
