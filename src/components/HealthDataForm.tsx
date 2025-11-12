import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Activity, Heart, Scale, Utensils } from "lucide-react";

const formSchema = z.object({
  age: z.coerce.number().int().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  gender: z.enum(["0", "1"], { required_error: "Please select a gender" }),
  weight: z.coerce.number().min(20, "Weight must be at least 20 kg").max(300, "Weight must be less than 300 kg"),
  height: z.coerce.number().min(0.5, "Height must be at least 0.5 m").max(2.5, "Height must be less than 2.5 m"),
  bmi: z.coerce.number().min(10, "BMI seems too low").max(60, "BMI seems too high"),
  workout_frequency: z.coerce.number().int().min(0, "Minimum 0 days").max(7, "Maximum 7 days"),
  session_duration: z.coerce.number().min(0, "Duration cannot be negative").max(24, "Duration cannot exceed 24 hours"),
  workout_type: z.string().min(1, "Please select a workout type"),
  daily_meals_frequency: z.coerce.number().int().min(1, "At least 1 meal per day").max(10, "Maximum 10 meals per day"),
  diet_type: z.string().min(1, "Please select a diet type"),
  calories: z.coerce.number().min(500, "Calories must be at least 500").max(10000, "Calories must be less than 10000"),
  physical_exercise: z.string().min(1, "Please select a physical exercise level"),
});

type FormValues = z.infer<typeof formSchema>;

export default function HealthDataForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      weight: undefined,
      height: undefined,
      bmi: undefined,
      workout_frequency: undefined,
      session_duration: undefined,
      workout_type: "",
      daily_meals_frequency: undefined,
      diet_type: "",
      calories: undefined,
      physical_exercise: "",
    },
  });

  const weight = form.watch("weight");
  const height = form.watch("height");

  useEffect(() => {
    if (weight && height && height > 0) {
      const calculatedBMI = weight / (height * height);
      form.setValue("bmi", parseFloat(calculatedBMI.toFixed(2)), { shouldValidate: true });
    }
  }, [weight, height, form]);

  function onSubmit(values: FormValues) {
    // Save to localStorage in efficient format
    const savedData = JSON.parse(localStorage.getItem("healthData") || "[]");
    savedData.push({
      ...values,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("healthData", JSON.stringify(savedData));
    
    console.log(values);
    toast({
      title: "Data Submitted Successfully!",
      description: "Your health data has been saved.",
    });
    
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Health & Fitness Tracker
          </h1>
          <p className="text-muted-foreground">Track your health metrics and fitness journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Card */}
            <Card className="border-primary/20 shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic demographic and body measurements</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Perempuan (Female)</SelectItem>
                          <SelectItem value="1">Laki-laki (Male)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 70.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (m)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 1.75" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Auto-calculated" {...field} readOnly className="bg-secondary/50" />
                      </FormControl>
                      <FormDescription>Automatically calculated from weight and height</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Workout Information Card */}
            <Card className="border-primary/20 shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Workout Information
                </CardTitle>
                <CardDescription>Your exercise routine and activity levels</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="workout_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Frequency (days/week)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="7" placeholder="e.g., 4" {...field} />
                      </FormControl>
                      <FormDescription>0-7 days per week</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="session_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Duration (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 1.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workout_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="physical_exercise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Exercise Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exercise level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light Activity</SelectItem>
                          <SelectItem value="moderate">Moderate Activity</SelectItem>
                          <SelectItem value="active">Very Active</SelectItem>
                          <SelectItem value="athlete">Athlete</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Nutrition Information Card */}
            <Card className="border-primary/20 shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-accent" />
                  Nutrition Information
                </CardTitle>
                <CardDescription>Your diet and meal patterns</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="daily_meals_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Meals Frequency</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="e.g., 3" {...field} />
                      </FormControl>
                      <FormDescription>Number of meals per day</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diet_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select diet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="low_carb">Low Carb</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="paleo">Paleo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Calories</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 2000" {...field} />
                      </FormControl>
                      <FormDescription>Average daily caloric intake</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg h-12"
            >
              <Scale className="mr-2 h-5 w-5" />
              Submit Health Data
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
