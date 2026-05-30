import turma from '../model/turma.js';
import aluno from '../model/aluno.js';
import { sincronizarChatDaTurma } from './mensagem_service.js';

/**
 * 1. Cria uma Turma e gera automaticamente a sala de chat dela
 */
export async function createTurma(body) {
    try {
        const { nome, anoLetivo, professorResponsavelId, alunosIds } = body;

        const novaTurma = new turma({
            nome,
            anoLetivo,
            professorResponsavel: professorResponsavelId,
            alunos: alunosIds || []
        });

        const turmaSalva = await novaTurma.save();

        // Se a turma foi criada já com alunos, atualiza o cadastro de cada aluno no banco
        if (alunosIds && alunosIds.length > 0) {
            await aluno.updateMany(
                { _id: { $in: alunosIds } },
                { $set: { turma: turmaSalva._id } }
            );
        }

        // 🚀 AUTOMAÇÃO: Cria a sala de chat oficial para esta turma recém-criada
        const chatCriado = await sincronizarChatDaTurma(turmaSalva._id);

        return {
            turma: turmaSalva,
            chatAutomatico: chatCriado.error ? "Falha ao gerar chat" : "Chat criado com sucesso!"
        };
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 2. Lista todas as turmas com os dados completos do Professor e Alunos (JOIN completo)
 */
export async function getTurmas() {
    try {
        return await turma.find()
            .populate('professorResponsavel', 'nome materia email')
            .populate('alunos', 'nome email')
            .lean();
    } catch (err) {
        return { error: err.message, status: 500 };
    }
}

/**
 * 3. Busca uma turma específica por ID
 */
export async function getTurmaById(id) {
    try {
        const turmaEncontrada = await turma.findById(id)
            .populate('professorResponsavel', 'nome materia email')
            .populate('alunos', 'nome email')
            .lean();

        if (!turmaEncontrada) return { error: 'Turma não encontrada.', status: 404 };
        return turmaEncontrada;
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 4. Adiciona um Aluno individual em uma Turma existente
 */
export async function vincularAlunoNaTurma(turmaId, alunoId) {
    try {
        // 1. Adiciona o aluno no array da turma (usando $addToSet para evitar IDs duplicados)
        const turmaAtualizada = await turma.findByIdAndUpdate(
            turmaId,
            { $addToSet: { alunos: alunoId } },
            { new: true }
        );

        if (!turmaAtualizada) return { error: 'Turma não encontrada.', status: 404 };

        // 2. Atualiza o cadastro do aluno para apontar para esta turma
        await aluno.findByIdAndUpdate(alunoId, { $set: { turma: turmaId } });

        return { message: 'Aluno vinculado à turma com sucesso!', turma: turmaAtualizada };
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 5. Deleta a turma e limpa o vínculo nos alunos dela (evita que alunos fiquem presos a uma turma que sumiu)
 */
export async function deleteTurma(id) {
    try {
        const turmaExiste = await turma.findById(id);
        if (!turmaExiste) return { error: 'Turma não encontrada.', status: 404 };

        // Remove a referência desta turma no cadastro de todos os alunos que pertenciam a ela
        await aluno.updateMany(
            { turma: id },
            { $unset: { turma: "" } }
        );

        await turma.findByIdAndDelete(id);
        return { message: 'Turma removida com sucesso. Os alunos vinculados agora estão sem turma.' };
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/** 6. Atualiza os dados da turma (nome, ano letivo, professor responsável)
 */
export async function updateTurma(id, body) {
    try {
        const { nome, anoLetivo, professorResponsavelId } = body;

        const turmaAtualizada = await turma.findByIdAndUpdate(
            id,
            { nome, anoLetivo, professorResponsavel: professorResponsavelId },
            { new: true, runValidators: true }
        );

        if (!turmaAtualizada) return { error: 'Turma não encontrada.', status: 404 };

        return turmaAtualizada;
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}