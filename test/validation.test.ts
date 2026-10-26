import { describe, it, expect } from 'vitest';
import {
  parseBounds,
  parsePosition,
  parseInstructions,
} from '../src/validation.js';

describe('bounds validation', () => {
  it.each(['5 3', '  0 50  ', '50 50'])('accepts %s', (s) =>
    expect(parseBounds(s)).toBeDefined(),
  );

  it.each(['', '5', '5 3 2', '-1 3', '51 3', '3 51', '1.5 3', 'x 3', '1e1 2'])(
    'rejects %s',
    (s) => expect(() => parseBounds(s)).toThrow(),
  );
});

describe('position validation', () => {
  it.each(['0 0 n', '5 3 E', ' 2 1 w '])('accepts %s', (s) =>
    expect(parsePosition(s, { x: 5, y: 3 }).direction).toMatch(/^[NSEW]$/),
  );

  it.each([
    '',
    '1 1',
    '1 1 Q',
    '-1 0 N',
    '6 0 N',
    '0 4 S',
    '1.5 1 N',
    '1 1 NE',
    '1 1 N extra',
  ])('rejects %s', (s) =>
    expect(() => parsePosition(s, { x: 5, y: 3 })).toThrow(),
  );
});

describe('instructions validation', () => {
  it.each(['', 'lrf', ' LrF ', 'F'.repeat(99)])('accepts %s', (s) =>
    expect(parseInstructions(s)).toMatch(/^[LRF]*$/),
  );

  it.each(['X', 'F R', 'F'.repeat(100), '123', 'FLX'])('rejects %s', (s) =>
    expect(() => parseInstructions(s)).toThrow(),
  );
});
