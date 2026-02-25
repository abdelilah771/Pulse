/**
 * courseData.ts — Generates markdown course content for each learning task
 * Uses structured topic data + templates to produce lessons with Mermaid mindmaps
 */

export interface WeekDay {
    topic: string;
    concepts: string[];
    mindmap: string;
    branches: string[];
}

export interface PhaseWeek {
    title: string;
    phase: string;
    days: WeekDay[];
}

export const WEEKS: PhaseWeek[] = [
    {
        title: 'Git & GitHub', phase: 'Foundations', days: [
            { topic: 'Git Basics', concepts: ['init', 'add', 'commit', 'status', 'log'], mindmap: 'Git Basics', branches: ['Working Directory', 'Staging Area', 'Repository', 'Commit History'] },
            { topic: 'Branching & Merging', concepts: ['branch', 'checkout', 'merge', 'conflicts'], mindmap: 'Branching', branches: ['Feature Branches', 'Merge Strategies', 'Conflict Resolution', 'Fast-Forward'] },
            { topic: 'Remote Repositories', concepts: ['clone', 'push', 'pull', 'fetch'], mindmap: 'Remote Git', branches: ['Origin', 'Upstream', 'Pull Requests', 'Forks'] },
            { topic: 'GitHub Workflow', concepts: ['PR', 'code review', 'issues', 'actions'], mindmap: 'GitHub', branches: ['Pull Requests', 'Code Review', 'Issues', 'CI/CD'] },
            { topic: 'Advanced Git', concepts: ['stash', 'cherry-pick', 'rebase', 'reset'], mindmap: 'Advanced Git', branches: ['Stash', 'Cherry-pick', 'Interactive Rebase', 'Reset vs Revert'] },
        ]
    },
    {
        title: 'SQL & Databases', phase: 'Foundations', days: [
            { topic: 'SQL Basics', concepts: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], mindmap: 'SQL Basics', branches: ['CRUD Operations', 'WHERE Clause', 'ORDER BY', 'LIMIT'] },
            { topic: 'JOINs', concepts: ['INNER', 'LEFT', 'RIGHT', 'FULL OUTER'], mindmap: 'SQL JOINs', branches: ['Inner Join', 'Left Join', 'Right Join', 'Subqueries'] },
            { topic: 'Database Design', concepts: ['normalization', '1NF', '2NF', '3NF'], mindmap: 'DB Design', branches: ['Normalization', 'ERD', 'Primary Keys', 'Foreign Keys'] },
            { topic: 'Indexes & Transactions', concepts: ['B-tree', 'ACID', 'isolation'], mindmap: 'Performance', branches: ['Indexes', 'Transactions', 'ACID', 'Isolation Levels'] },
            { topic: 'Aggregations', concepts: ['GROUP BY', 'HAVING', 'COUNT', 'SUM'], mindmap: 'Aggregations', branches: ['GROUP BY', 'HAVING', 'Window Functions', 'Analytics'] },
        ]
    },
    {
        title: 'Java OOP', phase: 'Foundations', days: [
            { topic: 'Classes & Inheritance', concepts: ['class', 'constructor', 'inheritance', 'super'], mindmap: 'OOP Basics', branches: ['Classes', 'Objects', 'Inheritance', 'Constructors'] },
            { topic: 'Interfaces & Polymorphism', concepts: ['interface', 'abstract', 'polymorphism'], mindmap: 'Abstraction', branches: ['Interfaces', 'Abstract Classes', 'Polymorphism', 'Encapsulation'] },
            { topic: 'Collections', concepts: ['List', 'Set', 'Map', 'Queue'], mindmap: 'Collections', branches: ['ArrayList', 'HashMap', 'TreeSet', 'LinkedList'] },
            { topic: 'Generics & Streams', concepts: ['generics', 'lambda', 'Stream API'], mindmap: 'Modern Java', branches: ['Generics', 'Lambdas', 'Stream API', 'Functional Interfaces'] },
            { topic: 'Exceptions & Java 17+', concepts: ['try/catch', 'records', 'sealed classes'], mindmap: 'Java Advanced', branches: ['Exception Handling', 'Records', 'Sealed Classes', 'Pattern Matching'] },
        ]
    },
    {
        title: 'Spring Boot Basics', phase: 'Foundations', days: [
            { topic: 'Spring Ecosystem', concepts: ['IoC', 'DI', 'Spring Boot'], mindmap: 'Spring', branches: ['IoC Container', 'Dependency Injection', 'Auto-configuration', 'Starters'] },
            { topic: 'First App', concepts: ['Initializr', 'project structure', 'Hello World'], mindmap: 'Project Setup', branches: ['Spring Initializr', 'Maven/Gradle', 'Application.java', 'Resources'] },
            { topic: 'REST Controllers', concepts: ['@RestController', '@GetMapping', '@PostMapping'], mindmap: 'Controllers', branches: ['@RestController', '@RequestMapping', '@RequestBody', '@PathVariable'] },
            { topic: 'Configuration', concepts: ['application.yml', 'profiles', 'logging'], mindmap: 'Configuration', branches: ['Properties', 'Profiles', 'Logging', 'Environment'] },
            { topic: 'DevTools & Actuator', concepts: ['hot reload', 'health', 'metrics'], mindmap: 'Spring Tools', branches: ['DevTools', 'Actuator', 'Health Endpoint', 'Metrics'] },
        ]
    },
    {
        title: 'REST APIs', phase: 'Backend', days: [
            { topic: 'REST Principles', concepts: ['stateless', 'resources', 'HATEOAS'], mindmap: 'REST', branches: ['Stateless', 'Resource-Based', 'HTTP Methods', 'Status Codes'] },
            { topic: 'CRUD Endpoints', concepts: ['GET', 'POST', 'PUT', 'DELETE'], mindmap: 'CRUD API', branches: ['Create', 'Read', 'Update', 'Delete'] },
            { topic: 'DTOs & Validation', concepts: ['DTO', '@Valid', '@NotNull'], mindmap: 'Validation', branches: ['DTOs', 'Bean Validation', 'Custom Validators', 'Error Messages'] },
            { topic: 'Error Handling', concepts: ['@ControllerAdvice', '@ExceptionHandler'], mindmap: 'Errors', branches: ['Global Handler', 'Custom Exceptions', 'Error Response', 'HTTP Status'] },
            { topic: 'API Documentation', concepts: ['Swagger', 'OpenAPI', 'Postman'], mindmap: 'API Docs', branches: ['Swagger UI', 'OpenAPI Spec', 'Postman', 'API Testing'] },
        ]
    },
    {
        title: 'Spring Data JPA', phase: 'Backend', days: [
            { topic: 'JPA Entities', concepts: ['@Entity', '@Table', '@Id', 'Hibernate'], mindmap: 'JPA', branches: ['Entities', 'Annotations', 'Hibernate', 'ORM Mapping'] },
            { topic: 'Relationships', concepts: ['@OneToMany', '@ManyToOne', 'cascade'], mindmap: 'Relations', branches: ['OneToMany', 'ManyToOne', 'ManyToMany', 'Cascade'] },
            { topic: 'Repositories', concepts: ['JpaRepository', 'query methods'], mindmap: 'Repositories', branches: ['CrudRepository', 'JpaRepository', 'Query Methods', 'Custom Queries'] },
            { topic: 'JPQL & Pagination', concepts: ['@Query', 'Pageable', 'N+1'], mindmap: 'Queries', branches: ['JPQL', 'Native Queries', 'Pagination', 'N+1 Problem'] },
            { topic: 'Flyway Migrations', concepts: ['Flyway', 'versioned migrations'], mindmap: 'Migrations', branches: ['Flyway', 'Version Control', 'Schema Evolution', 'Rollback'] },
        ]
    },
    {
        title: 'Spring Security', phase: 'Backend', days: [
            { topic: 'Auth Concepts', concepts: ['authentication', 'authorization', 'filters'], mindmap: 'Security', branches: ['Authentication', 'Authorization', 'Filters', 'Providers'] },
            { topic: 'Security Config', concepts: ['SecurityFilterChain', 'BCrypt'], mindmap: 'Config', branches: ['FilterChain', 'UserDetailsService', 'BCrypt', 'CORS'] },
            { topic: 'JWT', concepts: ['token', 'generation', 'validation'], mindmap: 'JWT', branches: ['Header', 'Payload', 'Signature', 'Token Flow'] },
            { topic: 'Roles', concepts: ['@PreAuthorize', 'RBAC'], mindmap: 'RBAC', branches: ['Roles', 'Permissions', '@PreAuthorize', 'Method Security'] },
            { topic: 'OAuth2 & SSO', concepts: ['OAuth2', 'OpenID', 'Kerberos'], mindmap: 'SSO', branches: ['OAuth2', 'OpenID Connect', 'SAML', 'Kerberos'] },
        ]
    },
    {
        title: 'Testing', phase: 'Backend', days: [
            { topic: 'JUnit 5', concepts: ['@Test', 'assertions', 'lifecycle'], mindmap: 'JUnit', branches: ['Assertions', 'Lifecycle', 'Parameterized', 'Nested Tests'] },
            { topic: 'Mockito', concepts: ['@Mock', 'when/thenReturn', 'verify'], mindmap: 'Mocking', branches: ['@Mock', '@InjectMocks', 'Stubbing', 'Verification'] },
            { topic: 'Integration Tests', concepts: ['@SpringBootTest', '@DataJpaTest'], mindmap: 'Integration', branches: ['SpringBootTest', 'DataJpaTest', 'TestContainers', 'H2'] },
            { topic: 'MockMvc', concepts: ['@WebMvcTest', 'perform', 'andExpect'], mindmap: 'API Testing', branches: ['MockMvc', 'WebMvcTest', 'Request Builders', 'Matchers'] },
            { topic: 'TDD & Coverage', concepts: ['TDD', 'JaCoCo', 'coverage'], mindmap: 'TDD', branches: ['Red-Green-Refactor', 'JaCoCo', 'Coverage Goals', 'Best Practices'] },
        ]
    },
    {
        title: 'Advanced Spring', phase: 'Backend', days: [
            { topic: 'Caching', concepts: ['@Cacheable', '@CacheEvict', 'Caffeine'], mindmap: 'Caching', branches: ['@Cacheable', '@CacheEvict', 'Caffeine', 'Redis'] },
            { topic: 'Async', concepts: ['@Async', 'CompletableFuture'], mindmap: 'Async', branches: ['@Async', 'CompletableFuture', 'Thread Pool', 'Non-blocking'] },
            { topic: 'Scheduling', concepts: ['@Scheduled', 'cron expressions'], mindmap: 'Scheduling', branches: ['@Scheduled', 'Cron', 'Fixed Rate', 'Fixed Delay'] },
            { topic: 'Events', concepts: ['ApplicationEvent', '@EventListener'], mindmap: 'Events', branches: ['ApplicationEvent', '@EventListener', 'Custom Events', 'Decoupling'] },
            { topic: 'Messaging', concepts: ['RabbitMQ', 'Kafka', 'Spring AMQP'], mindmap: 'Messaging', branches: ['RabbitMQ', 'Kafka', 'Pub/Sub', 'Event Sourcing'] },
        ]
    },
    {
        title: 'TypeScript', phase: 'Frontend', days: [
            { topic: 'TS Basics', concepts: ['types', 'annotations', 'interfaces'], mindmap: 'TypeScript', branches: ['Type Annotations', 'Interfaces', 'Type Aliases', 'Optional Props'] },
            { topic: 'Functions & Generics', concepts: ['typed params', 'generics', 'constraints'], mindmap: 'TS Functions', branches: ['Typed Params', 'Return Types', 'Generics', 'Constraints'] },
            { topic: 'Enums & Classes', concepts: ['enums', 'access modifiers', 'decorators'], mindmap: 'TS OOP', branches: ['Enums', 'Classes', 'Decorators', 'Access Modifiers'] },
            { topic: 'Advanced Types', concepts: ['union', 'intersection', 'type guards'], mindmap: 'Advanced TS', branches: ['Union Types', 'Intersection', 'Type Guards', 'Mapped Types'] },
            { topic: 'Modules & Config', concepts: ['import/export', 'tsconfig', 'strict'], mindmap: 'TS Config', branches: ['Modules', 'tsconfig.json', 'Strict Mode', 'Path Aliases'] },
        ]
    },
    {
        title: 'Angular Basics', phase: 'Frontend', days: [
            { topic: 'Angular CLI', concepts: ['ng new', 'ng generate', 'ng serve'], mindmap: 'Angular CLI', branches: ['ng new', 'ng generate', 'ng serve', 'ng build'] },
            { topic: 'Components', concepts: ['@Component', 'data binding', 'template'], mindmap: 'Components', branches: ['@Component', 'Interpolation', 'Property Binding', 'Event Binding'] },
            { topic: 'Directives & Pipes', concepts: ['*ngIf', '*ngFor', 'pipes'], mindmap: 'Directives', branches: ['*ngIf', '*ngFor', 'Custom Directive', 'Pipes'] },
            { topic: 'Services & DI', concepts: ['@Injectable', 'providedIn'], mindmap: 'Services', branches: ['@Injectable', 'Dependency Injection', 'Singleton', 'providedIn'] },
            { topic: 'Routing', concepts: ['RouterModule', 'routerLink', 'lazy loading'], mindmap: 'Routing', branches: ['Routes', 'RouterLink', 'Lazy Loading', 'Guards'] },
        ]
    },
    {
        title: 'Angular Advanced', phase: 'Frontend', days: [
            { topic: 'RxJS', concepts: ['Observable', 'operators', 'switchMap'], mindmap: 'RxJS', branches: ['Observable', 'Operators', 'Subjects', 'Subscriptions'] },
            { topic: 'Reactive Forms', concepts: ['FormGroup', 'FormControl', 'validators'], mindmap: 'Forms', branches: ['FormGroup', 'FormControl', 'Validators', 'FormBuilder'] },
            { topic: 'HttpClient', concepts: ['GET', 'POST', 'interceptors'], mindmap: 'HTTP', branches: ['HttpClient', 'Interceptors', 'Error Handling', 'Headers'] },
            { topic: 'NgRx', concepts: ['Store', 'Actions', 'Reducers', 'Selectors'], mindmap: 'NgRx', branches: ['Store', 'Actions', 'Reducers', 'Selectors'] },
            { topic: 'Angular Material', concepts: ['mat-table', 'mat-dialog', 'theming'], mindmap: 'Material', branches: ['Components', 'Theming', 'CDK', 'Accessibility'] },
        ]
    },
    {
        title: 'Angular + API', phase: 'Frontend', days: [
            { topic: 'API Integration', concepts: ['CORS', 'HttpClient', 'REST'], mindmap: 'Integration', branches: ['CORS Config', 'API Service', 'Environment', 'Proxy'] },
            { topic: 'JWT Auth in Angular', concepts: ['AuthGuard', 'token storage', 'interceptor'], mindmap: 'Auth Flow', branches: ['Login', 'Token Storage', 'AuthGuard', 'Interceptor'] },
            { topic: 'Error Handling', concepts: ['global interceptor', 'loading states'], mindmap: 'UX', branches: ['Error Interceptor', 'Loading Spinner', 'Skeleton', 'Retry'] },
            { topic: 'File Upload & Pagination', concepts: ['file upload', 'Pageable', 'mat-table'], mindmap: 'Features', branches: ['File Upload', 'Pagination', 'Sorting', 'Filtering'] },
            { topic: 'Production Build', concepts: ['ng build', 'AOT', 'Nginx'], mindmap: 'Deployment', branches: ['AOT', 'Tree Shaking', 'Nginx', 'Docker'] },
        ]
    },
    {
        title: 'Docker', phase: 'DevOps', days: [
            { topic: 'Docker Concepts', concepts: ['images', 'containers', 'layers'], mindmap: 'Docker', branches: ['Images', 'Containers', 'Layers', 'Registry'] },
            { topic: 'Dockerfile', concepts: ['FROM', 'RUN', 'COPY', 'multi-stage'], mindmap: 'Dockerfile', branches: ['FROM', 'RUN', 'COPY', 'Multi-stage'] },
            { topic: 'Docker Commands', concepts: ['run', 'exec', 'logs', 'volumes'], mindmap: 'CLI', branches: ['run', 'exec', 'logs', 'volumes'] },
            { topic: 'Dockerize Spring Boot', concepts: ['Dockerfile', 'env vars', 'networking'], mindmap: 'Spring Docker', branches: ['Jar Packaging', 'Dockerfile', 'Env Vars', 'Networking'] },
            { topic: 'Dockerize Angular', concepts: ['Nginx', 'custom network', 'bridge'], mindmap: 'Angular Docker', branches: ['Nginx Config', 'Multi-stage', 'Network', 'Compose'] },
        ]
    },
    {
        title: 'Docker Compose', phase: 'DevOps', days: [
            { topic: 'Compose Basics', concepts: ['docker-compose.yml', 'services'], mindmap: 'Compose', branches: ['Services', 'Networks', 'Volumes', 'Build'] },
            { topic: 'Multi-Container', concepts: ['frontend+backend+db', 'depends_on'], mindmap: 'Multi-Container', branches: ['Frontend', 'Backend', 'Database', 'depends_on'] },
            { topic: 'Networking', concepts: ['service discovery', 'container names'], mindmap: 'Networking', branches: ['Bridge', 'Service Discovery', 'DNS', 'Port Mapping'] },
            { topic: 'Volumes & Env', concepts: ['named volumes', '.env', 'secrets'], mindmap: 'Data', branches: ['Named Volumes', 'Bind Mounts', '.env Files', 'Secrets'] },
            { topic: 'Profiles & Health', concepts: ['profiles', 'health checks', 'overrides'], mindmap: 'Advanced', branches: ['Profiles', 'Health Checks', 'Overrides', 'Scaling'] },
        ]
    },
    {
        title: 'CI/CD', phase: 'DevOps', days: [
            { topic: 'CI/CD Concepts', concepts: ['CI', 'CD', 'pipeline stages'], mindmap: 'CI/CD', branches: ['Continuous Integration', 'Continuous Delivery', 'Pipeline', 'Automation'] },
            { topic: 'GitHub Actions', concepts: ['workflows', 'jobs', 'steps', 'runners'], mindmap: 'Actions', branches: ['Workflows', 'Jobs', 'Steps', 'Runners'] },
            { topic: 'Testing in CI', concepts: ['JUnit in CI', 'caching deps'], mindmap: 'CI Testing', branches: ['Test Step', 'Cache', 'Artifacts', 'Reports'] },
            { topic: 'Docker in CI', concepts: ['build & push', 'GHCR'], mindmap: 'Docker CI', branches: ['Build Image', 'Push Registry', 'GHCR', 'Tags'] },
            { topic: 'Deployment Strategies', concepts: ['blue/green', 'rolling', 'canary'], mindmap: 'Deploy', branches: ['Blue/Green', 'Rolling', 'Canary', 'Rollback'] },
        ]
    },
    {
        title: 'Kubernetes Basics', phase: 'DevOps', days: [
            { topic: 'K8s Architecture', concepts: ['master', 'nodes', 'pods', 'cluster'], mindmap: 'K8s', branches: ['Master Node', 'Worker Nodes', 'Pods', 'etcd'] },
            { topic: 'kubectl', concepts: ['get', 'describe', 'apply', 'YAML'], mindmap: 'kubectl', branches: ['get', 'describe', 'apply', 'delete'] },
            { topic: 'Deployments', concepts: ['replicas', 'rolling updates', 'ReplicaSet'], mindmap: 'Deployments', branches: ['Replicas', 'Rolling Update', 'ReplicaSet', 'Strategy'] },
            { topic: 'Services', concepts: ['ClusterIP', 'NodePort', 'LoadBalancer'], mindmap: 'Services', branches: ['ClusterIP', 'NodePort', 'LoadBalancer', 'Discovery'] },
            { topic: 'ConfigMaps & Secrets', concepts: ['ConfigMap', 'Secret', 'env injection'], mindmap: 'Config', branches: ['ConfigMap', 'Secrets', 'Env Vars', 'Volume Mount'] },
        ]
    },
    {
        title: 'K8s Advanced', phase: 'Advanced', days: [
            { topic: 'Ingress', concepts: ['Ingress controller', 'TLS', 'cert-manager'], mindmap: 'Ingress', branches: ['Controller', 'Rules', 'TLS', 'cert-manager'] },
            { topic: 'Storage', concepts: ['PV', 'PVC', 'StorageClass'], mindmap: 'Storage', branches: ['PersistentVolume', 'PVC', 'StorageClass', 'Dynamic'] },
            { topic: 'Helm', concepts: ['charts', 'values', 'templates'], mindmap: 'Helm', branches: ['Charts', 'Values', 'Templates', 'Repositories'] },
            { topic: 'Health & Resources', concepts: ['liveness', 'readiness', 'limits'], mindmap: 'Health', branches: ['Liveness Probe', 'Readiness Probe', 'CPU Limits', 'Memory Limits'] },
            { topic: 'HPA', concepts: ['autoscaling', 'metrics', 'scaling policies'], mindmap: 'Autoscaling', branches: ['HPA', 'CPU Metric', 'Custom Metrics', 'Scaling Policy'] },
        ]
    },
    {
        title: 'Microservices', phase: 'Advanced', days: [
            { topic: 'Microservices Intro', concepts: ['monolith vs micro', 'bounded context'], mindmap: 'Microservices', branches: ['Monolith', 'Microservice', 'Bounded Context', 'DDD'] },
            { topic: 'Communication', concepts: ['REST', 'gRPC', 'async messaging'], mindmap: 'Communication', branches: ['Sync REST', 'gRPC', 'Async Messaging', 'Event-Driven'] },
            { topic: 'Service Discovery', concepts: ['Eureka', 'Consul', 'API Gateway'], mindmap: 'Discovery', branches: ['Eureka', 'Consul', 'API Gateway', 'Load Balancing'] },
            { topic: 'Resilience', concepts: ['Circuit Breaker', 'retry', 'fallback'], mindmap: 'Resilience', branches: ['Circuit Breaker', 'Retry', 'Fallback', 'Bulkhead'] },
            { topic: 'Observability', concepts: ['logging', 'tracing', 'Prometheus'], mindmap: 'Observability', branches: ['Centralized Logging', 'Distributed Tracing', 'Metrics', 'Alerting'] },
        ]
    },
    {
        title: 'System Design', phase: 'Advanced', days: [
            { topic: 'System Design Basics', concepts: ['scalability', 'availability', 'CAP'], mindmap: 'System Design', branches: ['Scalability', 'Availability', 'Consistency', 'Partition Tolerance'] },
            { topic: 'Load Balancing & Caching', concepts: ['LB algorithms', 'CDN', 'Redis'], mindmap: 'Performance', branches: ['Load Balancer', 'CDN', 'Redis Cache', 'DB Cache'] },
            { topic: 'Databases at Scale', concepts: ['sharding', 'replication', 'NoSQL'], mindmap: 'DB Scale', branches: ['Sharding', 'Replication', 'NoSQL', 'Polyglot Persistence'] },
            { topic: 'Message Queues', concepts: ['Kafka', 'RabbitMQ', 'event sourcing'], mindmap: 'Messaging', branches: ['Kafka', 'RabbitMQ', 'Event Sourcing', 'CQRS'] },
            { topic: 'Design Exercises', concepts: ['URL shortener', 'chat system', 'feed'], mindmap: 'Exercises', branches: ['URL Shortener', 'Chat System', 'News Feed', 'Rate Limiter'] },
        ]
    },
    {
        title: 'Design Patterns', phase: 'Advanced', days: [
            { topic: 'Creational Patterns', concepts: ['Singleton', 'Factory', 'Builder'], mindmap: 'Creational', branches: ['Singleton', 'Factory Method', 'Abstract Factory', 'Builder'] },
            { topic: 'Structural Patterns', concepts: ['Adapter', 'Decorator', 'Facade'], mindmap: 'Structural', branches: ['Adapter', 'Decorator', 'Facade', 'Proxy'] },
            { topic: 'Behavioral Patterns', concepts: ['Observer', 'Strategy', 'Command'], mindmap: 'Behavioral', branches: ['Observer', 'Strategy', 'Command', 'Template Method'] },
            { topic: 'Patterns in Spring', concepts: ['DI', 'Template', 'Proxy'], mindmap: 'Spring Patterns', branches: ['DI Container', 'Template Pattern', 'AOP Proxy', 'Factory Bean'] },
            { topic: 'Anti-Patterns', concepts: ['God class', 'spaghetti', 'premature optimization'], mindmap: 'Anti-Patterns', branches: ['God Class', 'Spaghetti Code', 'Premature Optimization', 'Golden Hammer'] },
        ]
    },
    {
        title: 'Senior Skills I', phase: 'Senior', days: [
            { topic: 'Code Review', concepts: ['review checklist', 'feedback', 'standards'], mindmap: 'Code Review', branches: ['Checklist', 'Constructive Feedback', 'Standards', 'Automation'] },
            { topic: 'Mentoring', concepts: ['pair programming', 'knowledge sharing'], mindmap: 'Mentoring', branches: ['Pair Programming', 'Knowledge Sharing', '1:1 Meetings', 'Growth Plans'] },
            { topic: 'Documentation', concepts: ['ADRs', 'README', 'API docs'], mindmap: 'Documentation', branches: ['ADRs', 'README', 'API Docs', 'Runbooks'] },
            { topic: 'Architecture', concepts: ['clean architecture', 'hexagonal', 'DDD'], mindmap: 'Architecture', branches: ['Clean Architecture', 'Hexagonal', 'DDD', 'Event-Driven'] },
            { topic: 'Soft Skills', concepts: ['communication', 'estimation', 'stakeholders'], mindmap: 'Soft Skills', branches: ['Communication', 'Estimation', 'Stakeholders', 'Prioritization'] },
        ]
    },
    {
        title: 'Senior Skills II', phase: 'Senior', days: [
            { topic: 'Performance Optimization', concepts: ['profiling', 'JVM tuning', 'DB optimization'], mindmap: 'Performance', branches: ['Profiling', 'JVM Tuning', 'Query Optimization', 'Lazy Loading'] },
            { topic: 'Security Best Practices', concepts: ['OWASP', 'input validation', 'secrets'], mindmap: 'Security', branches: ['OWASP Top 10', 'Input Validation', 'Secret Management', 'Audit Logging'] },
            { topic: 'Cloud & Infrastructure', concepts: ['AWS basics', 'serverless', 'IaC'], mindmap: 'Cloud', branches: ['AWS', 'Serverless', 'Terraform', 'Cost Optimization'] },
            { topic: 'Tech Leadership', concepts: ['tech debt', 'RFC process', 'roadmap'], mindmap: 'Leadership', branches: ['Tech Debt', 'RFC Process', 'Roadmap', 'Team Velocity'] },
            { topic: 'Capstone Project', concepts: ['full-stack app', 'deployment', 'presentation'], mindmap: 'Capstone', branches: ['Full-Stack App', 'CI/CD Pipeline', 'K8s Deploy', 'Presentation'] },
        ]
    },
];

/**
 * Generate markdown lesson for a given week and day index.
 */
function generateLesson(weekIdx: number, dayIdx: number) {
    const week = WEEKS[weekIdx];
    if (!week || !week.days[dayIdx]) return null;
    const day = week.days[dayIdx];
    const weekNum = weekIdx + 1;
    const dayNum = dayIdx + 1;

    const conceptsList = day.concepts.map(c => `- **${c}**`).join('\n');

    // Build mermaid mindmap
    const mmBranches = day.branches.map(b => `      ${b}`).join('\n');
    const mermaid = `\`\`\`mermaid
mindmap
  root((${day.mindmap}))
    ${day.branches[0] || ''}
      Detail A
    ${day.branches[1] || ''}
      Detail B
    ${day.branches[2] || ''}
      Detail C
    ${day.branches[3] || ''}
      Detail D
\`\`\``;

    return `# Week ${weekNum} · Day ${dayNum}: ${day.topic}

**Phase:** ${week.phase} · **Module:** ${week.title}

---

## Overview

Today you'll learn about **${day.topic}** — a key part of ${week.title}.

## Key Concepts

${conceptsList}

## Mindmap

${mermaid}

## Lesson

### What is ${day.topic}?

${day.topic} is a fundamental concept in ${week.title}. Understanding ${day.concepts[0]} is essential because it forms the building block for more advanced topics.

### Core Ideas

1. **${day.concepts[0]}** — The foundation. Start here and make sure you understand it deeply before moving on.
2. **${day.concepts[1]}** — Builds on the first concept. Practice with small examples.
${day.concepts[2] ? `3. **${day.concepts[2]}** — An important technique that ties everything together.` : ''}
${day.concepts[3] ? `4. **${day.concepts[3]}** — Advanced usage that you'll encounter in real projects.` : ''}

### Practice Exercise

> Build a small project or write code that demonstrates each of the concepts above.
> Try to combine at least two concepts in a single example.

## Summary

| Concept | Importance | Status |
|---|---|---|
${day.concepts.map(c => `| ${c} | Core | ⬜ Review |`).join('\n')}

---

*Week ${weekNum} of 23 · ${week.phase} Phase*
`;
}

/**
 * Get course content for a specific date string.
 * Maps date → (weekIdx, dayIdx) → generated lesson.
 */
export function getCourseForDate(dateStr: string) {
    const startDate = new Date(2026, 1, 23); // Feb 23, 2026
    const target = new Date(dateStr + 'T00:00:00');

    if (isNaN(target.getTime())) return null;

    // Count weekdays between start and target
    let weekdayCount = 0;
    const cursor = new Date(startDate);

    while (cursor < target) {
        if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
            weekdayCount++;
        }
        cursor.setDate(cursor.getDate() + 1);
    }

    // target itself should be a weekday
    if (target.getDay() === 0 || target.getDay() === 6) return null;

    const weekIdx = Math.floor(weekdayCount / 5);
    const dayIdx = weekdayCount % 5;

    if (weekIdx >= WEEKS.length) return null;

    return generateLesson(weekIdx, dayIdx);
}

/**
 * Get the week/phase info for a date.
 */
export function getWeekInfo(dateStr: string) {
    const startDate = new Date(2026, 1, 23);
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return null;

    let weekdayCount = 0;
    const cursor = new Date(startDate);
    while (cursor < target) {
        if (cursor.getDay() !== 0 && cursor.getDay() !== 6) weekdayCount++;
        cursor.setDate(cursor.getDate() + 1);
    }

    const weekIdx = Math.floor(weekdayCount / 5);
    if (weekIdx >= WEEKS.length) return null;

    const week = WEEKS[weekIdx];
    return {
        weekNum: weekIdx + 1,
        dayNum: (weekdayCount % 5) + 1,
        title: week.title,
        phase: week.phase,
        totalWeeks: WEEKS.length
    };
}

/**
 * Get all phase info for KPIs
 */
export function getPhases() {
    const phases: Record<string, { weeks: number[], totalDays: number }> = {};
    WEEKS.forEach((w, i) => {
        if (!phases[w.phase]) phases[w.phase] = { weeks: [], totalDays: 0 };
        phases[w.phase].weeks.push(i + 1);
        phases[w.phase].totalDays += w.days.length;
    });
    return phases;
}
