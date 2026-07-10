"use client";
/**
 * QuizCard — Task 4.3
 *
 * Floating card that shows one question at a time. Wraps QuizOption list.
 * Handles selection logic for both single-select and multi-select questions.
 *
 * Enter/exit animation: Framer Motion AnimatePresence with a slide+fade
 * transition keyed by questionId — when the question changes, the old card
 * exits left and the new card enters from the right. This is one of the five
 * permitted animation slots in PROJECT.md § 5.
 *
 * Selection → confirm → advance flow:
 *   Single-select: selecting an option immediately starts the 400ms confirm
 *   delay, then calls onConfirm. No separate "Next" button needed.
 *   Multi-select: user checks options, then taps "Continue". onConfirm is
 *   called immediately on button press (no extra delay needed for multi).
 *
 * Why compound (not section)?
 *   QuizCard owns local selection state only. It receives the question via
 *   props and calls onConfirm with the result — it doesn't read from context
 *   or call any API. This is exactly the "compound" tier in PROJECT.md § 4.
 */

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { QuizOption } from "./QuizOption";
import type { Question } from "@/lib/quiz/types";

interface QuizCardProps {
  question: Question;
  /** Called when selection is confirmed; passes the selected option IDs. */
  onConfirm: (selectedIds: string[]) => void;
}

/** Card enter/exit variants — slide + fade from right on enter, left on exit */
const cardVariants = {
  enter: {
    opacity: 0,
    x: 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    x: -32,
    transition: {
      duration: 0.18,
      ease: [0.55, 0, 0.78, 0] as [number, number, number, number],
    },
  },
};

export function QuizCard({ question, onConfirm }: QuizCardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset local state whenever the question changes
  useEffect(() => {
    setSelectedIds([]);
    setConfirming(false);
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
  }, [question.id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  function handleSelect(optionId: string) {
    if (confirming) return;

    if (question.type === "single") {
      setSelectedIds([optionId]);
      // 400ms confirm delay then auto-advance (TASK.md 4.5 spec)
      setConfirming(true);
      confirmTimerRef.current = setTimeout(() => {
        onConfirm([optionId]);
      }, 400);
    } else {
      // Multi-select: toggle selection, respecting none-option override
      const clickedOption = question.options.find((o) => o.id === optionId);

      if (clickedOption?.isNoneOption) {
        // Selecting "none" clears all others and selects only itself
        setSelectedIds((prev) =>
          prev.includes(optionId) ? [] : [optionId]
        );
      } else {
        // Selecting a real option deselects any none-option
        const noneIds = question.options
          .filter((o) => o.isNoneOption)
          .map((o) => o.id);

        setSelectedIds((prev) => {
          const withoutNone = prev.filter((id) => !noneIds.includes(id));
          return withoutNone.includes(optionId)
            ? withoutNone.filter((id) => id !== optionId)
            : [...withoutNone, optionId];
        });
      }
    }
  }

  function handleMultiConfirm() {
    if (selectedIds.length === 0) return;
    onConfirm(selectedIds);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={cardVariants}
        initial="enter"
        animate="visible"
        exit="exit"
        className="w-full max-w-[560px]"
      >
        {/* Card surface — True White, Fog border, no shadow (restraint) */}
        <div className="rounded-xl border border-fog bg-true-white p-6 md:p-8">

          {/* Question number — DM Mono, data aesthetic */}
          <p
            className="mb-3 text-xs text-ash"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontWeight: 400,
              letterSpacing: "0.06em",
            }}
            aria-hidden="true"
          >
            {question.number}
          </p>

          {/* Question text — Cormorant Garamond at card-title scale */}
          <h2
            className="mb-6 text-carbon"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            {question.text}
          </h2>

          {/* Options list */}
          <div
            className="flex flex-col gap-3"
            role={question.type === "multi" ? "group" : undefined}
            aria-label={question.type === "multi" ? "Select all that apply" : undefined}
          >
            {question.options.map((option) => (
              <QuizOption
                key={option.id}
                id={option.id}
                label={option.label}
                selected={selectedIds.includes(option.id)}
                onSelect={handleSelect}
                disabled={confirming}
              />
            ))}
          </div>

          {/* Multi-select confirm button */}
          {question.type === "multi" && (
            <div className="mt-6">
              <Button
                onClick={handleMultiConfirm}
                disabled={selectedIds.length === 0}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
