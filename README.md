# Motor Schema AI

Sistema em React + Next.js para pesquisar esquemas de montagem de motores diesel por marca, modelo, código do motor e chassi/VIN.

## Recursos entregues

- Busca inteligente por marca e motor
- Botão Gerar por IA com suporte a Gemini
- Consumo de APIs públicas para enriquecer a consulta
- Geração automática de imagem JPG com esquema técnico
- Histórico de pesquisas com suporte a MongoDB Atlas
- Estrutura preparada para deploy na Vercel e versionamento no GitHub

## Executar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 no navegador.

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env.local
```

Depois preencha os dados do MongoDB Atlas. Se quiser IA externa real, adicione também a variável GEMINI_API_KEY.

## Publicação

### GitHub

```bash
git add .
git commit -m "feat: motor schema ai"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

### Vercel

```bash
vercel
vercel --prod
```

### MongoDB Atlas

1. Criar cluster
2. Liberar acesso de rede
3. Adicionar MONGODB_URI e MONGODB_DB
