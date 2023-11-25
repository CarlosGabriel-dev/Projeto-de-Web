// registro.js

document.getElementById('registro-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        // Obtenha os valores dos campos do formulário aqui
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        confirmarSenha: document.getElementById('confirmar-senha').value,
    };

    try {
        const response = await fetch('/registro-funcionario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
            // Registro bem-sucedido, redirecione ou realize outras ações necessárias
            console.log('Funcionário registrado com sucesso:', result.funcionario);
        } else {
            // Exiba uma mensagem de erro ou realize ações necessárias em caso de falha
            console.error('Erro no registro do funcionário:', result.error);
        }
    } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
    }
});
