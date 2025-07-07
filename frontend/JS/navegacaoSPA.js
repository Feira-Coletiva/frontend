// Simulação de tipo de usuário logado (em um app real, você pegaria isso do backend ou localStorage)
let tipoUsuario = 'vendedor'; // ou 'cliente'

// Rotas nomeadas
const rotas = {
  home: '/home.html',
  ofertas: 'HTML/ofertas.html',
  perfil: {
    vendedor: '../HTML/paginaVendedor.html',
    cliente: '../HTML/paginaCliente.html'
  }
};

function carregarPagina(nomePagina) {
  // Oculta cabeçalhos/fundos fixos da tela anterior
  const containerVendedor = document.getElementById('vendedor-container');
  const cabecalho = document.getElementById('cabecalho');

  if (containerVendedor) containerVendedor.style.display = 'none';
  if (cabecalho) cabecalho.style.display = 'none';

  console.log("Tentando carregar:", nomePagina);

  // Seleciona o caminho correto com base no nome da página e tipo de usuário
  let caminho;

  if (nomePagina === 'perfil') {
    caminho = rotas.perfil[tipoUsuario];
  } else {
    caminho = rotas[nomePagina];
  }

  // Carrega a página
  fetch(caminho)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      return response.text();
    })
    .then(html => {
      document.getElementById('conteudo').innerHTML = html;
    })
    .catch(error => {
      document.getElementById('conteudo').innerHTML = `<p style="color: red;">Erro ao carregar a página: ${error.message}</p>`;
    });
}

function mostrarVendedor() {
  document.getElementById('conteudo').innerHTML = '';
  document.getElementById('cabecalho').style.display = 'flex';
  document.getElementById('vendedor-container').style.display = 'block';
}
