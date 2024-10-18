addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
  // Captura a URL completa
  const url = new URL(request.url);

  // Captura o caminho da categoria (ex: 'shinobi')
  const categoriaQuery = url.pathname.split('/').pop(); // Pega a última parte do caminho, como 'shinobi'

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
