// Config settings
const config = {
   'channel_name': 'Fextralife',
   'chat_messages_limit_default': 200,
   'assets_dir': 'assets',
}
const config_colors = {
   'message_author_default_color': 'white',
   'primary_node_color': '#1b212b',
   'secondary_node_color': 'rgb(13 13 16)'
}
const chat = document.getElementById('chat')
// Current Time
function getCurrentTime() {
   const currentTime = new Date() 
   let currentHour = currentTime.getHours(),
      currentMinute = currentTime.getMinutes()
   if (currentHour.toString().length == 1) currentHour = `0${currentHour}`
   if (currentMinute.toString().length == 1) currentMinute = `0${currentMinute}`
   let currentTimeCombined = `${currentHour}:${currentMinute}`
   return currentTimeCombined
}
// Chat settings - Cookies
function getCookie(cname) {
   let name = cname + '='
   let decodedCookie = decodeURIComponent(document.cookie)
   let ca = decodedCookie.split(';')
   for(let i = 0; i <ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
         c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length)
      }
   }
   return ''
}
function setCookie(cookieName, value) {
   document.cookie = `${cookieName}=${value}`
}
function chatSettingCheckboxClicked(item) {
   const setting_item = document.getElementById(item)
   if (setting_item.checked) {
      sendNodeMessage('systemmessage', `${item} setting turned on!`)
      setCookie(item, true)
   } else {
      sendNodeMessage('systemmessage', `${item} setting turned off.`)
      setCookie(item, false)
   }
}
let settings_names = ['show-time', 'show-badges', 'author_colors_single_color']
settings_names.forEach(element => {
   let setting = getCookie(element)
   if (setting == 'true') {
      let x = document.getElementById(element)
      x.checked = true
   }
})
let maxNodeLimit
let chatMessageLimitCookie = getCookie('chat-message-limit')
let chatMessageLimitElement = document.getElementById('chat-message-limit')
if (chatMessageLimitCookie) {
   maxNodeLimit = chatMessageLimitCookie
} else {
   maxNodeLimit = config['chat_messages_limit_default']
}
chatMessageLimitElement.setAttribute('value', maxNodeLimit)
function chatSettingsMessageLimit(item) {
   let item_value = parseInt(document.getElementById(item).value)
   let message
   if (maxNodeLimit == item_value) {
      message = `Maximum message limit already set to ${item_value}.`
   } else {
      maxNodeLimit = item_value
      setCookie(item, item_value)
      message = `Maximum message limit set to ${item_value}.`
   }
   sendNodeMessage('systemmessage', message)
}
// Send chat message function
let msgAuthorDefaultColor = config['message_author_default_color'],
   whichNodeCounter = 0,
   deletedNodeCounter = 0,
   colorOrder = 0,
   lostMessages = 0
function sendNodeMessage(type, msg, msg_author, is_streamer, user, badges, badge_info, is_reply_message, replied_user, replied_msg) {
   const isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1
   const node = document.createElement('div')
   if (type != 'systemmessage') {updateInformation()}
   // Node Limit
   whichNodeCounter += 1
   node.setAttribute('which-node', whichNodeCounter)
   if (whichNodeCounter > maxNodeLimit) {
      deletedNodeCounter += 1
      $(`div[which-node=${deletedNodeCounter}]`).remove();
   }
   
   // Color the nodes
   if (colorOrder == 0) {
      bgcolor = config_colors['primary_node_color']
      colorOrder = 1
   } else {
      bgcolor = config_colors['secondary_node_color']
      colorOrder = 0
   }
   node.style.backgroundColor = bgcolor

   // Set border if message author is streamer
   if (is_streamer) {
      node.style.border = 'solid rgb(226, 0, 0) 3px'
   }

   // Reply
   if (is_reply_message) {
      const replied = document.createElement('div')
      replied.className = 'replied-msg-container'
      // Reply icon
      const reply_icon = document.createElement('img')
      reply_icon.setAttribute('src', `${config['assets_dir']}/reply.png`)
      replied.appendChild(reply_icon)
      // Replied message
      const replied_usrname_msg = document.createElement('p')
      replied_usrname_msg.innerText = `${replied_user}: ${replied_msg}`
      replied_usrname_msg.setAttribute('title', `${replied_user}: ${replied_msg}`)
      replied.appendChild(replied_usrname_msg)
      replied.appendChild(document.createElement('br'))
      node.appendChild(replied)
   }
   // Time
   let show_time = getCookie('show-time')
   const textNode_time = document.createElement('div')
   if (show_time == 'true') {
      textNode_time.innerText = getCurrentTime()
      textNode_time.className = 'chat-node-time'
      node.appendChild(textNode_time)
   }
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
            if (badge_info != null) {
               for (const [badge_info_name, value] of Object.entries(badge_info)) {
                  if ( badge_info_name == 'subscriber' ) {
                     badge_img.setAttribute('title', `${value} month subscription`)
                  }
               }
            }
         }
         let show_badges = getCookie('show-badges')
         if (badge_img.hasAttribute('src') && show_badges == 'true') {
            node.appendChild(badge_img)
         }
      }
   }
   // Author
   if (type != 'systemmessage') {
      textNode_author = document.createElement('div')
      let authorColorsSingleColor = getCookie('author_colors_single_color')
      if (authorColorsSingleColor == 'true') {
         msg_author_color = config_colors['message_author_default_color']
      } else {
         msg_author_color = user['color']
      }
      textNode_author.style.color = msg_author_color
   }
   // Setting InnerText - ClassName - AppendChild's
   const textNode_message = document.createElement('div')
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
   let followChat = document.getElementById('followChat')
   let followChatInnerText = document.getElementById('followChatInnerText')
   if (isScrolledToBottom) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight
      followChat.style.display = 'none'
      lostMessages = 0
   } else {
      followChat.style.display = 'block'
      lostMessages = lostMessages + 1
      followChatInnerText.innerText = `Follow the chat (${lostMessages})`
      followChat.onclick = function() {
         lostMessages = 0
         followChat.style.display = 'none'
         chat.scrollTop = chat.scrollHeight - chat.clientHeight
      }
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
// Roomstate for Information
const roomstate = new Map();
client.on('roomstate', (channel, state) => {
	if(roomstate.has(channel)) {
		const rs = roomstate.get(channel);
		Object.assign(rs, state);
	}
	else {
		roomstate.set(channel, state);
	}
})
// Information functions
function updateInformation() {
   const channel = client.channels[0]
   const rs = roomstate.get(channel)
   $('#chat-informations tr').remove()
   if(roomstate.has(channel)) {
      let datas = {
         'Emote only': rs['emote-only'] ? 'Enabled' : 'Disabled',
         'Subs only': rs['subs-only'] ? 'Enabled' : 'Disabled',
         'Followers only': rs['followers-only'] != -1 ? 'Enabled' : 'Disabled',
         'Slow': rs['slow'] ? rs['slow'] : 'Disabled',
         'Channel id': rs['room-id']
      }
      const information_table = document.getElementById('chat-informations')
      for (const [key, value] of Object.entries(datas)) {
         let table_tr = document.createElement('tr')
         let table_td_key = document.createElement('td')
         let table_td_value = document.createElement('td')
         table_td_key.innerText = key
         table_tr.appendChild(table_td_key)
         table_td_value.innerText = value
         table_tr.appendChild(table_td_value)
         information_table.appendChild(table_tr)
      }
   }
}
client.connect().catch(console.error);
// System Information
client.on('connected', () => {
   sendNodeMessage('systemmessage', `Connected to ${config['channel_name']}!`)
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
   let reason_filtered = ''
   if (reason != null) {
      reason_filtered = `reason: ${reason}`
   }
   sendNodeMessage('systemmessage', `${username}'s banned! ${reason_filtered}`)
})
client.on('timeout', (channel, username, reason, duration, userstate) => {
   let duration_filtered = ''
   let reason_filtered = ''
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
// Hosts Logs
let colorOrderLogElements = 0
function createLogElement(text, logId) {
   let logArea = document.getElementById(logId)
   const isScrolledToBottom = logArea.scrollHeight - logArea.clientHeight <= logArea.scrollTop + 1
   let element = document.createElement('p')
   element.innerText = text
   element.className = 'log-node'
   let bgcolor
   if (colorOrderLogElements == 0) {
      bgcolor = config_colors['primary_node_color']
      colorOrderLogElements = 1
   } else {
      bgcolor = config_colors['secondary_node_color']
      colorOrderLogElements = 0
   }
   element.style.backgroundColor = bgcolor
   logArea.appendChild(element)
   if (isScrolledToBottom) {
      logArea.scrollTop = logArea.scrollHeight - logArea.clientHeight
   }
}
const hostsLogsId = 'host-logs-area'
client.on('hosted', (channel, username, viewers, autohost) => {
   let autohostText = ''
   if (autohost) { autohostText = 'Is autohost.' }
   createLogElement(`Hosting to ${username}, ${viewers} viewer. ${autohostText}`, hostsLogsId)
})
client.on('hosting', (channel, target, viewers) => {
   createLogElement(`Hosting to ${target}, ${viewers} viewer.`, hostsLogsId)
})
client.on('raided', (channel, username, viewers) => {
   createLogElement(`Raided to ${username}, ${viewers} viewer.`, hostsLogsId)
})
// Subs Logs
const subsLogsId = 'sub-logs-area'
client.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
   createLogElement(`${username}, gifting ${numbOfSubs} subscriptions!`, subsLogsId)
})
client.on('subgift', (channel, username, streakMonths, recipient, methods, tags) => {
   createLogElement(`${username}, gifted subscriptions to ${recipient}`, subsLogsId)
});
client.on('subscription', (channel, username, methods, message, userstate) => {
   createLogElement(`${userstate['display-name']} has just subscribed!`, subsLogsId)
})
client.on('resub', (channel, username, months, message, userstate, methods) => {
   const month = userstate['msg-param-streak-months']
   //sometimes months returning null or true not number
   let monthNum
   if (month === undefined || month === true) {
      monthNum = userstate['msg-param-cumulative-months']
   } else {
      monthNum = month
   }
   createLogElement(`${userstate['display-name']} has subscribed for ${monthNum} months in a row!`, subsLogsId)
})
// Reply message filter
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
// Author is streamer?
function is_user_the_streamer(msg_author, streamer_username) {
   let is_streamer
   if (msg_author.toLowerCase() == streamer_username) {
      is_streamer = true
   } else {
      is_streamer = false
   }
   return is_streamer
}
// Receive incoming messages
client.on('message', (channel, user, msg, self) => {
   if(self) return;
   let msg_author = user['display-name'],
      streamer_username = config['channel_name'],
      replied_user = user['reply-parent-display-name'],
      replied_msg = user['reply-parent-msg-body'],
      badges = user['badges'],
      badge_info = user['badge-info']
   let reply_filter_data = reply_filter_msg(replied_user, msg)
   let msg_filtered = reply_filter_data[0],
      is_reply_message = reply_filter_data[1]
   let is_streamer = is_user_the_streamer(msg_author, streamer_username)
   sendNodeMessage('chatmessage', msg_filtered, msg_author, is_streamer, user, badges, badge_info, is_reply_message, replied_user, replied_msg)
})