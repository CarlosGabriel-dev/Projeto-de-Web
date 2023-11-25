const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Produtos } = require('./dao/db'); // Importe o modelo Produtos

async function testarConexao() {
  try {
    await Produtos.sequelize.authenticate();
    console.log('Conexão bem-sucedida.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

testarConexao();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar para servir arquivos estáticos das pastas 'public' e 'pages'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home', 'index.html'));
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cadastro.html'));
  });

app.post('/cadastro', async (req, res) => {
    console.log(req.body); 
    const { nome, descricao, valor, quantidade, categorias } = req.body;

    try {
        const novoProduto = await Produtos.create({
            nome,
            descricao,
            valor,
            quantidade,
            categorias
        });

        res.status(201).json({ success: true, produto: novoProduto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
