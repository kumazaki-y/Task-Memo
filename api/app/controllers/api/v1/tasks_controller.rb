class Api::V1::TasksController < ApplicationController
    before_action :authenticate_api_v1_user!  # 認証が必要
    before_action :set_board
    before_action :set_task, only: %i[update destroy show]
  
    # 特定のBoardに紐づくタスクの一覧を取得
    def index
      tasks = @board.tasks.order(:position)
      render json: tasks, status: :ok
    end
  
    # 新しいタスクを作成
    def create
      task = @board.tasks.build(task_params)
  
      if task.save
        render json: task, status: :created
      else
        render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # 特定のタスクの詳細を表示
    def show
      render json: @task, status: :ok
    end
  
    # タスクを更新
    def update
      if @task.update(task_params)
        render json: @task, status: :ok
      else
        render json: { errors: task.errors.full_messages.map { |msg| I18n.t("errors.task_update_failed", default: msg) } }, status: :unprocessable_entity
      end
    end
  
    # タスクを削除
    def destroy
      if @task.destroy
        render json: { message: I18n.t("errors.task_deletion_successful") }, status: :ok
      else
        render json: { errors: I18n.t("errors.task_deletion_failed") }, status: :unprocessable_entity
      end
    end
  
    private
  
    def task_params
      params.require(:task).permit(:name, :description, :due_date, :time_reduction_amount, :time_reduction_period, :is_completed, :position)
    end
  
    # Boardをセットする
    def set_board
      @board = current_api_v1_user.boards.find(params[:board_id])
    end
  
    # Taskをセットする
    def set_task
      @task = @board.tasks.find(params[:id])
    end
  end
  