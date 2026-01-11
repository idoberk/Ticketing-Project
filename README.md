# Ticketing - Event Marketplace Platform

A modern event ticketing marketplace built with microservices architecture, showcasing production-grade patterns for distributed systems.

> **Note**: The live demo at [www.ticketing-app-proj.store](https://www.ticketing-app-proj.store) is currently **not active**.

---

## What is This?

This is a full-stack ticket marketplace where users can list tickets for events, browse available tickets, and purchase them using Stripe payments. Think of it as a simplified StubHub or Ticketmaster.

But here's what makes it interesting: **it's not a monolith**. The entire application is split into independent microservices that communicate asynchronously through events. Each service has its own database, its own codebase, and can be deployed independently.

This project demonstrates real-world patterns you'd find in production systems at companies running distributed architectures.

---

## Why This Project Exists

This is a learning project built to understand and demonstrate:

- **Microservices Architecture** - How to break down a monolith into independently deployable services
- **Event-Driven Design** - Async communication patterns between services
- **Distributed Data Management** - Database-per-service pattern and eventual consistency
- **Cloud-Native Development** - Containerization, orchestration, and deployment at scale
- **Modern DevOps** - CI/CD pipelines, automated testing, and infrastructure as code

It's based on a comprehensive microservices course and represents months of learning condensed into a working application.

---

## Architecture at a Glance

The platform is composed of **6 microservices**:

```
┌─────────────────────────────────────────────────────────┐
│                    NGINX Ingress                        │
│              (Traffic routing & load balancing)         │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌─────▼─────┐      ┌────▼────┐
   │  Auth   │      │  Tickets  │      │ Orders  │
   │ Service │      │  Service  │      │ Service │
   └────┬────┘      └─────┬─────┘      └────┬────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
              ┌───────────▼───────────┐
              │     NATS Streaming    │
              │      (Event Bus)      │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌─────▼─────┐      ┌────▼────────┐
   │Payments │      │Expiration │      │   Client    │
   │ Service │      │  Service  │      │  (Next.js)  │
   └─────────┘      └───────────┘      └─────────────┘
```

### The Services

**Auth Service**
- Handles user registration, login, and authentication
- Issues and validates JWT tokens
- Manages user sessions

**Tickets Service**
- Create and manage event ticket listings
- Track ticket availability
- Prevent updates to reserved tickets

**Orders Service**
- Orchestrates the order lifecycle
- Implements 15-minute order expiration window
- Coordinates between tickets and payments

**Payments Service**
- Processes payments via Stripe integration
- Validates payment authenticity
- Completes orders after successful payment

**Expiration Service**
- Monitors order expiration timers
- Automatically cancels unpaid orders after 15 minutes
- No HTTP interface - purely event-driven

**Client (Frontend)**
- Server-side rendered Next.js application
- Handles all user interactions
- Integrates Stripe checkout flow

### How They Work Together

Services don't make direct HTTP calls to each other. Instead, they communicate through **events** using NATS Streaming Server:

1. **User creates an order** → Orders service publishes `order:created` event
2. **Tickets service** receives the event and reserves the ticket
3. **Expiration service** receives the event and schedules an expiration job
4. **Payments service** receives the event and prepares to accept payment
5. If payment comes through → Order completes
6. If 15 minutes pass → Order automatically cancels and ticket is released

This event-driven approach ensures services remain decoupled and can scale independently.

---

## Technology Stack

### Backend Services
- **Node.js** + **TypeScript** for type-safe server-side code
- **Express.js** for REST APIs
- **MongoDB** for data persistence (one database per service)
- **NATS Streaming** for event bus and async messaging
- **Redis** + **Bull** for job queues (expiration service)
- **Stripe** for payment processing
- **JWT** for stateless authentication

### Frontend
- **Next.js** for server-side rendering and routing
- **React** for UI components
- **Bootstrap** for styling
- **Axios** for HTTP requests

### Infrastructure & DevOps
- **Docker** for containerization
- **Kubernetes** for container orchestration
- **Skaffold** for local development workflow
- **GitHub Actions** for CI/CD pipelines
- **DigitalOcean Kubernetes** for cloud hosting
- **NGINX Ingress Controller** for traffic routing

### Testing
- **Jest** for unit and integration tests
- **Supertest** for HTTP endpoint testing
- **MongoDB Memory Server** for isolated test databases

---

## Key Features & Patterns

### Microservices Patterns
- **Database per Service** - Complete data isolation, no shared databases
- **Event Sourcing** - Services communicate through domain events
- **Saga Pattern** - Distributed transactions across multiple services
- **API Gateway** - Single entry point via NGINX Ingress
- **Service Discovery** - Kubernetes handles service networking

### Engineering Practices
- **Optimistic Concurrency Control** - Version tracking prevents race conditions
- **Automated Testing** - CI pipeline runs tests on every PR
- **Automated Deployment** - CD pipeline deploys on merge to main
- **Common Library** - Shared code published as npm package (`@idoberktickets/common`)
- **Type Safety** - Full TypeScript across all services
- **Error Handling** - Centralized error middleware and custom error classes

### Security
- JWT tokens in HTTP-only cookies
- Password hashing with bcrypt
- Input validation on all endpoints
- Authorization middleware
- Kubernetes secrets management
- HTTPS/TLS at ingress level

---

## Project Structure

```
ticketing/
├── client/                      # Next.js frontend
│   ├── pages/                   # Page components and routes
│   ├── components/              # Reusable UI components
│   └── api/                     # API client utilities
│
├── services/
│   ├── auth/                    # Authentication service
│   ├── tickets/                 # Tickets management service
│   ├── orders/                  # Orders orchestration service
│   ├── payments/                # Payment processing service
│   ├── expiration/              # Order expiration worker
│   └── common/                  # Shared npm library
│
├── infra/
│   ├── k8s/                     # Shared Kubernetes manifests
│   ├── k8s-dev/                 # Development configs
│   └── k8s-prod/                # Production configs
│
├── .github/workflows/           # CI/CD pipeline definitions
└── skaffold.yaml               # Local development orchestration
```

Each service follows a similar structure:
```
service/
├── src/
│   ├── routes/                  # Express route handlers
│   ├── models/                  # MongoDB/Mongoose models
│   ├── events/                  # Event publishers and listeners
│   ├── middlewares/             # Custom middleware
│   └── index.ts                 # Service entry point
├── Dockerfile
└── package.json
```

---

## Getting Started

### Prerequisites

You'll need these tools installed:
- **Docker Desktop** with Kubernetes enabled
- **kubectl** CLI
- **Skaffold** CLI
- **Node.js** 14 or higher
- A **Stripe account** (free tier works)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/idoberk/ticketing.git
   cd ticketing
   ```

2. **Set up Kubernetes secrets**
   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_secret_key
   kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_your_key
   ```

3. **Configure local domain**

   Add to your hosts file (`/etc/hosts` on Mac/Linux or `C:\Windows\System32\drivers\etc\hosts` on Windows):
   ```
   127.0.0.1 ticketing.dev
   ```

4. **Start the application**
   ```bash
   skaffold dev
   ```

5. **Open in browser**

   Navigate to `https://ticketing.dev` (accept the self-signed certificate warning)

That's it! All services, databases, and the frontend will spin up in your local Kubernetes cluster.

### Running Tests

Each service has its own test suite:

```bash
# Navigate to any service
cd services/auth

# Run tests
npm test

# Run tests in watch mode
npm test -- --watchAll
```

---

## CI/CD Pipeline

The project uses **GitHub Actions** for automated testing and deployment:

### Pull Requests
- Automatically runs test suites for all modified services
- Tests must pass before merging

### Merges to Main Branch
- Builds Docker images for updated services
- Pushes images to Docker Hub
- Updates Kubernetes deployments
- Performs rolling restarts

This ensures every change is tested and deployed automatically - no manual deployment steps.

---

## What I Learned Building This

This project taught me:

✅ **Microservices aren't just small services** - They require careful design around data consistency, communication patterns, and failure handling

✅ **Event-driven architecture is powerful but complex** - Async communication solves coupling issues but introduces eventual consistency challenges

✅ **Kubernetes is a game-changer** - Container orchestration handles deployment, scaling, and service discovery automatically

✅ **Testing distributed systems is hard** - Each service needs isolated tests, but you also need to think about integration points

✅ **DevOps matters** - Good CI/CD pipelines make iteration faster and deployments safer

✅ **TypeScript everywhere is worth it** - Type safety across frontend and backend catches bugs early

---

## Challenges & Trade-offs

**Complexity vs Scalability**
Microservices add significant complexity compared to a monolith. This architecture makes sense for large teams and scalable systems, but might be overkill for smaller projects.

**Eventual Consistency**
Services have their own databases, so data consistency happens eventually through events. This requires careful handling of race conditions and out-of-order messages.

**Testing Challenges**
Testing distributed systems requires mocking event publishers/listeners and thinking about failure scenarios across service boundaries.

**Operational Overhead**
Managing multiple deployments, databases, and message queues requires more infrastructure knowledge than a simple monolith.

---

## Future Enhancements

Some ideas for extending this project:

- Add real-time notifications using WebSockets
- Implement search and filtering for tickets
- Add user reviews and ratings
- Build an admin dashboard
- Add analytics and monitoring (Prometheus, Grafana)
- Implement API rate limiting
- Add caching layer with Redis
- Support multiple payment providers

---

## Contributing

This is primarily a learning project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest improvements
- Submit pull requests
- Use this as a reference for your own projects

---

## Acknowledgments

This project was built following Stephen Grider's excellent [Microservices with Node.js and React](https://www.udemy.com/course/microservices-with-node-js-and-react/) course on Udemy. It represents a comprehensive journey through modern microservices architecture.

Special thanks to the open-source community for the amazing tools that made this possible.

---

## License

This project is for educational purposes. Feel free to use it as a reference for your own learning.

---

## Contact

Built by [Ido Berkovits](https://github.com/idoberk)

If you found this helpful or have questions, feel free to reach out!
