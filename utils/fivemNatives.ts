import * as monaco from 'monaco-editor';

export const fivemNatives = [
  {
    label: 'GetPlayerPed',
    documentation: 'Gets the player\'s ped',
    insertText: 'GetPlayerPed(${1:playerId})'
  },
  {
    label: 'SetEntityCoords',
    documentation: 'Sets an entity\'s coordinates',
    insertText: 'SetEntityCoords(${1:entity}, ${2:xPos}, ${3:yPos}, ${4:zPos}, ${5:xAxis}, ${6:yAxis}, ${7:zAxis}, ${8:clearArea})'
  },
  // Add more FiveM natives here...
];
