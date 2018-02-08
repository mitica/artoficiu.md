
const Joi = require('joi');

export const OrderSchema = Joi.object().keys({
    id: Joi.number().required(),
    year: Joi.number().min(2000).max(2100).required(),
    status: Joi.string().required(),
    total: Joi.number().required(),
    customer: Joi.object().keys({
        type: Joi.number().integer().required(),
        name: Joi.string().required(),
        email: Joi.string(),
        telephone: Joi.string(),
        address: Joi.string(),
        idno: Joi.string(),
        VAT: Joi.string(),
        bank: Joi.string(),
        bankCode: Joi.string(),
        bankAccount: Joi.string(),
    }).required(),
    comments: Joi.string(),
    countItems: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
    items: Joi.string().required(),

    createdAt: Joi.date().required(),
    updatedAt: Joi.date()
})
