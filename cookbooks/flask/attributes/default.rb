node.default[:flask_app][:user_name]              = node[:flask_app][:default_user_name] or "vagrant"

node.default[:flask_app][:path]                   = "/home/#{node.default[:flask_app][:user_name]}/flask-app"

node.default[:flask_app][:certs][:path]           = "/home/#{node.default[:flask_app][:user_name]}/certs"
node.default[:flask_app][:certs][:key_file_name]  = "sonos.key"
node.default[:flask_app][:certs][:cert_file_name] = "sonos.cert"

node.default[:flask_app][:source_path]            = "/server_project_on_host"