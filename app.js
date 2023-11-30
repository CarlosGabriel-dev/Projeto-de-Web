const { Op } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { Funcionario, Produtos, FuncionarioProduto } = require('./dao/db');




async function testarConexao() {
    try {
      // Sincronizar as tabelas com o banco de dados
      await Produtos.sequelize.sync();
      await Funcionario.sequelize.sync();
      await FuncionarioProduto.sequelize.sync();
  
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));
// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Rota para a página inicial (login)
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'pages', 'login.html');
    console.log('Acessando a página de login. Caminho do arquivo:', indexPath);
    res.sendFile(indexPath);
});
// Rota para a página home
app.get('/home', (req, res) => {
    const indexPath = path.join(__dirname, 'pages', 'home.html');
    console.log('Acessando a página home. Caminho do arquivo:', indexPath);
    res.sendFile(indexPath);
});
// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cadastro.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'registro.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'search.html'));
});



// Rota para cadastro de produtos
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

// Rota para registro de funcionários
app.post('/registro-funcionario', async (req, res) => {
    console.log(req.body); 
    const { nome, cargo, email, senha } = req.body;

    try {
        const novoFuncionario = await Funcionario.create({
            nome,
            cargo,
            email,
            senha
        });

        res.status(201).json({ success: true, funcionario: novoFuncionario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/', async (req, res) => {
    const { email, password } = req.body;

    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);

    try {
        // Buscar funcionário pelo e-mail
        const funcionario = await Funcionario.findOne({ where: { email } });

        console.log('Funcionário encontrado:', funcionario);

        // Verificar se o funcionário existe e a senha está correta
        if (funcionario) {
            res.status(200).json({ success: true, funcionario: { nome: funcionario.nome } });

        } else {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/calcular-comissao', (req, res) => {
    const { nome, cargo, lucro, comissao } = req.body;

    FuncionarioComissao.create({
        nome,
        cargo,
        lucro,
        comissao,
    })
    .then(() => {
        res.status(201).json({ success: true });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    });
});

// Rota para a busca de produtos
app.post('/buscar-produtos', async (req, res) => {
    const { nome } = req.body;

    try {
        const produtos = await Produtos.findAll({
            where: {
                nome: {
                    [Op.like]: `%${nome}%`
                }
            }
        });

        // Renderizar a página HTML com os resultados da busca
        res.render('resultadoBusca', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para exibir os resultados da busca diretamente em formato JSON
app.post('/buscar-produtos-json', async (req, res) => {
    const { nome } = req.body;

    try {
        const produtos = await Produtos.findAll({
            where: {
                nome: {
                    [Op.like]: `%${nome}%`
                }
            }
        });

        res.status(200).json({ success: true, produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.delete('/remover-produto/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Use Sequelize para encontrar e remover o produto
        const produtoRemovido = await Produtos.destroy({
            where: { id: id }
        });

        if (produtoRemovido) {
            res.status(200).json({ success: true, message: 'Produto removido com sucesso.' });
        } else {
            res.status(404).json({ success: false, error: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});



app.get('/editar-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produtos.findByPk(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        res.render('editarProduto', { produto });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.put('/editar-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, valor } = req.body;

        const result = await Produtos.update(
            { nome, descricao, valor },
            { where: { id } }
        );

        if (result[0] === 0) {
            return res.status(404).json({ success: false, error: 'Produto não encontrado' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Exemplo de rota no Express para atualizar a quantidade
app.put('/atualizar-quantidade/:id', async (req, res) => {
    const { id } = req.params;
    const { quantidadeDelta } = req.body;

    try {
        const produto = await Produtos.findByPk(id);

        if (!produto) {
            return res.status(404).json({ success: false, error: 'Produto não encontrado' });
        }

        // Atualizar a quantidade com o delta fornecido
        produto.quantidade += quantidadeDelta;

        // Salvar as alterações no banco de dados
        await produto.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});




app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
