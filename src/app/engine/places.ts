/**
 * Places that can help, and the schematic map's layout. Ported from the
 * click-through prototype. All locations are synthetic demo places.
 */
import { AREAS, DEMO_LOCATIONS } from '../content/content-data';
import type { Area, DemoLocation, LatLng } from '../content/types';
import { normalize } from './chat-matcher';
import type { JourneyStep, Roadmap, RoadmapStatus } from './rules';

const PROVINCE_SUFFIX = /[\s,.]+(on|ont|ontario|qc|quebec|canada)$/;
const cityKey = (s: string) => normalize(s).replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim().replace(PROVINCE_SUFFIX, '').trim();

/** The mapped area for a typed city name, if we have one. */
export function findArea(province: string | undefined, city: string | undefined, areas: Area[] = AREAS): Area | null {
  if (!city) return null;
  const key = cityKey(city);
  if (!key) return null;
  return areas.find((a) => (!province || province === a.province) && a.aliases.some((alias) => cityKey(alias) === key)) ?? null;
}

const showable = (loc: DemoLocation, area: Area) =>
  loc.areaId === area.id && (!!loc.verified || (loc.isDemo && area.showDemoLocations));

/** Map coordinates: the area's bounds become a 1000 × 640 canvas. */
export function project(point: LatLng, area: Area) {
  const b = area.bounds;
  return {
    x: Math.round(((point.longitude - b.west) / (b.east - b.west)) * 1000),
    y: Math.round(((b.north - point.latitude) / (b.north - b.south)) * 640),
  };
}

/** Straight-line distance in km, rounded to 0.1. */
function distanceKm(a: LatLng, b: LatLng): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 10) / 10;
}

function placesForProgram(step: JourneyStep, locations: DemoLocation[], area: Area): DemoLocation[] {
  const program = step.program;
  if (!program.channels.includes('in_person')) return [];
  return locations
    .filter((l) => showable(l, area) && l.relatedActionIds.includes(program.id))
    .sort((a, b) => (a.orgId === program.orgId ? 0 : 1) - (b.orgId === program.orgId ? 0 : 1) || a.id.localeCompare(b.id));
}

/** A pin on the map. A place can serve several steps ("3·4"). */
export interface Stop {
  location: DemoLocation;
  x: number;
  y: number;
  distanceKm: number;
  /** `help`: a settlement place shown for human help even if no step needs it. */
  kind: 'step' | 'help';
  positions: number[];
  nodeKeys: string[];
  steps: JourneyStep[];
  status: RoadmapStatus;
  current: boolean;
}

export type StepPlaces = { kind: 'remote' } | { kind: 'finder' } | { kind: 'places'; locationIds: string[] };

export interface WhereToGo {
  area: Area | null;
  city?: string;
  noArea?: 'notMapped' | 'noCity';
  stops: Stop[];
  byStep: Record<string, StepPlaces>;
}

const HELP_TYPES = ['settlement', 'library'];

export function buildWhereToGo(
  roadmap: Roadmap,
  where: { province?: string; city?: string },
  locations: DemoLocation[] = DEMO_LOCATIONS,
  areas: Area[] = AREAS,
): WhereToGo {
  const area = findArea(where.province, where.city, areas);
  const byStep: Record<string, StepPlaces> = {};
  const stops: Stop[] = [];
  const currentNode = roadmap.nodes[roadmap.currentIndex];
  const placed = (loc: DemoLocation) => ({ ...project(loc, area!), distanceKm: distanceKm(area!.center, loc) });

  for (const node of roadmap.nodes) {
    if (node.kind !== 'step') continue;
    const step = node.step;
    if (!step.program.channels.includes('in_person')) {
      byStep[node.key] = { kind: 'remote' };
      continue;
    }
    const places = area ? placesForProgram(step, locations, area) : [];
    if (!places.length) {
      byStep[node.key] = { kind: 'finder' };
      continue;
    }
    byStep[node.key] = { kind: 'places', locationIds: places.map((p) => p.id) };
    const isCurrent = currentNode?.key === node.key;
    for (const loc of places) {
      const existing = stops.find((s) => s.location.id === loc.id);
      if (existing) {
        existing.positions.push(node.position);
        existing.nodeKeys.push(node.key);
        existing.steps.push(step);
        existing.current ||= isCurrent;
        if (existing.status === 'done') existing.status = node.status;
        continue;
      }
      stops.push({
        location: loc,
        ...placed(loc),
        kind: 'step',
        positions: [node.position],
        nodeKeys: [node.key],
        steps: [step],
        status: node.status,
        current: isCurrent,
      });
    }
  }
  if (area && !stops.some((s) => HELP_TYPES.includes(s.location.serviceType))) {
    const help = locations
      .filter((l) => showable(l, area) && HELP_TYPES.includes(l.serviceType))
      .sort((a, b) => a.id.localeCompare(b.id))[0];
    if (help) {
      stops.push({
        location: help,
        ...placed(help),
        kind: 'help',
        positions: [],
        nodeKeys: [],
        steps: [],
        status: 'get_help',
        current: false,
      });
    }
  }
  return {
    area,
    city: where.city || undefined,
    noArea: area ? undefined : where.city ? 'notMapped' : 'noCity',
    stops,
    byStep,
  };
}

export type PinTone = 'here' | 'later' | 'done' | 'help';
export const stopTone = (s: Stop): PinTone =>
  s.kind === 'help' ? 'help' : s.status === 'done' ? 'done' : s.current ? 'here' : 'later';
export const stopLabel = (s: Stop) => s.positions.join('·');

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}
export const FULL_VIEW: ViewBox = { x: 200, y: 80, w: 600, h: 400 };

/** Zooms the map to fit some pins, leaving room for the details card. */
export function fitView(points: { x: number; y: number }[], base = FULL_VIEW, anchor = { x: 0.5, y: 0.5 }): ViewBox {
  if (!points.length) return base;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const ratio = base.h / base.w;
  const w = Math.min(
    base.w,
    Math.max(300, Math.max(...xs) - Math.min(...xs) + 160, (Math.max(...ys) - Math.min(...ys) + 120) / ratio),
  );
  const h = w * ratio;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const x = Math.min(Math.max(cx - w * anchor.x, 0), 1000 - w);
  const y = Math.min(Math.max(cy - h * anchor.y, 0), 640 - h);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** What the map is focused on: one place, or one step (which may have several places). */
export type MapFocus = { kind: 'place'; locationId: string; stepKey?: string } | { kind: 'step'; stepKey: string };

export function focusForStep(where: WhereToGo, stepKey: string): MapFocus {
  const places = where.byStep[stepKey];
  return places?.kind === 'places' && places.locationIds.length === 1
    ? { kind: 'place', locationId: places.locationIds[0], stepKey }
    : { kind: 'step', stepKey };
}

/** Roadmap rows to highlight for the current focus. */
export function highlightedKeys(where: WhereToGo, focus: MapFocus | null): string[] {
  if (!focus) return [];
  if (focus.kind === 'step') return [focus.stepKey];
  return where.stops.find((s) => s.location.id === focus.locationId)?.nodeKeys ?? [];
}
