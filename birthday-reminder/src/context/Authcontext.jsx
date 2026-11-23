import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import {
  observeAuthState,
} from "../services/authService";

import {
  isFirebaseConfigured,
} from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let unsubscribe;

    try {
      unsubscribe = observeAuthState((user) => {
        setCurrentUser(user);
        setLoading(false);
        setAuthError("");
      });
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
    authError,
    isAuthenticated: Boolean(currentUser),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}