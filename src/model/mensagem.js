import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true 
    },
    remetente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // 🚀 MÁGICA AQUI: O ref se torna dinâmico apontando para o campo 'onModel'
        refPath: 'onModel' 
    },
    // Guarda dinamicamente 'aluno' ou 'professor' para o Mongoose saber onde buscar no populate
    onModel: {
        type: String,
        required: true,
        enum: ['aluno', 'professor'],
        default: 'aluno'
    },
    conteudo: {
        type: String,
        required: true
    },
    anexo: {
        url: String,
        tipoAnexo: { type: String, enum: ['imagem', 'pdf', 'outro'] }
    }
}, { timestamps: true });

messageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);