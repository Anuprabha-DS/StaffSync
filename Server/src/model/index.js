const { sequelize } = require('../config/db');
const Admin = require('./adminModel');
const Department = require('./departmentModel');
const Staff = require('./staffModel');

// Define relationships
Department.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Admin.hasMany(Department, { foreignKey: 'adminId' });

Staff.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Admin.hasMany(Staff, { foreignKey: 'adminId' });

Staff.belongsTo(Department, { foreignKey: 'departmentId', onDelete: 'SET NULL' });
Department.hasMany(Staff, { foreignKey: 'departmentId' });

// Database synchronization function

const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        
        await sequelize.sync({ alter: true });
        console.log('✅ All tables synchronized successfully.');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

module.exports = {
    sequelize,
    Admin,
    Department,
    Staff,
    syncDB
};


// const { Sequelize } = require('sequelize');
// const Admin = require('./adminModel');
// const Department = require('./departmentModel');
// const Staff = require('./staffModel');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
// });

// const syncDB = async () => {
//     try {
//         await sequelize.sync({ force: false });  // or alter: true if you want to modify the tables
//         console.log('✅ Database synchronized successfully');
//     } catch (error) {
//         console.error('❌ Error syncing database:', error);
//     }
// };

// module.exports = { sequelize, Admin, Department, Staff, syncDB };
