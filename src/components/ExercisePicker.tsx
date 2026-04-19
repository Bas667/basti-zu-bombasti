"use client";

import { useState } from "react";
import { Exercise, WorkoutExercise } from "@/types";
import Modal from "./Modal";
import { Input } from "./FormField";

interface ExercisePickerProps {
  exercises: Exercise[];
  onPick: (entry: WorkoutExercise) => void;
  onClose: () => void;
}

export default function ExercisePicker({
  exercises,
  onPick,
  onClose,
}: ExercisePickerProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [duration, setDuration] = useState(30);
  const [rest, setRest] = useState(30);

  const filtered = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscleGroups.some((mg) =>
        mg.toLowerCase().includes(search.toLowerCase())
      )
  );

  function handleConfirm() {
    if (!selected) return;

    const entry: WorkoutExercise = {
      exerciseId: selected.id,
      sets,
      restSeconds: rest,
    };

    if (selected.type === "reps") {
      entry.reps = reps;
    } else {
      entry.duration = duration;
    }

    onPick(entry);
  }

  return (
    <Modal onClose={onClose}>
      {!selected ? (
        <>
          <h2 className="text-xl font-headline text-white mb-4">
            Uebung waehlen
          </h2>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Name oder Muskelgruppe..."
            className="mb-4"
          />
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelected(ex)}
                className="w-full text-left bg-dark rounded-xl p-3 hover:bg-white/5 transition-colors"
              >
                <h3 className="font-headline text-white text-sm">
                  {ex.name}
                </h3>
                <p className="text-xs text-light/40 mt-0.5">
                  {ex.muscleGroups.join(", ")} / {ex.type === "reps" ? `${ex.defaultValue} Wdh.` : `${ex.defaultValue} Sek.`}
                </p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-light/40 text-center py-4">
                Keine Uebungen gefunden.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-headline text-white mb-1">
            {selected.name}
          </h2>
          <p className="text-sm text-light/50 mb-4">{selected.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="text-xs text-light/50 uppercase tracking-wider">
                Saetze
              </span>
              <Input
                type="number"
                min={1}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
              />
            </label>

            {selected.type === "reps" ? (
              <label className="block">
                <span className="text-xs text-light/50 uppercase tracking-wider">
                  Wiederholungen
                </span>
                <Input
                  type="number"
                  min={1}
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                />
              </label>
            ) : (
              <label className="block">
                <span className="text-xs text-light/50 uppercase tracking-wider">
                  Dauer (Sek.)
                </span>
                <Input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </label>
            )}

            <label className="block col-span-2">
              <span className="text-xs text-light/50 uppercase tracking-wider">
                Pause (Sek.)
              </span>
              <Input
                type="number"
                min={0}
                value={rest}
                onChange={(e) => setRest(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-light/60 font-semibold uppercase tracking-wider text-sm hover:border-white/30 transition-colors"
            >
              Zurueck
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-accent text-white font-semibold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors"
            >
              Hinzufuegen
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
