"use strict";

module.exports = {
	ipv4Regex: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
	IPResolverMulticast: '239.255.255.255',
	defaultMimeType: "application/octet-stream",
	addonSdk: {
		filePicker: {
			filterAll: 0x001, //Corresponds to the *.* filter for file extensions. All files will pass through the filter.
			filterImages: 0x008, //Corresponds to the *.jpe, *.jpg, *.jpeg, *.gif, *.png, *.bmp, *.ico, *.svg, *.svgz, *.tif, *.tiff, *.ai, *.drw, *.pct, *.psp, *.xcf, *.psd and *.raw filters for file extensions.
			filterAudio: 0x100, //Corresponds to the *.aac, *.aif, *.flac, *.iff, *.m4a, *.m4b, *.mid, *.midi, *.mp3, *.mpa, *.mpc, *.oga, *.ogg, *.ra, *.ram, *.snd, *.wav and *.wma filters for file extensions.
			filterVideo: 0x200, //Corresponds to the *.avi, *.divx, *.flv, *.m4v, *.mkv, *.mov, *.mp4, *.mpeg, *.mpg, *.ogm, *.ogv, *.ogx, *.rm, *.rmvb, *.smil, *.webm, *.wmv and *.xvid filters for file extensions.
			returnOK: 0, //The file picker dialog was closed by the user hitting 'Ok'
			returnCancel: 1, //The file picker dialog was closed by the user hitting 'Cancel'
			modeOpenMultiple: 3, //Load multiple files.
			windowTitle: "Choose File(s)",
			noFilesChosen: "file browser was closed without choosing any files"
		}
	},
	forceGetIPMessage: new Uint8Array([].map.call("get my ipaddresses", i => i.charCodeAt(0)))
};