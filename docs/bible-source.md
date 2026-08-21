# Fonte do texto bíblico

- **Tradução:** João Ferreira de Almeida — edição histórica original de 1911.
- **Licença declarada pelo projeto de origem:** domínio público (`Public Domain`).
- **Repositório:** [`BibliaJFAAL/JFAAL`](https://github.com/BibliaJFAAL/JFAAL).
- **Origem permitida:** o arquivo JSON bíblico que está dentro da pasta `original`. As pastas `atualizada` e `atualizado` são explicitamente proibidas.
- **Destino local:** `data/import/almeida-1911-original.json`.
- **Banco gerado:** `assets/bible.db`.

O acesso programático foi tentado pela API, Git e conteúdo bruto do GitHub em 21 de agosto de 2026. O proxy respondeu HTTP 403 antes de fornecer a listagem, portanto não foi possível registrar com segurança o nome interno do artefato nem incorporar seu texto. Consulte o procedimento de download e a compatibilidade com o JSON real em `data/import/README.md`. Depois de colocar o arquivo no destino, basta executar `npm run import:bible` e `npx expo start`.

A geração é transacional e só ocorre depois das validações de 66 livros, 1.189 capítulos, limites canônicos, quantidade plausível de versículos, conteúdo não vazio e unicidade dos IDs. A transformação limita-se a estrutura SQLite/FTS, normalização de busca sem acentos e IDs OSIS determinísticos; não há modernização editorial nem versículos fabricados.
