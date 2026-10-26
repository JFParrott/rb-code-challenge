export type Direction = 'N' | 'E' | 'S' | 'W';

export type Command = 'L' | 'R' | 'F';

export interface Bounds {
  readonly x: number;
  readonly y: number;
}

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
}

export interface Result {
  readonly position: Position;
  readonly lost: boolean;
}
