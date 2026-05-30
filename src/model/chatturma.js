import Turma from '../model/turma.js';

export async function buscarDadosParaChatDaTurma(turmaId) {
    try {
        // O Mongoose vai no banco e substitui os IDs pelos dados reais do Professor e dos Alunos
        const dadosTurma = await Turma.findById(turmaId)
            .populate('professorResponsavel', 'nome materia') // Traz só o nome e matéria do prof
            .populate('alunos', 'nome email')                 // Traz o nome e email de todos os alunos
            .lean();

        return dadosTurma;
    } catch (err) {
        return { error: err.message };
    }
}
