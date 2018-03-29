var api_url = "https://api.gieffektivt.no/";
<<<<<<< HEAD
//var api_url = "http://localhost:3000/"; 
=======
//var api_url = "http://localhost:3000/";
>>>>>>> f5e5ba07a85f161795e87a86e42ea13473630b59

module.exports = {
    request: function(endpoint, type, data, cb) {
        var http = new XMLHttpRequest();
        var url = api_url + endpoint;
<<<<<<< HEAD
=======

>>>>>>> f5e5ba07a85f161795e87a86e42ea13473630b59

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200 ) {
                    var response = JSON.parse(this.responseText);

                    if (response.status == 200) {
                        cb(null, response);
                    }
                    else if (response.status == 400) {
                        cb(response.content, null);
                    }
                } else {
                    cb(this.status, null);
                }
            }
        };

        if (type == "POST") {
            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            http.send("data=" + encodeURIComponent(JSON.stringify(data)));
        } else if (type == "GET") {
            http.open("GET", url, true);
            http.send(data);
        }
    }
}