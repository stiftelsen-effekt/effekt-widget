function totalModule(elem) {
    var _self = this;

    var api_url = "http://localhost:3000";

    _self.elem = elem;

    _self.submitBtn = elem.getElementsByClassName("submit")[0];

    _self.from = () => _self.elem.getElementsByClassName("from")[0].value;
    _self.to = () => _self.elem.getElementsByClassName("to")[0].value;

    _self.setResult = (result) => { elem.getElementsByClassName("results")[0].innerHTML = result }

    registerEventListeners();
    function registerEventListeners() {
        _self.submitBtn.addEventListener("click", (e) => submit());
    }

    function submit() {
        console.log("submit")
        console.log(_self.elem.getElementsByClassName("from")[0].value)

        var http = new XMLHttpRequest();
        var url = api_url + "/donations/total?";

        url += "fromDate=" + _self.from() + "&";
        url += "toDate=" + _self.to() + "&";
        url += "pretty";

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log(this.readyState);
                if (this.status = 200) {
                    console.log(this.status);
                    _self.setResult(this.responseText);
                    console.log(this.responseText);
                    console.log(this)
                }
                else {
                    alert("Feilmelding");
                }
            } else {
                
            }
        };
    
        http.open("GET", url, true);
        http.send();
    }
}