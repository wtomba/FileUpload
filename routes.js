define(['backbone'], function (Backbone) {
	var Router = Backbone.Router.extend({
		initialize: function () { Backbone.history.start(); 
		},
		
		routes: {
			"": "index",
			"images/:action": "createFile",
			"*actions*": "defaultRoute"
		},
		
		index: function	() {
			alert("index");
		}, 

		createFile: function	() {
			console.log("asd");
		}
	});

	return Router;
});