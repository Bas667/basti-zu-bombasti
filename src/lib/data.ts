import { Exercise, Workout } from "@/types";
import seedExercises from "../../data/exercises.json";
import seedWorkouts from "../../data/workouts.json";

const EXERCISES_KEY = "bombasti-exercises";
const WORKOUTS_KEY = "bombasti-workouts";

function getStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Exercises ---

export function getAllExercises(): Exercise[] {
  const custom = getStorage<Exercise>(EXERCISES_KEY);
  const customIds = new Set(custom.map((e) => e.id));
  const seed = (seedExercises as Exercise[]).filter((e) => !customIds.has(e.id));
  return [...seed, ...custom];
}

export function getExercise(id: string): Exercise | undefined {
  return getAllExercises().find((e) => e.id === id);
}

export function saveExercise(exercise: Exercise) {
  const custom = getStorage<Exercise>(EXERCISES_KEY);
  const index = custom.findIndex((e) => e.id === exercise.id);
  const now = new Date().toISOString();
  const updated = { ...exercise, isCustom: true, updatedAt: now };
  if (!updated.createdAt) updated.createdAt = now;

  if (index >= 0) {
    custom[index] = updated;
  } else {
    custom.push(updated);
  }
  setStorage(EXERCISES_KEY, custom);
}

export function deleteExercise(id: string) {
  const custom = getStorage<Exercise>(EXERCISES_KEY);
  setStorage(
    EXERCISES_KEY,
    custom.filter((e) => e.id !== id)
  );
}

// --- Workouts ---

export function getAllWorkouts(): Workout[] {
  const custom = getStorage<Workout>(WORKOUTS_KEY);
  const customIds = new Set(custom.map((w) => w.id));
  const seed = (seedWorkouts as Workout[]).filter((w) => !customIds.has(w.id));
  return [...seed, ...custom];
}

export function getWorkout(id: string): Workout | undefined {
  return getAllWorkouts().find((w) => w.id === id);
}

export function saveWorkout(workout: Workout) {
  const custom = getStorage<Workout>(WORKOUTS_KEY);
  const index = custom.findIndex((w) => w.id === workout.id);
  const now = new Date().toISOString();
  const updated = { ...workout, isCustom: true, updatedAt: now };
  if (!updated.createdAt) updated.createdAt = now;

  if (index >= 0) {
    custom[index] = updated;
  } else {
    custom.push(updated);
  }
  setStorage(WORKOUTS_KEY, custom);
}

export function deleteWorkout(id: string) {
  const custom = getStorage<Workout>(WORKOUTS_KEY);
  setStorage(
    WORKOUTS_KEY,
    custom.filter((w) => w.id !== id)
  );
}
