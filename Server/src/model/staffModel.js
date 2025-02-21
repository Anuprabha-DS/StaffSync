const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Admin = require('./adminModel');
const Department = require('./departmentModel');

const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(50),  
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    position: {
        type: DataTypes.STRING(100)
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Admin,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Changed to true to allow NULL values
        references: {
            model: Department,
            key: 'id'
        },
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'staff',
    timestamps: true
});

module.exports = Staff;