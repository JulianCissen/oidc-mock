# Changelog

## [1.2.0](https://github.com/JulianCissen/oidc-mock/compare/v1.1.0...v1.2.0) (2025-03-30)


### Features

* add silent login to internal client ([#42](https://github.com/JulianCissen/oidc-mock/issues/42)) ([0082aef](https://github.com/JulianCissen/oidc-mock/commit/0082aef422f00786bd68b442fc7b43ba4d859a3e))
* added support for token ttl configuration and enhanced display of unix timestamps ([0470d9e](https://github.com/JulianCissen/oidc-mock/commit/0470d9ec12bb7610e21b7dc6dec845b5d103f829))
* enable HTTPS support and update configurations for secure connections ([#41](https://github.com/JulianCissen/oidc-mock/issues/41)) ([c3fa42d](https://github.com/JulianCissen/oidc-mock/commit/c3fa42d5d60a4a9a239e5a4c5e5df79794dc3dbe))
* initial release please setup ([f42c977](https://github.com/JulianCissen/oidc-mock/commit/f42c977e9aa5f3434b42635081a9fee49475232d))
* initialize OIDC provider asynchronously and generate JWKS ([ee5084f](https://github.com/JulianCissen/oidc-mock/commit/ee5084f23d9aafc8ccf16e1fdd4b6f89a6337355))


### Bug Fixes

* ensure postMessage is sent after window load in silent-renew.html ([9a2c7c5](https://github.com/JulianCissen/oidc-mock/commit/9a2c7c518539a7c472ea15d4a3b96b077e2fd32e))
* fixed an issue where line breaks were applied to the timestamp tooltip, making it hard to read ([6ffd038](https://github.com/JulianCissen/oidc-mock/commit/6ffd038da96849736538988cab7ad09312a362fe))
* fixed an issue where release please didn't sync versions ([eaffa87](https://github.com/JulianCissen/oidc-mock/commit/eaffa87b0e7001cb359072d77aa7578595224b3f))
* fixed an issue where release please didn't sync versions ([3d5d65a](https://github.com/JulianCissen/oidc-mock/commit/3d5d65a4751f72685790436d4e856eb585ea26fe))
* fixed an issue where the run_dev script wouldn't actually run the dev Docker image ([5b83e74](https://github.com/JulianCissen/oidc-mock/commit/5b83e74097f327e63f98ed9a64239adbc3ca4fb3))
* fixed an issue with inappropriate typings from cookie-parser ([b2a92d3](https://github.com/JulianCissen/oidc-mock/commit/b2a92d3a20d7d0b94794e06ddf0f9ceaa5029029))
* fixed an issue with inconsistent typings for oidc-provider ([77acc6f](https://github.com/JulianCissen/oidc-mock/commit/77acc6fc57b912a89881d1fcbbd2831f76c0570d))
* fixed HMR being broken in dev because the client tried using wss ([e5dc6ee](https://github.com/JulianCissen/oidc-mock/commit/e5dc6eed76455420623f0bebd218f563a624f24a))
* improve error handling in OIDC controller and index files ([fd630df](https://github.com/JulianCissen/oidc-mock/commit/fd630dfb396ebbd36b52feba8fae56ebb2b21edf))
* package-lock was out of sync ([856ada7](https://github.com/JulianCissen/oidc-mock/commit/856ada7b6ce28b25c77bfc797f44925089713446))

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
