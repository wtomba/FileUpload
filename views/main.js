define(['backbone', 'fileupload', 'backbonedeferedview', 'fileView', 'modelFile'], function(Backbone, Fileupload, fileView, fileModel) {
    Backbone.FileUpload = Backbone.DeferedView.extend({
        // Default values. Will be overwritten/merged by the passed options.
        defaults: {
            templates: {
                main: '/templates/fileupload.main.default',
                file: '/templates/fileupload.file.default'
            },
            uploadUrl: '/upload',
            autoUpload: false
        },
        
        // Used to identify the files
        file_id: 0,
        
        // Set classname
        className: 'upload-manager',
        
        // Initializes the fileupload plugin with the passed options
        initialize: function () 
        {
            // Merges the default options with the passed options
            this.options = $.extend(this.defaults, this.options);
            
            // Set the template name
            this.templateName = this.options.templates.main;
            
            // Instansiate the filelist
            this.files = new Backbone.FileModel.Collection();
            
            // Bind JqueryFileUpload
            this.uploadProcess = $('<input id="fileupload" type="file" name="files[]" multiple="multiple">').fileupload({
                dataType: 'json',
                url: this.options.uploadUrl,
                autoUpload: this.options.autoUpload,
                singleFileUploads: true
            });
            
            // Add process events
            this.bindProcessEvents();
            
            // Add local events
            this.bindLocal();
        },
        
        /**
         * Bind local events.
         * 
         */
        bindLocal: function ()
        {
            var that = this;
            this.on('fileadd', function (file) {
                // Add the file to the filelist
                that.files.add(file);
                
                // Render the fileview
                that.renderFile(file);
            }).on('fileprogress', function (file, progress) {
                file.progress(progress);
            }).on('filefail', function (file, error) {
                file.fail(error);
            }).on('filedone', function (file, data) {
                file.done(data.result);
            });
            
            // Update the main view after all events
            this.files.on('all', this.update, this);
        },
        
        /**
         * Renders a file.
         * 
         */
        renderFile: function (file)
        {
            var file_view = new Backbone.FileView($.extend(this.options, {model: file}));
            $('#file-list', this.el).append(file_view.deferedRender().el);
        },
        
        /**
         * Update the necessary parts of the view
         * 
         */
        update: function ()
        {
            var show_when_files_present = $('button#cancel-uploads-button, button#start-uploads-button', this.el);
            var show_when_files_not_present = $('#file-list .no-data', this.el);
            if (this.files.length > 0) {
                show_when_files_present.show();
                show_when_files_not_present.hide();
            } else {
                show_when_files_present.hide();
                show_when_files_not_present.show();
            }
        },
        
        /**
         * Bind events on the upload processor.
         * 
         */
        bindProcessEvents: function ()
        {
            var that = this;
            this.uploadProcess.on('fileuploadadd', function (e, data) {
                // An array where the files will be stored
                data.fileUploadFiles = [];
                
                // When a file is added
                $.each(data.files, function (index, file_data) {
                    // Create a new filemodel with the data
                    file_data.id = that.file_id++;
                    var file = new Backbone.FileModel({
                        data: file_data,
                        processor: data
                    });
                    
                    // Push the file to the array
                    data.fileUploadFiles.push(file);
                    
                    // Trigger event
                    that.trigger('fileadd', file);
                });
            }).on('fileuploadprogress', function (e, data) {
                $.each(data.fileUploadFiles, function (index, file) {
                    that.trigger('fileprogress', file, data);
                });
            }).on('fileuploadfail', function (e, data) {
                $.each(data.fileUploadFiles, function (index, file) {
                    var error = "Unknown error";
                    if (typeof data.errorThrown == "string") {
                        error = data.errorThrown;
                    } else if (typeof data.errorThrown == "object") {
                        error = data.errorThrown.message;
                    } else if (data.result) {
                        if (data.result.error) {
                            error = data.result.error;
                        } else if (data.result.files && data.result.files[index] && data.result.files[index].error) {
                            error = data.result.files[index].error;
                        } else {
                            error = "Unknown remote error";
                        }
                    }
                    
                    that.trigger('filefail', file, error);
                });
            }).on('fileuploaddone', function (e, data) {
                $.each(data.fileUploadFiles, function (index, file) {
                    that.trigger('filedone', file, data);
                });
            });
        },
        
        /**
         * Render the main part of the FileUpload.
         * 
         */
        render: function ()
        {
            $(this.el).html(this.template());
            
            // Update view
            this.update();
            
            // Add add files handler
            var input = $('input#fileupload', this.el), that = this;
            input.on('change', function (){
                that.uploadProcess.fileupload('add', {
                    fileInput: $(this)
                });
                $(this).val('');
            });
            
            // Add cancel all handler
            $('button#cancel-uploads-button', this.el).click(function(){
                that.files.each(function(file){
                    file.cancel();
                });
            });
            
            // Add start uploads handler
            $('button#start-uploads-button', this.el).click(function(){
                that.files.each(function(file){
                    file.start();
                });
            });
            
            // Render current files
            $.each(this.files, function (i, file) {
                that.renderFile(file);
            });
        }
    });
});