// Ce fichier est régénéré par le pipeline CI/CD (voir .github/workflows/ci-cd.yml)
// juste avant le build de production : l'URL réelle du backend est interrogée
// dynamiquement sur Azure via `az webapp show` puis injectée ici.
// La valeur ci-dessous n'est qu'un garde-fou si le build est lancé sans passer par la CI.
export const environment = {
  production: true,
  apiUrl: '/api'
};
