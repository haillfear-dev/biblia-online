# Importação da Almeida 1911

O único arquivo aceito é `data/import/almeida-1911-original.json`, obtido sem
alterações da pasta `original` do repositório **BibliaJFAAL/JFAAL**. A aplicação
atribui a esse artefato controlado a tradução **João Ferreira de Almeida 1911** e
a licença **Public Domain**; esses metadados não precisam existir dentro do JSON.

Execute `npm run import:bible`. O importador entende listas e objetos indexados
numericamente, além das chaves em português `capitulos`, `versiculos` e `texto`.
Ele recusa contagens diferentes de 66 livros, 1.189 capítulos ou fora da faixa
de 30–32 mil versículos, capítulos não canônicos, textos vazios e IDs duplicados.
O conteúdo dos versículos é persistido literalmente, sem modernização.
