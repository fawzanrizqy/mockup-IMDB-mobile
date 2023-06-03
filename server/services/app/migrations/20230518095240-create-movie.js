'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING
      },
      synopsis: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      trailerUrl: {
        type: Sequelize.STRING
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      years: {
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      genreId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Genres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      authorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};