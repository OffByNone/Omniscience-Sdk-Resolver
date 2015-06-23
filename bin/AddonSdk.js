/* global Promise */

//todo: move business logic out so it can be tested

"use strict";

var _require = require("chrome");

var Cc = _require.Cc;
var Ci = _require.Ci;
var Cu = _require.Cu;
// https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html

var _Cu$import = Cu["import"]("resource://gre/modules/Services.jsm");

var Services = _Cu$import.Services;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm

var _Cu$import2 = Cu["import"]("resource://gre/modules/osfile.jsm");

var OS = _Cu$import2.OS;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

var Constants = require("./Constants");

var createLocalFile = function createLocalFile() {
    return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
};
var mimeService = Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService);
var filePicker = function filePicker() {
    return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
};
var udpSocket = function udpSocket() {
    return Cc["@mozilla.org/network/udp-socket;1"].createInstance(Ci.nsIUDPSocket);
}; // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
var scriptSecurityManager = Services.scriptSecurityManager.getSystemPrincipal();
var dnsService = Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService

var windowUtils = require("sdk/window/utils"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils

var filePickerConstants = Ci.nsIFilePicker;

module.exports.createTCPSocket = function () {
    return Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
};
module.exports.createDomParser = function () {
    return Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
}; // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.timers = function () {
    return require("sdk/timers");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.XMLHttpRequest = function () {
    return require("sdk/net/xhr").XMLHttpRequest;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr
module.exports.button = function () {
    return require("sdk/ui/button/action");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.tabs = function () {
    return require("sdk/tabs");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.notifications = function () {
    return require("sdk/notifications");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.storage = function () {
    return require("sdk/simple-storage").storage;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
module.exports.url = function () {
    return require("sdk/url");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
var fileUtilities = {
    create: function create(fileInfo) {
        var file = createLocalFile();
        if (typeof fileInfo === "string") file.initWithPath(fileInfo);
        if (typeof fileInfo === "object") file.initWithFile(fileInfo);
        return file;
    },
    readBytes: function readBytes(filePath) {
        return OS.File.read(filePath);
    },
    openFileBrowser: function openFileBrowser() {
        return new Promise(function (resolve, reject) {
            var filePicker = filePicker();
            filePicker.init(windowUtils.getMostRecentBrowserWindow(), "Choose File(s)", filePickerConstants.modeOpenMultiple);
            filePicker.appendFilters(filePickerConstants.filterAll | filePickerConstants.filterText);

            filePicker.open(function (result) {
                if (result == filePickerConstants.returnOK) {
                    var filePickerFiles = filePicker.files;
                    var files = [];
                    while (filePickerFiles.hasMoreElements()) {
                        //todo: at least some of this should probably be in another file
                        var file = fileUtilities.create(filePickerFiles.getNext());
                        var fileInfo = {
                            path: file.path,
                            name: file.leafName,
                            type: fileUtilities.getMimeType(file)
                        };

                        files.push(fileInfo);
                    }
                    resolve(files);
                }
            });
        });
    },
    getMimeType: function getMimeType(file) {
        /*
         * From Mozilla
        * Gets a content-type for the given file, by
        * asking the global MIME service for a content-type, and finally by failing
        * over to application/octet-stream.
        *
        * @param file : nsIFile
        * the nsIFile for which to get a file type
        * @returns string
        * the best content-type which can be determined for the file
        */
        try {
            return mimeService.getTypeFromFile(file);
        } catch (e) {
            return "application/octet-stream"; //todo: does this belong in a constants?
        }
    }
};

module.exports.FileUtilities = fileUtilities;

var UDP = {
    createUDPSocket: function createUDPSocket(sourcePort) {
        var socket = udpSocket();
        socket.init(sourcePort || -1, false, scriptSecurityManager);
        return socket;
    }
};

module.exports.udp = UDP;

var ipResolver = {
    resolveIPs: function resolveIPs() {
        var myName = dnsService.myHostName;
        var record = dnsService.resolve(myName, 0);
        var addresses = [];
        while (record.hasMore()) addresses.push(record.getNextAddrAsString());

        if (!addresses.some(function (address) {
            return address === "127.0.0.1";
        })) addresses.push("127.0.0.1");

        return new Promise(function (resolve, reject) {
            if (addresses.length > 1) resolve(addresses.filter(function (address) {
                return Constants.ipv4Regex.test(address);
            }));else ipResolver._forceGetIPs(resolve);
        });
    },
    _forceGetIPs: function _forceGetIPs(resolve) {
        var socket = UDP.createUDPSocket();
        socket.joinMulticast(Constants.IPResolverMulticast);

        socket.asyncListen({
            onPacketReceived: function onPacketReceived(socket, message) {
                // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
                socket.close();
                resolve([message.fromAddr.address, "127.0.0.1"]);
            }
        });
        var message = new Uint8Array([].map.call("get my ipaddresses", function (i) {
            return i.charCodeAt(0);
        }));

        socket.send(Constants.IPResolverMulticast, socket.port, message, message.length);
    }
};

module.exports.IPResolver = ipResolver;