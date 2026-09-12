# Seawolf Rides

Seawolf Rides is a mobile-first carpool coordination application for the Stony Brook community, developed for CSE 416 — Software Engineering. The project focuses on helping commuters plan rides ahead of time, find people with compatible routes and schedules, and turn compatible individual commutes into shared commutes.

**Current milestone:** Milestone 1 — Proposal and Requirements

## Problem

Many Stony Brook commuters travel from similar areas to campus at similar times, but they do not have a structured way to determine whether sharing a ride is practical. Friends, group chats, Discord, Reddit, and word of mouth can introduce commuters, but they do not establish whether two people are traveling close enough to the same route at compatible times.

Commercial rideshare services can be expensive and address a different need. Seawolf Rides is not intended to replace Uber or Lyft; it is intended to connect people who are already making similar trips and may want to share commuting costs.

## Product

The primary product is a mobile-first experience for planned and recurring commutes. Drivers and riders describe when and where they expect to travel, and the system recommends compatible commuters based on route and schedule information. Users remain in control: the system recommends matches rather than automatically assigning rides.

## Core User Flow

```text
Driver or rider creates a planned or recurring commute
                         ↓
System compares schedules and routes
                         ↓
Compatible commuters are recommended
                         ↓
Rider requests a ride
                         ↓
Driver accepts or rejects
                         ↓
Connected users coordinate the ride
```

## Target Users

### Drivers

A driver is a Stony Brook commuter who already plans to drive to or from campus, has one or more available seats, and may be willing to make a limited detour to pick up another commuter. Drivers should control how much additional travel they are willing to accept and may offset some gas, toll, or parking costs through cost sharing.

### Riders

A rider is a Stony Brook commuter who needs a planned or recurring ride and wants to find someone already traveling along a compatible route. A shared commute may offer a less expensive alternative to a commercial rideshare service.

## Core Semester Scope

### Accounts and Identity

- Account creation
- Login and logout
- Persistent authentication or session
- Stony Brook email verification
- Basic user profile

A verified `@stonybrook.edu` address establishes community affiliation. It does not, by itself, prove that a user is currently enrolled as a student.

### Commute Profiles

Users should be able to create and manage commute profiles containing information such as:

- Driver or rider role
- Origin and destination
- Recurring days
- Departure time and/or arrival time
- Time flexibility
- Active or inactive status

Drivers may additionally specify available seats and their maximum acceptable detour.

### Matching and Discovery

The matching system should:

1. Filter obviously incompatible commutes using schedule and location information.
2. Evaluate schedule compatibility.
3. Evaluate route compatibility.
4. Estimate the additional driver detour.
5. Reject matches above the driver's maximum detour.
6. Rank the remaining compatible matches.

Users should then be able to review recommendations using relevant information such as an approximate starting area, schedule compatibility, estimated detour, and seat availability.

### Ride Requests

The planned basic request states are:

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
```

The detailed ride lifecycle and whether an acceptance applies to one ride or a recurring relationship remain open design questions.

### Messaging

Basic messaging is planned so connected users can coordinate pickup details, timing, delays, ride details, and cost sharing. Messaging is part of the semester scope, but it is not required to prove the first end-to-end MVP.

### Mobile-First Experience

Seawolf Rides is designed as a mobile-first application. Its main interactions—planning rides, checking matches, responding to requests, coordinating pickup, and receiving ride-related updates—should work well on a phone.

## Matching Concept

Route and schedule compatibility is the core technical feature. The application should eventually consider recurring days, departure and arrival timing, time flexibility, driver and rider origins, destination, seat availability, and the driver's maximum detour.

For example:

```text
Driver normal commute:       72 minutes
Commute with rider pickup:   79 minutes
Additional detour:            7 minutes
Driver maximum detour:       10 minutes

Result: compatible
```

The current preference is to begin with explicit, deterministic matching rules rather than machine learning.

## Privacy

Exact home locations should not be exposed to unrelated or unmatched users. Before a match is accepted, the mobile app may show an approximate area such as `Flushing, Queens`. After users connect, they can privately coordinate a specific pickup location.

The precise location-sharing model—including what becomes visible and when—is still open and requires further product and privacy decisions.

## Milestone 3 MVP

The expected Milestone 3 MVP is the thinnest meaningful end-to-end demonstration of the product's core idea:

```text
Driver signs in → Driver creates commute

Rider signs in  → Rider creates commute

System evaluates route + schedule compatibility
                         ↓
Rider sees compatible driver
                         ↓
Core data persists
```

Ride requests, messaging, payments, Trip Mode, advanced notifications, ratings, and on-the-go matching are not required to prove this first MVP unless the project scope changes.

## Stretch Features

### Stripe Cost Sharing

Stripe-based cost sharing is under consideration as a stretch feature, not part of the core MVP. The goal would be to let a rider make a suggested trip contribution toward gas, tolls, or parking—not to create a commercial taxi fare or driver earnings platform.

One possible future flow is:

```text
Driver suggests trip contribution
                 ↓
Rider accepts ride
                 ↓
Rider contributes toward gas, tolls, or parking
                 ↓
Payment is handled through Stripe
```

Stripe Connect may be relevant if money needs to move between users, but no Stripe functionality has been selected or implemented.

### Trip Mode

Trip Mode is a possible supporting feature for automatic ride updates. A parked driver could start a trip and allow the system to send events such as "Trip started," updated pickup ETAs, approximate ten- and five-minute notices, and "Driver has arrived."

These should be system-generated trip events rather than messages a driver must type. Trip Mode is not implemented and is not required for the core MVP.

## Reach Goal: On-the-Go Matching

A larger reach goal is to extend matching to rides arranged close to departure time—for example, when plans change, a driver leaves campus with an empty seat, or a rider unexpectedly needs transportation. Planned and recurring ride matching remains the primary purpose of Seawolf Rides, and on-the-go matching must not delay or compromise that experience.

### Driver Safety — Research Required

Anything intended for use during active driving must minimize driver interaction. A moving driver should not need to type messages, browse matches, manage complex screens, or repeatedly interact with a phone.

Future research may consider driving-safe notifications, automatic trip status messages, voice interaction, Apple CarPlay, and Android Auto. These capabilities are reach goals only; support is not currently available or implemented.

## Out of Scope for Core v1

The current core project does not aim to build:

- Uber-style automatic dispatch
- A commercial taxi marketplace
- Automatic fares or dynamic pricing
- Turn-by-turn navigation
- Full live vehicle tracking
- A driver earnings platform
- Background-check infrastructure
- Insurance-verification infrastructure
- Machine-learning matching
- Separate native Swift and Kotlin applications
- A custom road-network or maps system

Some related ideas may be considered later as stretch features or research topics, but they are not core commitments.

## Team Responsibilities

### Gio — Backend Engineer

- APIs
- Application and business logic
- Authentication
- Database integration

### Justin — Matching & Geospatial Engineer

- Matching algorithm
- Maps and routing integration
- Location compatibility
- Schedule compatibility
- Detour calculations

### Kenny — Platform & Integration Engineer

- Database design
- Messaging and notifications
- Deployment
- CI/CD
- System integration

### Ray — Mobile / Frontend Engineer

- Mobile UI
- Navigation
- Screens
- Client-side state
- Overall UX

These are primary ownership areas, not isolated silos. Everyone participates in architecture discussions, code review, testing, and integration.

## Current Direction and Decisions

- The product is mobile-first and focused on the Stony Brook community.
- Planned and recurring rides are the primary use case.
- Route and schedule compatibility is the core technical feature.
- The system recommends matches rather than automatically assigning them.
- Saving money through shared commuting is part of the motivation, not a commercial taxi model.
- On-the-go matching is a reach goal.
- Driver interaction while moving should be minimized.

### Current Technical Preferences

Implementation has not started, so these are preferences rather than confirmed technology choices:

- React Native
- Expo
- TypeScript
- PostgreSQL
- Mapbox
- Deterministic matching

## Open Questions

- Who exactly can register?
- Can one user create both driver and rider commutes?
- Is Stony Brook always one endpoint in v1?
- How should commute time flexibility be represented?
- What exactly defines schedule compatibility?
- What exactly defines route compatibility?
- Does accepting a ride create a recurring relationship or a single ride instance?
- Can multiple riders join one driver's commute?
- When does messaging become available?
- What precise location information becomes visible after matching?
- Which Stripe or payment functionality, if any, is realistic for the semester?
- How much Trip Mode or on-the-go functionality is realistic after the core product works?

## Why This Is a Semester Project

Seawolf Rides goes beyond basic data-entry screens. The team must integrate mobile development, backend APIs, authentication, persistent shared data, and third-party geospatial and routing services. The matching feature requires concrete definitions for route proximity, schedule compatibility, detour limits, and ranking.

Later flows introduce ride-request state, messaging, privacy decisions, and potential concurrency when multiple riders request limited seats. The system must also handle third-party API failures and be tested, deployed, and integrated across team-owned components.

AI can accelerate implementation, but the team still has to define matching behavior, privacy rules, ride state, edge cases, architecture, testing, and product tradeoffs.

## Development

Implementation and development setup have not started. Setup, run, and test instructions will be added here once the repository contains the corresponding code and configuration.
