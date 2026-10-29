SOLARIS — Atlas interactif du système solaire

FICHIERS
- index.html : structure et contenu du site
- style.css : design responsive, animations et effets
- script.js : modèles 3D, navigation, fiches planétaires et comparateur

MISE EN LIGNE SUR GITHUB PAGES
1. Téléchargez puis décompressez solaris-explorer.zip.
2. Ouvrez votre dépôt GitHub.
3. Ajoutez index.html, style.css, script.js et README.md à la racine du dépôt.
4. Ouvrez Settings > Pages.
5. Choisissez Deploy from a branch, la branche main et le dossier /(root), puis Save.
6. Attendez la fin du déploiement.

FONCTIONNALITÉS
- Présentation immersive et responsive.
- Modèle 3D interactif avec rotation à la souris ou au doigt.
- Textures planétaires chargées depuis Solar System Scope.
- Fiches de caractéristiques pour les huit planètes.
- Comparateur de diamètre avec taille visuelle relative animée.
- Sélecteurs et bouton pour inverser les planètes.

IMPORTANT
Le site est statique et ne nécessite aucune compilation. Il utilise Three.js depuis jsDelivr et les textures de Solar System Scope, ainsi que des polices Google Fonts : une connexion Internet est nécessaire pour ces ressources.
Les textures sont chargées depuis un service externe. Si une texture ne se charge pas, une représentation 3D stylisée reste visible.
Les nombres de satellites naturels confirmés évoluent avec les découvertes; les valeurs affichées sont indicatives et peuvent changer.
Les tailles des sphères du comparateur sont mises à l'échelle pour rester lisibles, avec une comparaison visuelle relative plutôt qu'une échelle absolue sur écran.
