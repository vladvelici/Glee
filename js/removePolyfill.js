// DOM Element.remove for browsers that do not support it by default,
// including Safari mobile and all versions of IE

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
}
