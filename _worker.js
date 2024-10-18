export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Captura a versão da URL (ex: 'v1')
    const pathSegments = url.pathname.split('/');
    const version = pathSegments[1]; // A versão será a primeira parte do caminho (índice 1)

    // Lista de versões suportadas
    const supportedVersions = ['v1'];

    // Verifica se a versão é suportada
    if (!supportedVersions.includes(version)) {
      return new Response('Versão não suportada', { status: 404 });
    }

    // Captura a categoria
    const categoriaQuery = pathSegments[2]; // Pega a segunda parte do caminho, deve ser 'images'
    
    // Verifica se a categoria é 'images'
    if (categoriaQuery !== 'images') {
      return new Response('Categoria não encontrada', { status: 404 });
    }

    // Captura o ID do personagem, se presente
    const idOuNome = pathSegments[3]; // Pega a terceira parte do caminho, que pode ser o ID ou nome

    // Busca o JSON de personagens do GitHub Pages
    const response = await fetch(`https://yukathekid.github.io/anime-api/${version}/characters.json`);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      return new Response('Erro ao buscar dados', { status: 500 });
    }

    const data = await response.json();

    // Se um ID ou nome for fornecido, procura o personagem específico
    if (idOuNome) {
      // Substitui espaços por hífens e converte para minúsculas
      const nomeComHifen = idOuNome.replace(/ /g, '-').toLowerCase();

      const personagemEncontrado = data.find(personagem =>
        personagem.id.toString() === idOuNome || 
        personagem.nome.replace(/ /g, '-').toLowerCase() === nomeComHifen
      );

      // Verifica se o personagem foi encontrado
      if (!personagemEncontrado) {
        return new Response('Personagem não encontrado', { status: 404 });
      }

      // Retorna o personagem específico em formato JSON
      return new Response(JSON.stringify(personagemEncontrado), {
        headers: { 'content-type': 'application/json' }
      });
    }

    // Se nenhum ID ou nome for fornecido, embaralha e retorna todos os personagens
    const personagensAleatorios = shuffleArray(data);

    // Retorna a lista de personagens em formato JSON
    return new Response(JSON.stringify(personagensAleatorios), {
      headers: { 'content-type': 'application/json' }
    });
  }
}

// Função para embaralhar um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
  return array;
  }
