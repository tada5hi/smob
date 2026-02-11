# [1.5.0](https://github.com/Tada5hi/smob/compare/v1.4.1...v1.5.0) (2024-03-29)


### Features

* introduce arrayPriority option ([#328](https://github.com/Tada5hi/smob/issues/328)) ([7d287bf](https://github.com/Tada5hi/smob/commit/7d287bf1238c15b5670e91b7f3a7100518ed3ac0))

## [1.6.1](https://github.com/tada5hi/smob/compare/smob-v1.6.0...smob-v1.6.1) (2026-02-11)


### Bug Fixes

* set min node engine version to v20.0.0 ([ec4d2d9](https://github.com/tada5hi/smob/commit/ec4d2d90c9ac9e0ed8a2f1865e6c882b0d04250b))

## [1.6.0](https://github.com/tada5hi/smob/compare/smob-v1.5.0...smob-v1.6.0) (2026-02-11)


### ⚠ BREAKING CHANGES

* bump version to v1.x

### Features

* change target version to es2022 + updated dependencies ([54bdbc9](https://github.com/tada5hi/smob/commit/54bdbc98ff91bf4ea65d9e1c0341c102ba450047))
* const for priority side + cleanup types ([bf19728](https://github.com/tada5hi/smob/commit/bf1972895066af4c7d33acbc04e7670f6b926794))
* deep clone input sources ([384acff](https://github.com/tada5hi/smob/commit/384acff632e60d967a92371937d0bb53b35edda4))
* introduce arrayPriority option ([#328](https://github.com/tada5hi/smob/issues/328)) ([7d287bf](https://github.com/tada5hi/smob/commit/7d287bf1238c15b5670e91b7f3a7100518ed3ac0))
* refactor build pipeline & replaced babel with swc ([306c126](https://github.com/tada5hi/smob/commit/306c1268cd22e27c12cc5457e15640de71caab46))
* refactored merger to support arrays ([2185ebe](https://github.com/tada5hi/smob/commit/2185ebe32b963e954265a71fad4bb302deb88e29))
* remove array duplicates by value & reference ([b55dcfc](https://github.com/tada5hi/smob/commit/b55dcfc15c28fbec2d7d53654f70af0e888824fd))
* split regular and distinct array merge + support multiple input arrays ([f7d4a75](https://github.com/tada5hi/smob/commit/f7d4a757e22523ca3a74c1008f78cc12813ee341))
* use weak-map instead of json-stringify for circular reference handling ([33b4ea4](https://github.com/tada5hi/smob/commit/33b4ea4cef102dec3334f08c66f25fbb84bcafb4))


### Bug Fixes

* add generic argument for distinct-array util ([4d31b24](https://github.com/tada5hi/smob/commit/4d31b24e0ca63f54b538d58eb0683a36170269ce))
* better polyfill implementation for cloning arrays and objects ([fad6beb](https://github.com/tada5hi/smob/commit/fad6bebd9d7dc016f5c8a153e1e8181f12704bfb))
* create a new weak map for each source ([4ed64d2](https://github.com/tada5hi/smob/commit/4ed64d26bc0d2acc7fe075ad45a3cccd3bd4aa19))
* **deps:** bump json5 from 1.0.1 to 1.0.2 ([33a7d6c](https://github.com/tada5hi/smob/commit/33a7d6c7dedcde7010179e25a683847fc63c25cb))
* enhanced typing for merger result ([19fc7ff](https://github.com/tada5hi/smob/commit/19fc7ff9766bcf901dfa319f6e7bb07fa6dd068f))
* extend is-equal check for arrays ([406d48b](https://github.com/tada5hi/smob/commit/406d48bc43db99ed7f7b46f56a1d2a948de3ade4))
* force version bump ([e1a993d](https://github.com/tada5hi/smob/commit/e1a993d695566e778cb545ad6278677626b4d311))
* move sources length check to create-merger ([c55bfc5](https://github.com/tada5hi/smob/commit/c55bfc5b25adafee35c3af7f2d8672879c898e7e))
* optimize array merge ([240ce25](https://github.com/tada5hi/smob/commit/240ce2577eb99ee12fb9186b2f41fddb610cf3c0))
* remove unused utility methods + applied linter ([76baf8e](https://github.com/tada5hi/smob/commit/76baf8eee28359480878dce17d0dd31143c2610e))
* removed superfluous cut utility ([b8f5826](https://github.com/tada5hi/smob/commit/b8f5826a022d32225a3069f309e159c89b3494cc))
* return type of merge result ([cc534b9](https://github.com/tada5hi/smob/commit/cc534b960aeaae33f34d42e5bd0f172078f80efa))


### Miscellaneous Chores

* clenaup tsconfig.eslint.json ([4292a46](https://github.com/tada5hi/smob/commit/4292a460190d3a4b051a2edacac70221c1281922))

## [1.4.1](https://github.com/Tada5hi/smob/compare/v1.4.0...v1.4.1) (2023-09-20)


### Bug Fixes

* removed superfluous cut utility ([b8f5826](https://github.com/Tada5hi/smob/commit/b8f5826a022d32225a3069f309e159c89b3494cc))

# [1.4.0](https://github.com/Tada5hi/smob/compare/v1.3.0...v1.4.0) (2023-05-29)


### Bug Fixes

* better polyfill implementation for cloning arrays and objects ([fad6beb](https://github.com/Tada5hi/smob/commit/fad6bebd9d7dc016f5c8a153e1e8181f12704bfb))
* create a new weak map for each source ([4ed64d2](https://github.com/Tada5hi/smob/commit/4ed64d26bc0d2acc7fe075ad45a3cccd3bd4aa19))
* remove unused utility methods + applied linter ([76baf8e](https://github.com/Tada5hi/smob/commit/76baf8eee28359480878dce17d0dd31143c2610e))


### Features

* use weak-map instead of json-stringify for circular reference handling ([33b4ea4](https://github.com/Tada5hi/smob/commit/33b4ea4cef102dec3334f08c66f25fbb84bcafb4))

# [1.3.0](https://github.com/Tada5hi/smob/compare/v1.2.0...v1.3.0) (2023-05-28)


### Bug Fixes

* move sources length check to create-merger ([c55bfc5](https://github.com/Tada5hi/smob/commit/c55bfc5b25adafee35c3af7f2d8672879c898e7e))


### Features

* deep clone input sources ([384acff](https://github.com/Tada5hi/smob/commit/384acff632e60d967a92371937d0bb53b35edda4))
* refactored merger to support arrays ([2185ebe](https://github.com/Tada5hi/smob/commit/2185ebe32b963e954265a71fad4bb302deb88e29))

# [1.3.0-alpha.2](https://github.com/Tada5hi/smob/compare/v1.3.0-alpha.1...v1.3.0-alpha.2) (2023-05-28)


### Features

* deep clone input sources ([384acff](https://github.com/Tada5hi/smob/commit/384acff632e60d967a92371937d0bb53b35edda4))

# [1.3.0-alpha.1](https://github.com/Tada5hi/smob/compare/v1.2.0...v1.3.0-alpha.1) (2023-05-28)


### Features

* refactored merger to support arrays ([2185ebe](https://github.com/Tada5hi/smob/commit/2185ebe32b963e954265a71fad4bb302deb88e29))

# [1.2.0](https://github.com/Tada5hi/smob/compare/v1.1.1...v1.2.0) (2023-05-28)


### Bug Fixes

* add generic argument for distinct-array util ([4d31b24](https://github.com/Tada5hi/smob/commit/4d31b24e0ca63f54b538d58eb0683a36170269ce))
* optimize array merge ([240ce25](https://github.com/Tada5hi/smob/commit/240ce2577eb99ee12fb9186b2f41fddb610cf3c0))


### Features

* split regular and distinct array merge + support multiple input arrays ([f7d4a75](https://github.com/Tada5hi/smob/commit/f7d4a757e22523ca3a74c1008f78cc12813ee341))

## [1.1.1](https://github.com/Tada5hi/smob/compare/v1.1.0...v1.1.1) (2023-05-20)


### Bug Fixes

* extend is-equal check for arrays ([406d48b](https://github.com/Tada5hi/smob/commit/406d48bc43db99ed7f7b46f56a1d2a948de3ade4))

# [1.1.0](https://github.com/Tada5hi/smob/compare/v1.0.0...v1.1.0) (2023-05-19)


### Features

* remove array duplicates by value & reference ([b55dcfc](https://github.com/Tada5hi/smob/commit/b55dcfc15c28fbec2d7d53654f70af0e888824fd))

# [1.0.0](https://github.com/Tada5hi/smob/compare/v0.1.0...v1.0.0) (2023-03-20)


### Features

* const for priority side + cleanup types ([bf19728](https://github.com/Tada5hi/smob/commit/bf1972895066af4c7d33acbc04e7670f6b926794))


### BREAKING CHANGES

* bump version to v1.x

# [0.1.0](https://github.com/Tada5hi/smob/compare/v0.0.7...v0.1.0) (2023-01-27)


### Features

* refactor build pipeline & replaced babel with swc ([306c126](https://github.com/Tada5hi/smob/commit/306c1268cd22e27c12cc5457e15640de71caab46))

## [0.0.7](https://github.com/Tada5hi/smob/compare/v0.0.6...v0.0.7) (2023-01-11)


### Bug Fixes

* **deps:** bump json5 from 1.0.1 to 1.0.2 ([33a7d6c](https://github.com/Tada5hi/smob/commit/33a7d6c7dedcde7010179e25a683847fc63c25cb))

## [0.0.6](https://github.com/Tada5hi/smob/compare/v0.0.5...v0.0.6) (2022-10-19)


### Bug Fixes

* return type of merge result ([cc534b9](https://github.com/Tada5hi/smob/commit/cc534b960aeaae33f34d42e5bd0f172078f80efa))

## [0.0.5](https://github.com/Tada5hi/smob/compare/v0.0.4...v0.0.5) (2022-10-19)


### Bug Fixes

* force version bump ([e1a993d](https://github.com/Tada5hi/smob/commit/e1a993d695566e778cb545ad6278677626b4d311))

## [0.0.4](https://github.com/Tada5hi/smob/compare/v0.0.3...v0.0.4) (2022-10-19)


### Bug Fixes

* enhanced typing for merger result ([19fc7ff](https://github.com/Tada5hi/smob/commit/19fc7ff9766bcf901dfa319f6e7bb07fa6dd068f))
