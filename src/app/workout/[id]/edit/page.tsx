"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkouts, useExercises } from "@/hooks/useData";
import WorkoutForm from "@/components/WorkoutForm";

export default function EditWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { workouts, save } = useWorkouts();
  const { exercises, getExercise } = useExercises();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-6" />
      </main>
    );
  }

  const workout = workouts.find((w) => w.id === params.id);

  if (!workout) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-light/60">Workout nicht gefunden.</p>
        <Link href="/" className="text-accent mt-4 inline-block">
          Zurueck
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <Link
        href={`/workout/${workout.id}`}
        className="text-accent text-xs font-semibold uppercase tracking-widest hover:underline"
      >
        Zurueck
      </Link>

      <h1 className="text-4xl font-headline text-white mt-4 mb-6">
        Workout bearbeiten
      </h1>

      <WorkoutForm
        initial={workout}
        exercises={exercises}
        getExercise={getExercise}
        onSave={(updated) => {
          save(updated);
          router.push(`/workout/${updated.id}`);
        }}
        onCancel={() => router.push(`/workout/${workout.id}`)}
      />
    </main>
  );
}
