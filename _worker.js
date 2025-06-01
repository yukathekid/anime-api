export default {
  async fetch(request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({ error: "Falta o userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = "AIzaSyBWc3xZ1yUc08r1Y0D5CtwWoKs-hMs_JNc"; // Substitua pela sua chave de API do Google

    const apiUrl = `https://www.googleapis.com/blogger/v3/users/${userId}?key=${apiKey}`;

    try {
      const res = await fetch(apiUrl);

      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: `Erro na API do Blogger: ${res.status}` }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const data = await res.json();

      const perfil = {
        nome: data.displayName || "",
        foto: data.image?.url || "",
        bio: data.about || "",
      };

      return new Response(JSON.stringify(perfil), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Erro interno no Worker", details: e.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
