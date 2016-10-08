require "base64"
class FontsController < ApplicationController
  def index
    str = File.read("#{Rails.root}/app/fonts/benton.ttf")
    file = Base64.encode64(str)
    font = {name: "Benton", file: file}
    render json: [font];
  end
end
