import * as monaco from 'monaco-editor';

export const fivemNatives = [
  {
    label: 'GetPlayerPed',
    documentation: 'Gets the player\'s ped',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'GetPlayerPed(PlayerPedId())',
    detail: 'Ped GetPlayerPed(int playerId)'
  },
  {
    label: 'SetEntityCoords',
    documentation: 'Sets an entity\'s coordinates',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'SetEntityCoords(${1:entity}, ${2:xPos}, ${3:yPos}, ${4:zPos}, ${5:xAxis}, ${6:yAxis}, ${7:zAxis}, ${8:clearArea})',
    detail: 'void SetEntityCoords(Entity entity, float xPos, float yPos, float zPos, float xAxis, float yAxis, float zAxis, bool clearArea)'
  },
  {
    label: "GetEntityCoords",
    insertText: "GetEntityCoords(${1:entity})",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "Returns the current coordinates of the specified entity.",
    detail: "Vector3 GetEntityCoords(Entity entity)"
  },
  {
    label: "SetEntityCoords",
    insertText: "SetEntityCoords(${1:entity}, ${2:x}, ${3:y}, ${4:z})",
    kind: monaco.languages.CompletionItemKind.Function,
    documentation: "Sets the coordinates of the specified entity.",
    detail: "void SetEntityCoords(Entity entity, float x, float y, float z)"
  },
  // Add more FiveM natives here...
];
