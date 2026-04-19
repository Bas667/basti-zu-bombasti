# Von Basti zu Bombasti — Fitness PWA

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PWA (next-pwa)
- Deployment: Vercel

## Design
- Schriftart: Anton (Headlines), Inter (Body)
- Akzentfarbe: Orange (#FF6B00)
- Editorial/Magazine-Stil, clean und bold
- Keine Emojis in der UI
- Deutsche Sprache durchgehend

## Architektur
- Datengetrieben: Übungen und Pläne als JSON-Dateien unter /data
- Drei Kern-Entitäten: Exercise, Workout, TrainingPlan
- Lokal-first (JSON + localStorage), später optional Cloud

## Übungs-Datenmodell (Exercise)
- id, name, description
- muscleGroups: string[]
- difficulty: "beginner" | "intermediate" | "advanced"
- type: "reps" | "time"
- defaultValue: number (Reps oder Sekunden)
- imageUrl?: string
- variants?: { easier: string, harder: string }

## Workout-Datenmodell
- id, name, description
- exercises: { exerciseId, sets, reps?, duration?, restSeconds }[]
- estimatedMinutes: number
- difficulty: string

## TrainingPlan-Datenmodell
- id, name, description, weeks: number
- schedule: { week, day, workoutId }[]
