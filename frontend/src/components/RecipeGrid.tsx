
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
  id: string;
  title: string;
  description: string;
  likes: number;
  userId: string;
}

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  userRecipes?: boolean;
  onLike?: (id: string) => void;
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

  const itemsPerPage = 9;
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <Link to={`/recipe/${recipe.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
              </CardHeader>
            </Link>
            <CardContent>
              <p className="text-gray-600 line-clamp-2 mb-4">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onLike?.(recipe.id);
                    }}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        recipe.likes > 0 ? "fill-red-500 text-red-500" : ""
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
