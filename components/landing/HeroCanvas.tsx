"use client";

import React, { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseRadius: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Color palette inspired by skill games (Bubbles Cash neon, Blockerino cyan, Helix Jump amber, Flappy Cash purple)
    const colors = [
      { fill: "rgba(0, 245, 155, 0.45)", glow: "#00F59B" },
      { fill: "rgba(0, 240, 255, 0.40)", glow: "#00F0FF" },
      { fill: "rgba(245, 158, 11, 0.35)", glow: "#F59E0B" },
      { fill: "rgba(139, 92, 246, 0.35)", glow: "#8B5CF6" },
    ];

    const bubbleCount = window.innerWidth < 768 ? 16 : 36;
    const bubbles: Bubble[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.random() * 22 + 10;
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius,
        baseRadius: radius,
        color: colorScheme.fill,
        glowColor: colorScheme.glow,
        alpha: Math.random() * 0.4 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw interactive bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Bounce walls
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx *= -1;
        } else if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx *= -1;
        }

        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy *= -1;
        } else if (b.y + b.radius > height) {
          b.y = height - b.radius;
          b.vy *= -1;
        }

        // Mouse repulsion
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          b.x -= Math.cos(angle) * force * 5;
          b.y -= Math.sin(angle) * force * 5;
          b.radius = Math.min(b.baseRadius * 1.35, 40);
        } else {
          b.radius += (b.baseRadius - b.radius) * 0.05;
        }

        // Draw connections between close bubbles
        for (let j = i + 1; j < bubbles.length; j++) {
          const b2 = bubbles[j];
          const distBetween = Math.hypot(b.x - b2.x, b.y - b2.y);
          if (distBetween < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - distBetween / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        }

        // Draw sphere
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 15;
        ctx.fill();

        // Inner shine
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
