import * as postService from '../services/PostService.js'; // Ajuste o caminho se necessário

export default (router, upload) => {
  
  // Rota de criação de Post (Intercepta o campo 'image' com o multer que veio do arquivo principal)
  router.post('/posts', upload.single('image'), async (req, res) => {
    try {
      // req.body tem os textos, req.file tem o buffer da foto
      const post = await postService.createPost(req.body, req.file);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  // Outras rotas comuns de Posts
  router.get('/posts', async (req, res) => {
    try {
      const posts = await postService.getAllPosts();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.delete('/posts/:id', async (req, res) => {
    try {
      await postService.deletePost(req.params.id);
      return res.status(200).json({ message: 'Deletado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });
  
  router.post('/posts/:id/like', async (req, res) => {
    try {
      const postAtualizado = await postService.toggleLike(req.params.id, req.body.userId);
      return res.status(200).json(postAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });
}