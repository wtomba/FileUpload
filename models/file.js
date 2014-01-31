define(['backbone'], function (Backbone) {
	
	// The events triggered in this model is used in form_file.js, 
	//the state is used in form_file to determine which elements to be shown in each case.
	var FileModel = Backbone.Model.extend({
	    state: "pending",
	    
	    start: function () {
	        if (this.isPending()) {
	            this.get('processor').submit();
	            this.state = "running";
	            this.trigger('filestarted', this);
	        }
	    },
	    
	    cancel: function () {
	    	if (this.get('processor')) {
	        	this.get('processor').abort();
	    	}
	        this.destroy();
	    },

	    progress: function (data) {
	        this.trigger('fileprogress', this.get('processor').progress());
	    },

	    fail: function (error) {
	        this.state = "error";
	        this.trigger('filefailed', error);
	    },

	    done: function (result) {
	        this.state = "done";
	        this.trigger('filedone', result);
	    },

	    isPending: function () {
	        return this.getState() == "pending";
	    },

	    isRunning: function () {
	        return this.getState() == "running";
	    },

	    isDone: function () {
	        return this.getState() == "done";
	    },

	    isError: function () {
	        return this.getState() == "error" || this.getState == "canceled";
	    },

	    getState: function () {
	        return this.state;
	    }
	});

	return FileModel;
});