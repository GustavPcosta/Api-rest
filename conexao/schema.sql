Create database dindin;

create table usuario(
    id serial primary key,
    nome text not null unique,
    senha text not null
)

create table categoria(
    id serial primary key,
    descricao text
);

create table transacao(
    id serial primary key,
    tipo text not null,
    descricao text,
    valor integer not null,
    data timestamp not null,
    usuario_id integer not null,
    categoria_id integer not null,
    foreign key (usuario_id) references usuario(id);
    foreign key (categoria_id) references categoria(id)
)

insert into categoria(descricao) values
('alimentação'),
('assinaturas'),
('casa'),
('mercado'),
('cuidados pessoais'),
('educação')