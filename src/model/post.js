const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', PostSchema);
