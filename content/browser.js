/* vim: set sw=2 ts=2 et: */

Components.utils.import("resource://app/modules/CustomizableUI.jsm");


var kiosek = {
  init: function () {
    if (gBrowser) {
      gBrowser.tabContainer.addEventListener("TabClose", kiosek.tabRemoved, false);
    }
  },
  tabRemoved: function (event) {
    /* Get number of tabs. */
    var num = gBrowser.browsers.length;

    /* If there are two tabs, the second tab has no title and the closed tab
     * does have a title (ie is not the same tab) then close the browser. */
    if ((num == 2) && (!gBrowser.getBrowserAtIndex(1).contentTitle) && event.target.linkedBrowser.contentTitle) {
      goQuitApplication();
    }

    if ((num == 2) && (!gBrowser.getBrowserAtIndex(0).contentTitle)) {
      goQuitApplication();
    }
  }
};

window.addEventListener("load", function load(event) {
  window.removeEventListener("load", load, false);

  /* Start in full screen. */
  window.fullScreen = true;

  /* Initialize the service above. */
  kiosek.init();
}, false);

/* override browser.js */
function BrowserLoadURL(aTriggeringEvent, aPostData) {
  var url = gURLBar.value;
  if (url.match(/^file:/) || url.match(/^\//) || url.match(/^resource:/) || url.match(/^about:/)) {
    alert("Access to this protocol has been disabled!");
    return;
  }

  if (aTriggeringEvent instanceof MouseEvent) {
    /* Do nothing for right clicks. */
    if (aTriggeringEvent.button == 2) {
      return;
    }

    /* We have a mouse event (from the go button), so use the standard UI link behaviors. */
    openUILink(url, aTriggeringEvent, false, false, true, aPostData);
    return;
  }

  if (aTriggeringEvent && aTriggeringEvent.altKey) {
    handleURLBarRevert();
    content.focus();
    gBrowser.loadOneTab(url, null, null, aPostData, false, true);
    aTriggeringEvent.preventDefault();
    aTriggeringEvent.stopPropagation();
  }
  else {
    loadURI(url, null, aPostData, true);
  }

  focusElement(content);
}

(function () {
  function onPageLoad(event) {
    var doc = event.target;
    var win = doc.defaultView;

    // ignore frame loads
    if (win != win.top) {
      return;
    }

    var uri = doc.documentURIObject;

    /* If we get a neterror, try again in 10 seconds. */
    if (uri.spec.match("about:neterror")) {
      window.setTimeout(function (win) {
        win.location.reload();
      }, 10000, win);
    }
  }

  function startup() {
    var navigatorToolbox = document.getElementById("navigator-toolbox");
    navigatorToolbox.iconsize = "small";
    navigatorToolbox.setAttribute("iconsize", "small");

    var showPrintButton = false;

    try {
      showPrintButton = Services.prefs.getBoolPref("extensions.kiosek.showprintbutton");
    } catch(e) {}

    if (showPrintButton) {
      CustomizableUI.addWidgetToArea("print-button", "nav-bar");
    } else {
      CustomizableUI.removeWidgetFromArea("print-button");
    }

    window.removeEventListener("load", startup, false);
    document.getElementById("appcontent").addEventListener("DOMContentLoaded", onPageLoad, false);
  }

  function shutdown() {
    window.removeEventListener("unload", shutdown, false);
    document.getElementById("appcontent").removeEventListener("DOMContentLoaded", onPageLoad, false);
  }

  window.addEventListener("load", startup, false);
  window.addEventListener("unload", shutdown, false);
})();

/* Disable shift click from opening window. */
var ffWhereToOpenLink = whereToOpenLink;

whereToOpenLink = function (e, ignoreButton, ignoreAlt) {
  var where = ffWhereToOpenLink(e, ignoreButton, ignoreAlt);
  if (where == "window") {
    where = "tab";
  }
  return where;
}

