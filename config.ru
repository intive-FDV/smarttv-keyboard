map '/' do
  require './app'
  run Sinatra::Application
end

map '/assets' do
  require 'sprockets'
  require 'yui/compressor'
  env = Sprockets::Environment.new
  env.append_path 'app/javascripts'
  env.append_path 'app/stylesheets'
  env.append_path 'app/images'

  if production?
    # Compress ALL the assets in production.
    env.js_compressor = YUI::JavaScriptCompressor.new
    #env.css_compressor = YUI::CssCompressor.new
  end

  run env
end