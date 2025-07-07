document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const fone = document.getElementById('fone').value;
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
    if (!nome || !email || !fone || !senha || !confirmaSenha) {
        mensagemErro.innerHTML = `Por favor, preencha todos os campos.`;
        return;
    }

    // Validação para confirmar senha
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

    const dados = { nome, email, fone, senha };

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
