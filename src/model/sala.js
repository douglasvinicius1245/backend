import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true // Ex: "Turma de Node.js - 2026"
    },
    descricao: String,
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno',
        required: true
    },
    membros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno'
    }]
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);