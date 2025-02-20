
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import RecipeGrid from "@/components/RecipeGrid";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data - replace with actual API calls
const mockUserRecipes = Array.from({ length: 5 }, (_, i) => ({
  id: `${i + 1}`,
  title: `My Recipe ${i + 1}`,
  description: "My personal recipe with special ingredients and instructions.",
  likes: Math.floor(Math.random() * 20),
  userId: "1",
}));

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (recipe: any) => {
    toast({
      title: "Success",
      description: "Recipe updated successfully!",
    });
  };

  const handleDelete = (recipe: any) => {
    toast({
      title: "Success",
      description: "Recipe deleted successfully!",
    });
  };

  return (
    <div className="animate-fade-up space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
      
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Recipes</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Recipe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              {/* Add recipe form will go here */}
              <div className="p-4">
                <p className="text-gray-600">Recipe form coming soon...</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <RecipeGrid
          recipes={mockUserRecipes}
          isLoading={isLoading}
          userRecipes={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
};

export default Dashboard;
