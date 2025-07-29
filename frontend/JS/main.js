// ID do Cliente Logado (SIMULAÇÃO) - Em um app real, isso viria da autenticação
const CLIENTE_ID_LOGADO = 1; // Substitua por um ID de cliente válido do seu banco

// Método para navegação entre as telas da home
// Assumimos que esta função está definida em navegacaoSPA.js ou foi movida para cá.
function navega(destino) {
  let telas = document.getElementsByClassName('tela');
  Array.from(telas).forEach((element) => {
    element.classList.remove('show');
    element.classList.add('collapse');
  });
  document.getElementById(destino).classList.remove('collapse');
  document.getElementById(destino).classList.add('show');
}

// URLs da API
const API_PUBLICACAO_TODOS_URL = 'http://localhost:8080/api/publicacoes';
const API_PUBLICACAO_ID_URL = 'http://localhost:8080/api/publicacoes';

// Armazena as quantidades selecionadas de cada produto para o cálculo total
let quantidadesSelecionadas = {};

// --- Funções de Navegação e Carregamento de Dados ---

// Carregando todas as publicações da API
async function carregarDados() {
  try {
    const resposta = await axios.get(API_PUBLICACAO_TODOS_URL);
    const publicacoes = resposta.data;

    const cardsPublicaoes = document.getElementById('publicacoes');
    cardsPublicaoes.innerHTML = '';

    if (publicacoes.length === 0) {
      cardsPublicaoes.innerHTML = '<p class="text-center text-muted">Nenhuma publicação encontrada no momento.</p>';
      return;
    }

    publicacoes.forEach((publi) => {
      const card = document.createElement('div');
      card.classList.add('col-12', 'col-md-6', 'col-lg-4');
      card.innerHTML = `
        <!-- Card de Publicação -->
        <div class="card">
          <!-- Superior: Vendedor -->
          <div class="d-flex flex-row justify-content-between p-2">
            <div class="d-flex align-items-center">
              <img src="IMAGENS/manoel-gomes.jpg" alt="Perfil do Vendedor" style="width: 24px; border-radius: 50%;" />
              <span class="username ms-2" style="font-size: small;">${publi.oferta.vendedor.nome}</span>
            </div>
            <div class="d-flex align-items-center">
              <p class="mb-0" style="font-size: small;">Expira em: ${new Date(publi.dtFinalExposicao).toLocaleDateString()}</p>
            </div>
          </div>
          <!-- Meio: Imagem e Título -->
          <div class="">
            <img src="IMAGENS/cesta-frutas.jpg" alt="Imagem do produto" style="width: 100%; height: 150px; object-fit: cover;" />
          </div>
          <!-- Inferior: Descrição e Botão -->
          <div class="d-flex flex-column mt-1">
            <div class="px-3">
              <h5>${publi.oferta.titulo}</h5>
              <p>${publi.oferta.descricao}</p>
            </div>
            <div class="d-flex flex-row justify-content-center px-2 py-2">
              <button class="btn btn-primary w-100 botao-visualizar" onclick="carregarPubli(${publi.id})">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      `;
      cardsPublicaoes.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar as publicações:', erro);
    const cardsPublicaoes = document.getElementById('publicacoes');
    cardsPublicaoes.innerHTML = '<p class="text-center text-danger">Não foi possível carregar as publicações no momento. Tente novamente mais tarde.</p>';
  }
}

// Função para calcular o total da compra
function calcularTotalCompra(publicacao) {
    let total = 0;
    publicacao.oferta.produtos.forEach(produto => {
        const quantidade = quantidadesSelecionadas[produto.id] || 0;
        total += quantidade * produto.preco;
    });
    return total.toFixed(2);
}

// Carregando a publicação selecionada e seus produtos
// Carregando a publicação selecionada e seus produtos
async function carregarPubli(publicacaoId) {
  try {
    navega('publicacao');

    const resposta = await axios.get(`${API_PUBLICACAO_ID_URL}/${publicacaoId}`);
    const publi = resposta.data;

    // Reinicia as quantidades selecionadas para esta nova publicação
    quantidadesSelecionadas = {}; 

    const publiSelecionada = document.getElementById('publiSelecionada');
    publiSelecionada.innerHTML = '';

    // Gerar o HTML para a lista de produtos com seletores de quantidade
    let produtosHtml = '';
    if (publi.oferta.produtos && publi.oferta.produtos.length > 0) {
        produtosHtml = publi.oferta.produtos.map(produto => {
            // Inicializa a quantidade para cada produto como 0
            quantidadesSelecionadas[produto.id] = 0; 
            return `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${produto.nome} (${produto.unidadeMedida})</h6>
                        <small>Preço: R$ ${produto.preco.toFixed(2)} | Estoque: ${produto.qtdEstoque}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2 btn-diminuir" data-produto-id="${produto.id}">-</button>
                        <span class="quantidade-produto" id="qtd-produto-${produto.id}">0</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2 btn-aumentar" data-produto-id="${produto.id}" data-estoque="${produto.qtdEstoque}">+</button>
                    </div>
                </li>
            `;
        }).join('');
    } else {
        produtosHtml = '<li class="list-group-item">Nenhum produto disponível para esta oferta.</li>';
    }

    const publiSele = document.createElement('div');
    publiSele.classList.add('d-flex', 'flex-column', 'justify-content-center');
    publiSele.innerHTML = ` 
      <div class="my-3">
        <img src="IMAGENS/cesta-frutas.jpg" alt="Imagem do produto" style="width: 100%; height: 250px; object-fit: cover;">
      </div>
      <hr>
      <div class="mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="mb-0">${publi.oferta.titulo}</h2>
          <button class="btn btn-primary botao-voltar" onclick="navega('home')">Voltar</button>
        </div>
        <p class="mt-2">${publi.oferta.descricao}</p>
        <p><strong>Vendedor:</strong> ${publi.oferta.vendedor.nome}</p>
      </div>
      <hr>
      <div class="mb-2">
        <h5>Produtos Disponíveis</h5>
        <ul class="list-group">
            ${produtosHtml}
        </ul>
      </div>
      <hr>
      <div class="mb-2">
        <h5>Local de Retirada</h5>
        <p><strong>Nome do Local:</strong> ${publi.localDeRetirada.nome}</p>
        <p><strong>CEP:</strong> ${publi.localDeRetirada.cep}</p>
      </div>
      <hr>
      <div class="mb-2">
        <h5>Prazos</h5>
        <p><strong>Data Final de Exposição:</strong> ${new Date(publi.dtFinalExposicao).toLocaleDateString()}</p>
        <p><strong>Data Final de Pagamento:</strong> ${new Date(publi.dtFinalPagamento).toLocaleDateString()}</p>
      </div>
      <div class="d-grid gap-2 mt-4">
        <button class="btn btn-success botao-participar-compra" id="btn-participar-compra">Participar da Compra (Total: R$ <span id="total-compra">0.00</span>)</button>
      </div>
    `;
    publiSelecionada.appendChild(publiSele);

    // Adiciona event listeners para os botões de quantidade
    document.querySelectorAll('.btn-aumentar').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = parseInt(event.target.dataset.produtoId);
            const estoque = parseInt(event.target.dataset.estoque);
            if (quantidadesSelecionadas[produtoId] < estoque) {
                quantidadesSelecionadas[produtoId]++;
                document.getElementById(`qtd-produto-${produtoId}`).textContent = quantidadesSelecionadas[produtoId];
                document.getElementById('total-compra').textContent = calcularTotalCompra(publi);
            }
        });
    });

    document.querySelectorAll('.btn-diminuir').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = parseInt(event.target.dataset.produtoId);
            if (quantidadesSelecionadas[produtoId] > 0) {
                quantidadesSelecionadas[produtoId]--;
                document.getElementById(`qtd-produto-${produtoId}`).textContent = quantidadesSelecionadas[produtoId];
                document.getElementById('total-compra').textContent = calcularTotalCompra(publi);
            }
        });
    });

    // Event listener para o botão "Participar da Compra"
    document.getElementById('btn-participar-compra').addEventListener('click', async () => {
        const pedidosParaEnviar = [];
        for (const produtoId in quantidadesSelecionadas) {
            const quantidade = quantidadesSelecionadas[produtoId];
            if (quantidade > 0) {
                pedidosParaEnviar.push({
                    idProduto: parseInt(produtoId),
                    qtdProdutos: quantidade
                });
            }
        }

        if (pedidosParaEnviar.length === 0) {
            alert('Por favor, selecione a quantidade de pelo menos um produto para participar.');
            return;
        }

        const participanteData = {
            idCliente: CLIENTE_ID_LOGADO,
            idPublicacao: publicacaoId,
            pedidos: pedidosParaEnviar
        };

        try {
            const response = await axios.post('http://localhost:8080/api/participantes', participanteData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 || response.status === 200) { // 201 Created é o esperado para POST
                alert('Participação na compra registrada com sucesso!');
                // Opcional: Voltar para a home ou limpar a tela de detalhes
                navega('home'); 
                carregarDados(); // Recarregar a lista de publicações, se necessário
            } else {
                alert('Erro ao registrar participação. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar participação:', error);
            let mensagemErro = 'Erro ao registrar participação. Verifique o console para mais detalhes.';
            if (error.response && error.response.data && error.response.data.message) {
                mensagemErro = `Erro: ${error.response.data.message}`;
            } else if (error.message) {
                 mensagemErro = `Erro: ${error.message}`;
            }
            alert(mensagemErro);
        }
    });

  } catch (erro) {
    console.error('Erro ao carregar a publicação:', erro);
    const publiSelecionada = document.getElementById('publiSelecionada');
    publiSelecionada.innerHTML = '<p class="text-center text-danger">Publicação não encontrada ou erro ao carregar.</p>';
  }
}

// Chama a função ao carregar a página
window.onload = carregarDados;