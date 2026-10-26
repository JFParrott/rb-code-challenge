import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr, argv } from 'node:process';
import { runSession } from './cli.js';
import { runFileContents } from './file.js';

async function main(): Promise<void> {
  const args = argv.slice(2);
  if (args.length > 1) throw new Error('Usage: npm start -- [input-file]');

  if (args.length === 1) {
    const contents = await readFile(args[0]!, 'utf8');
    for (const result of runFileContents(contents)) stdout.write(`${result}\n`);
    return;
  }

  const rl = createInterface({ input: stdin, output: stdout });
  try {
    await runSession(
      (question) => rl.question(question),
      (message) => console.log(message),
    );
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
});
