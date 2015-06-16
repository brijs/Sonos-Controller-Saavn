from flask import Flask
from flask import request, Response, make_response, current_app
import requests
import json
from soco import SoCo
from datetime import datetime, timedelta
from OpenSSL import SSL
from functools import wraps, update_wrapper
from subprocess import Popen, PIPE, STDOUT

from flask.ext.cors import CORS  # The typical way to import flask-cors


# init App
app = Flask(__name__)
app.config.from_object('config')
# todo: logging

# todo: cors can be configured here to allow specific header types
#  ie the 'crossdomain' decorator can be removed
cors = CORS(app)

# init Sonos
livingRoomSonos = SoCo(app.config['SONOS_SPK1_IP'])
masterBedSonos  = SoCo(app.config['SONOS_SPK2_IP'])


# Authentication / CORS Util
def check_auth(username, password):
	return username == app.config['SERVER_USER_NAME'] and \
		password == app.config['SERVER_PASSWORD']

def authenticate():
	return Response(
		'Could not verify your access level for that URL.\n'
    	'You have to login with proper credentials', 401,
    	{'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		auth = request.authorization
		if not auth or not check_auth(auth.username, auth.password):
			return authenticate()
		return f(*args, **kwargs)
	return decorated

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Headers'] = "accept, authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


def decryptSaavnSongURI(encryptedURI):
	print("decryptSaavnSongURI:" + encryptedURI)
	p = Popen(['openssl', 'enc', '-a', '-des-ecb', '-K', app.config['SAAVN_URI_ENCRYPTION_KEY'], '-iv', '0', '-d'] ,stdin=PIPE, stdout=PIPE)
	result = p.communicate(input=encryptedURI.replace("\\","")+"\n")[0]
	print (" ==>" + result)
	return result

@app.route("/",methods=['GET', 'OPTIONS'])
@requires_auth
@crossdomain(origin='*')
def hello():
    return "Welcome to Sonos Controller for Saavn music!"


# /saavn/songs?q=Aashiqui
@app.route("/saavn/songs", methods = ['GET', 'OPTIONS'])
@crossdomain(origin='*')
@requires_auth
def find_saavn_songs():
	SAAVN_URL = "http://www.saavn.com/api.php?__call=search.getResults&p=1&n=30&ctx=android&_format=json&_marker=0"
	searchTerm = request.args.get('q', '')
	if (not searchTerm or searchTerm == "weekly_top_15"):
		URI = "http://www.saavn.com/api.php?__call=playlist.getDetails&listid=2252904&_format=json&_marker=0"
		result = requests.get(URI).content
	else:
		URI = SAAVN_URL + "&q=" + searchTerm
		result = json.dumps(json.loads(requests.get(URI).content)["results"])

	# js = json.loads(result)
	# print (js["results"][0])
	return result




# def getDidlXML():
#     meta_template = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements'\
#     '/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" '\
#     'xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" '\
#     'xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">'\
#     '<item id="R:0/0/0" parentID="R:0/0" restricted="true">'\
#     '<dc:title>{title}</dc:title><upnp:class>'\
#     'object.item.audioItem.audioBroadcast</upnp:class>' \
#     '<dc:creator>{creator}</dc:creator>' \
# 	'<upnp:album>{album}</upnp:album>' \
#     '<desc '\
#     'id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:'\
#     'metadata-1-0/">{service}</desc></item></DIDL-Lite>'

#     tunein_service = 'SA_RINCON65031_'
# 	# Radio stations need to have at least a title to play
# 	meta = meta_template.format(title=title, service=tunein_service, 
# 		creator = "brij", album = "blah")


# TODO: SHOULD BE POST
# /sonos/player?id=living&action=play
@app.route("/sonos/player", methods =['GET', 'OPTIONS'])
@crossdomain(origin='*')
@requires_auth
def sonos_player():
	sonosId = request.args.get('id', '')
	action = request.args.get('action', 'status')

	if (sonosId == "masterbed"):
		sonos = masterBedSonos
	else:
		sonos = livingRoomSonos

	result = {}
	result["status"] = "OK"

	if (action == "play"):
		sonos.play()
	elif (action == "pause"):
		sonos.pause()
	elif (action == "prev"):
		sonos.previous()
	elif (action == "next"):
		sonos.next()
	elif (action == "add_uri"):
		songURI = request.args.get('uri', '')
		print ("request: " + songURI)
		index = sonos.add_uri_to_queue(decryptSaavnSongURI(songURI))
	elif (action == "play_uri"):
		songURI = request.args.get('uri', '')
		print ("request: " + songURI)
		# sonos.play_uri(songURI)
		index = sonos.add_uri_to_queue(decryptSaavnSongURI(songURI))
		sonos.play_from_queue(index-1)
		
	elif (action == "volume"):
		vol = request.args.get('val', '')
		sonos.volume = int(vol)
	elif (action == "seek"):
		seekOffset = request.args.get('val', 0)
		duration = datetime.strptime(sonos.get_current_track_info()["duration"], "%H:%M:%S")
		durationT = timedelta(hours=duration.hour, minutes=duration.minute, seconds=duration.second)
		currPos = datetime.strptime(sonos.get_current_track_info()["position"], "%H:%M:%S")
		newPosT = timedelta(hours=currPos.hour, minutes=currPos.minute, seconds=currPos.second) + timedelta(seconds=int(seekOffset)) 
		if(newPosT > timedelta(seconds=0) and newPosT < durationT):
			sonos.seek(str(newPosT))

	elif (action == "status"):
		result["volume"] = sonos.volume
		if sonos.get_current_transport_info()["current_transport_state"] == "PLAYING":
			result["status"] = "PLAYING"
		else:
			result["status"] = "PAUSED"
		current = sonos.get_current_track_info()
		result["currentTrack"] = {
			"name": current["title"] 
				+ (" - " + current["artist"] if current["artist"] else ""),
			"position": current["position"],
			"duration": current["duration"]
		}

	return json.dumps(result)
	
app.debug = True
if __name__ == "__main__":
	# app.debug = True

	ctx = SSL.Context(SSL.SSLv23_METHOD)
	ctx.use_privatekey_file(app.config['SSL_KEY_PATH'])
	ctx.use_certificate_file(app.config['SSL_CERT_PATH'])

	app.run(host='0.0.0.0', ssl_context=ctx)
	# app.run(host='0.0.0.0')

