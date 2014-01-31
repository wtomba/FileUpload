define(['backbone', 'file_collection'], function (Backbone, FileCollection) {
	var FileView = Backbone.DeferedView.extend({
		className: 'file',

		events: {
			"click button.delete-file" : "delete_file"
		},

		initialize: function () {
			_.bindAll(this);
			this.templateName = "templates/file.html";

			this.model = this.collection.get(this.id);
		},

		render: function () {
			this.$el.html(this.template({model: this.model}));
		},
		
		delete_file: function () {
			this.model.destroy();
			window.document.location = "#files";
		}
	});
	return FileView;
});