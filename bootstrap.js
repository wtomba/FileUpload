require.config({
	paths: {
		"jquery": "lib/jquery/jquery-1.10.2.min",
		"underscore": "lib/underscore/underscore",
		"backbone": "lib/backbone/backbone"
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});

require(['views/main'], function(AppView) {
	new AppView;
});