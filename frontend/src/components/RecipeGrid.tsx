
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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


interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  userRecipes?: boolean;
  onLike?: (id: number) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

const RecipeGrid = ({
  recipes,
  isLoading,
  userRecipes = false,
  onLike,
  onEdit,
  onDelete,
}: RecipeGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [cookingTimeFilter, setCookingTimeFilter] = useState<number | "all">("all");

  const itemsPerPage = 9;
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = cuisineFilter === "all" || recipe.cuisine_type === cuisineFilter;
    const matchesTime = cookingTimeFilter === "all" || recipe.cooking_time <= cookingTimeFilter;
    
    return matchesSearch && matchesCuisine && matchesTime;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likes - a.likes;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const paginatedRecipes = sortedRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {/* Cuisine Type Filter */}
        <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Cuisine Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Cuisines</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
          </SelectContent>
        </Select>

      {/* Cooking Time Filter */}
  <Select 
    value={cookingTimeFilter.toString()} 
    onValueChange={(v) => setCookingTimeFilter(v === "all" ? "all" : Number(v))}
  >
    <SelectTrigger className="w-[180px] bg-white">
      <SelectValue placeholder="Cooking Time" />
    </SelectTrigger>
    <SelectContent className="bg-white">
      <SelectItem value="all">Any Time</SelectItem>
      <SelectItem value="30">Under 30 mins</SelectItem>
      <SelectItem value="60">Under 60 mins</SelectItem>
      <SelectItem value="90">Under 90 mins</SelectItem>
    </SelectContent>
  </Select>

  <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show "No Recipes" message if no recipes are available */}
    {paginatedRecipes.length === 0 && !isLoading && (
      <p className="text-center text-gray-500 text-xl">You have no recipes yet :(</p>
    )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <Link to={`/recipe/${recipe.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
              </CardHeader>
            </Link>
            <CardContent>
            <div className="flex items-center gap-2 mb-2">
    <span className="text-sm text-gray-500">
      {recipe.cuisine_type}
    </span>
    <span className="text-sm text-gray-500">
      • {recipe.cooking_time} mins
    </span>
  </div>
              <p className="text-gray-600 line-clamp-2 mb-4">
                {recipe.ingredients}
              </p>
              <p className="text-gray-600 line-clamp-2 mb-4">
                {recipe.instructions}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <Button
  variant="ghost"
  size="sm"
  onClick={(e) => {
    e.preventDefault()
    onLike?.(recipe.id)
  }}
>
  <Heart
    className={`h-5 w-5 ${
      recipe.userHasLiked ? "fill-red-500 text-red-500" : "text-gray-500"
    }`}
  />
  <span className="ml-1">{recipe.likes}</span>
</Button>

                </div>
                {userRecipes && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(recipe)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(recipe)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage((p) => (p > 1 ? p - 1 : p))
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => (p < totalPages ? p + 1 : p))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RecipeGrid;
