# twitch-chat-tmijs with Electronjs
tmi.js twitch chat web app V2 with Electronjs

### Demo
[Click for demo](https://encoderpie.github.io/twitch-chat-tmijs/)

### Installation - Clone repo
```
git clone https://github.com/encoderpie/twitch-chat-tmijs.git
```

for electron - desktop app:
```
cd twitch-chat-tmijs
npm i
```

### Config - Settings
Configuration settings are at the top of scripts/tmi.js

Configs:
```
// Config - default settings
let config = {
   assets_dir_name: 'assets',
   default_channelname: 'elraenn',
   max_node_limit_default: 300
}
// Setting default settings
let defaultSettings = {
   addtimetochat: false,
   addbadgestochat: true,
   addtimetologs: true,
   channelname: config.default_channelname,
   maxnodelimit: config.max_node_limit_default
}
```

### Run Electron - Desktop app
```
npm start
```

### Some Improvements
- [x] Messages
- [x] System messages
- [x] Badges
- [x] Auto scroll
- [x] Show replied messages
- [x] Sidebar
- [x] Show logs (subscribers, resubs, gifts, hosts)
- [x] Channel selection
- [ ] Settings
- [ ] Cookie system for chat settings

### Contact
Bug reports and feedback for:
Discord server: discord.com/invite/Rnny2wF9MD
Discord username: encoderpie#3312