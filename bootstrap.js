require.config({
	paths: {
		"jquery": "lib/js/jquery/jquery-1.9.1",
		"jquery.ui.widget": "lib/js/jquery/jquery.ui.widget",
		"iframe-transport": "lib/js/jquery/jquery.iframe-transport",
		"fileupload": "lib/js/jquery/jquery.fileupload",
		"underscore": "lib/js/underscore/underscore-1.4.4",
		"backbone": "lib/js/backbone/backbone-1.0.0",
		"backbonedeferedview": "lib/js/backbone/backbone.defered-view-loader",
		"fileView": "views/fileview",
		"modelFile": "models/file"
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		backbonedeferedview: {
			deps: ["backbone"]
		},
		fileupload: {
			deps: ["jquery", "jquery.ui.widget", "iframe-transport"]
		}
	}
});

require(['views/main'], function() {
	// Reset the baseUrl of template manager
    Backbone.TemplateManager.baseUrl = '{name}';
	
	var fileupload = new Backbone.FileUpload({
        uploadUrl: 'http://upload-manager.sroze.io/upload',
		templates: {
			main: 'templates/fileupload.main',
			file: 'templates/fileupload.file'
		}
	});
	fileupload.renderTo($('div#manager-area'));
});