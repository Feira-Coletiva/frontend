// Espera o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    const formCadastroVendedor = document.getElementById('formCadastroVendedor');
    const nomeInput = document.getElementById('nome');
    const rgInput = document.getElementById('rg');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const pixInput = document.getElementById('pix');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirmaSenha');
    const mensagemErro = document.getElementById('mensagem-erro');
    const criarContaVendedorBtn = document.getElementById('criarContaVendedor');

    // URL base da sua API
    const API_BASE_URL = 'http://localhost:8080';

    formCadastroVendedor.addEventListener('submit', async (e) => {
        // Previne o recarregamento da página
        e.preventDefault();

        // Limpa a mensagem de erro anterior
        mensagemErro.textContent = '';

        // Validações básicas no frontend
        if (senhaInput.value !== confirmaSenhaInput.value) {
            mensagemErro.textContent = 'As senhas não coincidem. Por favor, verifique.';
            return;
        }

        // Cria o objeto com os dados para enviar à API
        const dadosVendedor = {
            nome: nomeInput.value,
            rg: rgInput.value,
            email: emailInput.value,
            telefone: telefoneInput.value,
            cep: cepInput.value,
            chavePix: pixInput.value,
            senha: senhaInput.value
        };

        // Bloqueia o botão para evitar múltiplos cliques
        criarContaVendedorBtn.disabled = true;
        criarContaVendedorBtn.textContent = 'Cadastrando...';

        try {
            // Faz a requisição POST para o endpoint de vendedores
            const response = await axios.post(`${API_BASE_URL}/api/vendedores`, dadosVendedor, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                // Cadastro realizado com sucesso
                alert('Vendedor cadastrado com sucesso!');
                formCadastroVendedor.reset(); // Limpa o formulário
                // Redireciona o usuário para a página de login
                // window.location.href = 'login.html'; 
            }
        } catch (error) {
            console.error('Erro ao cadastrar vendedor:', error);
            if (error.response && error.response.data) {
                // Exibe a mensagem de erro retornada pela API
                if (error.response.data.message) {
                    mensagemErro.textContent = `Erro: ${error.response.data.message}`;
                } else if (Array.isArray(error.response.data)) {
                    const erros = error.response.data.map(err => err.defaultMessage || err.message).join(' | ');
                    mensagemErro.textContent = `Erro: ${erros}`;
                } else {
                    mensagemErro.textContent = 'Erro ao cadastrar. Por favor, tente novamente.';
                }
            } else {
                mensagemErro.textContent = 'Erro de conexão. Verifique se a API está online.';
            }
        } finally {
            // Reabilita o botão e restaura o texto
            criarContaVendedorBtn.disabled = false;
            criarContaVendedorBtn.textContent = 'Confirmar';
        }
    });

});
