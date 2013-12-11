define(['backbone', 'backbonedeferedview'], function (Backbone) {
	Backbone.FileView = Backbone.DeferedView.extend({

        // Set classname
        className: 'upload-manager-file row-fluid',
        
        initialize: function () {
            // Set the template to the filetemplate
            this.templateName = this.options.templates.file;
            
            // Bind model events
            this.model.on('destroy', this.close, this);
            this.model.on('fileprogress', this.updateProgress, this);
            this.model.on('filefailed', this.hasFailed, this);
            this.model.on('filedone', this.hasDone, this);
            
            // Update the view in all cases
            this.model.on('all', this.update, this);
        },
        
        /**
         * Render the filetemplate.
         * 
         */
        render: function ()
        {
            $(this.el).html(this.template(this.computeData()));
            
            // Bind button-events
            this.bindEvents();
            
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
            
            $('div.progress', this.el)
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
            $('span.message', this.el).html('<i class="icon-error"></i> '+error);
        },
        
        /**
         * File upload success, show success
         * 
         */
        hasDone: function (result)
        {
            $('span.message', this.el).html('<i class="icon-success"></i> Uploaded');
        },
        
        /**
         * Update the necessary parts of the view.
         * 
         */
        update: function ()
        {
            // Elements to be shown based on the state of the model.
            var when_pending = $('span.size, button#btn-cancel', this.el),
                when_running = $('div.progress, button#btn-cancel', this.el),
                when_done = $('span.message, button#btn-clear', this.el);
            
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
         * Bind local elements events.
         * 
         */
        bindEvents: function ()
        {
            var that = this;
            
            // DOM events
            $('button#btn-cancel', this.el).click(function(){
                that.model.cancel();
            });
            $('button#btn-clear', this.el).click(function(){
                that.model.destroy();
            });
            $('button#btn-start', this.el).click(function(){
                that.model.start();
            })
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
});