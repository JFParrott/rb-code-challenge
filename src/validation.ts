import type { Bounds, Direction, Position } from './types.js';

const MAX = 50;

function coordinates(text: string, count: number): string[] {
  const parts = text.trim().split(/\s+/);

  if (parts.length !== count)
    throw new Error(`Expected ${count} whitespace-separated values.`);

  return parts;
}

function coordinate(value: string): number {
  if (!/^\d+$/.test(value))
    throw new Error('Coordinates must be non-negative integers.');

  const number = Number(value);

  if (!Number.isSafeInteger(number) || number > MAX)
    throw new Error('Coordinates must be between 0 and 50.');

  return number;
}

export function parseBounds(text: string): Bounds {
  const [x, y] = coordinates(text, 2);

  return { x: coordinate(x!), y: coordinate(y!) };
}

export function parsePosition(text: string, bounds: Bounds): Position {
  const [xs, ys, ds] = coordinates(text, 3);

  const x = coordinate(xs!),
    y = coordinate(ys!);

  const direction = ds!.toUpperCase();

  if (!/^[NSEW]$/.test(direction))
    throw new Error('Orientation must be N, S, E or W.');

  if (x > bounds.x || y > bounds.y)
    throw new Error('Starting position must be inside the world.');

  return { x, y, direction: direction as Direction };
}

export function parseInstructions(text: string): string {
  const normalized = text.trim().toUpperCase();

  if (normalized.length >= 100)
    throw new Error('Instructions must be fewer than 100 characters.');

  if (!/^[LRF]*$/.test(normalized))
    throw new Error('Instructions may only contain L, R and F.');

  return normalized;
}
