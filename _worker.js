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

    // Captura a categoria (deve ser sempre 'images') e o ID/nome da URL
    const categoriaQuery = pathSegments[2]; // Pega a segunda parte do caminho, deve ser 'images'
    const idOuNome = pathSegments[3]; // Pega a terceira parte do caminho, que pode ser o ID ou nome

    // Verifica se a categoria é 'images'
    if (categoriaQuery !== 'images') {
      return new Response('Categoria não encontrada', { status: 404 });
    }

    // Busca o JSON de personagens do GitHub Pages
    const response = await fetch(`https://yukathekid.github.io/anime-api/${version}/characters.json`);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      return new Response('Erro ao buscar dados', { status: 500 });
    }

    const data = await response.json();

    // Substitui espaços por hífens e converte o nome para minúsculas
    const nomeComHifen = idOuNome ? idOuNome.replace(/ /g, '-').toLowerCase() : '';

    // Filtra os personagens por ID ou nome
    let personagensFiltrados = data.filter(personagem =>
      personagem.id.toString() === nomeComHifen || personagem.personagem.replace(/ /g, '-').toLowerCase() === nomeComHifen
    );

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
