# Contexte du projet MiniMuscu

> Note de contexte destinée à un LLM qui doit comprendre, maintenir ou faire évoluer ce projet. Le code reste la source de vérité si cette note et l'implémentation divergent.

## Résumé rapide

MiniMuscu est une petite application web mobile-first de musculation au poids du corps. Elle propose chaque jour une séance courte d'environ 15 minutes, sans compte utilisateur, sans backend et sans matériel. L'utilisateur choisit son niveau, suit les exercices dans un mode séance guidé, enregistre son ressenti et sa performance finale, puis suit sa régularité dans un historique local.

L'application est une SPA/PWA en français. Toutes les données utilisateur sont conservées dans le navigateur avec `localStorage`.

## Fonctionnalités principales

### Séance du jour

- Affiche la date, le nom de la séance, le nombre de circuits et la liste des exercices.
- Planning hebdomadaire sur 6 jours d'entraînement et 1 jour de repos, le jeudi par défaut.
- Le jour de repos se choisit dans l'écran « Réglages ». Les séances S1 à S6 sont placées dans l'ordre sur les autres jours, en commençant lundi : avec jeudi, Lun S1, Mar S2, Mer S3, Ven S4, Sam S5, Dim S6.
- Un changement de jour de repos s'applique à partir de la journée sportive en cours. Les jours passés gardent le repos qui était en vigueur à leur date, donc l'historique, la streak et les statistiques ne changent pas.
- La journée sportive change à 6 h : avant 6 h, l'application considère encore que l'on est la veille.
- Une séance contient généralement 2 circuits, ou 3 pour la séance S6, puis un finisher.
- Une séance déjà validée est marquée « Fait » et ne peut plus être relancée depuis l'accueil.

### Quatre niveaux d'entraînement

- `base` — Base 🌱
- `entraine` — Entraîné 💪
- `bien_entraine` — Bien entraîné 🔥
- `sportif_haut_niveau` — Sportif haut niveau ⚡

Les jours et les thèmes restent identiques entre les niveaux, mais les variantes d'exercices, répétitions, durées, tempos et pauses deviennent progressivement plus exigeants. Le niveau choisi est modifiable depuis l'accueil et persiste localement.

### Mode séance guidé

- Affiche un exercice à la fois avec la progression dans le circuit.
- Bouton « Suivant » pour avancer dans la séance.
- Minuteur décroissant pour les exercices chronométrés.
- Repos automatique de 30 secondes entre deux circuits, avec possibilité de le passer.
- Après le dernier circuit, passage au finisher.
- Le finisher demande une performance obligatoire : nombre de répétitions/tours ou durée chronométrée.
- La dernière performance connue sur le même finisher est affichée pour donner un repère.
- Après la séance, l'utilisateur note la difficulté de 1 à 5 : très facile, facile, bien dosée, difficile ou trop difficile.

### Aide pour les exercices

- Chaque exercice peut ouvrir une modale avec une illustration et des consignes détaillées.
- Un point bleu signale une aide qui n'a encore jamais été consultée.
- La liste des aides déjà vues est mémorisée localement.
- Les images sont stockées dans `public/exercises/` et leurs correspondances/explications dans `app/workout.ts`.

### Progression automatique suggérée

- Si les 3 dernières séances réalisées au niveau actuel ont toutes une difficulté de 1 ou 2, l'application propose de passer au niveau supérieur.
- L'utilisateur peut accepter ou choisir « Plus tard ».
- Un refus masque la suggestion pendant 7 jours.
- Aucune suggestion n'est affichée au niveau maximal.

### Historique et statistiques

- Calendrier mensuel navigable.
- Codes visuels : séance faite, oubliée, protégée par un joker, jour de repos ou jour futur.
- Chaque séance terminée affiche aussi l'emoji du niveau et celui de la difficulté déclarée.
- Statistiques mensuelles : séances réalisées/prévues, pourcentage de réussite, jour de la semaine le plus souvent oublié et comparaison avec le mois précédent.
- La séance du jour non encore réalisée n'est pas comptée comme un échec.
- Une séance oubliée peut être restaurée manuellement par 4 appuis rapides sur sa date ; elle est alors enregistrée avec une difficulté neutre de 3 et sans résultat de finisher.

### Streaks et jokers

- La streak compte uniquement les jours où une séance est prévue ; les jours de repos ne la cassent pas.
- Affichage de la streak actuelle, du record et des 5 meilleures séries.
- Plusieurs paliers visuels existent, de « Graine » à « Démon de la routine ».
- Un joker protège un jour d'entraînement oublié et peut reconnecter une streak.
- Les jokers sont appliqués manuellement depuis l'historique, jamais automatiquement.
- Un aperçu indique l'effet du joker avant validation.
- Régénération : 1 joker tous les 7 jours, avec un maximum de 4.
- Un jour protégé compte dans la streak, mais pas comme séance réellement effectuée dans les statistiques mensuelles.

### PWA et rappels

- Manifest, favicons et mode `standalone` présents pour l'installation sur l'écran d'accueil.
- Un mécanisme de notification à 18 h existe si `reminder_enabled` vaut `true` et que la permission navigateur est accordée.
- Limite actuelle : aucun contrôle visible ne permet d'activer ce rappel. Il ne fonctionne que lorsque la page reste ouverte, car aucun service worker de notification n'est présent.

## Données et persistance

Il n'existe ni API, ni base de données, ni authentification. Les principales clés `localStorage` sont :

- `current_workout_level` : niveau sélectionné ;
- `workout_done_YYYY-MM-DD` : objet d'historique d'une séance terminée ;
- `level_up_suggestion_dismissed_at` : date du dernier report de suggestion de niveau ;
- `viewed_exercise_help_name_list` : exercices dont l'aide a déjà été vue ;
- `streak_protection` : stock de jokers, dates protégées et record de streak ;
- `reminder_enabled` : état du rappel, bien qu'il n'y ait pas encore d'interface visible pour le modifier ;
- `rest_day_schedule` : historique des jours de repos choisis, sous la forme `[{ startDateKey: "YYYY-MM-DD", restDay }]`, où `restDay` suit `Date.getDay()` (0 = dimanche). Sans entrée, le repos est le jeudi (4) ;
- `selected_workout_plan` : ancienne clé uniquement utilisée pour migrer les anciens niveaux, notamment `debutant` vers `base`.

Une entrée moderne de séance contient : la clé de date, le statut terminé, le niveau utilisé, la difficulté choisie, le nom de la séance, l'heure de validation et éventuellement le résultat du finisher. L'ancien format booléen `"true"` est encore reconnu comme séance terminée, sans détails associés.

Conséquence importante : vider les données du navigateur, changer de navigateur/appareil ou désinstaller sans sauvegarde fait perdre l'historique. Il n'y a aucune synchronisation cloud.

## Architecture technique

- React 19 + TypeScript.
- React Router 7 en mode SPA (`ssr: false`).
- Vite 8.
- Tailwind CSS 4.
- Dépendances npm minimales, sans bibliothèque d'état globale ni bibliothèque de composants.
- Base URL et `basename` : `/mini-muscu`.
- Dockerfile multi-stage avec Node 20 Alpine.
- Interface mobile-first, largeur principale limitée à `max-w-md`.

Commandes utiles :

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run start
```

## Organisation des fichiers

- `app/routes/home.tsx` : route unique, affiche l'application principale.
- `app/welcome/welcome.tsx` : composant central ; navigation interne entre accueil, séance, validation, historique et réglages, timers, streaks, jokers, statistiques et persistance.
- `app/workout.ts` : types, programmes des 4 niveaux, catalogue des exercices, images et descriptions.
- `app/workoutHistory.ts` : types et fonctions de lecture de l'historique, niveaux, difficulté, derniers finishers et suggestion de progression.
- `app/restDay.ts` : jour de repos (historique des choix, jour en vigueur à une date) et répartition des séances de la semaine autour de ce jour.
- `app/welcome/workoutPlanPicker.tsx` : sélection du niveau.
- `app/welcome/restDayPicker.tsx` : choix du jour de repos et aperçu de la semaine, affichés dans l'écran Réglages.
- `app/welcome/bottomNavigation.tsx` : barre du bas commune (Aujourd'hui, Historique, Réglages).
- `app/welcome/exerciceModal.tsx` : illustration et explication d'un exercice.
- `app/welcome/streakCard.tsx` : streak actuelle, paliers et records.
- `app/welcome/monthStratsCard.tsx` : statistiques mensuelles.
- `app/app.css` : Tailwind et styles globaux.
- `public/exercises/` : illustrations des exercices.
- `public/site.webmanifest` : métadonnées PWA.

## Parcours utilisateur type

1. L'utilisateur ouvre l'app et choisit éventuellement son niveau.
2. Il consulte la séance prévue et les fiches d'aide des exercices.
3. Il lance la séance et avance exercice par exercice.
4. Il réalise les circuits, avec 30 secondes de repos entre eux.
5. Il saisit ou chronomètre son résultat de finisher.
6. Il évalue la difficulté, puis valide la séance.
7. L'historique, les statistiques, la streak et une éventuelle suggestion de niveau sont recalculés depuis les données locales.

## Contraintes et points d'attention pour les évolutions

- Conserver une expérience très simple, rapide, sans compte et pensée d'abord pour mobile.
- Ne pas supposer l'existence d'un serveur ou d'une synchronisation distante.
- `welcome.tsx` concentre actuellement beaucoup de responsabilités ; une évolution importante peut justifier de séparer logique métier, stockage et écrans.
- Les minuteurs d'exercices interprètent la première valeur numérique d'un texte comme `40s/jambe` : ils chronomètrent donc 40 secondes au total et ne gèrent pas automatiquement chaque côté.
- Dans `workout.ts`, les séances n'ont pas de jour fixe : c'est leur ordre dans `weekly_plan` qui compte. Le jour de chaque séance est calculé par `getPlannedWorkoutForDay` dans `restDay.ts`.
- Le manifest référence ses icônes depuis la racine (`/web-app-manifest-...`) alors que l'application est servie sous `/mini-muscu`; vérifier ce point lors d'un travail sur l'installation PWA.
- La balise `<html>` est actuellement en `lang="en"` alors que toute l'interface est en français.
- Les métadonnées de la route utilisent encore le titre et la description par défaut de React Router.
- Aucun test automatisé n'est présent dans le dépôt à ce jour.

## Intention produit

Le cœur de MiniMuscu est la régularité, pas la complexité : ouvrir l'app, voir quoi faire, terminer une courte séance, conserver une série et constater ses progrès. Toute nouvelle fonctionnalité devrait éviter de transformer l'expérience en outil de fitness lourd ou en réseau social.
