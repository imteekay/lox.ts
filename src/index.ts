import { promises as fs } from 'fs';
import { resolve } from 'path';

type Tokens = Array<Token>;

enum TokenType {
  // Single-character tokens.
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

  // One or two character tokens.
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,

  // Literals.
  IDENTIFIER, STRING, NUMBER,

  // Keywords.
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
}

class Token {
  type: TokenType;
  lexeme: String;
  literal: Object;
  line: number;

  constructor(type: TokenType, lexeme: String, literal: Object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): String {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}

class Scanner {
  private source: string;
  private tokens: Tokens;
  private start: number;
  private current: number;
  private line: number;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens(): Tokens {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private scanToken(): void {
    const c: string = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      default: Lox.error(this.line, "Unexpected character."); break;
    }
  }

  private advance(): string {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  private addToken(type: TokenType): void {
    const text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, null, this.line));
  }
};

class Lox {
  private static hadError: boolean;

  static run(source: string): void {
    const scanner: Scanner = new Scanner(source);
    const tokens: Tokens = scanner.scanTokens();

    tokens.forEach(console.log);
  };

  static async runFile(path: string): Promise<void> {
    const filePath = resolve(__dirname, path);
    const source = await fs.readFile(filePath, 'utf8');
    this.run(source);

    if (this.hadError) process.exit();
  };

  static runPrompt(): void {
    const input = process.stdin;
    const runData = (data: Buffer) => this.run(data.toString('utf8'));

    input.on('data', runData);
  };

  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string): void {
    console.log(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
};
