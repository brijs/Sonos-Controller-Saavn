include_recipe "flask::ssl-cert"

package "git"

PROJ_DIR     = node[:flask_app][:path]
PROJ_SRC_DIR = node[:flask_app][:source_path]

git "Checkout Sonos-Controller-Saavn" do
    repository "https://github.com/brijs/Sonos-Controller-Saavn.git"
    reference "master"
    action :checkout
    destination PROJ_DIR
    not_if do ::File.directory?("#{PROJ_SRC_DIR}") end
end

directory PROJ_DIR do
    owner 'vagrant'
    group 'vagrant'
    mode '0755'
    action :create
    only_if do ::File.directory?("#{PROJ_SRC_DIR}/server") end
end

execute "Copy Sonos-Controller-Saavn projectd" do
    command "cp -R #{PROJ_SRC_DIR}/server #{PROJ_DIR}"
    only_if do ::File.directory?("#{PROJ_SRC_DIR}/server") end
end

execute "Create Virtualenv" do
    command "virtualenv #{PROJ_DIR}/.venv"
    action :run
end

execute "Install python package dependencies" do
    command "#{PROJ_DIR}/.venv/bin/pip install -r #{PROJ_DIR}/server/requirements.txt"
    action :run
end

execute "Fix permissions" do
    command "chown -R vagrant:vagrant #{PROJ_DIR}"
    action :run
    only_if do File.exists?("#{PROJ_DIR}") end
end



#  The 'env' resource doesn't seem to work; throws an exception
# env "Set env variables (SSL CERT PATH) for enabling HTTPS" do
#     key_name "SSL_CERT_PATH"
# end
Chef::Log.info "Setting up SSL key/cert paths environment variables."
ENV['SSL_KEY_PATH'] = "#{node[:flask_app][:certs][:path]}/#{node[:flask_app][:certs][:key_file_name]}"
ENV['SSL_CERT_PATH'] = "#{node[:flask_app][:certs][:path]}/#{node[:flask_app][:certs][:cert_file_name]}"

service "Sonos-Controller-Saavn" do
    start_command "#{PROJ_DIR}/.venv/bin/python #{PROJ_DIR}/server/run.py >> #{PROJ_DIR}/app.log 2>&1 &"
    action [:start]
    pattern "flask-app/server/run.py"
    supports :status => true
end