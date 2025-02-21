const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Admin = require('./adminModel');

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deptName: {
        type: DataTypes.STRING(100), 
        allowNull: false
    },
    deptHead: {
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

    deptType: {
        type: DataTypes.ENUM('Educational', 'Hospital', 'Industry'),
        allowNull: false
    }
}, {
    tableName: 'departments',
    timestamps: true
});

module.exports = Department;
