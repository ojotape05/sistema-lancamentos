const { exec } = require('child_process');

// Iniciar o front-end
const frontend = exec('npm start');
frontend.stdout.pipe(process.stdout);
frontend.stderr.pipe(process.stderr);

// Aguardar um curto período antes de iniciar o back-end para garantir que o front-end esteja pronto
setTimeout(() => {
  // Iniciar o back-end
  const backend = exec('npm run backend');
  backend.stdout.pipe(process.stdout);
  backend.stderr.pipe(process.stderr);
}, 5000); // Aguarde 5 segundos (ajuste conforme necessário)
