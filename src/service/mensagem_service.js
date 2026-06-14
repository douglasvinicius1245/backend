import Room from '../model/sala.js';
import Message from '../model/mensagem.js';
import Turma from '../model/turma.js';

/**
 * 1. Cria uma sala de chat se não existir ou atualiza adicionando membros caso já exista
 */
export async function criarSala(body) {
    try {
        const { nome, descricao, criadorId, membrosIds } = body;

        // 🔍 PASSO 1: Procura se já existe uma sala com esse nome exato
        const salaExistente = await Room.findOne({ nome: nome });

        if (salaExistente) {
            // 🔄 PASSO 2: Se a sala já existe, adiciona os novos membros sem duplicar
            // O $addToSet garante que o mesmo ID de aluno não entre duas vezes na lista
            const salaAtualizada = await Room.findByIdAndUpdate(
                salaExistente._id,
                { $addToSet: { membros: { $each: membrosIds || [] } } },
                { new: true } // Retorna a sala já modificada
            ).populate('criador', 'nome email').lean();

            return salaAtualizada;
        }

        // ➕ PASSO 3: Se a sala NÃO existe, cria uma do zero normalmente
        const novaSala = new Room({
            nome,
            descricao,
            criador: criadorId,
            membros: membrosIds || []
        });

        const salaSalva = await novaSala.save();
        return await Room.findById(salaSalva._id).populate('criador', 'nome email').lean();

    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 2. Lista todas as salas/canais onde um determinado Aluno ou Professor é membro
 */
export async function listarSalasDoAluno(usuarioId) {
    try {
        // Busca salas onde o array de membros contenha o ID enviado
        return await Room.find({ membros: usuarioId })
            .populate('criador', 'nome email')
            .lean();
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 3. Salva uma nova mensagem vinculada a uma Sala e a um Remetente (Múltiplas Coleções)
 */
export async function enviarMensagem(roomId, remetenteId, conteudo, papelRemetente = 'aluno') {
    try {
        const salaExiste = await Room.exists({ _id: roomId });
        if (!salaExiste) {
            return { error: 'A sala de chat informada não existe.', status: 404 };
        }

        const novaMensagem = new Message({
            roomId,
            remetente: remetenteId,
            conteudo,
            onModel: papelRemetente // 👈 Define dinamicamente a coleção de busca ('aluno' ou 'professor')
        });

        const mensagemSalva = await novaMensagem.save();
        
        return await Message.findById(mensagemSalva._id)
            .populate('remetente', 'nome email')
            .lean();
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 4. Puxa o histórico de mensagens de um canal de forma ordenada e performática
 */
export async function pegarMensagensDaSala(roomId, limite = 50) {
    try {
        return await Message.find({ roomId })
            .sort({ createdAt: -1 }) // Traz as mensagens mais recentes primeiro
            .limit(limite)
            .populate('remetente', 'nome email') // Junta os dados do aluno/professor autor da msg
            .lean()
            .then(msgs => msgs.reverse()); // Desvira o array para o chat exibir na ordem cronológica correta
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 5. Método Utilitário: Cria automaticamente uma sala de chat baseada em uma Turma existente
 * (Pega o professor responsável e todos os alunos matriculados e joga na sala)
 */
export async function sincronizarChatDaTurma(turmaId) {
    try {
        const dadosTurma = await Turma.findById(turmaId).lean();
        if (!dadosTurma) return { error: 'Turma não encontrada', status: 404 };

        // Junta o ID do professor e o array de IDs de alunos em uma lista única de membros
        const todosMembros = [dadosTurma.professorResponsavel, ...dadosTurma.alunos];

        return await criarSala({
            nome: `Chat: ${dadosTurma.nome} (${dadosTurma.anoLetivo})`,
            descricao: `Canal de comunicação oficial da turma.`,
            criadorId: dadosTurma.professorResponsavel,
            membrosIds: todosMembros
        });
    } catch (err) {
        return { error: err.message, status: 500 };
    }
}