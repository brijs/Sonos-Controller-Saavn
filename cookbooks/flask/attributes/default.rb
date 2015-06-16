node.default[:flask_app][:path]                   = "/home/vagrant/flask-app"

node.default[:flask_app][:certs][:path]           = "/home/vagrant/certs"
node.default[:flask_app][:certs][:key_file_name]  = "sonos.key"
node.default[:flask_app][:certs][:cert_file_name] = "sonos.cert"