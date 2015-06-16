CERTS_PATH         = node[:flask_app][:certs][:path]
SSL_KEY_FILE_NAME  = node[:flask_app][:certs][:key_file_name]
SSL_CERT_FILE_NAME = node[:flask_app][:certs][:cert_file_name]

directory CERTS_PATH do
	owner 'vagrant'
	group 'vagrant'
	mode '0755'
	action :create
end

execute "Create self-signed SSL certificate" do
    command "openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -keyout #{CERTS_PATH}/#{SSL_KEY_FILE_NAME} -out #{CERTS_PATH}/#{SSL_CERT_FILE_NAME} -subj \"/C=US/ST=Home/L=Home/O=SonosSaavnApp/CN=SonosSaavnApp\""
    action :run
end
