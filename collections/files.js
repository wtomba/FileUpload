define(['backbone', 'modelFile'], function (Backbone, FileModel) {
	var Files = Backbone.Collection.extend({
					localStorage: new Store("Files"),
		            model: FileModel
		        });

	return Files;
})