// Tech Environment Animation System

export class TechEnvironment {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.techIcons = ['⚙️', '🤖', '💻', '🔧', '⚡', '🚀', '📱', '🔬', '💡', '🎯', '📊', '🔮'];
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 30 + 20,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        icon: this.techIcons[Math.floor(Math.random() * this.techIcons.length)],
        opacity: Math.random() * 0.5 + 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  updateMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Mouse interaction - particles move away from cursor
      const dx = particle.x - this.mouseX;
      const dy = particle.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        particle.x += dx * force * 0.05;
        particle.y += dy * force * 0.05;
      }

      // Normal movement
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.font = `${particle.size}px Arial`;
      this.ctx.fillText(particle.icon, particle.x, particle.y);
      this.ctx.restore();

      // Connection lines
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx.save();
          this.ctx.globalAlpha = (1 - distance / 150) * 0.2;
          this.ctx.strokeStyle = '#3b82f6';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

export class DoorTransition {
  static createDoor(container, direction = 'left') {
    const door = document.createElement('div');
    door.className = `tech-door tech-door--${direction}`;
    door.style.cssText = `
      position: fixed;
      top: 0;
      ${direction}: 0;
      width: 50vw;
      height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
      transform: translateX(${direction === 'left' ? '-100%' : '100%'});
      transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 9999;
      border: 2px solid #3b82f6;
      box-shadow: 0 0 50px rgba(59, 130, 246, 0.5);
    `;
    
    // Add tech pattern overlay
    const pattern = document.createElement('div');
    pattern.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    `;
    door.appendChild(pattern);
    
    container.appendChild(door);
    return door;
  }

  static open(callback) {
    const leftDoor = DoorTransition.createDoor(document.body, 'left');
    const rightDoor = DoorTransition.createDoor(document.body, 'right');

    setTimeout(() => {
      leftDoor.style.transform = 'translateX(0)';
      rightDoor.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
      if (callback) callback();
      setTimeout(() => {
        leftDoor.style.transform = 'translateX(-100%)';
        rightDoor.style.transform = 'translateX(100%)';
        setTimeout(() => {
          leftDoor.remove();
          rightDoor.remove();
        }, 800);
      }, 500);
    }, 800);
  }
}

export const createMouseTrail = () => {
  let trail = [];
  const maxTrailLength = 20;

  return {
    update(x, y) {
      trail.push({ x, y, opacity: 1 });
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
      
      trail = trail.map((point, index) => ({
        ...point,
        opacity: index / maxTrailLength
      }));
    },
    
    draw(ctx) {
      trail.forEach((point, index) => {
        if (index > 0) {
          ctx.save();
          ctx.globalAlpha = point.opacity * 0.3;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(trail[index - 1].x, trail[index - 1].y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    }
  };
};
