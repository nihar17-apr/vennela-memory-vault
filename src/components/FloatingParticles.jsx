import { useEffect, useRef } from 'react';

export default function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Draw a heart path on canvas
    const drawHeart = (ctx, x, y, size, color, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Draw a sparkle/star on canvas
    const drawSparkle = (ctx, x, y, size, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#fff9e6';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff5cc';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    class Particle {
      constructor() {
        this.reset();
        // Stagger spawn heights on initialization
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 12 + 6;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
        this.type = Math.random() > 0.45 ? 'heart' : 'sparkle';
        // Gentle pink/pastel colors
        const pinks = [
          '#ffccd5',
          '#ffb3c1',
          '#ff85a1',
          '#f7aef8',
          '#b388ff',
          '#e8dbfc'
        ];
        this.color = pinks[Math.floor(Math.random() * pinks.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.2;
        this.angle += this.spin;

        // Fade out as it nears the top
        if (this.y < canvas.height * 0.2) {
          this.opacity -= this.fadeSpeed * 2;
        }

        if (this.y < -20 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        if (this.type === 'heart') {
          drawHeart(ctx, this.x, this.y, this.size, this.color, this.opacity);
        } else {
          drawSparkle(ctx, this.x, this.y, this.size / 3, this.opacity);
        }
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
