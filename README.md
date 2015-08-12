[![Circle CI](https://img.shields.io/circleci/project/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://circleci.com/gh/OffByNone/omniscience-sdk-resolver)
[![David](https://img.shields.io/david/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://david-dm.org/offbynone/omniscience-sdk-resolver#info=dependencies)
[![David](https://img.shields.io/david/dev/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://david-dm.org/offbynone/omniscience-sdk-resolver#info=devDependencies)

Determines which SDK to use, and returns said SDK with shims to allow Omniscience to run in different environments.

Works in Firefox.
More or less works in chrome.

On windows 8.1 kill services upnphost and SSDPSRV to allow the passive searcher to bind in chrome.