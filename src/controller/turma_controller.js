// 1. Imports no topo do arquivo
import { createTurma, getTurmaById, deleteTurma, updateTurma} from '../service/turma_service.js';

// 2. Export padrão do ES Modules para o seu carregador automático no api.js ler
export default (router) => {

    router.get('/turma/:id', (req, res) => {
        getTurmaById(req.params.id).then(turma => {
            if (turma.error) {
                res.status(turma.status).json({ error: turma.error });
            } else {
                res.json(turma);
            }
        });
    }),

    router.get('/turma', (req, res) => {
        // Chamamos o serviço de forma limpa, sem passar o req/res do Express
        getTurmas().then(turmas => {
            res.json(turmas);
        });
    });

    router.post('/turma', (req, res) => {
        // Passamos apenas o objeto de dados que o serviço precisa
        createTurma(req.body).then(novaTurma => {
            res.status(201).json(novaTurma);
        });
    });

    router.put('/turma/:id', (req, res) => {
        // Passamos o ID da URL e o corpo da requisição alterado
        updateTurma(req.params.id, req.body).then(turmaAtualizada => {
            res.json(turmaAtualizada);
        });
    });

    router.delete('/turma/:id', (req, res) => {
        // Passamos apenas o ID que queremos deletar
        deleteTurma(req.params.id).then(turmaExcluida => {
            res.json(turmaExcluida);
        });
    });
};