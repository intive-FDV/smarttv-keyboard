require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'sprockets'
require 'yaml'

# Disable CSFR protection so AJAX cross-origin requests can be made.
# set :protection, :except => :json_csrf
# TODO The previous line makes POST to /redirect receive a bar value. For now, disable all protection:
#disable :protection


# Delay of the API responses in seconds.
#API_DELAY = 0

# Responds to all the OPTIONS "preflight requests" of cross-origin calls.
options '/*' do
  200
end

get '/' do  
  erb :index , :locals => {:@platform_string => platformString}
end

helpers do
  def platformString
    if request.params['platform']
      request.params['platform'].upcase
    elsif request.user_agent =~ /LG/i
      "LG"
    elsif request.user_agent =~ /Philips/i or request.user_agent =~ /Nettv/i
      "PHILIPS"
    elsif request.user_agent =~ /Maple/i
      "SAMSUNG"
    else
      #"OTHER"
      request.user_agent
    end
  end
end