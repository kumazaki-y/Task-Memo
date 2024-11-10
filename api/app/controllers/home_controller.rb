class HomeController < ApplicationController
  def index
    render json: { message: "タスクを整理して目標を達成しよう" }
  end
end
