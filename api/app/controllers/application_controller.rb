class ApplicationController < ActionController::API
	include DeviseTokenAuth::Concerns::SetUserByToken
	before_action :set_locale

	def set_locale
		I18n.locale = params[:locale] || I18n.default_locale
	end

	def change_locale
		session[:locale] = params[:locale]
		redirect_back(fallback_location: root_path)
	end
end
