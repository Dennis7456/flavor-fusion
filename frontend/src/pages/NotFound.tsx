
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-up">
      <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! This page doesn't exist.</p>
      <Link to="/">
        <Button variant="default">Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
