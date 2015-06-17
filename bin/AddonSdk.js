/* global Promise */

//todo: rewrite this so it is testable

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

var createLocalFile = function createLocalFile() {
    return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
};
var mimeService = function mimeService() {
    return Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService);
};
var filePicker = function filePicker() {
    return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
};
var udpSocket = function udpSocket() {
    return Cc["@mozilla.org/network/udp-socket;1"].createInstance(Ci.nsIUDPSocket);
}; // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
var getscriptSecurityManager = function getscriptSecurityManager() {
    return Services.scriptSecurityManager.getSystemPrincipal();
};

var windowUtils = require("sdk/window/utils"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils

var filePickerConstants = Ci.nsIFilePicker;

module.exports.createTCPSocket = function () {
    return Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
};
module.exports.dnsService = function () {
    return Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService);
}; // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
module.exports.timers = require("sdk/timers"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

module.exports.FileUtilities = {
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
        var _this = this;

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
                        var file = _this.create(filePickerFiles.getNext());
                        var fileInfo = {
                            path: file.path,
                            name: file.leafName,
                            type: _this.getMimeType(file)
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
            return mimeService().getTypeFromFile(file);
        } catch (e) {
            return "application/octet-stream"; //todo: does this belong in a constants?
        }
    }
};

module.exports.udp = {
    createUDPSocket: function createUDPSocket(sourcePort) {
        var socket = udpSocket();
        socket.init(sourcePort || -1, false, getscriptSecurityManager());
        return socket;
    }
};