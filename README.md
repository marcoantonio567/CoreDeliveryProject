# ConstruirJuntos

ConstruirJuntos e uma aplicacao web voltada para solidariedade habitacional. A plataforma conecta pessoas que precisam de melhorias em suas moradias com voluntarios, doadores de materiais, apoiadores financeiros e administradores responsaveis pela moderacao dos projetos.

O sistema foi desenvolvido com React, TypeScript, TanStack Router, Vite e Supabase, oferecendo uma experiencia moderna para cadastro, busca, acompanhamento e apoio a projetos sociais relacionados a moradia digna.

## O que e a aplicacao

A aplicacao funciona como uma ponte entre comunidades vulneraveis e pessoas dispostas a ajudar. Por meio dela, usuarios podem cadastrar projetos de melhoria habitacional, divulgar necessidades, doar materiais de construcao, solicitar apoio, acompanhar projetos em andamento e registrar participacoes voluntarias.

Entre os exemplos de uso estao reformas simples, reparos estruturais, melhorias em telhados, ajustes de seguranca, apoio com mao de obra, transporte de materiais e arrecadacao para necessidades especificas.

## Objetivo

O principal objetivo do ConstruirJuntos e facilitar o acesso a moradia mais segura, digna e adequada por meio da colaboracao comunitaria.

A plataforma busca:

- Aproximar pessoas em situacao de vulnerabilidade de voluntarios e doadores.
- Organizar projetos habitacionais de forma transparente.
- Facilitar a doacao de materiais de construcao que poderiam ficar parados ou ser descartados.
- Incentivar profissionais e voluntarios a contribuirem com tempo, conhecimento e mao de obra.
- Permitir que administradores acompanhem, aprovem e moderem projetos e doacoes.
- Valorizar a participacao social por meio de certificados e acompanhamento de impacto.

## Impacto na sociedade

O impacto social da aplicacao esta ligado diretamente a melhoria das condicoes de moradia e ao fortalecimento da solidariedade local.

Ao centralizar projetos, materiais e voluntarios em um unico ambiente, o ConstruirJuntos ajuda a reduzir desperdicios, direcionar recursos para quem realmente precisa e transformar pequenas contribuicoes individuais em resultados concretos para familias e comunidades.

A plataforma tambem promove cidadania, colaboracao e responsabilidade social. Ela permite que pessoas comuns, profissionais da construcao, arquitetos, engenheiros, empresas e doadores participem ativamente da construcao de uma sociedade mais justa, onde a moradia digna deixa de ser apenas uma necessidade individual e passa a ser uma causa coletiva.

## Principais funcionalidades

- Cadastro e login de usuarios.
- Perfil do usuario com dados pessoais, profissionais e de contato.
- Cadastro de projetos de melhoria habitacional.
- Listagem e busca de projetos aprovados.
- Cadastro e listagem de materiais disponiveis para doacao.
- Solicitudes de materiais, frete, doacao e apoio a projetos.
- Solicitudes de voluntariado em projetos ativos.
- Painel do usuario com estatisticas de participacao.
- Painel administrativo para aprovar projetos e materiais.
- Moderacao de denuncias e controle de status.
- Registro de doacoes e despesas.
- Emissao de certificados para voluntarios em projetos concluidos.
- Upload de imagens para projetos e materiais.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Supabase
- Tailwind CSS
- Radix UI
- Lucide React

## Como rodar o projeto

### Pre-requisitos

- Node.js instalado
- NPM instalado
- Projeto Supabase configurado

### Instalacao

```bash
npm install
```

### Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_do_supabase
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Gerar build de producao

```bash
npm run build
```

### Visualizar build

```bash
npm run preview
```

## Estrutura geral

```text
src/
  components/       Componentes reutilizaveis da interface
  components/ui/    Componentes base de UI
  integrations/     Integracao com Supabase
  lib/              Utilitarios, autenticacao e upload
  routes/           Paginas e rotas da aplicacao
supabase/
  migrations/       Estrutura inicial do banco de dados
```

## Publico-alvo

A aplicacao e destinada a:

- Familias e comunidades que precisam de melhorias habitacionais.
- Voluntarios interessados em apoiar causas sociais.
- Profissionais da area de construcao, arquitetura e engenharia.
- Pessoas ou empresas com materiais disponiveis para doacao.
- Organizacoes sociais que atuam com moradia, assistencia comunitaria e desenvolvimento urbano.

## Conclusao

O ConstruirJuntos mostra como a tecnologia pode ser usada para organizar solidariedade, facilitar conexoes e gerar impacto social real. Mais do que uma plataforma de cadastro de projetos, a aplicacao representa uma forma de transformar recursos, tempo e conhecimento em moradias melhores e vidas mais dignas.
