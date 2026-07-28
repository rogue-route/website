"use client";

/**
 * MouseScroll 
 *
 * Adds mouse scroll indicator to the page, with a bouncing animation.
 * Clicking it scrolls to the next section (or one viewport down by default).
 *
 * Usage:
 *   import { MouseScroll } from "@/components/primitives/MouseScroll"
 *   <MouseScroll targetId="about-section" />
 */

interface MouseScrollProps {
  /** id of the element to scroll to on click. Falls back to scrolling one viewport height if omitted. */
  targetId?: string;
}

export default function MouseScroll({ targetId }: MouseScrollProps) {
  const handleClick = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll down"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className="flex flex-col items-center justify-center gap-3 opacity-75 hover:opacity-100 transition-opacity duration-300 animate-bounce cursor-pointer"
    >
      {/* The Mouse Outline */}
      <div
        className="border-2 border-white-400 rounded-full flex justify-center pt-2"
        style={{
          width: "clamp(1.5rem, 3vw, 2rem)",   // 24px -> 32px
          height: "clamp(2.25rem, 4.5vw, 3rem)", // 36px -> 48px, keeps 2:3 ratio
        }}
      >
        {/* The Scrolling Wheel (uses the custom class from globals.css) */}
        <div
          className="bg-gray-400 rounded-full animate-scrolling"
          style={{
            width: "clamp(0.2rem, 0.4vw, 0.25rem)",
            height: "clamp(0.6rem, 1.2vw, 0.75rem)",
          }}
        />
      </div>
    </div>
  );
}