import { useState, useEffect } from "react";
import { dishesAPI } from "../api/api";

function TestPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing API connection...");
        const response = await dishesAPI.getAll();
        console.log("API Response:", response);
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Dishes Count: {dishes.length}</h1>
      <div className="grid gap-4">
        {dishes.slice(0, 3).map((dish) => (
          <div key={dish.id} className="border p-4 rounded">
            <h3 className="font-bold">{dish.name}</h3>
            <p>{dish.description}</p>
            <p className="text-green-600">${dish.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestPage;
