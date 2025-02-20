
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import logo from '../media/FlavourFusionLogo-removebg-preview.png';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-semibold text-primary">
              <img src={logo} alt="Flavour Fusion" className="h-[100px] w-[100px]" />
            </Link>
            <Link to="/" className="text-xl font-semibold text-primary">
              Flavour Fusion
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/recipes" className="text-gray-600 hover:text-primary transition-colors">
              Recipes
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            {user ? (
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
