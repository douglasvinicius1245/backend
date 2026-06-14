import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';
import multer from 'multer'; // 👈 Adicionado! Importação necessária para o upload em memória
import connectDB from './src/database/database_connect.js';

// Carrega as variáveis de ambiente (.env)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
const router = express.Router();

// Middlewares obrigatórios para leitura de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura o Multer global para manter o arquivo temporariamente na memória RAM
// Você pode exportar essa constante ou passá-la se preferir, mas mantendo aqui ela já funciona
const upload = multer({ storage: multer.memoryStorage() });

// Configuração manual de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Caminho da pasta de controllers (Declarado antes de ser usado)
const controllersPath = path.join(__dirname, 'src', 'controller');

// ÚNICO FLUXO ASSÍNCRONO: Conecta ao banco, carrega rotas e starta o servidor
(async () => {
  try {
    // 1. Conecta ao banco de dados primeiro
    await connectDB();

    // 2. Varre a pasta de controllers de forma dinâmica
    const files = fs.readdirSync(controllersPath);

    for (const file of files) {
      const fullPath = path.join(controllersPath, file);
      const fileUrl = pathToFileURL(fullPath).href;

      // Importação dinâmica (ES Modules)
      const module = await import(fileUrl);
      const controller = module.default || module;

      if (typeof controller === 'function') {
        // Passamos o 'router' e o middleware do 'upload' para os controllers usarem se precisarem
        controller(router, upload); 
        console.log(`✅ Controller carregado com sucesso: ${file}`);
      }
    }

    // 3. Ativa as rotas processadas no Express
    app.use(router);

    // 4. Inicia o servidor de fato
    app.listen(PORT, () => console.log(`🚀 Servidor rodando redondinho na porta ${PORT}`));

  } catch (error) {
    console.error("❌ Falha crítica na inicialização do servidor:", error);
    process.exit(1); // Fecha o processo caso o banco ou rotas falhem
  }
})();