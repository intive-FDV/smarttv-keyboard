#= require 'vendor/backbone-min'
Keyboard = {}


pages = [
  {
    1: [' ','.',',']
    2: ['a','b','c']
    3: ['d','e','f']
    4: ['g','h','i']
    5: ['j','k','l']
    6: ['m','n','o']
    7: ['p','q','r', 's']
    8: ['t','u','v']
    9: ['w','x','y', 'z']
  }
  {
    1: [' ','.',',']
    2: ['A','B','C']
    3: ['D','E','F']
    4: ['G','H','I']
    5: ['J','K','L']
    6: ['M','N','O']
    7: ['P','Q','R', 'S']
    8: ['T','U','V']
    9: ['W','X','Y', 'Z']
  }
]

class InputFocused extends Backbone.View
#class KeyboardView extends Backbone.View
  addCharacter = (char) =>
    value = @$el.val() + char
    @$el.val value

  backspace = =>
    value = @$el.val()
    value.replace /.$/,''
    @$el.val value





Keyboard.onFocusInput = (input) ->
  new InputFocused el: input
  InputFocused.show()
