#= require "vendor/jquery-min"

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

class AppView extends Backbone.View

  events:
    'keydown': 'onKeyDown'
    'click .tab': 'clickTab'
    'mouseenter .tab': 'focusTab'
    'click input':'setKeyBoard'
#    'keypress input':'setKeyBoardByKeyPress'

  #setKeyBoardByKeyPress: (e)->
  #  lgKb.focusIn e if e.keyCode == VK_ENTER


  setKeyBoard:(e)->
    lgKb.focusIn e

  tabsInfo: []

  initialize: ->
    @keyHandler = new KeyHandler()
    @keyHandler.setFunctionKey window.VK_BACK, @back, "Volver"

    @render()
    @goToHome()

  goToHome: =>
#    home = @$('.home')
#    @selectTab home
#    home[0].focus()

  ajaxSpinner: ->
    spinner = $(".global-spinner")
    spinner.ajaxStart -> spinner.show()
    spinner.ajaxStop -> spinner.hide()

  render: =>
    @$el.append JST['templates/application'](tabs: @tabsInfo)
    @ajaxSpinner()
    @stackView = new StackView(el: @$('.main-panel'))
    @stackView.on 'change', @_updateBackButton
    @_updateBackButton()
    @keyHandler.render()
    @$(".controls").append @keyHandler.$el

  focusTab: (e)->
    e.stopPropagation()
    e.preventDefault()
    tab = e.currentTarget
    tab.focus()
    @addTabMarquee tab

  # Add a marquee effect to the tab text if it is overflowing.
  addTabMarquee: (tab) ->
    paragraph   = $('p', tab)[0]
    overflowing = paragraph.clientWidth < paragraph.scrollWidth
    if overflowing
      $(paragraph).wrap '<marquee behavior="alternate" scrollamount="2"/>'
      $(tab).one 'blur', -> $(paragraph).unwrap()

  clickTab: (e) ->
    @selectTab $(e.currentTarget)

  focusSelectedTab: =>
    #Maybe the last selected tab can be asigned to a variable?
    @$(".tab.selected").focus()

  selectTab: ($tab) ->
    tabInfo = @tabsInfo[$tab.index(".tab")]

    # Actually opens the tab.
    openTab = =>
      @$('.tab.selected').removeClass 'selected'
      $tab.addClass 'selected'
      view = new tabInfo.type
      view.on "exitFocus", @focusSelectedTab
      @stackView.reset view
      openTab()

  # Goes back to the previous view if there is any in the back-stack.
  # Returns whether it went back or not.
  back: =>
    nested = @stackView.size() > 1
    @stackView.pop() if nested
    nested

  # Navigates to a given view, stacking it on the back-stack.
  navigateTo: (view) ->
    view.on "exitFocus", @focusSelectedTab
    @stackView.push view

  onKeyDown: (e) =>
    @keyHandler.onKeyDown(e)

  _updateBackButton: =>
    @keyHandler.toggleGraphicKey VK_BACK, @stackView.size() > 1

window.initializeApp = ->
  # A singleton instance of the application.
  App = new AppView el: 'body'

  # Exports.
  window.App = App

window.log ?= -> null
