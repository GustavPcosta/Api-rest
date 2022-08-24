const knex = require('../conexao/conexão')


const listarCategoria = async(req,res) =>{
    try {
        const categoria = await knex('categoria').select('*')
        return res.json(categoria.rows)
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }
}
module.exports ={
    listarCategoria
}

