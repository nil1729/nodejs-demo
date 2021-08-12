const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define(
	'Employee',
	{
		// Model attributes are defined here
		employeeId: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		name: { type: DataTypes.STRING, allowNull: false },
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: { type: DataTypes.STRING, allowNull: false },
	},
	{
		timestamps: true,
		modelName: 'employee',
		tableName: 'employees',
		underscored: true,
	}
);

module.exports = Employee;
