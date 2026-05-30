import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true // 👈 INDEX IMPORTANTÍSSIMO para buscar as mensagens dessa sala rápido!
    },
    remetente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aluno',
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    // Controle para caso queira anexar arquivos de estudo
    anexo: {
        url: String,
        tipoAnexo: { type: String, enum: ['imagem', 'pdf', 'outro'] }
    }
}, { timestamps: true });

// Criamos um index composto para quando você implementar paginação (ex: carregar as últimas 20 mensagens)
messageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);