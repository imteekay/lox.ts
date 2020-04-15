import { promises as fs } from 'fs';
import { resolve } from 'path';

const run = (source: string): void => {
  const scanner: Scanner = new Scanner(source);
  const tokens: Array<Token> = scanner.scanTokens();

  tokens.forEach(console.log);
};

const runFile = async (path: string): Promise<void> => {
  const filePath = resolve(__dirname, path);
  const source = await fs.readFile(filePath, 'utf8');
  run(source);
};

const runPrompt = (): void => {
  const input = process.stdin;

  input.on('data', (data) => {
    run(data);
  });
};
