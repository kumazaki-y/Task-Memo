class Api::V1::BoardsController < ApplicationController
    before_action :authenticate_api_v1_user!  # 認証が必要
    before_action :set_board, only: %i[update destroy] 

    def index
        boards = current_api_v1_user.boards
        render json: boards, status: :ok
    end

    def create
      board = current_api_v1_user.boards.build(board_params)

      if board.save
        render json: board, status: :created
      else
        render json: { errors: board.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
        if @board.update(board_params)
          render json: @board, status: :ok
        else
          render json: { errors: @board.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        if @board.destroy
          render json: { message: 'Board deleted successfully' }, status: :ok
        else
          render json: { errors: 'Failed to delete the board' }, status: :unprocessable_entity
        end
    end

    private

    def board_params
      params.require(:board).permit(:name)
    end

    def set_board
        @board = current_api_v1_user.boards.find(params[:id])
    end

end