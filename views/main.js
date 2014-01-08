define(['backbone', 'fileView', 'modelFile', 'fileList', 'fileCollection'], function(Backbone, FileView, FileModel, FileList, FileCollection) {
    // Reset the baseUrl of template manager
    Backbone.TemplateManager.baseUrl = '{name}';

    var FileUploadPlugin = Backbone.DeferedView.extend({
        // Default values. Will be overwritten/merged by the passed options.
        defaults: {
            templates: {
                main: '/templates/fileupload.main.default',
                file: '/templates/fileupload.file.default'
            },
            uploadUrl: '/upload',
            autoUpload: false
        },
        
        // Set classname
        className: 'upload-manager',

        events: {
            "change input#fileupload"               : "add_file",
            "click button#cancel-uploads-button"    : "cancel_uploads",
            "click button#start-uploads-button"     : "start_uploads"
        },
        
        // Initializes the fileupload plugin with the passed options
        initialize: function () 
        {
            _.bindAll(this);

            // Merges the default options with the passed options
            this.options = $.extend(this.defaults, this.options);
            
            // Set the template name
            this.templateName = this.options.templates.main;
            
            // Instansiate the filelist
            this.files = new FileCollection();

            // List where uploaded items will be saved to the local storage
            this.storedFiles = new FileCollection();
            
            // Bind JqueryFileUpload
            this.uploadProcess = $('<input id="fileupload" type="file" name="files[]" multiple="multiple">').fileupload({
                dataType: 'json',
                url: this.options.uploadUrl,
                autoUpload: this.options.autoUpload,
                singleFileUploads: true
            });
            
            // Add process events
            this.bindProcessEvents();
        },
        
        /**
         * Renders a file.
         * 
         */
        renderFile: function (file)
        {
            var file_view = new FileView($.extend(this.options, {model: file}));
            $('#file-list', this.el).append(file_view.deferedRender().el);
        },

        renderFileList: function () {            
            var file_list = new FileList($.extend(this.options, {collection: this.storedFiles}));
            $('.files', this.el).html(file_list.deferedRender().el);
        },
        
        /**
         * Update the necessary parts of the view
         * 
         */
        update: function ()
        {
            var show_when_files_present = this.$el.find('button#cancel-uploads-button, button#start-uploads-button');
            var show_when_files_not_present = this.$el.find('#file-list .no-data');
            if (this.files.length > 0) {
                show_when_files_present.show();
                show_when_files_not_present.hide();
            } else {
                show_when_files_present.hide();
                show_when_files_not_present.show();
            }
        },
        
        /**
         * Bind events on the upload processor that triggers events in this view
         * 
         */
        bindProcessEvents: function ()
        {
            var that = this;
            this.uploadProcess.on('fileuploadadd', function (e, data) {
                that.fileUploadAdd(e, data);
            }).on('fileuploadprogress', function (e, data) {
                that.fileUploadProgress(e, data);
            }).on('fileuploadfail', function (e, data) {
                that.fileUploadFail(e, data);
            }).on('fileuploaddone', function (e, data) {
                that.fileUploadDone(e, data);
            });

            // Update the main view after all events
            this.listenTo(this.files, 'all', this.update);
        },

        fileUploadAdd: function (e, data) {
            var that = this;

            // An array where the files will be stored
            data.fileUploadFiles = [];
            
            // When a file is added
            $.each(data.files, function (index, file_data) {
                // Create a new filemodel with the data
                var file = new FileModel({
                    data: file_data,
                    processor: data
                });
                
                // Push the file to the array
                data.fileUploadFiles.push(file);
                
                // Add the file temporarily to the file list (add wont cause it to save to the local storage)
                that.files.add(file);

                // Render the fileview
                that.renderFile(file);         
            });
        },

        fileUploadProgress: function (e, data) {
            $.each(data.fileUploadFiles, function (index, file) {
                file.progress(data);
            });
        },

        fileUploadFail: function (e, data) {
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

                // Call fail function on the file.                
                file.fail(error);
            });
        },

        fileUploadDone: function (e, data) {
            var that = this;

            $.each(data.fileUploadFiles, function (index, file) {
                var new_file = file.attributes.data;
                file.done(data.result);

                // Create the file to the list so it saves to the localstorage
                that.storedFiles.create(new_file);
                that.renderFileList();

                window.setTimeout(function () { file.destroy(); }, 800);
            });
        },
        
        /**
         * Render the main part of the FileUpload.
         * 
         */
        render: function ()
        {            
            var that = this;

            // Append the template
            $(this.el).html(this.template());
            
            // Update view
            this.update();
            
            // Render current files
            $.each(this.files, function (i, file) {
                that.renderFile(file);
            });

            // Render the files from the local storage
            this.renderFileList();
        },

        // When a file is selected in the input
        add_file: function () {
            var input = this.$el.find('input#fileupload')
            this.uploadProcess.fileupload('add', {
                fileInput: $(input)
            });
            // Clear the input
            $(input).val('');
        },

        // When the cancel-button is pressed
        cancel_uploads: function () {
            // SOMETHING IS NOT WORKING HERE
            console.log(this.files.models);
            _.each(this.files.models, function (file) {
                file.cancel();
            });
        },

        // When the start-button is pressed
        start_uploads: function () {
            _.each(this.files.models, function (file) {
                file.start();
            });            
        }
    });
    return FileUploadPlugin;
});