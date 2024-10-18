export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Captura a versão da URL (ex: '/v1')
    const pathParts = url.pathname.split('/').filter(part => part); // Divide e filtra partes vazias
    const version = pathParts[1]; // A versão deve ser a segunda parte (índice 1)

    // Verifica se a versão é suportada
    if (version !== 'v1') {
      return new Response('Versão não suportada', { status: 404 });
    }

    // Captura a categoria (ex: 'shinobi') da URL
    const categoriaQuery = pathParts[2]; // Pega a próxima parte do caminho

    // Exemplo: Busca o JSON de personagens que você hospedou no GitHub Pages
    const response = await fetch('https://yukathekid.github.io/anime-api/v1/characters.json');

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      return new Response('Erro ao buscar dados', { status: 500 });
    }
    
    const data = await response.json();

    // Busca a categoria (ex: 'shinobi') dentro do JSON
    const categoria = data[categoriaQuery];

    // Verifica se a categoria existe no JSON
    if (!categoria) {
      return new Response('Categoria não encontrada', { status: 404 });
    }

    // Captura os parâmetros "anime" e "id" da URL
    const animeQuery = url.searchParams.get('anime'); // Captura 'anime' do query parameter
    const idQuery = url.searchParams.get('id'); // Captura 'id' do query parameter

    let personagensFiltrados = categoria;

    // Se o parâmetro "anime" estiver presente, filtra os personagens por esse anime
    if (animeQuery) {
      personagensFiltrados = personagensFiltrados.filter(personagem =>
        personagem.anime.toLowerCase() === animeQuery.toLowerCase()
      );
    }

    // Se o parâmetro "id" estiver presente, filtra os personagens por esse ID
    if (idQuery) {
      personagensFiltrados = personagensFiltrados.filter(personagem =>
        personagem.id.toString() === idQuery
      );
    }

    // Verifica se encontrou algum personagem após os filtros
    if (personagensFiltrados.length === 0) {
      return new Response('Personagem não encontrado', { status: 404 });
    }

    // Retorna o(s) personagem(ns) filtrado(s) em formato JSON
    return new Response(JSON.stringify(personagensFiltrados), {
      headers: { 'content-type': 'application/json' }
    });
  }
}
