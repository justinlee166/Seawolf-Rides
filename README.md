# Seawolf Rides

## Overview

Seawolf Rides is a mobile-first carpool coordination platform for the Stony Brook community, developed for CSE 416 — Software Engineering. It is designed to help drivers and riders plan recurring or scheduled commutes by comparing schedules, travel direction, route compatibility, and estimated pickup detour. The system will recommend practical matches; it will not automatically dispatch or assign rides.

## Core Features

The planned semester scope includes:

- Stony Brook email-based authentication and user profiles
- Driver and rider commute profiles for planned and recurring travel
- Deterministic schedule, location, route, and detour matching
- Ranked recommendations controlled by driver seat and detour preferences
- Ride request accept, reject, and cancel flows
- Basic messaging and persistent shared data
- External routing integration

These are requirements, not claims of implemented functionality. Stripe cost sharing and Trip Mode are stretch goals; on-the-go matching is a major reach goal.

## Technology Stack

The current technical direction is React Native with Expo and TypeScript for the mobile client, Firebase as the likely authentication and shared-data platform, and an external routing API. These choices remain provisional until the team agrees on exact Firebase services, backend boundaries, and a routing provider. Matching will begin with deterministic, independently testable rules rather than machine learning.

## Repository Structure

```text
.
├── README.md                 # Project homepage and current status
└── docs/
    ├── requirements.md       # Preserved M1 proposal and requirements
    ├── design.md             # M2 architecture and technical design
    └── architecture.mmd      # Editable Mermaid architecture diagram
```

Application source and CI configuration have not been initialized, so no empty application directories or placeholder workflows are included.

## Getting Started

Clone the repository and review the documentation:

```bash
git clone <repository-url>
cd <repository-directory>
```

There are no verified install, run, test, lint, or build commands yet because the application has not been initialized. Those commands must be added when the M2 prototype and CI skeleton are created.

## Documentation

- [M1 proposal and requirements](docs/requirements.md)
- [M2 design](docs/design.md)
- [Editable architecture diagram](docs/architecture.mmd)

## Development Status

The project is transitioning from M1 (proposal and requirements) to M2 (design and setup). The M1 requirements, M2 design, and architecture source are documented. Application scaffolding, a runnable minimal prototype, external-service configuration, and CI for lint, test, and build remain to be completed and verified.

## Team

| Team member | Primary role | Responsibilities |
|---|---|---|
| Giovanni Vitale (Gio) | Backend Engineer | APIs, application logic, authentication, and database integration |
| Justin Lee | Matching & Geospatial Engineer | Matching logic, schedule and location compatibility, routing integration, and detour calculations |
| Kenny Wong | Platform & Integration Engineer | Database design, messaging/notifications, deployment, CI/CD, and system integration |
| Phireyaanth Poobalaraj (Ray) | Mobile / Frontend Engineer | Mobile UI, navigation, screens, client-side state, and overall UX |
