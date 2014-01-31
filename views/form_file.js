define(['backbone'], function (Backbone) {
	var FormFile = Backbone.DeferedView.extend({
        className: 'upload-manager-file row-fluid',

        events: {
            "click button#btn-start"       : function () { this.model.start() },
            "click button#btn-cancel"      : function () { this.model.cancel() },
            "click button#btn-clear"       : function () { this.model.destroy() }

        },
        
        initialize: function () {
            _.bindAll(this);
            this.templateName = this.options.templates.form_file;
            
            this.listenTo(this.model, "destroy", function () { this.remove() });
            this.listenTo(this.model, "fileprogress", this.updateProgress);
            this.listenTo(this.model, "filefailed", this.hasFailed);
            this.listenTo(this.model, "filedone", this.isDone);
            
            this.listenTo(this.model, "all", this.update);
        },
        
        render: function () {
            $(this.el).html(this.template(this.computeData()));

            this.update();
        },

        updateProgress: function (progress) {
            var percent = parseInt(progress.loaded / progress.total * 100, 10);
            
            // Change the width of the loading bar aswell as set the progress-text
            this.$el.find('div.progress')
                .find('.bar')
                .css('width', percent+'%')
                .parent()
                .find('.progress-label')
                .html(this.getHelpers().displaySize(progress.loaded)+' of '+this.getHelpers().displaySize(progress.total));
        },

        hasFailed: function (error) {
            this.$el.find('span.message').html('<i class="icon-error"></i> '+error);
        },

        isDone: function (result) {
            this.$el.find('span.message').html('<i class="icon-success"></i> Uploaded');
        },

        update: function () {
            // Elements to be shown based on the state of the model.
            var when_pending = this.$el.find('span.size, button#btn-cancel, button#btn-start'),
                when_running = this.$el.find('div.progress, button#btn-cancel')
            
            if (this.model.isPending()) {
                when_running.hide();
                when_pending.show();
            } else if (this.model.isRunning()) {
                when_pending.hide();
                when_running.show();
            } else if (this.model.isDone() || this.model.isError()) {
                when_pending.add(when_running).hide();
            }
        },

        computeData: function () {
            return $.extend(this.getHelpers(), this.model.get('data'));
        }
    });
    return FormFile;
});