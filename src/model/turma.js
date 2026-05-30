import mongoose from "mongoose";

const turmaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome da turma é obrigatório'], // Ex: "3º Ano - Informática" ou "Turma B"
        trim: true
    },
    anoLetivo: {
        type: Number,
        required: true // Ex: 2026
    },
    // Relação 1-para-1: Cada turma tem um professor responsável/conselheiro
    professorResponsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'professor', // Nome do model mapeado em professor.js
        required: [true, 'A turma precisa de um professor responsável']
    },
    // Relação 1-para-Muitos: Uma lista de IDs de alunos que pertencem a esta turma
    alunos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno' // Nome do model mapeado em aluno.js
    }]
}, { timestamps: true });

export default mongoose.model('turma', turmaSchema);