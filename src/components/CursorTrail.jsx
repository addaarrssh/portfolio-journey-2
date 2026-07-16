import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const TRAIL_COUNT = 10;

export default function CursorTrail() {
  const containerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Create trail dot elements
    const trailPoints = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const size = Math.max(2, 16 - i * 1.1);
      const opacity = 1 - i * 0.05;

      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: white;
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: difference;
        opacity: ${opacity};
        will-change: transform;
        transition: width 0.25s ease, height 0.25s ease, background 0.25s ease, border 0.25s ease;
      `;
      container.appendChild(el);

      trailPoints.push({
        el,
        x: -100,
        y: -100,
        baseSize: size,
      });
    }

    let globalMouseX = -100;
    let globalMouseY = -100;

    const onMouseMove = (e) => {
      globalMouseX = e.clientX;
      globalMouseY = e.clientY;
    };

    // Hover detection: lead dot expands into a ring on interactive elements
    let isHoveringInteractive = false;

    const onMouseOver = (e) => {
      const target = e.target.closest("button, a, [role='button'], [data-cursor]");
      if (target && !isHoveringInteractive) {
        isHoveringInteractive = true;
        const lead = trailPoints[0];
        lead.el.style.width = "28px";
        lead.el.style.height = "28px";
        lead.el.style.background = "transparent";
        lead.el.style.border = "2px solid white";
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest("button, a, [role='button'], [data-cursor]");
      if (target && isHoveringInteractive) {
        isHoveringInteractive = false;
        const lead = trailPoints[0];
        lead.el.style.width = `${lead.baseSize}px`;
        lead.el.style.height = `${lead.baseSize}px`;
        lead.el.style.background = "white";
        lead.el.style.border = "none";
      }
    };

    // Spring-chain physics in gsap.ticker
    const tick = () => {
      let leaderX = globalMouseX;
      let leaderY = globalMouseY;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        const pt = trailPoints[i];
        const springStiffness = 0.4;
        pt.x += (leaderX - pt.x) * springStiffness;
        pt.y += (leaderY - pt.y) * springStiffness;

        // Offset by half of current element size for centering
        const halfSize = pt.baseSize / 2;
        const offsetX = isHoveringInteractive && i === 0 ? 14 : halfSize;
        const offsetY = isHoveringInteractive && i === 0 ? 14 : halfSize;

        gsap.set(pt.el, { x: pt.x - offsetX, y: pt.y - offsetY });

        leaderX = pt.x;
        leaderY = pt.y;
      }
    };

    window.addEventListener("pointermove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    gsap.ticker.add(tick);

    // Hide default cursor
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      gsap.ticker.remove(tick);
      document.body.classList.remove("custom-cursor-active");

      // Clean up created DOM elements
      trailPoints.forEach((pt) => {
        if (pt.el.parentNode) {
          pt.el.parentNode.removeChild(pt.el);
        }
      });
    };
  }, [reducedMotion]);

  return <div ref={containerRef} aria-hidden="true" />;
}
