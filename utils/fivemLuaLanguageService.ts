import * as monaco from 'monaco-editor';
import { fivemNatives } from './fivemNatives';

let cachedNatives: ReturnType<typeof fivemNatives> | null = null;
let currentFramework: string | null = null;
let disposables: monaco.IDisposable[] = [];

export function registerFivemLuaLanguage(monaco: typeof import("monaco-editor"), framework: string) {
  // Unregister previous providers
  unregisterProviders();

  // Reset and update cachedNatives and currentFramework
  cachedNatives = fivemNatives(framework);
  currentFramework = framework;

  // Register new providers
  registerProviders(monaco);
}

function unregisterProviders() {
  disposables.forEach(d => d.dispose());
  disposables = [];
}

function registerProviders(monaco: typeof import("monaco-editor")) {
  // Register completion provider
  disposables.push(
    monaco.languages.registerCompletionItemProvider('lua', {
      provideCompletionItems: (model, position, context, token) => {
        // Get the word at the current position
        const wordInfo = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endColumn: wordInfo.endColumn,
        };

        const suggestions = cachedNatives?.map((native) => ({
          label: native.label || '',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: native.insertText || '',
          range: range,
          documentation: native.documentation,
          detail: native.detail,
        })) || [];

        return { suggestions };
      },
    })
  );

  // Register monarch tokens provider
  disposables.push(
    monaco.languages.setMonarchTokensProvider('fivem-lua', {
      tokenizer: {
        root: [
          [/\b(GetEntityCoords|SetEntityCoords)\b/, 'custom-function'], // Custom natives
          [/[{}]/, 'delimiter.bracket'],
          [/\d+/, 'number'],
          [/".*?"/, 'string'],
          [/\b\w+\b/, 'identifier'],
        ],
      },
    })
  );

  // Register hover provider
  disposables.push(
    monaco.languages.registerHoverProvider('lua', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        const native = cachedNatives?.find(n => n.label === word?.word);

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
    })
  );
}
