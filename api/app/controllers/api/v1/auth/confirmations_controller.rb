class Api::V1::Auth::ConfirmationsController < DeviseTokenAuth::ConfirmationsController
    def show
      @resource = resource_class.confirm_by_token(resource_params[:confirmation_token])
  
      if @resource.errors.empty?
        yield @resource if block_given?
  
        redirect_to_link = if signed_in?(resource_name)
                             token = signed_in_resource.create_token
                             signed_in_resource.save!
                             signed_in_resource.build_auth_url(redirect_url, build_redirect_headers(token.token, token.client))
                           else
                             DeviseTokenAuth::Url.generate(redirect_url, account_confirmation_success: true)
                           end
  
        redirect_to redirect_to_link, allow_other_host: true
      else
        redirect_to DeviseTokenAuth::Url.generate(redirect_url, account_confirmation_success: false), allow_other_host: true
      end
    end
  end
  