import { useEffect, useRef } from 'react';

function DyeWhorl() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const draw = () => {
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.45,
        width * 0.8
      );
      gradient.addColorStop(0, 'rgba(83, 110, 255, 0.15)');
      gradient.addColorStop(0.45, 'rgba(168, 85, 247, 0.1)');
      gradient.addColorStop(1, 'rgba(14, 17, 27, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 14; i += 1) {
        const x = width * (0.12 + i * 0.06) + Math.sin(i + performance.now() * 0.0004) * 30;
        const y = height * (0.35 + (i % 5) * 0.12) + Math.cos(i * 1.7 + performance.now() * 0.0005) * 45;
        const radius = 140 + i * 22;

        const orb = context.createRadialGradient(x, y, 8, x, y, radius);
        orb.addColorStop(0, 'rgba(122, 92, 255, 0.28)');
        orb.addColorStop(0.5, 'rgba(28, 150, 255, 0.16)');
        orb.addColorStop(1, 'rgba(15, 23, 42, 0)');

        context.fillStyle = orb;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    draw();
    let animationFrame = null;

    const handleResize = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(draw);
    };

    const tick = () => {
      draw();
      animationFrame = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas className="dye-whorl" ref={canvasRef} aria-hidden="true" />;
}

export default DyeWhorl;
