const express = require('express');
const { listarCategoria } = require('./controladores/categoria');
const { login } = require('./controladores/login');
const { listarTransacao, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, obterExtrato } = require('./controladores/transacao');
const { cadastrarUsuario, obterUsuario, atualizarUsuario } = require('./controladores/usuario');
const filtroAut = require('./middlewares/autenticacao');
const rotas = express('');


rotas.post('/usuario',cadastrarUsuario);
rotas.post('/login'/login);

rotas.use(filtroAut);
rotas.get('/usuario',obterUsuario);
rotas.put('/usuario/:id',atualizarUsuario);
rotas.get('/categoria',listarCategoria);

rotas.get('/transacao',listarTransacao);
rotas.get('/transacao/extrato',obterExtrato)
rotas.get('/transacao/:id',detalharTransacao);
rotas.post('/transacao',cadastrarTransacao);
rotas.put('/transacao/:id',atualizarTransacao);
rotas.delete('/transaco/:id',excluirTransacao);






module.exports = rotas;