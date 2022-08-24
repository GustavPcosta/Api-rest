const schemaUsuario = require('../validacao/verificarUsuario');
const knex = require('../conexao/conexão');
const bcrypt = require('bcrypt')

const cadastrarUsuario = async(req,res) =>{
    const {nome,email,senha} = req.body;
    try {
        await schemaUsuario.validate(req.body);
        const verificarEmail = await knex('usuario').where({email}).first();
        if(verificarEmail){
            return res.status(400).json('O email já está cadastrado')
        }
        const senhaCriptgrafada = await bcrypt.hash(senha,10);
        const cadastrarUser = await knex('usuario').insert({nome,email,senhaCriptgrafada}).returning('*');
        if(cadastrarUser >=0){
            return res.status(400).json('Não foi possível cadastrar o usuário ')
        }
        const {senha:_,...cadastro} = cadastrarUser.rows[0]
        return res.status(201).json(cadastro)
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }

}
const obterUsuario = async(req,res) =>{
    return res.json(req.usuario);
}

const atualizarUsuario = async(req,res) =>{
    const {usuario} = req.usuario;
    const {nome,email,senha} = req.body;

    try {
        await schemaUsuario.validate(req.body);
        const usuarioEncontrado = await knex('usuario').where({email}).first();
        if(usuario.rowCount > 0 && usuarioEncontrado.row[0].id !== usuario.id){
            return res.status(400).json('O email já está cadastrado')
        }
        const senhaCriptgrafada = await bcrypt.hash(senha,10);
        const atualizarUsuario = await knex('usuario').update({nome,email,senhaCriptgrafada}).where({usuario});
        if(atualizarUsuario <=0){
            return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
        }
        return res.status(204).send()
    } catch (error) {
          return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }
}

module.exports ={
    cadastrarUsuario,
    obterUsuario,
    atualizarUsuario
}