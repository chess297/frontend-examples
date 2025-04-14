import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">404 Not Found</h1>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
