// ID do cliente para simular a sessão.
// Mude para o ID do cliente que você deseja testar.
const CLIENTE_ID_PADRAO = 1;

// URL base da sua API de clientes
const API_CLIENTES_URL = `http://localhost:8080/api/clientes/${CLIENTE_ID_PADRAO}`;
// Novo endpoint para buscar participações do cliente
const API_PARTICIPANTES_CLIENTE_URL = `http://localhost:8080/api/participantes/cliente/${CLIENTE_ID_PADRAO}`;


// Elementos HTML
const conteudoSpa = document.getElementById('conteudo-spa');
const nomeUsuarioHeader = document.querySelector('#perfil-info h2');
const telefoneUsuarioHeader = document.querySelector('#perfil-info p');
const btnInfo = document.getElementById('btn-info');
const btnPedidos = document.getElementById('btn-pedidos');

// --- Funções para carregar o conteúdo SPA ---

// Carrega os dados do cliente da API
async function carregarDadosCliente() {
    try {
        const response = await fetch(API_CLIENTES_URL);
        if (!response.ok) {
            throw new Error('Cliente não encontrado na API.');
        }
        const cliente = await response.json();
        
        // Atualiza o cabeçalho com os dados do cliente
        nomeUsuarioHeader.textContent = cliente.nome;
        telefoneUsuarioHeader.textContent = cliente.telefone;
        
        // Carrega o formulário de informações com os dados do cliente
        carregarInfoCliente(cliente);

    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        conteudoSpa.innerHTML = '<p class="text-danger text-center">Não foi possível carregar os dados do cliente.</p>';
    }
}

// Gera e injeta o formulário de informações do cliente
function carregarInfoCliente(cliente) {
    const formularioHtml = `
        <h3 class="mb-3">Minhas Informações</h3>
        <form id="form-info-cliente">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome Completo</label>
                <input type="text" class="form-control" id="nome" value="${cliente.nome}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" value="${cliente.email}" required>
            </div>
            <div class="mb-3">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="tel" class="form-control" id="telefone" value="${cliente.telefone}" required>
            </div>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary btn-editar" id="btn-editar-info">Editar</button>
            </div>
        </form>
    `;
    conteudoSpa.innerHTML = formularioHtml;
    
    // Futuramente, você pode adicionar a lógica de edição aqui
    document.getElementById('btn-editar-info').addEventListener('click', () => {
        alert('Funcionalidade de edição ainda não implementada.');
    });
}

// Gera e injeta a tela de pedidos (participações)
async function carregarPedidosCliente() {
    let pedidosHtml = `
        <h3 class="mb-3">Minhas Participações em Compras</h3>
        <div id="participacoes-container" class="row row-cols-1 g-3">
    `;

    try {
        const response = await fetch(API_PARTICIPANTES_CLIENTE_URL);
        if (!response.ok) {
            throw new Error('Não foi possível carregar suas participações em compras.');
        }
        const participacoes = await response.json();

        if (participacoes && participacoes.length > 0) {
            participacoes.forEach(participacao => {
                const statusPagoTexto = participacao.statusPago ? 'Pago' : 'Pendente';
                const statusPagoCor = participacao.statusPago ? 'text-success' : 'text-warning';
                const dataParticipacaoFormatada = new Date(participacao.dataParticipacao).toLocaleDateString() + ' ' +
                                                  new Date(participacao.dataParticipacao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                pedidosHtml += `
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${participacao.publicacao.tituloOferta}</h5>
                                <p class="card-text mb-1"><strong>Data da Participação:</strong> ${dataParticipacaoFormatada}</p>
                                <p class="card-text mb-1"><strong>Local de Retirada:</strong> ${participacao.publicacao.nomeLocalDeRetirada}</p>
                                <p class="card-text mb-1"><strong>Valor Total:</strong> R$ ${participacao.valorTotal.toFixed(2)}</p>
                                <p class="card-text mb-1"><strong>Quantidade Total de Produtos:</strong> ${participacao.qtdTotalProdutos}</p>
                                <p class="card-text mb-2"><strong>Status Pagamento:</strong> <span class="${statusPagoCor}">${statusPagoTexto}</span></p>
                                <button type="button" class="btn btn-info btn-sm detalhes-participacao btn-detalhes" data-id="${participacao.id}">Ver Detalhes</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            pedidosHtml += `<p class="text-center text-muted mt-4 col-12">Você ainda não participou de nenhuma compra.</p>`;
        }
    } catch (error) {
        console.error('Erro ao carregar participações:', error);
        pedidosHtml += `<p class="text-danger text-center mt-4 col-12">Erro ao carregar suas participações: ${error.message}</p>`;
    }
    
    pedidosHtml += `</div>`;
    conteudoSpa.innerHTML = pedidosHtml;

    // Adiciona event listeners para os botões de detalhes
    document.querySelectorAll('.detalhes-participacao').forEach(button => {
        button.addEventListener('click', (event) => {
            const participacaoId = event.target.dataset.id;
            // Chama a função para exibir os detalhes da participação
            visualizarDetalhesParticipacao(participacaoId);
        });
    });
}

// Função para exibir os detalhes de uma participação específica
async function visualizarDetalhesParticipacao(participacaoId) {
    try {
        const response = await fetch(`http://localhost:8080/api/participantes/${participacaoId}`); // Assumindo endpoint por ID
        if (!response.ok) {
            throw new Error('Não foi possível carregar os detalhes da participação.');
        }
        const participacao = await response.json();

        let pedidosItensHtml = '';
        if (participacao.pedidos && participacao.pedidos.length > 0) {
            pedidosItensHtml = participacao.pedidos.map(pedido => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${pedido.produto.nome} (${pedido.produto.unidadeMedida})</h6>
                        <small>Qtd: ${pedido.qtdProdutos} | Preço Unitário: R$ ${pedido.precoUnitarioNoPedido.toFixed(2)}</small>
                    </div>
                    <strong>R$ ${pedido.valorTotalItem.toFixed(2)}</strong>
                </li>
            `).join('');
        } else {
            pedidosItensHtml = '<li class="list-group-item">Nenhum pedido detalhado encontrado para esta participação.</li>';
        }

        const detalhesHtml = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Detalhes da Participação #${participacao.id}</h3>
                <button class="btn btn-secondary" id="btn-voltar-pedidos">Voltar</button>
            </div>
            <div class="card p-4 shadow-sm">
                <h5>Resumo da Compra</h5>
                <p class="mb-1"><strong>Oferta:</strong> ${participacao.publicacao.tituloOferta}</p>
                <p class="mb-1"><strong>Data da Participação:</strong> ${new Date(participacao.dataParticipacao).toLocaleDateString()} ${new Date(participacao.dataParticipacao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p class="mb-1"><strong>Local de Retirada:</strong> ${participacao.publicacao.nomeLocalDeRetirada}</p>
                <p class="mb-1"><strong>Valor Total da Participação:</strong> R$ ${participacao.valorTotal.toFixed(2)}</p>
                <p class="mb-3"><strong>Status Pagamento:</strong> <span class="${participacao.statusPago ? 'text-success' : 'text-warning'}">${participacao.statusPago ? 'Pago' : 'Pendente'}</span></p>
                
                <hr>
                <h5>Itens do Pedido</h5>
                <ul class="list-group">
                    ${pedidosItensHtml}
                </ul>
            </div>
            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-success btn-marcar-pago" id="btn-pagar-participacao" ${participacao.statusPago ? 'disabled' : ''}>
                    ${participacao.statusPago ? 'Pagamento Realizado' : 'Marcar como Pago'}
                </button>
                <button class="btn btn-danger">Cancelar Participação</button>
            </div>
        `;
        
        conteudoSpa.innerHTML = detalhesHtml;

        document.getElementById('btn-voltar-pedidos')?.addEventListener('click', () => {
            carregarPedidosCliente(); // Volta para a lista de participações
        });

        // Adicionar lógica para o botão "Marcar como Pago" (futuramente)
        document.getElementById('btn-pagar-participacao')?.addEventListener('click', () => {
            alert('Funcionalidade de marcar como pago ainda não implementada.');
        });

    } catch (error) {
        console.error('Erro ao carregar detalhes da participação:', error);
        conteudoSpa.innerHTML = `<p class="text-danger text-center">Erro ao carregar detalhes da participação.</p>`;
    }
}

// --- Event listeners para os botões do perfil ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados do cliente e o formulário ao iniciar
    carregarDadosCliente();

    // Evento para o botão "Minhas informações"
    btnInfo.addEventListener('click', () => {
        // Recarrega os dados para garantir que estejam atualizados
        carregarDadosCliente();
        btnInfo.classList.replace('btn-outline-primary', 'btn-primary');
        btnPedidos.classList.replace('btn-primary', 'btn-outline-primary');
    });

    // Evento para o botão "Pedidos"
    btnPedidos.addEventListener('click', () => {
        carregarPedidosCliente(); // ✅ Chama a função atualizada
        btnPedidos.classList.replace('btn-outline-primary', 'btn-primary');
        btnInfo.classList.replace('btn-primary', 'btn-outline-primary');
    });
});