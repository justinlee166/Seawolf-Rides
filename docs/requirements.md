# Seawolf Rides

> **Milestone 1 record:** This document preserves the proposal and requirements developed for M1. It describes intended product behavior, not implementation status. The current architecture and technical plan are maintained in [design.md](design.md).

Seawolf Rides is a **mobile-first carpool coordination application for the Stony Brook community**, developed for CSE 416 — Software Engineering.

The app helps commuters plan rides ahead of time, find people with compatible routes and schedules, and turn similar individual commutes into shared commutes.

**Current milestone:** Milestone 1 — Proposal and Requirements

---

## Problem

Many Stony Brook commuters travel from similar areas at similar times, but there is no structured way to determine whether sharing a ride is actually practical.

Students already try to solve this informally through:

- friends and classmates,
- group chats,
- Discord,
- Reddit,
- word of mouth.

These channels can help someone find another commuter, but they do not automatically answer the harder questions:

- Are we traveling on the same days?
- Are our departure or arrival times compatible?
- Is the rider actually close to the driver's route?
- How much additional detour would the pickup require?

A student may need to contact several people before finding someone whose route and schedule actually work.

Commercial rideshare services solve a different problem and may be expensive for repeated commuting.

Seawolf Rides focuses on commuters who are **already making similar trips** and makes finding a compatible person easier.

> The problem is not simply finding someone nearby. It is finding someone traveling in the same direction, at a compatible time, with a practical pickup.

---

## Product

Seawolf Rides is primarily designed for **planned and recurring rides**, not instant commercial dispatch.

Users describe when and where they expect to travel. The system then evaluates route and schedule compatibility and recommends commuters who could realistically share the trip.

The system recommends matches rather than automatically assigning people to one another.

The main product idea is:

> **Schedule compatibility + route compatibility → practical shared commute**

The goal is to help users:

- plan rides ahead of time,
- find compatible commuters without manually searching through many people,
- coordinate recurring carpools,
- and potentially reduce commuting costs together.

---

## Target Users

### Drivers

A driver is a Stony Brook commuter who already plans to drive to or from campus and may have unused seats.

Drivers want to:

- fill an available seat,
- control how much additional detour they are willing to accept,
- find dependable recurring riders,
- potentially offset gas, toll, or parking costs.

### Riders

A rider is a Stony Brook commuter who needs transportation to or from campus.

Riders want to:

- find drivers whose routes are actually compatible,
- find rides that fit their schedules,
- avoid repeatedly searching through group chats or posts,
- reduce reliance on expensive commercial rideshares,
- find dependable recurring transportation.

---

## Basis for the User Needs

These requirements are currently based on our team's understanding of the commuting problem and **informal observations of how university students already look for rides through online communities such as Reddit, student chats, and similar forums**.

Students already attempt to connect with people traveling between similar locations. The difficult part is finding the specific person whose:

- route,
- day,
- timing,
- available seats,
- and willingness to detour

all line up.

Seawolf Rides is intended to automate that filtering and matching process.

These observations are **not being presented as formal user-study results**. More structured user feedback can be collected later in the project.

---

## User Stories

### Driver

> As a driver, I want to set my available seats and maximum detour so that I only receive practical rider matches.

### Rider

> As a rider, I want to find drivers whose routes and schedules match mine so that I can plan a realistic commute.

### Matched Commuter

> As a matched commuter, I want to coordinate pickup details so that the ride can actually happen.

### Additional Working Stories

> As a commuter, I want my commute information to persist so that I do not have to recreate it every time I open the app.

> As a rider, I want recommended drivers ranked by compatibility so that I do not have to manually contact many people.

> As a commuter, I want my exact home location protected from unmatched users so that sensitive location information is not unnecessarily exposed.

---

## Core User Flow

```text
Create account
      ↓
Create planned or recurring commute
      ↓
System compares schedules and routes
      ↓
Compatible commuters are recommended
      ↓
Rider sends ride request
      ↓
Driver accepts or rejects
      ↓
Connected users coordinate pickup
```

Matching occurs before users need to manually contact one another.

---

# V1 Requirements

The following requirements define the current **core semester scope**.

## Accounts and Identity

Users should be able to:

- create an account,
- log in and log out,
- remain authenticated across reasonable app restarts,
- verify a Stony Brook email address,
- maintain a basic user profile.

A verified `@stonybrook.edu` email establishes Stony Brook community affiliation. It does not by itself prove current student enrollment.

---

## Commute Profiles

Users should be able to create and manage a driver or rider commute.

A commute should contain information such as:

- driver or rider role,
- origin,
- campus destination,
- recurring days,
- departure time and/or arrival time,
- time flexibility,
- active or inactive status.

Drivers should additionally be able to specify:

- available seats,
- maximum acceptable detour.

---

## Matching and Discovery

The system should:

1. Filter obviously incompatible commutes by day and timing.
2. Filter candidates using general location information.
3. Evaluate schedule compatibility.
4. Evaluate route compatibility.
5. Estimate the driver's additional pickup detour.
6. Reject candidates above the driver's maximum detour.
7. Rank the remaining compatible matches.
8. Present recommended matches to the rider.

Useful match information may include:

- approximate starting area,
- overlapping commute days,
- timing compatibility,
- estimated additional detour,
- available seats.

---

## Ride Requests

A rider should be able to send a request to a recommended driver.

A driver should be able to:

- view a pending request,
- accept it,
- reject it.

A rider should be able to cancel a request when applicable.

Current planned request states are:

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
```

The exact recurring-ride lifecycle will be finalized during later design work.

---

## Messaging

Connected users should be able to exchange basic messages for coordination.

Examples include:

- exact pickup location,
- timing,
- delays,
- ride details,
- cost-sharing discussion.

Advanced chat features such as typing indicators, media sharing, or read receipts are not required.

---

## Mobile-First Experience

Seawolf Rides is being designed as a **mobile-first application**.

The core workflow should be practical on a phone, including:

- creating a commute,
- checking matches,
- responding to requests,
- coordinating pickup,
- receiving ride-related updates.

---

## Quality Requirements

The core product should also satisfy several non-functional requirements.

### Usability

- The main ride-planning workflow should be practical to complete from a mobile device.
- Common actions should not require unnecessary steps.

### Persistence

- User, commute, and ride-request data should persist between sessions.

### Privacy

- Exact residential locations should not be exposed to unrelated or unmatched users.

### Reliability

- A failed routing or external-service request should not crash the mobile application.
- Duplicate actions should not corrupt ride-request state.

### Testability

- Schedule compatibility, route compatibility, and detour calculations should be testable independently from the UI.
- Matching behavior should initially use deterministic rules so results can be explained and tested.

---

# Matching Workflow

The expected system workflow is:

```text
Driver + rider create commute profiles
                ↓
        Filter by day / time
                ↓
      Filter by general location
                ↓
       Check route compatibility
                ↓
      Calculate driver detour
                ↓
    Remove incompatible candidates
                ↓
        Rank remaining matches
                ↓
       Rider reviews recommendations
                ↓
          Rider sends request
                ↓
        Driver accepts / rejects
                ↓
         Users coordinate pickup
```

This allows the system to reduce the number of expensive routing calculations by first eliminating clearly incompatible candidates.

---

## Matching Example

Route and schedule compatibility are the core technical features.

Example:

```text
Driver normal commute:       72 minutes
Commute with rider pickup:   79 minutes
Additional detour:            7 minutes
Driver maximum detour:       10 minutes

Result: compatible
```

Conceptually:

```text
detour =
route_with_pickup_time
-
normal_driver_route_time
```

If the calculated detour is within the driver's acceptable limit and the schedules are compatible, the rider can be considered a potential match.

The current direction is to begin with explicit deterministic matching rules rather than machine learning.

---

# Privacy

Seawolf Rides handles location information, so privacy is part of the product requirements.

Current guiding principle:

> Exact home locations should not be exposed to unmatched users.

Before users connect, the app may display an approximate area such as:

```text
Flushing, Queens
```

instead of an exact residential address.

After a ride is accepted, users can privately coordinate a more specific pickup location.

The exact visibility rules will be finalized during later design work.

---

# Core Semester Scope

The semester version currently aims to include:

- mobile application,
- Stony Brook account verification,
- driver and rider commute profiles,
- planned and recurring rides,
- route compatibility,
- schedule compatibility,
- detour calculation,
- ranked match recommendations,
- ride requests,
- accept/reject/cancel workflow,
- basic messaging,
- persistent shared data,
- external map/routing integration.

The planned carpool experience is the priority.

---

# Milestone 3 MVP

The Milestone 3 MVP should be the thinnest meaningful end-to-end version that proves the main product concept.

```text
Driver signs in
      ↓
Driver creates commute

Rider signs in
      ↓
Rider creates commute

System evaluates
route + schedule compatibility
      ↓
Rider sees compatible driver
      ↓
Core data persists
```

This proves that:

- the mobile client works,
- authentication works,
- shared data works,
- commute creation works,
- matching works,
- routing integration works,
- the core product can function end to end.

Ride requests, messaging, Stripe, Trip Mode, ratings, and on-the-go matching are not required to prove the initial MVP.

---

# Stretch Features

These are not required for the core version.

## Stripe Cost Sharing

Stripe-based cost sharing may be explored after the main ride workflow works.

The purpose would be to allow a rider to make a suggested contribution toward costs such as:

- gas,
- tolls,
- parking.

Possible flow:

```text
Driver suggests contribution
            ↓
Rider accepts ride
            ↓
Rider contributes toward trip costs
            ↓
Payment processed through Stripe
```

This should be treated as **cost sharing**, not a commercial taxi fare.

Stripe Connect may be relevant if money needs to move between users, but the exact payment design has not been finalized.

---

## Trip Mode

Trip Mode is another possible stretch feature.

Before driving, a parked driver could press:

```text
Start Trip
```

The application could then automatically send useful ride-status events such as:

- Trip started
- Updated pickup ETA
- Driver is approximately 10 minutes away
- Driver is approximately 5 minutes away
- Driver has arrived

The driver should not need to type these messages while operating the vehicle.

---

# Reach Goal: On-the-Go Ride Matching

A larger reach goal is to support rides arranged much closer to departure time.

Possible examples include:

- a student's plans unexpectedly changing,
- a driver leaving campus with an empty seat,
- a normal rider cancelling,
- a student unexpectedly needing transportation.

This would extend the same route-and-schedule matching concept to more spontaneous trips.

However:

> Planned and recurring ride matching remains the primary product.

On-the-go matching should only be pursued after the planned experience works reliably.

---

## Driver Safety — Research Required

Any feature intended for use during active driving must minimize driver interaction.

A moving driver should not need to:

- type messages,
- browse potential riders,
- manage complicated screens,
- repeatedly interact with a phone.

Possible future areas of research include:

- automatic trip updates,
- voice interaction,
- Apple CarPlay,
- Android Auto,
- safe notification patterns.

These are research/reach goals and are not currently implemented.

---

# Explicitly Out of Core v1

The current core project does not aim to build:

- Uber-style automatic dispatch,
- a commercial driver marketplace,
- automatic commercial fares,
- dynamic pricing,
- turn-by-turn navigation,
- full live vehicle tracking,
- background-check infrastructure,
- insurance-verification infrastructure,
- machine-learning matching,
- separate native Swift and Kotlin applications,
- our own maps or road-network system.

These boundaries exist to keep the semester project focused on the core matching and coordination problem.

---

# Rough Architecture

Our current high-level architecture is:

```text
┌─────────────────────────────┐
│      Mobile Application     │
│    React Native + Expo      │
│                             │
│         Owner: Ray          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   Backend / Business Logic  │
│                             │
│ APIs                        │
│ Authentication              │
│ Ride-request logic          │
│ Application rules           │
│                             │
│         Owner: Gio          │
└──────────┬───────────┬──────┘
           │           │
           ▼           ▼
┌─────────────────┐   ┌────────────────────────┐
│ Firebase / Data │   │    Matching Logic      │
│                 │   │                        │
│ Users           │   │ Schedule compatibility │
│ Commutes        │   │ Location filtering     │
│ Request state   │   │ Detour calculation     │
│ Messaging       │   │ Match ranking          │
│                 │   │                        │
│ Owner: Kenny    │   │ Owner: Justin          │
└─────────────────┘   └────────────┬───────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │ Maps / Routing API  │
                         │                     │
                         │ Geocoding           │
                         │ Route duration      │
                         │ Detour estimates    │
                         │                     │
                         │ Integration: Justin │
                         └─────────────────────┘
```

Firebase is our likely backend/data platform direction. Exact Firebase services and service boundaries will be finalized during Milestone 2.

A final routing provider has not yet been selected.

---

# Team Responsibilities

Each member has a primary ownership area.

These roles are intended to avoid ambiguous ownership such as "everyone will code everything."

## Gio — Backend Engineer

Primary responsibilities:

- APIs
- Application and business logic
- Authentication
- Database integration

## Justin — Matching & Geospatial Engineer

Primary responsibilities:

- Matching algorithm
- Maps and routing integration
- Location compatibility
- Schedule compatibility
- Detour calculations

## Kenny — Platform & Integration Engineer

Primary responsibilities:

- Database design
- Messaging and notifications
- Deployment
- CI/CD
- System integration

## Ray — Mobile / Frontend Engineer

Primary responsibilities:

- Mobile UI
- Navigation
- Screens
- Client-side state
- Overall UX

These are primary ownership areas, not isolated silos.

Everyone will still participate in:

- architecture discussions,
- code review,
- testing,
- integration,
- shared product decisions.

---

# Current Decisions

The team is currently aligned on the following:

- Seawolf Rides is a mobile-first application.
- The initial community is Stony Brook.
- Planned and recurring rides are the primary use case.
- Route and schedule compatibility are the core technical features.
- The system recommends matches rather than automatically assigning rides.
- Shared commuting and potential cost savings are part of the product motivation.
- On-the-go matching is a reach goal.
- Driver interaction while moving should be minimized.

---

# Current Technical Direction

These are working technical choices and may be refined during Milestone 2:

- React Native
- Expo
- TypeScript
- Firebase for authentication and shared application data
- External map/routing provider, likely Mapbox or a similar service
- Deterministic route/schedule matching

Implementation details should not be considered final until the design phase.

---

# Open Questions

Several product decisions still need to be finalized during design.

- Who exactly can register?
- Can one user maintain both driver and rider commutes?
- Is Stony Brook always one endpoint in v1?
- How should time flexibility be represented?
- What exactly defines schedule compatibility?
- What exactly defines route compatibility?
- What default detour limits should exist?
- Does accepting a request establish one ride or a recurring relationship?
- How should individual exceptions to recurring rides work?
- Can multiple riders join one driver's commute?
- When should messaging become available?
- What exact location information becomes visible after matching?
- Which Stripe functionality, if any, is realistic during the semester?
- How much Trip Mode functionality is realistic?
- How much on-the-go functionality is realistic after the core product works?

These are open design questions, not missing requirements.

---

# Why This Requires a Semester

Seawolf Rides is more than a basic CRUD application.

The project combines:

- mobile development,
- backend APIs,
- authentication,
- persistent shared data,
- Firebase integration,
- third-party routing APIs,
- geospatial matching,
- schedule matching,
- ride-request state,
- messaging,
- location privacy,
- testing,
- deployment,
- system integration.

The team must also make product and engineering decisions such as:

- What makes two commutes actually compatible?
- How much additional detour is reasonable?
- What location information should unmatched users see?
- How should recurring rides be represented?
- What happens when multiple riders request the final available seat?
- What happens when an external routing service fails?
- How do we test matching logic independently from the map provider?

These decisions require requirements work, design, implementation, integration, testing, and iteration across the semester.

AI can accelerate implementation, but it cannot decide the correct matching rules, privacy model, ride lifecycle, architecture, or product tradeoffs for the team.

---

# Milestone 1 Artifacts

This README serves as the written Milestone 1 proposal and requirements document.

The Milestone 1 artifacts currently include:

- problem statement,
- target users,
- product proposal,
- user stories,
- functional requirements,
- quality requirements,
- v1 scope,
- explicit out-of-scope items,
- stretch and reach goals,
- matching workflow,
- named team responsibilities,
- rough architecture sketch,
- open design questions,
- semester-scope justification.

The accompanying Milestone 1 presentation summarizes these decisions for the project review.

---

# Development

Implementation and development setup are still being established.

Setup, run, test, and deployment instructions will be added once the corresponding code and configuration exist in the repository.
