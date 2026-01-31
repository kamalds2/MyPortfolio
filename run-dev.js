// Simple Node.js script to run Vite development server
// This bypasses npm scripts and PowerShell execution policy issues

const { spawn } = require('child_process');
const path = require('path');

// Get the Vite executable path
const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite.cmd');

// Start Vite development server
const viteProcess = spawn(vitePath, [], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

viteProcess.on('error', (error) => {
  console.error('Error starting Vite:', error);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

console.log('🚀 Starting React development server...');
console.log('💡 If this fails, you may need to update Node.js to version 20.19+ or 22.12+');