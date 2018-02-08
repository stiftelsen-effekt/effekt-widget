module.exports = class Pane {
    constructor(widget, pane) {
        this.widget = widget;
        this.pane = pane;

        (this.pane.classList.contains("hidden") ? this.visibile = false : this.visibile = true);
    }

    toggleVisibility() {
        if (this.pane.classList.contains("hidden")) {
            this.pane.classList.remove("hidden");
            this.visibile = true;
        } else {
            this.pane.classList.add("hidden");
            this.visibile = false;
        }
    }

    universalPaneFocus() {
        var allInputs = this.widget.element.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("tabindex", "-1");
        }

        var paneInputs = this.pane.getElementsByTagName("input");
        for (var i = 0; i < paneInputs.length; i++) {
            paneInputs[i].setAttribute("tabindex", i+1);
        }
    }
}