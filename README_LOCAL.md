# Como rodar o Custom Shop no seu Computador 🚀

Este guia ensina como rodar sua loja profissional diretamente no seu PC usando Docker.

## 📋 Pré-requisitos
Você precisa ter o **Docker** instalado no seu computador:
- [Baixar Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 🚀 Passo a Passo

### 1. Baixe o código
Se você já tem o código no seu PC, abra a pasta no terminal.

### 2. Configure suas chaves (Opcional)
Crie um arquivo chamado `.env` na pasta do projeto e coloque seu token do Mercado Pago:
```env
MP_ACCESS_TOKEN=seu_token_aqui
```

### 3. Ligue o Site
No terminal, dentro da pasta do projeto, digite:
```bash
docker-compose up -d --build
```

### 4. Acesse o Site
Abra o seu navegador e acesse:
👉 **http://localhost:3000**

---

## 🛠️ Comandos Úteis

- **Para desligar o site**: `docker-compose down`
- **Para ver se está tudo certo**: `docker-compose ps`
- **Para ver os logs (erros)**: `docker-compose logs -f`

## 💡 Vantagens de rodar no PC:
- **Total Controle**: O site é seu e roda na sua máquina.
- **Sem Limites**: Não depende de planos da Vercel ou outras nuvens.
- **Segurança**: Seus dados ficam com você.
