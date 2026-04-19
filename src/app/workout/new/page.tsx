"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkouts, useExercises } from "@/hooks/useData";
import WorkoutForm from "@/components/WorkoutForm";

export default function NewWorkoutPage() {
  const router = useRouter();
  const { save } = useWorkouts();
  const { exercises, getExercise } = useExercises();

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <Link
        href="/"
        className="text-accent text-xs font-semibold uppercase tracking-widest hover:underline"
      >
        Zurueck
      </Link>

      <h1 className="text-4xl font-headline text-white mt-4 mb-6">
        Neues Workout
      </h1>

      <WorkoutForm
        exercises={exercises}
        getExercise={getExercise}
        onSave={(workout) => {
          save(workout);
          router.push(`/workout/${workout.id}`);
        }}
        onCancel={() => router.push("/")}
      />
    </main>
  );
}
