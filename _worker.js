export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Captura a versão da URL (ex: 'v1' ou 'v2')
    const pathSegments = url.pathname.split('/');
    const version = pathSegments[2]; // A versão será a segunda parte da URL (índice 2)

    // Verifica se a versão é suportada
    if (url.includes(version.toLowerCase()) !== ['v1'].toLowerCase()) {
      return new Response('Versão não suportada', { status: 404 });
    }

    // Captura o caminho da categoria (ex: 'shinobi')
    const categoriaQuery = pathSegments.pop(); // Pega a última parte do caminho, como 'shinobi'

    // Busca o JSON de personagens do GitHub Pages
    const response = await fetch(`https://yukathekid.github.io/anime-api/${version}/characters.json`);

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

// Função para verificar se a versão é suportada
async function isVersionSupported(version) {
  // Verifica se a URL da versão existe
  const response = await fetch(`https://yukathekid.github.io/anime-api/${version}/characters.json`);

  // Se a URL for acessível e retornar um JSON válido
  if (!response.ok) {
    return false; // Se não for um sucesso (ex: 404)
  }

  try {
    const data = await response.json();
    return data && typeof data === 'object'; // Verifica se o retorno é um objeto
  } catch (error) {
    return false; // Se não conseguir parsear o JSON
  }
}
