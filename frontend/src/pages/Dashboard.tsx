import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import RecipeGrid from "@/components/RecipeGrid";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Recipe {
  id: number;
  title: string;
  cuisine_type: string;
  cooking_time: number;
  ingredients: string;
  instructions: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newRecipe, setNewRecipe] = useState({
    title: "",
    cuisine_type: "",
    cooking_time: "",
    ingredients: "",
    instructions: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteRecipe, setDeleteRecipe] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!user) return <p>Loading user data...</p>;

  // Fetch user recipes
  const {
    data: recipes,
    isLoading,
  } = useQuery({
    queryKey: ["userRecipes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`http://localhost:8000/api/recipes/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch recipes");
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Mutation for adding a recipe
  const addRecipeMutation = useMutation({
    mutationFn: async () => {
      setIsAdding(true);
      const response = await fetch("http://localhost:8000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) throw new Error("Failed to add recipe");
      return response.json();
    },
    onSuccess: () => {
      setIsAdding(false);
      toast({ title: "Success", description: "Recipe added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["userRecipes", user?.id] });

      setNewRecipe({ title: "", cuisine_type: "", cooking_time: "", ingredients: "", instructions: "" });
      setIsOpen(false); // ✅ Close modal after adding
    },
    onError: () => {
      setIsAdding(false);
      toast({ variant: "destructive", title: "Error", description: "Failed to add recipe." });
    },
  });

  const handleAddRecipe = () => addRecipeMutation.mutate();

  // Mutation for updating a recipe
  const editMutation = useMutation({
    mutationFn: async (updatedRecipe: Recipe) => {
      const response = await fetch(`http://localhost:8000/api/recipes/${updatedRecipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) throw new Error("Failed to update recipe");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Recipe updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["userRecipes", user?.id] });
      setIsEditOpen(false);
      setEditRecipe(null);
    },
  });

  const handleEdit = (recipe) => {
    setEditRecipe({...recipe});
    setIsEditOpen(true);
  };

  const updateRecipe = () => {
    if (editRecipe) {
      editMutation.mutate(editRecipe);
    }
  };

  // Handle input change safely
const handleInputChange = (e) => {
  setEditRecipe((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

  // Mutation for deleting a recipe
  const deleteMutation = useMutation({
    mutationFn: async (recipeId: number) => {
      const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete recipe");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Recipe deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["userRecipes", user?.id] });
      setIsDeleteOpen(false);
      setDeleteRecipe(null);
    },
  });

  const handleDelete = (recipe) => {
    setDeleteRecipe(recipe);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteRecipe) {
      deleteMutation.mutate(deleteRecipe.id);
    }
  };

  return (
    <div className="animate-fade-up space-y-8">
    <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>

    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Recipes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>Add Recipe</Button>
          </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4">
              <Input
                placeholder="Title"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              />
              <Input
                placeholder="Cuisine Type"
                value={newRecipe.cuisine_type}
                onChange={(e) => setNewRecipe({ ...newRecipe, cuisine_type: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cooking Time (minutes)"
                value={newRecipe.cooking_time}
                onChange={(e) => setNewRecipe({ ...newRecipe, cooking_time: e.target.value })}
              />
              <Input
                placeholder="Ingredients (comma-separated)"
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
              />
              <textarea
                className="border p-2 w-full rounded-md"
                placeholder="Instructions"
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
              />
              <Button
                onClick={handleAddRecipe}
                disabled={isAdding}
                className="w-full"
              >
                {isAdding ? "Adding..." : "Add Recipe"}
              </Button>
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

    {/* Edit Recipe Modal */}
<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Recipe</DialogTitle>
    </DialogHeader>
    <div className="p-4 space-y-4">
      <Input
        name="title"
        placeholder="Title"
        value={editRecipe?.title || ""}
        onChange={handleInputChange}
      />
      <Button onClick={updateRecipe} className="w-full">Update Recipe</Button>
      <Button variant="secondary" onClick={() => setIsEditOpen(false)} className="w-full">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>

    {/* Delete Confirmation Modal */}
<Dialog open={isDeleteOpen} onOpenChange={(open) => setIsDeleteOpen(open)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure you want to delete this recipe?</DialogTitle>
    </DialogHeader>
    <div className="p-4 space-y-4">
      <Button variant="destructive" onClick={confirmDelete} className="w-full">
        Delete
      </Button>
      <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} className="w-full">
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>
  </div>
  );
};

export default Dashboard;
