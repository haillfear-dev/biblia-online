# Formato de importação
Coloque **somente após verificar a proveniência** o arquivo `almeida-1911-original.json` nesta pasta. O objeto raiz deve conter `translation: "João Ferreira de Almeida 1911"`, `license: "Public Domain"` e `books` (66 itens). Cada livro contém `id` OSIS, `name`, `abbreviation`, `testament` (`old`/`new`) e `chapters`; cada capítulo contém `verses`, uma lista ordenada de strings. Execute `npm run import:bible`.

O importador recusa contagens diferentes de 66 livros, 1.189 capítulos ou fora da faixa de 30–32 mil versículos. O arquivo não está incluído porque o acesso à fonte foi bloqueado por HTTP 403; nenhum texto foi fabricado.
