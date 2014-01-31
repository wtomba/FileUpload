define(['backbone', 'file_model'], function (Backbone, FileModel) {
	var Files = Backbone.Collection.extend({
		initialize: function () {
			_.bindAll(this);
		},

		localStorage: new Backbone.LocalStorage("Files"),

	    model: FileModel,

		get_files: function () {
			if (localStorage.getItem("Files")) {
				this.fetch();
			}
		}
	});
	return Files;
});