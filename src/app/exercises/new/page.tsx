"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExercises } from "@/hooks/useData";
import ExerciseForm from "@/components/ExerciseForm";

export default function NewExercisePage() {
  const router = useRouter();
  const { save } = useExercises();

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <Link
        href="/exercises"
        className="text-accent text-xs font-semibold uppercase tracking-widest hover:underline"
      >
        Zurueck
      </Link>

      <h1 className="text-4xl font-headline text-white mt-4 mb-6">
        Neue Uebung
      </h1>

      <ExerciseForm
        onSave={(exercise) => {
          save(exercise);
          router.push("/exercises");
        }}
        onCancel={() => router.push("/exercises")}
      />
    </main>
  );
}
