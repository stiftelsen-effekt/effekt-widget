const Pane = require('./paneClass.js');

module.exports = class VippsPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        this.setCustomfocus(this);
        this.hide();
    }

    customFocus() {
    }

    setUrl(url) {
        document.getElementById("vipps-link").setAttribute("href", url);
    }

    submit() {
        //Goto result for vipps
        this.widget.nextSlide();
    }
} 