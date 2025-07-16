# Mon Framework JavaScript pour TodoMVC

Ce projet implémente un framework JavaScript fonctionnel pour la création d'applications web simples. Il inclut les fonctionnalités suivantes :

- **Abstraction du DOM** : Créez, modifiez et affichez des éléments DOM de manière déclarative.
- **Gestion de l'état** : Gérer l'état de l'application de manière centralisée.
- **Gestion des événements** : Ajouter et gérer des événements personnalisés.
- **Routage** : Gérer les changements de l'URL pour les vues filtrées.

## Comment utiliser le Framework ?

<!-- Créer un élément Dom-->

```javascript
const div = createElement('div', { class: 'container' });

// Ajouter un attribut à un élément (props)
const div = createElement('div', { class: 'box', id: 'myDiv' });

// Créer un événements
eventManager.on('click', () => alert('Élément cliqué'));
eventManager.trigger('click');

//  Créer des éléments imbriqués
const div = createElement('div', { class: 'container' }, [
  createElement('h1', {}, ['Bonjour']),
  createElement('p', {}, ['Ceci est un paragraphe.'])
]);


// Fonctionnement du Framework

Le framework fonctionne en créant des éléments comme des objets JavaScript représentant un Virtual DOM. Ces éléments sont ensuite rendus dans le DOM réel à l'aide de la fonction render().

// Le framework repose sur la création d'un Virtual DOM, une représentation en mémoire de l'interface utilisateur. Chaque appel à createElement() produit un objet JavaScript représentant un nœud du DOM. Ensuite, la fonction 
// render() synchronise ce Virtual DOM avec le DOM réel pour afficher l’interface à l’écran.

// TodoMVC
Le projet TodoMVC permet de gérer des tâches simples en utilisant ce framework. Vous pouvez ajouter, supprimer, vérifier/décocher des tâches, filtrer les tâches actives et complètes, et gérer l'URL avec le routage.

// Lancer le projet
Pour lancer l'application, ouvrez le fichier dist/index.html dans votre navigateur.