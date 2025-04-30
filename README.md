# distributed_calculator avec RabbitMQ

##  Objectif
Ce projet simule un système de calcul distribué avec RabbitMQ, dans le but d’évaluer la capacité de traitement parallèle d' opérations mathématiques complexes (addition, soustraction, multiplication, division).

##  Choix Techniques
- Node.js : pour les scripts backend (workers, producteurs)
- Express.js : pour l’interface web
- Docker & Docker Compose : pour la conteneurisation et l'orchestration
- RabbitMQ : pour la gestion de la communication entre les producteurs et les workers via un système de message



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
git clone https://github.com/aissatou00/distributed_calculator.git
cd distributed_calculator
npm install
npm install amqplib
docker-compose up --build

## Démarrage de RabbitMQ (via Docker)
- Pour ce projet, nous utilisons l'image Docker officielle avec l'interface de gestion :
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
- L'interface de gestion RabbitMQ est accessible sur : http://localhost:15672
User: guest
Password: guest

## Exécution des composants
- Lancer les consommateurs :
```bash
node consumer_add.js
node consumer_sub.js
node consumer_mul.js
node consumer_div.js
```

## Lancer les producteurs
- Producteur avant amélioration : 
node producer.js (producer à 5ms)

- Producteur après amélioration :
```bash
node producer_3000ms.js   # Envoie aléatoirement des opérations add, sub, mul et div toutes les 2-3 secondes.
node producer_all.js      # Envoie aléatoirement des opérations add, sub, mul, div ou all toutes les 2-3 secondes.
```
## Lancer les consommateurs et le producer dans des terminaux différents 
```bash
node consumer_all.js add
node consumer_all.js div
node consumer_all.js mul
node consumer_all.js sub
node producer_all.js 
```

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