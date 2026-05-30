// 1. Imports no topo do arquivo
import { createProfessor, getProfessores, getProfessorById, updateProfessor, deleteProfessor} from '../service/professor_service.js';

// 2. Export padrão do ES Modules para o seu carregador automático no api.js ler
export default (router) => {

    router.get('/professor/:id', (req, res) => {
        getProfessorById(req.params.id).then(professor => {
            if (professor.error) {
                res.status(professor.status).json({ error: professor.error });
            } else {
                res.json(professor);
            }
        });
    }),

    router.get('/professor', (req, res) => {
        // Chamamos o serviço de forma limpa, sem passar o req/res do Express
        getProfessores().then(professores => {
            res.json(professores);
        });
    });

    router.post('/professor', (req, res) => {
        // Passamos apenas o objeto de dados que o serviço precisa
        createProfessor(req.body).then(novoProfessor => {
            res.status(201).json(novoProfessor);
        });
    });

    router.put('/professor/:id', (req, res) => {
        // Passamos o ID da URL e o corpo da requisição alterado
        updateProfessor(req.params.id, req.body).then(professorAtualizado => {
            res.json(professorAtualizado);
        });
    });

    router.delete('/professor/:id', (req, res) => {
        // Passamos apenas o ID que queremos deletar
        deleteProfessor(req.params.id).then(professorExcluido => {
            res.json(professorExcluido);
        });
    });
};