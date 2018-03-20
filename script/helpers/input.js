module.exports = {
    setupInput: function(pane) {
        var paneElement = pane.paneElement;
    
        var inputs = paneElement.querySelectorAll("input[type=text], input[type=tel]");
        if (inputs.length > 0) {
            for (var i = 0; i < inputs.length; i++) {
                if (i == inputs.length-1) {
                    inputs[i].addEventListener("input", function(e) {
                        var valid = true;
                        if (this.getAttribute("inputmode") == "numeric") {
                            valid = numberInputWhitelistCheck(e);
                        }
    
                        if (pane.widget.activeError) _self.hideError();
    
                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit();
                        }
                        return valid;
                    });
    
                    inputs[i].addEventListener("keydown", function(e) {
                        if (pane.widget.activeError) _self.hideError();
                        
                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit();
                        }
                    });
                } else {
                    (function() {
                        var next = inputs[i+1];
                        inputs[i].addEventListener("input", function(e) {
                            var valid = true;
                            if (this.getAttribute("inputmode") == "numeric") {
                                valid = numberInputWhitelistCheck(e);
                            }
    
                            return valid;
                        });
    
                        inputs[i].addEventListener("keydown", function(e) {
                            if (pane.widget.activeError) _self.hideError();
                            
                            if (e.keyCode == 13) { //enter
                                next.focus();
                            }
                        });
                    }());
                }
            }
    
        }
    }
}

function numberInputWhitelistCheck(e) {
    //e.preventDefault(); 

    var valid = true;

    var carrotPosition = e.target.selectionStart;
    var value = e.target.value.replace(new RegExp(",", "g"), ".");

    if (e.target.getAttribute("nocomma") == "true" && (value.indexOf(".") != -1)) valid = false;
    if (valid && value.indexOf(" ") != -1) valid = false;

    if (valid) {
        var numDecimals = value.split(".");
        numDecimals = (numDecimals.length  > 1 ? numDecimals[1].length : 0);
        valid = ((~~value > 0 && numDecimals < 3) || value == "0");
    }

    if (!valid) {
        e.target.value = e.target.value.slice(0,carrotPosition-1) + e.target.value.slice(carrotPosition);

        e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
        //timeout needed for mobile android
        setTimeout(function() {
            e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
        }, 0);
    } else {
        e.target.value = value;
    }

    return valid;
}