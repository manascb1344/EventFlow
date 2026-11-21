# EF-02 design sketch

## Usage

User types in Search or Location, picks a date, clicks Apply Filters. The event list updates.

## Grounding

- `EventsFilters` owns local state for search, location, date. No onChange/out props. Apply button has no handler.
- `EventsPage` calls `getEvents()` with no args on mount. No filter state.
- `getEvents()` in actions.ts queries all events with `startDate >= now`, optional saved IDs. No filter params.

## Candidate A: lifted state in page, client-side filter

- Filters become controlled: page holds `filters`, passes `onChange` to `EventsFilters`.
- Page filters the fetched `upcomingEvents` array in memory.
- Public surface: `EventsFilters({ value, onChange })`, `getEvents()` unchanged.
- Pros: no server signature change. Fast. No new query code.
- Cons: filters only what was fetched; fine here because the page already fetches all upcoming events. Date filter compares local `Date` againt start date.

## Candidate B: filter params to server action

- `getEvents(filters)` adds SQL `ilike` on name/location and a date condition.
- Page keeps filter state, refetches on Apply.
- Pros: scales to pagination.
- Cons: changes a server action signature, adds query branches, more code for a page that shows a handful of events.

## Synthesis decision

Candidate A. The page already loads all upcoming events, so filtering in memory is the smaller change that preserves the existing data flow. No query or signature change. If pagination is added later, revisit as Candidate B.

## Sketch

```ts
type EventFilters = { search: string; location: string; date: Date | undefined };

EventsFilters({ filters, onFiltersChange, onApply }: {
  filters: EventFilters;
  onFiltersChange: (next: EventFilters) => void;
  onApply: () => void;
}): JSX.Element; // not implemented

// page
const [filters, setFilters] = useState<EventFilters>(empty);
const [applied, setApplied] = useState<EventFilters>(empty);
const filtered = upcomingEvents.filter(matches(applied)); // not implemented

getEvents(); // unchanged signature
```
