Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      
        devise_scope :api_v1_user do
          post 'auth/guest_sign_in', to: 'auth/sessions#guest_sign_in'
          get '/auth/sessions', to: 'auth/sessions#index'
          post 'auth/confirmation/resend', to: 'auth/confirmations#resend'
        end

        mount_devise_token_auth_for 'User', at: 'auth', skip: [:omniauth_callbacks], controllers: {
          registrations: 'api/v1/auth/registrations',
          sessions: 'api/v1/auth/sessions',
          confirmations: 'api/v1/auth/confirmations',
          passwords: 'api/v1/auth/passwords'
        }
        resources :boards, only: %i[index create update destroy] do
          resources :tasks, only: %i[index create show update destroy]
        end
    end
  end

  root to: 'home#index'
  get '*path', to: 'home#index' #ワイルドカードルート

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")

end
