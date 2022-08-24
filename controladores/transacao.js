const knex = require("../conexao/conexão");
const schemaTransacao = require('../validacao/verificarTransacao');

const listarTransacao = async(req,res) =>{
    const {usuario} = req;
    const{id} = req.params

    
    try {
        const filtrarTransacao = await knex('transacao').where('id','ilike',`%${id}%`);
        if(!filtrarTransacao){
            return res.status(400).json('A transação não existe')
        }

       const transacoes = await knex('transacao').select('*').where([usuario.id])
       if(!transacoes){
        return res.status(400).json('A transação não existe')
       }
      return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`})
    }
}

const detalharTransacao = async(req,res) =>{
    const {usuario} = req;
    const {id} = req.params;
    try {
        const transacoes = await knex('transacao').select('*').where({usuario,id}).first();
        if(transacoes.rowCount <=0){
            return res.status(404).json('A transação não foi encontrada')
        }
        return res.status(200).json(transacoes);
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
    }
}
const cadastrarTransacao = async(req,res) =>{
    const {usuario} = req;
    const {descricao,valor,data,categoria_id,tipo} = req.body

    try {
        await schemaTransacao.validate(req.body);

        if(tipo !== 'entrada' && tipo !== 'saída'){
            return res.status(400).json('O tipo tem que ser entrada ou saída')
        }
        const categoria = await knex('categoria').select('*').where({categoria_id,usuario});
        if(!categoria.rowCount <=0){
            return res.status(400).json('A categoria não existe')
        }
        const cadastroTransacao = await knex('transacoes').insert({descricao,valor,data,categoria_id,tipo,usuario_id}).returning('*');
        if(cadastroTransacao<=0){
            return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
        }
        const [transacao] = rows;
        transacao.categoria_nome = categoria.rows[0].descricao;

        return res.status(201).json(transacao);
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
    }
}
const atualizarTransacao = async(req,res) =>{
    const {usuario} = req;
    const {descricao,valor,data,categoria_id,tipo} = req.body
    const {id} = req.params

    try {
        await schemaTransacao.validate(req.body);
        if(tipo !== 'entrada' && tipo !== 'saída'){
            return res.status(400).json('O tipo tem que ser entrada ou saída')
        }
        const categoria = await knex('categoria').select('*').where({categoria_id,usuario});
        if(!categoria.rowCount <=0){
            return res.status(400).json('A categoria não existe')
        }
        const transacao = await knex('transacao').select('*').where({usuario,categoria_id});
        if(transacao.rowCount <=0){
            return res.status(400).json('A transacao não existe')
        }
        const atualizarTransacao = await knex('transacoes').update({descricao,valor,data,categoria_id,tipo,usuario_id}).where({id})
        if(atualizarTransacao<=0){
            return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
    }
}
const excluirTransacao = async (req,res) =>{
    const {usuario} = req;
    const {id} = req.params

    try {
        const transacao = await knex('transacao').select('*').where({usuario,categoria_id});
        if(transacao.rowCount <=0){
            return res.status(400).json('A transacao não existe');
        }
        const deleteTransacao = await knex('transacao').delete('*').where({id});
        if(deleteTransacao <=0){
            return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
        }
        return res.status(200).send();
    } catch (error) {
        
    }
}
const obterExtrato = async(req,res) =>{
        const {usuario} = req;

        try {
            if(transacao.rowCount <=0){
                return res.status(400).json('A transacao não existe');
            }
            const transacaoExtrato = await knex('transacao').select('*').sum('valor').where({usuario_id});
            const saldo = await(transacaoExtrato,[usuario.id,'entrada'])
            const saida = await(transacaoExtrato,[usuario.id,'saida'])

            return res.json({
                entrada:Number(saldo.rows[0].valor) ?? 0,
                saida:Number(saida.rows[0].valor) ?? 0
            })
           
        } catch (error) {
            return res.status(500).json({mensagem:`Error interno: ${error.mensage}`});
     }
}

 module.exports ={
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}