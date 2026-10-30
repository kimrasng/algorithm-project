# DNS Cache Algorithm Simulator

**English** | [한국어](README.ko.md)

A **web application for comparing and visualizing DNS cache algorithm performance**, built for a school algorithms project.

Process the same sequence of domain requests with No Cache, TTL, LRU, and LFU, then compare cache hit ratios and average response times in charts. Adjust the request distribution, cache capacity, and other settings to explore the conditions where each policy performs well.

## Features

- **Cache policy comparison**: Compare the no-cache baseline with TTL, LRU, and LFU using the same request sequence.
- **Simulation settings**: Adjust the request count, domain count, request distribution, cache capacity, and TTL.
- **Live visualization**: Update cumulative statistics and charts during a run, with progress tracking for finite request mode.
- **Multiple chart types**: View bar charts for average response time and hit ratio, line charts over time, and hit/miss pie charts for each algorithm.
- **Results summary**: See cards for the highest hit ratio, best response time, processed requests, and total DNS lookups.
- **Analysis report**: Generate per-algorithm metrics and a comparison summary after a simulation finishes.
- **Unlimited request mode**: Set the request count to `0` to keep generating requests until you stop the simulation.
- **Theme switching**: Switch themes with the Light/Dark button at the top.

## Algorithms

| Policy | How it works | Implementation details |
| --- | --- | --- |
| No Cache | Performs a DNS lookup for every request without caching | Baseline for comparing performance before caching |
| TTL Cache | Reuses entries only while their TTL has not expired | Checks expiration on access and removes the earliest inserted entry when capacity is full |
| LRU Cache | Evicts the least recently used entry | Tracks access order by deleting and reinserting cache hits in a `Map` |
| LFU Cache | Evicts the least frequently accessed entry | Breaks frequency ties by evicting the entry with the oldest last-access timestamp |

The TTL setting applies only to TTL Cache. LRU and LFU manage entries using capacity and eviction policies, without time-based expiration.

## Simulation Settings

| Setting | Default | Description |
| --- | --- | --- |
| Request count | `1000` | Number of requests to generate; `0` enables unlimited request mode |
| Domain count | `50` | Number of simulated domains available for requests |
| Request distribution | `Zipf Distribution` | Method used to select domains |
| Cache capacity | `20` | Maximum number of entries in each cache |
| TTL | `300 ms` | Lifetime of entries in TTL Cache |
| Algorithms to compare | All selected | Algorithms displayed in cards and charts |

### Request Distributions

- **Zipf Distribution**: Generates requests with weights inversely proportional to domain rank, representing traffic concentrated on a few popular domains.
- **Uniform Distribution**: Requests every domain in sequence, repeatedly. This is a cyclic pattern, not random sampling.
- **Random Distribution**: Selects a domain independently for each request, with equal probability for every domain.

Algorithm selection controls which results appear in cards and charts. The simulation always runs all four policies internally, and the analysis report also uses all results.

## Getting Started

With Node.js and npm installed, open the project directory and run the following commands. Use a Node.js version supported by the installed version of Vite.

```bash
cd algorithm-project
npm ci
npm run dev
```

Open the local URL printed in the terminal. No separate backend server or API key configuration is required.

### Production Build

```bash
npm run build
npm run preview
```

`build` runs TypeScript build checks and bundles the application with Vite, writing the output to `dist/`. `preview` serves the production build locally.

## Usage

1. Set the request count, domain count, and request distribution.
2. Enter the cache capacity and TTL, then select the algorithms to display.
3. Click **시뮬레이션 시작** (Start Simulation).
4. Watch the cards and charts for changes in cache hit ratio, average response time, and hit/miss ratio.
5. Once the run finishes, compare algorithm results in the analysis report.
6. Change the settings and run again to explore different conditions. Each new run resets the previous results.

Settings cannot be changed during a run. Click **중지** (Stop) to end it. Stopping a finite run early does not generate a new analysis report. Stopping an unlimited run produces final results and a report.

### Experiments to Try

| Experiment | What to change | What to observe |
| --- | --- | --- |
| Cache capacity | Keep the domain count fixed and change cache capacity | How additional storage affects the hit ratio |
| Popular-domain concentration | Compare Zipf and Random distributions | How concentrated traffic affects LRU and LFU |
| Expiration time | Change TTL while keeping other settings fixed | How expiration affects TTL Cache hit ratio and lookup count |
| Cyclic requests | Use Uniform with a cache capacity smaller than the domain count | Eviction behavior under a repeating traversal pattern |

## Metrics and Simulation Model

| Metric | Calculation and interpretation |
| --- | --- |
| Cache Hit Ratio | Cache hits / total requests × 100 |
| Average response time | Cumulative simulated response time / total requests |
| DNS lookups | Number of cache misses assumed to require a DNS lookup |
| Memory usage | Number of entries stored in the cache, not actual memory usage in bytes |
| Throughput | Processed requests / actual elapsed time since the run started; shown in the analysis report |

This project is an **educational simulator that runs in the browser**. It does not query real DNS servers or measure network latency.

- Cache policies operate on generated domains and IP addresses.
- Response times are modeled with random values from `5 ms` inclusive to `8 ms` exclusive for hits, and from `100 ms` inclusive to `150 ms` exclusive for misses.
- Each request advances simulated time by `10 ms`. TTL and the time axis use this virtual clock.
- Time-series charts show the **cumulative hit ratio and cumulative average response time** at each point, retaining the latest 200 updates.
- Request generation and simulated response times use randomness, so results can differ between runs with identical settings.
- Throughput depends on browser execution and rendering time. It should not be interpreted as real DNS server throughput or the execution speed of an algorithm alone.

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 18, TypeScript |
| Development server and build | Vite 6 |
| UI components and themes | Cloudscape Design System |
| Charts | Recharts |
| State management | Zustand |

## Project Structure

```text
src/
├── algorithms/             # Cache implementations and shared types
│   ├── NoCache.ts
│   ├── TTLCache.ts
│   ├── LRUCache.ts
│   ├── LFUCache.ts
│   ├── types.ts
│   └── index.ts
├── components/
│   ├── charts/             # Bar, line, and pie charts
│   ├── ConfigPanel.tsx     # Simulation settings
│   ├── ActionBar.tsx       # Start and stop buttons
│   ├── Dashboard.tsx       # Dashboard composition
│   ├── MetricsCards.tsx    # Key metric cards
│   └── AnalysisReport.tsx  # Analysis report display
├── hooks/
│   └── useSimulation.ts    # Request processing, statistics, and run control
├── store/
│   └── simulationStore.ts  # Global settings and results state
├── utils/
│   ├── distribution.ts     # Request distribution generation
│   ├── analysis.ts         # Analysis report generation
│   └── export.ts           # CSV and screenshot export utilities
├── App.tsx                 # Application layout and theming
└── main.tsx                # React entry point
```

`export.ts` implements summary CSV, detailed CSV, and screenshot export functions, but the current interface does not have buttons connected to them.
