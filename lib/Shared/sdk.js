/* global chrome */
/* global Promise */
"use strict";

const UrlSdk = require("./UrlSdk");
const MimeService = require('./MimeService');

module.exports.createBase64Utils = () => { return { encode: (convertMe) => { return window.btoa(convertMe); }, decode: (decodeMe) => { window.atob(decodeMe); } }; };
module.exports.createDomParser = () => new window.DOMParser();

module.exports.timers = () => window;
module.exports.url = () => new UrlSdk(window.URL);
module.exports.XMLHttpRequest = () => window.XMLHttpRequest;

