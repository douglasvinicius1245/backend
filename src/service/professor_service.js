import professor from '../model/professor.js';
import turma from '../model/turma.js';

/**
 * 1. Cadastra um novo Professor
 */
export async function createProfessor(body) {
    try {
        const { nome, email, materia, senha } = body;

        const newProfessor = new professor({
            nome,
            email,
            materia,
            senha
        });

        return await newProfessor.save();
    } catch (err) {
        if (err.code === 11000) {
            return { error: 'Este e-mail já está cadastrado para outro professor.', status: 400 };
        }
        return { error: err.message, status: 400 };
    }
}

export async function getProfessorLogin(body) {
    try {
        const { email, senha } = body;

        const professorEncontrado = await professor.findOne({ email, senha }).lean();

        if (!professorEncontrado) {
            return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.', status: 401 };
        }

        return professorEncontrado;
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 2. Lista todos os professores
 */
export async function getProfessores() {
    try {
        return await professor.find().lean();
    } catch (err) {
        return { error: err.message, status: 500 };
    }
}

/**
 * 3. Busca um professor específico pelo ID
 */
export async function getProfessorById(id) {
    try {
        const professorEncontrado = await professor.findById(id).lean();
        if (!professorEncontrado) {
            return { error: 'Professor não encontrado.', status: 404 };
        }
        return professorEncontrado;
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

/**
 * 4. Atualiza os dados do professor
 */
export async function updateProfessor(id, body) {
    try {
        const { nome, email, materia, senha } = body;

        const professorAtualizado = await professor.findByIdAndUpdate(
            id,
            { nome, email, materia, senha },
            { new: true, runValidators: true }
        );

        if (!professorAtualizado) {
            return { error: 'Professor não encontrado.', status: 404 };
        }

        return professorAtualizado;
    } catch (err) {
        if (err.code === 11000) return { error: 'Este e-mail já está em uso.', status: 400 };
        return { error: err.message, status: 400 };
    }
}

/**
 * 5. Deleta o professor e desvincula das turmas que ele gerenciava
 */
export async function deleteProfessor(id) {
    try {
        const professorExiste = await professor.findById(id);
        if (!professorExiste) return { error: 'Professor não encontrado.', status: 404 };

        // Integração: Se o professor for deletado, removemos o ID dele do campo 
        // 'professorResponsavel' de qualquer turma que ele estivesse alocado.
        await turma.updateMany(
            { professorResponsavel: id },
            { $unset: { professorResponsavel: "" } } // Remove o campo da turma para não quebrar consultas
        );

        await professor.findByIdAndDelete(id);
        return { message: 'Professor removido com sucesso e turmas atualizadas.' };
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}