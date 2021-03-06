#= require "vendor/all"
#= require 'platform'
#= require "keyboard"

# Nettv's Key Constants for Browser
_.defaults window,
  VK_ENTER:    13
  VK_BACK:     8
  VK_RED:      55 #7
  VK_GREEN:    56 #8
  VK_BLUE:     57 #9
  VK_YELLOW:   48 #0

  VK_PLAY:     49  #number 1
  VK_PAUSE:    50  #number 2
  VK_STOP:     51  #number 3
  VK_FAST_FWD: 53  #5
  VK_REWIND:   52  #4

  VK_LEFT:     37
  VK_RIGHT:    39
  VK_UP:       38
  VK_DOWN:     40

window.log = (message) ->
  $('#log').prepend(message + ' <br />')
console.log = window.log if Platform.isSamsung()

class Application extends Backbone.View
  events:
    'focus input' : 'setKeyboard'

  setKeyboard: (e) ->
    Keyboard.show e.target


window.initializeApp = ->
  log "STARTED APP"
  try
 	  widgetAPI = new Common.API.Widget();
 	  widgetAPI.sendReadyEvent();
  catch e
    null
  window.app = new Application el: $("body")[0]
#  setTimeout (-> $("input").focus()), 1000
  $("input").focus()

window.log ?= -> null
