"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.popups = exports.Popup = exports.AlertForm = exports.GraphicFrame = void 0;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

style classes
    frameContainer - the outer frame
    frameCaption - the top caption of the frame
    frameContent - the container of the frame's future content.
    frameClose - style of the upper close Item.
    captionButton - this is a button appearin in the caption (close)
    

var popup = popups.create( "caption" );
popup.show();
popup.hide();
popup.caption = "New Caption";
popup.divContent  // insert frame content here

*/
//import {JSOX} from "jsox";
//import {JSOX} from "../../jsox/lib/jsox.mjs";
var utils = globalThis.utils || {
  ROUND_DOWN: 1,
  ROUND_UP: 2,
  ROUND_NATURAL: 3,
  // --------- These need to go into utils or something
  to$: function to$(val, rounder) {
    if ("string" === typeof val) val = utils.toD(val);

    function pad(val, n) {
      if (val.length < n) {
        val = '00000'.substr(0, n - val.length) + val;
      }

      return val;
    }

    var digits = Math.log10(val) - 2;
    var n;
    var r = '';
    var c = val / 100 | 0;
    var cnts;

    if (cnts = val % 100) {
      if (rounder === 1) {
        if (val < 0) val -= 1;else val += 1;
      } else if (rounder === 2) {
        if (val < 0) val += 1;else val -= 1;
      } else if (rounder === 3) {
        if (val < 0) {
          if (cnts >= 50) val -= 1;else val += 1;
        } else if (cnts >= 50) val += 1;else val -= 1;
      } else r = '.' + pad((val % 100).toString(), 2);
    }

    if (digits >= 3) {
      for (n = 0; n <= digits - 3; n += 3) {
        r = "," + pad((c % 1000 | 0).toString(), 3) + r;
        c = c / 1000 | 0;
      }
    }

    r = '$' + c % 1000 + r;
    return r;
  },
  toD: function toD($) {
    if ("string" !== typeof $) $ = $.toString();
    if ($[0] === '$') $ = $.substr(1); //   throw new Error( "NOT A DOLLAR AMOUNT" );

    var i = $.indexOf('.');

    if (i >= 0 && $.length - i > 2) {
      var trunc = $.split(',').join('').split('.');
      trunc[trunc.length - 1] = trunc[trunc.length - 1].substr(0, 2);
      return Number(trunc.join(''));
    } else if (i >= 0 && $.length - i == 3) return Number($.split(',').join('').split('.').join(''));else if (i >= 0 && $.length - i == 2) return Number($.split(',').join('').split('.').join('')) * 10;

    return Number($.split(',').join('')) * 100 | 0;
  },
  toP: function toP(p) {
    if ("string" !== typeof p) p = p.toString();
    return p + "%";
  },
  fromP: function fromP(p) {
    p = p.split('%').join('');
    return Number(p);
  }
};
var localStorage = globalThis.localStorage;
var unique = Date.now();
var globalMouseState = {
  activeFrame: null
};
var popupTracker;

function addCaptionHandler(c, popup_) {
  var popup = popup_;
  if (!popup) popup = createPopup(null, {
    from: c
  });
  var mouseState = {
    frame: popup.divFrame,
    x: 0,
    y: 0,
    dragging: false
  };
  if (popups.autoRaise && popup_) popup_.divFrame.addEventListener("mousedown", function (evt) {
    popupTracker.raise(popup);
  });

  function mouseHandler(c, state) {
    var added = false;

    function mouseMove(evt) {
      var state = globalMouseState.activeFrame;

      if (state) {
        if (state.dragging) {
          evt.preventDefault();
          var pRect = state.frame.getBoundingClientRect(); //var x = evt.clientX - pRect.left;
          //var y = evt.clientY - pRect.top;

          var x = evt.x - pRect.left;
          var y = evt.y - pRect.top;
          state.frame.style.left = parseInt(state.frame.style.left) + (x - state.x);
          state.frame.style.top = parseInt(state.frame.style.top) + (y - state.y);

          if (state.frame.id) {
            localStorage.setItem(state.frame.id + "/x", popup.divFrame.style.left);
            localStorage.setItem(state.frame.id + "/y", popup.divFrame.style.top);
          }
        }

        if (state.sizing) {
          evt.preventDefault();
          var pRect = state.frame.getBoundingClientRect(); //var x = evt.clientX - pRect.left;
          //var y = evt.clientY - pRect.top;

          var x = evt.x - pRect.left;
          var y = evt.y - pRect.top;
          state.frame.style.left = parseInt(state.frame.style.left) + (x - state.x);
          state.frame.style.top = parseInt(state.frame.style.top) + (y - state.y);

          if (state.frame.id) {
            localStorage.setItem(state.frame.id + "/x", popup.divFrame.style.left);
            localStorage.setItem(state.frame.id + "/y", popup.divFrame.style.top);
          }
        }
      }
    }

    function mouseDown(evt) {
      if (evt.target !== c) return; //evt.preventDefault();

      if (!popup_.useMouse) return;

      if (globalMouseState.activeFrame) {
        return;
      }

      var pRect = state.frame.getBoundingClientRect();
      popupTracker.raise(popup); //state.x = evt.clientX-pRect.left;
      //state.y = evt.clientY-pRect.top;

      state.x = evt.x - pRect.left;
      state.y = evt.y - pRect.top;
      globalMouseState.activeFrame = state;
      state.dragging = true;

      if (!added) {
        added = true;
        document.body.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseup", mouseUp);
      }
    }

    function mouseUp(evt) {
      evt.preventDefault();
      globalMouseState.activeFrame = null;
      state.dragging = false;

      if (added) {
        added = false;
        document.body.removeEventListener("mousemove", mouseMove);
        document.body.removeEventListener("mouseup", mouseUp);
      }
    }

    c.addEventListener("mousedown", mouseDown); //c.addEventListener( "mouseup", mouseUp );
    //c.addEventListener( "mousemove", mouseMove );

    c.addEventListener("touchstart", function (evt) {
      if (!popup_.useMouse) return;
      var pRect = state.frame.getBoundingClientRect();
      popupTracker.raise(popup); //state.x = evt.clientX-pRect.left;
      //state.y = evt.clientY-pRect.top;

      if (evt.target === c) {
        evt.preventDefault();
        state.x = evt.touches[0].clientX - pRect.left;
        state.y = evt.touches[0].clientY - pRect.top;
        state.dragging = true;
      }
    }, {
      passive: true
    });
    c.addEventListener("touchmove", function (evt) {
      if (!popup_.useMouse) return;

      if (state.dragging) {
        evt.preventDefault();
        var points = evt.touches;
        var pRect = state.frame.getBoundingClientRect();
        var x = points[0].clientX - pRect.left;
        var y = points[0].clientY - pRect.top;
        state.frame.style.left = parseInt(state.frame.style.left) + (x - state.x);
        state.frame.style.top = parseInt(state.frame.style.top) + (y - state.y);

        if (state.frame.id) {
          localStorage.setItem(state.frame.id + "/x", popup.divFrame.style.left);
          localStorage.setItem(state.frame.id + "/y", popup.divFrame.style.top);
        }
      }
    }, {
      passive: true
    });
    c.addEventListener("touchend", function (evt) {
      if (!popup_.useMouse) return; //popupTracker.raise( popup );

      if (evt.target === c) {
        evt.preventDefault();
        state.dragging = false;
      }
    }, {
      passive: true
    });
  }

  if (popups.defaultDrag) {
    mouseHandler(c, mouseState);
    if (popup_) mouseHandler(popup_.divFrame, mouseState);
  }
}

function initPopupTracker() {
  var tracker = {
    popups: [],
    raise: function raise(popup) {
      var top = tracker.popups.length;
      var n;
      var from = Number(popup.divFrame.style.zIndex);
      if (from === top) return;

      for (n = 0; n < tracker.popups.length; n++) {
        if (n == popup.index) popup.divFrame.style.zIndex = top;else {
          var thisZ = Number(tracker.popups[n].divFrame.style.zIndex);
          if (thisZ > from) tracker.popups[n].divFrame.style.zIndex = Number(tracker.popups[n].divFrame.style.zIndex) - 1;
        }
      }
    },
    find: function find(id) {
      return this.popups.find(function (popup) {
        return popup.divFrame.id === id;
      });
    },
    addPopup: function addPopup(popup) {
      popup.index = tracker.popups.length;
      popup.divFrame.style.zIndex = popup.index + 1;
      tracker.popups.push(popup);

      popup.raise = function () {
        tracker.raise(popup);
      };
    }
  };
  return tracker;
}

popupTracker = initPopupTracker();

var Popup = /*#__PURE__*/function () {
  // per frame mouse disable...
  function Popup(caption_, parent, opts) {
    var _this = this;

    _classCallCheck(this, Popup);

    _defineProperty(this, "popupEvents", {
      close: [],
      show: []
    });

    _defineProperty(this, "divFrame", document.createElement("div"));

    _defineProperty(this, "divCaption", document.createElement("div"));

    _defineProperty(this, "divTitle", document.createElement("span"));

    _defineProperty(this, "divContent", document.createElement("div"));

    _defineProperty(this, "divClose", document.createElement("div"));

    _defineProperty(this, "popup", this);

    _defineProperty(this, "useMouse", true);

    _defineProperty(this, "suffix", '');

    this.suffix = (opts === null || opts === void 0 ? void 0 : opts.suffix) || '';
    var closeButton = (opts === null || opts === void 0 ? void 0 : opts.enableClose) || false; // make popup from control.

    var forContent = opts === null || opts === void 0 ? void 0 : opts.from;

    if (forContent) {
      this.divFrame = forContent;
      this.divContent = null;
      this.divCaption = null;
      this.divClose = null;
      this.divTitle = null;
    } else {
      this.divFrame.className = (parent ? "formContainer" : "frameContainer") + this.suffix;
    }

    this.divFrame.style.left = 0;
    this.divFrame.style.top = 0;

    if (this.divCaption) {
      if (caption_ && caption_ != "") {
        this.divFrame.appendChild(this.divCaption);
        this.divCaption.appendChild(this.divTitle);
        if (closeButton && this.divClose) this.divCaption.appendChild(this.divClose);
      }

      this.divCaption.className = "frameCaption" + this.suffix;
      if (this.divCaption) addCaptionHandler(this.divCaption, this);
    }

    if (this.divContent) {
      this.divContent.className = "frameContent" + this.suffix;
      this.divFrame.appendChild(this.divContent);
    }

    if (this.divClose) {
      this.divClose.className = "captionButton" + this.suffix + " closeButton" + this.suffix;
      this.divClose.addEventListener("click", function (evt) {
        _this.hide();
      });
    }

    popupTracker.addPopup(this);
    this.caption = caption_;
    parent = parent && parent.divContent || parent || document.body;
    parent.appendChild(this.divFrame);
  }

  _createClass(Popup, [{
    key: "caption",
    set: function set(val) {
      if (this.divTitle) this.divTitle.textContent = val;
    }
  }, {
    key: "center",
    value: function center() {
      var myRect = this.divFrame.getBoundingClientRect();
      var pageRect = this.divFrame.parentElement.getBoundingClientRect();
      this.divFrame.style.left = (pageRect.width - myRect.width) / 2;
      this.divFrame.style.top = (pageRect.height - myRect.height) / 2;
    }
  }, {
    key: "over",
    value: function over(e) {
      var target = e.getBoundingClientRect();
      this.divFrame.style.left = target.left;
      this.divFrame.style.top = target.top;
    }
  }, {
    key: "on",
    value: function on(event, cb) {
      if (cb && "function" === typeof cb) {
        if (this.popupEvents[event]) this.popupEvents[event].push(cb);else this.popupEvents[event] = [cb];
      } else {
        var cbList;

        if (cbList = this.popupEvents[event]) {
          cbList.forEach(function (cbEvent) {
            return cbEvent(cb);
          });
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.on("reset", true);
    }
  }, {
    key: "reject",
    value: function reject() {
      this.on("reject", true);
    }
  }, {
    key: "accept",
    value: function accept() {
      this.on("accept", true);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.divFrame.style.display = "none";
    }
  }, {
    key: "show",
    value: function show() {
      this.raise();
      this.divFrame.style.display = ""; //popupTracker.raise( this );

      this.on("show", true);
    }
  }, {
    key: "move",
    value: function move(x, y) {
      this.divFrame.style.left = x + "%";
      this.divFrame.style.top = y + "%";
    }
  }, {
    key: "appendChild",
    value: function appendChild(e) {
      return (this.divContent || this.divFrame).appendChild(e);
    }
  }, {
    key: "remove",
    value: function remove() {
      this.divFrame.remove();
    }
  }]);

  return Popup;
}();

exports.Popup = Popup;

function createPopup(caption, parent, opts) {
  return new Popup(caption, parent, opts);
}

function createSimpleForm(title, question, defaultValue, ok, cancelCb) {
  var popup = popups.create(title);
  popup.on("show", function () {
    if ("function" === typeof defaultValue) {
      input.value = defaultValue();
    } else input.value = defaultValue;

    input.focus();
    input.select();
  });
  popup.on("close", function () {
    // aborted...
    cancel && cancel();
  });
  var form = document.createElement("form");
  form.className = "frameForm";
  form.setAttribute("action", "none");
  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    popup.hide();
    ok && ok(input.value);
  });
  form.addEventListener("reset", function (evt) {
    evt.preventDefault();
    popup.hide();
  });
  var textOutput = document.createElement("SPAN");
  textOutput.textContent = question;
  var input = document.createElement("INPUT");
  input.className = "popupInputField";
  input.setAttribute("size", 45);
  input.value = defaultValue;
  var okay = document.createElement("BUTTON");
  okay.className = "popupOkay";
  okay.textContent = "Okay";
  okay.setAttribute("name", "submit");
  okay.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.hide();
    ok && ok(input.value);
  });
  var cancel = document.createElement("BUTTON");
  cancel.className = "popupCancel";
  cancel.textContent = "Cancel";
  cancel.setAttribute("type", "reset");
  cancel.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.hide();
    cancelCb && cancelCb();
  });
  popup.divFrame.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
      e.preventDefault();
      popup.hide();
      cancelCb && cancelCb();
    }
  });
  popup.divContent.appendChild(form);
  form.appendChild(textOutput);
  form.appendChild(document.createElement("br"));
  form.appendChild(input);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));
  form.appendChild(cancel);
  form.appendChild(okay);
  popup.center();
  popup.hide();
  return popup;
}

function handleButtonEvents(button, onClick) {
  button.addEventListener("keydown", function (evt) {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      evt.stopPropagation();
      onClick();
    }
  }); //var okay = document.createElement( "BUTTON" );
  //okay.className = "popupOkay"+suffix;
  //okay.textContent = caption;

  button.addEventListener("click", function (evt) {
    evt.preventDefault();
    onClick();
  });
  button.addEventListener("touchstart", function (evt) {
    evt.preventDefault();
    setClass(button, "pressed");
  }, {
    passive: true
  });
  button.addEventListener("touchend", function (evt) {
    evt.preventDefault();
    clearClass(button, "pressed");
    onClick();
  }, {
    passive: true
  });
  button.addEventListener("mousedown", function (evt) {
    evt.preventDefault();
    setClass(button, "pressed");
  });
  button.addEventListener("mouseup", function (evt) {
    evt.preventDefault();
    clearClass(button, "pressed");
  });
}

function makeButton(form, caption, onClick) {
  var suffix = form instanceof Popup ? form.suffix : '';
  var button = document.createElement("div");
  button.className = "button" + suffix;
  button.style.width = "max-content";
  var buttonInner = document.createElement("div");
  buttonInner.className = "buttonInner" + suffix;
  buttonInner.style.width = "max-content" + suffix;
  buttonInner.textContent = caption;
  button.appendChild(buttonInner);
  handleButtonEvents(button, onClick);
  form.appendChild(button);
  return button;
}

function createSimpleNotice(title, question, ok, cancel) {
  return new SimpleNotice(title, question, ok, cancel);
}

var SimpleNotice = /*#__PURE__*/function (_Popup) {
  _inherits(SimpleNotice, _Popup);

  var _super = _createSuper(SimpleNotice);

  //const popup = popups.create( title );
  function SimpleNotice(title, question, ok, cancel) {
    var _this2;

    _classCallCheck(this, SimpleNotice);

    _this2 = _super.call(this, title, null, {
      suffix: "-notice"
    });

    var popup = _assertThisInitialized(_this2);

    var form = document.createElement("form");
    _this2.okay = makeButton(form, "Okay", function () {
      _this2.hide();

      ok && ok();
    });
    {
      var show_ = _this2.show.bind(_assertThisInitialized(_this2));

      _this2.show = function (caption, content) {
        if (caption && content) {
          this.divCaption.textContent = caption;
          textOutput.textContent = content;
        } else if (caption) this.textContent = caption;

        show_();
      };

      _this2.on("show", function () {
        _this2.okay.focus();
      });

      _this2.on("close", function () {
        // aborted...
        cancel && cancel();
      });

      form.className = "frameForm";
      form.setAttribute("action", "none");
      form.addEventListener("submit", function (evt) {
        evt.preventDefault();

        _this2.hide(); //console.log( "SUBMIT?", input.value );

      });
      form.addEventListener("reset", function (evt) {
        evt.preventDefault();

        _this2.hide();
      });
      var textOutput = document.createElement("SPAN");
      textOutput.className = "noticeText";
      textOutput.textContent = question;

      _this2.setMessage = function (msg) {
        textOutput.textContent = msg;
      };

      _this2.okay.className += " notice";
      _this2.okay.children[0].className += " notice";

      _this2.divFrame.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
          e.preventDefault();

          _this2.hide();

          ok && ok();
        }
      });

      _this2.divContent.appendChild(form);

      form.appendChild(textOutput);
      form.appendChild(document.createElement("br"));
      form.appendChild(document.createElement("br"));
      form.appendChild(_this2.okay);

      if (cancel) {
        var cbut = makeButton(form, "Cancel", function () {
          _this2.hide();

          cancel && cancel();
        });
        cbut.className += " notice";
        cbut.children[0].className += " notice";
      }

      _this2.center();

      _this2.hide(); //return this;

    }
    return _this2;
  }

  _createClass(SimpleNotice, [{
    key: "appendChild",
    value: function appendChild(e) {
      this.form.insertChild(e, this.okay);
    }
  }]);

  return SimpleNotice;
}(Popup);

var List = /*#__PURE__*/function () {
  function List(parentDiv, parentList, toString) {
    _classCallCheck(this, List);

    _defineProperty(this, "selected", null);

    _defineProperty(this, "groups", []);

    _defineProperty(this, "itemOpens", false);

    console.log("List constructor could use the popup to get suffix...");
    this.toString = toString;
    this.divTable = parentDiv;
    this.parentList = parentList;
  }

  _createClass(List, [{
    key: "push",
    value: function push(group, toString_, opens) {
      var _this3 = this;

      var itemList = this.divTable.childNodes;
      var nextItem = null;

      var _iterator = _createForOfIteratorHelper(itemList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          nextItem = _step.value;
          if (nextItem.textContent > this.toString(group)) break;
          nextItem = null;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var newLi = document.createElement("LI");
      newLi.className = "listItem";
      this.divTable.insertBefore(newLi, nextItem); //) appendChild( newLi );

      newLi.addEventListener("click", function (e) {
        e.preventDefault();
        if (_this3.selected) _this3.selected.classList.remove("selected");
        newLi.classList.add("selected");
        _this3.selected = newLi;
      });
      var newSubList = document.createElement("UL");
      newSubList.className = "listSubList";
      if (this.parentList && this.parentList.parentItem) this.parentList.parentItem.enableOpen(this.parentList.thisItem);

      if (opens) {//	this.enableOpen(newLi);
      }

      var treeLabel = document.createElement("span");
      treeLabel.textContent = this.toString(group);
      treeLabel.className = "listItemLabel";
      newLi.appendChild(treeLabel); //var newSubDiv = document.createElement( "DIV");

      newLi.appendChild(newSubList); //newSubList.appendChild( newSubDiv);

      var newRow;
      var subItems = createList(this, newSubList, toString_, true);
      this.groups.push(newRow = {
        opens: false,
        group: group,
        item: newLi,
        subItems: subItems,
        parent: this.parentList,

        set text(s) {
          treeLabel.textContent = s;
        },

        hide: function hide() {
          this.item.style.display = "none";
        },
        show: function show() {
          this.item.style.display = "";
        }
      });
      return newRow;
    }
  }, {
    key: "enableOpen",
    value: function enableOpen(item) {
      if (item.opens) return;
      item.opens = true;
      var treeKnob = document.createElement("span");
      treeKnob.textContent = "-";
      treeKnob.className = "knobOpen";
      item.item.insertBefore(treeKnob, item.item.childNodes[0]);
      treeKnob.addEventListener("click", function (e) {
        e.preventDefault();

        if (treeKnob.className === "knobClosed") {
          treeKnob.className = "knobOpen";
          treeKnob.textContent = "-";
          item.subItems.items.forEach(function (sub) {
            sub.item.style.display = "";
          });
        } else {
          treeKnob.className = "knobClosed";
          treeKnob.textContent = "+";
          item.subItems.items.forEach(function (sub) {
            sub.item.style.display = "none";
          });
        }
      });
    }
  }, {
    key: "enableDrag",
    value: function enableDrag(type, item, key1, item2, key2) {
      item.item.setAttribute("draggable", true);
      item.item.addEventListener("dragstart", function (evt) {
        //if( evt.dataTransfer.getData("text/plain" ) )
        //	evt.preventDefault();
        if (item2) evt.dataTransfer.setData("text/" + type, item.group[key1] + "," + item2.group[key2]);else evt.dataTransfer.setData("text/" + type, item.group[key1]);
        evt.dataTransfer.setData("text/plain", evt.dataTransfer.getData("text/plain") + JSON.stringify({
          type: type,
          val1: item.group[key1],
          val2: item2 && item2.group[key2]
        }));
        console.log("dragstart:", type);
        if (item) evt.dataTransfer.setData("text/item", item.group[key1]);
        if (item2) evt.dataTransfer.setData("text/item2", item2.group[key2]);
      });
    }
  }, {
    key: "enableDrop",
    value: function enableDrop(type, item, cbDrop) {
      item.item.addEventListener("dragover", function (evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move"; //console.log( "Dragover:", evt.dataTransfer.getData( "text/plain" ), evt );
      });
      item.item.addEventListener("drop", function (evt) {
        evt.preventDefault();
        var objType = evt.dataTransfer.getData("text/plain");

        if ("undefined" !== typeof JSOX) {
          JSOX.begin(function (event) {
            if (type === event.type) {
              console.log("drop of:", evt.dataTransfer.getData("text/plain")); //cbDrop( accruals.all.get( event.val1 ) );
            }
          }).write(objType);
        }
      });
    }
  }, {
    key: "update",
    value: function update(group) {
      var item = this.groups.find(function (group_) {
        return group_.group === group;
      });
      item.textContent = this.toString(group);
    }
  }, {
    key: "items",
    get: function get() {
      return this.groups;
    }
  }, {
    key: "reset",
    value: function reset() {
      while (this.divTable.childNodes.length) {
        this.divTable.childNodes[0].remove();
      }
    }
  }]);

  return List;
}();

function createList(parent, parentList, toString, opens) {
  return new List(parent, parentList, toString, opens);
}

function makeCheckbox(form, o, field, text) {
  var initialValue = o[field];
  var suffix = form instanceof Popup ? form.suffix : '';
  var textCountIncrement = document.createElement("SPAN");
  textCountIncrement.textContent = text;
  var inputCountIncrement = document.createElement("INPUT");
  inputCountIncrement.setAttribute("type", "checkbox");
  inputCountIncrement.className = "checkOption" + suffix + " rightJustify";
  inputCountIncrement.checked = o[field]; //textDefault.

  var onChange = [];
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  binder.addEventListener("click", function (e) {
    if (e.target === inputCountIncrement) return;
    e.preventDefault();
    inputCountIncrement.checked = !inputCountIncrement.checked;
  });
  inputCountIncrement.addEventListener("change", function (e) {
    o[field] = inputCountIncrement.checked;
  });
  form.appendChild(binder);
  binder.appendChild(textCountIncrement);
  binder.appendChild(inputCountIncrement); //form.appendChild( document.createElement( "br" ) );

  if (form instanceof Popup) {
    form.on("accept", function () {
      initialValue = inputCountIncrement.checked;
    });
    form.on("reject", function () {
      inputCountIncrement.checked = initialValue;
    });
  }

  binder.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });
  return {
    on: function on(event, cb) {
      if (event === "change") onChange.push(cb);
      inputCountIncrement.addEventListener(event, cb);
    },

    get checked() {
      return inputCountIncrement.checked;
    },

    set checked(val) {
      inputCountIncrement.checked = val;
    },

    get value() {
      return inputCountIncrement.checked;
    },

    set value(val) {
      o[field] = val;
      inputCountIncrement.checked = val;
      onChange.forEach(function (cb) {
        return cb();
      });
    },

    reset: function reset() {
      o[field] = initialValue;
      inputCountIncrement.checked = initialValue;
    },
    changes: function changes() {
      if (o[field] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + o[field];
      }

      return '';
    },

    get style() {
      return binder.style;
    }

  };
}

function makeLeftRadioChoice(form, o, field, text, groupName) {
  return makeRadioChoice(form, o, field, text, groupName, true);
}

function makeRadioChoice(form, o, field, text, groupName, left) {
  var initialValue = o[field];
  var suffix = form instanceof Popup ? form.suffix : '';
  var textOption = document.createElement("SPAN");
  if (left) textOption.className = "radio-text" + suffix + " rightJustify";else textOption.className = "radio-text" + suffix;
  textOption.textContent = text;
  var option = document.createElement("INPUT");
  option.setAttribute("type", "radio");
  option.setAttribute("name", groupName);
  if (left) option.className = "radioOption" + suffix;else option.className = "radioOption" + suffix + " rightJustify";
  option.checked = o[field]; //textDefault.

  var onChange = [];
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  binder.addEventListener("click", function (e) {
    if (e.target === option) return;
    e.preventDefault();
    option.checked = !option.checked;
  });
  option.addEventListener("change", function (e) {
    o[field] = option.checked;
  });
  form.appendChild(binder);

  if (left) {
    binder.appendChild(option);
    binder.appendChild(textOption);
  } else {
    binder.appendChild(textOption);
    binder.appendChild(option);
  } //form.appendChild( document.createElement( "br" ) );


  binder.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });
  return {
    on: function on(event, cb) {
      if (event === "change") onChange.push(cb);
      option.addEventListener(event, cb);
    },

    get checked() {
      return option.checked;
    },

    set checked(val) {
      option.checked = val;
    },

    get value() {
      return option.checked;
    },

    set value(val) {
      o[field] = val;
      option.checked = val;
      onChange.forEach(function (cb) {
        return cb();
      });
    },

    reset: function reset() {
      o[field] = initialValue;
      option.checked = initialValue;
    },
    changes: function changes() {
      if (o[field] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + o[field];
      }

      return '';
    },

    get style() {
      return binder.style;
    }

  };
}

function makeSlider(form, o, field, text, f) {
  if (f && "function" !== typeof f) {
    console.log("makeSlider: Function to transform value is not a function:", f);
    f = null;
  }

  var suffix = form instanceof Popup ? form.suffix : '';
  var initialValue = o[field];
  var textCountIncrement = document.createElement("SPAN");
  textCountIncrement.textContent = text;
  var inputCountIncrement = document.createElement("INPUT");
  inputCountIncrement.setAttribute("type", "range");
  inputCountIncrement.setAttribute("min", 1);
  inputCountIncrement.setAttribute("max", 1000);
  inputCountIncrement.className = "valueSlider" + suffix + " rightJustify";
  inputCountIncrement.value = o[field];
  var valueCountIncrement = document.createElement("SPAN");
  valueCountIncrement.textContent = "0"; //textDefault.

  var onChange = [];
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix; //binder.addEventListener( "click", (e)=>{ 
  //	if( e.target===inputCountIncrement) return; e.preventDefault(); inputCountIncrement.checked = !inputCountIncrement.checked; })

  inputCountIncrement.addEventListener("input", function (e) {
    if (f) o[field] = f(inputCountIncrement.value);else o[field] = inputCountIncrement.value;
    valueCountIncrement.textContent = o[field];
    control.on("change", control); //if( form instanceof Popup ) form.on("update", control );	
  });
  form.appendChild(binder);
  binder.appendChild(textCountIncrement);
  binder.appendChild(inputCountIncrement);
  binder.appendChild(valueCountIncrement);
  binder.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });

  if (form instanceof Popup) {
    form.on("accept", function () {
      initialValue = inputCountIncrement.value;
    });
    form.on("reject", function () {
      inputCountIncrement.value = initialValue;
    });
  } //form.appendChild( document.createElement( "br" ) );


  var control = {
    on: function on(event, cb) {
      if ("function" === typeof cb) {
        if (event === "change") onChange.push(cb);
        inputCountIncrement.addEventListener(event, cb);
      } else {
        if (event === "change") onChange.forEach(function (f) {
          return f(cb);
        });
      }
    },

    get value() {
      return inputCountIncrement.checked;
    },

    set value(val) {
      o[field] = val;
      inputCountIncrement.checked = val;
      onChange.forEach(function (cb) {
        return cb();
      });
    },

    reset: function reset() {
      o[field] = initialValue;
      inputCountIncrement.checked = initialValue;
    },
    changes: function changes() {
      if (o[field] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + o[field];
      }

      return '';
    },

    get style() {
      return binder.style;
    }

  };
  return control;
}

function makeTextInput(form, input, value, text, money, percent, number, suffix_) {
  var _frame, _value, _value2, _result, _mutatorMap;

  var initialValue = input[value];
  var suffix = form instanceof Popup ? form.suffix : suffix_ || '';
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("INPUT");
  inputControl.className = "textInputOption" + suffix + " rightJustify"; //inputControl.addEventListener( "mousedown", (evt)=>evt.stopPropagation() );

  inputControl.addEventListener("click", function (evt) {
    return inputControl.select();
  }); //textDefault.

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputCountIncrement.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputCountIncrement.value = initialValue;
    });
  }

  function setValue() {
    if (money) {
      inputControl.value = utils.to$(input[value]);
      inputControl.addEventListener("change", function (e) {
        var val = utils.toD(inputControl.value);
        input[value] = val;
        inputControl.value = utils.to$(val);
        result.on("change", result);
      });
    } else if (percent) {
      inputControl.value = utils.toP(input[value]);
      inputControl.addEventListener("change", function (e) {
        var val = utils.fromP(inputControl.value);
        input[value] = val;
        inputControl.value = utils.toP(val);
        result.on("change", result);
      });
    } else if (number) {
      inputControl.value = input[value];
      inputControl.addEventListener("change", function (e) {
        var val = Number(inputControl.value);
        input[value] = val;
        inputControl.value = val;
        result.on("change", result);
      });
    } else {
      inputControl.value = input[value];
      inputControl.addEventListener("input", function (e) {});
      inputControl.addEventListener("input", function (e) {
        var val = inputControl.value;
        input[value] = val;
        result.on("change", result);
      });
    }
  }

  setValue();
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);
  binder.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputControl.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  var events = {};
  var result = (_result = {
    on: function on(event, param) {
      if ("function" === typeof param) {
        events[event] = param;
      } else {
        if (event in events) events[event](param);
      }
    },

    get frame() {
      return binder;
    }

  }, _frame = "frame", _mutatorMap = {}, _mutatorMap[_frame] = _mutatorMap[_frame] || {}, _mutatorMap[_frame].get = function () {
    return binder;
  }, _defineProperty(_result, "addEventListener", function addEventListener(a, b) {
    return inputControl.addEventListener(a, b);
  }), _defineProperty(_result, "blur", function blur() {
    inputControl.blur();
  }), _value = "value", _mutatorMap[_value] = _mutatorMap[_value] || {}, _mutatorMap[_value].get = function () {
    if (money) return utils.toD(inputControl.value);
    if (percent) return utils.fromP(inputControl.value);
    if (number) return Number(inputControl.value);
    return inputControl.value;
  }, _value2 = "value", _mutatorMap[_value2] = _mutatorMap[_value2] || {}, _mutatorMap[_value2].set = function (val) {
    if (money) inputControl.value = utils.to$(val);else if (percent) inputControl.value = utils.toP(val);else if (number) inputControl.value = val;else inputControl.value = val;
  }, _defineProperty(_result, "reset", function reset() {
    input[value] = initialValue;
    setValue();
  }), _defineProperty(_result, "changes", function changes() {
    if (input[value] !== initialValue) {
      return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
    }

    return '';
  }), _defineEnumerableProperties(_result, _mutatorMap), _result);
  return result;
}

function makeTextField(form, input, value, text, money, percent) {
  var initialValue = input[value];
  var suffix = form instanceof Popup ? form.suffix : '';
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("SPAN");
  inputControl.className = "textInputOption" + suffix + " rightJustify";
  inputControl.addEventListener("mousedown", function (evt) {
    return evt.stopPropagation();
  }); //textDefault.

  function setValue() {
    if (money) {
      inputControl.value = utils.to$(input[value]);
      inputControl.addEventListener("change", function (e) {
        var val = utils.toD(inputControl.value);
        input[value] = inputControl.textContent = utils.to$(val);
      });
    } else if (percent) {
      inputControl.value = utils.toP(input[value]);
      inputControl.addEventListener("change", function (e) {
        var val = utils.fromP(inputControl.value);
        input[value] = inputControl.textContent = utils.toP(val);
      });
    } else {
      inputControl.textContent = input[value];
      inputControl.addEventListener("input", function (e) {
        var val = inputControl.value;
        input[value] = val;
      });
    }
  }

  setValue();
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);

  if (form instanceof Popup) {
    form.on("accept", function () {
      initialValue = inputControl.value;
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  return {
    addEventListener: function addEventListener(a, b) {
      return inputControl.addEventListener(a, b);
    },
    refresh: function refresh() {
      inputControl.textContent = initialValue = input[value];
    },

    get value() {
      if (money) return utils.toD(inputControl.value);
      if (percent) return utils.fromP(inputControl.value);
      return inputControl.value;
    },

    set value(val) {
      if (money) inputControl.value = utils.to$(val);else if (percent) inputControl.value = utils.toP(val);else inputControl.value = val;
    },

    reset: function reset() {
      input[value] = initialValue;
      setValue();
    },
    divFrame: binder,
    changes: function changes() {
      if (input[value] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
      }

      return '';
    }
  };
}

function makeNameInput(form, input, value, text) {
  var initialValue = input[value];
  var suffix = form instanceof Popup ? form.suffix : '';
  var binder;
  var textLabel = document.createElement("SPAN");
  textLabel.textContent = text;
  var textOutput = document.createElement("SPAN");
  textOutput.textContent = input[value];
  var buttonRename = document.createElement("Button");
  buttonRename.textContent = popups.strings.get("(rename)");
  buttonRename.className = "buttonOption" + suffix + " rightJustify";
  buttonRename.addEventListener("click", function (evt) {
    evt.preventDefault(); //title, question, defaultValue, ok, cancelCb

    var newName = createSimpleForm(popups.strings.get("Change Name"), popups.strings.get("Enter new name"), input[value], function (v) {
      input[value] = v;
      textOutput.textContent = v;
    });
    newName.show();
  });
  binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textLabel);
  binder.appendChild(textOutput);
  binder.appendChild(buttonRename);

  if (form instanceof Popup) {
    form.on("accept", function () {
      textOutput.textContent, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      textOutput.textContent = initialValue;
    });
  } //binder.appendChild( document.createElement( "br" ) );


  return {
    get value() {
      return textOutput.textContent;
    },

    set value(val) {
      textOutput.textContent = val;
    },

    reset: function reset() {
      input[value] = initialValue;
      textLabel.textContent = initialValue;
    },
    changes: function changes() {
      if (input[value] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
      }

      return '';
    }
  };
}

function toggleClass(el, cn) {
  if (el.className.includes(cn)) {
    el.className = el.className.split(" ").reduce(function (a, el) {
      return el !== cn ? (a.push(el), a) : a;
    }, []).join(' ');
  } else {
    el.className += " " + cn;
  }
}

function clearClass(el, cn) {
  if (el.className.includes(cn)) {
    el.className = el.className.split(" ").reduce(function (a, el) {
      return el !== cn ? (a.push(el), a) : a;
    }, []).join(' ');
  } else {}
}

function setClass(el, cn) {
  if (el.className.includes(cn)) {} else {
    el.className += " " + cn;
  }
}

function makeDateInput(form, input, value, text) {
  var suffix = form instanceof Popup ? form.suffix : '';
  var initialValue = input[value];
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("INPUT");
  inputControl.className = "textInputOption" + suffix + " rightJustify";
  inputControl.type = "date"; // returns date at midnight UTC not local.

  inputControl.addEventListener("mousedown", function (evt) {
    evt.stopPropagation(); // halt on this control
  }); //textDefault.

  if (input[value] instanceof Date) {
    inputControl.valueAsDate = input[value];
  } else inputControl.value = input[value];

  inputControl.addEventListener("change", function (evt) {
    console.log("Date type:", inputControl.value, new Date(inputControl.value));
    input[value] = new Date(inputControl.value); // convert to wall clock?  What if browser isn't in birth locale?
    //input[value].setMinutes( input[value].getTimezoneOffset());
  });
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputControl.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  return {
    addEventListener: function addEventListener(a, b) {
      return inputControl.addEventListener(a, b);
    },

    get value() {
      return inputControl.value;
    },

    set value(val) {
      //input[value] = val;
      inputControl.value = val;
    },

    hide: function hide() {
      this.item.style.display = "none";
    },
    show: function show() {
      this.item.style.display = "";
    },
    reset: function reset() {
      input[value] = initialValue;
      inputControl.valueAsDate = initialValue;
    },
    changes: function changes() {
      if (input[value] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
      }

      return '';
    }
  };
}

function makeZipInput(form, input, value) {
  var suffix = form instanceof Popup ? form.suffix : '';
  var initialValue = input[value];
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("INPUT");
  inputControl.className = "textInputOption" + suffix + " rightJustify";
  inputControl.type = "date";
  inputControl.addEventListener("mousedown", function (evt) {
    return evt.stopPropagation();
  }); //textDefault.

  inputControl.value = input[value];
  inputControl.addEventListener("change", function (evt) {
    input[value] = inputControl.value;
  });
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputControl.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  return {
    get value() {
      return inputControl.value;
    },

    set value(val) {
      inputControl.value = val;
    }

  };
}

function makeSSNInput(form, input, value) {
  var suffix = form instanceof Popup ? form.suffix : '';
  var initialValue = input[value];
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("INPUT");
  inputControl.className = "textInputOption" + suffix + " rightJustify";
  inputControl.type = "date"; //textDefault.

  inputControl.value = input[value];
  inputControl.addEventListener("change", function (evt) {
    input[value] = inputControl.value;
  });
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputControl.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  return {
    get value() {
      return inputControl.value;
    },

    set value(val) {
      inputControl.value = val;
    },

    reset: function reset() {
      input[value] = initialValue;
      inputControl.value = initialValue;
    },
    changes: function changes() {
      if (input[value] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
      }

      return '';
    }
  };
} // --------------- Dropdown choice list ---------------------------


function makeChoiceInput(form, input, value, choices, text) {
  var suffix = form instanceof Popup ? form.suffix : '';
  var initialValue = input[value];
  var textMinmum = document.createElement("SPAN");
  textMinmum.textContent = text;
  var inputControl = document.createElement("SELECT");
  inputControl.className = "selectInput" + suffix + " rightJustify";
  inputControl.addEventListener("mousedown", function (evt) {
    return evt.stopPropagation();
  });

  var _iterator2 = _createForOfIteratorHelper(choices),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var choice = _step2.value;
      var option = document.createElement("option");
      option.text = choice;

      if (choice === input[value]) {
        inputControl.selectedIndex = inputControl.options.length - 1;
      }

      inputControl.add(option);
    } //textDefault.

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  inputControl.value = input[value];
  inputControl.addEventListener("change", function (evt) {
    var idx = inputControl.selectedIndex;

    if (idx >= 0) {
      console.log("Value in select is :", inputControl.options[idx].text);
      input[value] = inputControl.options[idx].text;
    }
  });
  var binder = document.createElement("div");
  binder.className = "fieldUnit" + suffix;
  form.appendChild(binder);
  binder.appendChild(textMinmum);
  binder.appendChild(inputControl);

  if (form instanceof Popup) {
    form.on("accept", function () {
      inputControl.value, _readOnlyError("initialValue");
    });
    form.on("reject", function () {
      inputControl.value = initialValue;
    });
  }

  return {
    get value() {
      return inputControl.value;
    },

    set value(val) {
      inputControl.value = val;
    },

    reset: function reset() {
      input[value] = initialValue;
      inputControl.value = initialValue;
    },
    changes: function changes() {
      if (input[value] !== initialValue) {
        return text + popups.strings.get(" changed from ") + initialValue + popups.strings.get(" to ") + input[value];
      }

      return '';
    }
  };
} //--------------------------- Quick Popup Menu System ------------------------------


var mouseCatcher = null;

function initMouseCatcher() {
  if (mouseCatcher) return;
  mouseCatcher = document.createElement("div");
  document.body.appendChild(mouseCatcher);
  mouseCatcher.addEventListener("contextmenu", function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  });
  mouseCatcher.className = "mouseCatcher";
  var topMenu;
  mouseCatcher.addEventListener("click", function (evt) {
    mouseCatcher.style.visibility = "hidden";
    if (topMenu) topMenu.hide(true);
  });
}

function createPopupMenu(opts) {
  var suffix = (opts === null || opts === void 0 ? void 0 : opts.suffix) || '';
  var keepShow = false;

  function menuCloser() {
    if (menu.lastShow) {
      if (keepShow) {
        menu.lastShow = 0;
        keepShow = false;
        return;
      }

      var now = Date.now();

      if (now - menu.lastShow > 500) {
        menu.lastShow = 0; // reset this, otherwise hide will just schedule this timer

        if (menu.subOpen) menu.subOpen.hide();
        menu.hide();
      }

      if (menu.lastShow) setTimeout(menuCloser, 500 - (now - menu.lastShow));
    }
  }

  var menu = {
    items: [],
    lastShow: 0,
    parent: null,
    subOpen: null,
    container: document.createElement("div"),
    board: null,
    suffix: '',
    separate: function separate() {
      var newItem = document.createElement("HR");
      menu.container.appendChild(newItem);
    },
    addItem: function addItem(text, cb) {
      var _this4 = this;

      var newItem = document.createElement("A");
      var newItemBR = document.createElement("BR");
      newItem.textContent = text;
      menu.container.appendChild(newItem);
      menu.container.appendChild(newItemBR);
      newItem.className = "popupItem" + menu.suffix;
      newItem.addEventListener("click", function (evt) {
        cb(); //console.log( "Item is clicked.", evt.target.value );

        _this4.hide(true);
      });
      newItem.addEventListener("mouseover", function (evt) {
        if (menu.subOpen) {
          menu.subOpen.hide();
          menu.subOpen = null;
        }

        keepShow = true;
      });
    },
    addMenu: function addMenu(text) {
      var _this5 = this;

      var newItem = document.createElement("A");
      var newItemBR = document.createElement("BR");
      newItem.textContent = text;
      this.container.appendChild(newItem);
      this.container.appendChild(newItemBR);
      var value = createPopupMenu();
      {
        value.parent = this;
        this.items.push(value);
        newItem.addEventListener("mouseover", function (evt) {
          var r = newItem.getBoundingClientRect();
          keepShow = true;
          console.log("Item hover show that.", evt.clientX, evt.clientY);
          value.show(evt.clientX + 25, r.top - 10, menu.cb);
          menu.subOpen = value;
        });
        newItem.addEventListener("mouseout", function (evt) {
          var r = newItem.getBoundingClientRect();
          console.log("Item is clicked show that.", evt.clientX, r.top);
          if (evt.toElement !== newItem.container) value.hide();
        });
        newItem.addEventListener("mousemove", function (evt) {
          if (_this5.subOpen) _this5.subOpen.lastShow = Date.now();
        });
      }
      return value;
    },
    hide: function hide(all) {
      if (menu.lastShow) return menuCloser();
      this.container.style.visibility = "hidden";
      var sub = this.subOpen;

      if (sub) {
        this.subOpen = null;
        sub.hide(all);
      }

      if (this.parent && this.parent.subOpen) {
        if (all) {
          // close from here up
          this.parent.hide(all);
        }
      } else {
        mouseCatcher.style.visibility = "hide";
      }
    },
    show: function show(x, y, cb) {
      if (this.parent) this.parent.subOpen = this;
      menu.lastShow = Date.now(); //this.board = board;

      menu.cb = cb;
      mouseCatcher.style.visibility = "visible";
      this.container.style.visibility = "inherit";
      this.container.style.left = x;
      this.container.style.top = y;
    },
    reset: function reset() {
      this.hide(true);
      var n;

      while (n = menu.container.childNodes[0]) {
        n.remove();
      } //console.log( "hide everything?" );	

    }
  };
  if (!mouseCacher) initMouseCacher();
  mouseCatcher.appendChild(menu.container);
  menu.container.className = "popup" + suffix;
  menu.container.style.zIndex = 50;
  menu.hide(); //document.body.appendChild( menu.container );

  return menu;
}

var GraphicFrame = /*#__PURE__*/function (_Popup2) {
  _inherits(GraphicFrame, _Popup2);

  var _super2 = _createSuper(GraphicFrame);

  function GraphicFrame() {
    var _this6;

    _classCallCheck(this, GraphicFrame);

    //const defaultFont1 = "20px Arial";
    _this6 = _super2.call(this, null, null);
    var appCanvas = _this6.divContent;
    var rect = appCanvas.getBoundingClientRect();
    appCanvas.width = rect.right - rect.left; //window.innerWidth;

    appCanvas.height = rect.bottom - rect.top; //window.innerHeight;

    var appSizing;
    var usingSection;
    var appDragging;
    appCanvas.addEventListener("mousemove", mouseMove);
    appCanvas.addEventListener("mouseup", mouseUp);
    appCanvas.addEventListener("mousedown", mouseDown);
    var frames = [];
    var prior_buttons;
    var _MK_LBUTTON = 1;
    var _MK_RBUTTON = 2;
    var _MK_MBUTTON = 4;
    var zz = 0;

    function drawScreen() {
      appCtx.clearRect(0, 0, appCanvas.width, appCanvas.height);
      frames.forEach(function (frame) {
        appCtx.drawImage(frame.canvas, frame.x, frame.y); //, frame.width, frame.height, frame.w, frame.h, frame.width, frame.height );
      });
    }

    function mouse(x, y, b) {
      var rect = appCanvas.getBoundingClientRect();
      var w = rect.right - rect.left; //window.innerWidth;

      var h = rect.bottom - rect.top; //window.innerHeight;

      var cx = x - rect.left;
      var cy = y - rect.top;
      var px = (x - rect.left - w / 2.0) * 2;
      var py = (rect.bottom - y - h / 2.0) * 2; //console.log( "mouse:",cx, cy, b );

      var wasMouse;
      var onFrame;

      if (appDragging) {
        var m = appDragging.getMouse(cx, cy);
        appDragging.x += m.x - appDragging.startX;
        appDragging.y += m.y - appDragging.startY;
      }

      if ((onFrame = appSizing && (wasMouse = appSizing.getMouse(cx, cy), wasMouse.section = usingSection, appSizing)) || (onFrame = frames.find(function (frame) {
        return wasMouse = frame.isMouse(cx, cy);
      }))) {
        //console.log( "frameMouse:", wasMouse, x,y, b, prior_buttons );
        switch (wasMouse.section) {
          default:
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appDragging = onFrame;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (!(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              appDragging = null;
            } //console.log( "Section not found:", wasMouse.section );


            break;

          case 1:
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              // last left.
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setWidth(onFrame.w - (wasMouse.x - onFrame.startX));
              onFrame.x += wasMouse.x - onFrame.startX;
            }

            break;

          case 2:
            // right side, center
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setWidth(onFrame.w + (wasMouse.x - onFrame.startX));
              onFrame.startX = wasMouse.x;
            }

            break;

          case 4:
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              // last left.
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setHeight(onFrame.h - (wasMouse.y - onFrame.startY));
              onFrame.y += wasMouse.y - onFrame.startY;
            }

            break;

          case 8:
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              // last left.
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setHeight(onFrame.h + (wasMouse.y - onFrame.startY));
              onFrame.startY = wasMouse.y;
            }

            break;

          case 1 + 4:
            // top left
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              // last left.
              onFrame.setWidth(onFrame.w - (wasMouse.x - onFrame.startX));
              onFrame.setHeight(onFrame.h - (wasMouse.y - onFrame.startY));
              onFrame.x += wasMouse.x - onFrame.startX;
              onFrame.y += wasMouse.y - onFrame.startY;
            }

            break;

          case 2 + 4:
            // right side, upper corner
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setWidth(onFrame.w + (wasMouse.x - onFrame.startX));
              onFrame.startX = wasMouse.x;
              onFrame.setHeight(onFrame.h - (wasMouse.y - onFrame.startY));
              onFrame.y += wasMouse.y - onFrame.startY;
            }

            break;

          case 1 + 8:
            // top left
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              // last left.
              onFrame.setWidth(onFrame.w - (wasMouse.x - onFrame.startX));
              onFrame.setHeight(onFrame.h + wasMouse.y - onFrame.startY);
              onFrame.x += wasMouse.x - onFrame.startX;
              onFrame.startY = wasMouse.y;
            }

            break;

          case 2 + 8:
            // right side, upper corner
            if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {
              appSizing = onFrame;
              usingSection = wasMouse.section;
              onFrame.startX = wasMouse.x;
              onFrame.startY = wasMouse.y;
            } else if (appSizing && !(b & _MK_LBUTTON) && prior_buttons & _MK_LBUTTON) {
              appSizing = null;
            } else if (appSizing && b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {
              onFrame.setWidth(onFrame.w + (wasMouse.x - onFrame.startX));
              onFrame.startX = wasMouse.x;
              onFrame.setHeight(onFrame.h + (wasMouse.y - onFrame.startY));
              onFrame.startY = wasMouse.y;
            }

            break;
        }

        drawScreen();
      }

      if (!wasMouse.section && onFrame) {//onFrame.mouse(
      }

      {
        // LEFT BTUTTON
        if (b & _MK_LBUTTON && !(prior_buttons & _MK_LBUTTON)) {// start left.
        } else if (b & _MK_LBUTTON && prior_buttons & _MK_LBUTTON) {// drag left.
        } else if (!(b & _MK_LBUTTON) && !(prior_buttons & _MK_LBUTTON)) {// last left.
        }
      }
      prior_buttons = b;
    }

    var _buttons = 0;

    function mouseMove(evt) {
      evt.preventDefault();
      mouse(evt.clientX, evt.clientY, _buttons);
    }

    function mouseUp(evt) {
      evt.preventDefault();
      _buttons = evt.buttons;
      mouse(evt.clientX, evt.clientY, _buttons);
    }

    function mouseDown(evt) {
      evt.preventDefault();
      _buttons = evt.buttons;
      mouse(evt.clientX, evt.clientY, _buttons);
    } //-----------------------------------------------------------------------


    function makeFrame(w, h, _mouse, _draw) {
      var frameFrame;
      var leftWidth = 54;
      var topWidth = 54;
      var rightWidth = 58;
      var bottomWidth = 55;
      var mouseSection = 0;
      var draw = _draw;
      var mouse = _mouse;
      var frame = {
        canvas: document.createElement("canvas"),
        ctx: null,
        w: w,
        h: h,
        x: 0,
        y: 0,
        sx: leftWidth,
        sy: topWidth,
        sw: w - (leftWidth + rightWidth),
        sh: h - (topWidth + bottomWidth),
        sizing: false,
        dragging: false,
        startX: 0,
        startY: 0,
        write: function write() {
          appContext.drawImage(this.canvas, this.x, this.y);
        },
        setFrame: function setFrame(image) {
          var img = document.createElement("IMG");
          img.src = image;

          img.onload = function () {
            frameFrame = img;
            console.log("have image loaded?");
            drawFrame();
          };
        },
        setWidth: function setWidth(w) {
          this.w = w;
          this.sw = this.w - (leftWidth + rightWidth);
          this.canvas.width = this.w;
          drawFrame();
        },
        setHeight: function setHeight(h) {
          this.h = h;
          this.sh = this.h - (topWidth + bottomWidth);
          this.canvas.height = this.h;
          drawFrame();
        },
        setDraw: function setDraw(cb) {
          draw = cb;
        },
        getMouse: function getMouse(x, y) {
          var sx,
              sy,
              tx,
              ty,
              farx = false,
              fary = false;
          ty = y - this.y;

          if ((tx = x - this.x) > leftWidth && ty > topWidth) {
            sx = tx - leftWidth;
            sy = ty - topWidth;

            if ((true, tx) < this.w - (leftWidth + rightWidth) && (true, ty) < this.h - (topWidth + bottomWidth)) {
              return {
                frame: false,
                x: tx,
                y: ty
              };
            }
          }

          var section = 0;
          if (tx < leftWidth) section += 1;else if (tx > this.w - leftWidth) section += 2;
          if (ty < topWidth) section += 4;else if (ty > this.h - topWidth) section += 8;
          return {
            frame: true,
            section: section,
            x: tx,
            y: ty
          };
        },
        isMouse: function isMouse(x, y) {
          var sx,
              sy,
              tx,
              ty,
              farx = false,
              fary = false;

          if (x > this.x && y > this.y && x < this.x + this.w && y < this.y + this.h) {
            ty = y - this.y;

            if ((tx = x - this.x) > leftWidth && ty > topWidth) {
              sx = tx - leftWidth;
              sy = ty - topWidth;

              if ((true, tx) < this.w - (leftWidth + rightWidth) && (true, ty) < this.h - (topWidth + bottomWidth)) {
                return {
                  frame: false,
                  x: tx,
                  y: ty
                };
              }
            }

            var section = 0;
            if (tx < leftWidth) section += 1;else if (tx > this.w - leftWidth) section += 2;
            if (ty < topWidth) section += 4;else if (ty > this.h - topWidth) section += 8;
            return {
              frame: true,
              section: section,
              x: tx,
              y: ty
            };
          }

          return null;
        }
      };
      frames.push(frame);
      frame.canvas.width = w;
      frame.canvas.height = h;
      frame.ctx = frame.canvas.getContext("2d");
      frame.ctx.font = defaultFont1; //frame.ctx.fillRect( 0,0,100,100 );
      //appCtx.fillRect( 0,0,100,100 );

      function drawFrame() {
        if (!frameFrame) return;
        var src = frameFrame;
        var ctx = frame.ctx;
        var outCtx = appCtx; //frame.ctx;
        //------------ corners ------------------

        ctx.drawImage(frameFrame, 0, 0, leftWidth, topWidth, 0, 0, leftWidth, topWidth);
        ctx.drawImage(frameFrame, frameFrame.width - rightWidth, 0, leftWidth, topWidth, frame.canvas.width - rightWidth, 0, leftWidth, topWidth);
        ctx.drawImage(frameFrame, 0, src.height - bottomWidth, leftWidth, topWidth, 0, frame.canvas.height - bottomWidth, leftWidth, bottomWidth);
        ctx.drawImage(frameFrame, frameFrame.width - rightWidth, src.height - bottomWidth, rightWidth, bottomWidth, frame.canvas.width - rightWidth, frame.canvas.height - bottomWidth, rightWidth, bottomWidth); // top-bottom

        ctx.drawImage(frameFrame, leftWidth, 0, src.width - (leftWidth + rightWidth), topWidth, leftWidth, 0, frame.canvas.width - (leftWidth + rightWidth), topWidth);
        ctx.drawImage(frameFrame, leftWidth, src.height - bottomWidth, src.width - (leftWidth + rightWidth), bottomWidth, leftWidth, frame.canvas.height - bottomWidth, frame.canvas.width - (leftWidth + rightWidth), bottomWidth); // left-right

        ctx.drawImage(frameFrame, 0, topWidth, leftWidth, src.height - (topWidth + bottomWidth), 0, topWidth, leftWidth, frame.canvas.height - (topWidth + bottomWidth));
        ctx.drawImage(frameFrame, src.width - rightWidth, topWidth, rightWidth, src.height - (topWidth + bottomWidth), frame.canvas.width - rightWidth, topWidth, rightWidth, frame.canvas.height - (topWidth + bottomWidth));
        ctx.drawImage(frameFrame, leftWidth, topWidth, src.width - (leftWidth + rightWidth), src.height - (topWidth + bottomWidth), leftWidth, topWidth, frame.canvas.width - (leftWidth + rightWidth), frame.canvas.height - (topWidth + bottomWidth));
        renderLabel(ctx, "LABEL", 50, 75);
        outCtx.drawImage(frame.canvas, frame.x, frame.y); //, frame.width, frame.height, frame.w, frame.h, frame.width, frame.height );

        if (draw) draw(); //		appCtx.drawImage( frameFrame, 0, 0 );
      }
    }

    return _this6;
  }

  return GraphicFrame;
}(Popup);
/*
 //-------------------------------------------------------------

function makeApp() {
	var widgets = makeFrame( 200, 500 );
	var tools = makeFrame( 800, 600 );
	tools.x = widgets.w;
	widgets.setFrame( "WindowFrame-LightWoodFilled.png" );

	tools.setFrame( "WindowFrame-LightWoodFilled.png" );

	makeNameTray();
}

*/
//-----------------------------------------------------------------


exports.GraphicFrame = GraphicFrame;

var AlertForm = /*#__PURE__*/function (_Popup3) {
  _inherits(AlertForm, _Popup3);

  var _super3 = _createSuper(AlertForm);

  function AlertForm(parent) {
    var _this7;

    _classCallCheck(this, AlertForm);

    _this7 = _super3.call(this, null, parent, {
      suffix: "-alert"
    });

    var this_ = _assertThisInitialized(_this7);

    _this7.divContent.setAttribute("tabIndex", 0);

    _this7.divContent.className += " alert-content";

    _this7.divFrame.addEventListener("click", function () {
      this_.hide();
    });

    return _this7;
  }

  _createClass(AlertForm, [{
    key: "show",
    value: function show() {
      this.raise();

      _get(_getPrototypeOf(AlertForm.prototype), "show", this).call(this);

      this.divFrame.focus();
      this.center();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.divFrame.style.display = "none";
    }
  }, {
    key: "caption",
    set: function set(val) {
      //console.log( "This should be caption set:", val );
      this.divContent.innerHTML = val;
    }
  }]);

  return AlertForm;
}(Popup);

exports.AlertForm = AlertForm;
var alertForm = null; //initAlertForm();
//alertForm.hide();

function Alert(msg) {
  if (!alertForm) alterForm = new AlertForm();
  alterForm.caption = msg;
  alertForm.show();
}

var SashPicker = /*#__PURE__*/function (_Popup4) {
  _inherits(SashPicker, _Popup4);

  var _super4 = _createSuper(SashPicker);

  function SashPicker(opts) {
    var _this8;

    _classCallCheck(this, SashPicker);

    _this8 = _super4.call(this, "Please select login role", null, {
      enableClose: false
    });

    _defineProperty(_assertThisInitialized(_this8), "choices", []);

    _defineProperty(_assertThisInitialized(_this8), "sashModule", null);

    _defineProperty(_assertThisInitialized(_this8), "promise", null);

    var form = (opts === null || opts === void 0 ? void 0 : opts.useSashForm) || "pickSashForm.html";
    Promise.resolve("".concat((opts === null || opts === void 0 ? void 0 : opts.sashScript) || "pickSashForm.js")).then(function (s) {
      return _interopRequireWildcard(require(s));
    }).then(function (sashModule) {
      _this8.sashModule = sashModule;
      sashModule.setForm(pickSashForm);
    })["catch"](function (err) {
      console.log("Sash form resulted with an error?");
    });

    _this8.hide();

    fillFromURL(_assertThisInitialized(_this8), form).then(function () {
      _this8.center();

      _this8.on("load", _assertThisInitialized(_this8));
    })["catch"](function (err) {
      if (_this8.promise) _this8.promise.rej("Choice selection form failed to load.");
    });

    _this8.on("ok", function () {
      if (_this8.sashModule) {
        var choice = _this8.sashModule.getChoice();

        if (_this8.promise) _this8.promise.res(choice);
      } else if (_this8.promise) _this8.promise.res(choices[0]);

      _this8.hide();
    });

    _this8.on("cancel", function () {
      if (_this8.promise) _this8.promise.rej("Choice canceled by user.");

      _this8.hide();
    });

    return _this8;
  }

  _createClass(SashPicker, [{
    key: "show",
    value: function show(choices) {
      this.reset();
      this.choices = choices;

      if (this.sashModule) {
        var _iterator3 = _createForOfIteratorHelper(choices),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var choice = _step3.value;
            this.sashModule.addChoice(choice);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      _get(_getPrototypeOf(SashPicker.prototype), "show", this).call(this);
    }
  }]);

  return SashPicker;
}(Popup); // login form as a class would be a better implementation.


function makeLoginForm(doLogin, opts) {
  var loginForm = createPopup("Connecting", opts === null || opts === void 0 ? void 0 : opts.parent, {
    enableClose: false
  });
  var pickSashForm = null;
  var createMode = false;
  var isGuestLogin = false;
  var form = (opts === null || opts === void 0 ? void 0 : opts.useForm) || "loginForm.html";
  var wsClient = opts === null || opts === void 0 ? void 0 : opts.wsLoginClient;

  loginForm.connect = function () {
    loginForm.caption = "Login Ready...";
  };

  loginForm.disconnect = function () {
    loginForm.caption = "Connecting...";
    loginForm.show();
  };

  loginForm.login = function () {
    if (doLogin) doLogin(wsClient);
  };

  loginForm.pickSash = function (choices) {
    var p = {
      p: null,
      res: null,
      rej: null
    };
    p.p = new Promise(function (res, rej) {
      p.res = res;
      p.rej = rej;
    });

    if (!pickSashform) {
      pickSashForm = new SashPicker(opts);
      pickSashForm.on("load", function (form) {
        fillChoices();
      });
    } else {
      fillChoices();
    }

    function fillChoices() {
      pickSashForm.show(choices, p);
    }

    return p.p;
  };

  loginForm.Alert = Alert;

  loginForm.setClient = function (wsClient_) {
    wsClient = wsClient_;
  };

  loginForm.hide();
  fillFromURL(loginForm, form).then(function () {
    if (wsClient) {
      wsClient.loginForm = loginForm;

      if (wsClient.connected) {
        // already connected; connect event would not have fired
        loginForm.caption = "Login Ready"; // sometimes it is already connected...
      }

      wsClient.bindControls(loginForm);
      loginForm.center();
    }
  });
  if (!wsClient) loginForm.show();
  return loginForm;
}

function makeWindowManager() {
  var taskButton = document.createElement("div");
  taskButton.className = "taskManagerFloater";
  document.body.appendChild(taskButton);
  var taskPanel = document.createElement("div");
  var taskWindow = new Popup(null, null, {
    from: taskPanel
  });
  taskWindow.className = "taskManagerPanel";
  taskWindow.hide();
  addCaptionHandler(taskButton, null);
  taskButton.addEventListener("click", function (evt) {
    evt.preventDefault(); // if was not dragging?
    //alert( "CLICK!" );
  }); //addDragEvent( taskButton ); // add support for click-drag like caption handler....

  return {
    close: function close() {
      console.log("this should remove this whole construct from the page");
    }
  };
}

function fillFromURL(popup, url) {
  //const urlPath =  url.split( "/");
  return fetch(url).then(function (response) {
    return response.text().then(function (text) {
      (popup.divContent || popup.divFrame).innerHTML = text;
      nodeScriptReplace(popup.divContent || popup.divFrame);
      return popup;
    });
  });

  function nodeScriptReplace(node) {
    if (nodeScriptIs(node) === true) {
      node.parentNode.replaceChild(nodeScriptClone(node), node);
    } else {
      var i = -1,
          children = node.childNodes;

      while (++i < children.length) {
        nodeScriptReplace(children[i]);
      }
    }

    return node;
  }

  function nodeScriptClone(node) {
    var script = document.createElement("script");
    script.text = node.innerHTML;
    var i = -1,
        attrs = node.attributes,
        attr;

    while (++i < attrs.length) {
      script.setAttribute((attr = attrs[i]).name, attr.value);
    }
    /*
    if( script.src ) {
    	const protoPath=script.src.split( "://" );
    	const path = protoPath[1].split('/' );
    }
    */


    script.id = "Unique" + unique++;

    if (script.textContent && script.textContent.length) {
      script.textContent = "const rootId='" + script.id + "';" + script.textContent;
    }

    return script;
  }

  function nodeScriptIs(node) {
    return node.tagName === 'SCRIPT';
  }
}

var popups = {
  Popup: Popup,
  defaultDrag: true,
  autoRaise: true,
  create: createPopup,
  simpleForm: createSimpleForm,
  simpleNotice: createSimpleNotice,
  makeList: createList,
  makeCheckbox: makeCheckbox,
  makeRadioChoice: makeRadioChoice,
  makeLeftRadioChoice: makeLeftRadioChoice,
  makeNameInput: makeNameInput,
  // form, object, field, text; popup to rename
  makeTextInput: makeTextInput,
  // form, object, field, text
  makeSlider: makeSlider,
  // form, object, field, text
  makeTextField: makeTextField,
  makeButton: makeButton,
  handleButtonEvents: handleButtonEvents,
  // expose just the button handler of makeButton
  makeChoiceInput: makeChoiceInput,
  // form, object, field, choiceArray, text
  makeDateInput: makeDateInput,
  // form, object, field, text
  strings: {
    get: function get(s) {
      return s;
    }
  },
  setClass: setClass,
  toggleClass: toggleClass,
  clearClass: clearClass,
  createMenu: createPopupMenu,
  makeLoginForm: makeLoginForm,
  makeWindowManager: makeWindowManager,
  fillFromURL: fillFromURL,
  utils: utils // expose formatting utility functions.

};
exports.popups = popups;
var _default = popups;
exports["default"] = _default;
