define(['backbone', 'main_view', 'file_view', 'file_list'], function (Backbone, MainView, FileView, FileList) {
	var Router = Backbone.Router.extend({
		initialize: function () { 
			Backbone.history.start();
		},
		
		routes: {
			"files"		: "getFiles",
			"files/:id"	: "getFile",
			"*actions*"	: "defaultRoute"
		},
		
		defaultRoute: function	() {
            var main_view = new MainView({
                uploadUrl: 'http://upload-manager.sroze.io/upload',
                templates: {
                    main: 'templates/form.html',
                    form_file: 'templates/form_file.html',
                    fileList: 'templates/file_list.html'
                },
                collection: this.collection
            });
			this.appendElement(main_view.deferedRender().el);
		},

		getFiles: function () {
			var file_list = new FileList();
			this.appendElement(file_list.deferedRender().el);
		},

		getFile: function (id) {
			var file_view = new FileView({id: id});
			this.appendElement(file_view.deferedRender().el);
		},

		// Animates the main element
		appendElement: function (element) {
			$("#manager-area").slideUp(200, function () {
				$("#manager-area").html(element);
				$("#manager-area").slideDown(200);
			});			
		}
	});

	return Router;
});