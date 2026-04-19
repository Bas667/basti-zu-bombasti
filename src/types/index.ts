export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "reps" | "time";
  defaultValue: number;
  imageUrl?: string;
  variants?: {
    easier: string;
    harder: string;
  };
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedMinutes: number;
  difficulty: string;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  weeks: number;
  schedule: {
    week: number;
    day: number;
    workoutId: string;
  }[];
}
