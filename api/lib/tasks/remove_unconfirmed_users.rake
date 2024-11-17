# lib/tasks/remove_unconfirmed_users.rake

namespace :users do
    desc 'Remove unconfirmed users whose confirmation period has expired'
    task remove_unconfirmed: :environment do
      expired_users = User.unconfirmed_and_expired
  
      if expired_users.exists?
        puts "Deleting #{expired_users.count} unconfirmed users..."
        expired_users.destroy_all
      else
        puts "No unconfirmed users to delete."
      end
    end
  end
  