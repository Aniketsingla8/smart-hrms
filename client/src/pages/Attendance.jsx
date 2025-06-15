import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function Attendance() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  const OFFICE_LOCATION = {
    latitude: 30.301824, // Example latitude
    longitude: 75.366061, // Example longitude
  };

  const RADIUS_THRESHOLD = 1000; // IN METERS

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const fi1 = toRadians(lat1);
    const fi2 = toRadians(lat2);
    const deltaFi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a = Math.sin(deltaFi / 2) * Math.sin(deltaFi / 2) + Math.cos(fi1) * Math.cos(fi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const handleCheckIn = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    setLoading(true);
    setError(null);
    setStatus("");
    setLocation(null);

    // Check if the current time is within the allowed check-in window (9:00 AM to 10:00 AM)
    const isAllowedTime =
      currentHour >= 9 && (currentHour < 10 || (currentHour === 10 && currentMinute === 0));

    if (!isAllowedTime) {
      setError("⛔ You can only mark attendance between 9:00 AM and 10:00 AM.");
      setLoading(false);
      return;
    }

    // Simulate GPS check-in logic
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          OFFICE_LOCATION.latitude,
          OFFICE_LOCATION.longitude
        );

        if (distance <= RADIUS_THRESHOLD) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setStatus("✅ Attendance marked successfully!");
        }
        else {
          setError("❌ You are outside the allowed area.");
        }
        setLoading(false);
      },
      (err) => {
        setError("Failed to retrieve location. Please enable GPS.");
        setLoading(false);
      }
    );
  }
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-muted">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Mark your attendance based on your location.
          </p>

          <Button 
          onClick={handleCheckIn} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:brightness-110"
          >
            {loading ? "Checking location..." : "Mark Attendance"}
          </Button>

          {error && (
            <Alert 
            variant="destructive"
            className="transition-opacity duration-300 animate-in fade-in"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status && location && (
            <Alert className="border-green-500 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {status} <br />
                Location: {location.latitude}, {location.longitude}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
