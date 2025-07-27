let formularioProdutoVisivel = false;
let produtosAdicionados = []; 
const container = document.getElementById('produtoContainer');

// --- Função para Carregar Dados do Vendedor ---
async function carregarDadosVendedor(vendedorId) {
    const url = `http://localhost:8080/api/vendedores/${vendedorId}`; 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao carregar vendedor.' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const vendedor = await response.json();
        // Os IDs 'nomeVendedor' e 'emailVendedor' foram removidos do seu novo HTML,
        // então esta parte do código irá apenas ignorar a tentativa de preencher.
        document.getElementById('telefoneVendedor').value = vendedor.telefone || '';
        document.getElementById('chavePixVendedor').value = vendedor.chavePix || '';
        console.log('Dados do vendedor carregados:', vendedor);
    } catch (error) {
        console.error('Erro ao carregar dados do vendedor:', error);
        alert('Não foi possível carregar os dados do vendedor: ' + error.message);
    }
}

// --- Função para Carregar Categorias e Preencher o Select ---
async function carregarCategoriasNoSelect() {
    const selectCategoria = document.getElementById('categoriaProduto');
    selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

    const url = 'http://localhost:8080/api/categorias';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao carregar categorias.' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();
        
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.nome;
            option.textContent = categoria.nome;
            selectCategoria.appendChild(option);
        });
        console.log('Categorias carregadas:', categorias);
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Não foi possível carregar as categorias: ' + error.message);
        selectCategoria.disabled = true;
    }
}


// --- Chamada das funções ao carregar a página ---
document.addEventListener('DOMContentLoaded', () => {
    const vendedorIdInput = document.getElementById('vendedorIdInput');
    const vendedorId = vendedorIdInput ? vendedorIdInput.value : null;

    if (vendedorId) {
        carregarDadosVendedor(parseInt(vendedorId));
    }
});


// --- Função para Adicionar o Formulário de Produto Dinamicamente (agora com Bootstrap) ---
document.getElementById('btnAddProduto').addEventListener('click', adicionarProdutoForm);

function adicionarProdutoForm() {
    if (!formularioProdutoVisivel) {
        const formProdutoHtml = `
            <form class="formulario p-4 rounded shadow-sm bg-white" id="formCadastroProduto" style="max-width: 500px; width: 100%;">
                <legend class="text-center mb-4">Adicionar Produto à Oferta</legend>
                
                <div class="mb-3">
                    <label class="form-label" for="produtoNome">Nome:</label>
                    <input class="form-control" type="text" id="produtoNome" placeholder="Ex: Batata" required>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="categoriaProduto">Categoria:</label>
                    <select class="form-select" id="categoriaProduto" required>
                        <option value="">Selecione uma categoria</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label mb-2">Tipo de Medida:</label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="radioKg" name="unidadeMedida" value="KG" required> 
                        <label class="form-check-label" for="radioKg">KG</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="radioGramas" name="unidadeMedida" value="GRAMAS"> 
                        <label class="form-check-label" for="radioGramas">GRAMAS</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="radioLitro" name="unidadeMedida" value="LITRO"> 
                        <label class="form-check-label" for="radioLitro">LITRO</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="radioMl" name="unidadeMedida" value="ML"> 
                        <label class="form-check-label" for="radioMl">ML</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="radioUnidade" name="unidadeMedida" value="UNIDADE"> 
                        <label class="form-check-label" for="radioUnidade">UNIDADE</label>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="medidaProduto">Medida (Ex: 0.5 para 500g/ml, 1.0 para unidade):</label>
                    <input class="form-control" type="number" id="medidaProduto" name="medidaProduto" step="0.01" placeholder="Ex: 0.5" required>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="precoProduto">Preço Unitário (R$):</label>
                    <input class="form-control" type="number" id="precoProduto" step="0.01" placeholder="Ex: 12.50" required>
                </div>

                <div class="mb-4">
                    <label class="form-label" for="qtdEstoqueProduto">Quantidade em Estoque:</label>
                    <input class="form-control" type="number" id="qtdEstoqueProduto" placeholder="Ex: 100" required>
                </div>

                <button type="submit" class="btn btn-success w-100 mb-2" id="adicionarProdutoToListaBtn">Adicionar Produto à Lista</button>
            </form>
        `;
        container.innerHTML = formProdutoHtml;
        formularioProdutoVisivel = true;
        
        carregarCategoriasNoSelect(); 

        document.getElementById('formCadastroProduto').addEventListener("submit", salvarProdutoNaLista);
    }
}

// --- Funções de produto e de envio da oferta ---

function salvarProdutoNaLista(event) {
    event.preventDefault(); 

    const formProduto = event.target; 

    const nome = formProduto.querySelector("#produtoNome").value;
    const categoriaNome = formProduto.querySelector("#categoriaProduto").value; 
    const unidadeMedidaElement = formProduto.querySelector("input[name='unidadeMedida']:checked");
    const medida = parseFloat(formProduto.querySelector("#medidaProduto").value);
    const preco = parseFloat(formProduto.querySelector("#precoProduto").value);
    const qtdEstoque = parseInt(formProduto.querySelector("#qtdEstoqueProduto").value);

    if (!nome || !categoriaNome || !unidadeMedidaElement || isNaN(medida) || isNaN(preco) || isNaN(qtdEstoque)) {
        alert("Por favor, preencha todos os campos do produto corretamente.");
        return;
    }

    const unidadeMedida = unidadeMedidaElement.value;

    const novoProduto = {
        nome: nome,
        categoria: categoriaNome,
        unidadeMedida: unidadeMedida, 
        medida: medida,
        preco: preco,
        qtdEstoque: qtdEstoque
    };

    produtosAdicionados.push(novoProduto);

    const listaHtml = document.getElementById("lista-produtos");
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <strong>${novoProduto.nome}</strong> - ${novoProduto.qtdEstoque} ${novoProduto.unidadeMedida} (${novoProduto.medida.toFixed(2)} ${novoProduto.unidadeMedida.toLowerCase() == 'unidade' ? 'unid.' : ''}) @ R$ ${novoProduto.preco.toFixed(2)}
        <button type="button" class="btn btn-danger btn-sm" data-index="${produtosAdicionados.length - 1}">Remover</button>
    `;
    listaHtml.appendChild(li);

    li.querySelector('.btn-danger').addEventListener('click', removerProdutoDaLista);

    formProduto.reset();
    formularioProdutoVisivel = false; 
    container.innerHTML = '';
}

function removerProdutoDaLista(event) {
    const index = parseInt(event.target.dataset.index);
    if (!isNaN(index) && index >= 0 && index < produtosAdicionados.length) {
        produtosAdicionados.splice(index, 1);
        event.target.closest('li').remove();
        
        document.querySelectorAll('.lista-produtos li .btn-danger').forEach((btn, i) => {
            btn.dataset.index = i;
        });
    }
}

document.getElementById('formCadastroOferta').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const vendedorId = parseInt(document.getElementById('vendedorIdInput').value); 

    if (!titulo || !descricao) {
        alert('Por favor, preencha o título e a descrição da oferta.');
        return;
    }
    if (produtosAdicionados.length === 0) {
        alert('Por favor, adicione pelo menos um produto à oferta.');
        return;
    }

    // AQUI ESTÁ A CORREÇÃO FINAL para o erro 'getVendedorId() is null'
    const dadosOferta = {
        titulo: titulo,
        descricao: descricao,
        vendedorId: vendedorId, // Alterado para 'vendedorId' para corresponder ao DTO
        produtos: produtosAdicionados 
    };

    console.log("Dados a serem enviados:", dadosOferta);

    const apiUrl = 'http://localhost:8080/api/ofertas/produtos'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosOferta)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao cadastrar oferta.' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert('Oferta cadastrada com sucesso! ID: ' + data.id);
        console.log('Oferta salva:', data);

        document.getElementById('formCadastroOferta').reset();
        document.getElementById('lista-produtos').innerHTML = '';
        produtosAdicionados = []; 

    } catch (error) {
        console.error('Erro ao cadastrar oferta:', error);
        alert('Ocorreu um erro ao cadastrar a oferta: ' + error.message);
    }
});