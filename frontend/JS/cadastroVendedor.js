function toggleMenu() {
  const menu = document.getElementById('hamburguer-menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function irPara(destino) {
  alert(`Navegar para: ${destino}`);
  // Aqui você pode chamar sua função SPA real, como: carregarPagina(`HTML/${destino}.html`);
  toggleMenu(); // Fecha o menu ao clicar
}

document.getElementById('formCadastroVendedor').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const rg = document.getElementById('rg').value;
    const fone = document.getElementById('fone').value;
    const endereco = document.getElementById('endereco').value;
    const regiao = document.getElementById('regiao').value;
    const pix = document.getElementById('pix').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    const mensagemErro = document.getElementById('mensagem-erro');

    // Função de validação de senha segura
    function validarSenha(s) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(s);
    }

    // Limpa mensagens anteriores
    mensagemErro.textContent = '';

    // Validação para campos vazios
    if (!nome || !rg || !fone || !endereco || !regiao || !pix || !senha || !confirmaSenha) {
        mensagemErro.innerHTML = `Por favor, preencha todos os campos.`;
        return;
    }

    if (senha !== confirmaSenha) {
        mensagemErro.innerHTML = `As senhas não conferem!`;
        return;
    }

    // Validação de segurança da senha
    if (!validarSenha(senha)) {
        mensagemErro.innerHTML = `
            A senha deve conter no mínimo:
             8 caracteres,
             1 letra maiúscula,
             1 letra minúscula,
             1 número,
             1 caractere especial
        `;
        return;
    }

    const dados = { nome, rg, fone, endereco, regiao, pix, senha };

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
