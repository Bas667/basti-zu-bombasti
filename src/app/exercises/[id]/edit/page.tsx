"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExercises } from "@/hooks/useData";
import ExerciseForm from "@/components/ExerciseForm";

export default function EditExercisePage({
  params,
}: {
  params: { id: string };
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { exercises, save } = useExercises();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-6" />
      </main>
    );
  }

  const exercise = exercises.find((e) => e.id === params.id);

  if (!exercise) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-light/60">Uebung nicht gefunden.</p>
        <Link href="/exercises" className="text-accent mt-4 inline-block">
          Zurueck
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <Link
        href="/exercises"
        className="text-accent text-xs font-semibold uppercase tracking-widest hover:underline"
      >
        Zurueck
      </Link>

      <h1 className="text-4xl font-headline text-white mt-4 mb-6">
        Uebung bearbeiten
      </h1>

      <ExerciseForm
        initial={exercise}
        onSave={(updated) => {
          save(updated);
          router.push("/exercises");
        }}
        onCancel={() => router.push("/exercises")}
      />
    </main>
  );
}
