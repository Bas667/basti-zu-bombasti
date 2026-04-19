import { useState, useCallback } from "react";
import { Exercise, Workout } from "@/types";
import * as data from "@/lib/data";

export function useExercises() {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const exercises = data.getAllExercises();

  const save = useCallback(
    (exercise: Exercise) => {
      data.saveExercise(exercise);
      bump();
    },
    [bump]
  );

  const remove = useCallback(
    (id: string) => {
      data.deleteExercise(id);
      bump();
    },
    [bump]
  );

  // version is used to trigger re-renders
  void version;

  return { exercises, save, remove, getExercise: data.getExercise };
}

export function useWorkouts() {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const workouts = data.getAllWorkouts();

  const save = useCallback(
    (workout: Workout) => {
      data.saveWorkout(workout);
      bump();
    },
    [bump]
  );

  const remove = useCallback(
    (id: string) => {
      data.deleteWorkout(id);
      bump();
    },
    [bump]
  );

  void version;

  return { workouts, save, remove, getWorkout: data.getWorkout };
}
