#= require 'vendor/jquery-min'
#= require 'vendor/backbone-min'

markup = ->
  """<style>
      .keyboard {
        width: 300px;
        background-color: blue;
      }
      .keyboard button {
        width: 30%;
        float: left;
        margin-left: 3%;
      }
  </style>
    <div class="keyboard">
        <div class="page1">
        <!-- line 1 -->
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <!-- line 2 -->
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <!-- line 3 -->
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <!-- line 4 -->
        <button>10</button>
        <button>11</button>
        <button>12</button>
        <div style="clear:both"></div>
      </div>
    </div>
  """



Keyboard = {}
keyboardView = {}

#TODO: MUST USE KEYCODES FROM PLATFORM KEY_CODES ??? Or directly use the keyCode constants froms window.KEYCONSTANT
#Platform =
#  keyCodes: #Based on LG's key codes
#      VK_ENTER          : 13
#      VK_PAUSE          : 19
#      VK_PAGE_UP        : 33
#      VK_PAGE_DOWN      : 34
#      VK_LEFT           : 37
#      VK_UP             : 38
#      VK_RIGHT          : 39
#      VK_DOWN           : 40
#
#      VK_HID_BACK       : 8
#      VK_HID_HOME       : 36
#      VK_HID_END        : 35
#      VK_HID_INSERT     : 45
#      VK_HID_DEL        : 46
#      VK_HID_ESC        : 461
#      VK_HID_CTRL       : 17
#      VK_HID_ALT        : 18
#
#      VK_CAPS_LOCK      : 20
#      VK_SHIFT          : 16
#      VK_LANG_SEL       : 229
#
#      VK_0              : 48
#      VK_1              : 49
#      VK_2              : 50
#      VK_3              : 51
#      VK_4              : 52
#      VK_5              : 53
#      VK_6              : 54
#      VK_7              : 55
#      VK_8              : 56
#      VK_9              : 57
#
#      VK_RED            : 403
#      VK_GREEN          : 404
#      VK_YELLOW         : 405
#      VK_BLUE           : 406
#      VK_REWIND         : 412
#      VK_STOP           : 413
#      VK_PLAY           : 415
#      VK_FAST_FWD       : 417
#      VK_INFO           : 457
#      VK_BACK           : 461

reverseKeyCodes = {}
reverseKeyCodes[Platform.keyCodes.VK_0] = 'VK_0'
reverseKeyCodes[Platform.keyCodes.VK_1] = 'VK_1'
reverseKeyCodes[Platform.keyCodes.VK_2] = 'VK_2'
reverseKeyCodes[Platform.keyCodes.VK_3] = 'VK_3'
reverseKeyCodes[Platform.keyCodes.VK_4] = 'VK_4'
reverseKeyCodes[Platform.keyCodes.VK_5] = 'VK_5'
reverseKeyCodes[Platform.keyCodes.VK_6] = 'VK_6'
reverseKeyCodes[Platform.keyCodes.VK_7] = 'VK_7'
reverseKeyCodes[Platform.keyCodes.VK_8] = 'VK_8'
reverseKeyCodes[Platform.keyCodes.VK_9] = 'VK_9'

activePage = 0

pages = [
  {
    VK_1: [' ','.',','],      VK_2: ['a','b','c'], VK_3: ['d','e','f']
    VK_4: ['g','h','i'],      VK_5: ['j','k','l'], VK_6: ['m','n','o']
    VK_7: ['p','q','r', 's'], VK_8: ['t','u','v'], VK_9: ['w','x','y', 'z']
  }
  {
    VK_1: [' ','.',','],      VK_2: ['A','B','C'], VK_3: ['D','E','F'],
    VK_4: ['G','H','I'],      VK_5: ['J','K','L'], VK_6: ['M','N','O'],
    VK_7: ['P','Q','R', 'S'], VK_8: ['T','U','V'], VK_9: ['W','X','Y', 'Z']
  }
]

activeInput = null
recentlyPressedKey = null
i = 0
timeoutID = 0

charsForKey  = (keyCode) ->
#  for key, value of Platform.keyCodes
#    if value == keyCode
#      return pages[0][key]
  return pages[activePage][reverseKeyCodes[keyCode]] if reverseKeyCodes[keyCode]

onKeyDown = (e) ->
  if e.keyCode == Platform.keyCodes.VK_0
    activeInput.backspace()
    recentlyPressedKey = null
    e.preventDefault()
  else if e.keyCode == Platform.keyCodes.VK_REWIND
    activePage = (--activePage + pages.length) % pages.length
    #TODO update layout
    recentlyPressedKey = null
    e.preventDefault()
  else if e.keyCode == Platform.keyCodes.VK_FAST_FWD
    activePage = ++activePage % pages.length
    #TODO update layout
    recentlyPressedKey = null
    e.preventDefault()
  else
    list = charsForKey(e.keyCode)
    return unless list?.length > 0
    
    e.preventDefault()
    if recentlyPressedKey is e.keyCode
      activeInput.replaceLast list[i++]
      i %= list.length
    else
      i = 0
      activeInput.addCharacter list[i++]
      recentlyPressedKey = e.keyCode
      
onKeyUp = (e) ->
  timeout = ->
    recentlyPressedKey = null
    i = 0
  clearTimeout timeoutID if timeoutID
  timeoutID = setTimeout(timeout, 2000)
  e.preventDefault()
  
class Input extends Backbone.View
  events:
    'blur' : 'onFocusOut'
  
  onFocusOut: =>
    @undelegateEvents()
    Keyboard.hide()
    
  addCharacter: (char) =>
    value = @$el.val() + char
    @$el.val value

  backspace: =>
    @replaceLast ''

  replaceLast: (char) =>
    value = @$el.val()
    @$el.val value.replace /.$/, char

    
class KeyboardView extends Backbone.View
  show:  ->
    @$el.show()

  hide: ->
    @$el.hide()

  initialize: ->
    @hide()


Keyboard.show = (input) ->
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  activeInput = new Input el: input
  keyboardView.show()

Keyboard.hide = ->
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  activeInput = null
  recentlyPressedKey = null
  keyboardView.hide()


onLoad = ->
  $("body").append markup()
  keyboardView = new KeyboardView el: $(".keyboard")[0]

window.Keyboard = Keyboard
window.addEventListener("load", onLoad, true)
      
# export
window.Input = Input


  