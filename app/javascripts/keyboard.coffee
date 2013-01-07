#= require 'vendor/jquery-min'
#= require 'vendor/backbone-min'

#TODO Check TODOs xD
#TODO Use the color keys for special functionallity of keyboard.
#TODO Allow enter characters holding a key.
#TODO Complete keyboard's pages.
#TODO Add visual feedback when pressing a key.
#TODO Add visual feedback when the current key pressed is looping (selecting or underlining the last character, for example)
markup = ->
  ["<div class='keyboard'>",
        "<!-- line 1 -->",
        "<button class='VK_1'>1</button>",
        "<button class='VK_2'>2</button>",
        "<button class='VK_3'>3</button>",
        "<!-- line 2 -->",
        "<button class='VK_4'>4</button>",
        "<button class='VK_5'>5</button>",
        "<button class='VK_6'>6</button>",
        "<!-- line 3 -->",
        "<button class='VK_7'>7</button>",
        "<button class='VK_8'>8</button>",
        "<button class='VK_9'>9</button>",
        "<!-- line 4 -->",
        "<button class='empty'></button>",
        "<button class='VK_0'>0<br>&#8592;</button>",
        "<button class='empty'></button>",
        "<div style='clear:both'></div>",
        "<!-- line 5 -->",
        "<button class='VK_RED colour'>&#8592;</button>",
        "<button class='VK_GREEN colour next'></button>",
        "<button class='VK_YELLOW colour'></button>",
        "<button class='VK_BLUE colour'></button>",
    "</div>"].join('')




Keyboard = {}
keyboardView = {}

#TODO: MUST USE KEYCODES FROM PLATFORM KEY_CODES ??? Or directly use the keyCode constants froms window.KEYCONSTANT

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

type_pages = {
  lowerCase: {
    show: 'ab'
    VK_1: {loop: ['.',',','1','@'],     hold: '1', show: '.,@'             }
    VK_2: {loop: ['a','b','c','2'],     hold: '2', show: 'abc'             }
    VK_3: {loop: ['d','e','f','3'],     hold: '3', show: 'def'             }
    VK_4: {loop: ['g','h','i','4'],     hold: '4', show: 'ghi'             }
    VK_5: {loop: ['j','k','l','5'],     hold: '5', show: 'jkl'             }
    VK_6: {loop: ['m','n','o','6','ñ'], hold: '6', show: 'mno'             }
    VK_7: {loop: ['p','q','r','s','7'], hold: '7', show: 'pqrs'            }
    VK_8: {loop: ['t','u','v','8'],     hold: '8', show: 'tuv'             }
    VK_9: {loop: ['w','x','y','z','9'], hold: '9', show: 'wxyz'            }
    VK_0: {loop: [' ','0'],             hold: '0', show: '&lfloor;&rfloor;'}
  },
  upperCase: {
    show: 'AB'
    VK_1: {loop: ['.',',','1','@'],     hold: '1', show: '.,@'             }
    VK_2: {loop: ['A','B','C','2'],     hold: '2', show: 'ABC'             }
    VK_3: {loop: ['D','E','F','3'],     hold: '3', show: 'DEF'             }
    VK_4: {loop: ['G','H','I','4'],     hold: '4', show: 'GHI'             }
    VK_5: {loop: ['J','K','L','5'],     hold: '5', show: 'JKL'             }
    VK_6: {loop: ['M','N','O','6','Ñ'], hold: '6', show: 'MNO'             }
    VK_7: {loop: ['P','Q','R','S','7'], hold: '7', show: 'PQRS'            }
    VK_8: {loop: ['T','U','V','8'],     hold: '8', show: 'TUV'             }
    VK_9: {loop: ['W','X','Y','Z','9'], hold: '9', show: 'WXYZ'            }
    VK_0: {loop: [' ','0'],             hold: '0', show: '&lfloor;&rfloor;'}
  },
  number: {
      show: '12'
      VK_1: {hold: '1'}
      VK_2: {hold: '2'}
      VK_3: {hold: '3'}
      VK_4: {hold: '4'}
      VK_5: {hold: '5'}
      VK_6: {hold: '6'}
      VK_7: {hold: '7'}
      VK_8: {hold: '8'}
      VK_9: {hold: '9'}
      VK_0: {hold: '0'}
    }
}


activePage = 0
pages = []
setPages = (inputType) ->
  switch inputType
    when 'number'
      pages = [ type_pages['number'] ]
    when 'phone'
      pages = [ type_pages['number'] ]
    else
      # default = 'text'
      pages = [
        type_pages['lowerCase']
        type_pages['upperCase']
        type_pages['number']
      ]
  pages

activeInput = null
recentlyPressedKey = null
i = 0
timeoutID = 0

charsForKey  = (keyCode) ->
  return unless reverseKeyCodes[keyCode]
  key = pages[activePage][reverseKeyCodes[keyCode]]
  if key.loop
    return key.loop
  else if key.hold
    return [key.hold]

onKeyDown = (e) ->
  if e.keyCode == Platform.keyCodes.VK_RED
    activeInput.backspace()
    recentlyPressedKey = null
    e.preventDefault()
  else if e.keyCode == Platform.keyCodes.VK_GREEN
    activePage = ++activePage % pages.length
    recentlyPressedKey = null
    e.preventDefault()
    keyboardView.updateLayout()
  else if reverseKeyCodes[e.keyCode]
    list = charsForKey(e.keyCode)
    return unless list?.length > 0
    e.preventDefault()
    if recentlyPressedKey is e.keyCode
      activeInput.replaceLast list[i++]
      i %= list.length
    else
      i = 0
      activeInput.addCharacter list[i++]
      recentlyPressedKey = if list.length > 1 then e.keyCode else null
      
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

keys = ['VK_1','VK_2','VK_3','VK_4','VK_5','VK_6','VK_7','VK_8','VK_9','VK_0']

class KeyboardView extends Backbone.View
  updateLayout: =>
    for key in keys
      @$(".#{key}").html "#{key.replace /VK_/, '' }<p>#{pages[activePage][key].show or '&nbsp;'}</p>"
    @$(".next").html "<div>#{pages[(1 + activePage) % pages.length].show}</div>"

  show: ->
    @$el.show()

  hide: ->
    @$el.hide()

  initialize: ->
    @hide()
    @updateLayout()

    
Keyboard.show = (input) ->
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  activeInput = new Input el: input
  setPages input.attributes.type.value
  keyboardView.updateLayout()
  keyboardView.show()

Keyboard.hide = ->
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  activeInput = null
  recentlyPressedKey = null
  keyboardView.hide()


#onLoad = ->
$("body").append markup()
pages = setPages 'text'
keyboardView = new KeyboardView el: $(".keyboard")[0]
window.Keyboard = Keyboard

#window.addEventListener("load", onLoad, true)
      
# export
window.Input = Input


  