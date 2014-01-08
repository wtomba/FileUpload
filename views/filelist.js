define(['backbone', 'fileCollection', 'modelFile'], function (Backbone, FileCollection, File) {
	var FileList = Backbone.DeferedView.extend({
		className: 'file-list',

		events: {
			"click button.delete_file": "delete_file"
		},

		initialize: function () {
			_.bindAll(this);
			this.templateName = this.options.templates.fileList;
			
			this.get_files();

		},

		render: function () {
			this.$el.html(this.template({
				collection: this.collection.toJSON()
			}));
		},

		// Gets the files from the local storage
		get_files: function () {
			// Check if there is any files
			if (localStorage.getItem("Files")) {
				// Get al the ids from the storage
				var ids = localStorage.getItem("Files").split(",");

				// Get the models from the ids and add them to the collection
				for (var i = ids.length - 1; i >= 0; i--) {
					var file = $.parseJSON(localStorage.getItem("Files-" + ids[i]));
					this.collection.add(file);
				};
			}
		},

		// Removes the file from dom and local storage
		delete_file: function (e) {
			var id = e.currentTarget.id;
			if (this.collection.get(id)) {
				this.collection.get(id).destroy();

				$("#" + id).remove();
			}
		}
	});

	return FileList;
});