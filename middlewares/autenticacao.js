const knex = require('../conexao/conexão');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const filtroAut = async(req,res,next) =>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({mensagem:"Não autorizado"});
    }
    try {
        const token = authorization.replace('Bearer','').trim();

        const {id} = jwt.verify(token,process.env.DB_SENHA);

        const loginUsuario = await knex('usuario').where({id}).first()
        if(!loginUsuario){
            return res.status(401).json("Não autorizado")
        }
        const [usuario] = loginUsuario;
        const {senha_,...dadosUsuario} = usuario;
        req.usuario = dadosUsuario

        next()
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }
}

module.exports = filtroAut;