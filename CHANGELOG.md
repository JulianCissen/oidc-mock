# Changelog

## [1.1.0](https://github.com/JulianCissen/oidc-mock/compare/v1.0.0...v1.1.0) (2025-03-30)


### Features

* add silent login to internal client ([#42](https://github.com/JulianCissen/oidc-mock/issues/42)) ([2cad8a6](https://github.com/JulianCissen/oidc-mock/commit/2cad8a65682b9dd6833996602c10277e71dfa131))
* added support for token ttl configuration and enhanced display of unix timestamps ([9a20b2f](https://github.com/JulianCissen/oidc-mock/commit/9a20b2fca85931c1d8a3d24f8930a4c74a0fc768))
* enable HTTPS support and update configurations for secure connections ([#41](https://github.com/JulianCissen/oidc-mock/issues/41)) ([3d1e6ec](https://github.com/JulianCissen/oidc-mock/commit/3d1e6ece80e7e6d76aad5381b73d2bfde26426fe))
* initialize OIDC provider asynchronously and generate JWKS ([a203122](https://github.com/JulianCissen/oidc-mock/commit/a2031221f60f4010599cdb9a94a2794aa806d254))


### Bug Fixes

* ensure postMessage is sent after window load in silent-renew.html ([055f935](https://github.com/JulianCissen/oidc-mock/commit/055f93560abd99b5a5df8bd9ef85cbd3e66cb4b9))
* fixed an issue where line breaks were applied to the timestamp tooltip, making it hard to read ([5d9978f](https://github.com/JulianCissen/oidc-mock/commit/5d9978f909f0f0abba2e4b9377ec9a968f2893fd))
* fixed HMR being broken in dev because the client tried using wss ([3163939](https://github.com/JulianCissen/oidc-mock/commit/31639397c55a90576197225d0c2546d222123532))
* improve error handling in OIDC controller and index files ([502c72d](https://github.com/JulianCissen/oidc-mock/commit/502c72d49e3d26b48d6f43688505bd21f1497478))

## 1.0.0 (2025-03-24)


### Bug Fixes

* fixed an issue where the run_dev script wouldn't actually run the dev Docker image ([e4ad94f](https://github.com/JulianCissen/oidc-mock/commit/e4ad94f15c9cf97193dd234cf683ca6255644b0b))
* fixed an issue with inappropriate typings from cookie-parser ([0a9bf8d](https://github.com/JulianCissen/oidc-mock/commit/0a9bf8d75200cf2cd9036ed1bac39c54299b9301))
* fixed an issue with inconsistent typings for oidc-provider ([63e67d5](https://github.com/JulianCissen/oidc-mock/commit/63e67d5d05b778a409cc5dc5e609599171b27ebd))
