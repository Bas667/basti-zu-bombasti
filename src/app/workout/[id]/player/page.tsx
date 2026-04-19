"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { WorkoutExercise } from "@/types";
import { getAllWorkouts, getExercise } from "@/lib/data";

type Phase = "exercise" | "rest" | "done";
type Mode = "circuit" | "straight";

interface Step {
  exerciseIndex: number;
  set: number;
}

function buildSequence(exercises: WorkoutExercise[], mode: Mode): Step[] {
  const steps: Step[] = [];
  if (mode === "circuit") {
    const maxSets = Math.max(...exercises.map((e) => e.sets));
    for (let set = 1; set <= maxSets; set++) {
      for (let i = 0; i < exercises.length; i++) {
        if (set <= exercises[i].sets) {
          steps.push({ exerciseIndex: i, set });
        }
      }
    }
  } else {
    for (let i = 0; i < exercises.length; i++) {
      for (let set = 1; set <= exercises[i].sets; set++) {
        steps.push({ exerciseIndex: i, set });
      }
    }
  }
  return steps;
}

/* ---- Circular SVG ring ---- */
function ProgressRing({
  progress,
  size = 190,
  stroke = 4,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  children: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(progress, 100) / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="progress-ring-track" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="progress-ring-fill" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ---- Segments at top (one per exercise) ---- */
function ProgressSegments({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-[4px] flex-1 rounded-full ${
            i < current ? "bg-accent" : i === current ? "bg-accent/50" : "bg-white/6"
          }`}
        />
      ))}
    </div>
  );
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("circuit");
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("exercise");
  const [timer, setTimer] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => setMounted(true), []);

  const workout = mounted ? getAllWorkouts().find((w) => w.id === params.id) : undefined;

  const sequence = useMemo(
    () => (workout ? buildSequence(workout.exercises, mode) : []),
    [workout, mode]
  );

  const currentStep = sequence[stepIndex];
  const we = currentStep ? workout?.exercises[currentStep.exerciseIndex] : undefined;
  const ex = we ? getExercise(we.exerciseId) : undefined;

  const isTime = ex?.type === "time";
  const targetTime = we?.duration ?? ex?.defaultValue ?? 0;
  const targetReps = we?.reps ?? ex?.defaultValue ?? 0;

  /* ---- Navigation helpers ---- */
  const goToRest = useCallback(() => {
    if (!we) return;
    if (stepIndex < sequence.length - 1) {
      setPhase("rest");
      setTimer(we.restSeconds);
      setIsRunning(true);
    } else {
      setPhase("done");
      setIsRunning(false);
    }
  }, [we, stepIndex, sequence.length]);

  const goToNextStep = useCallback(() => {
    if (stepIndex < sequence.length - 1) {
      setStepIndex((i) => i + 1);
      setPhase("exercise");
      setTimer(0);
      setRepCount(0);
      setIsRunning(false);
    } else {
      setPhase("done");
      setIsRunning(false);
    }
  }, [stepIndex, sequence.length]);

  const skipExercise = useCallback(() => {
    if (!currentStep || !workout) return;
    const skipIdx = currentStep.exerciseIndex;
    let next = stepIndex + 1;
    while (next < sequence.length && sequence[next].exerciseIndex === skipIdx) next++;
    if (next < sequence.length) {
      setStepIndex(next);
      setPhase("exercise");
      setTimer(0);
      setRepCount(0);
      setIsRunning(false);
    } else {
      setPhase("done");
      setIsRunning(false);
    }
  }, [currentStep, workout, stepIndex, sequence]);

  /* ---- Timers ---- */
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimer((t) => {
        if (phase === "exercise" && isTime) {
          if (t + 1 >= targetTime) { setIsRunning(false); return targetTime; }
          return t + 1;
        }
        if (phase === "rest") {
          if (t - 1 <= 0) { setIsRunning(false); return 0; }
          return t - 1;
        }
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, phase, isTime, targetTime]);

  useEffect(() => {
    if (phase === "exercise" && isTime && timer >= targetTime && !isRunning) goToRest();
  }, [timer, phase, isTime, targetTime, isRunning, goToRest]);

  useEffect(() => {
    if (phase === "rest" && timer <= 0 && !isRunning) goToNextStep();
  }, [timer, phase, isRunning, goToNextStep]);

  useEffect(() => {
    if (phase === "exercise" && !isTime && repCount >= targetReps) goToRest();
  }, [repCount, phase, isTime, targetReps, goToRest]);

  /* ---- Loading ---- */
  if (!mounted) return <main className="max-w-lg mx-auto px-5 pt-6" />;

  if (!workout) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-10 text-center">
        <p className="text-light/25">Workout nicht gefunden.</p>
        <Link href="/" className="text-accent mt-4 inline-block text-sm">Zurueck</Link>
      </main>
    );
  }

  /* ---- Mode Select ---- */
  if (!started) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-12 pb-4 min-h-screen flex flex-col">
        <Link href={`/workout/${workout.id}`} className="text-accent text-[11px] font-semibold uppercase tracking-[0.25em] hover:underline">
          Zurueck
        </Link>
        <h1 className="text-5xl font-headline text-white mt-4 mb-1">{workout.name}</h1>
        <p className="text-[11px] text-light/25 uppercase tracking-[0.12em] mb-10">
          {workout.exercises.length} Uebungen / {workout.estimatedMinutes} Min.
        </p>
        <p className="text-[11px] text-light/25 uppercase tracking-[0.18em] font-semibold mb-3">Trainingsmodus</p>
        <div className="space-y-2 mb-auto">
          {(["circuit", "straight"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                mode === m ? "border-accent bg-accent/5" : "border-white/5 bg-card hover:border-white/10"
              }`}
            >
              <h3 className="font-headline text-white text-sm">
                {m === "circuit" ? "Circuit" : "Straight Sets"}
              </h3>
              <p className="text-[11px] text-light/25 mt-1">
                {m === "circuit"
                  ? "Alle Uebungen nacheinander, dann naechste Runde."
                  : "Alle Saetze einer Uebung hintereinander."}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-full bg-accent text-white font-headline text-lg py-4 rounded-xl uppercase tracking-[0.18em] hover:brightness-110 transition-all mt-8"
        >
          Jetzt starten
        </button>
      </main>
    );
  }

  /* ---- Done ---- */
  if (phase === "done") {
    return (
      <main className="max-w-lg mx-auto px-5 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-7xl font-headline text-accent mb-4">Geschafft!</h1>
        <p className="text-light/35 text-base mb-10">{workout.name} abgeschlossen.</p>
        <Link href={`/workout/${workout.id}`} className="bg-accent text-white font-headline text-lg py-4 px-10 rounded-xl uppercase tracking-[0.18em]">
          Zurueck
        </Link>
      </main>
    );
  }

  /* ---- Next step preview ---- */
  const totalEx = workout.exercises.length;
  function nextInfo(): { name: string; detail: string } | null {
    if (stepIndex + 1 >= sequence.length) return null;
    const ns = sequence[stepIndex + 1];
    const nwe = workout!.exercises[ns.exerciseIndex];
    const nex = getExercise(nwe.exerciseId);
    return {
      name: nex?.name ?? "?",
      detail: nex?.type === "time" ? `${nwe.duration ?? nex?.defaultValue} Sek.` : `${nwe.reps ?? nex?.defaultValue} Wdh`,
    };
  }
  const ni = nextInfo();

  /* ---- Ring progress ---- */
  let ring = 0;
  if (phase === "exercise") {
    ring = isTime ? (timer / targetTime) * 100 : (repCount / targetReps) * 100;
  } else if (phase === "rest") {
    const total = we?.restSeconds ?? 1;
    ring = ((total - timer) / total) * 100;
  }

  return (
    <main className="max-w-lg mx-auto px-5 pt-5 flex flex-col min-h-screen pb-0">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-light/20 uppercase tracking-[0.18em] truncate mr-4">
          {workout.name}{mode === "circuit" ? ` · Runde ${currentStep.set}` : ""}
        </p>
        <Link
          href={`/workout/${workout.id}`}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/6 text-light/25 hover:text-white transition-colors shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>
      </div>

      {/* ---- Progress segments ---- */}
      <ProgressSegments total={totalEx} current={currentStep.exerciseIndex} />

      {phase === "rest" ? (
        /* ========== REST ========== */
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          <p className="text-[11px] text-light/20 uppercase tracking-[0.25em] mb-8">Pause</p>

          <ProgressRing progress={ring}>
            <span className="text-7xl font-headline text-accent tabular-nums leading-none">{timer}</span>
          </ProgressRing>

          {ni && (
            <div className="bg-card rounded-2xl px-5 py-3.5 mt-10 w-full flex items-center justify-between">
              <div>
                <p className="text-[9px] text-light/15 uppercase tracking-[0.18em]">Als Naechstes</p>
                <p className="text-[15px] text-white mt-0.5" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {ni.name}
                </p>
              </div>
              <span className="text-[12px] text-light/25">{ni.detail}</span>
            </div>
          )}

          <button onClick={goToNextStep} className="mt-5 text-accent text-[11px] font-semibold uppercase tracking-[0.18em] hover:underline">
            Pause ueberspringen
          </button>
        </div>
      ) : (
        /* ========== EXERCISE ========== */
        <div className="flex-1 flex flex-col">
          {/* Exercise info */}
          <div className="mt-2">
            <p className="text-[11px] text-accent font-semibold uppercase tracking-[0.25em]">
              Uebung {String(currentStep.exerciseIndex + 1).padStart(2, "0")} / {String(totalEx).padStart(2, "0")}
            </p>
            <h1 className="text-6xl font-headline text-white leading-[0.9] mt-1">
              {ex?.name}
            </h1>
            {/* Description — NOT uppercase, normal Inter text */}
            {ex?.description && (
              <p className="text-[13px] text-light/25 mt-2" style={{ textTransform: "none", fontFamily: "Inter, sans-serif", letterSpacing: "0" }}>
                {ex.description}
              </p>
            )}
          </div>

          {/* Ring counter */}
          <div className="flex-1 flex items-center justify-center">
            <ProgressRing progress={ring}>
              <span className="text-7xl font-headline text-white tabular-nums leading-none">
                {isTime ? (isRunning ? targetTime - timer : targetTime) : repCount}
              </span>
              <span className="text-[11px] text-light/20 uppercase tracking-wider mt-1.5">
                von {isTime ? targetTime : targetReps} {isTime ? "Sek." : "Wdh"}
              </span>
            </ProgressRing>
          </div>

          {/* Next preview */}
          {ni && (
            <div className="bg-card rounded-2xl px-5 py-3.5 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-light/15 uppercase tracking-[0.18em]">Als Naechstes</p>
                <p className="text-[15px] text-white mt-0.5" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {ni.name}
                </p>
              </div>
              <span className="text-[12px] text-light/25">{ni.detail}</span>
            </div>
          )}

          {/* ---- Bottom controls (3-button bar) ---- */}
          <div className="flex items-center gap-3 pb-8">
            {/* Left: Pause */}
            <button
              onClick={() => {
                if (isTime) {
                  if (isRunning) setIsRunning(false);
                  else if (timer > 0 && timer < targetTime) setIsRunning(true);
                }
              }}
              className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/6 text-light/25 hover:text-white transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </button>

            {/* Center: Main action */}
            {isTime ? (
              <button
                onClick={() => {
                  if (isRunning) setIsRunning(false);
                  else { if (timer >= targetTime) setTimer(0); setIsRunning(true); }
                }}
                className="flex-1 h-[52px] bg-accent text-white font-headline text-base rounded-full uppercase tracking-[0.18em] hover:brightness-110 transition-all"
              >
                {isRunning ? "Pause" : timer > 0 && timer < targetTime ? "Weiter" : "Start"}
              </button>
            ) : (
              <button
                onClick={() => setRepCount((c) => c + 1)}
                className="flex-1 h-[52px] bg-accent text-white font-headline text-base rounded-full uppercase tracking-[0.18em] hover:brightness-110 transition-all"
              >
                Wdh +1
              </button>
            )}

            {/* Right: Skip */}
            <button
              onClick={skipExercise}
              className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/6 text-light/25 hover:text-white transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20" />
                <rect x="17" y="5" width="3" height="14" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
