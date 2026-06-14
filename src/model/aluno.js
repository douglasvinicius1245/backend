import mongoose from "mongoose";

const alunoSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    idade: { type: Number },
    senha: { type: String, required: true },
    papel: { type: String, enum: ['student', 'admin'], default: 'student' },
    
    // 👇 ADICIONADO: Referência para a turma do aluno
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'turma',
        required: false // Pode ser false caso o aluno acabe de se matricular e ainda não tenha turma
    }
}, { timestamps: true });

export default mongoose.model('aluno', alunoSchema);