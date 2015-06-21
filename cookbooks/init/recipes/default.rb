include_recipe "init::apt-update"

apt_package "build-essential" do
    action :install
end

apt_package "python-dev" do
    action :install
end

apt_package "python-virtualenv" do
    action :install
end

apt_package "libffi-dev" do
    action :install
end

apt_package "libssl-dev" do
	action :install
end