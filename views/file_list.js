define(['backbone', 'file_collection'], function (Backbone, FileCollection) {
	var FileList = Backbone.DeferedView.extend({
		className: 'file-list',

		events: {
			"click div.file-list-item": "open_file"
		},

		initialize: function () {
			_.bindAll(this);
			this.templateName = "templates/file_list.html";
		},

		render: function () {
			this.$el.html(this.template({
				collection: this.collection.toJSON()
			}));
		},

		// Sets window location to the id of the file so that the router can take care of it
		open_file: function (e) {
			window.document.location = $(e.currentTarget).attr("href");
		}
	});

	return FileList;
});