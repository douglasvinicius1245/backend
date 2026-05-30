import mongoose from 'mongoose';

// Primeiro definimos o sub-schema da mensagem
const mensagemSchema = new mongoose.Schema({
    remetente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno', // Faz referência ao seu model de aluno
        required: true
    },
    conteúdo: {
        type: String,
        required: true,
        trim: true
    },
    lida: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Cria automaticamente o 'createdAt' e 'updatedAt' para cada mensagem

// Schema principal da conversa
const chatSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['direto', 'grupo'], // 'direto' (aluno para aluno) ou 'grupo' (turma inteira)
        default: 'direto'
    },
    participantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno'
    }],
    nomeGrupo: {
        type: String, // Preenchido apenas se tipo for 'grupo'
        trim: true
    },
    // Array que embutirá as mensagens
    mensagens: [mensagemSchema]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);