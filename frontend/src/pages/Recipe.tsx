import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Recipe = () => {
  const { id } = useParams();

  // Fetch recipe details
  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/recipes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch recipe");
      return response.json();
    },
    enabled: !!id, // Only run if id exists
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading recipe. Please try again.
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600"><strong>Cuisine:</strong> {recipe.cuisine_type}</p>
          <p className="text-gray-600"><strong>Cooking Time:</strong> {recipe.cooking_time} mins</p>
          <p className="text-gray-600 mt-2"><strong>Ingredients:</strong></p>
          <p className="text-gray-700">{recipe.ingredients}</p>
          <p className="text-gray-600 mt-2"><strong>Instructions:</strong></p>
          <p className="text-gray-700">{recipe.instructions}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipe;
