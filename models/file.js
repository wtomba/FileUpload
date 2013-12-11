define(['backbone'], function (Backbone) {
	/**
	 * Model that represents one file
	 * 
	 */
	Backbone.FileModel = Backbone.Model.extend({
	    state: "pending",
	    
	    /**
	     * Start upload.
	     * 
	     */
	    start: function ()
	    {
	        if (this.isPending()) {
	            this.get('processor').submit();
	            
	            // Set modelstate and trigger event
	            this.state = "running";
	            this.trigger('filestarted', this);
	        }
	    },
	    
	    /**
	     * Cancel a file upload.
	     * 
	     */
	    cancel: function () 
	    {
	        this.get('processor').abort();
	        this.destroy();
	        
	        // Set modelstate and trigger event
	        this.state = "canceled";
	        this.trigger('filecanceled', this);
	    },
	    
	    /**
	     * Notify file that progress updated.
	     * 
	     */
	    progress: function (data)
	    {
	        // Trigger event
	        this.trigger('fileprogress', this.get('processor').progress());
	    },
	    
	    /**
	     * Notify file that upload failed.
	     * 
	     */
	    fail: function (error)
	    {
	        // Set modelstate and trigger event
	        this.state = "error";
	        this.trigger('filefailed', error);
	    },
	    
	    /**
	     * Notify file that upload is done.
	     * 
	     */
	    done: function (result)
	    {
	        // Set modelstate and trigger event
	        this.state = "done";
	        this.trigger('filedone', result);
	    },
	    
	    /**
	     * Is this file pending to be uploaded?
	     * 
	     */
	    isPending: function ()
	    {
	        return this.getState() == "pending";
	    },
	    
	    /**
	     * Is this file currently uploading?
	     * 
	     */
	    isRunning: function ()
	    {
	        return this.getState() == "running";
	    },
	    
	    /**
	     * Is this file uploaded?
	     * 
	     */
	    isDone: function ()
	    {
	        return this.getState() == "done";
	    },
	    
	    /**
	     * Does the upload have an error?
	     * 
	     */
	    isError: function ()
	    {
	        return this.getState() == "error" || this.getState == "canceled";
	    },
	    
	    /**
	     * Returns the current modelstate
	     * 
	     */
	    getState: function ()
	    {
	        return this.state;
	    }
	}, {

		// Represents a collection of files
		Collection: Backbone.Collection.extend({
            model: Backbone.FileModel
        })
	});
});