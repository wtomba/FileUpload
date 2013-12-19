define(['backbone'], function (Backbone) {
	var FileView = Backbone.DeferedView.extend({

        // Set classname
        className: 'upload-manager-file row-fluid',

        events: {
            "click button#btn-start"       : function () { this.model.start() },
            "click button#btn-cancel"      : function () { this.model.cancel() },
            "click button#btn-clear"       : function () { this.model.destroy() }

        },
        
        initialize: function () {
            // Set the template to the filetemplate
            this.templateName = this.options.templates.file;
            
            // Bind model events
            this.listenTo(this.model, "destroy", this.close);
            this.listenTo(this.model, "fileprogress", this.updateProgress);
            this.listenTo(this.model, "filefailed", this.hasFailed);
            this.listenTo(this.model, "filedone", this.hasDone);
            
            // Update the view in all cases
            this.listenTo(this.model, "all", this.update);
        },
        
        /**
         * Render the filetemplate.
         * 
         */
        render: function ()
        {
            // Append the template
            $(this.el).html(this.template(this.computeData()));
            
            // Update elements
            this.update();
        },
        
        /**
         * Update upload progressbar and label.
         * 
         */
        updateProgress: function (progress)
        {
            var percent = parseInt(progress.loaded / progress.total * 100, 10);
            
            this.$el.find('div.progress')
                .find('.bar')
                .css('width', percent+'%')
                .parent()
                .find('.progress-label')
                .html(this.getHelpers().displaySize(progress.loaded)+' of '+this.getHelpers().displaySize(progress.total));
        },
        
        /**
         * File upload failed, print message.
         * 
         */
        hasFailed: function (error)
        {
            this.$el.find('span.message').html('<i class="icon-error"></i> '+error);
        },
        
        /**
         * File upload success, show success
         * 
         */
        hasDone: function (result)
        {
            this.$el.find('span.message').html('<i class="icon-success"></i> Uploaded');
        },
        
        /**
         * Update the necessary parts of the view.
         * 
         */
        update: function ()
        {
            // Elements to be shown based on the state of the model.
            var when_pending = this.$el.find('span.size, button#btn-cancel'),
                when_running = this.$el.find('div.progress, button#btn-cancel'),
                when_done = this.$el.find('span.message, button#btn-clear');
            
            if (this.model.isPending()) {
                when_running.add(when_done).hide();
                when_pending.show();
            } else if (this.model.isRunning()) {
                when_pending.add(when_done).hide();
                when_running.show();
            } else if (this.model.isDone() || this.model.isError()) {
                when_pending.add(when_running).hide();
                when_done.show();
            }
        },
        
        /**
         * Get the data that will be passed to the view.
         * 
         */
        computeData: function ()
        {
            return $.extend(this.getHelpers(), this.model.get('data'));
        }
    });
    return FileView;
});