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

class Input extends Backbone.View
  events:
    'focusin'  : 'onFocusIn'
    'focusout' : 'onFocusOut'
    'keydown'  : 'f1'
    'keypress' : 'f2'
    'keyup'    : 'f3'

  initialize: ->
    @keyboard = @options.keyboard
    
  onFocusIn: ->
    @keyboard.show(@)
    
  onFocusOut: ->
    @keyboard.hide()

  f1: (e) ->
    @keyboard.f1 e
  f2: (e) ->
    @keyboard.f2  e
  f3: (e) ->
    @keyboard.f3 e
    
  addCharacter: (char) =>
    value = @$el.val() + char
    @$el.val value

  backspace: =>
    value = @$el.val()
    value.replace /.$/,''
    @$el.val value



class KeyboardView extends Backbone.View
  events:
    'keydown'      : 'f1'
    'keypress'     : 'f2'
    'keyup'        : 'f3'
    'click button' : 'f4'


  show: (input) ->
    @input = input
    @$el.show()
  hide: ->
    @input = undefined
    @$el.hide()
    
  f1: (e) ->
    console.log 'keydown ' + e
  f2: (e) ->
    console.log 'keypress ' + e
  f3: (e) ->
    console.log 'keyup ' + e
  f4: (e) ->
    console.log 'click ' + e

      
      
# export
window.Input = Input
window.KeyboardView = KeyboardView

  