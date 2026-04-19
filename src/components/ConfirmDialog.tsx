"use client";

import Modal from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal onClose={onCancel}>
      <h2 className="text-xl font-headline text-white mb-2">{title}</h2>
      <p className="text-light/40 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-white/5 text-light/40 font-semibold uppercase tracking-wider text-sm hover:border-white/20 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl bg-red-500/15 text-red-400 font-semibold uppercase tracking-wider text-sm hover:bg-red-500/25 transition-colors"
        >
          Loeschen
        </button>
      </div>
    </Modal>
  );
}
