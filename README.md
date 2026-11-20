# recon · Portfolio cyber kill chain

Portfolio d'ingénieur SSI présenté comme une **cyber kill chain** : chaque section du parcours est une étape d'une attaque, chaque contenu une sortie de terminal.

**Site :** https://s0seche.github.io/recon/
**Writeups DFIR & CTF :** https://s0seche.github.io/

## Le parcours en 6 étapes

| Étape | Section | Commande affichée |
|---|---|---|
| 01 · Reconnaissance | Profil | `whoami` / `id` |
| 02 · Weaponization | Compétences | `volatility … pslist` (compétences en processus) |
| 03 · Delivery | Formation | `ls -la /certs/` |
| 04 · Exploitation | Expériences | `gobuster dir …` |
| 05 · Command & Control | Projets | `git log --oneline` |
| 06 · Actions sur objectifs | Contact | `nc -lvnp 4444` |

## Points techniques

- **Zéro dépendance** : HTML, CSS et JavaScript vanilla, sans framework ni étape de build.
- **Bilingue FR / EN** : tous les textes sont dans `assets/data/i18n.json`, la langue du navigateur est détectée à la première visite.
- **Lisible sans JavaScript** : le HTML contient le vrai contenu ; le JS n'ajoute que la traduction, l'effet machine à écrire et les animations.
- **Accessible** : navigation clavier, focus visible, attributs ARIA, respect de `prefers-reduced-motion`.
- **Déploiement continu** : chaque push sur `main` publie le site sur GitHub Pages via GitHub Actions.

## Structure

```
index.html                  Page principale (les 6 étapes)
404.html                    Page 404 personnalisée
assets/
  css/style.css             Thème terminal sombre
  js/                       Traduction, navigation, effet terminal, rendus
  data/
    i18n.json               Textes FR / EN
    skills.json             Compétences (processus parents / enfants)
    projects.json           Cartes de la section Projets
  img/                      Favicon, image Open Graph
.github/workflows/deploy.yml
```
