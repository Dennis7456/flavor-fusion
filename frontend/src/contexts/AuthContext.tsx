import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const userSession = localStorage.getItem("user");
    if (userSession) {
      setUser(JSON.parse(userSession));
    }
    setIsLoading(false);
  }, []);

  // Login mutation
  interface LoginCredentials {
    email: string;
    password: string;
  }

  interface LoginResponse {
    user: User;
  }

  //Register mutation
  interface UserData {
    username: string;
    email: string;
    password: string;
  }

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {

      const formData = new URLSearchParams();
      formData.append("email", credentials.email);
      formData.append("password", credentials.password);

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (!response.ok) {
        throw new Error("Login failed - please try again.");
      }
  
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to log in. Please try again: ${error.message}`,
      });
    },
  });
    

  // Register mutation
  const registerMutation = useMutation<{ user: User }, Error, UserData>({
    mutationFn: async (userData: UserData): Promise<{ user: User }> => {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error("Registration failed - please try again.");
      }
  
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Welcome to Flavour Fusion!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create account. Please try again: ${error.message}`,
      });
    },
  });
  

  // Login function
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Register function
  const register = async (email: string, password: string, username: string) => {
    await registerMutation.mutateAsync({ email, password, username });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Goodbye!",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};