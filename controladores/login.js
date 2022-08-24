
const knex = require('../conexao/conexão');
const schemaLogin = require('../controladores/login');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async(req,res) =>{
    const {email,senha} = req.body;

    try {
        await schemaLogin.validate(req.body);
        const loginUsuario = await knex('usuario').where({email}).first();
        if(!loginUsuario){
            return res.status(400).json('Email ou senha estão incorretos');
        }
        const senhaCorreta = await bcrypt.compare(senha,loginUsuario.senha);
        if(!senhaCorreta){
            return res.status(400).json('Email ou senha estão incorretos');
        }
        const token = jwt.sign({id:loginUsuario.id},process.env.DB_SENHA,{expiresIn:'5h'});
        const {senha_,...dadosUsuario} =loginUsuario;
        return res.status(200).json({
            loginUsuario:dadosUsuario,
            token:token
        })
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }
}

module.exports={
    login
}