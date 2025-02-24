import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import RecipeGrid from "@/components/RecipeGrid";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: number;
  title: string;
  cuisine_type: string;
  cooking_time: number;
  instructions: string;
  ingredients: string;
  userId: number;
  likes: number;
  userHasLiked: boolean;
}

const Recipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all recipes
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["allRecipes"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");
  
      const data = await response.json();
  
      // Fetch likes count and user like status for each recipe
      const recipesWithLikes = await Promise.all(
        data.map(async (recipe) => {
          const likeResponse = await fetch(
            `http://localhost:8000/api/recipes/${recipe.id}/favorite-count`
          );
          const likeData = await likeResponse.json();
  
          // Check if the logged-in user has liked this recipe
          const userLikesResponse = await fetch(
            `http://localhost:8000/api/users/favorites`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const userLikes = await userLikesResponse.json();
          const userHasLiked = userLikes.some((fav: any) => fav.id === recipe.id);
  
          return {
            ...recipe,
            id: Number(recipe.id), // Ensure ID is a number
            likes: likeData.count || 0, // Ensure likes count is available
            userHasLiked, // Boolean to track if user liked this recipe
          };
        })
      );
  
      return recipesWithLikes;
    },
  });
  

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (recipeId: number) => { 
      const response = await fetch(
        `http://localhost:8000/api/recipes/${recipeId}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to like recipe");
      return response.json();
    },
    onMutate: async (recipeId) => {
      // Optimistically update UI
      queryClient.setQueryData(["allRecipes"], (oldRecipes: Recipe[]) => {
        return oldRecipes.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                userHasLiked: !recipe.userHasLiked,
                likes: recipe.userHasLiked ? recipe.likes - 1 : recipe.likes + 1, // Update count
              }
            : recipe
        );
      });
    },
    onSuccess: async (_, recipeId) => {
      // Fetch updated like count
      const response = await fetch(
        `http://localhost:8000/api/recipes/${recipeId}/favorite-count`
      );
      const data = await response.json();
  
      queryClient.setQueryData(["allRecipes"], (oldRecipes: Recipe[]) => {
        return oldRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, likes: data.count } : recipe
        );
      });
    },
    onError: (_, recipeId) => {
      // Revert optimistic update if error occurs
      queryClient.setQueryData(["allRecipes"], (oldRecipes: Recipe[]) => {
        return oldRecipes.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                userHasLiked: !recipe.userHasLiked,
                likes: recipe.userHasLiked ? recipe.likes + 1 : recipe.likes - 1,
              }
            : recipe
        );
      });
    },
  });
  

  const handleLike = (id: number) => { // Change parameter type to number
    likeMutation.mutate(id);
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
      <RecipeGrid
        recipes={recipes || []}
        isLoading={isLoading}
        onLike={handleLike}
      />
    </div>
  );
};

export default Recipes;