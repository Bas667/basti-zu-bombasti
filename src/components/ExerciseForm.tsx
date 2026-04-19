"use client";

import { useState } from "react";
import { Exercise } from "@/types";
import { generateId } from "@/lib/id";
import FormField, { Input, Textarea, Select } from "./FormField";

interface ExerciseFormProps {
  initial?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const MUSCLE_OPTIONS = [
  "Brust",
  "Schultern",
  "Trizeps",
  "Bizeps",
  "Core",
  "Oberschenkel",
  "Gesaess",
  "Waden",
  "Unterer Ruecken",
  "Ganzkoeperr",
];

export default function ExerciseForm({
  initial,
  onSave,
  onCancel,
}: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [muscleGroups, setMuscleGroups] = useState<string[]>(
    initial?.muscleGroups ?? []
  );
  const [difficulty, setDifficulty] = useState<Exercise["difficulty"]>(
    initial?.difficulty ?? "beginner"
  );
  const [type, setType] = useState<Exercise["type"]>(initial?.type ?? "reps");
  const [defaultValue, setDefaultValue] = useState(
    initial?.defaultValue ?? 10
  );
  const [easier, setEasier] = useState(initial?.variants?.easier ?? "");
  const [harder, setHarder] = useState(initial?.variants?.harder ?? "");

  function toggleMuscle(m: string) {
    setMuscleGroups((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || muscleGroups.length === 0) return;

    const exercise: Exercise = {
      id: initial?.id ?? generateId("ex"),
      name: name.trim(),
      description: description.trim(),
      muscleGroups,
      difficulty,
      type,
      defaultValue,
      isCustom: true,
      createdAt: initial?.createdAt,
    };

    if (easier.trim() || harder.trim()) {
      exercise.variants = {
        easier: easier.trim(),
        harder: harder.trim(),
      };
    }

    onSave(exercise);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Klimmzuege"
          required
        />
      </FormField>

      <FormField label="Beschreibung">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Kurze Beschreibung der Uebung"
        />
      </FormField>

      <FormField label="Muskelgruppen">
        <div className="flex flex-wrap gap-2">
          {MUSCLE_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMuscle(m)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                muscleGroups.includes(m)
                  ? "bg-accent/20 border-accent text-accent"
                  : "border-white/10 text-light/50 hover:border-white/30"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Schwierigkeit">
          <Select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Exercise["difficulty"])
            }
          >
            <option value="beginner">Anfaenger</option>
            <option value="intermediate">Mittel</option>
            <option value="advanced">Fortgeschritten</option>
          </Select>
        </FormField>

        <FormField label="Typ">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as Exercise["type"])}
          >
            <option value="reps">Wiederholungen</option>
            <option value="time">Zeit (Sek.)</option>
          </Select>
        </FormField>
      </div>

      <FormField label={type === "reps" ? "Standard-Wiederholungen" : "Standard-Sekunden"}>
        <Input
          type="number"
          min={1}
          value={defaultValue}
          onChange={(e) => setDefaultValue(Number(e.target.value))}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Leichtere Variante">
          <Input
            value={easier}
            onChange={(e) => setEasier(e.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Schwerere Variante">
          <Input
            value={harder}
            onChange={(e) => setHarder(e.target.value)}
            placeholder="Optional"
          />
        </FormField>
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
  );
}
