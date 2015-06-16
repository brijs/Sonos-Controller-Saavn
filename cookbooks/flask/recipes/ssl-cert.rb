directory "/home/vagrant/certs" do
	owner 'vagrant'
	group 'vagrant'
	mode '0755'
	action :create
end

execute "Create self-signed SSL certificate" do
    command "openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -keyout /home/vagrant/certs/sonos.key -out /home/vagrant/certs/sonos.cert -subj \"/C=US/ST=Home/L=Home/O=SonosSaavnApp/CN=SonosSaavnApp\""
    action :run
end
