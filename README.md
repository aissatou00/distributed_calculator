# distributed_calculator avec RabbitMQ

##  Objectif
Ce projet simule un système de calcul distribué avec RabbitMQ, dans le but d’évaluer la capacité de traitement parallèle d' opérations mathématiques complexes (addition, soustraction, multiplication, division).

##  Arborescence du projet

distributed_calculator/
├── public/          
├── consumer_add.js          
├── consumer_sub.js          
├── consumer_mul.js          
├── consumer_div.js          
├── consumer_all.js          
├── consumer_web.js          
├── producer.js              
├── producer_3000ms.js      
├── producer_all.js          
├── producer_web.js                       
├── docker-compose.yml      
├── Dockerfile              
├── package.json             
├── package-lock.json
├── README.md                
└── server.js                


## Installation des dépendances
npm install
npm install amqplib


## Démarrage de RabbitMQ (via Docker)
- Pour ce projet, nous utilisons l'image Docker officielle avec l'interface de gestion :
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
- L'interface de gestion RabbitMQ est accessible sur : http://localhost:15672
User: guest
Password: guest

## Exécution des composants
- Lancer les consommateurs :
node consumer_add.js
node consumer_sub.js
node consumer_mul.js
node consumer_div.js

## Lancer les producteurs
- Producteur avant amélioration : 
node producer.js (producer à 5ms)

- Producteur après amélioration : 
node producer_3000ms.js (Il envoie aléatoirement des opérations add, sub, mul et div toutes les 2-3 secondes.)
node producer_all.js (Il envoie aléatoirement des opérations add, sub, mul, div, ou all toutes les 2-3 secondes.)

## Lancer les consommateurs et le producer dans des terminaux différents 
node consumer_all.js add
node consumer_all.js div
node consumer_all.js mul
node consumer_all.js sub
node producer_all.js 


## Lancer le consommateur all (affiche les résultats)
node consumer_all.js

## Exemple de message
Message envoyé : {
  "n1": 12,
  "n2": 4,
  "op": "div"
}

Résultat reçu : {
  "n1": 12,
  "n2": 4,
  "op": "div",
  "result": 3
}



## Membre de l'équipe	Rôle principal	Tâches réalisées :
Aissatou Salla (Développeuse Backend & Configuration de RabbitMQ)
- Développement des consumers spécialisés (add, sub, mul, div.)
- Tests des workers
- Génération et format des messages JSON


Stévie Voutsa (Développeuse Productrice & Logique métier)
- Développement du client producteur (producer_all.js)
- Gestion de l’aléatoire
- Simulation des délais


Lux Vegba (Développeur Résultats & Interface)
- Développement du consumer central (consumer_all.js)
- Affichage des résultats
- Participation à l’interface web (préparation de server.js et public/)