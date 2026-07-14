const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('🚀 [Dev Runner] Starting Vite dev server...');

// Start Vite on Windows using cmd wrapper or direct spawn
const viteProcess = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Helper to check when Vite is up
function waitForVite(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          clearInterval(interval);
          resolve();
        }
      }).on('error', () => {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error('Timeout waiting for Vite dev server to start at ' + url));
        }
      });
    }, 500);
  });
}

waitForVite('http://localhost:5173')
  .then(() => {
    console.log('✅ [Dev Runner] Vite is ready at http://localhost:5173');
    console.log('🖥️  [Dev Runner] Launching Electron window...');
    
    const electronProcess = spawn('npm.cmd', ['run', 'electron'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    electronProcess.on('close', (code) => {
      console.log(`[Dev Runner] Electron exited with code ${code}`);
      viteProcess.kill('SIGINT');
      process.exit(code);
    });
  })
  .catch((err) => {
    console.error('❌ [Dev Runner Error]', err);
    viteProcess.kill('SIGINT');
    process.exit(1);
  });
