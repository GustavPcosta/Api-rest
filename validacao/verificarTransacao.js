const yup = require('./config');

const schemaTransacao = yup.object().shape({
    descricao: yup.string().required(),
    valor: yup.string().required(),
    data: yup.string().required(),
    categoria_id: yup.string().required(),
    tipo: yup.string().required()
})

module.exports ={
    schemaTransacao
}