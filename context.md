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

### Plante du mois, série et forêt

- Chaque mois a sa plante, dont l'espèce dépend du mois (sapin enneigé en janvier, cerisier en avril, palmier en juillet, érable en octobre…). Chaque séance terminée la fait pousser et elle ne régresse jamais : un oubli ralentit seulement sa croissance.
- La série (streak) compte uniquement les jours où une séance est prévue ; les jours de repos ne la cassent pas, la séance du jour non encore faite non plus. Elle continue d'un mois à l'autre.
- La série est un multiplicateur de croissance : chaque séance rapporte ×1 point, ×1,5 dès 3 jours de suite et ×2 dès 7 jours. Un oubli remet le multiplicateur à ×1 sans toucher à la plante.
- La plante reste une graine pendant les 3 premières séances du mois (`SEED_SESSION_COUNT`) et germe à la 4e. Ensuite, le palier dépend des points rapportés au nombre de séances prévues dans le mois (futur compris ; pour le mois de la toute première séance, à partir de celle-ci) : Pousse, Petit arbre (25 %), Jeune arbre (50 %), Arbre (90 %), Grand arbre (130 %), Majestueux (170 %, accessible seulement avec une vraie série). Au plus un palier par séance après la graine, pour que chaque phase soit visible même avec un gros bonus de série.
- Sur l'accueil, la caméra s'approche en plongée tant que la plante du mois est petite (graine, pousse), puis recule à mesure qu'elle grandit pour montrer la forêt.
- En séance, la caméra cadre toute l'île dans la largeur, quelle que soit la taille de la forêt, et l'image est décalée vers le haut pour que l'île reste au-dessus de la carte d'exercice. En portrait, le champ de vision vertical est élargi pour garder au moins 40° à l'horizontale.
- En 3D, chaque phase a sa forme et sa plage de taille : graine propre à l'espèce (gland, noix de coco, pomme de pin, samare, noyau), pousse (cotylédons, aiguilles, brins de palme ou petit cactus), petit arbre au tronc fin, puis l'arbre de l'espèce qui grandit et s'étoffe (branches, feuillage, puis fruits, fleurs ou décorations aux deux derniers paliers). Chaque espèce a son propre modèle et chaque arbre une variante tirée de son mois (le cactus alterne même entre candélabre et figuier de Barbarie).
- À la fin du mois, la plante est plantée dans une île 3D low-poly, au stade atteint (une graine pour un mois à 1-3 séances). Un mois sans aucune séance ne plante rien. La forêt est entièrement recalculée depuis l'historique : rien n'est stocké en plus, et les séances restaurées comptent aussi.
- L'île sert de hero sur l'accueil (orbite lente, rotation au doigt) et de fond pendant la séance et le repos (ambiance crépuscule, la caméra change d'angle à chaque exercice). Des lucioles autour de la plante signalent une série active.
- Au premier passage dans un nouveau mois, l'accueil annonce la plante qui vient de rejoindre la forêt.
- La modale « Ma forêt » affiche les règles, la série actuelle et le record, les jokers consommés, les mois plantés et les 5 meilleures séries.
- Un joker protège un jour d'entraînement oublié : il prolonge la série (donc le multiplicateur) mais ne fait pas pousser la plante, et ne compte pas comme séance effectuée dans les statistiques mensuelles. Poser un joker sur un jour passé peut reconnecter la série et augmenter rétroactivement les points des jours suivants.
- Les jokers sont appliqués manuellement depuis l'historique, jamais automatiquement. Un aperçu indique la nouvelle série et le multiplicateur avant validation.
- Régénération : 1 joker tous les 7 jours, avec un maximum de 2.

### PWA et rappels

- Manifest, favicons et mode `standalone` présents pour l'installation sur l'écran d'accueil.
- Un service worker (`public/sw.js`, enregistré en production uniquement) rend l'app utilisable hors ligne : navigation réseau d'abord avec repli sur la page en cache, fichiers hachés de Vite (dont le chunk three.js) en cache d'abord, illustrations et polices en stale-while-revalidate. Changer `CACHE_VERSION` invalide tous les caches.
- Un mécanisme de notification à 18 h existe si `reminder_enabled` vaut `true` et que la permission navigateur est accordée.
- Limite actuelle : aucun contrôle visible ne permet d'activer ce rappel. Il ne fonctionne que lorsque la page reste ouverte, car le service worker ne gère pas les notifications push.

## Données et persistance

Il n'existe ni API, ni base de données, ni authentification. Les principales clés `localStorage` sont :

- `current_workout_level` : niveau sélectionné ;
- `workout_done_YYYY-MM-DD` : objet d'historique d'une séance terminée ;
- `level_up_suggestion_dismissed_at` : date du dernier report de suggestion de niveau ;
- `viewed_exercise_help_name_list` : exercices dont l'aide a déjà été vue ;
- `streak_protection` : stock de jokers (2 au maximum), dates protégées et record de série ;
- `forest_last_seen_month` : dernier mois (`YYYY-MM`) vu sur l'accueil, pour annoncer une seule fois la plante plantée en début de mois ;
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
- three.js pour la forêt 3D, utilisé sans react-three-fiber et chargé à part avec `import()` pour ne pas retarder le premier affichage.
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
- `app/welcome/welcome.tsx` : composant central ; navigation interne entre accueil, séance, validation, historique et réglages, timers, jokers, statistiques et persistance.
- `app/forest.ts` : logique pure de la série et de la forêt ; un seul parcours chronologique de l'historique (`analyzeHistory`) donne la série, les meilleures séries et les points de croissance par mois, puis `getMonthGrowth`, `getForest` et les espèces par mois.
- `app/forest/forestEngine.ts` : moteur three.js, singleton partagé par tous les écrans (un seul contexte WebGL). Rendu à 30 images/s sur l'accueil, image fixe en séance hors transitions, boucle arrêtée sur les autres écrans ou onglet masqué.
- `app/forest/plantModels.ts` : modèles low-poly procéduraux des plantes (graine, pousse, puis un modèle d'arbre par espèce), déterministes par mois.
- `app/forest/geometryBuilder.ts` : outils de construction communs (primitives colorées par facette, troncs, feuillages, feuilles, fruits).
- `app/forest/islandModel.ts` : île flottante et relief du sol.
- `app/welcome/forestView.tsx` : conteneur React de la scène 3D, avec un dégradé servant de ciel, d'écran de chargement et de repli sans WebGL.
- `app/welcome/monthPlantCard.tsx` : carte de la plante du mois, de la série et de son multiplicateur, et modale « Ma forêt ».
- `app/devForestDemo.ts` : outil de test en `npm run dev` uniquement, exclu du build de production. `/mini-muscu/?demo-foret=48` remplace l'historique local par 48 mois de séances variées (forêt bien remplie, avec des graines et des pousses) et laisse le mois en cours vide, donc sa plante est une graine ; `/mini-muscu/?demo-foret=reset` restaure l'historique sauvegardé avant la première démo.
- `app/workout.ts` : types, programmes des 4 niveaux, catalogue des exercices, images et descriptions.
- `app/workoutHistory.ts` : types et fonctions de lecture de l'historique, niveaux, difficulté, derniers finishers et suggestion de progression.
- `app/restDay.ts` : jour de repos (historique des choix, jour en vigueur à une date) et répartition des séances de la semaine autour de ce jour.
- `app/welcome/workoutPlanPicker.tsx` : sélection du niveau.
- `app/welcome/restDayPicker.tsx` : choix du jour de repos et aperçu de la semaine, affichés dans l'écran Réglages.
- `app/welcome/bottomNavigation.tsx` : barre du bas commune (Aujourd'hui, Historique, Réglages).
- `app/welcome/exerciceModal.tsx` : illustration et explication d'un exercice.
- `app/welcome/monthStratsCard.tsx` : statistiques mensuelles.
- `app/app.css` : Tailwind et styles globaux.
- `public/exercises/` : illustrations des exercices.
- `public/site-v2.webmanifest` : métadonnées PWA (icônes `*-v2`, aussi précachées par `public/sw.js`).
- `public/sw.js` : service worker hors ligne.

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
- Les métadonnées de la route utilisent encore le titre et la description par défaut de React Router.
- Aucun test automatisé n'est présent dans le dépôt à ce jour.

## Intention produit

Le cœur de MiniMuscu est la régularité, pas la complexité : ouvrir l'app, voir quoi faire, terminer une courte séance, conserver une série et constater ses progrès. Toute nouvelle fonctionnalité devrait éviter de transformer l'expérience en outil de fitness lourd ou en réseau social.
