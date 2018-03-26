var inputHelper = require('../helpers/input.js');

module.exports = class Pane {
    constructor(config) {
        this.widget = config.widget;
        this.paneElement = config.paneElement;

        this.paneElement.controllerClass = this;

        if (config.hasPrevBtn) { this.insertPrevButton(); this.hasButton = true; }
        if (config.hasNextBtn) { this.insertNextButton(); this.hasButton = true; }

        inputHelper.setupInput(this);

        (this.paneElement.classList.contains("hidden") ? this.visible = false : this.visible = true);
        this.paneElement.style.width = this.widget.width + "px";
    }

    show() {
        this.paneElement.classList.remove("hidden");
        this.visible = true;
    }

    hide() {
        this.paneElement.classList.add("hidden");
        this.visible = false;
    }

    resizeWidgetToFit() {
        console.log("Resize widget to fit pane content");

        if (this.hasButton) var padding = 90;
        else var padding = 50;

        console.log(this.hasButton)

        //Height is size of the inner content of pane + padding
        var height = this.paneElement.getElementsByClassName("inner")[0].clientHeight + padding;

        //What?
        //if (slidenum == _self.panes.length-1) _self.element.style.maxHeight = "3000px";

        if (height < 300) height = 300;
        this.widget.element.style.height = height + "px";
    }

    setCustomfocus(subclass) {
        this.focus = function() {
            subclass.customFocus();
            this.universalPaneFocus(subclass.pane);
        }
    }

    universalPaneFocus(paneElement) {
        var allInputs = this.widget.element.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("tabindex", "-1");
        }

        var paneInputs = this.paneElement.getElementsByTagName("input");
        for (var i = 0; i < paneInputs.length; i++) {
            paneInputs[i].setAttribute("tabindex", i+1);
        }
    }

    //Create prev and next buttons on pane
    insertNextButton() {
        if (this.paneElement.getElementsByClassName("btn-container").length == 0) {
            var btnContainerElement = document.createElement("div");
            btnContainerElement.classList.add("btn-container");
            this.paneElement.appendChild(btnContainerElement);
        }

        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("frwd");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = this.widget.assetsUrl + "next.svg";

        var loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = this.widget.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        this.paneElement.getElementsByClassName("btn-container")[0].appendChild(btn);

        var pane = this;
        btn.addEventListener("click", function(e) {
            pane.submit();
        })
    }

    insertPrevButton() {
        if (this.paneElement.getElementsByClassName("btn-container").length == 0) {
            var btnContainerElement = document.createElement("div");
            btnContainerElement.classList.add("btn-container");
            this.paneElement.appendChild(btnContainerElement);
        }

        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("back");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = this.widget.assetsUrl + "next.svg";

        var loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = this.widget.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        this.paneElement.getElementsByClassName("btn-container")[0].appendChild(btn);

        var widget = this.widget;
        btn.addEventListener("click", function(e) {
            widget.prevSlide();
        })
    }
}

