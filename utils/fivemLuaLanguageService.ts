import * as monaco from 'monaco-editor';
import { fivemNatives } from './fivemNatives';

export function registerFivemLuaLanguage() {
  // Register the language
  monaco.languages.register({ id: 'fivem-lua' });

  // Set the language configuration
  monaco.languages.setLanguageConfiguration('fivem-lua', {
    comments: {
      lineComment: '--',
      blockComment: ['--[[', ']]'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // Set the tokens provider
  monaco.languages.setMonarchTokensProvider('fivem-lua', {
    defaultToken: '',
    tokenPostfix: '.lua',

    keywords: [
      'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if',
      'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while'
    ],

    operators: [
      '+', '-', '*', '/', '%', '^', '#', '==', '~=', '<=', '>=', '<', '>', '=',
      ';', ':', ',', '.', '..', '...'
    ],

    // we include these common regular expressions
    symbols:  /[=><!~?:&|+\-*\/\^%]+/,
    escapes:  /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // identifiers and keywords
        [/[a-zA-Z_]\w*/, { cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        } }],

        // whitespace
        { include: '@whitespace' },

        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, { cases: {
          '@operators': 'operator',
          '@default'  : ''
        } }],

        // numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
        [/"/, 'string', '@string."'],
        [/'/, 'string', '@string.\''],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/--\[([=]*)\[/, 'comment', '@comment.$1'],
        [/--.*$/, 'comment'],
      ],

      comment: [
        [/[^\]]+/, 'comment'],
        [/\]([=]*)\]/, { cases: {
          '$1==$S2': { token: 'comment', next: '@pop' },
          '@default': 'comment'
        } }],
        [/./, 'comment']
      ],

      string: [
        [/[^\\"']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/["']/, { cases: {
          '$#==$S2': { token: 'string', next: '@pop' },
          '@default': 'string'
        } }]
      ],
    },
  });

  // Register a completion item provider
  monaco.languages.registerCompletionItemProvider('fivem-lua', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: fivemNatives.map(native => ({
          label: native.label,
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: native.documentation,
          insertText: native.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range
        }))
      };
    }
  });
}
