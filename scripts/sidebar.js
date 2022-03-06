let menu = document.getElementById('menu-box')
let menuTitle = document.getElementById('menu-title')
let buttonsObject = {
   streamerButton: document.getElementById('streamer'),
   usersFeaturedButton: document.getElementById('usersFeatured'),
   chatInfoButton: document.getElementById('chatInfo'),
   logsSettings: document.getElementById('logsSettings'),
   settingsButton: document.getElementById('settings')
}
let closeMenu = document.getElementById('menu-close')
let buttons = Object.values(buttonsObject)

function closeAllMenus() {
   buttons.forEach(element => {
      let elementMenu = element.getAttribute('id') + '-box'
      let elementBox = document.getElementById(elementMenu)
      elementBox.style.display = 'none'
   })
}

buttons.forEach(element => {
   element.addEventListener('click',  function() {
      closeAllMenus()
      menu.style.display = 'block'
      let elementMenu = element.getAttribute('id') + '-box'
      let elementBox = document.getElementById(elementMenu)
      menuTitle.innerText = elementBox.getAttribute('name')
      elementBox.style.display = 'block'
   })
})

closeMenu.addEventListener('click',  function() {
   closeAllMenus()
   menu.style.display = 'none'
})