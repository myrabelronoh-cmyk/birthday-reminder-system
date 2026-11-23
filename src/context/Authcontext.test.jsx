import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AuthProvider, useAuth } from "./Authcontext";

const mocks = vi.hoisted(() => ({
  auth: {},
  unsubscribe: vi.fn(),
  createUser: vi.fn(),
  onAuthChanged: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: mocks.auth,
  isFirebaseConfigured: true,
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: mocks.createUser,
  onAuthStateChanged: mocks.onAuthChanged,
  signInWithEmailAndPassword: mocks.signIn,
  signOut: mocks.signOut,
}));

function AuthDetails() {
  const { currentUser, loading, authError, isAuthenticated } = useAuth();

  return (
    <div>
      <p data-testid="loading">{loading ? "Loading" : "Ready"}</p>
      <p data-testid="user">{currentUser?.email || "Signed out"}</p>
      <p data-testid="authenticated">{String(isAuthenticated)}</p>
      {authError && <p role="alert">{authError}</p>}
    </div>
  );
}

function renderAuthProvider() {
  return render(
    <AuthProvider>
      <AuthDetails />
    </AuthProvider>
  );
}

function AuthActions() {
  const { signUp, signIn, signOut: logOut } = useAuth();

  return (
    <div>
      <button onClick={() => signUp("new@example.com", "password123").catch(() => {})}>
        Create account
      </button>
      <button onClick={() => signIn("user@example.com", "password123").catch(() => {})}>
        Sign in
      </button>
      <button onClick={() => logOut().catch(() => {})}>Sign out</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createUser.mockResolvedValue({ user: { email: "new@example.com" } });
    mocks.signIn.mockResolvedValue({ user: { email: "user@example.com" } });
    mocks.signOut.mockResolvedValue(undefined);
    mocks.onAuthChanged.mockImplementation((_auth, onUser) => {
      onUser(null);
      return mocks.unsubscribe;
    });
  });

  it("listens for a signed-out user and stops listening on unmount", async () => {
    const { unmount } = renderAuthProvider();

    expect(await screen.findByTestId("loading")).toHaveTextContent("Ready");
    expect(screen.getByTestId("user")).toHaveTextContent("Signed out");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(onAuthStateChanged).toHaveBeenCalledWith(
      mocks.auth,
      expect.any(Function),
      expect.any(Function)
    );

    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalled();
  });

  it("shows a signed-in user from Firebase", async () => {
    mocks.onAuthChanged.mockImplementation((_auth, onUser) => {
      onUser({ email: "user@example.com" });
      return mocks.unsubscribe;
    });

    renderAuthProvider();

    expect(await screen.findByTestId("user")).toHaveTextContent(
      "user@example.com"
    );
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
  });

  it("shows errors reported by the Firebase listener", async () => {
    mocks.onAuthChanged.mockImplementation((_auth, _onUser, onError) => {
      onError(new Error("Could not check account"));
      return mocks.unsubscribe;
    });

    renderAuthProvider();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not check account"
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("Ready");
  });

  it("shows errors if Firebase cannot start listening", async () => {
    mocks.onAuthChanged.mockImplementation(() => {
      throw new Error("Firebase is unavailable");
    });

    renderAuthProvider();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Firebase is unavailable"
    );
  });

  it("creates an account with the supplied email and password", async () => {
    function CreateAccountButton() {
      const { signUp } = useAuth();
      return (
        <button onClick={() => signUp("new@example.com", "password123")}>
          Create account
        </button>
      );
    }

    render(
      <AuthProvider>
        <CreateAccountButton />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mocks.auth,
        "new@example.com",
        "password123"
      );
    });
  });

  it("signs in with the supplied email and password", async () => {
    function SignInButton() {
      const { signIn } = useAuth();
      return (
        <button onClick={() => signIn("user@example.com", "password123")}>
          Sign in
        </button>
      );
    }

    render(
      <AuthProvider>
        <SignInButton />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mocks.auth,
        "user@example.com",
        "password123"
      );
    });
  });

  it("signs out the current user", async () => {
    function SignOutButton() {
      const { signOut: logOut } = useAuth();
      return <button onClick={logOut}>Sign out</button>;
    }

    render(
      <AuthProvider>
        <SignOutButton />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(mocks.auth);
    });
  });

  it("reports failed account creation", async () => {
    mocks.createUser.mockRejectedValue(new Error("Could not create account"));
    render(
      <AuthProvider>
        <AuthDetails />
        <AuthActions />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not create account"
    );
  });

  it("reports failed sign-in", async () => {
    mocks.signIn.mockRejectedValue(new Error("Incorrect password"));
    render(
      <AuthProvider>
        <AuthDetails />
        <AuthActions />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Incorrect password"
    );
  });

  it("reports failed sign-out", async () => {
    mocks.signOut.mockRejectedValue(new Error("Could not sign out"));
    render(
      <AuthProvider>
        <AuthDetails />
        <AuthActions />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not sign out"
    );
  });
});
