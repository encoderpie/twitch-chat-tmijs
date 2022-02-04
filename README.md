# twitch-chat-tmijs
tmi.js twitch chat web app

### Installation - Clone repo
```
git clone https://github.com/encoderpie/twitch-chat-tmijs.git
```

### Config - Settings
Configuration settings are at the top of chat.js

Configs:
```
const config = {
   'channel_name': 'channel_name',
   'chat_messages_limit': 100, // Maximum number of messages to be shown in chat
   'assets_dir': 'assets' // Filename with assets
}

const config_colors = {
   'message_author_default_color': 'white', // If the color of the sender of the message is not set
   'primary_node_color': '#1b212b',
   'secondary_node_color': 'rgb(13 13 16)'
}
```

### Some Improvements
- [x] Messages
- [x] System messages
- [x] Badges
- [x] Auto scroll
- [x] Show replied messages
- [x] Sidebar
- [x] Settings
- [ ] Show logs (subscribers, gifts, hosts)

### Contact
Bug reports and feedback for: Discord Server & Discord Username: discord.com/invite/Rnny2wF9MD & encoderpie#3312