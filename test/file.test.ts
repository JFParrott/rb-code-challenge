import { describe, expect, it } from 'vitest';
import { runFileContents } from '../src/file.js';

const sample = `5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL\n`;

describe('file input', () => {
  it('matches the challenge sample', () => {
    expect(runFileContents(sample)).toEqual(['1 1 E', '3 3 N LOST', '2 3 S']);
  });

  it('supports CRLF and lowercase commands', () => {
    expect(runFileContents('1 1\r\n0 0 n\r\nrf\r\n')).toEqual(['1 0 E']);
  });

  it('shares scents between robots', () => {
    expect(runFileContents('1 1\n1 1 E\nF\n1 1 E\nF\n')).toEqual([
      '1 1 E LOST',
      '1 1 E',
    ]);
  });

  it('supports a valid empty instruction line', () => {
    expect(runFileContents('2 2\n1 1 N\n')).toEqual(['1 1 N']);
  });

  it('rejects missing bounds', () => {
    expect(() => runFileContents('')).toThrow(/line 1/i);
  });

  it('rejects incomplete robot records', () => {
    expect(() => runFileContents('5 3\n1 1 N')).toThrow(/line 2/i);
  });

  it('rejects invalid bounds with a line number', () => {
    expect(() => runFileContents('51 3\n')).toThrow(/line 1/i);
  });

  it('rejects invalid positions with a line number', () => {
    expect(() => runFileContents('5 3\n6 1 N\nF')).toThrow(/line 2/i);
  });

  it('rejects invalid instructions with a line number', () => {
    expect(() => runFileContents('5 3\n1 1 N\nFX')).toThrow(/line 3/i);
  });

  it('rejects extraneous blank lines between records', () => {
    expect(() => runFileContents('5 3\n\n1 1 N\nF')).toThrow(/line 2/i);
  });

  it('accepts a bounds-only file', () => {
    expect(runFileContents('5 3\n')).toEqual([]);
  });

  it('does not share scents between separate files', () => {
    const input = '1 1\n1 1 E\nF';
    expect(runFileContents(input)).toEqual(['1 1 E LOST']);
    expect(runFileContents(input)).toEqual(['1 1 E LOST']);
  });
});
