const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
        // Removed unique constraint here as we'll handle uniqueness at application level
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,  // Keep email unique as it's more important
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Staff'),
        allowNull: false,
    },
}, {
    tableName: 'admin',
    timestamps: true,
    indexes: [
        // Add specific indexes if needed, but be careful with the limit
        {
            unique: true,
            fields: ['email']
        }
    ]
});

module.exports = Admin;


