#!/bin/sh
set -e

CERT_DIR="/etc/nginx/certs"
DEFAULT_DOMAIN="${DOMAIN:-localhost}"

# Create certificate directory if it doesn't exist
mkdir -p $CERT_DIR

# Check if custom certificates are provided
if [ -f "/custom-certs/cert.pem" ] && [ -f "/custom-certs/key.pem" ]; then
    echo "Using custom certificates from /custom-certs/"
    cp /custom-certs/cert.pem $CERT_DIR/cert.pem
    cp /custom-certs/key.pem $CERT_DIR/key.pem
else
    # Generate self-signed certificates using mkcert
    echo "Generating self-signed certificates for $DEFAULT_DOMAIN"
    
    # Create CA
    mkcert -install
    
    # Generate certificate for the domain
    mkcert -cert-file $CERT_DIR/cert.pem -key-file $CERT_DIR/key.pem "$DEFAULT_DOMAIN" "localhost" "127.0.0.1" "::1"
    
    echo "Self-signed certificates generated"
fi

# Set correct permissions
chmod 600 $CERT_DIR/key.pem
chmod 644 $CERT_DIR/cert.pem
