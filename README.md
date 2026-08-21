# Bíblia Online

Fundação mobile em Expo, React Native e TypeScript. Esta etapa contém apenas navegação e dados demonstrativos locais.

## Executar

```bash
npm install
npm start
```

Depois, abra no Expo Go ou escolha um simulador iOS/Android no terminal do Expo.

## Verificações

```bash
npm run typecheck
npm run lint
```

## Leitor bíblico (Etapa 02)

O núcleo do leitor usa conteúdo original e estritamente demonstrativo. As telas acessam os dados por meio de `BibleRepository`, permitindo trocar a fonte temporária por SQLite ou outra fonte offline sem reconstruir a interface.

Os dados pessoais de leitura (favoritos, grifos, anotações, progresso e histórico) são persistidos separadamente pelo `UserBibleStorage`, sobre AsyncStorage. O conteúdo bíblico não é salvo no AsyncStorage.

## Etapa 03: SQLite e importação verificável
A arquitetura e o importador da Almeida 1911 estão documentados em [`docs/bible-source.md`](docs/bible-source.md). Enquanto o download externo estiver bloqueado, a aplicação identifica claramente o conteúdo demonstrativo e não inventa versículos. Após a importação verificada, o crédito previsto no aplicativo será: **Texto bíblico: João Ferreira de Almeida — edição histórica de 1911 (domínio público).**
