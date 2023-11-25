const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('railway', 'postgres', 'DEA-f12A-F24cBCAB52F32DEf*AFFec4', {
  host: 'roundhouse.proxy.rlwy.net',
  port: 23929,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const Funcionario = sequelize.define('Funcionario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Produtos = sequelize.define('Produtos', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categorias: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
});

const FuncionarioProduto = sequelize.define('FuncionarioProduto', {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Funcionario.belongsToMany(Produtos, { through: FuncionarioProduto });
Produtos.belongsToMany(Funcionario, { through: FuncionarioProduto });

module.exports = { sequelize, Funcionario, Produtos, FuncionarioProduto };
