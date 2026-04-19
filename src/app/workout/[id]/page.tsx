"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkouts, useExercises } from "@/hooks/useData";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function WorkoutPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { workouts, remove: removeWorkout } = useWorkouts();
  const { getExercise } = useExercises();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <div className="h-5 w-16 bg-white/10 rounded animate-pulse mb-4" />
        <div className="h-10 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-white/10 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-card rounded-xl animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  const workout = workouts.find((w) => w.id === params.id);

  if (!workout) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4 text-center">
        <p className="text-light/40">Workout nicht gefunden.</p>
        <Link href="/" className="text-accent mt-4 inline-block font-headline text-sm uppercase tracking-wider">
          Zurueck
        </Link>
      </main>
    );
  }

  function handleDelete() {
    removeWorkout(params.id);
    router.push("/");
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <Link
        href="/"
        className="text-accent text-xs font-semibold uppercase tracking-widest hover:underline"
      >
        Zurueck
      </Link>

      <header className="mt-3 mb-6">
        <h1 className="text-4xl font-headline text-white leading-tight">
          {workout.name}
        </h1>
        <p className="text-light/40 text-sm mt-2">{workout.description}</p>

        <div className="flex gap-5 mt-4">
          <div>
            <span className="text-2xl font-headline text-white">
              {workout.estimatedMinutes}
            </span>
            <span className="text-xs text-light/30 uppercase ml-1">Min</span>
          </div>
          <div>
            <span className="text-2xl font-headline text-white">
              {String(workout.exercises.length).padStart(2, "0")}
            </span>
            <span className="text-xs text-light/30 uppercase ml-1">
              Uebungen
            </span>
          </div>
          <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-lg bg-accent/10 text-accent font-semibold self-center">
            {workout.difficulty === "advanced"
              ? "Schwer"
              : workout.difficulty === "intermediate"
                ? "Mittel"
                : "Leicht"}
          </span>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            href={`/workout/${workout.id}/edit`}
            className="text-xs font-semibold text-light/40 uppercase tracking-widest hover:text-light/70 transition-colors"
          >
            Bearbeiten
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="text-xs font-semibold text-red-400/60 uppercase tracking-widest hover:text-red-400 transition-colors"
          >
            Loeschen
          </button>
        </div>
      </header>

      <div className="space-y-2 mb-6">
        {workout.exercises.map((we, index) => {
          const exercise = getExercise(we.exerciseId);
          if (!exercise) return null;

          return (
            <div
              key={`${we.exerciseId}-${index}`}
              className="bg-card rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-accent font-headline text-sm mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-sm text-white">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-light/30 mt-0.5">
                    {exercise.description}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-light/50">
                    <span>{we.sets} Saetze</span>
                    {we.reps && <span>{we.reps} Wdh.</span>}
                    {we.duration && <span>{we.duration} Sek.</span>}
                    <span>{we.restSeconds}s Pause</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {exercise.muscleGroups.map((mg) => (
                      <span
                        key={mg}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-light/30"
                      >
                        {mg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href={`/workout/${workout.id}/player`}
        className="block w-full text-center bg-accent text-white font-headline text-lg py-4 rounded-xl hover:bg-accent/90 transition-colors uppercase tracking-wider"
      >
        Workout starten
      </Link>

      {showDelete && (
        <ConfirmDialog
          title="Workout loeschen"
          message={`"${workout.name}" wirklich loeschen?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </main>
  );
}
