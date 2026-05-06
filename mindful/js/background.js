export function startBackground() {
  const canvas = document.querySelector("#ambient-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const orbs = Array.from({ length: 7 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    radius: 180 + index * 36,
    speedX: (Math.random() - 0.5) * 0.00016,
    speedY: (Math.random() - 0.5) * 0.00012,
    alpha: 0.08 + Math.random() * 0.08
  }));

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);

    const base = context.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, "#080B12");
    base.addColorStop(0.62, "#0D1117");
    base.addColorStop(1, "#080B12");
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    for (const orb of orbs) {
      orb.x += orb.speedX;
      orb.y += orb.speedY;
      if (orb.x < -0.2) orb.x = 1.2;
      if (orb.x > 1.2) orb.x = -0.2;
      if (orb.y < -0.2) orb.y = 1.2;
      if (orb.y > 1.2) orb.y = -0.2;

      const gradient = context.createRadialGradient(
        orb.x * width,
        orb.y * height,
        0,
        orb.x * width,
        orb.y * height,
        orb.radius
      );
      gradient.addColorStop(0, `rgba(0,212,255,${orb.alpha})`);
      gradient.addColorStop(0.48, "rgba(0,212,255,0.035)");
      gradient.addColorStop(1, "rgba(0,212,255,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(orb.x * width, orb.y * height, orb.radius, 0, Math.PI * 2);
      context.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}
