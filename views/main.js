define(['backbone'], function(Backbone) {
	var App = Backbone.View.extend({
		// Defines the html element where the html should be appended
		el: '#container',
		// Defines hello world template
		template: _.template("<h2>Hello <%= who %><h2>"),
		// Initializes the view and adds the template to the element.
		initialize: function() {
			this.$el.html(this.template({who: 'world!'}));
		}
	});

	return App;
});