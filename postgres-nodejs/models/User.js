const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Insurance = require('./Insurance');

const User = sequelize.define(
	'User',
	{
		// Model attributes are defined here
		userId: {
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
		phoneNumber: { type: DataTypes.STRING, allowNull: false },
	},
	{
		timestamps: true,
		modelName: 'user',
		tableName: 'users',
		underscored: true,
	}
);

User.hasMany(Insurance, { as: 'insurances', foreignKey: 'userId' });
Insurance.belongsTo(User, { targetKey: 'userId', foreignKey: 'userId' });

module.exports = User;
