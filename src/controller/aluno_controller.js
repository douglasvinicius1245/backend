// 1. Imports no topo do arquivo
import { createAluno, getAlunos, getAluno, updateAluno, deleteAluno } from '../service/aluno_service.js';

// 2. Export padrão do ES Modules para o seu carregador automático no api.js ler
export default (router) => {

    router.get('/alunos/:id', (req, res) => {
        getAluno(req.params.id).then(aluno => {
            if (aluno.error) {
                res.status(aluno.status).json({ error: aluno.error });
            } else {
                res.json(aluno);
            }
        });
    }),

    router.get('/alunos', (req, res) => {
        // Chamamos o serviço de forma limpa, sem passar o req/res do Express
        getAlunos().then(alunos => {
            res.json(alunos);
        });
    });

    router.post('/alunos', (req, res) => {
        // Passamos apenas o objeto de dados que o serviço precisa
        createAluno(req.body).then(novoAluno => {
            res.status(201).json(novoAluno);
        });
    });

    router.put('/alunos/:id', (req, res) => {
        // Passamos o ID da URL e o corpo da requisição alterado
        updateAluno(req.params.id, req.body).then(alunoAtualizado => {
            res.json(alunoAtualizado);
        });
    });

    router.delete('/alunos/:id', (req, res) => {
        // Passamos apenas o ID que queremos deletar
        deleteAluno(req.params.id).then(alunoExcluido => {
            res.json(alunoExcluido);
        });
    });
};