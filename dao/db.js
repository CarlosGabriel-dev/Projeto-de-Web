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

// Sincronize o modelo com o banco de dados
(async () => {
  try {
    await sequelize.sync();
    console.log('Modelo sincronizado com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar o modelo com o banco de dados:', error);
  }
})();

module.exports = { sequelize, Produtos };
