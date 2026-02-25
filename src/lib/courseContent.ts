export const PHASES: Record<string, { weeks: number[]; desc: string }> = {
    "Fondations (Semaines 1-3)": { weeks: [1, 2, 3], desc: "Bases de la programmation, outils et algorithmique." },
    "Backend Java/Spring (Semaines 4-8)": { weeks: [4, 5, 6, 7, 8], desc: "Architecture backend, Spring Boot, bases de données." },
    "Frontend Angular (Semaines 9-11)": { weeks: [9, 10, 11], desc: "Interfaces dynamiques, TypeScript, composants Angular." },
    "DevOps & CI/CD (Semaines 12-14)": { weeks: [12, 13, 14], desc: "Docker, intégration continue, cloud." },
    "Sujets Avancés (Semaines 15-18)": { weeks: [15, 16, 17, 18], desc: "Microservices, Sécurité, Kafka." },
    "Niveau Senior (Semaines 19-23)": { weeks: [19, 20, 21, 22, 23], desc: "Architecture logicielle, Design Patterns, Mentoring." }
};

export const WEEKS = [
    { w: 1, p: "Fondations", topics: ["Intro Git & CLI", "Variables & Types", "Structures de Contrôle", "Fonctions & Portée", "Bases de l'Algorithmique"] },
    { w: 2, p: "Fondations", topics: ["POO: Classes & Objets", "POO: Héritage", "POO: Polymorphisme", "Tableaux & Listes", "Gestion des Exceptions"] },
    { w: 3, p: "Fondations", topics: ["Collections Java", "Streams API", "Lambdas", "Fichiers & I/O", "Révision Fondations"] },

    { w: 4, p: "Backend Java/Spring", topics: ["Intro Spring Boot", "Inversion de Contrôle (IoC)", "Injection de Dépendances", "Contrôleurs REST", "Méthodes HTTP"] },
    { w: 5, p: "Backend Java/Spring", topics: ["Intro JPA/Hibernate", "Entités & Annotations", "Repositories Spring Data", "Relations 1:N", "Relations N:N"] },
    { w: 6, p: "Backend Java/Spring", topics: ["Services & Logique Métier", "DTOs & MapStruct", "Validation des Données", "Gestion globale des erreurs", "Tests Unitaires (JUnit)"] },
    { w: 7, p: "Backend Java/Spring", topics: ["Spring Security Intro", "Authentification JWT", "Autorisations & Rôles", "Filtres HTTP", "Tests d'Intégration"] },
    { w: 8, p: "Backend Java/Spring", topics: ["Bases SQL Avancées", "Migrations Liquibase", "Optimisation de Requêtes N+1", "Transactions Spring", "Projet Backend Complet"] },

    { w: 9, p: "Frontend Angular", topics: ["Intro Angular & CLI", "Composants & Templates", "Data Binding", "Directives (ngIf, ngFor)", "Pipes & Formatage"] },
    { w: 10, p: "Frontend Angular", topics: ["Services & Injection", "Client HTTP (RxJS)", "Observables & Subscriptions", "Routage & Navigation", "Guards de Route"] },
    { w: 11, p: "Frontend Angular", topics: ["Formulaires Réactifs", "Validations Personnalisées", "Communication Parent/Enfant", "State Management Intro", "Projet Frontend Complet"] },

    { w: 12, p: "DevOps & CI/CD", topics: ["Intro Docker", "Créer un Dockerfile", "Docker Compose", "Volumes & Réseaux", "Déploiement Local"] },
    { w: 13, p: "DevOps & CI/CD", topics: ["Intro CI/CD", "Actions GitHub / GitLab CI", "Tests Automatisés en CI", "Build & Push Docker Image", "Déploiement Automatisé"] },
    { w: 14, p: "DevOps & CI/CD", topics: ["Intro Linux pour Serveurs", "Gestion SSH & Clés", "Reverse Proxy (Nginx)", "Monitoring de base", "Projet Déploiement Complet"] },

    { w: 15, p: "Sujets Avancés", topics: ["Architecture Microservices", "Spring Cloud & Eureka", "API Gateway", "Communication Inter-Services (Feign)", "Tolérance aux Pannes (Resilience4j)"] },
    { w: 16, p: "Sujets Avancés", topics: ["Messaging Async Intro", "Apache Kafka Concepts", "Producers & Consumers", "Cas d'usage Event-Driven", "Intégration Kafka/Spring"] },
    { w: 17, p: "Sujets Avancés", topics: ["Sécurité Avancée (OAuth2)", "Single Sign-On (SSO)", "Failles Web Courantes (OWASP)", "Protection CSRF/XSS", "Audit de Sécurité"] },
    { w: 18, p: "Sujets Avancés", topics: ["GraphQL Intro", "GraphQL vs REST", "Queries & Mutations", "WebSockets & Temps Réel", "Projet Temps Réel"] },

    { w: 19, p: "Niveau Senior", topics: ["Design Patterns - Création", "Design Patterns - Structure", "Design Patterns - Comportement", "Principes SOLID", "Clean Architecture"] },
    { w: 20, p: "Niveau Senior", topics: ["Tests Driven Development (TDD)", "Behavior Driven Development (BDD)", "Tests de Performance (JMeter)", "Gestion de la Dette Technique", "Refactoring de Code Legacy"] },
    { w: 21, p: "Niveau Senior", topics: ["Déploiement Cloud (AWS/Azure)", "Serverless Concepts", "Kubernetes Intro", "Pods & Services K8s", "Scalabilité Horizontale"] },
    { w: 22, p: "Niveau Senior", topics: ["Bases NoSQL (MongoDB)", "Modélisation de Données NoSQL", "Caching (Redis)", "Elasticsearch Intro", "Optimisation des Performances"] },
    { w: 23, p: "Niveau Senior", topics: ["Code Review Best Practices", "Mentoring & Leadership Technique", "Estimer des Tâches Complexes", "Conception de Systèmes (System Design)", "Bilan & Prochaines Étapes"] }
];

export function getFrenchCourseForDate(dateStr: string) {
    const startDate = new Date(2026, 1, 23); // Feb 23, 2026
    const target = new Date(dateStr + "T00:00:00");

    if (target < startDate) return null;

    let daysDiff = 0;
    const cursor = new Date(startDate);
    while (cursor <= target) {
        if (cursor.getDay() !== 0 && cursor.getDay() !== 6) daysDiff++;
        cursor.setDate(cursor.getDate() + 1);
        if (daysDiff > 115) break;
    }

    const dayIndex = daysDiff - 1;
    if (dayIndex < 0 || dayIndex >= 115) return null;

    const weekNum = Math.floor(dayIndex / 5);
    const dayOfWeek = dayIndex % 5;
    const weekInfo = WEEKS[weekNum];

    if (!weekInfo) return null;

    const topicName = weekInfo.topics[dayOfWeek];
    const phaseName = weekInfo.p;

    return generateFrenchLessonMarkdown(weekNum + 1, dayOfWeek + 1, phaseName, topicName);
}

function generateFrenchLessonMarkdown(week: number, day: number, phaseName: string, topic: string) {
    return `
# Jour ${day} : ${topic}
**Semaine ${week} — Phase : ${phaseName}**

> [!NOTE]
> Bienvenue dans cette session détaillée. Aujourd'hui, nous plongeons en profondeur dans les concepts liés à **${topic}**. Prenez des notes, testez les exemples de code, et maîtrisez ces principes fondamentaux.

## 🧠 Vue d'ensemble du Concept

Ce sujet est crucial pour construire des applications robustes et scalables. Dans le contexte de notre apprentissage, la maîtrise de **${topic}** vous permettra de résoudre des problèmes complexes d'ingénierie logicielle avec élégance. L'objectif n'est pas seulement de comprendre la syntaxe, mais de saisir *pourquoi* et *quand* utiliser ce motif dans l'industrie.

### Carte Mentale (Mindmap)
Voici une représentation visuelle des éléments clés de cette leçon :

\`\`\`mermaid
mindmap
  root(( ${topic.replace(/[^a-zA-Z0-9 ]/g, '')} ))
    Concept Principal
      Définitions
      Cas d'utilisation
    Composants
      Syntaxe
      Règles
    Avantages
      Performance
      Maintenabilité
    Exemples pratiques
      Projet X
      Cas réel
\`\`\`

---

## 💻 Pratique & Implémentation

La théorie est inutile sans la pratique. Voici comment implémenter ces concepts dans du vrai code de production.

### Exemple de Code

\`\`\`typescript
/**
 * Exemple pratique d'implémentation pour : ${topic}
 * Remarquez les commentaires explicatifs sur chaque étape logique.
 */
class ${topic.replace(/[^a-zA-Z0-9]/g, '')}Service {
  private isInitialized: boolean = false;

  constructor() {
    // Initialisation
    this.isInitialized = true;
    console.log("Service prêt pour ${topic}.");
  }

  public executerLogiquePrincipale(data: any): void {
    if (!this.isInitialized) throw new Error("Non initialisé !");
    
    // Logique métier simulée
    try {
      console.log("Traitement des données...");
      // ... Implémentation spécifique
      return Object.assign({}, data, { status: "traité" });
    } catch (e) {
      console.error("Erreur lors de l'exécution :", e);
    }
  }
}
\`\`\`

### 🔍 Décorticage du Code

1.  **L'Initialisation** : Toute structure robuste commence par s'assurer que son état interne est cohérent.
2.  **Gestion des Erreurs** : Remarquez le bloc \`try/catch\`. Dans la vraie vie, vous ne devriez jamais faire confiance aux données d'entrée sans protection.
3.  **Modularité** : Le code est encapsulé, ce qui le rend hautement testable.

---

## 🎯 Exercices Pratiques

Pour valider l'acquisition de vos compétences aujourd'hui, essayez de réaliser :

- [ ] **Exercice 1** : Réécrivez l'exemple ci-dessus en y ajoutant une couche d'abstraction supplémentaire (par exemple, une interface).
- [ ] **Exercice 2** : Introduisez un bug intentionnel et utilisez votre débogueur (IDE) pour tracer l'état des variables étape par étape.
- [ ] **Exercice 3** : Expliquez ce concept à voix haute comme si vous étiez en entretien d'embauche.

> [!TIP]
> **Le secret des Seniors** : La lecture de code source (open source) est l'un des meilleurs moyens d'accélérer l'apprentissage de ${topic}. Allez voir comment les frameworks mettent cela en œuvre !

---
*Fin du cours du jour. Assurez-vous d'expérimenter dans votre dépôt local avant de passer à la suite !*
  `;
}
