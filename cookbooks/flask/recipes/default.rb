include_recipe "flask::ssl-cert"

package "git"

git "Checkout Sonos-Controller-Saavn" do
    repository "https://github.com/brijs/Sonos-Controller-Saavn.git"
    reference "master"
    action :checkout
    destination "/home/vagrant/flask-app"
end

execute "Create Virtualenv" do
    command "virtualenv /home/vagrant/flask-app/.venv"
    action :run
end

execute "Install python package dependencies" do
    command "/home/vagrant/flask-app/.venv/bin/pip install -r /home/vagrant/flask-app/server/requirements.txt"
    action :run
end

execute "Fix permissions" do
    command "chown -R vagrant:vagrant /home/vagrant/flask-app"
    action :run
    only_if do File.exists?("/home/vagrant/flask-app") end
end

service "Sonos-Controller-Saavn" do
    start_command "/home/vagrant/flask-app/.venv/bin/python /home/vagrant/flask-app/server/run.py &"
    action [:start]
    pattern "flask-app/server/run.py"
    supports :status => true
end