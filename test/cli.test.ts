import { describe, it, expect } from 'vitest';
import { runSession, type Prompt } from '../src/cli.js';

function scripted(answers: string[]) {
  const prompts: string[] = [];
  const output: string[] = [];
  let index = 0;
  const ask: Prompt = async (question) => {
    prompts.push(question);
    return answers[index++] ?? 'exit';
  };
  return { prompts, output, run: () => runSession(ask, (s) => output.push(s)) };
}

describe('interactive CLI', () => {
  it('runs a sequence, then continues from the result', async () => {
    const script = scripted(['5 3', '1 1 e', 'F', 'i', 'RF', 'q']);
    await script.run();
    expect(script.output).toContain('2 1 E');
    expect(script.output).toContain('2 0 S');
  });

  it('changes starting position but retains scents', async () => {
    const script = scripted(['1 1', '1 1 E', 'F', 's', '1 1 e', 'F', 'q']);
    await script.run();
    expect(script.output).toContain('1 1 E LOST');
    expect(script.output).toContain('1 1 E');
  });

  it('retries invalid input at every stage', async () => {
    const script = scripted(['-1 2', '2 2', '3 0 N', '0 0 n', 'BAD', 'f', 'q']);
    await script.run();
    expect(script.output.filter((x) => x.startsWith('Invalid'))).toHaveLength(
      3,
    );
  });

  it('requires a new start after a loss', async () => {
    const script = scripted(['0 0', '0 0 n', 'F', 'i']);
    await script.run();
    expect(script.output).toContain('0 0 N LOST');
    expect(script.output).toContain('Invalid choice. Choose s or q.');
  });

  it('exits at any prompt', async () => {
    for (const answers of [
      ['exit'],
      ['2 2', 'exit'],
      ['2 2', '0 0 N', 'exit'],
    ]) {
      const script = scripted(answers);
      await script.run();
      expect(script.output.at(-1)).toBe('Goodbye!');
    }
  });
});
