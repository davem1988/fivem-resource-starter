export function createDefaultProjectStructure(projectTitle: string, projectDescription: string, username: string): any {
  return {
    name: projectTitle,
    files: [
      {
        name: 'fxmanifest.lua',
        content: `fx_version 'cerulean'
game 'gta5'

author '${username}'
description '${projectDescription}'
version '1.0.0'

client_scripts {
    'config.lua',
    'client/client.lua'
}

server_scripts {
    'config.lua',
    'server/server.lua'
}`
      },
      {
        name: 'config.lua',
        content: `Config = {}

-- Add your configuration variables here
Config.ExampleVariable = true`
      }
    ],
    folders: [
      {
        name: 'client',
        files: [
          {
            name: 'client.lua',
            content: `-- Client-side code goes here

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        -- Your client-side logic here
    end
end)`
          }
        ],
        folders: []
      },
      {
        name: 'server',
        files: [
          {
            name: 'server.lua',
            content: `-- Server-side code goes here

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    print('The resource ' .. resourceName .. ' has been started.')
end)`
          }
        ],
        folders: []
      }
    ]
  };
}
