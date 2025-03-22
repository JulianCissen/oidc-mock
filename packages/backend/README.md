# Custom Claims Configuration

You can provide a custom claims file during runtime by mounting it to the container and setting the `CUSTOM_CLAIMS_PATH` environment variable.

Example:
```bash
docker run -p 8080:8080 \
    -v /path/to/custom_claims.json:/app/backend/config/custom_claims.json \
    -e CUSTOM_CLAIMS_PATH=/app/backend/config/custom_claims.json \
    oidc-mock:1.0.0
```

If no custom claims file is provided:
- In **production**, the default claims file is located at `/app/backend/defaults/claims.json`.
- In **development**, the `./src/config/claims.json` file will be used as a fallback if `CUSTOM_CLAIMS_PATH` is not defined.

# Custom Server Configuration

You can provide a custom server configuration file during runtime by mounting it to the container and setting the `CUSTOM_SERVER_CONFIG_PATH` environment variable.

Example:
```bash
docker run -p 8080:8080 \
    -v /path/to/custom_server_config.json:/app/backend/config/custom_server_config.json \
    -e CUSTOM_SERVER_CONFIG_PATH=/app/backend/config/custom_server_config.json \
    oidc-mock:1.0.0
```

If no custom server configuration file is provided:
- In **production**, the default server configuration file is located at `/app/backend/defaults/development.json`.
- In **development**, the `./src/config/development.json` file will be used as a fallback if `CUSTOM_SERVER_CONFIG_PATH` is not defined.
