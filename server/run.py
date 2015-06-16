from gevent.wsgi import WSGIServer
from sonos_saavn_app import app

# Run server on port 5000
http_server = WSGIServer(('', 5000), app, 
	keyfile=app.config['SSL_KEY_PATH'], 
	certfile=app.config['SSL_CERT_PATH'])

http_server.serve_forever()
