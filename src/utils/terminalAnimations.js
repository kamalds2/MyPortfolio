// Terminal-inspired animations and effects
export const useTerminalAnimations = () => {
  const typeWriter = (element, text, speed = 50, callback) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    };
    
    type();
  };

  const addCursor = (element) => {
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.innerHTML = '_';
    element.appendChild(cursor);
    
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
  };

  const simulateLoading = (element, duration = 2000) => {
    const loadingChars = ['|', '/', '—', '\\'];
    let index = 0;
    
    const interval = setInterval(() => {
      element.innerHTML = `Loading ${loadingChars[index % loadingChars.length]}`;
      index++;
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      element.innerHTML = 'Complete ✓';
      element.style.color = '#00ff41';
    }, duration);
  };

  return { typeWriter, addCursor, simulateLoading };
};

export const createMatrixEffect = (container) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  canvas.style.opacity = '0.1';
  
  container.appendChild(canvas);
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/';
  const charArray = chars.split('');
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    drops.forEach((drop, i) => {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * fontSize, drop * fontSize);
      
      if (drop * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  };
  
  const animate = () => {
    draw();
    requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => {
    container.removeChild(canvas);
  };
};

export const addTerminalCommands = () => {
  // Simulate terminal command execution
  const commands = [
    { command: 'whoami', output: 'Full Stack Developer' },
    { command: 'ls skills/', output: 'React.js  Node.js  Python  Java  PostgreSQL' },
    { command: 'git status', output: 'On branch main\nYour branch is up to date' },
    { command: 'npm run portfolio', output: '✓ Portfolio compiled successfully' }
  ];
  
  return commands;
};

export const initializeTerminalEffects = () => {
  // Add glitch effect to titles
  const glitchElements = document.querySelectorAll('.terminal-glitch');
  
  glitchElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.animation = 'glitch 0.3s ease-in-out';
      setTimeout(() => {
        element.style.animation = '';
      }, 300);
    });
  });
  
  // Add typing sound effect (visual representation)
  document.addEventListener('keydown', (e) => {
    const keyPress = document.createElement('div');
    keyPress.style.position = 'fixed';
    keyPress.style.top = '10px';
    keyPress.style.right = '10px';
    keyPress.style.color = '#00ff41';
    keyPress.style.fontSize = '12px';
    keyPress.style.fontFamily = 'monospace';
    keyPress.style.zIndex = '9999';
    keyPress.innerHTML = `> ${e.key}`;
    keyPress.style.opacity = '0.7';
    
    document.body.appendChild(keyPress);
    
    setTimeout(() => {
      keyPress.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(keyPress);
      }, 200);
    }, 100);
  });
};

export const addScanlineEffect = () => {
  const scanline = document.createElement('div');
  scanline.className = 'scanline';
  scanline.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff41, transparent);
    z-index: 9999;
    pointer-events: none;
    animation: scanline 4s linear infinite;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scanline {
      0% { transform: translateY(-100vh); }
      100% { transform: translateY(100vh); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(scanline);
  
  return () => {
    document.body.removeChild(scanline);
    document.head.removeChild(style);
  };
};