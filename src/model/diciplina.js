import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
    nome: String,
    
})

export default mongoose.model('professor', professorSchema);