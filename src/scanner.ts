import { Tokens, Token, TokenType } from './token';
import { Lox } from './index';

export class Scanner {
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
  };

  scanTokens(): Tokens {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    };

    const token: Token = new Token(TokenType.EOF, '', 'null', this.line);
    this.tokens.push(token);
    return this.tokens;
  };

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  };

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
      case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
      case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
      case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
      case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
      case '/': this.handleSlashOperator(); break;
      default: Lox.error(this.line, 'Unexpected character.'); break;
    };
  };

  private handleSlashOperator(): void {
    if (this.match('/')) {
      while (this.isEndOfLine()) {
        this.advance();
      }
    } else {
      this.addToken(TokenType.SLASH);
    }
  }

  private isEndOfLine(): boolean {
    return this.peek() != '\n' && !this.isAtEnd();
  };

  private peek(): string {
    return this.isAtEnd() ? '\0' : this.source.charAt(this.current);
  };

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  };

  private advance(): string {
    this.current++;
    return this.source.charAt(this.current - 1);
  };

  private addToken(type: TokenType): void {
    const text: string = this.source.substring(this.start, this.current);
    const token: Token = new Token(type, text, 'null', this.line);
    this.tokens.push(token);
  };
};
