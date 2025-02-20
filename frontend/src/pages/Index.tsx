
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-up">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
        Welcome to Flavour Fusion
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Your personal recipe collection and meal planning companion. Discover, create, and share
        delicious recipes with our community.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button className="text-lg px-8">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="text-lg px-8">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
