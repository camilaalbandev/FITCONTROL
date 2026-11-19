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

## Executar localmente

1. Crie o banco no Supabase e execute `database/supabase.sql` no SQL Editor.
2. Configure as variáveis de ambiente do backend conforme `backend/.env.example`.
3. Entre na pasta `backend` e execute `mvn spring-boot:run`.
4. Abra `frontend/index.html` com um servidor local. Exemplo: `python -m http.server 5500` dentro de `frontend`.
5. Acesse `http://localhost:5500`.

O frontend espera a variável `API_URL` no arquivo `frontend/config.js`. Para testes locais, use `http://localhost:8080/api`. Em produção, substitua pela URL pública do serviço no Render terminada em `/api`.

## Deploy

### Supabase
Crie um projeto PostgreSQL, execute `database/supabase.sql` no SQL Editor e copie a URI de conexão PostgreSQL no formato JDBC. Use a conexão com pooler em modo Session quando necessário. O backend precisa de `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`.

### Render
Crie um Web Service apontando para este repositório, com Root Directory `backend`. O projeto usa Maven e Java 17. Configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `FRONTEND_URL`. A porta é lida por `PORT`.

### Vercel
Importe o mesmo repositório e defina Root Directory como `frontend`. O arquivo `vercel.json` já direciona as rotas para `index.html`. Depois do deploy, configure `API_URL` em `frontend/config.js` com a URL do Render.

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
