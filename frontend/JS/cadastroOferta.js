
let formularioVisivel = false;

function adicionarProduto() {
  const container = document.getElementById('produtoContainer');

  if (!formularioVisivel) {
    const formProduto = `
      <form class=formulario id="formCadastroProduto" style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 10px;">
        <legend>Produto da Oferta</legend>
        <label class="label" label="produtoNome">Nome:</label><br>
        <input class="input" type="text" id="produtoNome" placeholder="Batata"><br>

        <label class="label" label="categoria">Categoria:</label><br>
        <select class="input" id="categoria">
          <option value="">Selecione uma categoria</option>
          <option value="Frutas">Frutas</option>
          <option value="Legumes">Legumes</option>
          <option value="Vegetais">Vegetais</option>
          <option value="Proteinas">Proteínas</option>
          <option value="Cereais">Cereais</option>
        </select><br>

        <label class="label" label="tipoMedida"> Tipo de Medida: </label> <br>

        <label class="label" for="kg">Kg</label>
        <input type="radio" id="kg" name="kg" value="kg">  
        
        <label class="label" for="g">gramas</label>
        <input type="radio" id="g" name="g" value="g">

        <label class="label" for="litro">litro</label>
        <input type="radio" id="litro" name="litro" value="litro">

        <label class="label" for="ml">ml</label>
        <input type="radio" id="ml" name="ml" value="ml">

        <label class="label" for="unidade">unidade</label>
        <input type="radio" id="unidade" name="unidade" value="un">
        <br><br>

        <label class="label" for="medida"> Medida: </label> <br>
        <input class=input type="number" id="medida" name="medida" step=0.1 placeholder="10,0 kg"> <br>

        <label class="label" for="produtoPreco">Preço:</label> <br>
        <input class="input" type="number" id="produtoPreco" step="0.1" placeholder="R$"><br>

        <label class="label" for="qtd">Quantidade:</label> <br>
        <input class="input" type="number" id="qtd" placeholder="100"> <br>


        <button type="submit" class="button" onclick="salvarProduto">Adicionar</button>
      </form>
    `;
    container.innerHTML = formProduto;
    formularioVisivel = true;
  }
}

//         FUNÇÃO PARA ADICIONAR PRODUTO AO FORM DE PUBLICAÇÃO

document.getElementById('formCadastroProduto').addEventListener("submit", function (salvarProduto) {
  salvarProduto.preventDefault();

  const nome = document.getElementById("nome-produto").value;
  const categoria = document.getElementById("categoria-produto").value;
  const medida = document.querySelector("input[name='medida']:checked");
  const quantidade = document.getElementById("quantidade").value;
  const preco = document.getElementById("preco").value;

  if (!nome || !categoria || !medida || !quantidade || !preco) {
    alert("Preencha todos os campos.");
    return;
  }

  const texto = `${nome} - ${quantidade} ${medida.value} (${categoria}) - R$ ${parseFloat(preco).toFixed(2)}`;

  const li = document.createElement("li");
  li.textContent = texto;
  document.getElementById("lista-produtos").appendChild(li);

  // Limpa o formulário
  salvarProduto.target.reset();
});

//      FUNÇÃO DE ENVIO DOS DADOS DA OFERTA AO BACK

document.getElementById('formOferta').addEventListener('submit', function(salvarPublicação) {
    salvarPublicação.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const fone = document.getElementById('fone').value;
    const pix = document.getElementById('pix').value;
    const listaProdutos = document.getElementById('listaProdutos').value;

    // Validação para campos vazios
    if (!titulo || !descricao || !fone || !pix || !listaProdutos) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const dados = { titulo, descricao, fone, pix, listaProdutos };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Cadastro simulado com sucesso! ID: ' + data.id);
        console.log(dados)

    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar o cadastro.');
    });
});
