"use client";

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const confettiRef = useRef<any[]>([]);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const NUM_CONFETTI = 350;
    const COLORS = [[85,71,106], [174,61,99], [219,56,83], [244,92,68], [248,182,70]];
    const PI_2 = 2 * Math.PI;

    let w = 0;
    let h = 0;
    let xpos = 0.5;

    const range = (a: number, b: number) => (b - a) * Math.random() + a;

    const drawCircle = (x: number, y: number, r: number, style: string) => {
      context.beginPath();
      context.arc(x, y, r, 0, PI_2, false);
      context.fillStyle = style;
      context.fill();
    };

    const resizeWindow = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    class ConfettiPiece {
      style: number[];
      rgb: string;
      r: number;
      r2: number;
      opacity: number;
      dop: number;
      x: number;
      y: number;
      xmax: number;
      ymax: number;
      vx: number;
      vy: number;

      constructor() {
        this.style = COLORS[Math.floor(range(0, 5))];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
        this.r = Math.floor(range(2, 6));
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(1, 4);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(0, 2) + 8 * xpos - 5;
        this.vy = 0.7 * this.r + range(-1, 1);
      }

      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.dop *= -1;
        }
        if (this.opacity < 0 || this.y > this.ymax) {
          this.replace();
        }
        if (!(0 < this.x && this.x < this.xmax)) {
          this.x = (this.x + this.xmax) % this.xmax;
        }
        drawCircle(Math.floor(this.x), Math.floor(this.y), this.r, `${this.rgb},${this.opacity})`);
      }
    }

    resizeWindow();
    
    // Create confetti pieces
    confettiRef.current = [];
    for (let i = 0; i < NUM_CONFETTI; i++) {
      confettiRef.current.push(new ConfettiPiece());
    }

    const step = () => {
      animationRef.current = requestAnimationFrame(step);
      context.clearRect(0, 0, w, h);
      confettiRef.current.forEach(c => c.draw());
    };

    step();

    // Auto-stop after 3 seconds and hide canvas
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Hide the canvas by removing it from DOM
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
    }, 3000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeout);
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}
