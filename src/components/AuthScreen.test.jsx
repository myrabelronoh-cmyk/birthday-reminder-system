import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthScreen from "./AuthScreen";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  authError: "",
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    signIn: mocks.signIn,
    signUp: mocks.signUp,
    authError: mocks.authError,
  }),
}));

describe("AuthScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authError = "";
    mocks.signIn.mockResolvedValue(undefined);
    mocks.signUp.mockResolvedValue(undefined);
  });

  it("signs in with an email and password", async () => {
    const user = userEvent.setup();
    render(<AuthScreen />);

    await user.type(screen.getByLabelText("Email"), " person@example.com ");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mocks.signIn).toHaveBeenCalledWith(
        "person@example.com",
        "password123"
      );
    });
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("switches to account creation and signs up with the entered details", async () => {
    const user = userEvent.setup();
    render(<AuthScreen />);

    await user.click(
      screen.getByRole("button", { name: "Need an account? Create one" })
    );

    expect(screen.getByText("Create an account")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mocks.signUp).toHaveBeenCalledWith(
        "new@example.com",
        "password123"
      );
    });
  });

  it("returns to the sign-in form from account creation", async () => {
    const user = userEvent.setup();
    render(<AuthScreen />);

    await user.click(
      screen.getByRole("button", { name: "Need an account? Create one" })
    );
    await user.click(
      screen.getByRole("button", { name: "Already have an account? Sign in" })
    );

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("shows a sign-in error", async () => {
    const user = userEvent.setup();
    mocks.signIn.mockRejectedValue(new Error("Incorrect password"));
    render(<AuthScreen />);

    await user.type(screen.getByLabelText("Email"), "person@example.com");
    await user.type(screen.getByLabelText("Password"), "badpass");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Incorrect password"
    );
  });

  it("shows errors from the Firebase auth listener", () => {
    mocks.authError = "Could not connect to Firebase";
    render(<AuthScreen />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not connect to Firebase"
    );
  });

  it("disables the form while Firebase is processing a request", async () => {
    let finishSignIn;
    mocks.signIn.mockReturnValue(
      new Promise((resolve) => {
        finishSignIn = resolve;
      })
    );

    render(<AuthScreen />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "person@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("button", { name: "Please wait..." }))
      .toBeDisabled();

    finishSignIn();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign in" }))
        .toBeEnabled();
    });
  });
});
