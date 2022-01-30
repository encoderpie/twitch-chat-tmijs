// Config - Settings
const config = {
   'channel_name': 'elraenn',
   'chat_messages_limit': 100,
   'assets_dir': 'assets'
}
// Current Time
const currentTime = new Date() 
let currentHour = currentTime.getHours(),
   currentMinute = currentTime.getMinutes()
if (currentHour.toString().length == 1) currentHour = `0${currentHour}`
if (currentMinute.toString().length == 1) currentMinute = `0${currentMinute}`
let currentTimeCombined = `${currentHour}:${currentMinute}`
const chat = document.getElementById('chat')
// Loop variable to make messages look nicer
let colorOrder = 0
// Send chat message function
let maxNodeLimit = config['chat_messages_limit'],
   whichNodeCounter = 0,
   deletedNodeCounter = 0,
   // If the color of the sender of the message is not set
   msgAuthorDefaultColor = 'white'
function sendNodeMessage(type, msg, msg_author, msg_author_color, is_streamer, badges, badge_info, is_reply_message, replied_user, replied_msg) {
   const isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1
   const node = document.createElement('div')
   if (is_reply_message) {
      const replied = document.createElement('div')
      replied.className = 'replied-msg-container'
      // Reply icon
      const reply_icon = document.createElement('img')
      reply_icon.setAttribute('src', `${config['assets_dir']}/reply.png`)
      replied.appendChild(reply_icon)
      // Replied message
      const replied_usrname_msg = document.createElement('p')
      let replied_msg_filtered
      if (replied_msg.length >= 70) {
         replied_msg_filtered = `${replied_msg.slice(0, 70)}...`
      } else {
         replied_msg_filtered = replied_msg
      }
      replied_usrname_msg.innerText = `${replied_user}: ${replied_msg_filtered}`
      replied.appendChild(replied_usrname_msg)
      const asdasdasd = document.createElement('br')
      replied.appendChild(asdasdasd)
      node.appendChild(replied)
   }
   const textNode_time = document.createElement('div'),
      textNode_message = document.createElement('div')
   if (type != 'systemmessage') { textNode_author = document.createElement('div') }
   // Node Limit
   whichNodeCounter += 1
   node.setAttribute('which-node', whichNodeCounter)
   if (whichNodeCounter > maxNodeLimit) {
      deletedNodeCounter += 1
      $(`div[which-node=${deletedNodeCounter}]`).remove();
   }
   // Set border if message author is streamer
   if (is_streamer) {
      node.style.border = 'solid rgb(226, 0, 0) 4px'
   }
   // Color the nodes
   if (colorOrder == 0) {
      bgcolor = '#1b212b'
      colorOrder = 1
   } else {
      bgcolor = 'rgb(13 13 16)'
      colorOrder = 0
   }
   node.style.backgroundColor = bgcolor
   // Color of message author
   if (type != 'systemmessage') {
      if (msg_author_color == null) {
         textNode_author.style.color = msgAuthorDefaultColor 
      } else {
         textNode_author.style.color = msg_author_color
      }
   }
   // Time
   textNode_time.innerText = currentTimeCombined
   textNode_time.className = 'chat-node-time'
   node.appendChild(textNode_time)
   // Badges
   let badge_broadcaster = 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1'
   let badge_premium = 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1'
   let badge_vip = 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1'
   let badge_partner = 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1'
   let badge_glhf_pledge = 'https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1'
   let badge_glitchcon2020 = 'https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/1'
   let badge_sub_gifter = 'https://static-cdn.jtvnw.net/badges/v1/f1d8486f-eb2e-4553-b44f-4d614617afc1/1'
   let badge_mod = 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1'
   let badge_sub = `${config['assets_dir']}/sub.png`
   if (badges != null) {
      for (const [badge_name, value] of Object.entries(badges)) {
         let badge_img = document.createElement('img')
         if ( badge_name == 'broadcaster'  ) { badge_img.setAttribute('src', badge_broadcaster   )} 
         if ( badge_name == 'premium'      ) { badge_img.setAttribute('src', badge_premium       )}
         if ( badge_name == 'vip'          ) { badge_img.setAttribute('src', badge_vip           )}
         if ( badge_name == 'partner'      ) { badge_img.setAttribute('src', badge_partner       )}
         if ( badge_name == 'glhf-pledge'  ) { badge_img.setAttribute('src', badge_glhf_pledge   )}
         if ( badge_name == 'glitchcon2020') { badge_img.setAttribute('src', badge_glitchcon2020 )}
         if ( badge_name == 'sub-gifter'   ) { badge_img.setAttribute('src', badge_sub_gifter    )}
         if ( badge_name == 'moderator'    ) { badge_img.setAttribute('src', badge_mod           )}
         badge_img.className = 'badge'
         if ( badge_name == 'subscriber'   ) {
            badge_img.setAttribute('src', badge_sub)
            badge_img.className = 'badge badge-sub'
            if ( badge_info != null ) {
               for (const [badge_info_name, value] of Object.entries(badge_info)) {
                  if ( badge_info_name == 'subscriber' ) {
                     badge_img.setAttribute('title', `${value} month subscription`)
                  }
               }
            }
         }
         node.appendChild(badge_img)
      }
   }
   // Setting InnerText - ClassName - AppendChild's
   if (type == 'systemmessage') {
      textNode_message.innerText = msg
      node.className = 'chat-node chat-node-system-message'
   } else {
      textNode_author.innerText = msg_author
      textNode_message.innerText = `: ${msg}`
      textNode_author.className = 'chat-node-author'
      node.className = 'chat-node'
      node.appendChild(textNode_author)
   }
   textNode_message.className = 'chat-node-message'
   node.appendChild(textNode_message)
   chat.appendChild(node)
   if (isScrolledToBottom) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight
   }
}
// Tmi - Twitch connection
const client = new tmi.Client({
   connection: {
      reconnect: true,
      secure: true
   },
   channels: [config['channel_name']]
})
client.connect().catch(console.error);
// System Information
client.on('connected', () => {
   sendNodeMessage('systemmessage', 'Connected!')
})
client.on('disconnected', () => {
   sendNodeMessage('systemmessage', 'Reconnecting...')
})
client.on('clearchat', () => {
   sendNodeMessage('systemmessage', 'Chat cleared!')
})
client.on('clearmsg', (login, message) => {
   sendNodeMessage('systemmessage', `${login}'s '${message}' message has been deleted.`)
})
client.on('messagedeleted', (channel, username, deletedMessage, userstate) => {
   sendNodeMessage('systemmessage', `${username}'s '${deletedMessage}' message has been deleted.`)
})
client.on('notice', (msgid, message) => {
   sendNodeMessage('systemmessage', `msgid: ${msgid}, message: ${message}`)
})
client.on('emoteonly', (channel, enabled) => {
   if (enabled) {
      sendNodeMessage('systemmessage', 'Emote only enabled!')
   } else {
      sendNodeMessage('systemmessage', 'Emote only is no longer on.')
   }
})
client.on('ban', (channel, username, reason, userstate) => {
   let reason_filtered = ""
   if (reason != null) {
      reason_filtered = `reason: ${reason}`
   }
   sendNodeMessage('systemmessage', `${username}'s banned! ${reason_filtered}`)
})
client.on('timeout', (channel, username, reason, duration, userstate) => {
   let duration_filtered = ""
   let reason_filtered = ""
   if (duration != null) {
      duration_filtered = `duration: ${duration}`
   }
   if (reason != null) {
      reason_filtered = `, reason: ${reason}`
   }
   sendNodeMessage('systemmessage', `${username}'s timeouted! ${duration_filtered}${reason_filtered}`)
})
client.on('followersonly', (channel, enabled, length) => {
   if (enabled) {
      sendNodeMessage('systemmessage', 'Followers only enabled!')
   } else {
      sendNodeMessage('systemmessage', 'Followers only is no longer on.')
   }
})
client.on('mod', (channel, username) => {
   sendNodeMessage('systemmessage', `${username}'s modded!`)
})
client.on('unmod', (channel, username) => {
   sendNodeMessage('systemmessage', `${username}'s unmoded!`)
})
client.on('slowmode', (channel, enabled, length) => {
   if (enabled) {
      sendNodeMessage('systemmessage', `Slowmode is on, slow: ${length}`)
   } else {
      sendNodeMessage('systemmessage', 'Slowmode only is no longer on.')
   }
})
// Short functions
function reply_filter_msg(replied_username, msg) {
   let is_reply_message
   let msg_filtered
   if (replied_username) {
      // The api prefixes the 'user message' data with a tag of the person being replied to, to indicate that it is a replied message.
      // We delete this tag with the help of 'slice' as we are showing already replied messages.
      let msg_filter = `@${replied_username} `
      msg_filtered = msg.slice(msg_filter.length)
      is_reply_message = true
   } else {
      msg_filtered = msg
      is_reply_message = false
   }

   return [msg_filtered, is_reply_message]
}
function is_user_the_streamer(msg_author, streamer_username) {
   let is_streamer
   if (msg_author.toLowerCase() == streamer_username) {
      is_streamer = true
   } else {
      is_streamer = false
   }
   return is_streamer
}
// Receive incoming messagess
client.on('message', (channel, user, msg, self) => {
   if(self) return;
   let msg_author = user['display-name'],
      msg_author_color = user['color'],
      streamer_username = config['channel_name'],
      replied_user = user['reply-parent-display-name'],
      replied_msg = user['reply-parent-msg-body'],
      badges = user['badges'],
      badge_info = user['badge-info']
   let reply_filter_data = reply_filter_msg(replied_user, msg)
   let msg_filtered = reply_filter_data[0],
      is_reply_message = reply_filter_data[1]
   let is_streamer = is_user_the_streamer(msg_author, streamer_username)
   sendNodeMessage('chatmessage', msg_filtered, msg_author, msg_author_color, is_streamer, badges, badge_info, is_reply_message, replied_user, replied_msg)
})