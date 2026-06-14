import Aluno from '../model/aluno.js'; // Ajuste o caminho do seu model de aluno
import Missao from '../model/missao.js';
import Message from '../model/mensagem.js';

export async function verificarEAtualizarMissoes(alunoId, tipoGatilho) {
    try {
        // 1. Busca o aluno
        const aluno = await Aluno.findById(alunoId);
        if (!aluno) return null;

        // 2. Busca missões ativas para esse tipo de gatilho que o aluno AINDA NÃO CONCLUIU
        const missoesPendentes = await Missao.find({
            tipoGatilho: tipoGatilho,
            chave: { $nin: aluno.completedMissions || [] }
        });

        let novasConquistas = [];

        for (const missao of missoesPendentes) {
            let progressoAtual = 0;

            // 3. Verifica o progresso baseado no banco de dados
            if (tipoGatilho === 'mensagem_enviada') {
                // Conta quantas mensagens o aluno já enviou no total
                progressoAtual = await Message.countDocuments({ remetente: alunoId });
            }

            // 4. Se o progresso atingiu a meta, o aluno concluiu a missão!
            if (progressoAtual >= missao.metaQuantidade) {
                aluno.completedMissions.push(missao.chave);
                aluno.points += missao.pontosRecompensa;
                
                if (missao.badgeRecompensa && missao.badgeRecompensa.nome) {
                    aluno.badges.push({
                        nome: missao.badgeRecompensa.nome,
                        icone: missao.badgeRecompensa.icone,
                        ganhoEm: new Date()
                    });
                }

                novasConquistas.push({
                    titulo: missao.titulo,
                    pontos: missao.pontosRecompensa,
                    badge: missao.badgeRecompensa
                });
            }
        }

        // 5. Se houve conquistas, salva o aluno atualizado no banco
        if (novasConquistas.length > 0) {
            await aluno.save();
            return { concluídas: true, conquistas: novasConquistas, totalPontos: aluno.points };
        }

        return { concluídas: false };
    } catch (err) {
        console.error("Erro no sistema de missões:", err);
        return { error: err.message };
    }
}