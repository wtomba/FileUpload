require.config({
	paths: {
		"purejquery": "lib/js/jquery/jquery-1.9.1",
		"jquery.ui.widget": "lib/js/jquery/jquery.ui.widget",
		"iframe-transport": "lib/js/jquery/jquery.iframe-transport",
		"fileupload": "lib/js/jquery/jquery.fileupload",
		"underscore": "lib/js/underscore/underscore-1.4.4",
		"purebackbone": "lib/js/backbone/backbone-1.0.0",
		"bb-dvl": "lib/js/backbone/backbone.defered-view-loader",
		"fileView": "views/fileview",
		"modelFile": "models/file",
		"jquery": "lib/js/jquery/jquery",
		"backbone": "lib/js/backbone/backbone"
	},
	shim: {
		jquery: {
			deps: ["purejquery", "jquery.ui.widget", "iframe-transport", "fileupload"]
		},
		underscore: {
			exports: '_'
		},
		purebackbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		"bb-dvl": ["purebackbone", "underscore"]
	}
});