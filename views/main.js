define(['backbone', 'form_file', 'file_model', 'file_collection', 'fileupload'], function(Backbone, FormFile, FileModel, FileCollection) {

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
        className: 'upload-manager',

        events: {
            "change input#fileupload"               : "add_file",
            "click button#cancel-uploads-button"    : "cancel_uploads",
            "click button#start-uploads-button"     : "start_uploads"
        },
        
        initialize: function () {
            _.bindAll(this);

            // Merges the default options with the passed options
            this.options = $.extend(this.defaults, this.options);
            this.templateName = this.options.templates.main;
            
            // Instansiate a filelist that will hold the files that haven't been uploaded.
            this.files = new FileCollection();
            
            this.uploadProcess = $('<input id="fileupload" type="file" name="files[]" multiple="multiple">').fileupload({
                dataType: 'json',
                url: this.options.uploadUrl,
                autoUpload: this.options.autoUpload,
                singleFileUploads: true
            });
            
            // Bind the events that are triggered by JqueryFileUpload
            this.bindProcessEvents();
        },

        renderFile: function (file) {
            var file_view = new FormFile($.extend(this.options, {model: file}));
            $('#file-list', this.el).append(file_view.deferedRender().el);
        },

        update: function () {
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

        bindProcessEvents: function () {
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
            var acceptedTypes = /(\.|\/)(gif|jpe?g|png|svg)$/i;

            // An array where the files will be stored
            data.fileUploadFiles = [];

            $.each(data.files, function (index, file_data) {
                // Get the image data from the input
                var reader = new FileReader();

                // Get the data of the file
                reader.onload = function(frEvent) {
                    file_data.file_data = frEvent.target.result;
                }
                reader.readAsDataURL(file_data);      

                var file = new FileModel({
                    data: file_data,
                    processor: data
                });          
                
                // Some custom validation
                if (file_data['type'].length && !acceptedTypes.test(file_data['type'])) {
                    file.attributes.data.error_message = "Filetype not allowed";
                    file.fail("Filetype not allowed");
                } else {                    
                    file.attributes.data.error_message = null;
                }

                data.fileUploadFiles.push(file);
                
                // Add the file temporarily to the file list (add wont cause it to save to the local storage)
                that.files.add(file);

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
                file.fail(error);
            });
        },

        fileUploadDone: function (e, data) {
            var that = this;

            $.each(data.fileUploadFiles, function (index, file) {
                var new_file = file.attributes.data;
                file.done(data.result);

                // Create the file to the list so it saves to the localstorage
                that.collection.create(new_file);
            });
        },

        render: function () {            
            var that = this;

            $(this.el).html(this.template());

            this.update();
            
            this.files.each(function (i, file) {
                that.renderFile(file);
            });
        },

        // When a file is selected in the input get the inputfield and trigger the add file event.
        add_file: function () {
            var input = this.$el.find('input#fileupload')
            this.uploadProcess.fileupload('add', {
                fileInput: $(input)
            });
            $(input).val('');
        },

        cancel_uploads: function () {
            // SOMETHING IS NOT WORKING HERE
            this.files.each(function (file) {
                file.cancel();
            });
        },

        start_uploads: function () {
            this.files.each(function (file) {
                file.start();
            });            
        }
    });
    return FileUploadPlugin;
});