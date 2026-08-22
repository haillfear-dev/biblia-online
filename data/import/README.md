# Importação da Almeida 1911 original

1. No repositório público [`BibliaJFAAL/JFAAL`](https://github.com/BibliaJFAAL/JFAAL), abra a pasta **`original`** (não use `atualizada` nem `atualizado`).
2. Baixe o arquivo JSON bíblico contido nessa pasta e salve-o localmente com o nome exato **`data/import/almeida-1911-original.json`**.
3. Execute `npm run import:bible`. O banco validado será escrito em `assets/bible.db`.

O importador aceita diretamente as representações usadas pelo projeto de origem: lista de livros ou objeto com `books`; capítulos e versículos podem ser listas, objetos com chaves numéricas, ou campos em português (`capitulos`, `versiculos`, `texto`). A ordem do cânon é convertida em OSIS e os IDs preservam o formato `alm1911-JHN-3-16`.

Antes de escrever o banco, o comando exige exatamente 66 livros e 1.189 capítulos, confere o limite canônico de cada livro, exige entre 30.001 e 31.999 versículos, rejeita textos vazios e IDs duplicados. O texto não é corrigido, modernizado ou completado.

> O proxy do ambiente de automação respondeu HTTP 403 para GitHub, `raw.githubusercontent.com` e CDNs em 21 de agosto de 2026. Por isso o arquivo protegido por proveniência não foi inventado nem versionado nesta correção. O README do JFAAL identifica a edição-base de 1911 e o conteúdo de `original` como domínio público.
