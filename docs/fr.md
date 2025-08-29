# Balle rebondissante — Guide d’utilisation simple (FR)

Ce comportement fait bouger un objet comme une balle qui rebondit sur les objets Solid.

## Démarrage rapide
- Ajoutez le comportement à votre Sprite.
- Placez des murs/sols avec le comportement Solid.
- Dans les propriétés, définissez la Vitesse initiale et l’Angle initial (deg).
- Lancez: l’objet rebondit sur les Solids.

## Propriétés (Préférences)
- Vitesse initiale: vitesse de départ (px/s).
- Angle initial (deg): direction de départ en degrés (0=droite, 90=bas).
- Restitution: énergie conservée au rebond [0–1] (1 = rebond parfait).
- Activé: démarrer le comportement actif.
- Vitesse min pour s’arrêter: s’arrête sous cette vitesse (px/s).
- Rebonds max: s’arrête après ce nombre de rebonds (-1 = illimité).
- Sous‑pas max: limite des sous‑pas internes pour réduire le tunneling.
- Distance max par sous‑pas: distance maximale par sous‑pas (pixels).
- Épsilon de séparation: petit décalage après résolution pour éviter l’adhérence (pixels).
- Utiliser la normale de surface: réflexion selon la normale (meilleur sur pentes/surfaces inclinées).
- Vitesse constante après rebond: maintenir une vitesse constante après chaque rebond.
- Vitesse constante: vitesse imposée après un rebond (px/s).

## Conditions
- Au rebond (déclencheur): déclenché lorsqu’un rebond est résolu.
- À l’arrêt (déclencheur): déclenché quand le comportement s’arrête (vitesse trop faible ou rebonds max).
- Comparer le nombre de rebonds (cmp, valeur): comparer le compteur actuel.
- Est activé: vérifie si le comportement est activé.

## Actions
- Définir activé(activé): activer/désactiver le comportement.
- Définir la vitesse(vx, vy): définir la vitesse en px/s.
- Définir vitesse & angle(vitesse, angleDeg): vitesse (px/s) et direction (deg).
- Ajouter à la vitesse(ax, ay): ajouter une impulsion à la vitesse (px/s).
- Définir la restitution(valeur 0–1): énergie conservée au rebond.
- Définir les rebonds max(nombre): -1 = illimité.
- Réinitialiser le nombre de rebonds(): remet le compteur à 0.
- Définir la vitesse min d’arrêt(vitesse): s’arrête sous cette vitesse.
- Définir les sous‑pas(sousPasMax, distanceMaxParSousPas): configure les sous‑pas.
- Définir l’épsilon de séparation(epsilon): petit décalage anti‑adhérence.
- Utiliser la normale de surface(activé): activer/désactiver la réflexion par normale.
- Vitesse constante après rebond(activé): activer/désactiver la vitesse constante.
- Définir la vitesse constante(vitesse): vitesse imposée après chaque rebond.

## Expressions
- VelocityX: vitesse X actuelle (px/s).
- VelocityY: vitesse Y actuelle (px/s).
- Speed: vitesse actuelle (px/s).
- Angle: angle actuel (degrés).
- BounceCount: nombre de rebonds effectués.
- LastBounceAxis: axe du dernier rebond: "x", "y" ou "xy".

## Astuces
- Augmentez les Sous‑pas max / réduisez la Distance max par sous‑pas si l’objet est très rapide pour limiter le tunneling.
- Utilisez l’Épsilon de séparation pour éviter l’adhérence sur les coins.
- Activez Utiliser la normale de surface pour de meilleurs rebonds sur des solides inclinés/rotés.
- Activez Vitesse constante après rebond pour un comportement arcade à vitesse constante.

Références:
- Construct Addon SDK — Définir les ACES: https://www.construct.net/en/make-games/manuals/addon-sdk/guide/defining-aces
- Construct Addon SDK — Configurer les comportements: https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-behaviors