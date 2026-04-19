"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWorkouts } from "@/hooks/useData";

const DAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Maer",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

function DifficultyStars({ difficulty }: { difficulty: string }) {
  const level =
    difficulty === "advanced" ? 3 : difficulty === "intermediate" ? 2 : 1;
  return (
    <span className="text-sm leading-none">
      <span className="text-accent">{"★".repeat(level)}</span>
      <span className="text-light/15">{"☆".repeat(3 - level)}</span>
    </span>
  );
}

function DifficultyLabel({ difficulty }: { difficulty: string }) {
  if (difficulty === "advanced") return <>Schwer</>;
  if (difficulty === "intermediate") return <>Mittel</>;
  return <>Leicht</>;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { workouts } = useWorkouts();

  useEffect(() => setMounted(true), []);

  const now = new Date();
  const dateLabel = `${DAYS[now.getDay()]} · ${now.getDate()}. ${MONTHS[now.getMonth()]}`.toUpperCase();

  // Placeholder stats
  const completedWorkouts = 0;

  if (!mounted) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-12 pb-4">
        <p className="text-[11px] text-light/25 tracking-[0.25em] mb-2">
          {dateLabel}
        </p>
        <h1 className="text-8xl font-headline text-white leading-[0.85] mb-10">
          Heute
        </h1>
        <div className="h-[100px] border border-white/8 rounded-2xl animate-pulse mb-5" />
        <div className="h-[280px] bg-card rounded-2xl animate-pulse" />
      </main>
    );
  }

  const nextWorkout = workouts[0];

  return (
    <main className="max-w-lg mx-auto px-5 pt-12 pb-4">
      {/* ---- Date ---- */}
      <p className="text-[11px] text-light/25 tracking-[0.25em] mb-2">
        {dateLabel}
      </p>

      {/* ---- HEUTE ---- */}
      <h1 className="text-8xl font-headline text-white leading-[0.85] mb-10">
        Heute
      </h1>

      {/* ---- Bombasti-Meter ---- */}
      <div className="border border-white/8 rounded-2xl px-5 py-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-light/35 uppercase tracking-[0.18em] font-medium">
            Bombasti-Meter
          </span>
          <span className="text-3xl font-headline text-white leading-none">
            Stufe {String(Math.min(Math.floor(completedWorkouts / 5) + 1, 10)).padStart(2, "0")}
          </span>
        </div>
        <div className="w-full h-[5px] bg-white/5 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-accent rounded-full"
            style={{ width: `${Math.max((completedWorkouts % 5) * 20, 3)}%` }}
          />
        </div>
        <p className="text-[11px] text-light/20">
          {completedWorkouts % 5} / 5 Workouts bis Stufe{" "}
          {String(Math.min(Math.floor(completedWorkouts / 5) + 2, 10)).padStart(2, "0")}
        </p>
      </div>

      {/* ---- Next Workout ---- */}
      {nextWorkout && (
        <div className="bg-card border-l-[4px] border-accent rounded-2xl p-5 mb-5">
          <p className="text-[11px] text-accent font-semibold uppercase tracking-[0.25em] mb-3">
            Naechstes Training
          </p>
          <h2 className="text-5xl font-headline text-white leading-[0.9]">
            {nextWorkout.name}
          </h2>
          <p className="text-[11px] text-light/25 uppercase tracking-[0.12em] mt-1.5 mb-5">
            {nextWorkout.difficulty === "advanced"
              ? "Fortgeschritten"
              : nextWorkout.difficulty === "intermediate"
                ? "Mittel"
                : "Einsteiger"}
          </p>

          {/* Stats */}
          <div className="flex items-end gap-8 mb-5">
            <div>
              <span className="text-3xl font-headline text-white leading-none">
                {nextWorkout.estimatedMinutes}
              </span>
              <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1">
                Min
              </p>
            </div>
            <div>
              <span className="text-3xl font-headline text-white leading-none">
                {String(nextWorkout.exercises.length).padStart(2, "0")}
              </span>
              <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1">
                Uebungen
              </p>
            </div>
            <div>
              <DifficultyStars difficulty={nextWorkout.difficulty} />
              <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1">
                <DifficultyLabel difficulty={nextWorkout.difficulty} />
              </p>
            </div>
          </div>

          <Link
            href={`/workout/${nextWorkout.id}/player`}
            className="block bg-accent text-white font-headline text-lg text-center py-3.5 rounded-xl uppercase tracking-[0.18em] hover:brightness-110 transition-all"
          >
            Jetzt starten
          </Link>
        </div>
      )}

      {/* ---- Stats Boxes ---- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="border border-white/8 rounded-2xl py-4 text-center">
          <span className="text-3xl font-headline text-white leading-none">
            {completedWorkouts}
          </span>
          <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1.5">
            Streak
          </p>
        </div>
        <div className="border border-white/8 rounded-2xl py-4 text-center">
          <span className="text-3xl font-headline text-white leading-none">
            {completedWorkouts}
          </span>
          <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1.5">
            Workouts
          </p>
        </div>
        <div className="border border-white/8 rounded-2xl py-4 text-center">
          <span className="text-3xl font-headline text-white leading-none">
            0
          </span>
          <p className="text-[9px] text-light/20 uppercase tracking-wider mt-1.5">
            Gesamt-XP
          </p>
        </div>
      </div>

      {/* ---- All Workouts ---- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-light/25 uppercase tracking-[0.18em] font-medium">
            Alle Workouts
          </span>
          <Link
            href="/workout/new"
            className="text-[10px] font-semibold text-accent uppercase tracking-widest hover:underline"
          >
            + Neu
          </Link>
        </div>
        <div className="space-y-2">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workout/${workout.id}`}
              className="flex items-center gap-4 bg-card rounded-xl p-4 hover:bg-card/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-sm text-white truncate">
                  {workout.name}
                </h3>
                <p className="text-[11px] text-light/20 mt-0.5">
                  {workout.estimatedMinutes} Min. / {workout.exercises.length}{" "}
                  Ueb.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold shrink-0">
                <DifficultyLabel difficulty={workout.difficulty} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
