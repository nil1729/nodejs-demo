const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Insurance = require('./Insurance');

const CovidInsurance = sequelize.define(
	'CovidInsurance',
	{
		nomineeInfo: {
			type: DataTypes.STRING,
		},
		policyNo: { type: DataTypes.STRING },
	},
	{
		timestamps: true,
		modelName: 'covid_insurance',
		tableName: 'covid_insurances',
		underscored: true,
	}
);

const HealthInsurance = sequelize.define(
	'HealthInsurance',
	{
		nomineeInfo: {
			type: DataTypes.STRING,
		},
		policyNo: { type: DataTypes.STRING },
		healthInsuranceType: { type: DataTypes.STRING, defaultValue: 'Kasper Health' },
	},
	{
		timestamps: true,
		modelName: 'health_insurance',
		tableName: 'health_insurances',
		underscored: true,
	}
);

const GoldInsurance = sequelize.define(
	'GoldInsurance',
	{
		policyNo: { type: DataTypes.STRING },
		gstDetails: { type: DataTypes.STRING },
	},
	{
		timestamps: true,
		modelName: 'gold_insurance',
		tableName: 'gold_insurances',
		underscored: true,
	}
);

GoldInsurance.belongsTo(Insurance, { targetKey: 'insuranceId', foreignKey: 'insuranceId' });
HealthInsurance.belongsTo(Insurance, { targetKey: 'insuranceId', foreignKey: 'insuranceId' });
CovidInsurance.belongsTo(Insurance, { targetKey: 'insuranceId', foreignKey: 'insuranceId' });

module.exports = { GoldInsurance, HealthInsurance, CovidInsurance };
