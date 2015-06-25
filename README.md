# Sonos-Controller-Saavn
A Server application & an associated Android app to stream Saavn music to Sonos speakers on your home network.


## Server Installation & setup:
- Checkout this repo
```shellsession
git clone https://github.com/brijs/Sonos-Controller-Saavn.git
```
- Update the service configuration `server/config.py`
  - Update `SERVER_USER_NAME` and `SERVER_PASSWORD` to the desired values.
  - Update `SAAVN_API_ENCRYPTION_KEY` to the correct value (secret string). Contact project owner.
  - Update Sonos IP addresses to your local home network IP addresses. Two speakers are supported currently. `SONOS_SPK1_IP` and `SONOS_SPK2_IP`.
  - Don't modify other items in config.py

- To run the application server in a **Virtualbox VM**:
  - In the project directory, simply run `vagrant up --provider=virtualbox`. (You need to install virtualbox & vagrant for your host OS prior to this)
  - The server should be accessible at https://localhost:5000. You should get a welcome message.
- To run the application in **AWS**:
  - Update Vagrantfile with your AWS credentials (access key, secret key, keypair name, private key file)
  - Run `vagrant up --provider=aws`
  - Note that, sonos related API calls will not work (only saavn calls will work) since this app server needs to be in the same home network as the sonos speakers. Alternatively, VPN may be set up to make it work from AWS.
- To run the application server **locally**, there are a few additional steps:
  - Generate a self-signed SSL certificate in `/home/vagrant/certs/`. An example command:
  
  ```shellsession
  openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -keyout /home/vagrant/certs/sonos.key -out /home/vagrant/certs/sonos.cert
  ```
  - Install python dependencies for the project (Using virtualenv is recommended):
  ```shellsession
  pip install -r server/requirements.txt
  ```
  - Run server
  ```shellsession
  python server/run.py
  ```
  
  
### Server API methods (not all methods are documented)
- **saavn/songs?q=`searchTerm`**: returns a JSON list of matched songs.
- **saavn/songs**: returns a JSON list of weekly top 15 songs
- **sonos/player?id=`sonosId`&action=`actionId`**
  - `sonosId` is either `living` or `masterbed`
  - `actionId` can be:
    - `status`: get PLAY/PAUSE status, volume, currentTrack info
    - `play`
    - `pause`
    - `next`
    - `add_uri`: add to playlist, the media specified by `uri` in the query params
    - `play_uri`: add & play the media specified by `uri` in the query params
    - `volume`: set volume to the `val` specified in the query params
    - `seek`: seek to the `val` offset in the current track


## Client (Android apk: coming up)
Use this app to communicate with the server, to control Sonos in your home network. 

#### Features
- In the `Settings` tab, specify the IP address(Local) of the server running in your home network. Alternatively, you can operate in `remote` access mode when you are outside your home network. You ll need to configure **NAT** on your home router / gateway, and in the `Settings` tab, you will need to specify the public internet facing IP address of your home router.
- On the `Saavn` tab, search for songs and hit enter. 
- Drag & pull down on the screen to refresh.
- Swipe left on a particular song and either add-song-to-queue, or add-and-play-immediately.
- Tap on a song(row), and view details of the song.

#### Screenshots:

<img src="https://cloud.githubusercontent.com/assets/1574336/8323661/77c681de-1a15-11e5-8b49-3f0cfe823ea4.png" width="220">
<img src="https://cloud.githubusercontent.com/assets/1574336/8323583/58ec5faa-1a14-11e5-903a-12c2a5b6a7d9.png" width="220">
<img src="https://cloud.githubusercontent.com/assets/1574336/8323584/5ab3889a-1a14-11e5-9a44-1e28783f159f.png" width="220">


