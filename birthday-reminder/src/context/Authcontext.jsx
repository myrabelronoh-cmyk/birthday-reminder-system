import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  async function signUp(email, password) {
    setAuthError("");

    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  async function signIn(email, password) {
    setAuthError("");

    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  async function signOut() {
    setAuthError("");

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let unsubscribe;

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
          setLoading(false);
          setAuthError("");
        },
        (error) => {
          setAuthError(error.message);
          setLoading(false);
        }
      );
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
    signUp,
    signIn,
    signOut,
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