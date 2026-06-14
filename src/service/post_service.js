import Post from '../model/Post.js'; // Ajuste o caminho se necessário

// Criar uma nova publicação
// export async function createPost(postData) {
//   // Se não vier um ID específico no corpo, gera um identificador limpo
//   if (!postData.id) {
//     postData.id = `post_${Math.random().toString(36).substr(2, 9)}`;
//   }
//   const newPost = new Post(postData);
//   return await newPost.save();
// }
import cloudinary from '../config/cloudinaryConfig.js';

export async function createPost(postData, imageFile) {
  // 1. Garante um ID único para o post
  if (!postData.id) {
    postData.id = `post_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 2. Se houver um arquivo de imagem enviado
  if (imageFile) {
    try {
      // Função auxiliar para enviar o buffer da memória para o Cloudinary
      const resultadoUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'swift_chat_posts' }, // Cria uma pasta organizada no seu painel
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        // Despeja o buffer da imagem no fluxo de upload
        uploadStream.end(imageFile.buffer);
      });

      // Captura a URL otimizada e segura gerada pelo Cloudinary
      postData.image = resultadoUpload.secure_url;
    } catch (err) {
      throw new Error(`Falha no upload para o Cloudinary: ${err.message}`);
    }
  }

  // 3. Salva os dados finais com a URL no MongoDB
  const newPost = new Post(postData);
  return await newPost.save();
}

// Listar todas as publicações (da mais recente para a mais antiga)
export async function getAllPosts() {
  return await Post.find().sort({ createdAt: -1 });
}

// Buscar uma publicação por ID customizado
export async function getPostById(postId) {
  const post = await Post.findOne({ id: postId });
  if (!post) throw new Error('Publicação não encontrada.');
  return post;
}

// Deletar uma publicação sem restrição de usuário
export async function deletePost(postId) {
  const resultado = await Post.deleteOne({ id: postId });
  if (resultado.deletedCount === 0) throw new Error('Publicação não encontrada para exclusão.');
  return resultado;
}

// Alternar o Like (Se já curtiu remove, se não curtiu adiciona)
export async function toggleLike(postId, userId) {
  const post = await Post.findOne({ id: postId });
  if (!post) throw new Error('Publicação não encontrada.');

  const index = post.likes.indexOf(userId);
  if (index !== -1) {
    post.likes.splice(index, 1); // Remove o like
  } else {
    post.likes.push(userId); // Adiciona o like
  }

  return await post.save();
}