// ID do cliente para simular a sessão.
// Mude para o ID do cliente que você deseja testar.
const CLIENTE_ID_PADRAO = 1;

// URL base da sua API de clientes
const API_CLIENTES_URL = `http://localhost:8080/api/clientes/${CLIENTE_ID_PADRAO}`;

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
                <button type="button" class="btn btn-primary" id="btn-editar-info">Editar</button>
            </div>
        </form>
    `;
    conteudoSpa.innerHTML = formularioHtml;
    
    // Futuramente, você pode adicionar a lógica de edição aqui
    document.getElementById('btn-editar-info').addEventListener('click', () => {
        alert('Funcionalidade de edição ainda não implementada.');
    });
}

// Gera e injeta a tela de pedidos
function carregarPedidosCliente() {
    const pedidosHtml = `
        <h3 class="mb-3">Pedidos</h3>
        <p class="text-center text-muted">Você ainda não realizou nenhum pedido.</p>
        `;
    conteudoSpa.innerHTML = pedidosHtml;
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
        carregarPedidosCliente();
        btnPedidos.classList.replace('btn-outline-primary', 'btn-primary');
        btnInfo.classList.replace('btn-primary', 'btn-outline-primary');
    });
});