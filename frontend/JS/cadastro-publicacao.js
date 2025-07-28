document.addEventListener('DOMContentLoaded', () => {
    // ID do vendedor, para simular o usuário logado
    const VENDEDOR_ID = 1;

    // Endpoints da API
    const API_OFERTAS_URL = `http://localhost:8080/api/vendedores/ofertas/${VENDEDOR_ID}`;
    const API_LOCAL_RETIRADA_URL = 'http://localhost:8080/api/local-de-retirada'; // Corrigido para o endpoint singular
    const API_PUBLICACAO_URL = 'http://localhost:8080/api/publicacoes';

    // Elementos do DOM
    const formPublicacao = document.getElementById('formCadastrarPublicacao');
    const ofertaSelect = document.getElementById('ofertaSelect');
    const localRetiradaSelect = document.getElementById('localRetiradaSelect');
    const dtFinalExposicaoInput = document.getElementById('dtFinalExposicao');
    const dtFinalPagamentoInput = document.getElementById('dtFinalPagamento');
    const btnAdicionarLocal = document.getElementById('btnAdicionarLocal');
    
    // Modal e elementos do formulário de novo local
    const modalLocalRetirada = new bootstrap.Modal(document.getElementById('modalLocalRetirada'));
    const formNovoLocalRetirada = document.getElementById('formNovoLocalRetirada');
    const nomeLocalInput = document.getElementById('nomeLocal');
    const cepLocalInput = document.getElementById('cepLocal');

    // --- Funções de População dos Selects ---

    async function popularOfertas() {
        try {
            // Requisição para buscar as ofertas do vendedor logado
            const response = await fetch(API_OFERTAS_URL);
            if (!response.ok) throw new Error('Não foi possível carregar as ofertas.');
            
            const data = await response.json();
            const ofertas = data.ofertas;

            ofertaSelect.innerHTML = '<option value="">Selecione uma oferta disponível</option>';
            ofertas.forEach(oferta => {
                if (oferta.dispoStatus) { 
                    const option = document.createElement('option');
                    option.value = oferta.id;
                    option.textContent = oferta.titulo;
                    ofertaSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Erro ao popular ofertas:', error);
            ofertaSelect.innerHTML = `<option value="">Erro ao carregar ofertas</option>`;
            ofertaSelect.disabled = true;
        }
    }

    async function popularLocaisRetirada() {
        try {
            // Requisição para buscar todos os locais de retirada cadastrados
            const response = await fetch(API_LOCAL_RETIRADA_URL);
            if (!response.ok) throw new Error('Não foi possível carregar os locais de retirada.');

            const locais = await response.json();
            localRetiradaSelect.innerHTML = '<option value="">Selecione um local</option>';
            locais.forEach(local => {
                const option = document.createElement('option');
                option.value = local.id;
                option.textContent = `${local.nome} (${local.cep})`;
                localRetiradaSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao popular locais de retirada:', error);
            localRetiradaSelect.innerHTML = `<option value="">Erro ao carregar locais</option>`;
            localRetiradaSelect.disabled = true;
        }
    }

    // --- Funções de Manipulação de Formulários ---

    formPublicacao.addEventListener('submit', async (event) => {
        event.preventDefault();

        const publicacaoData = {
            idOferta: parseInt(ofertaSelect.value),
            idLocalDeRetirada: parseInt(localRetiradaSelect.value),
            dtFinalExposicao: dtFinalExposicaoInput.value,
            dtFinalPagamento: dtFinalPagamentoInput.value
        };
        
        try {
            const response = await fetch(API_PUBLICACAO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacaoData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Erro desconhecido ao cadastrar publicação.' }));
                throw new Error(error.message);
            }

            const publicacaoSalva = await response.json();
            alert(`Publicação "${publicacaoSalva.oferta.titulo}" cadastrada com sucesso!`);
            window.location.href = 'pagina-vendedor.html'; // Redireciona para a página do vendedor
        } catch (error) {
            console.error('Erro ao cadastrar publicação:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    formNovoLocalRetirada.addEventListener('submit', async (event) => {
        event.preventDefault();

        const novoLocalData = {
            nome: nomeLocalInput.value,
            cep: cepLocalInput.value
        };

        try {
            const response = await fetch(API_LOCAL_RETIRADA_URL, { // Corrigido para o endpoint singular
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoLocalData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Erro desconhecido ao cadastrar local.' }));
                throw new Error(error.message);
            }
            
            const novoLocal = await response.json();
            alert('Novo local de retirada cadastrado com sucesso!');
            modalLocalRetirada.hide();
            
            // Adiciona o novo local ao select e o seleciona
            const option = document.createElement('option');
            option.value = novoLocal.id;
            option.textContent = `${novoLocal.nome} (${novoLocal.cep})`;
            localRetiradaSelect.appendChild(option);
            localRetiradaSelect.value = novoLocal.id;

        } catch (error) {
            console.error('Erro ao cadastrar novo local:', error);
            alert(`Erro ao salvar local: ${error.message}`);
        }
    });

    btnAdicionarLocal.addEventListener('click', () => {
        nomeLocalInput.value = '';
        cepLocalInput.value = '';
        modalLocalRetirada.show();
    });

    // --- Chamadas iniciais para carregar os dados ---
    popularOfertas();
    popularLocaisRetirada();
});