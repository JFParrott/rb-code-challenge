import type { Bounds, Command, Direction, Position, Result } from './types.js';

const DIRECTIONS: readonly Direction[] = ['N', 'E', 'S', 'W'];
const MOVEMENT: Record<Direction, readonly [number, number]> = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
};

export type Handler = (position: Position, world: World) => Result;

export class World {
  private readonly scents = new Set<string>();
  private readonly handlers = new Map<string, Handler>();

  constructor(readonly bounds: Bounds) {
    this.register('L', (p) => ({
      position: { ...p, direction: turn(p.direction, -1) },
      lost: false,
    }));
    this.register('R', (p) => ({
      position: { ...p, direction: turn(p.direction, 1) },
      lost: false,
    }));
    this.register('F', (p, w) => w.forward(p));
  }

  register(command: string, handler: Handler): void {
    if (!/^[A-Z]$/.test(command))
      throw new Error('Command must be one uppercase letter.');

    this.handlers.set(command, handler);
  }

  run(start: Position, instructions: string): Result {
    let result: Result = { position: { ...start }, lost: false };

    for (const command of instructions) {
      const handler = this.handlers.get(command);
      if (!handler) throw new Error(`Unsupported command: ${command}`);
      result = handler(result.position, this);
      if (result.lost) break;
    }

    return result;
  }

  private forward(p: Position): Result {
    const [dx, dy] = MOVEMENT[p.direction];
    const next = { ...p, x: p.x + dx, y: p.y + dy };
    if (
      next.x >= 0 &&
      next.x <= this.bounds.x &&
      next.y >= 0 &&
      next.y <= this.bounds.y
    )
      return { position: next, lost: false };

    const scent = `${p.x},${p.y},${p.direction}`;

    if (this.scents.has(scent)) return { position: p, lost: false };
    this.scents.add(scent);

    return { position: p, lost: true };
  }
}
function turn(direction: Direction, steps: number): Direction {
  return DIRECTIONS[(DIRECTIONS.indexOf(direction) + steps + 4) % 4]!;
}

export function formatPosition(result: Result): string {
  const { x, y, direction } = result.position;
  return `${x} ${y} ${direction}${result.lost ? ' LOST' : ''}`;
}
