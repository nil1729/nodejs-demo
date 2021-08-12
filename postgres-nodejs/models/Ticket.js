const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Insurance = require('./Insurance');

const Ticket = sequelize.define(
	'Ticket',
	{
		ticketId: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		status: { type: DataTypes.STRING, defaultValue: 'submitted' },
		comments: { type: DataTypes.TEXT },
	},
	{
		timestamps: true,
		modelName: 'ticket',
		tableName: 'tickets',
		underscored: true,
	}
);

Ticket.belongsTo(Insurance, { targetKey: 'insuranceId', foreignKey: 'insuranceId' });

module.exports = Ticket;
