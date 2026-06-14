import mongoose from 'mongoose';

const missaoSchema = new mongoose.Schema({
    chave: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Ex: 'primeira_mensagem', 'enviar_10_mensagens'
    titulo: { type: String, required: true }, // Ex: "Quebrando o Gelo"
    descricao: { type: String, required: true }, // Ex: "Envie sua primeira mensagem no chat geral"
    pontosRecompensa: { type: Number, default: 10 },
    badgeRecompensa: {
        nome: String,
        icone: String // Pode ser uma string de emoji (ex: "💬") ou URL de imagem
    },
    tipoGatilho: { 
        type: String, 
        enum: ['mensagem_enviada', 'sala_criada'], 
        required: true 
    },
    metaQuantidade: { type: Number, default: 1 } // Quantas vezes a ação deve ser feita
}, { timestamps: true });

export default mongoose.model('Missao', missaoSchema);