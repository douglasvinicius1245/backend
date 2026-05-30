import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do professor é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    materia: {
        type: String,
        required: [true, 'A matéria/disciplina é obrigatória'],
        trim: true // Ex: "Cálculo I", "Estrutura de Dados"
    },
    senha: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('professor', professorSchema);