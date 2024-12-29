import Provider from 'oidc-provider';

const oidc = new Provider('http://localhost:3000', {
    clients: [
        {
            client_id: '123',
            client_secret: 'secret',
            redirect_uris: ['http://localhost:8080/cb'],
        },
    ],
    pkce: {
        required: (_1, _2) => false,
    },
});

oidc.listen(3000, () => {
    console.log(
        'oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration',
    );
});
