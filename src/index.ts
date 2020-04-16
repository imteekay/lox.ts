import { promises as fs } from 'fs';
import { resolve } from 'path';

type Token = {

};

class Scanner {
  constructor(source: string) {

  }

  scanTokens(): Array<Token> {
    return [];
  }
};

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
  const runData = (data: Buffer) => run(data.toString('utf8'));

  input.on('data', runData);
};
