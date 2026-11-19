# FITCONTROL

Sistema de gestão de academia com backend Java 17 + Spring Boot, frontend HTML/CSS/JavaScript e PostgreSQL no Supabase.

## Estrutura

- `backend/`: API REST em Java, Spring Boot, JPA e Maven.
- `frontend/`: interface web responsiva em HTML, CSS e JavaScript puro.
- `database/supabase.sql`: script SQL para criar as tabelas no Supabase.
- `render.yaml`: configuração inicial de deploy no Render.

## Requisitos

- Java 17+
- Maven 3.9+
- Conta no Supabase
- Conta no Render
- Conta no Vercel

## Funcionalidades

- Dashboard com indicadores.
- CRUD de alunos.
- CRUD de professores.
- CRUD de planos.
- CRUD de pagamentos.
- Busca e filtros básicos.
- Herança Java: `Aluno` e `Professor` herdam de `Pessoa`.
- Encapsulamento com atributos privados.
- Polimorfismo com sobrescrita de `getTipo()`.

## Observações

Este projeto é uma base acadêmica funcional. Antes de uso comercial real, implemente autenticação e autorização, validações adicionais, auditoria, política de privacidade e controles de segurança. Não exponha credenciais do banco no frontend.
