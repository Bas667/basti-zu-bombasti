"use client";

import { useState } from "react";
import { Workout, WorkoutExercise, Exercise } from "@/types";
import { generateId } from "@/lib/id";
import FormField, { Input, Textarea, Select } from "./FormField";
import ExercisePicker from "./ExercisePicker";

interface WorkoutFormProps {
  initial?: Workout;
  exercises: Exercise[];
  getExercise: (id: string) => Exercise | undefined;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

export default function WorkoutForm({
  initial,
  exercises,
  getExercise,
  onSave,
  onCancel,
}: WorkoutFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState(
    initial?.difficulty ?? "beginner"
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initial?.estimatedMinutes ?? 30
  );
  const [entries, setEntries] = useState<WorkoutExercise[]>(
    initial?.exercises ?? []
  );
  const [showPicker, setShowPicker] = useState(false);

  function addEntry(entry: WorkoutExercise) {
    setEntries((prev) => [...prev, entry]);
    setShowPicker(false);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function moveEntry(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= entries.length) return;
    setEntries((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || entries.length === 0) return;

    const workout: Workout = {
      id: initial?.id ?? generateId("wo"),
      name: name.trim(),
      description: description.trim(),
      exercises: entries,
      estimatedMinutes,
      difficulty,
      isCustom: true,
      createdAt: initial?.createdAt,
    };

    onSave(workout);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormField label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Oberkoeperr Push"
            required
          />
        </FormField>

        <FormField label="Beschreibung">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Kurze Beschreibung des Workouts"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Schwierigkeit">
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="beginner">Anfaenger</option>
              <option value="intermediate">Mittel</option>
              <option value="advanced">Fortgeschritten</option>
            </Select>
          </FormField>

          <FormField label="Geschaetzte Dauer (Min.)">
            <Input
              type="number"
              min={1}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            />
          </FormField>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-light/70 uppercase tracking-wider">
              Uebungen ({entries.length})
            </span>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="text-sm font-semibold text-accent uppercase tracking-wider hover:underline"
            >
              + Hinzufuegen
            </button>
          </div>

          {entries.length === 0 && (
            <p className="text-light/20 text-sm py-4 text-center border border-dashed border-white/6 rounded-xl">
              Noch keine Uebungen hinzugefuegt.
            </p>
          )}

          <div className="space-y-2">
            {entries.map((entry, index) => {
              const ex = getExercise(entry.exerciseId);
              return (
                <div
                  key={`${entry.exerciseId}-${index}`}
                  className="bg-dark rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveEntry(index, -1)}
                      disabled={index === 0}
                      className="text-light/30 hover:text-white disabled:opacity-20 text-xs leading-none"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveEntry(index, 1)}
                      disabled={index === entries.length - 1}
                      className="text-light/30 hover:text-white disabled:opacity-20 text-xs leading-none"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline text-white text-sm truncate">
                      {ex?.name ?? entry.exerciseId}
                    </p>
                    <p className="text-xs text-light/40">
                      {entry.sets} Saetze
                      {entry.reps ? ` / ${entry.reps} Wdh.` : ""}
                      {entry.duration ? ` / ${entry.duration} Sek.` : ""}
                      {" / "}
                      {entry.restSeconds}s Pause
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="text-red-400/60 hover:text-red-400 text-sm font-bold px-2"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-white/10 text-light/60 font-semibold uppercase tracking-wider text-sm hover:border-white/30 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-accent text-white font-semibold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors"
          >
            Speichern
          </button>
        </div>
      </form>

      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          onPick={addEntry}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
