// service/aluno_service.js
import aluno from '../model/aluno.js';

export async function createAluno(body) {
    try {
        const { nome, email, idade, senha } = body;
        const newAluno = new aluno({ nome, email, idade, senha });
        return await newAluno.save(); 
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

export async function getAluno(id) {
    try {
        return await aluno.findById(id).lean();
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

export async function getAlunos() {
    try {
        // .lean() ajuda na performance, retornando objetos JS puros em vez de documentos pesados do Mongoose
        return await aluno.find().lean(); 
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

export async function updateAluno(id, body) {
    try {
        const { nome, email, idade, senha } = body;
        return await aluno.findByIdAndUpdate(id, { nome, email, idade, senha }, { new: true });
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}

export async function deleteAluno(id) {
    try {
        await aluno.findByIdAndDelete(id);
        return { message: 'Aluno deletado com sucesso' };
    } catch (err) {
        return { error: err.message, status: 400 };
    }
}