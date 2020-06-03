module.exports = {
    api_url: "https://data.gieffektivt.no/",

    send: function(eventAction, eventLabel) {
        if (window.ga) {
            ga('send', {
                hitType: 'event',
                eventCategory: 'widget',
                eventAction,
                eventLabel
            });
        }
        else {
            console.info("No google analytics tracking detected")
        }
    }
}
