document.getElementById("formLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked').value;

  const mensagemErro = document.getElementById('mensagem-erro');

  try {
    mensagemErro.textContent = '';

    const resposta = await axios.post("http://localhost:8080/login", { email, senha });

    if (resposta.status === 200) {
      // Redireciona para home
      localStorage.setItem("usuarioLogado", JSON.stringify(resposta.data));
      localStorage.setItem("tipoUsuario", tipoUsuario); // cliente ou vendedor FAZER ENDPOINTS NO BACK
      window.location.href = "/home.html";
    }
  } catch (erro) {
    mensagemErro.innerHTML =`Usuário ou senha inválidos. Faça seu cadastro.`;
    console.error(erro);
  }
});
