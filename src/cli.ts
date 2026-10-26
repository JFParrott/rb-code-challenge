import { parseBounds, parseInstructions, parsePosition } from './validation.js';
import { World, formatPosition } from './world.js';
import type { Position } from './types.js';

export type Prompt = (question: string) => Promise<string>;
export type Output = (message: string) => void;

class Exit extends Error {}

async function valid<T>(
  ask: Prompt,
  output: Output,
  question: string,
  parse: (text: string) => T,
): Promise<T> {
  while (true) {
    const input = await ask(question);
    if (input.trim().toLowerCase() === 'exit') throw new Exit();
    try {
      return parse(input);
    } catch (error) {
      output(`Invalid input: ${(error as Error).message}`);
    }
  }
}

export async function runSession(ask: Prompt, output: Output): Promise<void> {
  output('Martian Robots — type exit at any prompt.');
  try {
    const bounds = await valid(
      ask,
      output,
      'Upper-right bounds (x y): ',
      parseBounds,
    );

    const world = new World(bounds);

    let position: Position | undefined;
    let lost = false;

    while (true) {
      if (!position || lost)
        position = await valid(
          ask,
          output,
          'Starting position (x y N/S/E/W): ',
          (s) => parsePosition(s, bounds),
        );

      const instructions = await valid(
        ask,
        output,
        'Instructions (L/R/F, fewer than 100): ',
        parseInstructions,
      );

      const result = world.run(position, instructions);

      output(formatPosition(result));

      position = result.position;
      lost = result.lost;

      while (true) {
        const choice = (
          await ask(
            lost
              ? 'Robot lost. [s] new start / [q] quit: '
              : '[i] another instruction / [s] new start / [q] quit: ',
          )
        )
          .trim()
          .toLowerCase();

        if (choice === 'exit' || choice === 'q') throw new Exit();
        if (choice === 's') {
          position = undefined;
          break;
        }

        if (choice === 'i' && !lost) break;

        output('Invalid choice. Choose ' + (lost ? 's or q.' : 'i, s or q.'));
      }
    }
  } catch (error) {
    if (!(error instanceof Exit)) throw error;
  }

  output('Goodbye!');
}
