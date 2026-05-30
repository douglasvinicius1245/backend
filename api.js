import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // Adicionado pathToFileURL

import dotenv from 'dotenv';
import connectDB from './src/database/database_connect.js';

// Obtenha o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

(async () => {
  // 1. Conecta ao banco de dados ANTES de carregar as rotas e o servidor
  await connectDB();

  const files = fs.readdirSync(controllersPath);
  // ... loop dos controllers ...
  
  app.use(router);
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})();

const controllersPath = path.join(__dirname, 'src', 'controller');

// Função assíncrona autoexecutável para permitir o uso de await
(async () => {
  const files = fs.readdirSync(controllersPath);

  for (const file of files) {
    const fullPath = path.join(controllersPath, file);
    
    // Convertemos o caminho do arquivo para uma URL válida (ex: file:///...)
    // Isso evita problemas de compatibilidade no Windows/Linux com o import() dinâmico
    const fileUrl = pathToFileURL(fullPath).href;

    // Importação dinâmica (substituta do require)
    const module = await import(fileUrl);
    
    // Se o seu controller usa "export default", ele estará em module.default
    const controller = module.default || module;

    if (typeof controller === 'function') {
      controller(router);
      console.log(`Controller carregado: ${file}`);
      
    }
  }

  // Garante que as rotas sejam aplicadas após todos os controllers carregarem
  app.use(router);

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})();