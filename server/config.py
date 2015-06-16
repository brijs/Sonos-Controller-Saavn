import os

# Edit user-name & password to authenticate to the server
SERVER_USER_NAME         = os.environ.get('SERVER_USER_NAME') or 'admin'
SERVER_PASSWORD          = os.environ.get('SERVER_PASSWORD') or 'admin'

# cert & key (https) paths
SSL_KEY_PATH             = os.environ.get('SSL_KEY_PATH')
SSL_CERT_PATH            = os.environ.get('SSL_CERT_PATH')


#saavn - :)
SAAVN_URI_ENCRYPTION_KEY = os.environ.get('SAAVN_URI_ENCRYPTION_KEY') or 'SAAVN_URI_ENCRYPTION_KEY'

# Edit the IP addresses for Sonos in your home network
SONOS_SPK1_IP            = "10.0.0.20"
SONOS_SPK2_IP            = "10.0.0.15"

