import { parseBounds, parseInstructions, parsePosition } from './validation.js';
import { World, formatPosition } from './world.js';

/** Execute the original challenge's newline-delimited input format. */
export function runFileContents(contents: string): string[] {
  const lines = contents.replace(/\r\n/g, '\n').split('\n');
  // Remove only the final line separator, not an intentional empty instruction.
  if (lines.at(-1) === '' && contents.endsWith('\n')) lines.pop();

  function atLine<T>(index: number, parse: (line: string) => T): T {
    try {
      if (index >= lines.length) throw new Error('Missing input.');
      return parse(lines[index]!);
    } catch (error) {
      throw new Error(`Line ${index + 1}: ${(error as Error).message}`);
    }
  }

  const bounds = atLine(0, parseBounds);
  const world = new World(bounds);
  const results: string[] = [];

  for (let index = 1; index < lines.length; index += 2) {
    const position = atLine(index, (line) => parsePosition(line, bounds));
    const instructions = atLine(index + 1, parseInstructions);
    results.push(formatPosition(world.run(position, instructions)));
  }

  return results;
}
