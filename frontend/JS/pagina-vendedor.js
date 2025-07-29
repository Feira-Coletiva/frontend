document.addEventListener('DOMContentLoaded', () => {
    // ID do Vendedor Logado (simulação)
    const VENDEDOR_ID = 1;

    // Endpoints da API
    const API_VENDEDOR_URL = `http://localhost:8080/api/vendedores/${VENDEDOR_ID}`;
    const API_OFERTAS_VENDEDOR_URL = `http://localhost:8080/api/vendedores/ofertas/${VENDEDOR_ID}`;
    const API_OFERTA_POR_ID_URL = 'http://localhost:8080/api/ofertas'; // Endpoint para buscar oferta por ID
    const API_PUBLICACOES_VENDEDOR_URL = `http://localhost:8080/api/publicacoes/vendedor/${VENDEDOR_ID}`;
    // Endpoint principal para buscar publicações (agora usaremos o de detalhes)
    const API_PUBLICACAO_POR_ID_URL = 'http://localhost:8080/api/publicacoes';
    // Novo endpoint para buscar detalhes de uma PARTICIPAÇÃO (para o vendedor)
    const API_PARTICIPANTE_POR_ID_URL = 'http://localhost:8080/api/participantes';


    // Elementos da página
    const conteudoSpa = document.getElementById('conteudo-spa');
    const nomeVendedorElement = document.querySelector('#perfil-info h2');
    const telefoneVendedorElement = document.querySelector('#perfil-info p');
    const btnInfoVendedor = document.getElementById('btn-info-vendedor');
    const btnOfertas = document.getElementById('btn-ofertas');
    const btnPublicacoes = document.getElementById('btn-publicacoes');

    // --- Funções de Carregamento de Conteúdo (SPA) ---

    // Carrega e injeta as informações de perfil do vendedor em um formulário
    async function carregarInfoVendedor() {
        try {
            const response = await fetch(API_VENDEDOR_URL);
            if (!response.ok) {
                throw new Error('Não foi possível carregar as informações do vendedor.');
            }
            const vendedor = await response.json();
            
            nomeVendedorElement.textContent = vendedor.nome;
            telefoneVendedorElement.textContent = vendedor.telefone;
            
            const infoHtml = `
                <h3 class="mb-3">Informações Pessoais</h3>
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
                        <label for="chavePix" class="form-label">Chave Pix</label>
                        <input type="text" class="form-control" id="chavePix" value="${vendedor.chavePix}" required>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-editar" id="btn-editar-info-vendedor">Editar</button>
                    </div>
                </form>
            `;
            conteudoSpa.innerHTML = infoHtml;

            document.getElementById('btn-editar-info-vendedor').addEventListener('click', () => {
                alert('Funcionalidade de edição ainda não implementada.');
            });

        } catch (error) {
            console.error('Erro ao carregar informações do vendedor:', error);
            conteudoSpa.innerHTML = `<p class="text-danger text-center">Erro ao carregar informações.</p>`;
        }
    }

    // Carrega e injeta a tela de ofertas
    async function carregarOfertasVendedor() {
        let ofertasHtml = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Minhas Ofertas</h3>
                <button class="btn btn-success btn-nova-oferta" id="btn-nova-oferta">Nova Oferta</button>
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
                                <img src="../IMAGENS/cesta-frutas.jpg" class="card-img-top" alt="Imagem da oferta" style="height: 150px; object-fit: cover;">
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

    // Carrega e injeta a tela de publicações
    async function carregarPublicacoesVendedor() {
        let publicacoesHtml = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Minhas Publicações</h3>
                <button class="btn btn-success btn-nova-publi" id="btn-nova-publicacao">Nova Publicação</button>
            </div>
            <div id="publicacoes-container" class="row row-cols-1 row-cols-md-2 g-4">
        `;

        try {
            const response = await fetch(API_PUBLICACOES_VENDEDOR_URL);
            if (!response.ok) {
                if (response.status === 404) {
                    publicacoesHtml += `<p class="text-center text-muted mt-4">Nenhuma publicação encontrada.</p>`;
                } else {
                    throw new Error('Não foi possível carregar as publicações.');
                }
            } else {
                const publicacoes = await response.json();

                if (publicacoes && publicacoes.length > 0) {
                    publicacoes.forEach(publicacao => {
                        publicacoesHtml += `
                            <div class="col-12 col-md-6 col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${publicacao.oferta.titulo}</h5>
                                        <p class="card-text mb-2"><strong>Etapa:</strong> ${publicacao.etapa}</p>
                                        <p class="card-text mb-2"><strong>Local de Retirada:</strong> ${publicacao.localDeRetirada.nome}</p>
                                        <p class="card-text mb-2"><strong>Expira em:</strong> ${publicacao.dtFinalExposicao}</p>
                                        <button type="button" class="btn btn-primary w-100 visualizar-publicacao" data-id="${publicacao.id}">Detalhes e Pedidos</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    publicacoesHtml += `<p class="text-center text-muted mt-4">Nenhuma publicação encontrada.</p>`;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar publicações:', error);
            publicacoesHtml += `<p class="text-danger text-center mt-4">Erro ao carregar publicações: ${error.message}</p>`;
        }
        
        publicacoesHtml += `</div>`;
        conteudoSpa.innerHTML = publicacoesHtml;

        document.getElementById('btn-nova-publicacao')?.addEventListener('click', () => {
            window.location.href = '../HTML/cadastro-publicacao.html';
        });

        document.querySelectorAll('.visualizar-publicacao').forEach(button => {
            button.addEventListener('click', (event) => {
                const publicacaoId = event.target.dataset.id;
                visualizarDetalhesPublicacao(publicacaoId);
            });
        });
    }

    // --- Funções de Detalhes de Oferta e Publicação ---

    // Exibe os detalhes de uma oferta específica, incluindo seus produtos
    async function visualizarDetalhesOferta(ofertaId) {
        try {
            const response = await fetch(`${API_OFERTA_POR_ID_URL}/${ofertaId}`);
            if (!response.ok) {
                throw new Error('Não foi possível carregar os detalhes da oferta.');
            }
            const oferta = await response.json();
            
            // Gerar o HTML para a lista de produtos da oferta
            let produtosOfertaHtml = '';
            if (oferta.produtos && oferta.produtos.length > 0) {
                produtosOfertaHtml = oferta.produtos.map(produto => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${produto.nome} (${produto.unidadeMedida})</h6>
                            <small>Preço: R$ ${produto.preco.toFixed(2)} | Estoque: ${produto.qtdEstoque}</small>
                        </div>
                    </li>
                `).join('');
            } else {
                produtosOfertaHtml = '<li class="list-group-item">Nenhum produto cadastrado para esta oferta.</li>';
            }

            const detalhesHtml = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0">Detalhes da Oferta</h3>
                    <button class="btn btn-secondary" id="btn-voltar-ofertas">Voltar</button>
                </div>
                <div class="card p-4">
                    <img src="../IMAGENS/cesta-frutas.jpg" class="card-img-top mb-3" alt="Imagem da oferta" style="height: 200px; object-fit: cover;">
                    <h5>${oferta.titulo}</h5>
                    <p><strong>Descrição:</strong> ${oferta.descricao}</p>
                    <hr>
                    <p><strong>Estoque Total:</strong> ${oferta.qtdEstoqueTotal}</p>
                    <p><strong>Status:</strong> <span class="${oferta.statusDisponibilidade ? 'text-success' : 'text-danger'}">${oferta.statusDisponibilidade ? 'Ativa' : 'Inativa'}</span></p>
                    <hr>
                    <h5>Produtos da Oferta</h5>
                    <ul class="list-group mb-3">
                        ${produtosOfertaHtml}
                    </ul>
                </div>
                <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-warning btn-editar">Editar Oferta</button>
                </div>
            `;
            
            conteudoSpa.innerHTML = detalhesHtml;

            document.getElementById('btn-voltar-ofertas')?.addEventListener('click', () => {
                carregarOfertasVendedor();
            });

        } catch (error) {
            console.error('Erro ao carregar detalhes da oferta:', error);
            conteudoSpa.innerHTML = `<p class="text-danger text-center">Erro ao carregar detalhes da oferta.</p>`;
        }
    }
    
    // Exibe os detalhes de uma publicação específica, incluindo seus participantes e os pedidos deles
    async function visualizarDetalhesPublicacao(publicacaoId) {
        try {
            // Usa o novo endpoint que retorna PublicacaoDetalhesOutputDTO
            const response = await fetch(`${API_PUBLICACAO_POR_ID_URL}/${publicacaoId}/detalhes`);
            if (!response.ok) {
                throw new Error('Não foi possível carregar os detalhes da publicação e participantes.');
            }
            const publicacao = await response.json();

            // Gerar o HTML para a lista de participantes
            let participantesHtml = '';
            if (publicacao.participantes && publicacao.participantes.length > 0) {
                participantesHtml = publicacao.participantes.map(participante => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${participante.cliente.nome}</h6>
                            <small>Valor Total: R$ ${participante.valorTotal.toFixed(2)} | Qtd. Produtos: ${participante.qtdTotalProdutos}</small>
                        </div>
                        <button class="btn btn-sm btn-info detalhes-participante-vendedor detalhes-pedidos" data-id="${participante.id}">Detalhes Pedidos</button>
                    </li>
                `).join('');
            } else {
                participantesHtml = '<li class="list-group-item text-muted">Nenhum participante nesta publicação ainda.</li>';
            }


            const detalhesHtml = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0">Detalhes da Publicação</h3>
                    <button class="btn btn-secondary" id="btn-voltar-publicacoes">Voltar</button>
                </div>
                <div class="card p-4">
                    <h5>Oferta: ${publicacao.oferta.titulo}</h5>
                    <p><strong>Descrição:</strong> ${publicacao.oferta.descricao}</p>
                    <hr>
                    <p><strong>Etapa Atual:</strong> ${publicacao.etapa}</p>
                    <p><strong>Local de Retirada:</strong> ${publicacao.localDeRetirada.nome} (${publicacao.localDeRetirada.cep})</p>
                    <p><strong>Data Final de Exposição:</strong> ${new Date(publicacao.dtFinalExposicao).toLocaleDateString()}</p>
                    <p><strong>Data Final de Pagamento:</strong> ${new Date(publicacao.dtFinalPagamento).toLocaleDateString()}</p>
                    <hr>
                    <h5>Participantes (${publicacao.participantes ? publicacao.participantes.length : 0})</h5>
                    <ul class="list-group mb-3">
                        ${participantesHtml}
                    </ul>
                </div>
                <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-primary btn-gerenciar-publi">Gerenciar Publicação</button>
                    <button class="btn btn-warning btn-editar">Editar Publicação</button>
                </div>
            `;
            
            conteudoSpa.innerHTML = detalhesHtml;

            document.getElementById('btn-voltar-publicacoes')?.addEventListener('click', () => {
                carregarPublicacoesVendedor();
            });

            // Adiciona event listeners para os botões de detalhes dos participantes
            document.querySelectorAll('.detalhes-participante-vendedor').forEach(button => {
                button.addEventListener('click', (event) => {
                    const participanteId = event.target.dataset.id;
                    visualizarDetalhesParticipanteVendedor(participanteId);
                });
            });

        } catch (error) {
            console.error('Erro ao carregar detalhes da publicação:', error);
            conteudoSpa.innerHTML = `<p class="text-danger text-center">Erro ao carregar detalhes da publicação.</p>`;
        }
    }

    // Função para exibir os detalhes de um participante específico e seus pedidos (para o vendedor)
    async function visualizarDetalhesParticipanteVendedor(participanteId) {
        try {
            const response = await fetch(`${API_PARTICIPANTE_POR_ID_URL}/${participanteId}`);
            if (!response.ok) {
                throw new Error('Não foi possível carregar os detalhes do participante.');
            }
            const participante = await response.json();

            // Formata a data e hora da participação
            const dataParticipacaoFormatada = new Date(participante.dataParticipacao).toLocaleDateString() + ' ' +
                                              new Date(participante.dataParticipacao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Gerar o HTML para a lista de pedidos do participante
            let pedidosDoParticipanteHtml = '';
            if (participante.pedidos && participante.pedidos.length > 0) {
                pedidosDoParticipanteHtml = participante.pedidos.map(pedido => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${pedido.produto.nome} (${pedido.produto.unidadeMedida})</h6>
                            <small>Qtd: ${pedido.qtdProdutos} | Preço Unitário: R$ ${pedido.precoUnitarioNoPedido.toFixed(2)}</small>
                        </div>
                        <strong>R$ ${pedido.valorTotalItem.toFixed(2)}</strong>
                    </li>
                `).join('');
            } else {
                pedidosDoParticipanteHtml = '<li class="list-group-item text-muted">Nenhum pedido encontrado para este participante.</li>';
            }

            const detalhesParticipanteHtml = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0">Detalhes do Participante</h3>
                    <button class="btn btn-secondary" id="btn-voltar-detalhes-publicacao">Voltar</button>
                </div>
                <div class="card p-4">
                    <h5>Cliente: ${participante.cliente.nome}</h5>
                    <p class="mb-1"><strong>E-mail:</strong> ${participante.cliente.email}</p>
                    <p class="mb-1"><strong>Telefone:</strong> ${participante.cliente.telefone}</p>
                    <hr>
                    <p class="mb-1"><strong>Data da Participação:</strong> ${dataParticipacaoFormatada}</p>
                    <p class="mb-1"><strong>Valor Total da Participação:</strong> R$ ${participante.valorTotal.toFixed(2)}</p>
                    <p class="mb-3"><strong>Status Pagamento:</strong> <span class="${participante.statusPago ? 'text-success' : 'text-warning'}">${participante.statusPago ? 'Pago' : 'Pendente'}</span></p>
                    <hr>
                    <h5>Pedidos Realizados (${participante.pedidos ? participante.pedidos.length : 0})</h5>
                    <ul class="list-group mb-3">
                        ${pedidosDoParticipanteHtml}
                    </ul>
                </div>
                <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-success btn-marcar-pago" id="btn-marcar-pago" ${participante.statusPago ? 'disabled' : ''}>
                        ${participante.statusPago ? 'Pagamento Confirmado' : 'Marcar como Pago'}
                    </button>
                </div>
            `;
            
            conteudoSpa.innerHTML = detalhesParticipanteHtml;

            // Ao clicar em voltar, recarrega os detalhes da publicação original
            document.getElementById('btn-voltar-detalhes-publicacao')?.addEventListener('click', () => {
                visualizarDetalhesPublicacao(participante.publicacao.id); // Reusa o ID da publicação da participação
            });

            // Lógica para marcar como pago (futuramente)
            document.getElementById('btn-marcar-pago')?.addEventListener('click', () => {
                alert('Funcionalidade de marcar pagamento ainda não implementada.');
                // Aqui você enviaria uma requisição PUT para o backend para atualizar o statusPago
            });

        } catch (error) {
            console.error('Erro ao carregar detalhes do participante:', error);
            conteudoSpa.innerHTML = `<p class="text-danger text-center">Erro ao carregar detalhes do participante.</p>`;
        }
    }


    // --- Lógica de Navegação SPA ---

    function setActiveButton(buttonId) {
        document.querySelectorAll('.gerencia-usuario .btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        });
        const activeButton = document.getElementById(buttonId);
        activeButton.classList.remove('btn-outline-primary');
        activeButton.classList.add('btn-primary');
    }

    btnInfoVendedor.addEventListener('click', () => {
        setActiveButton('btn-info-vendedor');
        carregarInfoVendedor();
    });

    btnOfertas.addEventListener('click', () => {
        setActiveButton('btn-ofertas');
        carregarOfertasVendedor();
    });

    btnPublicacoes.addEventListener('click', () => {
        setActiveButton('btn-publicacoes');
        carregarPublicacoesVendedor();
    });

    // Carrega a tela de informações do vendedor por padrão
    carregarInfoVendedor();
    setActiveButton('btn-info-vendedor');
});