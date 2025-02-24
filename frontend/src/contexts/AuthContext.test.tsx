import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider

// Mock fetch globally
global.fetch = vi.fn();

const mockUser = {
  id: "1",
  email: "test@example.com",
  username: "testuser",
  token: "fake-jwt-token",
};

// Test component to consume context
const TestComponent = () => {
  const auth = useAuth();
  return <p>{auth?.user?.email || "No user"}</p>;
};

// Create a QueryClient instance
const queryClient = new QueryClient();

// Custom wrapper to render AuthProvider with Router and QueryClientProvider
const renderWithAuthProvider = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{ui}</AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should load user from localStorage on mount", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    renderWithAuthProvider(<TestComponent />);

    await waitFor(() => expect(screen.getByText(mockUser.email)).toBeInTheDocument());
  });

  it("should call login API and update state on success", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: mockUser.token,
        token_type: "Bearer",
        user: mockUser,
      }),
    });

    let auth;
    const TestLoginComponent = () => {
      auth = useAuth();
      return <button onClick={() => auth?.login("test@example.com", "password123")}>Login</button>;
    };

    renderWithAuthProvider(<TestLoginComponent />);

    screen.getByText("Login").click();

    await waitFor(() => expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser)));
    await waitFor(() => expect(localStorage.getItem("token")).toBe(mockUser.token));
  });

  it("should logout and clear storage", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", mockUser.token);

    let auth;
    const TestLogoutComponent = () => {
      auth = useAuth();
      return <button onClick={() => auth?.logout()}>Logout</button>;
    };

    renderWithAuthProvider(<TestLogoutComponent />);

    screen.getByText("Logout").click();

    await waitFor(() => expect(localStorage.getItem("user")).toBeNull());
    await waitFor(() => expect(localStorage.getItem("token")).toBeNull());
  });
});