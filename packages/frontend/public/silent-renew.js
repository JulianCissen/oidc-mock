window.onload = function () {
    window.parent.postMessage(
        { source: 'oidc-client', url: window.location.href },
        window.location.origin,
    );
};
