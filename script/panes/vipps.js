const Pane = require('./paneClass.js');

module.exports = class VippsPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        this.setCustomfocus(this);
        this.hide();
        this.setup();
    }

    setup() {
        this.setupExplenationImagesButtons();
    }

    customFocus() {
        this.setupKID();
        this.hideExplenationImages();
    }

    setupKID() {
        document.getElementById("vipps-donation-kid").innerHTML = this.widget.KID;
    }

    setupExplenationImagesButtons() {
        let _self = this;
        let vippsGuide = this.paneElement;
        let helperImages = vippsGuide.getElementsByClassName("helper-images")[0];
        var explanatoryButtons = this.paneElement.getElementsByClassName("explanatory-image");
        for (var i = 0; i < explanatoryButtons.length; i++) {
            explanatoryButtons[i].addEventListener("click", function(e) {
                let index = parseInt(this.getAttribute("data-index"));
                let helperImage = helperImages.getElementsByClassName("explanation-image")[index];
                _self.widget.closeBtn.style.display = "none";
    
                helperImages.style.display = "block";
                helperImage.style.display = "block";
            });
        }
    
        var closeButton = helperImages.getElementsByClassName("close-btn")[0];
        closeButton.addEventListener("click", function() {
            let explanationImages = helperImages.getElementsByClassName("explanation-image");
    
            for (var i = 0; i < explanationImages.length; i++) {
                explanationImages[i].style.display = "none";
            }
    
            helperImages.style.display = "none";
            _self.widget.closeBtn.style.display = "block";
        });
    }

    hideExplenationImages() {
        let helperImages = this.paneElement.getElementsByClassName("helper-images")[0];
        let explanationImages = helperImages.getElementsByClassName("explanation-image");
        for (var i = 0; i < explanationImages.length; i++) {
            explanationImages[i].style.display = "none";
        }
        helperImages.style.display = "none";
    }

    submit() {
        //Goto result for vipps
        this.widget.nextSlide();
    }
} 