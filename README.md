# Portfolio — Jean-Baptiste BEL

Portfolio statique (HTML/CSS/JS vanilla, aucune dépendance npm, aucun build step) présentant un CV sous forme de cyber kill chain. Déployable tel quel sur GitHub Pages.

## Structure

```
index.html                     Page principale (6 sections = 6 étapes de la kill chain)
404.html                       Page 404 personnalisée
assets/
  css/style.css                Tout le style (thème sombre terminal, variables CSS)
  js/
    i18n.js                    Moteur de traduction FR/EN (lit assets/data/i18n.json)
    scrollfx.js                Fade-in au scroll (IntersectionObserver)
    nav.js                     Nav active au scroll, barre de progression, menu mobile
    terminal.js                Effet machine à écrire (progressive enhancement)
    skills.js                  Rendu de la grille de compétences depuis skills.json
    projects.js                Rendu de la grille de projets depuis projects.json
    easter-egg.js               Konami code
    main.js                    Bootstrap de tous les modules
  data/
    i18n.json                  Tous les textes UI, bilingues (clés fr / en)
    skills.json                Compétences (façon dump mémoire / process list)
    projects.json               Projets (cartes de la section "Projets")
  img/                          Favicon, image Open Graph
.github/workflows/deploy.yml    Déploiement automatique sur GitHub Pages
```

## Déploiement sur GitHub Pages

1. Poussez ce dépôt sur GitHub (branche `main`).
2. Dans les paramètres du dépôt : **Settings → Pages → Build and deployment → Source**, choisissez **GitHub Actions**.
3. Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement à chaque push sur `main` et publie le contenu du dépôt tel quel (aucune étape de build, c'est un site 100 % statique).
4. Le site est disponible à l'URL `https://<votre-compte>.github.io/<nom-du-repo>/` (ou votre domaine personnalisé si configuré).

Vous pouvez aussi déclencher le déploiement manuellement depuis l'onglet **Actions** du dépôt (`workflow_dispatch`).

### Remplacer l'image Open Graph

`assets/img/og-cover.svg` est un aperçu généré simplement en SVG. Pour un meilleur rendu sur les réseaux sociaux (LinkedIn, Twitter/X, etc. rendent mal le SVG en `og:image`), remplacez-le par un vrai PNG/JPG 1200×630 et mettez à jour la balise `<meta property="og:image">` dans `index.html`.

## Ajouter un projet dans `assets/data/projects.json`

Le fichier est un tableau d'objets. Ajoutez une entrée avec ce schéma :

```json
{
  "id": "mon-projet",
  "title": { "fr": "Titre en français", "en": "Title in English" },
  "description": { "fr": "Description courte.", "en": "Short description." },
  "tags": ["Python", "Docker"],
  "github": "https://github.com/s0seche/mon-projet",
  "demo": "https://mon-projet-demo.example.com",
  "status": "live"
}
```

- `demo` peut être une chaîne vide `""` si aucune démo n'est disponible (le lien ne s'affichera pas).
- `status: "placeholder"` affiche un badge « Contenu à venir / Coming soon » sous la carte ; utilisez `"live"` (ou toute autre valeur) une fois le projet publié pour masquer ce badge.
- Aucune autre modification n'est nécessaire : `assets/js/projects.js` lit ce fichier au chargement et régénère la grille automatiquement, y compris lors du changement de langue.

## Ajouter une compétence dans `assets/data/skills.json`

`skills.json` modélise chaque domaine de compétence comme un « processus parent », et chaque sous-compétence comme un « processus enfant » (clin d'œil au thème forensique de la section). Structure d'un domaine :

```json
{
  "id": "mon-domaine",
  "pid": 1043,
  "ppid": 1,
  "start": "09:12:44",
  "state": "R",
  "name": { "fr": "Nom du domaine", "en": "Domain name" },
  "description": { "fr": "Description courte.", "en": "Short description." },
  "children": [
    { "pid": 1044, "start": "09:12:45", "state": "S", "name": { "fr": "Sous-compétence", "en": "Sub-skill" } }
  ]
}
```

- `pid` doit être unique dans tout le fichier ; les enfants n'ont pas besoin de champ `ppid` explicite (ils héritent visuellement du domaine parent dans l'affichage).
- Pour ajouter une simple sous-compétence à un domaine existant, ajoutez un objet dans le tableau `children` du domaine concerné avec un nouveau `pid` unique.
- Si vous ajoutez un nouveau domaine, pensez à aussi l'ajouter (mêmes valeurs `pid`/`name`) dans le tableau statique affiché par la commande `volatility` de la section Compétences dans `index.html` (bloc `<pre id="pslistOutput">`), qui est écrit à la main pour rester lisible sans JavaScript.
- `assets/js/skills.js` s'occupe du reste : rendu des cartes, panneau de détail « dump mémoire », traduction.

## Traductions (`assets/data/i18n.json`)

Toutes les chaînes d'interface (nav, boutons, intitulés de section, contenu de formation/expérience/contact) vivent dans `assets/data/i18n.json` sous deux clés racines `fr` et `en`. Le HTML porte des attributs `data-i18n="chemin.de.la.cle"` (ou `data-i18n-aria` pour les `aria-label`) que `assets/js/i18n.js` résout au chargement et à chaque changement de langue. Les commandes et sorties de terminal (fictives) sont volontairement identiques dans les deux langues et ne passent donc pas par ce mécanisme.

La langue choisie est mémorisée dans `localStorage` ; à la première visite, la langue du navigateur est détectée automatiquement (`en*` → anglais, sinon français).

## Accessibilité & performance

- Contenu 100 % lisible sans JavaScript : le HTML contient déjà le texte réel (en français) ; JS n'ajoute que la traduction dynamique, l'effet machine à écrire et les animations d'apparition (`prefers-reduced-motion` désactive ces dernières).
- Navigation clavier complète, focus visible, `aria-label`/`aria-current`/`role="dialog"` sur les éléments interactifs (menu mobile, panneau de détail compétence, easter egg).
- Aucune dépendance lourde : uniquement les polices Google Fonts (JetBrains Mono, Inter) via CDN et du JS vanilla.

## Easter egg

Konami code (`↑ ↑ ↓ ↓ ← → ← → b a`) : affiche un faux `cat /root/flag.txt`.
