
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Recipe = () => {
  const { id } = useParams();

  return (
    <div className="animate-fade-up">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Recipe ID: {id}</p>
          {/* Recipe details will be implemented later */}
          <p className="text-gray-600 mt-4">Recipe details coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipe;
