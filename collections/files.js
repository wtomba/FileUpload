define(['backbone', 'file_model'], function (Backbone, FileModel) {
	var Files = Backbone.Collection.extend({
					initialize: function () {
						_.bindAll(this);
					},

					localStorage: new Store("Files"),

		            model: FileModel,

		            // Gets all the files from the local storage and adds them to this collection
            		get_files: function () {
						// Check if there is any files
						if (localStorage.getItem("Files")) {
							// Get al the ids from the storage
							var ids = localStorage.getItem("Files").split(",");

							// Get the models from the ids and add them to the collection
							for (var i = ids.length - 1; i >= 0; i--) {
								var file = $.parseJSON(localStorage.getItem("Files-" + ids[i]));
								this.add(file);
							};
						}
					}
		        });

	return Files;
})