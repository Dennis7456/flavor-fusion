
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  username: string;
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

  const login = async (email: string, password: string) => {
    try {
      // Mock login for now - replace with actual authentication
      const mockUser = { id: "1", email, username: email.split("@")[0] };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in. Please try again.",
      });
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      // Mock registration for now - replace with actual registration
      const mockUser = { id: "1", email, username };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast({
        title: "Welcome to Flavour Fusion!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    }
  };

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
