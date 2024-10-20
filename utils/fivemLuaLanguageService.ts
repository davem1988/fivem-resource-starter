import * as monaco from 'monaco-editor';
import { fivemNatives } from './fivemNatives';

// Example of setting up completion items for FiveM natives
export function registerFivemLuaLanguage(monaco: typeof import("monaco-editor")){


  // Register the completion item provider for Lua (or JavaScript, if using it in scripts)
  monaco.languages.registerCompletionItemProvider('lua', {
    provideCompletionItems: (model, position, context, token) => {
        
        // Get the word at the current position
        const wordInfo = model.getWordUntilPosition(position);
        console.log(wordInfo);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endColumn: wordInfo.startColumn,  // Current cursor position (end of the word)
        };
      
        const suggestions = fivemNatives.map((native) => ({
          label: native.label || '',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: native.insertText || '',
          range: range, // Use the correct range to replace the current word
          documentation: native.documentation,
          detail: native.detail,
        }));
      
        return { suggestions };
    },
  });

  monaco.languages.setMonarchTokensProvider('lua', {
    tokenizer: {
      root: [
        [/\b(GetEntityCoords|SetEntityCoords)\b/, 'custom-function'], // Custom natives
        [/[{}]/, 'delimiter.bracket'],
        [/\d+/, 'number'],
        [/".*?"/, 'string'],
        [/\b\w+\b/, 'identifier'],
      ],
    },
  });
  monaco.languages.registerHoverProvider('lua', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      const native = fivemNatives.find(n => n.label === word?.word);

      if (native) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word?.startColumn ?? position.column,
            position.lineNumber,
            word?.endColumn ?? position.column
          ),
          contents: [
            { value: `**${native.detail}**` },
            { value: native.documentation || '' }
          ]
        };
      }
      return null;
    }
  });
};
