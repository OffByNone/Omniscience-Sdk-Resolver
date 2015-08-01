[![Circle CI](https://img.shields.io/circleci/project/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://circleci.com/gh/OffByNone/omniscience-sdk-resolver)
[![David](https://img.shields.io/david/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://david-dm.org/offbynone/omniscience-sdk-resolver#info=dependencies)
[![David](https://img.shields.io/david/dev/OffByNone/Omniscience-Sdk-Resolver.svg?style=flat-square)](https://david-dm.org/offbynone/omniscience-sdk-resolver#info=devDependencies)

Determines which SDK to use, and returns said SDK with shims to allow Omniscience to run in different environments.

Works in Firefox.

Chrome implementation has begun!

Currently working in Chrome:
	StorageService (using chrome.storage.local AKA non syncing storage as chrome.storage.sync has different size limitations which were being exceeded)
	UrlSdk
	UDPSocket (there are limitations) http://stackoverflow.com/questions/14388706/socket-options-so-reuseaddr-and-so-reuseport-how-do-they-differ-do-they-mean-t
	IPResolver (there is a different chrome specific way to do this that might be better, which uses something from the networking namespace)
	Notifications (IconUrl must either be local or a data-uri)
	XMLHttpRequest
	timers
	DomParser
Not yet working in Chrome:
	FileUtilities
	TCPSocket