# Sonos-Controller-Saavn
A Server application to stream Saavn music to Sonos speakers.


## Server Installation & setup:
- Checkout this repo
```
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
  - Note that, only sonos related API calls will not work (only saavn calls will work) since this app server needs to be in the same home network. Alternatively, VPN may be set up to make it work from AWS.
- To run the application server **locally**, there are a few additional steps:
  - Generate a self-signed SSL certificate in `/home/vagrant/certs/`. An example command:
  
  ```
  openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -keyout /home/vagrant/certs/sonos.key -out /home/vagrant/certs/sonos.cert
  ```
  - Install python dependencies for the project (Using virtualenv is recommended):
  ```
  pip install -r server/requirements.txt
  ```
  - Run server
  ```
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
Use this app to communicate with the server, to play songs on-demand on Sonos.
