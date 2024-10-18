export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const version = pathSegments[1]; // A versão será a primeira parte do caminho (ex: v1)

    const supportedVersions = ['v1'];
    if (!supportedVersions.includes(version)) {
      return new Response('Versão não suportada', { status: 404 });
    }

    const categoriaQuery = pathSegments[2]; // Deve ser 'images'
    if (categoriaQuery !== 'images') {
      return new Response('Categoria não encontrada', { status: 404 });
    }

    const idOuNome = pathSegments[3]; // Pega o ID

    try {
      // Busca o JSON de personagens
      const response = await fetch(`https://yukathekid.github.io/anime-api/${version}/characters.json`);
      if (!response.ok) throw new Error('Erro ao buscar o JSON');

      const data = await response.json();

      // Filtra objetos válidos
      const personagensValidos = data.filter(personagem => personagem.id && personagem.personagem && personagem.imagem);

      if (idOuNome) {
        const personagemEncontrado = personagensValidos.find(personagem => personagem.id.toString() === idOuNome);
        if (!personagemEncontrado) {
          return new Response('Personagem não encontrado', { status: 404 });
        }

        return new Response(JSON.stringify(personagemEncontrado), {
          headers: { 'content-type': 'application/json' }
        });
      }

      return new Response('ID não especificado', { status: 400 });

    } catch (err) {
      return new Response(`Erro no Worker: ${err.message}`, { status: 500 });
    }
  }
}
