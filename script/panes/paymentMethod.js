module.exports = function(widget, pane) { 
    this.widget = widget;
    this.pane = pane;

    return {
        submit: submit,
        focus: focus,
        widget: widget,
        pane: pane
    } 
}

function submit() {
    return true;
}

function focus() {
    console.log("Focus");
    updatePayPalForm();
    setupWebSocket();
} 

function updatePayPalForm() {
    let payPalForm = document.getElementById("payPalForm");
  
    payPalForm.amount.setAttribute("value", widget.donationAmount);
}

function setupWebSocket() {
    var socket = new WebSocket("ws://api.gieffektivt.no:8080");

    socket.addEventListener("message", onSocketMessage)
}

function setupButtons() {

}

function showWaitingScreen() {
    pane.getElementsByClassName("awaiting-confirmation")[0].style.display = "block";
}

var clientWsID
function onSocketMessage(msg) {
    console.log(msg.data)
    if (!clientWsID) {
        clientWsID = msg.data
        payPalForm.custom.setAttribute("value", widget.KID + "|" + clientWsID);
    } 
    else {
        if (msg.data == "PAYPAL_VERIFIED") {
            widget.nextSlide();
        }
        else if (msg.data == "PAYPAL_ERROR") {
            widget.error("Feil i PayPal");
        }
    }
}