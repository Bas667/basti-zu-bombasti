"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useExercises } from "@/hooks/useData";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { exercises, remove } = useExercises();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-6" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  const toDelete = deleteId
    ? exercises.find((e) => e.id === deleteId)
    : null;

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-headline text-white">Uebungen</h1>
        <Link
          href="/exercises/new"
          className="text-xs font-semibold text-accent uppercase tracking-wider hover:underline"
        >
          + Neu
        </Link>
      </div>

      <div className="space-y-2">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-card rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-sm text-white">{ex.name}</h3>
                <p className="text-xs text-light/30 mt-0.5 line-clamp-1">
                  {ex.description}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {ex.muscleGroups.map((mg) => (
                    <span
                      key={mg}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-light/30"
                    >
                      {mg}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-lg bg-accent/10 text-accent font-semibold shrink-0 ml-3">
                {ex.difficulty === "advanced"
                  ? "Schwer"
                  : ex.difficulty === "intermediate"
                    ? "Mittel"
                    : "Leicht"}
              </span>
            </div>
            <div className="flex gap-3 mt-3">
              <Link
                href={`/exercises/${ex.id}/edit`}
                className="text-[10px] font-semibold text-light/40 uppercase tracking-widest hover:text-light/70 transition-colors"
              >
                Bearbeiten
              </Link>
              <button
                onClick={() => setDeleteId(ex.id)}
                className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest hover:text-red-400 transition-colors"
              >
                Loeschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Uebung loeschen"
          message={`"${toDelete.name}" wirklich loeschen?`}
          onConfirm={() => {
            remove(deleteId!);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </main>
  );
}
