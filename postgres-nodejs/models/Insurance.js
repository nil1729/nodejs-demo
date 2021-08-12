const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Insurance = sequelize.define(
	'Insurance',
	{
		// Model attributes are defined here
		insuranceId: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		insuranceType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		issueDate: { type: DataTypes.DATEONLY },
		endDate: { type: DataTypes.DATEONLY },
		applicationDate: {
			type: DataTypes.DATEONLY,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		timestamps: true,
		modelName: 'insurance',
		tableName: 'insurances',
		underscored: true,
	}
);

module.exports = Insurance;
