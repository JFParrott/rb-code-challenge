import { describe, it, expect } from 'vitest';
import { World, formatPosition } from '../src/world.js';

const position = (x: number, y: number, direction: 'N' | 'S' | 'E' | 'W') => ({
  x,
  y,
  direction,
});

describe('robot movement', () => {
  it('rotates clockwise and anticlockwise', () => {
    const world = new World({ x: 5, y: 5 });
    expect(world.run(position(1, 1, 'N'), 'R').position.direction).toBe('E');
    expect(world.run(position(1, 1, 'N'), 'L').position.direction).toBe('W');
    expect(world.run(position(1, 1, 'N'), 'LLLL').position.direction).toBe('N');
  });

  it('moves in each cardinal direction', () => {
    const world = new World({ x: 5, y: 5 });
    for (const [d, x, y] of [
      ['N', 2, 3],
      ['S', 2, 1],
      ['E', 3, 2],
      ['W', 1, 2],
    ] as const)
      expect(world.run(position(2, 2, d), 'F').position).toEqual(
        position(x, y, d),
      );
  });

  it('handles empty instructions', () =>
    expect(new World({ x: 5, y: 5 }).run(position(1, 1, 'E'), '')).toEqual({
      position: position(1, 1, 'E'),
      lost: false,
    }));

  it('matches the sample', () => {
    const world = new World({ x: 5, y: 3 });
    expect(formatPosition(world.run(position(1, 1, 'E'), 'RFRFRFRF'))).toBe(
      '1 1 E',
    );
    expect(
      formatPosition(world.run(position(3, 2, 'N'), 'FRRFLLFFRRFLL')),
    ).toBe('3 3 N LOST');
    expect(formatPosition(world.run(position(0, 3, 'W'), 'LLFFFLFLFL'))).toBe(
      '2 3 S',
    );
  });
});

describe('edges and scents', () => {
  it('loses a robot at its last valid location', () =>
    expect(
      formatPosition(new World({ x: 1, y: 1 }).run(position(1, 1, 'E'), 'FF')),
    ).toBe('1 1 E LOST'));

  it('ignores a scented exit and continues subsequent commands', () => {
    const world = new World({ x: 1, y: 1 });
    world.run(position(1, 1, 'E'), 'F');
    expect(world.run(position(1, 1, 'E'), 'FLF')).toEqual({
      position: position(1, 1, 'N'),
      lost: false,
    });
  });

  it('keeps scents directional at corners', () => {
    const world = new World({ x: 1, y: 1 });
    world.run(position(1, 1, 'E'), 'F');
    expect(world.run(position(1, 1, 'N'), 'F').lost).toBe(true);
  });

  it('does not scent successful moves', () => {
    const world = new World({ x: 1, y: 1 });
    expect(world.run(position(0, 0, 'N'), 'F').lost).toBe(false);
    expect(world.run(position(0, 0, 'N'), 'FF').lost).toBe(true);
  });

  it('supports a zero-sized world', () => {
    const world = new World({ x: 0, y: 0 });
    expect(world.run(position(0, 0, 'N'), 'F').lost).toBe(true);
    expect(world.run(position(0, 0, 'N'), 'F').lost).toBe(false);
  });
});
