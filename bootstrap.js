require.config({
	paths: {
		"purejquery": "lib/js/jquery/jquery-1.9.1",
		"jquery.ui.widget": "lib/js/jquery/jquery.ui.widget",
		"iframe-transport": "lib/js/jquery/jquery.iframe-transport",
		"fileupload-main": "lib/js/jquery/jquery.fileupload",
		"underscore": "lib/js/underscore/underscore-1.4.4",
		"purebackbone": "lib/js/backbone/backbone-1.0.0",
		"bb-dvl": "lib/js/backbone/backbone.defered-view-loader",
		"bb-ls": "lib/js/backbone/backbone.localStorage-min",
		"router": "routes",
		"main_view": "views/main",
		"file_view": "views/file_view",
		"form_file": "views/form_file",
		"file_list": "views/file_list",
		"file_model": "models/file",
		"file_collection": "collections/files",
		"jquery": "lib/js/jquery/jquery",
		"backbone": "lib/js/backbone/backbone",
		"fileupload": "lib/js/jquery/fileupload"
	},
	shim: {
		jquery: {
			deps: ["purejquery", "jquery.ui.widget", "iframe-transport"]
		},
		underscore: {
			exports: '_'
		},
		purebackbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		"bb-dvl": ["purebackbone", "underscore"],
		"bb-ls": ["purebackbone", "underscore"],
		"router": ["purebackbone", "underscore"],
		"fileupload": ["jquery"]
	}
});