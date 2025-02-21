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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!user) return <p>Loading user data...</p>;

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userRecipes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`http://localhost:8000/api/recipes?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching recipes");
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: `Failed to fetch recipes. Please try again. Error: ${error.message}`,
    });
  }

  const editMutation = useMutation({
    mutationFn: async (updatedRecipe: any) => {
      const response = await fetch(`http://localhost:8000/api/recipes/${updatedRecipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(updatedRecipe),
      });
      if (!response.ok) {
        throw new Error("An error occurred while updating the recipe");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Recipe updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["userRecipes", user?.id] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update recipe. Please try again.",
      });
    },
  });

  const handleEdit = (recipe: any) => {
    editMutation.mutate(recipe);
  };

  const deleteMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["userRecipes", user?.id] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
      });
    },
  });

  const handleDelete = (recipe: any) => {
    deleteMutation.mutate(recipe.id);
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
              <div className="p-4">
                <p className="text-gray-600">Recipe form coming soon...</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <RecipeGrid
          recipes={recipes || []}
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