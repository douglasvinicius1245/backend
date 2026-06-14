import { 
    criarSala, 
    enviarMensagem, 
    pegarMensagensDaSala, 
    listarSalasDoAluno 
} from '../service/mensagem_service.js';

export default (router) => {

    // 1. Criar uma nova sala de chat (direta ou grupo de turma)
    router.post('/chats/salas', async (req, res) => {
        const novaSala = await criarSala(req.body);
        if (novaSala.error) return res.status(novaSala.status || 400).json(novaSala);
        
        res.status(201).json(novaSala);
    });

    // 2. Listar todas as salas em que um aluno específico está inserido
    router.get('/chats/alunos/:alunoId', async (req, res) => {
        const salas = await listarSalasDoAluno(req.params.alunoId);
        if (salas.error) return res.status(salas.status || 400).json(salas);
        
        res.json(salas);
    });

    // 3. Enviar uma nova mensagem para dentro de uma sala (Atualizado com papel do remetente)
    router.post('/chats/salas/:roomId/mensagens', async (req, res) => {
        // Recebe o papel vindo do frontend ('aluno' ou 'professor')
        const { remetenteId, conteudo, papelRemetente } = req.body; 
        const { roomId } = req.params;

        // Passamos o papel adaptado para o Service
        const papelMapeado = papelRemetente === 'teacher' || papelRemetente === 'professor' ? 'professor' : 'aluno';

        const mensagem = await enviarMensagem(roomId, remetenteId, conteudo, papelMapeado);
        if (mensagem.error) return res.status(mensagem.status || 400).json(mensagem);
        
        res.status(201).json(mensagem);
    });

    // 4. Buscar o histórico de mensagens de uma sala específica (com paginação opcional)
    router.get('/chats/salas/:roomId/mensagens', async (req, res) => {
        const { limite } = req.query; // Permite passar ?limite=20 na URL
        const historico = await pegarMensagensDaSala(req.params.roomId, limite ? parseInt(limite) : 50);
        
        if (historico.error) return res.status(historico.status || 400).json(historico);
        
        res.json(historico);
    });
};