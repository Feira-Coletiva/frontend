// ID do vendedor para simular a sessão.
const VENDEDOR_ID_PADRAO = 1;

// URLs da sua API
const API_VENDEDORES_URL = `http://localhost:8080/api/vendedores/${VENDEDOR_ID_PADRAO}`;
const API_OFERTAS_VENDEDOR_URL = `http://localhost:8080/api/vendedores/ofertas/${VENDEDOR_ID_PADRAO}`;
const API_OFERTAS_DETALHES_URL = `http://localhost:8080/api/ofertas/produtos/`;

// Elementos HTML
const conteudoSpa = document.getElementById('conteudo-spa');
const nomeUsuarioHeader = document.querySelector('#perfil-info h2');
const telefoneUsuarioHeader = document.querySelector('#perfil-info p');
const btnInfoVendedor = document.getElementById('btn-info-vendedor');
const btnOfertas = document.getElementById('btn-ofertas');
const btnPublicacoes = document.getElementById('btn-publicacoes');

// --- Funções para carregar o conteúdo SPA ---

// Preenche o cabeçalho e carrega o formulário de informações
async function carregarInfoVendedor() {
    try {
        const response = await fetch(API_VENDEDORES_URL);
        if (!response.ok) {
            throw new Error('Vendedor não encontrado na API.');
        }
        const vendedor = await response.json();
        
        // Atualiza o cabeçalho com os dados do vendedor
        nomeUsuarioHeader.textContent = vendedor.nome;
        telefoneUsuarioHeader.textContent = vendedor.telefone;

        const formularioHtml = `
            <h3 class="mb-3">Minhas Informações</h3>
            <form id="form-info-vendedor">
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" id="nome" value="${vendedor.nome}" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="email" value="${vendedor.email}" required>
                </div>
                <div class="mb-3">
                    <label for="telefone" class="form-label">Telefone</label>
                    <input type="tel" class="form-control" id="telefone" value="${vendedor.telefone}" required>
                </div>
                <div class="mb-3">
                    <label for="chavePix" class="form-label">Chave PIX</label>
                    <input type="text" class="form-control" id="chavePix" value="${vendedor.chavePix}" required>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-primary" id="btn-editar-info">Editar</button>
                </div>
            </form>
        `;
        conteudoSpa.innerHTML = formularioHtml;

        document.getElementById('btn-editar-info').addEventListener('click', () => {
            alert('Funcionalidade de edição ainda não implementada.');
        });
    } catch (error) {
        console.error('Erro ao carregar dados do vendedor:', error);
        conteudoSpa.innerHTML = `<p class="text-danger text-center">Não foi possível carregar os dados do vendedor. ${error.message}</p>`;
    }
}

// Gera e injeta a tela de ofertas
async function carregarOfertasVendedor() {
    let ofertasHtml = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Minhas Ofertas</h3>
            <button class="btn btn-success" id="btn-nova-oferta">Nova Oferta</button>
        </div>
        <div id="ofertas-container" class="row row-cols-1 row-cols-md-2 g-4">
    `;

    try {
        const response = await fetch(API_OFERTAS_VENDEDOR_URL);
        if (!response.ok) {
            throw new Error('Não foi possível carregar as ofertas.');
        }
        const vendedorComOfertas = await response.json();
        const ofertas = vendedorComOfertas.ofertas;

        if (ofertas && ofertas.length > 0) {
            ofertas.forEach(oferta => {
                const statusTexto = oferta.dispoStatus ? 'Ativa' : 'Inativa';
                const statusCor = oferta.dispoStatus ? 'text-success' : 'text-danger';
                
                ofertasHtml += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card">
                            <img src="../IMAGENS/verduras.jpg" class="card-img-top" alt="Imagem da oferta" style="height: 150px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${oferta.titulo}</h5>
                                <p class="card-text mb-2"><strong class="${statusCor}">${statusTexto}</strong></p>
                                <button type="button" class="btn btn-primary w-100 visualizar-oferta" data-id="${oferta.id}">Visualizar</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            ofertasHtml += `<p class="text-center text-muted mt-4">Nenhuma oferta encontrada.</p>`;
        }
    } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        ofertasHtml += `<p class="text-danger text-center mt-4">Erro ao carregar ofertas: ${error.message}</p>`;
    }
    
    ofertasHtml += `</div>`;
    conteudoSpa.innerHTML = ofertasHtml;

    document.getElementById('btn-nova-oferta')?.addEventListener('click', () => {
        window.location.href = '../HTML/cadastro-oferta.html';
    });

    document.querySelectorAll('.visualizar-oferta').forEach(button => {
        button.addEventListener('click', (event) => {
            const ofertaId = event.target.dataset.id;
            visualizarDetalhesOferta(ofertaId);
        });
    });
}

// Gera a tela de detalhes de uma oferta específica
async function visualizarDetalhesOferta(ofertaId) {
    let detalhesHtml = `
        <button class="btn btn-secondary mb-3" id="btn-voltar-ofertas">
            <i class="fa-solid fa-arrow-left"></i> Voltar
        </button>
    `;

    try {
        const response = await fetch(`${API_OFERTAS_DETALHES_URL}${ofertaId}`);
        if (!response.ok) {
            throw new Error('Detalhes da oferta não encontrados.');
        }
        const oferta = await response.json();

        // Constrói a lista de produtos
        const produtosHtml = oferta.produtos.map(p => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong class="me-2">${p.nome}</strong>
                    <span class="text-muted">(${p.medida} ${p.unidadeMedida})</span>
                </div>
                <div>
                    <span class="badge bg-secondary me-2">Qtd: ${p.qtdEstoque}</span>
                    <span class="badge bg-success">R$ ${p.preco.toFixed(2)}</span>
                </div>
            </li>
        `).join('');

        detalhesHtml += `
            <div class="card mb-3">
                <img src="../IMAGENS/verduras.jpg" class="card-img-top" alt="Imagem da oferta" style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${oferta.titulo}</h5>
                    <p class="card-text">${oferta.descricao}</p>
                    <ul class="list-group list-group-flush mb-3">
                        <li class="list-group-item d-flex justify-content-between">
                            <strong>Estoque Total:</strong>
                            <span>${oferta.qtdEstoqueTotal} itens</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <strong>Disponibilidade:</strong>
                            <span class="${oferta.statusDisponibilidade ? 'text-success' : 'text-danger'}">
                                ${oferta.statusDisponibilidade ? 'Ativa' : 'Inativa'}
                            </span>
                        </li>
                    </ul>
                    <h6 class="mt-3">Produtos na oferta:</h6>
                    <ul class="list-group">
                        ${produtosHtml}
                    </ul>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <button class="btn btn-warning me-2">Editar</button>
                <button class="btn btn-danger">Excluir</button>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar detalhes da oferta:', error);
        detalhesHtml += `<p class="text-danger text-center">Erro ao carregar os detalhes da oferta: ${error.message}</p>`;
    }
    
    conteudoSpa.innerHTML = detalhesHtml;

    // Adiciona o evento para o botão "Voltar"
    document.getElementById('btn-voltar-ofertas').addEventListener('click', carregarOfertasVendedor);
}

// Gera e injeta a tela de publicações (placeholder)
function carregarPublicacoesVendedor() {
    const publicacoesHtml = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Minhas Publicações</h3>
            <button class="btn btn-success" id="btn-nova-publicacao">Nova Publicação</button>
        </div>
        <p class="text-center text-muted mt-4">Nenhuma publicação encontrada.</p>
    `;
    conteudoSpa.innerHTML = publicacoesHtml;

    document.getElementById('btn-nova-publicacao')?.addEventListener('click', () => {
        alert('Redirecionando para a tela de cadastro de publicação...');
    });
}

// --- Event listeners para os botões do perfil ---
document.addEventListener('DOMContentLoaded', () => {
    carregarInfoVendedor();

    btnInfoVendedor.addEventListener('click', () => {
        carregarInfoVendedor();
        btnInfoVendedor.classList.replace('btn-outline-primary', 'btn-primary');
        btnOfertas.classList.replace('btn-primary', 'btn-outline-primary');
        btnPublicacoes.classList.replace('btn-primary', 'btn-outline-primary');
    });

    btnOfertas.addEventListener('click', () => {
        carregarOfertasVendedor();
        btnOfertas.classList.replace('btn-outline-primary', 'btn-primary');
        btnInfoVendedor.classList.replace('btn-primary', 'btn-outline-primary');
        btnPublicacoes.classList.replace('btn-primary', 'btn-outline-primary');
    });

    btnPublicacoes.addEventListener('click', () => {
        carregarPublicacoesVendedor();
        btnPublicacoes.classList.replace('btn-outline-primary', 'btn-primary');
        btnInfoVendedor.classList.replace('btn-primary', 'btn-outline-primary');
        btnOfertas.classList.replace('btn-primary', 'btn-outline-primary');
    });
});