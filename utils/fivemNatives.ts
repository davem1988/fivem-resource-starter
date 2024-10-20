import * as monaco from 'monaco-editor';

export const fivemNatives = (framework: string) => {
    if(framework === 'ESX'){
        return [  
            {
                label: 'GetPlayerPed',
                documentation: 'Gets the player\'s ped',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'GetPlayerPed(PlayerPedId())',
                detail: 'Ped GetPlayerPed(int playerId)'
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
            {
                label: "PlayerPedId",
                insertText: "PlayerPedId()",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Gets the player's ped ID.",
                detail: "int PlayerPedId()"
            },
            {
                label: "ESX.GetPlayerFromId",
                insertText: "ESX.GetPlayerFromId(${1:source})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Gets a player from their ID.",
                detail: "xPlayer ESX.GetPlayerFromId(int source)"
            },
            {
                label: "ESX.RegisterServerCallback",
                insertText: "ESX.RegisterServerCallback('${1:name}', function(source, cb, ${2:args})\n\t${3:-- callback logic}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Registers a server callback.",
                detail: "void ESX.RegisterServerCallback(string name, function callback)"
            },
            {
                label: "ESX.TriggerServerCallback",
                insertText: "ESX.TriggerServerCallback('${1:name}', function(${2:result})\n\t${3:-- callback logic}\nend, ${4:args})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Triggers a server callback.",
                detail: "void ESX.TriggerServerCallback(string name, function callback, ...)"
            },
            {
                label: "ESX.Game.SpawnVehicle",
                insertText: "ESX.Game.SpawnVehicle('${1:modelName}', ${2:coords}, ${3:heading}, function(vehicle)\n\t${4:-- vehicle spawned}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Spawns a vehicle.",
                detail: "void ESX.Game.SpawnVehicle(string modelName, vector3 coords, float heading, function cb)"
            },
            {
                label: "print",
                insertText: "print(${1:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Prints the given arguments to the console.",
                detail: "void print(...)"
            },
            {
                label: "table.insert",
                insertText: "table.insert(${1:table}, ${2:value})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Inserts a value into a table.",
                detail: "void table.insert(table, value)"
            },
            {
                label: "table.remove",
                insertText: "table.remove(${1:table}, ${2:pos})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Removes an element from a table.",
                detail: "any table.remove(table, pos)"
            },
            {
                label: "string.format",
                insertText: "string.format(${1:formatstring}, ${2:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Returns a formatted string.",
                detail: "string string.format(string formatstring, ...)"
            },
            {
                label: "math.random",
                insertText: "math.random(${1:m}, ${2:n})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Generates a random number.",
                detail: "number math.random([m [, n]])"
            },
            {
                label: "pairs",
                insertText: "for ${1:k}, ${2:v} in pairs(${3:table}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over all key-value pairs in a table.",
                detail: "function pairs(t)"
            },
            {
                label: "ipairs",
                insertText: "for ${1:i}, ${2:v} in ipairs(${3:array}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over an array part of a table.",
                detail: "function ipairs(t)"
            },
            {
                label: "Citizen.CreateThread",
                insertText: "Citizen.CreateThread(function()\n\t${1:-- thread logic}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Creates a thread.",
                detail: "void Citizen.CreateThread(function())"
            }
        ]
    } else if(framework === 'QBCore'){
        return [
            {
                label: 'GetPlayerPed',
                documentation: 'Gets the player\'s ped',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'GetPlayerPed(PlayerPedId())',
                detail: 'Ped GetPlayerPed(int playerId)'
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
            {
                label: "QBCore.Functions.GetPlayer",
                insertText: "QBCore.Functions.GetPlayer(${1:source})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Gets a player object from the source.",
                detail: "Player QBCore.Functions.GetPlayer(int source)"
            },
            {
                label: "QBCore.Functions.CreateCallback",
                insertText: "QBCore.Functions.CreateCallback('${1:name}', function(source, cb, ${2:args})\n\t${3:-- callback logic}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Creates a callback.",
                detail: "void QBCore.Functions.CreateCallback(string name, function cb)"
            },
            {
                label: "QBCore.Functions.TriggerCallback",
                insertText: "QBCore.Functions.TriggerCallback('${1:name}', function(${2:result})\n\t${3:-- callback logic}\nend, ${4:args})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Triggers a callback.",
                detail: "void QBCore.Functions.TriggerCallback(string name, function cb, ...)"
            },
            {
                label: "QBCore.Functions.SpawnVehicle",
                insertText: "QBCore.Functions.SpawnVehicle('${1:model}', function(veh)\n\t${2:-- vehicle spawned}\nend, ${3:coords}, ${4:isnetworked})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Spawns a vehicle.",
                detail: "void QBCore.Functions.SpawnVehicle(string model, function cb, vector3 coords, bool isnetworked)"
            },
            {
                label: "print",
                insertText: "print(${1:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Prints the given arguments to the console.",
                detail: "void print(...)"
            },
            {
                label: "table.insert",
                insertText: "table.insert(${1:table}, ${2:value})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Inserts a value into a table.",
                detail: "void table.insert(table, value)"
            },
            {
                label: "table.remove",
                insertText: "table.remove(${1:table}, ${2:pos})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Removes an element from a table.",
                detail: "any table.remove(table, pos)"
            },
            {
                label: "string.format",
                insertText: "string.format(${1:formatstring}, ${2:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Returns a formatted string.",
                detail: "string string.format(string formatstring, ...)"
            },
            {
                label: "math.random",
                insertText: "math.random(${1:m}, ${2:n})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Generates a random number.",
                detail: "number math.random([m [, n]])"
            },
            {
                label: "pairs",
                insertText: "for ${1:k}, ${2:v} in pairs(${3:table}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over all key-value pairs in a table.",
                detail: "function pairs(t)"
            },
            {
                label: "ipairs",
                insertText: "for ${1:i}, ${2:v} in ipairs(${3:array}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over an array part of a table.",
                detail: "function ipairs(t)"
            },
            {
                label: "Citizen.CreateThread",
                insertText: "Citizen.CreateThread(function()\n\t${1:-- thread logic}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Creates a thread.",
                detail: "void Citizen.CreateThread(function())"
            }
        ]
    } else {
        return [
            {
                label: 'GetPlayerPed',
                documentation: 'Gets the player\'s ped',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'GetPlayerPed(PlayerPedId())',
                detail: 'Ped GetPlayerPed(int playerId)'
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
            // Native Lua suggestions
            {
                label: "print",
                insertText: "print(${1:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Prints the given arguments to the console.",
                detail: "void print(...)"
            },
            {
                label: "table.insert",
                insertText: "table.insert(${1:table}, ${2:value})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Inserts a value into a table.",
                detail: "void table.insert(table, value)"
            },
            {
                label: "table.remove",
                insertText: "table.remove(${1:table}, ${2:pos})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Removes an element from a table.",
                detail: "any table.remove(table, pos)"
            },
            {
                label: "string.format",
                insertText: "string.format(${1:formatstring}, ${2:...})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Returns a formatted string.",
                detail: "string string.format(string formatstring, ...)"
            },
            {
                label: "math.random",
                insertText: "math.random(${1:m}, ${2:n})",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Generates a random number.",
                detail: "number math.random([m [, n]])"
            },
            {
                label: "pairs",
                insertText: "for ${1:k}, ${2:v} in pairs(${3:table}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over all key-value pairs in a table.",
                detail: "function pairs(t)"
            },
            {
                label: "ipairs",
                insertText: "for ${1:i}, ${2:v} in ipairs(${3:array}) do\n\t${4:-- body}\nend",
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: "Iterates over an array part of a table.",
                detail: "function ipairs(t)"
            },
            {
                label: "Citizen.CreateThread",
                insertText: "Citizen.CreateThread(function()\n\t${1:-- thread logic}\nend)",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Creates a thread.",
                detail: "void Citizen.CreateThread(function())"
            }
        ]
    }
};
