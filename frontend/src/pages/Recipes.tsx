
import { useState } from "react";
import RecipeGrid from "@/components/RecipeGrid";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual API calls
const mockRecipes = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Recipe ${i + 1}`,
  description: "A delicious recipe description that explains the dish and its ingredients.",
  likes: Math.floor(Math.random() * 50),
  userId: "1",
}));

const Recipes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = (id: string) => {
    toast({
      title: "Success",
      description: "Recipe liked successfully!",
    });
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
      <RecipeGrid
        recipes={mockRecipes}
        isLoading={isLoading}
        onLike={handleLike}
      />
    </div>
  );
};

export default Recipes;
