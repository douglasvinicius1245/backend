// 1. Imports no topo do arquivo
import { getAlunoLogin } from '../service/aluno_service.js';
import { getProfessorLogin } from '../service/professor_service.js';

// 2. Export padrão do ES Modules para o seu carregador automático no api.js ler
export default (router) => {

    router.post('/login/professor', (req, res) => {
        getProfessorLogin(req.body).then(professor => {
            if (professor.error) {
                res.status(professor.status).json({ error: professor.error });
            } else {
                res.json(aluno);
            }
        });
    }),
    
    router.post('/login/aluno', (req, res) => {
        getAlunoLogin(req.body).then(aluno => {
            if (aluno.error) {
                res.status(aluno.status).json({ error: aluno.error });
            } else {
                res.json(aluno);
            }
        });
    });
};