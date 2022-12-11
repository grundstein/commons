PRIV_KEY="./priv.pem"
CERT="./cert.pem"
HOST="localhost"

if [ ! -f "$PRIV_KEY" ]; then
openssl req -x509 -newkey rsa:2048 \
  -nodes -sha256 \
  -subj "/CN=${HOST}" \
  -days 3650 \
  -keyout "${PRIV_KEY}" -out "${CERT}"
fi
