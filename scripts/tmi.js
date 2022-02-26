// Config - default settings
const config = {
   'channelname': 'elraenn',
   'assets_dir_name': 'assets'
}
// Tmi - Twitch connection
const client = new tmi.Client({
   connection: {
      reconnect: true,
      secure: true
   },
   channels: [config['channelname']]
})
client.connect().catch(console.error)
// Chat
chat = document.getElementById('chat')
// Functions for chat nodes
function addRepliedContainer(user, whereToAdd) {
   let element = document.createElement('div')
   element.className = 'replied-container'
   // Icon
   let icon = document.createElement('i')
   icon.className = 'material-icons-outlined'
   icon.innerText = 'reply'
   // Replied username and message
   let repliedMessageContainer = document.createElement('p')
   let repliedUser = user['reply-parent-display-name']
   let repliedMessage = user['reply-parent-msg-body']
   let replied = `${repliedUser}: ${repliedMessage}`
   repliedMessageContainer.innerText = replied
   repliedMessageContainer.setAttribute('title', replied)
   // Combine icon and message and add to node
   element.appendChild(icon)
   element.appendChild(repliedMessageContainer)
   whereToAdd.appendChild(element)
}
// Adding current time
function getCurrentTime() {
   let currentTime = new Date() 
   let currentHour = currentTime.getHours()
   let currentMinute = currentTime.getMinutes()
   if (currentHour.toString().length == 1) currentHour = `0${currentHour}`
   if (currentMinute.toString().length == 1) currentMinute = `0${currentMinute}`
   let currentTimeCombined = `${currentHour}:${currentMinute}`
   return currentTimeCombined
}
function addCurrentTime(whereToAdd) {
   let element = document.createElement('p')
   element.className = 'node-current-time'
   let currentTime = getCurrentTime()
   element.innerText = currentTime
   whereToAdd.appendChild(element)
}
// Adding badges
let badges = {
   'broadcaster': 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
   'premium': 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1',
   'vip': 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1',
   'partner': 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1',
   'glhf-pledge': 'https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1',
   'glitchcon2020': 'https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/1',
   'sub-gifter': 'https://static-cdn.jtvnw.net/badges/v1/f1d8486f-eb2e-4553-b44f-4d614617afc1/1',
   'moderator': 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
   'subscriber': `${config['assets_dir_name']}/sub1.png` // or sub2.png
}
let badgeNames = Object.keys(badges)
function addBadges(user, whereToAdd) {
   let userBadges = user['badges']
   let userBadgesInfo = user['badge-info']
   if (userBadges != null) {
      for (const [badgeName, badgeImgSrc] of Object.entries(badges)) {
         let badgeImg = document.createElement('img')
         if (Object.hasOwn(userBadges, badgeName)) {
            if (badgeName == 'subscriber') {
               for (const [badgeInfoName, value] of Object.entries(userBadgesInfo)) {
                  if (badgeInfoName == 'subscriber') {
                     badgeImg.setAttribute('title', `${value} month subscription`)
                     badgeImg.classList.add('node-sub-badge-img')
                  }
               }
            }
            badgeImg.setAttribute('src', badgeImgSrc)
            badgeImg.classList.add('node-badge-img')
            whereToAdd.appendChild(badgeImg)
         }
      }
   }
}
// Filter the message for replied messages
function filterMessage(rawMessage, user) {
   let repliedUser = user['reply-parent-display-name']
   let filteredMessage = rawMessage
   if (repliedUser) {
      let cutTheRawMessage = `@${repliedUser} `
      filteredMessage = rawMessage.slice(cutTheRawMessage.length)
   }
   return filteredMessage.trim()
}
// Adding Author name & message, example: 'user823: hello everyone!'
function addMessage(nodeType, rawMessage, whereToAdd, user) {
   let element = document.createElement('div')
   let intermediatePart
   let filteredMessage
   if (nodeType == 'systemnode') {
      intermediatePart = ''
      filteredMessage = rawMessage
   } else if (nodeType == 'chatnode') {
      // Author & Author's color
      let authorPart = document.createElement('p')
      authorPart.className = 'node-author-name'
      let authorName = user['display-name']
      authorPart.innerText = authorName
      let authorColor = user['color']
      authorPart.style.color = authorColor
      whereToAdd.appendChild(authorPart)
      intermediatePart = ': ' // Example: 'author_name: message'
      filteredMessage = filterMessage(rawMessage, user)
   }
   // Message
   let messagePart = document.createElement('p')
   messagePart.className = 'node-message'
   messagePart.innerText = intermediatePart + filteredMessage
   element.appendChild(messagePart)
   whereToAdd.appendChild(messagePart)
}
// Checking nodes for chat node limit
let maxNodeLimit = 100
let manyNodesAreInChat = 0
function checkNodes() {
   manyNodesAreInChat += 1
   if (manyNodesAreInChat > maxNodeLimit) {
      chat.removeChild(chat.firstElementChild)
   }
}
// Creating node
function createNode(nodeType, rawMessage, user) {
   const isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1
   // Checking nodes for chat node limit
   checkNodes()
   updateChatInformation()
   // Creating node element
   const node = document.createElement('div')
   node.classList.add('node')
   let whereToAddElements = node
   // If node is chatnode, show it
   if (nodeType == 'chatnode') {
      // If the user is replied to a message, show it
      let userRepliedToAnyUser = user['reply-parent-display-name']
      if (userRepliedToAnyUser) {
         addRepliedContainer(user, node)
         whereToAddElements = document.createElement('div')
      }
      // Adding the Time, Badges, Author name & Message
      addCurrentTime(whereToAddElements)
      addBadges(user, whereToAddElements)
      addMessage(nodeType, rawMessage, whereToAddElements, user)
      if (userRepliedToAnyUser) {
         node.appendChild(whereToAddElements)
      }
   } else if (nodeType == 'systemnode') {
      // If node is systemnode, show it
      addCurrentTime(node)
      node.classList.add('system-node')
      addMessage(nodeType, rawMessage, node)
   }
   // Sending node to chat
   chat.appendChild(node)
   if (isScrolledToBottom) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight
   }
}
// Send node
client.on('message', (channel, user, rawMessage, self) => {
   if(self) return;
   createNode('chatnode', rawMessage, user)
})
// Functions for system nodes, example: Connected!
client.on('connected', () => {
   createNode('systemnode', `Connected to ${config['channelname']}!`)
})
client.on('disconnected', () => {
   createNode('systemnode', 'Reconnecting...')
})
client.on('clearchat', () => {
   createNode('systemnode', 'Chat cleared!')
})
client.on('clearmsg', (login, message) => {
   createNode('systemnode', `${login}'s '${message}' message has been deleted.`)
})
client.on('messagedeleted', (channel, username, deletedMessage, userstate) => {
   createNode('systemnode', `${username}'s '${deletedMessage}' message has been deleted.`)
})
client.on('notice', (msgid, message) => {
   createNode('systemnode', `msgid: ${msgid}, message: ${message}`)
})
client.on('emoteonly', (channel, enabled) => {
   if (enabled) {
      createNode('systemnode', 'Emote only enabled!')
   } else {
      createNode('systemnode', 'Emote only is no longer on.')
   }
})
client.on('ban', (channel, username, reason, userstate) => {
   let reason_filtered = ''
   if (reason != null) {
      reason_filtered = `reason: ${reason}`
   }
   createNode('systemnode', `${username}'s banned! ${reason_filtered}`)
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
   createNode('systemnode', `${username}'s timeouted! ${duration_filtered}${reason_filtered}`)
})
client.on('followersonly', (channel, enabled, length) => {
   if (enabled) {
      createNode('systemnode', 'Followers only enabled!')
   } else {
      createNode('systemnode', 'Followers only is no longer on.')
   }
})
client.on('mod', (channel, username) => {
   createNode('systemnode', `${username}'s modded!`)
})
client.on('unmod', (channel, username) => {
   createNode('systemnode', `${username}'s unmoded!`)
})
client.on('slowmode', (channel, enabled, length) => {
   if (enabled) {
      createNode('systemnode', `Slowmode is on, slow: ${length}`)
   } else {
      createNode('systemnode', 'Slowmode only is no longer on.')
   }
})
// Logs
let logBoxesObject = {
   'subscription': document.getElementById('log-subs'),
   'gifts': document.getElementById('log-gifts'),
   'resubs': document.getElementById('log-resubs'),
   'hosts': document.getElementById('log-hosts')
}
function createLogNode(whereToAdd, text) {
   let logBox = logBoxesObject[whereToAdd]
   const isScrolledToBottom = logBox.scrollHeight - logBox.clientHeight <= logBox.scrollTop + 1
   let logNode = document.createElement('div')
   let logNodeTime = document.createElement('p')
   let logNodeText = document.createElement('p')
   logBox.className = 'log-node-box'
   logNode.className = 'log-node'
   logNodeTime.className = 'log-node-time'
   logNodeText.className = 'log-node-text'
   logNodeTime.innerText = getCurrentTime()
   logNodeText.innerText = text
   logNode.appendChild(logNodeTime)
   logNode.appendChild(logNodeText)
   logBox.appendChild(logNode)
   if (isScrolledToBottom) {
      logBox.scrollTop = logBox.scrollHeight - logBox.clientHeight
   }
}
// Host logs
client.on('hosted', (channel, username, viewers, autohost) => {
   let autohostText = ''
   if (autohost) { autohostText = 'Is autohost.' }
   createLogNode('hosts', `Hosting to ${username}, ${viewers} viewer. ${autohostText}`)
})
client.on('hosting', (channel, target, viewers) => {
   createLogNode('hosts', `Hosting to ${target}, ${viewers} viewer.`)
})
client.on('raided', (channel, username, viewers) => {
   createLogNode('hosts', `Raided to ${username}, ${viewers} viewer.`)
})
// Sub logs
client.on('subscription', (channel, username, methods, message, userstate) => {
   createLogNode('subscription', `${userstate['display-name']} has just subscribed!`)
})
// Gift logs
client.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
   createLogNode('gifts', `${username}, gifting ${numbOfSubs} subscriptions!`)
})
client.on('subgift', (channel, username, streakMonths, recipient, methods, tags) => {
   createLogNode('gifts', `${username}, gifted subscriptions to ${recipient}`)
})
// Resub logs
client.on('resub', (channel, username, months, message, userstate, methods) => {
   let month = userstate['msg-param-streak-months']
   // Sometimes months returning null or true not number
   let monthNum
   if (month === undefined || month === true) {
      monthNum = userstate['msg-param-cumulative-months']
   } else {
      monthNum = month
   }
   createLogNode('resubs', `${userstate['display-name']} has subscribed for ${monthNum} months in a row!`)
})
// Sidebar chat information
let sidebarChatInfoId = 'chat-info'
let sidebarChatInfo = document.getElementById(sidebarChatInfoId)
console.log(sidebarChatInfo)
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
function updateChatInformation() {
   const channel = client.channels[0]
   const rs = roomstate.get(channel)
   if(roomstate.has(channel)) {
      $('#' + sidebarChatInfoId + ' tr').remove()
      let chatInfosObject = {
         'Channel name': config['channelname'],
         'Emote only': rs['emote-only'] ? 'Enabled' : 'Disabled',
         'Subs only': rs['subs-only'] ? 'Enabled' : 'Disabled',
         'Followers only': rs['followers-only'] != -1 ? 'Enabled' : 'Disabled',
         'Slow': rs['slow'] ? rs['slow'] : 'Disabled',
         'Channel id': rs['room-id']
      }
      for (const [key, value] of Object.entries(chatInfosObject)) {
         let tableTr = document.createElement('tr')
         let tableTd_key = document.createElement('td')
         let tableTd_value = document.createElement('td')
         tableTd_key.innerText = key
         tableTr.appendChild(tableTd_key)
         tableTd_value.innerText = value
         tableTr.appendChild(tableTd_value)
         sidebarChatInfo.appendChild(tableTr)
      }
   }
}