import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function AuthScreen() {
  const { signIn, signUp, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Birthday Reminder</h1>
        <p className="auth-description">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {(formError || authError) && (
            <p className="auth-form-error" role="alert">
              {formError || authError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <button
          className="auth-mode-button"
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setFormError("");
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </button>
      </section>
    </main>
  );
}

export default AuthScreen;
