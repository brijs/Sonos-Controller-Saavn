# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  # config.vm.box = "ubuntu/trusty64"
  # config.vm.box_url = "https://atlas.hashicorp.com/ubuntu/boxes/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 5000, host: 5000

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  config.vm.network "public_network", ip: "10.0.0.51"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "./", "/server_project_on_host"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb, override|
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true
  
    override.vm.box = "ubuntu/trusty64"
    override.vm.box_url = "https://atlas.hashicorp.com/ubuntu/boxes/trusty64"
  
    # Customize the amount of memory on the VM:
    vb.memory = "1024"
    vb.name = "Sonos-Controller-Saavn"

    # use override, instead of config to only apply settings to this provider
    override.vm.provision "chef_solo", run: "always" do |chef|
      chef.cookbooks_path = "cookbooks"
      chef.provisioning_path = "/tmp/vagrant-chef"
      # chef.roles_path = "roles"
      chef.add_recipe "init"
      chef.add_recipe "flask"
      chef.node_name = "SonosSavanServer"

      # set up chef 'attributes'
      chef.json = {
        :flask_app => {
          :default_user_name => "vagrant"
        }
      }
    end
  end


  config.vm.provider :aws do |aws, override|
    override.vm.box = "dummy"
    override.vm.box_url = "https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box"

    # credentials
    aws.access_key_id = "<AWS ACCESS KEY>"
    aws.secret_access_key = "<AWS ECRETY KEY>"
    # aws.session_token = "SESSION TOKEN"
    
    # ami's are region specific (the following worked for me - us-west-2)
    aws.ami = "ami-73e9d343"
    aws.region = "us-west-2"

    # Network
    aws.security_groups = ['default']
    # UNUSED aws.associate_public_ip = true
    # UNUSED aws.subnet_id = "<SUBNET ID>"

    # IAM profile params UNUSED 
    # aws.use_iam_profile = true
    # aws.iam_instance_profile_arn = ""
    # aws.iam_instance_profile_name = ""

    # SSH setup: Using ubuntu's official image; default user-name ubuntu
    aws.keypair_name = "<AWS KEYPAIR NAME>"
    override.ssh.username = "ubuntu"
    override.ssh.private_key_path = "<PRIVATE KEY FILE>"

    override.vm.provision "chef_solo", run: "always" do |chef|
      chef.cookbooks_path = "cookbooks"
      chef.provisioning_path = "/tmp/vagrant-chef"
      # chef.roles_path = "roles"
      chef.add_recipe "init"
      chef.add_recipe "flask"
      chef.node_name = "SonosSavanServer"

      # set up chef 'attributes'
      chef.json = {
        :flask_app => {
          :default_user_name => "ubuntu"
        }
      }
    end

  end

  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   sudo apt-get update
  #   sudo apt-get install -y apache2
  # SHELL

end
