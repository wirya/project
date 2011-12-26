FormComponentTextArea = FormComponent.extend({
    initialize: function(parentFormSection, formComponentId, formComponentType, options) {
        this._super(parentFormSection, formComponentId, formComponentType, options);
        
        if(this.options.allowTabbing) {
            this.allowTabbing();
        }
        if(this.options.emptyValue) {
            this.addEmptyValue();
        }
        if(this.options.autoGrow) {
            this.addAutoGrow();
        }
    },

    prime: function() {
        this.tipTarget = this.component.find('textarea');
        if(this.options.emptyValue) {
            this.addEmptyValue();
        }
        
        this.validationFunctions = {
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value != '' ? 'success' : errorMessageArray;
            },
            'maxLength' : function(options) {
                var errorMessageArray = ['Must be less than ' + options.maxLength + ' characters long. Current value is '+ options.value.length +' characters.'];
                return options.value == '' || options.value.length <= options.maxLength  ? 'success' : errorMessageArray;
            }
        }
    },

    allowTabbing: function() {
        this.component.find('textarea').bind('keydown', function(event) {
            if(event != null) {
                if(event.keyCode == 9) {  // tab character
                    if(this.setSelectionRange) {
                        var sS = this.selectionStart;
                        var sE = this.selectionEnd;
                        this.value = this.value.substring(0, sS) + "\t" + this.value.substr(sE);
                        this.setSelectionRange(sS + 1, sS + 1);
                        this.focus();
                    }
                    else if (this.createTextRange) {
                        document.selection.createRange().text = "\t";
                        event.returnValue = false;
                    }
                    if(event.preventDefault) {
                        event.preventDefault();
                    }
                    return false;
                }
            }
        });
    },

    addEmptyValue: function() {
        var emptyValue = this.options.emptyValue,
        textArea = this.component.find('textarea');
        textArea.addClass('defaultValue');
        textArea.val(emptyValue);

        var target ='';
        textArea.focus(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == emptyValue ){
                target.val('');
                target.removeClass('defaultValue');
            }
        });
        textArea.blur(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == '' ){
                target.addClass('defaultValue');
                target.val(emptyValue);
            }
        });
    },

    addAutoGrow: function() {
        var self = this,
        textArea = this.component.find('textarea'),
        minHeight = textArea.height(),
        lineHeight = textArea.css('lineHeight');

        var shadow = $('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: textArea.width() - parseInt(textArea.css('paddingLeft')) - parseInt(textArea.css('paddingRight')),
            fontSize: textArea.css('fontSize'),
            fontFamily: textArea.css('fontFamily'),
            lineHeight: textArea.css('lineHeight'),
            resize: 'none'
        }).appendTo(document.body);
            
        var update = function() {
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i ++) r += string;
                return r;
            };

            var val = textArea.val().replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&/g, '&amp;')
            .replace(/\n$/, '<br/>&nbsp;')
            .replace(/\n/g, '<br/>')
            .replace(/ {2,}/g, function(space) {
                return times('&nbsp;', space.length -1) + ' '
            });

            shadow.html(val);
            textArea.css('height', Math.max(shadow.height() + 20, minHeight));

            if(self.parentFormSection.parentFormPage.form.currentFormPage) {
                self.parentFormSection.parentFormPage.form.adjustHeight({adjustHeightDuration:0});
            }
        }

        $(textArea).change(update).keyup(update).keydown(update);
        update.apply(textArea);
        
        return self;
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentFormSection.disabledByDependency){
            return null;
        }

        var input = $('#'+this.id).val();

        // Handle empty values
        if(this.options.emptyValue){
            if(input == this.options.emptyValue) {
                return '';
            }
            else {
                return input;
            }
        }
        else {
            return input;
        }
    },

    setValue: function(value) {
        $('#'+this.id).val(value);
        this.validate(true);
    }

});