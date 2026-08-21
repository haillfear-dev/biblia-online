# Google OAuth com Supabase

1. Crie um projeto no Supabase e copie a URL e a chave **anon** para um arquivo
   `.env` local, usando `.env.example` como modelo. Nunca use a `service_role` no app.
2. No Google Cloud Console, configure a tela de consentimento e crie o cliente
   OAuth solicitado pelo painel do Supabase. Não há client ID fixo no código.
3. Ative Google em **Supabase > Authentication > Providers** e informe as
   credenciais do Google. Cadastre no Google a callback exibida pelo Supabase
   (`https://<project-ref>.supabase.co/auth/v1/callback`).
4. Em **Authentication > URL Configuration > Redirect URLs**, permita
   `bibliaonline://auth/callback`. O scheme `bibliaonline` está em `app.json` e
   funciona para builds iOS e Android. Para Expo Go, inclua também a URL gerada
   por `makeRedirectUri` no ambiente de desenvolvimento.

O app usa OAuth PKCE, abre a sessão do sistema com `expo-web-browser`, troca o
`code` retornado por uma sessão Supabase e persiste a sessão no AsyncStorage.
Favoritos, grifos, notas e histórico continuam exclusivamente locais nesta etapa.
