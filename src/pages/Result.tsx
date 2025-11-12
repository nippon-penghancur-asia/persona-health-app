import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowLeft, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    const { data: result, error } = await supabase
      .from("health_data")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching result:", error);
    } else {
      setData(result);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Result not found</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prediction = data.prediction_result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Health Assessment Results
          </h1>
          <p className="text-muted-foreground">
            Submitted on {new Date(data.created_at).toLocaleString()}
          </p>
        </div>

        {prediction && (
          <div className="space-y-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-6 w-6" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold text-primary mb-2">
                  {prediction.health_score}
                </div>
                <div className="text-xl font-semibold">
                  Risk Level: <span className={`${
                    prediction.risk_level === 'Low' ? 'text-green-500' :
                    prediction.risk_level === 'Medium' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>{prediction.risk_level}</span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recommendations</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {prediction.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Health Data</CardTitle>
            <CardDescription>Data submitted for this assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-lg font-semibold">{data.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-lg font-semibold">{data.gender === 1 ? 'Male' : 'Female'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-semibold">{data.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold">{data.height} m</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BMI</p>
                <p className="text-lg font-semibold">{data.bmi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workout Frequency</p>
                <p className="text-lg font-semibold">{data.workout_frequency}x/week</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Duration</p>
                <p className="text-lg font-semibold">{data.session_duration} hours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workout Type</p>
                <p className="text-lg font-semibold">{data.workout_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Meals</p>
                <p className="text-lg font-semibold">{data.daily_meals_frequency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diet Type</p>
                <p className="text-lg font-semibold">{data.diet_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-lg font-semibold">{data.calories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Physical Exercise</p>
                <p className="text-lg font-semibold">{data.physical_exercise}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button onClick={() => navigate("/")} className="flex-1">
            New Assessment
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
            View All Results
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Result;