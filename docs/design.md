# Seawolf Rides — Milestone 2 Design

## 1. Purpose and Scope

This document translates the [Milestone 1 proposal and requirements](requirements.md) into a technical design that can guide setup and implementation. It defines conceptual components, responsibilities, data and interaction models, privacy constraints, risks, and decisions the team must make. It does not claim that the proposed system is implemented.

The milestones intentionally have different scopes:

- **M2 prototype:** a small, runnable technical foundation proving that the selected client and persistence path can communicate. It is proposed below but is not yet present.
- **M3 MVP:** authentication, driver and rider commute creation, route and schedule compatibility, one displayed match result, and persistent relevant data.
- **Core semester v1:** the M3 path plus ranked recommendations, ride requests, accept/reject/cancel behavior, basic messaging, and the complete planned carpool workflow.

Stripe cost sharing and Trip Mode remain stretch features. On-the-go matching remains a major reach goal. They are not M2 or M3 requirements.

## 2. Architectural Overview

The architecture is organized around responsibilities rather than prematurely fixed deployment units. In particular, “backend/application logic” means trusted validation and business logic; the team still needs to decide whether it runs in a dedicated server, Firebase Cloud Functions or another serverless environment, or a hybrid that also permits carefully authorized direct Firebase client access.

```mermaid
flowchart TB
    User["Stony Brook commuter"]
    subgraph Client["Mobile client — Ray"]
        Mobile["React Native + Expo app\nUI, navigation, client state"]
    end
    subgraph Application["Application and trusted logic — Gio"]
        Boundary["Backend boundary to be selected\nserver, serverless functions, or hybrid"]
        Auth["Authentication and authorization"]
        Requests["Commute and ride-request rules"]
        Messaging["Messaging authorization"]
    end
    subgraph Geo["Matching and routing — Justin"]
        Matching["Deterministic matching engine\nschedule, direction, seats, detour, ranking"]
        RoutingAdapter["Routing adapter"]
    end
    subgraph Platform["Data and platform — Kenny"]
        Firebase[("Likely Firebase services\nauthentication and persistent shared data")]
        CI["Planned CI\nlint, test, build"]
    end
    Routing["External routing provider\nnot yet selected"]
    User --> Mobile
    Mobile -->|"sign in / verify email"| Auth
    Mobile -->|"trusted operations"| Boundary
    Mobile -.->|"possible direct SDK access\nfor authorized operations"| Firebase
    Boundary --> Auth
    Boundary --> Requests
    Boundary --> Messaging
    Boundary -->|"validated reads and writes"| Firebase
    Boundary -->|"match request / candidate data"| Matching
    Matching -->|"route estimates for filtered candidates"| RoutingAdapter
    RoutingAdapter -->|"geocoding, duration, route"| Routing
    Matching -->|"recommendations"| Boundary
    Auth -->|"identity and verification state"| Firebase
    Messaging -->|"authorized messages"| Firebase
    classDef proposed stroke-dasharray: 5 5
    class Boundary,Firebase,Routing,CI proposed
```

The editable source is [architecture.mmd](architecture.mmd). Dashed components or connections represent planned or unresolved implementation choices.

- **Mobile frontend:** collects account and commute input, requests matches, and presents recommendations and coordination workflows. It must not be trusted to enforce authorization or seat limits.
- **Backend/application logic:** validates requests, enforces state transitions and authorization, coordinates matching, and protects operations requiring secrets or atomic updates. Its deployment form is unresolved.
- **Authentication:** establishes identity, verifies an `@stonybrook.edu` email, and supplies identity claims used by authorization. Email verification is not enrollment or safety verification.
- **Persistent data:** retains users, commutes, request state, recommendations if stored, conversations, and messages. Firebase is the likely direction, but services and schema are not selected.
- **Matching engine:** applies deterministic schedule, geographic, direction, seat, detour, and ranking rules independently of the UI and behind a routing abstraction.
- **External routing provider:** supplies geocoding and route/travel-duration estimates. No provider has been selected.
- **Messaging subsystem:** permits basic coordination between authorized connected users. Its storage and delivery mechanism remain open.

## 3. Technology Stack

| Technology | Purpose | Reason for selection | Decision status |
|---|---|---|---|
| React Native | Cross-platform mobile framework | Supports a single mobile-first client codebase | Working direction from M1; not initialized |
| Expo | React Native development and testing tooling | Reduces native setup overhead for a four-person semester team | Working direction from M1; not initialized |
| TypeScript | Client and application language | Static types can keep shared entities and matching interfaces consistent | Working direction from M1; not initialized |
| Firebase | Authentication and persistent shared-data platform | Managed services may reduce infrastructure work and support shared mobile data | Likely direction; exact services and boundaries unresolved |
| Trusted server-side runtime | Protected business logic, routing credentials, and concurrency-sensitive updates | Prevents clients from bypassing critical validation and protects secrets | Required responsibility; server versus serverless unresolved |
| External routing API | Geocoding, route duration, and detour estimates | Avoids building a road-network and navigation engine | Required capability; provider unresolved |
| GitHub Actions | Automated lint, test, and build checks | Fits the existing GitHub repository and makes pull-request checks reproducible | Planned; no workflow exists |

The repository contains no application manifest or configuration proving that any candidate technology is installed or operational.

## 4. Component Responsibilities

| Component | Inputs | Outputs | Responsibility and boundary | Primary owner |
|---|---|---|---|---|
| Mobile client | User input, authenticated session, application data | Validated requests and rendered screens | Mobile UI, navigation, forms, local state, loading/error states; no authoritative access decisions | Ray |
| Authentication/authorization | Credentials, verification state, user identity | Session/identity and access decisions | Authenticate accounts, require verified Stony Brook email where appropriate, and authorize protected operations | Gio, with Kenny on platform rules |
| Application logic | Authenticated commands and stored entities | Validated state changes and responses | Enforce invariants, request transitions, data validation, and orchestration; deployment mechanism remains open | Gio |
| Persistent-data layer | Validated reads/writes | Durable entities and query results | Store shared state, define indexes and access rules, and support safe updates | Kenny |
| Matching engine | Rider commute, candidate driver commutes, route estimates, configured rules | Explainable compatibility results and rankings | Pure deterministic filtering/scoring where possible; no UI or provider-specific logic | Justin |
| Routing adapter | Normalized origins, pickups, destinations | Normalized geocode, route, duration, and error results | Isolate provider API formats, credential handling, limits, and failures from matching rules | Justin, with Gio on backend boundary |
| Ride-request coordinator | User identity, target commutes, current capacity/status | Approved state transition or explicit error | Enforce authorization, prevent duplicates, and handle final-seat concurrency | Gio, with Kenny on transactions |
| Messaging subsystem | Authorized participants, conversation and message data | Persisted messages available to participants | Limit access to allowed users and support basic coordination | Kenny, with Gio on authorization |
| CI pipeline | Source and configuration | Lint, test, and build results | Run reproducible checks on pull requests and the main branch once code exists | Kenny |

Ownership identifies the lead, not an isolated silo. Architecture, reviews, tests, and integration remain shared team work.

## 5. Proposed Data Model

This is a logical model for discussion, not an implemented Firebase schema. Identifiers, collection layout, indexes, retention, and security rules remain to be designed.

| Entity | Important proposed fields | Relationships and notes |
|---|---|---|
| User | id; email; email verification state; display name; profile metadata; created/updated timestamps | Owns zero or more commutes. A user may potentially have both driver and rider commutes; the team must confirm this. |
| Commute | id; owner id; role (driver/rider); private origin; destination; approximate display area; recurring days; departure and/or arrival preference; flexibility; active status; timestamps | Central matching input. Exact coordinates are private; approximate area is separately displayable. Recurrence and one-time/date representation need agreement. |
| Driver settings | commute id; available seats; maximum acceptable detour | Applies only to a driver commute. Units and validation boundaries need agreement. |
| Match/recommendation | rider commute id; driver commute id; compatibility explanation; route estimate metadata; calculated detour; rank or score; evaluated timestamp | May be calculated on demand rather than stored. If stored, it can become stale after commute changes. |
| Ride request | id; rider id; rider commute id; driver id; target driver commute id; status (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`); created/updated timestamps | State transitions require authorization and duplicate/capacity safeguards. An accepted request may represent a recurring relationship or a dated ride; this is unresolved. |
| Conversation | id; participant ids; related ride request or relationship id; active status; timestamps | Access should be limited to eligible connected users. When messaging becomes available is unresolved. |
| Message | id; conversation id; sender id; body; sent timestamp | Belongs to one conversation; advanced chat features are outside core scope. |

Important modeling questions include whether campus must always be one endpoint, how time flexibility and recurring exceptions are represented, whether a recommendation should be persisted, whether accepted requests reserve seats per recurring relationship or per date, and how multiple riders affect capacity.

## 6. Matching and Geospatial Design

The proposed matching pipeline is:

1. Retrieve the relevant active rider commute and candidate driver commutes.
2. Filter candidates to overlapping days and compatible time windows.
3. Filter for plausible geographic compatibility and travel direction.
4. Request route estimates only for promising candidates.
5. Calculate each driver's additional pickup detour.
6. Reject candidates exceeding that driver's maximum acceptable detour or without available seats.
7. Rank the remaining compatible candidates using deterministic, explainable rules.
8. Return recommendations and useful compatibility explanations to the rider.

Conceptually:

```text
added_detour =
  estimated_duration(driver -> pickup -> destination)
  - estimated_duration(driver -> destination)
```

Detour is only one condition. Matching must also consider schedule compatibility, travel direction, and seat availability. The existing M1 illustration is:

```text
Direct driver commute:      72 minutes
Commute including pickup:   79 minutes
Additional detour:           7 minutes
Driver maximum detour:      10 minutes

7 <= 10, so the detour condition passes.
```

These values are illustrative, not measured routing results, and passing this condition alone does not establish a complete match.

Day, time, broad-area, and direction prefilters can eliminate unsuitable candidates before paid or rate-limited routing calls. The team must still agree on exact schedule rules, geographic prefiltering, default thresholds, and a ranking formula; this document does not invent weights or cutoff values.

The matching module should accept normalized domain inputs and a routing interface. Unit tests can supply fixed route estimates or provider failures, allowing schedule logic, detour arithmetic, tie handling, exclusions, and ranking behavior to be tested deterministically without network calls. Separate adapter tests can validate the selected provider's response mapping.

## 7. Proposed Data and API Interactions

These are interaction responsibilities, not implemented endpoint names. Some authorized reads/writes may use Firebase client SDKs directly; trusted operations need server-side validation. The final boundary depends on the architecture decision.

| Interaction | Proposed flow | Validation and authorization |
|---|---|---|
| Register/authenticate | Mobile submits credentials; authentication service establishes identity and email verification state | Restrict protected product access as agreed; never treat a client-provided email flag as authoritative |
| Create/update commute | Mobile submits commute data; trusted rules validate it; data layer persists it | User may modify only owned commutes; validate role, schedule, locations, seats, and detour fields |
| Retrieve commutes | Mobile or matching operation queries only data needed for the use case | Exact origins must not be broadly readable; apply ownership and field-visibility rules |
| Request matches | Authenticated rider selects a commute; application logic retrieves candidates and invokes matching; adapter obtains needed routes | Confirm ownership and active status; keep routing credentials server-side unless the selected provider offers a safe restricted-client pattern |
| Return recommendations | Matching emits compatible results plus explanations; application logic returns privacy-filtered views | Do not expose exact residential locations or unrelated user data |
| Create ride request | Rider selects an eligible recommendation; trusted logic checks identities, status, duplicate state, and capacity | Only the rider can create/cancel their request; only the targeted driver can accept/reject; updates should be atomic where capacity is involved |
| Send/read message | Connected user accesses a conversation and posts or retrieves messages | Verify conversation membership and the required connection/request state on every operation |

The application should use typed request/domain shapes independent of storage documents. That keeps the matching module and mobile views from depending on an unapproved database layout.

## 8. Security and Privacy

Seawolf Rides handles sensitive identity and location data. The design separates:

- **Public or approximate location:** a broad area such as “Flushing, Queens” that may be shown for compatibility context.
- **Private commute location:** exact address or coordinates used for matching and routing, accessible only to authorized processing and the owner.
- **Pickup details:** a specific location shared privately after whatever accepted-connection rule the team approves.

A verified `@stonybrook.edu` address establishes control of a university-domain mailbox. It is not proof of current enrollment, identity beyond that account, driving eligibility, insurance, or a background check. Product language must not imply those assurances.

Authorization must prevent users from reading or changing other users' private commutes, ride requests, conversations, or messages. Request state transitions and final-seat reservations require trusted enforcement rather than client-only checks. Logs and analytics should avoid unnecessary exact coordinates and message content. Data retention and account deletion policies require later definition.

Routing API secrets, privileged Firebase credentials, and other server credentials must not be committed or embedded in a distributable mobile bundle. Environment-specific configuration should be documented using safe example files after services are selected. Firebase security rules, server validation, credential restrictions, and indexes must be implemented and tested before the relevant flows can be called secure.

## 9. Reliability and Edge Cases

| Scenario | Required behavior | Target |
|---|---|---|
| Incompatible schedules | Exclude with an explainable result without calling routing unnecessarily | M3 |
| Opposite travel directions | Exclude even when origins are geographically close | M3 |
| Excessive detour | Exclude when the route-derived addition exceeds the driver's limit | M3 |
| No available seats | Do not recommend or accept a new request against full capacity | M3 for matching; v1 for request enforcement |
| Routing failure or timeout | Return a recoverable unavailable/error state; do not crash or fabricate compatibility | M3 |
| Missing/ambiguous geocode | Ask for correction or mark the commute unevaluable | M3 |
| Duplicate ride requests | Detect and reject or return the existing active request | Core v1 |
| Concurrent final-seat requests | Use a transaction or equivalent trusted atomic operation when accepting | Core v1 |
| Commute edited after matching | Recompute or invalidate stale recommendations before consequential actions | M3 policy; full enforcement by v1 |
| Unauthorized private-data access | Deny access at service/data-rule boundaries, not only in UI | M3 for implemented data; v1 coverage expands with features |

M3 should handle failures along its authentication, commute, matching, routing, and persistence path. Request concurrency and messaging-specific failure modes become mandatory when those core-v1 features are implemented. No latency, availability, or scale guarantee is claimed at this stage.

## 10. M2 Minimal Prototype

**Status: proposed, not implemented or verified.** The repository currently has documentation only.

The deliberately small prototype should initialize an Expo/React Native TypeScript application with one screen. A user action loads one sample commute through the team's selected application/data access path from configured persistent Firebase data and displays role, approximate area, recurring days, and time preference. The sample must not contain a real residential address.

Acceptance criteria:

1. A new developer can follow committed setup instructions and launch the application in the documented environment.
2. The mobile screen renders and clearly distinguishes loading, success, empty, and recoverable error states.
3. The success path reads a persisted sample commute rather than only a hard-coded in-component object.
4. Configuration and credentials are excluded from version control and documented safely.
5. At least one automated test covers data-to-view mapping or the selected application/data boundary.
6. Repository scripts support lint, test, and build/type-check as appropriate, and GitHub Actions runs those exact scripts.
7. A teammate verifies the documented clean-clone workflow.

This prototype proves a technical foundation, not authentication, matching, routing, ride requests, or messaging. Those should not be claimed until separately implemented and verified.

## 11. M1 Requirements to Architecture Mapping

The labels below are descriptive traceability identifiers introduced by this M2 document; they are not original M1 requirement IDs.

| Traceability label | M1 requirement | Responsible component | Planned implementation responsibility | Milestone target |
|---|---|---|---|---|
| AUTH | Account authentication and Stony Brook email verification | Authentication and mobile client | Gio leads auth/application logic; Ray builds client flow; Kenny supports platform configuration | M3 |
| COMMUTE | Create and manage driver/rider commutes | Mobile, application logic, persistent data | Ray forms/UI; Gio validation; Kenny model/storage | M3 |
| SCHEDULE | Schedule compatibility | Matching engine | Justin defines/tests rules with team-approved product decisions | M3 |
| ROUTE | Route and travel-direction compatibility | Matching engine and routing adapter | Justin owns integration and normalized route evaluation | M3 |
| DETOUR | Additional pickup detour calculation and driver limit | Matching engine and routing adapter | Justin owns formula and tests; Gio protects trusted execution boundary | M3 |
| RANK | Ranked, explainable recommendations | Matching engine and mobile client | Justin owns deterministic ranking; Ray presents results | Core v1; basic result in M3 |
| REQUEST | Send, accept, reject, and cancel ride requests | Application logic and persistent data | Gio owns state rules; Kenny owns concurrency/storage integration; Ray owns UI | Core v1 |
| MESSAGE | Basic connected-user messaging | Messaging, data, and mobile client | Kenny leads subsystem; Gio authorization; Ray UI | Core v1 |
| PERSIST | Persistent shared data | Persistent-data layer | Kenny leads schema/platform; Gio integrates application logic | M2 prototype foundation; M3 product data |
| MOBILE | Practical mobile-first workflow | Mobile client | Ray leads, with team usability review | M3 onward |
| PRIVACY | Protect exact locations from unrelated/unmatched users | All boundaries, especially authorization and data rules | Gio and Kenny enforce; Justin minimizes matching exposure; Ray limits display | M3 onward |

## 12. Development and CI Plan

The current repository contains the homepage and documentation only. It has no application source, package manifest, test configuration, or GitHub Actions workflow. CI is therefore **pending**, not passing.

When implementation begins, create only the directories required by the chosen structure—for example, a mobile directory for the Expo app and a backend directory only if a separate backend is selected. Keep provider-independent matching logic separated from UI and routing-adapter code. Document environment configuration without committing secrets.

Development workflow:

1. Create short-lived feature branches from an up-to-date main branch.
2. Open pull requests that connect code to a requirement or design decision.
3. Require at least one teammate review, with the component owner involved for domain-sensitive changes.
4. Run formatting/linting, unit tests, and a reproducible build or type-check locally and in CI.
5. Add focused unit tests for pure matching and validation logic; mock routing at the adapter boundary.
6. Add integration tests for authentication/data rules and the selected persistence path using safe test configuration or emulators where supported.
7. Add an end-to-end smoke test for the M3 path after the components are integrated.

The initial GitHub Actions skeleton should install dependencies with the committed lockfile and run the repository's real lint, test, and build/type-check scripts on pull requests and main. It should be introduced with the application scaffold, not as an empty workflow.

## 13. Open Design Decisions

| Decision | Current working direction | Alternatives | What the team must resolve |
|---|---|---|---|
| Final backend architecture | Trusted logic plus selected direct client access | Dedicated server; Firebase Cloud Functions/serverless; hybrid | Deployment unit, request boundaries, local testing, cost, and ownership |
| Specific Firebase services | Firebase for likely auth and shared data | Auth plus Firestore; Realtime Database; another managed platform | Services, environments, emulator use, rules, indexes, and pricing limits |
| Routing provider | External provider; M1 mentions Mapbox or similar | Mapbox, Google Maps Platform, HERE, other viable provider | Coverage, directions/geocoding features, pricing, quotas, license, mobile/server credential model |
| Schedule compatibility | Deterministic overlapping-day/time rules | Departure windows, arrival deadlines, mixed model | Time representation, time zone, flexibility semantics, inclusive boundaries |
| Geographic prefilter | Broad location and direction filter before routing | Geohash/radius, corridor/bounding box, provider matrix | Privacy-preserving inputs, false negatives, query/index support |
| Thresholds and ranking | Explainable deterministic scoring | Ordered rules, weighted score, lexicographic ranking | Defaults, user controls, tie-breaking, exact formula and tests |
| Recommendation persistence | Calculate on demand unless a use case justifies storage | Persist results with expiry/versioning | Freshness, audit/explanation needs, cost, invalidation behavior |
| Ride representation | Unresolved | Accepted recurring relationship; individual dated rides; parent relationship plus occurrences | Cancellation/exceptions, capacity, history, request semantics |
| Seat reservation | Enforce trusted capacity on acceptance | Reserve on pending request; reserve only per occurrence | Transaction boundary, overbooking behavior, release rules |
| Message authorization | Connected participants only | Access after match, request, or acceptance | Exact enabling state, conversation lifecycle, blocking/reporting expectations |
| Location visibility | Approximate before connection; specific pickup after approved state | Different precision/staged disclosure models | Exact fields, precision, transition state, revocation and retention |
| Mobile testing/distribution | Expo-based development | Expo Go, development builds, store/test distribution | Native dependency needs, supported devices, teammate/professor access |

### Architecture Decisions Requiring Team Agreement

The team has not yet held or recorded an approval meeting for the following choices.

#### Backend execution model

1. **Decide:** whether trusted logic uses a separate server, Firebase Cloud Functions/another serverless platform, or direct Firebase SDK access for selected operations plus trusted server-side logic.
2. **Proposed direction:** evaluate a hybrid because simple owner-scoped reads may fit direct SDK access while matching, routing secrets, ride-request transitions, and capacity checks need a trusted boundary.
3. **Alternatives:** a dedicated server offers explicit API boundaries and runtime control; serverless reduces server operations; direct SDK access simplifies some flows but depends heavily on correctly tested data rules.
4. **Impact:** determines repository layout, APIs, security rules, local development, deployment, integration testing, and Gio/Kenny's interface.
5. **Participants:** Gio, Kenny, Justin, and Ray; Gio and Kenny should jointly document the selected boundary.

#### Firebase service selection

1. **Decide:** which Firebase services, if any, provide identity, persistence, trusted execution, and local emulation.
2. **Proposed direction:** keep Firebase as the leading platform candidate while validating requirements against concrete services.
3. **Alternatives:** a subset of Firebase paired with a custom API/database, or another managed platform if it better satisfies the agreed model.
4. **Impact:** shapes data queries, rules, concurrency, SDK usage, costs, testing, and environment configuration.
5. **Participants:** Kenny and Gio lead; Justin validates matching-query needs and Ray validates mobile SDK implications.

#### Routing provider and credential boundary

1. **Decide:** the provider and which calls originate from trusted application logic versus the mobile app.
2. **Proposed direction:** use a routing adapter from trusted logic for matching-related geocoding/duration requests, subject to provider restrictions.
3. **Alternatives:** Mapbox, Google Maps Platform, HERE, or another provider that satisfies directions, geocoding, licensing, and budget constraints.
4. **Impact:** changes data formats, rate limits, cache policy, secret handling, costs, attribution, and test fixtures.
5. **Participants:** Justin leads evaluation; Gio reviews service integration/security; Kenny reviews cost/deployment; Ray reviews any required client SDK.

#### Matching module boundary

1. **Decide:** the typed contract between application orchestration and Justin's provider-independent matching code.
2. **Proposed direction:** pure filtering/scoring functions receive normalized commutes and route estimates, while a separate orchestration layer invokes the routing adapter.
3. **Alternatives:** a backend module, a serverless callable function, or a standalone service; a standalone service is likely unnecessary unless evidence supports it.
4. **Impact:** controls testability, provider coupling, data exposure, deployment complexity, and how recommendations are explained.
5. **Participants:** Justin and Gio lead; Kenny reviews storage/query constraints and Ray reviews the result shape.

#### Product rules that affect architecture

1. **Decide:** schedule semantics, geographic prefilter, ranking, recurrence/dated rides, seat reservation, messaging eligibility, and staged location visibility.
2. **Proposed direction:** deterministic rules, privacy-minimizing fields, and trusted enforcement of consequential state changes.
3. **Alternatives:** the options summarized in the open-decisions table above.
4. **Impact:** changes the data model, indexes, transactions, UI states, authorization, matching tests, and routing volume.
5. **Participants:** all four team members, with each component owner preparing concrete examples and edge cases.

## 14. Next Steps

To finish M2, the team should:

1. Hold and record an architecture decision session covering backend execution, Firebase services, routing provider evaluation criteria, and the matching interface.
2. Initialize the React Native/Expo TypeScript mobile project and commit its lockfile and verified setup instructions.
3. Configure safe development/test Firebase resources or emulators and document environment setup without secrets.
4. Implement the narrow persisted-sample-commute prototype and verify it from a clean clone.
5. Add real lint, test, and build/type-check scripts, then a GitHub Actions workflow that invokes them.
6. Add at least one automated prototype test and verify the workflow on a pull request.
7. Update this design's decision statuses and architecture boundaries to reflect approvals and observed prototype results.

Steps 2–3 can proceed in parallel after the initial boundary decision; routing-provider research and matching-interface fixtures can also proceed in parallel without implementing the full algorithm. Ride requests, messaging, full ranking, Stripe, Trip Mode, and on-the-go matching are later work and should not delay the mandatory M2 prototype and CI foundation.
