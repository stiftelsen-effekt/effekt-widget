function Page() {
    this.title = 'Donasjonswidget';
}

Page.prototype.open = function (path) {
    browser.url(path);
}

module.exports = new Page();