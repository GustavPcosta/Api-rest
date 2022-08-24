const yup = require('./config');

const schemaLogin = yup.object().shape({
    nome: yup.string().required(),
    senha:yup.string().required()
});

module.exports = schemaLogin