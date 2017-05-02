/**
 * from https://developer.mozilla.org/de/docs/Web/API/Element/matches
 */
Element.prototype.matches =
  Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector ||
  Element.prototype.webkitMatchesSelector ||
  function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
    var i = matches.length;
    while (--i >= 0) {
      if (matches.item(i) === this) {
        return true;
      }
    }
    return false;
  };
