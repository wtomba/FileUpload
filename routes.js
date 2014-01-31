define(['backbone', 'main_view', 'file_view', 'file_list', 'file_collection'], function (Backbone, MainView, FileView, FileList, FileCollection) {
	var Router = Backbone.Router.extend({
		initialize: function () { 
			Backbone.history.start();
		    // Reset the baseUrl of template manager
		    Backbone.TemplateManager.baseUrl = '{name}';

			// Fetch the files from he localStorage
			this.collection.get_files();
		},

		collection: new FileCollection(),
		
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
                    form_file: 'templates/form_file.html'
                },
                collection: this.collection
            });
			this.loadView(main_view);
		},

		getFiles: function () {
			var file_list = new FileList({ collection: this.collection });
			this.loadView(file_list);
		},

		getFile: function (id) {
			var file_view = new FileView({id: id, collection: this.collection});
			this.loadView(file_view);
		},

		loadView: function (view) {
			// Remove the previous view
			this.view && this.view.remove();

			$("#manager-area").slideUp(200, function () {
				$("#manager-area").html(view.deferedRender().el);
				$("#manager-area").slideDown(200);
			});

			this.view = view;
		}
	});

	return Router;
});