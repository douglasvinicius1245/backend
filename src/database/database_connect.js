// database/database_connect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:mongoPASS12345@127.0.0.1:27017/swift_chat?authSource=admin"

export default async function connectDB() {
    // Se já estiver conectado, não faz nada
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conectado ao MongoDB com sucesso (Mongoose)");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error.message);
        process.exit(1); // Fecha o app se não conseguir conectar ao banco
    }
}