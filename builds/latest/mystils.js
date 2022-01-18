/*************************************************
Copyright © 2022 Ennio Marke
 ____    ____  ____  ____   ______   _________  
|_   \  /   _||_  _||_  _|.' ____ \ |  _   _  | 
  |   \/   |    \ \  / /  | (___ \_||_/ | | \_| 
  | |\  /| |     \ \/ /    _.____`.     | |     
 _| |_\/_| |_    _|  |_   | \____) |   _| |_    
|_____||_____|  |______|   \______.'  |_____| 
*************************************************/

const options = document.currentScript.hasAttribute("data-opt")
  ? document.currentScript.dataset.opt.split(" ").map((e) => e.toLowerCase())
  : [];
const umlautMap = {
  "\u00dc": "UE",
  "\u00c4": "AE",
  "\u00d6": "OE",
  "\u00fc": "ue",
  "\u00e4": "ae",
  "\u00f6": "oe",
  "\u00df": "ss",
};
var prtOpt = ["string", "array", "object", "number"];
if (options.indexOf("prototype") >= 0) {
  if (document.currentScript.dataset.prototype) {
    prtOpt = document.currentScript.dataset.prototype
      .split(" ")
      .map((e) => e.toLowerCase());
  }
}

/*
 * checkType() : Test the type of the value. If succeds return true,
 * if fails, throw an Error
 */
function checkType(value, type, i) {
  // perform the appropiate test to the passed
  // value according to the provided type
  switch (type) {
    case Boolean:
      if (typeof value === "boolean") return true;
      break;
    case String:
      if (typeof value === "string") return true;
      break;
    case Number:
      if (typeof value === "number") return true;
      break;
    case Array:
      if (Array.isArray(value)) return true;
      break;
    case Array:
      if (typeof value === "object") return true;
      break;
    case Function:
      if (typeof value === "function") return true;
      break;
    case Object:
      if (typeof value === "object") return true;
    default:
      throw new Error(`TypeError : Unknown type provided in argument ${i + 1}`);
  }
  // test didn't succeed , throw error
  throw new Error(`TypeError : Expecting a ${type.name} in argument ${i + 1}`);
}

/*
 * typedFunction() : Constructor that returns a wrapper
 * to handle each function call, performing automatic
 * arguments type checking
 */
function tFunc(parameterTypes, func) {
  // types definitions and function parameters
  // count must match
  if (parameterTypes.length !== func.length)
    throw new Error(
      `Function has ${func.length} arguments, but type definition has ${parameterTypes.length}`
    );
  // return the wrapper...
  return function (...args) {
    // provided arguments count must match types
    // definitions count
    if (parameterTypes.length !== args.length)
      throw new Error(
        `Function expects ${func.length} arguments, instead ${args.length} found.`
      );
    // iterate each argument value, and perform a
    // type check against it, using the type definitions
    // provided in the construction stage
    for (let i = 0; i < args.length; i++)
      checkType(args[i], parameterTypes[i], i);
    // if no error has been thrown, type check succeed
    // execute function!
    return func(...args);
  };
}

var myFunc = tFunc([Number, Number], (a, b) => {
  return a + b;
});

class mystils {
  constructor() {
    window.mt == "myst";
    //#region Arrays
    if (prtOpt == undefined || prtOpt.indexOf("array") >= 0) {
      Array.prototype.unique = function () {
        return Array.from(new Set(this));
      };
      Array.prototype.forAll = tFunc([Function], function (toDo) {
        for (let i = 0; i < this.length; i++) {
          toDo(this[i], i);
        }
      });
      Array.prototype.shuffle = function () {
        return this.sort(() => {
          Math.random() - 0.5;
        });
      };
    }
    //#endregion

    //#region Objects
    if (prtOpt == undefined || prtOpt.indexOf("object") >= 0) {
      Object.prototype.keys = function () {
        return Object.keys(this);
      };
      Object.prototype.vals = function () {
        return this[Object.keys(this)];
      };
    }
    //#endregion

    //#region Numbers
    if (prtOpt == undefined || prtOpt.indexOf("number") >= 0) {
      Number.prototype.isPrime = function () {
        var n = "1".repeat(this);
        return !n.match(/^1?$|^(11+?)\1+$/gi);
      };
      Number.prototype.getPrc = function () {
        //get precision
        if (!isFinite(this)) return 0;
        var e = 1,
          p = 0;
        while (Math.round(this * e) / e !== this) {
          e *= 10;
          p++;
        }
        return p;
      };
    }
    //#endregion

    //#region String
    if (prtOpt == undefined || prtOpt.indexOf("string") >= 0) {
      String.prototype.replaceUmlaute = function () {
        return this.replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
          const big = umlautMap[a.slice(0, 1)];
          return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        }).replace(
          new RegExp("[" + Object.keys(umlautMap).join("|") + "]", "g"),
          (a) => umlautMap[a]
        );
      };
    }
    //#endregion

    if (options.indexOf("css") >= 0) {
      let standardCss = `
                :root {
                    --res-size: calc(100vmin / 1rem)
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Helvetica', cursive;
                }
                
                html {
                    height: 100%;
                    width: 100%;
                }

                body {
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                }

                div {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
          
                .center {
                    margin: auto;
                }

                .center-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .h-33 {
                    height: 33.334vh;
                }

                .w-100 {
                    width: 100vw;
                }
            `;
      let stdSS = document.createElement("style");
      stdSS.type = "text/css";
      stdSS.textContent = standardCss;
      document.head.appendChild(stdSS);
    }
  }
  addNumbers = tFunc([Array], (numbers) => {
    console.log(numbers);
    var sum = 0;
    numbers.forEach((e) => {
      if (typeof e == "number" || typeof e == "boolean") sum += e;
    });
    return sum;
  });
  isNumeric(a) {
    if (a.constructor.name == "Array") {
      if (a.filter((e) => isNaN(+e)).length > 0) return false;
      return true;
    }
    if (isNaN(+a)) return false;
    return true;
  }
  rand = tFunc([Number, Number, Number], (min, max, precision) => {
    if (max == undefined) {
      if (min == undefined) return Math.round(Math.random());
      if (min < -1) return -Math.round(Math.random() * (Math.abs(min) - 1) + 1);
      if (min == -1) return Math.round(Math.random()) == -0 ? 0 : -1;
      if (min == 0) return Math.round(Math.random());
      if (min < 1 && min > 0) {
      }
      if (min == 1) return Math.round(Math.random());
      if (min > 1) return Math.round(Math.random() * (min - 1) + 1);
    }
    precision ??= 1;
    let prcFac = "1";
    for (let i = 1; i < precision; i++) {
      prcFac += "0";
    }
    return (
      Math.floor(Math.random() * (max * prcFac - min * prcFac) + min * prcFac) /
      (min * prcFac)
    );
  });
  getPrc = tFunc([Number], (number) => {
    //get precision
    if (!isFinite(number)) return 0;
    var e = 1,
      p = 0;
    while (Math.round(number * e) / e !== number) {
      e *= 10;
      p++;
    }
    return p;
  });
  addCss = tFunc([String, Object], (css, attributes) => {
    //attributes {data-opt: "cool"}
    let sS = document.createElement("style");
    if (attributes != undefined && typeof attributes == "object") {
      for (let i = 0; i < Object.keys(attributes).length; i++) {
        sS.setAttribute(
          Object.keys(attributes)[i],
          attributes[Object.keys(attributes)[i]]
        );
      }
    }
    sS.type = "text/css";
    sS.textContent = css;
    document.head.appendChild(sS);
  });
  addJs = tFunc([String, Object], (js, attributes) => {
    let jSS = document.createElement("script");
    if (attributes != undefined && typeof attributes == "object") {
      for (let i = 0; i < Object.keys(attributes).length; i++) {
        jSS.setAttribute(
          Object.keys(attributes)[i],
          attributes[Object.keys(attributes)[i]]
        );
      }
    }
    jSS.textContent = js;
    document.head.appendChild(jSS);
  });
  numBtwn = tFunc([Number, Number, Boolean], (num1, num2, floor) => {
    if (floor == 1) {
      return Math.floor((num1 + num2) / 2);
    } else {
      return Math.round((num1 + num2) / 2);
    }
  });
  binSearch = tFunc([Array, Number], (arr, toSearch) => {
    arr = arr.sort((a, b) => a - b);
    let index = Math.floor(arr.length / 2);
    let max = arr.length;
    let min = 0;
    let resPos; //result position
    let pass = 0;
    while (resPos == undefined) {
      if (pass > arr.length) return undefined;
      pass++;
      if (arr[index] == toSearch) {
        resPos = index;
      } else if (arr[index] > toSearch) {
        max = index;
        index = Math.floor((max + min) / 2);
      } else if (arr[index] < toSearch) {
        min = index;
        index = Math.round((max + min) / 2);
      } else {
        return undefined;
      }
    }
    return resPos;
  });
  unique = tFunc([Array], (arr) => {
    return Array.from(new Set(arr));
  });
  shuffle = tFunc([Array], (arr) => {
    return arr.sort(() => {
      Math.random() - 0.5;
    });
  });
  isPrime = tFunc([Number], (number) => {
    var n = "1".repeat(number);
    return !n.match(/^1?$|^(11+?)\1+$/gi);
  });
  replaceUmlaute = tFunc([String], (str) => {
    return str
      .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
        const big = umlautMap[a.slice(0, 1)];
        return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
      })
      .replace(
        new RegExp("[" + Object.keys(umlautMap).join("|") + "]", "g"),
        (a) => umlautMap[a]
      );
  });
}

const mt = new mystils();

//#region jQuery
if (options.indexOf("jq") >= 0) {
  !(function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = e.document
          ? t(e, !0)
          : function (e) {
              if (!e.document)
                throw new Error("jQuery requires a window with a document");
              return t(e);
            })
      : t(e);
  })("undefined" != typeof window ? window : this, function (C, e) {
    "use strict";
    var t = [],
      r = Object.getPrototypeOf,
      s = t.slice,
      g = t.flat
        ? function (e) {
            return t.flat.call(e);
          }
        : function (e) {
            return t.concat.apply([], e);
          },
      u = t.push,
      i = t.indexOf,
      n = {},
      o = n.toString,
      v = n.hasOwnProperty,
      a = v.toString,
      l = a.call(Object),
      y = {},
      m = function (e) {
        return (
          "function" == typeof e &&
          "number" != typeof e.nodeType &&
          "function" != typeof e.item
        );
      },
      x = function (e) {
        return null != e && e === e.window;
      },
      E = C.document,
      c = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0,
      };

    function b(e, t, n) {
      var r,
        i,
        o = (n = n || E).createElement("script");
      if (((o.text = e), t))
        for (r in c)
          (i = t[r] || (t.getAttribute && t.getAttribute(r))) &&
            o.setAttribute(r, i);
      n.head.appendChild(o).parentNode.removeChild(o);
    }

    function w(e) {
      return null == e
        ? e + ""
        : "object" == typeof e || "function" == typeof e
        ? n[o.call(e)] || "object"
        : typeof e;
    }
    var f = "3.6.0",
      S = function (e, t) {
        return new S.fn.init(e, t);
      };

    function p(e) {
      var t = !!e && "length" in e && e.length,
        n = w(e);
      return (
        !m(e) &&
        !x(e) &&
        ("array" === n ||
          0 === t ||
          ("number" == typeof t && 0 < t && t - 1 in e))
      );
    }
    (S.fn = S.prototype =
      {
        jquery: f,
        constructor: S,
        length: 0,
        toArray: function () {
          return s.call(this);
        },
        get: function (e) {
          return null == e
            ? s.call(this)
            : e < 0
            ? this[e + this.length]
            : this[e];
        },
        pushStack: function (e) {
          var t = S.merge(this.constructor(), e);
          return (t.prevObject = this), t;
        },
        each: function (e) {
          return S.each(this, e);
        },
        map: function (n) {
          return this.pushStack(
            S.map(this, function (e, t) {
              return n.call(e, t, e);
            })
          );
        },
        slice: function () {
          return this.pushStack(s.apply(this, arguments));
        },
        first: function () {
          return this.eq(0);
        },
        last: function () {
          return this.eq(-1);
        },
        even: function () {
          return this.pushStack(
            S.grep(this, function (e, t) {
              return (t + 1) % 2;
            })
          );
        },
        odd: function () {
          return this.pushStack(
            S.grep(this, function (e, t) {
              return t % 2;
            })
          );
        },
        eq: function (e) {
          var t = this.length,
            n = +e + (e < 0 ? t : 0);
          return this.pushStack(0 <= n && n < t ? [this[n]] : []);
        },
        end: function () {
          return this.prevObject || this.constructor();
        },
        push: u,
        sort: t.sort,
        splice: t.splice,
      }),
      (S.extend = S.fn.extend =
        function () {
          var e,
            t,
            n,
            r,
            i,
            o,
            a = arguments[0] || {},
            s = 1,
            u = arguments.length,
            l = !1;
          for (
            "boolean" == typeof a && ((l = a), (a = arguments[s] || {}), s++),
              "object" == typeof a || m(a) || (a = {}),
              s === u && ((a = this), s--);
            s < u;
            s++
          )
            if (null != (e = arguments[s]))
              for (t in e)
                (r = e[t]),
                  "__proto__" !== t &&
                    a !== r &&
                    (l && r && (S.isPlainObject(r) || (i = Array.isArray(r)))
                      ? ((n = a[t]),
                        (o =
                          i && !Array.isArray(n)
                            ? []
                            : i || S.isPlainObject(n)
                            ? n
                            : {}),
                        (i = !1),
                        (a[t] = S.extend(l, o, r)))
                      : void 0 !== r && (a[t] = r));
          return a;
        }),
      S.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
          throw new Error(e);
        },
        noop: function () {},
        isPlainObject: function (e) {
          var t, n;
          return (
            !(!e || "[object Object]" !== o.call(e)) &&
            (!(t = r(e)) ||
              ("function" ==
                typeof (n = v.call(t, "constructor") && t.constructor) &&
                a.call(n) === l))
          );
        },
        isEmptyObject: function (e) {
          var t;
          for (t in e) return !1;
          return !0;
        },
        globalEval: function (e, t, n) {
          b(
            e,
            {
              nonce: t && t.nonce,
            },
            n
          );
        },
        each: function (e, t) {
          var n,
            r = 0;
          if (p(e)) {
            for (n = e.length; r < n; r++)
              if (!1 === t.call(e[r], r, e[r])) break;
          } else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
          return e;
        },
        makeArray: function (e, t) {
          var n = t || [];
          return (
            null != e &&
              (p(Object(e))
                ? S.merge(n, "string" == typeof e ? [e] : e)
                : u.call(n, e)),
            n
          );
        },
        inArray: function (e, t, n) {
          return null == t ? -1 : i.call(t, e, n);
        },
        merge: function (e, t) {
          for (var n = +t.length, r = 0, i = e.length; r < n; r++)
            e[i++] = t[r];
          return (e.length = i), e;
        },
        grep: function (e, t, n) {
          for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
            !t(e[i], i) !== a && r.push(e[i]);
          return r;
        },
        map: function (e, t, n) {
          var r,
            i,
            o = 0,
            a = [];
          if (p(e))
            for (r = e.length; o < r; o++)
              null != (i = t(e[o], o, n)) && a.push(i);
          else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
          return g(a);
        },
        guid: 1,
        support: y,
      }),
      "function" == typeof Symbol &&
        (S.fn[Symbol.iterator] = t[Symbol.iterator]),
      S.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
          " "
        ),
        function (e, t) {
          n["[object " + t + "]"] = t.toLowerCase();
        }
      );
    var d = (function (n) {
      var e,
        d,
        b,
        o,
        i,
        h,
        f,
        g,
        w,
        u,
        l,
        T,
        C,
        a,
        E,
        v,
        s,
        c,
        y,
        S = "sizzle" + 1 * new Date(),
        p = n.document,
        k = 0,
        r = 0,
        m = ue(),
        x = ue(),
        A = ue(),
        N = ue(),
        j = function (e, t) {
          return e === t && (l = !0), 0;
        },
        D = {}.hasOwnProperty,
        t = [],
        q = t.pop,
        L = t.push,
        H = t.push,
        O = t.slice,
        P = function (e, t) {
          for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
          return -1;
        },
        R =
          "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        M = "[\\x20\\t\\r\\n\\f]",
        I =
          "(?:\\\\[\\da-fA-F]{1,6}" +
          M +
          "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
        W =
          "\\[" +
          M +
          "*(" +
          I +
          ")(?:" +
          M +
          "*([*^$|!~]?=)" +
          M +
          "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
          I +
          "))|)" +
          M +
          "*\\]",
        F =
          ":(" +
          I +
          ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
          W +
          ")*)|.*)\\)|)",
        B = new RegExp(M + "+", "g"),
        $ = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
        _ = new RegExp("^" + M + "*," + M + "*"),
        z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
        U = new RegExp(M + "|>"),
        X = new RegExp(F),
        V = new RegExp("^" + I + "$"),
        G = {
          ID: new RegExp("^#(" + I + ")"),
          CLASS: new RegExp("^\\.(" + I + ")"),
          TAG: new RegExp("^(" + I + "|[*])"),
          ATTR: new RegExp("^" + W),
          PSEUDO: new RegExp("^" + F),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
              M +
              "*(even|odd|(([+-]|)(\\d*)n|)" +
              M +
              "*(?:([+-]|)" +
              M +
              "*(\\d+)|))" +
              M +
              "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + R + ")$", "i"),
          needsContext: new RegExp(
            "^" +
              M +
              "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
              M +
              "*((?:-\\d)?\\d*)" +
              M +
              "*\\)|)(?=[^-]|$)",
            "i"
          ),
        },
        Y = /HTML$/i,
        Q = /^(?:input|select|textarea|button)$/i,
        J = /^h\d$/i,
        K = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        ee = /[+~]/,
        te = new RegExp(
          "\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\([^\\r\\n\\f])",
          "g"
        ),
        ne = function (e, t) {
          var n = "0x" + e.slice(1) - 65536;
          return (
            t ||
            (n < 0
              ? String.fromCharCode(n + 65536)
              : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
          );
        },
        re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        ie = function (e, t) {
          return t
            ? "\0" === e
              ? "\ufffd"
              : e.slice(0, -1) +
                "\\" +
                e.charCodeAt(e.length - 1).toString(16) +
                " "
            : "\\" + e;
        },
        oe = function () {
          T();
        },
        ae = be(
          function (e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase();
          },
          {
            dir: "parentNode",
            next: "legend",
          }
        );
      try {
        H.apply((t = O.call(p.childNodes)), p.childNodes),
          t[p.childNodes.length].nodeType;
      } catch (e) {
        H = {
          apply: t.length
            ? function (e, t) {
                L.apply(e, O.call(t));
              }
            : function (e, t) {
                var n = e.length,
                  r = 0;
                while ((e[n++] = t[r++]));
                e.length = n - 1;
              },
        };
      }

      function se(t, e, n, r) {
        var i,
          o,
          a,
          s,
          u,
          l,
          c,
          f = e && e.ownerDocument,
          p = e ? e.nodeType : 9;
        if (
          ((n = n || []),
          "string" != typeof t || !t || (1 !== p && 9 !== p && 11 !== p))
        )
          return n;
        if (!r && (T(e), (e = e || C), E)) {
          if (11 !== p && (u = Z.exec(t)))
            if ((i = u[1])) {
              if (9 === p) {
                if (!(a = e.getElementById(i))) return n;
                if (a.id === i) return n.push(a), n;
              } else if (
                f &&
                (a = f.getElementById(i)) &&
                y(e, a) &&
                a.id === i
              )
                return n.push(a), n;
            } else {
              if (u[2]) return H.apply(n, e.getElementsByTagName(t)), n;
              if (
                (i = u[3]) &&
                d.getElementsByClassName &&
                e.getElementsByClassName
              )
                return H.apply(n, e.getElementsByClassName(i)), n;
            }
          if (
            d.qsa &&
            !N[t + " "] &&
            (!v || !v.test(t)) &&
            (1 !== p || "object" !== e.nodeName.toLowerCase())
          ) {
            if (((c = t), (f = e), 1 === p && (U.test(t) || z.test(t)))) {
              ((f = (ee.test(t) && ye(e.parentNode)) || e) === e && d.scope) ||
                ((s = e.getAttribute("id"))
                  ? (s = s.replace(re, ie))
                  : e.setAttribute("id", (s = S))),
                (o = (l = h(t)).length);
              while (o--) l[o] = (s ? "#" + s : ":scope") + " " + xe(l[o]);
              c = l.join(",");
            }
            try {
              return H.apply(n, f.querySelectorAll(c)), n;
            } catch (e) {
              N(t, !0);
            } finally {
              s === S && e.removeAttribute("id");
            }
          }
        }
        return g(t.replace($, "$1"), e, n, r);
      }

      function ue() {
        var r = [];
        return function e(t, n) {
          return (
            r.push(t + " ") > b.cacheLength && delete e[r.shift()],
            (e[t + " "] = n)
          );
        };
      }

      function le(e) {
        return (e[S] = !0), e;
      }

      function ce(e) {
        var t = C.createElement("fieldset");
        try {
          return !!e(t);
        } catch (e) {
          return !1;
        } finally {
          t.parentNode && t.parentNode.removeChild(t), (t = null);
        }
      }

      function fe(e, t) {
        var n = e.split("|"),
          r = n.length;
        while (r--) b.attrHandle[n[r]] = t;
      }

      function pe(e, t) {
        var n = t && e,
          r =
            n &&
            1 === e.nodeType &&
            1 === t.nodeType &&
            e.sourceIndex - t.sourceIndex;
        if (r) return r;
        if (n) while ((n = n.nextSibling)) if (n === t) return -1;
        return e ? 1 : -1;
      }

      function de(t) {
        return function (e) {
          return "input" === e.nodeName.toLowerCase() && e.type === t;
        };
      }

      function he(n) {
        return function (e) {
          var t = e.nodeName.toLowerCase();
          return ("input" === t || "button" === t) && e.type === n;
        };
      }

      function ge(t) {
        return function (e) {
          return "form" in e
            ? e.parentNode && !1 === e.disabled
              ? "label" in e
                ? "label" in e.parentNode
                  ? e.parentNode.disabled === t
                  : e.disabled === t
                : e.isDisabled === t || (e.isDisabled !== !t && ae(e) === t)
              : e.disabled === t
            : "label" in e && e.disabled === t;
        };
      }

      function ve(a) {
        return le(function (o) {
          return (
            (o = +o),
            le(function (e, t) {
              var n,
                r = a([], e.length, o),
                i = r.length;
              while (i--) e[(n = r[i])] && (e[n] = !(t[n] = e[n]));
            })
          );
        });
      }

      function ye(e) {
        return e && "undefined" != typeof e.getElementsByTagName && e;
      }
      for (e in ((d = se.support = {}),
      (i = se.isXML =
        function (e) {
          var t = e && e.namespaceURI,
            n = e && (e.ownerDocument || e).documentElement;
          return !Y.test(t || (n && n.nodeName) || "HTML");
        }),
      (T = se.setDocument =
        function (e) {
          var t,
            n,
            r = e ? e.ownerDocument || e : p;
          return (
            r != C &&
              9 === r.nodeType &&
              r.documentElement &&
              ((a = (C = r).documentElement),
              (E = !i(C)),
              p != C &&
                (n = C.defaultView) &&
                n.top !== n &&
                (n.addEventListener
                  ? n.addEventListener("unload", oe, !1)
                  : n.attachEvent && n.attachEvent("onunload", oe)),
              (d.scope = ce(function (e) {
                return (
                  a.appendChild(e).appendChild(C.createElement("div")),
                  "undefined" != typeof e.querySelectorAll &&
                    !e.querySelectorAll(":scope fieldset div").length
                );
              })),
              (d.attributes = ce(function (e) {
                return (e.className = "i"), !e.getAttribute("className");
              })),
              (d.getElementsByTagName = ce(function (e) {
                return (
                  e.appendChild(C.createComment("")),
                  !e.getElementsByTagName("*").length
                );
              })),
              (d.getElementsByClassName = K.test(C.getElementsByClassName)),
              (d.getById = ce(function (e) {
                return (
                  (a.appendChild(e).id = S),
                  !C.getElementsByName || !C.getElementsByName(S).length
                );
              })),
              d.getById
                ? ((b.filter.ID = function (e) {
                    var t = e.replace(te, ne);
                    return function (e) {
                      return e.getAttribute("id") === t;
                    };
                  }),
                  (b.find.ID = function (e, t) {
                    if ("undefined" != typeof t.getElementById && E) {
                      var n = t.getElementById(e);
                      return n ? [n] : [];
                    }
                  }))
                : ((b.filter.ID = function (e) {
                    var n = e.replace(te, ne);
                    return function (e) {
                      var t =
                        "undefined" != typeof e.getAttributeNode &&
                        e.getAttributeNode("id");
                      return t && t.value === n;
                    };
                  }),
                  (b.find.ID = function (e, t) {
                    if ("undefined" != typeof t.getElementById && E) {
                      var n,
                        r,
                        i,
                        o = t.getElementById(e);
                      if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                          return [o];
                        (i = t.getElementsByName(e)), (r = 0);
                        while ((o = i[r++]))
                          if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                      }
                      return [];
                    }
                  })),
              (b.find.TAG = d.getElementsByTagName
                ? function (e, t) {
                    return "undefined" != typeof t.getElementsByTagName
                      ? t.getElementsByTagName(e)
                      : d.qsa
                      ? t.querySelectorAll(e)
                      : void 0;
                  }
                : function (e, t) {
                    var n,
                      r = [],
                      i = 0,
                      o = t.getElementsByTagName(e);
                    if ("*" === e) {
                      while ((n = o[i++])) 1 === n.nodeType && r.push(n);
                      return r;
                    }
                    return o;
                  }),
              (b.find.CLASS =
                d.getElementsByClassName &&
                function (e, t) {
                  if ("undefined" != typeof t.getElementsByClassName && E)
                    return t.getElementsByClassName(e);
                }),
              (s = []),
              (v = []),
              (d.qsa = K.test(C.querySelectorAll)) &&
                (ce(function (e) {
                  var t;
                  (a.appendChild(e).innerHTML =
                    "<a id='" +
                    S +
                    "'></a><select id='" +
                    S +
                    "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                    e.querySelectorAll("[msallowcapture^='']").length &&
                      v.push("[*^$]=" + M + "*(?:''|\"\")"),
                    e.querySelectorAll("[selected]").length ||
                      v.push("\\[" + M + "*(?:value|" + R + ")"),
                    e.querySelectorAll("[id~=" + S + "-]").length ||
                      v.push("~="),
                    (t = C.createElement("input")).setAttribute("name", ""),
                    e.appendChild(t),
                    e.querySelectorAll("[name='']").length ||
                      v.push(
                        "\\[" + M + "*name" + M + "*=" + M + "*(?:''|\"\")"
                      ),
                    e.querySelectorAll(":checked").length || v.push(":checked"),
                    e.querySelectorAll("a#" + S + "+*").length ||
                      v.push(".#.+[+~]"),
                    e.querySelectorAll("\\\f"),
                    v.push("[\\r\\n\\f]");
                }),
                ce(function (e) {
                  e.innerHTML =
                    "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                  var t = C.createElement("input");
                  t.setAttribute("type", "hidden"),
                    e.appendChild(t).setAttribute("name", "D"),
                    e.querySelectorAll("[name=d]").length &&
                      v.push("name" + M + "*[*^$|!~]?="),
                    2 !== e.querySelectorAll(":enabled").length &&
                      v.push(":enabled", ":disabled"),
                    (a.appendChild(e).disabled = !0),
                    2 !== e.querySelectorAll(":disabled").length &&
                      v.push(":enabled", ":disabled"),
                    e.querySelectorAll("*,:x"),
                    v.push(",.*:");
                })),
              (d.matchesSelector = K.test(
                (c =
                  a.matches ||
                  a.webkitMatchesSelector ||
                  a.mozMatchesSelector ||
                  a.oMatchesSelector ||
                  a.msMatchesSelector)
              )) &&
                ce(function (e) {
                  (d.disconnectedMatch = c.call(e, "*")),
                    c.call(e, "[s!='']:x"),
                    s.push("!=", F);
                }),
              (v = v.length && new RegExp(v.join("|"))),
              (s = s.length && new RegExp(s.join("|"))),
              (t = K.test(a.compareDocumentPosition)),
              (y =
                t || K.test(a.contains)
                  ? function (e, t) {
                      var n = 9 === e.nodeType ? e.documentElement : e,
                        r = t && t.parentNode;
                      return (
                        e === r ||
                        !(
                          !r ||
                          1 !== r.nodeType ||
                          !(n.contains
                            ? n.contains(r)
                            : e.compareDocumentPosition &&
                              16 & e.compareDocumentPosition(r))
                        )
                      );
                    }
                  : function (e, t) {
                      if (t) while ((t = t.parentNode)) if (t === e) return !0;
                      return !1;
                    }),
              (j = t
                ? function (e, t) {
                    if (e === t) return (l = !0), 0;
                    var n =
                      !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return (
                      n ||
                      (1 &
                        (n =
                          (e.ownerDocument || e) == (t.ownerDocument || t)
                            ? e.compareDocumentPosition(t)
                            : 1) ||
                      (!d.sortDetached && t.compareDocumentPosition(e) === n)
                        ? e == C || (e.ownerDocument == p && y(p, e))
                          ? -1
                          : t == C || (t.ownerDocument == p && y(p, t))
                          ? 1
                          : u
                          ? P(u, e) - P(u, t)
                          : 0
                        : 4 & n
                        ? -1
                        : 1)
                    );
                  }
                : function (e, t) {
                    if (e === t) return (l = !0), 0;
                    var n,
                      r = 0,
                      i = e.parentNode,
                      o = t.parentNode,
                      a = [e],
                      s = [t];
                    if (!i || !o)
                      return e == C
                        ? -1
                        : t == C
                        ? 1
                        : i
                        ? -1
                        : o
                        ? 1
                        : u
                        ? P(u, e) - P(u, t)
                        : 0;
                    if (i === o) return pe(e, t);
                    n = e;
                    while ((n = n.parentNode)) a.unshift(n);
                    n = t;
                    while ((n = n.parentNode)) s.unshift(n);
                    while (a[r] === s[r]) r++;
                    return r
                      ? pe(a[r], s[r])
                      : a[r] == p
                      ? -1
                      : s[r] == p
                      ? 1
                      : 0;
                  })),
            C
          );
        }),
      (se.matches = function (e, t) {
        return se(e, null, null, t);
      }),
      (se.matchesSelector = function (e, t) {
        if (
          (T(e),
          d.matchesSelector &&
            E &&
            !N[t + " "] &&
            (!s || !s.test(t)) &&
            (!v || !v.test(t)))
        )
          try {
            var n = c.call(e, t);
            if (
              n ||
              d.disconnectedMatch ||
              (e.document && 11 !== e.document.nodeType)
            )
              return n;
          } catch (e) {
            N(t, !0);
          }
        return 0 < se(t, C, null, [e]).length;
      }),
      (se.contains = function (e, t) {
        return (e.ownerDocument || e) != C && T(e), y(e, t);
      }),
      (se.attr = function (e, t) {
        (e.ownerDocument || e) != C && T(e);
        var n = b.attrHandle[t.toLowerCase()],
          r = n && D.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
        return void 0 !== r
          ? r
          : d.attributes || !E
          ? e.getAttribute(t)
          : (r = e.getAttributeNode(t)) && r.specified
          ? r.value
          : null;
      }),
      (se.escape = function (e) {
        return (e + "").replace(re, ie);
      }),
      (se.error = function (e) {
        throw new Error("Syntax error, unrecognized expression: " + e);
      }),
      (se.uniqueSort = function (e) {
        var t,
          n = [],
          r = 0,
          i = 0;
        if (
          ((l = !d.detectDuplicates),
          (u = !d.sortStable && e.slice(0)),
          e.sort(j),
          l)
        ) {
          while ((t = e[i++])) t === e[i] && (r = n.push(i));
          while (r--) e.splice(n[r], 1);
        }
        return (u = null), e;
      }),
      (o = se.getText =
        function (e) {
          var t,
            n = "",
            r = 0,
            i = e.nodeType;
          if (i) {
            if (1 === i || 9 === i || 11 === i) {
              if ("string" == typeof e.textContent) return e.textContent;
              for (e = e.firstChild; e; e = e.nextSibling) n += o(e);
            } else if (3 === i || 4 === i) return e.nodeValue;
          } else while ((t = e[r++])) n += o(t);
          return n;
        }),
      ((b = se.selectors =
        {
          cacheLength: 50,
          createPseudo: le,
          match: G,
          attrHandle: {},
          find: {},
          relative: {
            ">": {
              dir: "parentNode",
              first: !0,
            },
            " ": {
              dir: "parentNode",
            },
            "+": {
              dir: "previousSibling",
              first: !0,
            },
            "~": {
              dir: "previousSibling",
            },
          },
          preFilter: {
            ATTR: function (e) {
              return (
                (e[1] = e[1].replace(te, ne)),
                (e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne)),
                "~=" === e[2] && (e[3] = " " + e[3] + " "),
                e.slice(0, 4)
              );
            },
            CHILD: function (e) {
              return (
                (e[1] = e[1].toLowerCase()),
                "nth" === e[1].slice(0, 3)
                  ? (e[3] || se.error(e[0]),
                    (e[4] = +(e[4]
                      ? e[5] + (e[6] || 1)
                      : 2 * ("even" === e[3] || "odd" === e[3]))),
                    (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                  : e[3] && se.error(e[0]),
                e
              );
            },
            PSEUDO: function (e) {
              var t,
                n = !e[6] && e[2];
              return G.CHILD.test(e[0])
                ? null
                : (e[3]
                    ? (e[2] = e[4] || e[5] || "")
                    : n &&
                      X.test(n) &&
                      (t = h(n, !0)) &&
                      (t = n.indexOf(")", n.length - t) - n.length) &&
                      ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                  e.slice(0, 3));
            },
          },
          filter: {
            TAG: function (e) {
              var t = e.replace(te, ne).toLowerCase();
              return "*" === e
                ? function () {
                    return !0;
                  }
                : function (e) {
                    return e.nodeName && e.nodeName.toLowerCase() === t;
                  };
            },
            CLASS: function (e) {
              var t = m[e + " "];
              return (
                t ||
                ((t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) &&
                  m(e, function (e) {
                    return t.test(
                      ("string" == typeof e.className && e.className) ||
                        ("undefined" != typeof e.getAttribute &&
                          e.getAttribute("class")) ||
                        ""
                    );
                  }))
              );
            },
            ATTR: function (n, r, i) {
              return function (e) {
                var t = se.attr(e, n);
                return null == t
                  ? "!=" === r
                  : !r ||
                      ((t += ""),
                      "=" === r
                        ? t === i
                        : "!=" === r
                        ? t !== i
                        : "^=" === r
                        ? i && 0 === t.indexOf(i)
                        : "*=" === r
                        ? i && -1 < t.indexOf(i)
                        : "$=" === r
                        ? i && t.slice(-i.length) === i
                        : "~=" === r
                        ? -1 < (" " + t.replace(B, " ") + " ").indexOf(i)
                        : "|=" === r &&
                          (t === i || t.slice(0, i.length + 1) === i + "-"));
              };
            },
            CHILD: function (h, e, t, g, v) {
              var y = "nth" !== h.slice(0, 3),
                m = "last" !== h.slice(-4),
                x = "of-type" === e;
              return 1 === g && 0 === v
                ? function (e) {
                    return !!e.parentNode;
                  }
                : function (e, t, n) {
                    var r,
                      i,
                      o,
                      a,
                      s,
                      u,
                      l = y !== m ? "nextSibling" : "previousSibling",
                      c = e.parentNode,
                      f = x && e.nodeName.toLowerCase(),
                      p = !n && !x,
                      d = !1;
                    if (c) {
                      if (y) {
                        while (l) {
                          a = e;
                          while ((a = a[l]))
                            if (
                              x
                                ? a.nodeName.toLowerCase() === f
                                : 1 === a.nodeType
                            )
                              return !1;
                          u = l = "only" === h && !u && "nextSibling";
                        }
                        return !0;
                      }
                      if (((u = [m ? c.firstChild : c.lastChild]), m && p)) {
                        (d =
                          (s =
                            (r =
                              (i =
                                (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] ||
                                (o[a.uniqueID] = {}))[h] || [])[0] === k &&
                            r[1]) && r[2]),
                          (a = s && c.childNodes[s]);
                        while (
                          (a = (++s && a && a[l]) || (d = s = 0) || u.pop())
                        )
                          if (1 === a.nodeType && ++d && a === e) {
                            i[h] = [k, s, d];
                            break;
                          }
                      } else if (
                        (p &&
                          (d = s =
                            (r =
                              (i =
                                (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] ||
                                (o[a.uniqueID] = {}))[h] || [])[0] === k &&
                            r[1]),
                        !1 === d)
                      )
                        while (
                          (a = (++s && a && a[l]) || (d = s = 0) || u.pop())
                        )
                          if (
                            (x
                              ? a.nodeName.toLowerCase() === f
                              : 1 === a.nodeType) &&
                            ++d &&
                            (p &&
                              ((i =
                                (o = a[S] || (a[S] = {}))[a.uniqueID] ||
                                (o[a.uniqueID] = {}))[h] = [k, d]),
                            a === e)
                          )
                            break;
                      return (d -= v) === g || (d % g == 0 && 0 <= d / g);
                    }
                  };
            },
            PSEUDO: function (e, o) {
              var t,
                a =
                  b.pseudos[e] ||
                  b.setFilters[e.toLowerCase()] ||
                  se.error("unsupported pseudo: " + e);
              return a[S]
                ? a(o)
                : 1 < a.length
                ? ((t = [e, e, "", o]),
                  b.setFilters.hasOwnProperty(e.toLowerCase())
                    ? le(function (e, t) {
                        var n,
                          r = a(e, o),
                          i = r.length;
                        while (i--) e[(n = P(e, r[i]))] = !(t[n] = r[i]);
                      })
                    : function (e) {
                        return a(e, 0, t);
                      })
                : a;
            },
          },
          pseudos: {
            not: le(function (e) {
              var r = [],
                i = [],
                s = f(e.replace($, "$1"));
              return s[S]
                ? le(function (e, t, n, r) {
                    var i,
                      o = s(e, null, r, []),
                      a = e.length;
                    while (a--) (i = o[a]) && (e[a] = !(t[a] = i));
                  })
                : function (e, t, n) {
                    return (
                      (r[0] = e), s(r, null, n, i), (r[0] = null), !i.pop()
                    );
                  };
            }),
            has: le(function (t) {
              return function (e) {
                return 0 < se(t, e).length;
              };
            }),
            contains: le(function (t) {
              return (
                (t = t.replace(te, ne)),
                function (e) {
                  return -1 < (e.textContent || o(e)).indexOf(t);
                }
              );
            }),
            lang: le(function (n) {
              return (
                V.test(n || "") || se.error("unsupported lang: " + n),
                (n = n.replace(te, ne).toLowerCase()),
                function (e) {
                  var t;
                  do {
                    if (
                      (t = E
                        ? e.lang
                        : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                    )
                      return (
                        (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                      );
                  } while ((e = e.parentNode) && 1 === e.nodeType);
                  return !1;
                }
              );
            }),
            target: function (e) {
              var t = n.location && n.location.hash;
              return t && t.slice(1) === e.id;
            },
            root: function (e) {
              return e === a;
            },
            focus: function (e) {
              return (
                e === C.activeElement &&
                (!C.hasFocus || C.hasFocus()) &&
                !!(e.type || e.href || ~e.tabIndex)
              );
            },
            enabled: ge(!1),
            disabled: ge(!0),
            checked: function (e) {
              var t = e.nodeName.toLowerCase();
              return (
                ("input" === t && !!e.checked) ||
                ("option" === t && !!e.selected)
              );
            },
            selected: function (e) {
              return (
                e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
              );
            },
            empty: function (e) {
              for (e = e.firstChild; e; e = e.nextSibling)
                if (e.nodeType < 6) return !1;
              return !0;
            },
            parent: function (e) {
              return !b.pseudos.empty(e);
            },
            header: function (e) {
              return J.test(e.nodeName);
            },
            input: function (e) {
              return Q.test(e.nodeName);
            },
            button: function (e) {
              var t = e.nodeName.toLowerCase();
              return ("input" === t && "button" === e.type) || "button" === t;
            },
            text: function (e) {
              var t;
              return (
                "input" === e.nodeName.toLowerCase() &&
                "text" === e.type &&
                (null == (t = e.getAttribute("type")) ||
                  "text" === t.toLowerCase())
              );
            },
            first: ve(function () {
              return [0];
            }),
            last: ve(function (e, t) {
              return [t - 1];
            }),
            eq: ve(function (e, t, n) {
              return [n < 0 ? n + t : n];
            }),
            even: ve(function (e, t) {
              for (var n = 0; n < t; n += 2) e.push(n);
              return e;
            }),
            odd: ve(function (e, t) {
              for (var n = 1; n < t; n += 2) e.push(n);
              return e;
            }),
            lt: ve(function (e, t, n) {
              for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; ) e.push(r);
              return e;
            }),
            gt: ve(function (e, t, n) {
              for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
              return e;
            }),
          },
        }).pseudos.nth = b.pseudos.eq),
      {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0,
      }))
        b.pseudos[e] = de(e);
      for (e in {
        submit: !0,
        reset: !0,
      })
        b.pseudos[e] = he(e);

      function me() {}

      function xe(e) {
        for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
        return r;
      }

      function be(s, e, t) {
        var u = e.dir,
          l = e.next,
          c = l || u,
          f = t && "parentNode" === c,
          p = r++;
        return e.first
          ? function (e, t, n) {
              while ((e = e[u])) if (1 === e.nodeType || f) return s(e, t, n);
              return !1;
            }
          : function (e, t, n) {
              var r,
                i,
                o,
                a = [k, p];
              if (n) {
                while ((e = e[u]))
                  if ((1 === e.nodeType || f) && s(e, t, n)) return !0;
              } else
                while ((e = e[u]))
                  if (1 === e.nodeType || f)
                    if (
                      ((i =
                        (o = e[S] || (e[S] = {}))[e.uniqueID] ||
                        (o[e.uniqueID] = {})),
                      l && l === e.nodeName.toLowerCase())
                    )
                      e = e[u] || e;
                    else {
                      if ((r = i[c]) && r[0] === k && r[1] === p)
                        return (a[2] = r[2]);
                      if (((i[c] = a)[2] = s(e, t, n))) return !0;
                    }
              return !1;
            };
      }

      function we(i) {
        return 1 < i.length
          ? function (e, t, n) {
              var r = i.length;
              while (r--) if (!i[r](e, t, n)) return !1;
              return !0;
            }
          : i[0];
      }

      function Te(e, t, n, r, i) {
        for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
          (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), l && t.push(s)));
        return a;
      }

      function Ce(d, h, g, v, y, e) {
        return (
          v && !v[S] && (v = Ce(v)),
          y && !y[S] && (y = Ce(y, e)),
          le(function (e, t, n, r) {
            var i,
              o,
              a,
              s = [],
              u = [],
              l = t.length,
              c =
                e ||
                (function (e, t, n) {
                  for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
                  return n;
                })(h || "*", n.nodeType ? [n] : n, []),
              f = !d || (!e && h) ? c : Te(c, s, d, n, r),
              p = g ? (y || (e ? d : l || v) ? [] : t) : f;
            if ((g && g(f, p, n, r), v)) {
              (i = Te(p, u)), v(i, [], n, r), (o = i.length);
              while (o--) (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
            }
            if (e) {
              if (y || d) {
                if (y) {
                  (i = []), (o = p.length);
                  while (o--) (a = p[o]) && i.push((f[o] = a));
                  y(null, (p = []), i, r);
                }
                o = p.length;
                while (o--)
                  (a = p[o]) &&
                    -1 < (i = y ? P(e, a) : s[o]) &&
                    (e[i] = !(t[i] = a));
              }
            } else (p = Te(p === t ? p.splice(l, p.length) : p)), y ? y(null, t, p, r) : H.apply(t, p);
          })
        );
      }

      function Ee(e) {
        for (
          var i,
            t,
            n,
            r = e.length,
            o = b.relative[e[0].type],
            a = o || b.relative[" "],
            s = o ? 1 : 0,
            u = be(
              function (e) {
                return e === i;
              },
              a,
              !0
            ),
            l = be(
              function (e) {
                return -1 < P(i, e);
              },
              a,
              !0
            ),
            c = [
              function (e, t, n) {
                var r =
                  (!o && (n || t !== w)) ||
                  ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
                return (i = null), r;
              },
            ];
          s < r;
          s++
        )
          if ((t = b.relative[e[s].type])) c = [be(we(c), t)];
          else {
            if ((t = b.filter[e[s].type].apply(null, e[s].matches))[S]) {
              for (n = ++s; n < r; n++) if (b.relative[e[n].type]) break;
              return Ce(
                1 < s && we(c),
                1 < s &&
                  xe(
                    e.slice(0, s - 1).concat({
                      value: " " === e[s - 2].type ? "*" : "",
                    })
                  ).replace($, "$1"),
                t,
                s < n && Ee(e.slice(s, n)),
                n < r && Ee((e = e.slice(n))),
                n < r && xe(e)
              );
            }
            c.push(t);
          }
        return we(c);
      }
      return (
        (me.prototype = b.filters = b.pseudos),
        (b.setFilters = new me()),
        (h = se.tokenize =
          function (e, t) {
            var n,
              r,
              i,
              o,
              a,
              s,
              u,
              l = x[e + " "];
            if (l) return t ? 0 : l.slice(0);
            (a = e), (s = []), (u = b.preFilter);
            while (a) {
              for (o in ((n && !(r = _.exec(a))) ||
                (r && (a = a.slice(r[0].length) || a), s.push((i = []))),
              (n = !1),
              (r = z.exec(a)) &&
                ((n = r.shift()),
                i.push({
                  value: n,
                  type: r[0].replace($, " "),
                }),
                (a = a.slice(n.length))),
              b.filter))
                !(r = G[o].exec(a)) ||
                  (u[o] && !(r = u[o](r))) ||
                  ((n = r.shift()),
                  i.push({
                    value: n,
                    type: o,
                    matches: r,
                  }),
                  (a = a.slice(n.length)));
              if (!n) break;
            }
            return t ? a.length : a ? se.error(e) : x(e, s).slice(0);
          }),
        (f = se.compile =
          function (e, t) {
            var n,
              v,
              y,
              m,
              x,
              r,
              i = [],
              o = [],
              a = A[e + " "];
            if (!a) {
              t || (t = h(e)), (n = t.length);
              while (n--) (a = Ee(t[n]))[S] ? i.push(a) : o.push(a);
              (a = A(
                e,
                ((v = o),
                (m = 0 < (y = i).length),
                (x = 0 < v.length),
                (r = function (e, t, n, r, i) {
                  var o,
                    a,
                    s,
                    u = 0,
                    l = "0",
                    c = e && [],
                    f = [],
                    p = w,
                    d = e || (x && b.find.TAG("*", i)),
                    h = (k += null == p ? 1 : Math.random() || 0.1),
                    g = d.length;
                  for (
                    i && (w = t == C || t || i);
                    l !== g && null != (o = d[l]);
                    l++
                  ) {
                    if (x && o) {
                      (a = 0), t || o.ownerDocument == C || (T(o), (n = !E));
                      while ((s = v[a++]))
                        if (s(o, t || C, n)) {
                          r.push(o);
                          break;
                        }
                      i && (k = h);
                    }
                    m && ((o = !s && o) && u--, e && c.push(o));
                  }
                  if (((u += l), m && l !== u)) {
                    a = 0;
                    while ((s = y[a++])) s(c, f, t, n);
                    if (e) {
                      if (0 < u) while (l--) c[l] || f[l] || (f[l] = q.call(r));
                      f = Te(f);
                    }
                    H.apply(r, f),
                      i &&
                        !e &&
                        0 < f.length &&
                        1 < u + y.length &&
                        se.uniqueSort(r);
                  }
                  return i && ((k = h), (w = p)), c;
                }),
                m ? le(r) : r)
              )).selector = e;
            }
            return a;
          }),
        (g = se.select =
          function (e, t, n, r) {
            var i,
              o,
              a,
              s,
              u,
              l = "function" == typeof e && e,
              c = !r && h((e = l.selector || e));
            if (((n = n || []), 1 === c.length)) {
              if (
                2 < (o = c[0] = c[0].slice(0)).length &&
                "ID" === (a = o[0]).type &&
                9 === t.nodeType &&
                E &&
                b.relative[o[1].type]
              ) {
                if (
                  !(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0])
                )
                  return n;
                l && (t = t.parentNode), (e = e.slice(o.shift().value.length));
              }
              i = G.needsContext.test(e) ? 0 : o.length;
              while (i--) {
                if (((a = o[i]), b.relative[(s = a.type)])) break;
                if (
                  (u = b.find[s]) &&
                  (r = u(
                    a.matches[0].replace(te, ne),
                    (ee.test(o[0].type) && ye(t.parentNode)) || t
                  ))
                ) {
                  if ((o.splice(i, 1), !(e = r.length && xe(o))))
                    return H.apply(n, r), n;
                  break;
                }
              }
            }
            return (
              (l || f(e, c))(
                r,
                t,
                !E,
                n,
                !t || (ee.test(e) && ye(t.parentNode)) || t
              ),
              n
            );
          }),
        (d.sortStable = S.split("").sort(j).join("") === S),
        (d.detectDuplicates = !!l),
        T(),
        (d.sortDetached = ce(function (e) {
          return 1 & e.compareDocumentPosition(C.createElement("fieldset"));
        })),
        ce(function (e) {
          return (
            (e.innerHTML = "<a href='#'></a>"),
            "#" === e.firstChild.getAttribute("href")
          );
        }) ||
          fe("type|href|height|width", function (e, t, n) {
            if (!n)
              return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
          }),
        (d.attributes &&
          ce(function (e) {
            return (
              (e.innerHTML = "<input/>"),
              e.firstChild.setAttribute("value", ""),
              "" === e.firstChild.getAttribute("value")
            );
          })) ||
          fe("value", function (e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
              return e.defaultValue;
          }),
        ce(function (e) {
          return null == e.getAttribute("disabled");
        }) ||
          fe(R, function (e, t, n) {
            var r;
            if (!n)
              return !0 === e[t]
                ? t.toLowerCase()
                : (r = e.getAttributeNode(t)) && r.specified
                ? r.value
                : null;
          }),
        se
      );
    })(C);
    (S.find = d),
      (S.expr = d.selectors),
      (S.expr[":"] = S.expr.pseudos),
      (S.uniqueSort = S.unique = d.uniqueSort),
      (S.text = d.getText),
      (S.isXMLDoc = d.isXML),
      (S.contains = d.contains),
      (S.escapeSelector = d.escape);
    var h = function (e, t, n) {
        var r = [],
          i = void 0 !== n;
        while ((e = e[t]) && 9 !== e.nodeType)
          if (1 === e.nodeType) {
            if (i && S(e).is(n)) break;
            r.push(e);
          }
        return r;
      },
      T = function (e, t) {
        for (var n = []; e; e = e.nextSibling)
          1 === e.nodeType && e !== t && n.push(e);
        return n;
      },
      k = S.expr.match.needsContext;

    function A(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    }
    var N = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

    function j(e, n, r) {
      return m(n)
        ? S.grep(e, function (e, t) {
            return !!n.call(e, t, e) !== r;
          })
        : n.nodeType
        ? S.grep(e, function (e) {
            return (e === n) !== r;
          })
        : "string" != typeof n
        ? S.grep(e, function (e) {
            return -1 < i.call(n, e) !== r;
          })
        : S.filter(n, e, r);
    }
    (S.filter = function (e, t, n) {
      var r = t[0];
      return (
        n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType
          ? S.find.matchesSelector(r, e)
            ? [r]
            : []
          : S.find.matches(
              e,
              S.grep(t, function (e) {
                return 1 === e.nodeType;
              })
            )
      );
    }),
      S.fn.extend({
        find: function (e) {
          var t,
            n,
            r = this.length,
            i = this;
          if ("string" != typeof e)
            return this.pushStack(
              S(e).filter(function () {
                for (t = 0; t < r; t++) if (S.contains(i[t], this)) return !0;
              })
            );
          for (n = this.pushStack([]), t = 0; t < r; t++) S.find(e, i[t], n);
          return 1 < r ? S.uniqueSort(n) : n;
        },
        filter: function (e) {
          return this.pushStack(j(this, e || [], !1));
        },
        not: function (e) {
          return this.pushStack(j(this, e || [], !0));
        },
        is: function (e) {
          return !!j(
            this,
            "string" == typeof e && k.test(e) ? S(e) : e || [],
            !1
          ).length;
        },
      });
    var D,
      q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    ((S.fn.init = function (e, t, n) {
      var r, i;
      if (!e) return this;
      if (((n = n || D), "string" == typeof e)) {
        if (
          !(r =
            "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length
              ? [null, e, null]
              : q.exec(e)) ||
          (!r[1] && t)
        )
          return !t || t.jquery
            ? (t || n).find(e)
            : this.constructor(t).find(e);
        if (r[1]) {
          if (
            ((t = t instanceof S ? t[0] : t),
            S.merge(
              this,
              S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)
            ),
            N.test(r[1]) && S.isPlainObject(t))
          )
            for (r in t) m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
          return this;
        }
        return (
          (i = E.getElementById(r[2])) && ((this[0] = i), (this.length = 1)),
          this
        );
      }
      return e.nodeType
        ? ((this[0] = e), (this.length = 1), this)
        : m(e)
        ? void 0 !== n.ready
          ? n.ready(e)
          : e(S)
        : S.makeArray(e, this);
    }).prototype = S.fn),
      (D = S(E));
    var L = /^(?:parents|prev(?:Until|All))/,
      H = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0,
      };

    function O(e, t) {
      while ((e = e[t]) && 1 !== e.nodeType);
      return e;
    }
    S.fn.extend({
      has: function (e) {
        var t = S(e, this),
          n = t.length;
        return this.filter(function () {
          for (var e = 0; e < n; e++) if (S.contains(this, t[e])) return !0;
        });
      },
      closest: function (e, t) {
        var n,
          r = 0,
          i = this.length,
          o = [],
          a = "string" != typeof e && S(e);
        if (!k.test(e))
          for (; r < i; r++)
            for (n = this[r]; n && n !== t; n = n.parentNode)
              if (
                n.nodeType < 11 &&
                (a
                  ? -1 < a.index(n)
                  : 1 === n.nodeType && S.find.matchesSelector(n, e))
              ) {
                o.push(n);
                break;
              }
        return this.pushStack(1 < o.length ? S.uniqueSort(o) : o);
      },
      index: function (e) {
        return e
          ? "string" == typeof e
            ? i.call(S(e), this[0])
            : i.call(this, e.jquery ? e[0] : e)
          : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      },
      add: function (e, t) {
        return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
      },
      addBack: function (e) {
        return this.add(
          null == e ? this.prevObject : this.prevObject.filter(e)
        );
      },
    }),
      S.each(
        {
          parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null;
          },
          parents: function (e) {
            return h(e, "parentNode");
          },
          parentsUntil: function (e, t, n) {
            return h(e, "parentNode", n);
          },
          next: function (e) {
            return O(e, "nextSibling");
          },
          prev: function (e) {
            return O(e, "previousSibling");
          },
          nextAll: function (e) {
            return h(e, "nextSibling");
          },
          prevAll: function (e) {
            return h(e, "previousSibling");
          },
          nextUntil: function (e, t, n) {
            return h(e, "nextSibling", n);
          },
          prevUntil: function (e, t, n) {
            return h(e, "previousSibling", n);
          },
          siblings: function (e) {
            return T((e.parentNode || {}).firstChild, e);
          },
          children: function (e) {
            return T(e.firstChild);
          },
          contents: function (e) {
            return null != e.contentDocument && r(e.contentDocument)
              ? e.contentDocument
              : (A(e, "template") && (e = e.content || e),
                S.merge([], e.childNodes));
          },
        },
        function (r, i) {
          S.fn[r] = function (e, t) {
            var n = S.map(this, i, e);
            return (
              "Until" !== r.slice(-5) && (t = e),
              t && "string" == typeof t && (n = S.filter(t, n)),
              1 < this.length &&
                (H[r] || S.uniqueSort(n), L.test(r) && n.reverse()),
              this.pushStack(n)
            );
          };
        }
      );
    var P = /[^\x20\t\r\n\f]+/g;

    function R(e) {
      return e;
    }

    function M(e) {
      throw e;
    }

    function I(e, t, n, r) {
      var i;
      try {
        e && m((i = e.promise))
          ? i.call(e).done(t).fail(n)
          : e && m((i = e.then))
          ? i.call(e, t, n)
          : t.apply(void 0, [e].slice(r));
      } catch (e) {
        n.apply(void 0, [e]);
      }
    }
    (S.Callbacks = function (r) {
      var e, n;
      r =
        "string" == typeof r
          ? ((e = r),
            (n = {}),
            S.each(e.match(P) || [], function (e, t) {
              n[t] = !0;
            }),
            n)
          : S.extend({}, r);
      var i,
        t,
        o,
        a,
        s = [],
        u = [],
        l = -1,
        c = function () {
          for (a = a || r.once, o = i = !0; u.length; l = -1) {
            t = u.shift();
            while (++l < s.length)
              !1 === s[l].apply(t[0], t[1]) &&
                r.stopOnFalse &&
                ((l = s.length), (t = !1));
          }
          r.memory || (t = !1), (i = !1), a && (s = t ? [] : "");
        },
        f = {
          add: function () {
            return (
              s &&
                (t && !i && ((l = s.length - 1), u.push(t)),
                (function n(e) {
                  S.each(e, function (e, t) {
                    m(t)
                      ? (r.unique && f.has(t)) || s.push(t)
                      : t && t.length && "string" !== w(t) && n(t);
                  });
                })(arguments),
                t && !i && c()),
              this
            );
          },
          remove: function () {
            return (
              S.each(arguments, function (e, t) {
                var n;
                while (-1 < (n = S.inArray(t, s, n)))
                  s.splice(n, 1), n <= l && l--;
              }),
              this
            );
          },
          has: function (e) {
            return e ? -1 < S.inArray(e, s) : 0 < s.length;
          },
          empty: function () {
            return s && (s = []), this;
          },
          disable: function () {
            return (a = u = []), (s = t = ""), this;
          },
          disabled: function () {
            return !s;
          },
          lock: function () {
            return (a = u = []), t || i || (s = t = ""), this;
          },
          locked: function () {
            return !!a;
          },
          fireWith: function (e, t) {
            return (
              a ||
                ((t = [e, (t = t || []).slice ? t.slice() : t]),
                u.push(t),
                i || c()),
              this
            );
          },
          fire: function () {
            return f.fireWith(this, arguments), this;
          },
          fired: function () {
            return !!o;
          },
        };
      return f;
    }),
      S.extend({
        Deferred: function (e) {
          var o = [
              [
                "notify",
                "progress",
                S.Callbacks("memory"),
                S.Callbacks("memory"),
                2,
              ],
              [
                "resolve",
                "done",
                S.Callbacks("once memory"),
                S.Callbacks("once memory"),
                0,
                "resolved",
              ],
              [
                "reject",
                "fail",
                S.Callbacks("once memory"),
                S.Callbacks("once memory"),
                1,
                "rejected",
              ],
            ],
            i = "pending",
            a = {
              state: function () {
                return i;
              },
              always: function () {
                return s.done(arguments).fail(arguments), this;
              },
              catch: function (e) {
                return a.then(null, e);
              },
              pipe: function () {
                var i = arguments;
                return S.Deferred(function (r) {
                  S.each(o, function (e, t) {
                    var n = m(i[t[4]]) && i[t[4]];
                    s[t[1]](function () {
                      var e = n && n.apply(this, arguments);
                      e && m(e.promise)
                        ? e
                            .promise()
                            .progress(r.notify)
                            .done(r.resolve)
                            .fail(r.reject)
                        : r[t[0] + "With"](this, n ? [e] : arguments);
                    });
                  }),
                    (i = null);
                }).promise();
              },
              then: function (t, n, r) {
                var u = 0;

                function l(i, o, a, s) {
                  return function () {
                    var n = this,
                      r = arguments,
                      e = function () {
                        var e, t;
                        if (!(i < u)) {
                          if ((e = a.apply(n, r)) === o.promise())
                            throw new TypeError("Thenable self-resolution");
                          (t =
                            e &&
                            ("object" == typeof e || "function" == typeof e) &&
                            e.then),
                            m(t)
                              ? s
                                ? t.call(e, l(u, o, R, s), l(u, o, M, s))
                                : (u++,
                                  t.call(
                                    e,
                                    l(u, o, R, s),
                                    l(u, o, M, s),
                                    l(u, o, R, o.notifyWith)
                                  ))
                              : (a !== R && ((n = void 0), (r = [e])),
                                (s || o.resolveWith)(n, r));
                        }
                      },
                      t = s
                        ? e
                        : function () {
                            try {
                              e();
                            } catch (e) {
                              S.Deferred.exceptionHook &&
                                S.Deferred.exceptionHook(e, t.stackTrace),
                                u <= i + 1 &&
                                  (a !== M && ((n = void 0), (r = [e])),
                                  o.rejectWith(n, r));
                            }
                          };
                    i
                      ? t()
                      : (S.Deferred.getStackHook &&
                          (t.stackTrace = S.Deferred.getStackHook()),
                        C.setTimeout(t));
                  };
                }
                return S.Deferred(function (e) {
                  o[0][3].add(l(0, e, m(r) ? r : R, e.notifyWith)),
                    o[1][3].add(l(0, e, m(t) ? t : R)),
                    o[2][3].add(l(0, e, m(n) ? n : M));
                }).promise();
              },
              promise: function (e) {
                return null != e ? S.extend(e, a) : a;
              },
            },
            s = {};
          return (
            S.each(o, function (e, t) {
              var n = t[2],
                r = t[5];
              (a[t[1]] = n.add),
                r &&
                  n.add(
                    function () {
                      i = r;
                    },
                    o[3 - e][2].disable,
                    o[3 - e][3].disable,
                    o[0][2].lock,
                    o[0][3].lock
                  ),
                n.add(t[3].fire),
                (s[t[0]] = function () {
                  return (
                    s[t[0] + "With"](this === s ? void 0 : this, arguments),
                    this
                  );
                }),
                (s[t[0] + "With"] = n.fireWith);
            }),
            a.promise(s),
            e && e.call(s, s),
            s
          );
        },
        when: function (e) {
          var n = arguments.length,
            t = n,
            r = Array(t),
            i = s.call(arguments),
            o = S.Deferred(),
            a = function (t) {
              return function (e) {
                (r[t] = this),
                  (i[t] = 1 < arguments.length ? s.call(arguments) : e),
                  --n || o.resolveWith(r, i);
              };
            };
          if (
            n <= 1 &&
            (I(e, o.done(a(t)).resolve, o.reject, !n),
            "pending" === o.state() || m(i[t] && i[t].then))
          )
            return o.then();
          while (t--) I(i[t], a(t), o.reject);
          return o.promise();
        },
      });
    var W = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    (S.Deferred.exceptionHook = function (e, t) {
      C.console &&
        C.console.warn &&
        e &&
        W.test(e.name) &&
        C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
    }),
      (S.readyException = function (e) {
        C.setTimeout(function () {
          throw e;
        });
      });
    var F = S.Deferred();

    function B() {
      E.removeEventListener("DOMContentLoaded", B),
        C.removeEventListener("load", B),
        S.ready();
    }
    (S.fn.ready = function (e) {
      return (
        F.then(e)["catch"](function (e) {
          S.readyException(e);
        }),
        this
      );
    }),
      S.extend({
        isReady: !1,
        readyWait: 1,
        ready: function (e) {
          (!0 === e ? --S.readyWait : S.isReady) ||
            ((S.isReady = !0) !== e && 0 < --S.readyWait) ||
            F.resolveWith(E, [S]);
        },
      }),
      (S.ready.then = F.then),
      "complete" === E.readyState ||
      ("loading" !== E.readyState && !E.documentElement.doScroll)
        ? C.setTimeout(S.ready)
        : (E.addEventListener("DOMContentLoaded", B),
          C.addEventListener("load", B));
    var $ = function (e, t, n, r, i, o, a) {
        var s = 0,
          u = e.length,
          l = null == n;
        if ("object" === w(n))
          for (s in ((i = !0), n)) $(e, t, s, n[s], !0, o, a);
        else if (
          void 0 !== r &&
          ((i = !0),
          m(r) || (a = !0),
          l &&
            (a
              ? (t.call(e, r), (t = null))
              : ((l = t),
                (t = function (e, t, n) {
                  return l.call(S(e), n);
                }))),
          t)
        )
          for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
      },
      _ = /^-ms-/,
      z = /-([a-z])/g;

    function U(e, t) {
      return t.toUpperCase();
    }

    function X(e) {
      return e.replace(_, "ms-").replace(z, U);
    }
    var V = function (e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    };

    function G() {
      this.expando = S.expando + G.uid++;
    }
    (G.uid = 1),
      (G.prototype = {
        cache: function (e) {
          var t = e[this.expando];
          return (
            t ||
              ((t = {}),
              V(e) &&
                (e.nodeType
                  ? (e[this.expando] = t)
                  : Object.defineProperty(e, this.expando, {
                      value: t,
                      configurable: !0,
                    }))),
            t
          );
        },
        set: function (e, t, n) {
          var r,
            i = this.cache(e);
          if ("string" == typeof t) i[X(t)] = n;
          else for (r in t) i[X(r)] = t[r];
          return i;
        },
        get: function (e, t) {
          return void 0 === t
            ? this.cache(e)
            : e[this.expando] && e[this.expando][X(t)];
        },
        access: function (e, t, n) {
          return void 0 === t || (t && "string" == typeof t && void 0 === n)
            ? this.get(e, t)
            : (this.set(e, t, n), void 0 !== n ? n : t);
        },
        remove: function (e, t) {
          var n,
            r = e[this.expando];
          if (void 0 !== r) {
            if (void 0 !== t) {
              n = (t = Array.isArray(t)
                ? t.map(X)
                : (t = X(t)) in r
                ? [t]
                : t.match(P) || []).length;
              while (n--) delete r[t[n]];
            }
            (void 0 === t || S.isEmptyObject(r)) &&
              (e.nodeType
                ? (e[this.expando] = void 0)
                : delete e[this.expando]);
          }
        },
        hasData: function (e) {
          var t = e[this.expando];
          return void 0 !== t && !S.isEmptyObject(t);
        },
      });
    var Y = new G(),
      Q = new G(),
      J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      K = /[A-Z]/g;

    function Z(e, t, n) {
      var r, i;
      if (void 0 === n && 1 === e.nodeType)
        if (
          ((r = "data-" + t.replace(K, "-$&").toLowerCase()),
          "string" == typeof (n = e.getAttribute(r)))
        ) {
          try {
            n =
              "true" === (i = n) ||
              ("false" !== i &&
                ("null" === i
                  ? null
                  : i === +i + ""
                  ? +i
                  : J.test(i)
                  ? JSON.parse(i)
                  : i));
          } catch (e) {}
          Q.set(e, t, n);
        } else n = void 0;
      return n;
    }
    S.extend({
      hasData: function (e) {
        return Q.hasData(e) || Y.hasData(e);
      },
      data: function (e, t, n) {
        return Q.access(e, t, n);
      },
      removeData: function (e, t) {
        Q.remove(e, t);
      },
      _data: function (e, t, n) {
        return Y.access(e, t, n);
      },
      _removeData: function (e, t) {
        Y.remove(e, t);
      },
    }),
      S.fn.extend({
        data: function (n, e) {
          var t,
            r,
            i,
            o = this[0],
            a = o && o.attributes;
          if (void 0 === n) {
            if (
              this.length &&
              ((i = Q.get(o)), 1 === o.nodeType && !Y.get(o, "hasDataAttrs"))
            ) {
              t = a.length;
              while (t--)
                a[t] &&
                  0 === (r = a[t].name).indexOf("data-") &&
                  ((r = X(r.slice(5))), Z(o, r, i[r]));
              Y.set(o, "hasDataAttrs", !0);
            }
            return i;
          }
          return "object" == typeof n
            ? this.each(function () {
                Q.set(this, n);
              })
            : $(
                this,
                function (e) {
                  var t;
                  if (o && void 0 === e)
                    return void 0 !== (t = Q.get(o, n))
                      ? t
                      : void 0 !== (t = Z(o, n))
                      ? t
                      : void 0;
                  this.each(function () {
                    Q.set(this, n, e);
                  });
                },
                null,
                e,
                1 < arguments.length,
                null,
                !0
              );
        },
        removeData: function (e) {
          return this.each(function () {
            Q.remove(this, e);
          });
        },
      }),
      S.extend({
        queue: function (e, t, n) {
          var r;
          if (e)
            return (
              (t = (t || "fx") + "queue"),
              (r = Y.get(e, t)),
              n &&
                (!r || Array.isArray(n)
                  ? (r = Y.access(e, t, S.makeArray(n)))
                  : r.push(n)),
              r || []
            );
        },
        dequeue: function (e, t) {
          t = t || "fx";
          var n = S.queue(e, t),
            r = n.length,
            i = n.shift(),
            o = S._queueHooks(e, t);
          "inprogress" === i && ((i = n.shift()), r--),
            i &&
              ("fx" === t && n.unshift("inprogress"),
              delete o.stop,
              i.call(
                e,
                function () {
                  S.dequeue(e, t);
                },
                o
              )),
            !r && o && o.empty.fire();
        },
        _queueHooks: function (e, t) {
          var n = t + "queueHooks";
          return (
            Y.get(e, n) ||
            Y.access(e, n, {
              empty: S.Callbacks("once memory").add(function () {
                Y.remove(e, [t + "queue", n]);
              }),
            })
          );
        },
      }),
      S.fn.extend({
        queue: function (t, n) {
          var e = 2;
          return (
            "string" != typeof t && ((n = t), (t = "fx"), e--),
            arguments.length < e
              ? S.queue(this[0], t)
              : void 0 === n
              ? this
              : this.each(function () {
                  var e = S.queue(this, t, n);
                  S._queueHooks(this, t),
                    "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t);
                })
          );
        },
        dequeue: function (e) {
          return this.each(function () {
            S.dequeue(this, e);
          });
        },
        clearQueue: function (e) {
          return this.queue(e || "fx", []);
        },
        promise: function (e, t) {
          var n,
            r = 1,
            i = S.Deferred(),
            o = this,
            a = this.length,
            s = function () {
              --r || i.resolveWith(o, [o]);
            };
          "string" != typeof e && ((t = e), (e = void 0)), (e = e || "fx");
          while (a--)
            (n = Y.get(o[a], e + "queueHooks")) &&
              n.empty &&
              (r++, n.empty.add(s));
          return s(), i.promise(t);
        },
      });
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$", "i"),
      ne = ["Top", "Right", "Bottom", "Left"],
      re = E.documentElement,
      ie = function (e) {
        return S.contains(e.ownerDocument, e);
      },
      oe = {
        composed: !0,
      };
    re.getRootNode &&
      (ie = function (e) {
        return (
          S.contains(e.ownerDocument, e) ||
          e.getRootNode(oe) === e.ownerDocument
        );
      });
    var ae = function (e, t) {
      return (
        "none" === (e = t || e).style.display ||
        ("" === e.style.display && ie(e) && "none" === S.css(e, "display"))
      );
    };

    function se(e, t, n, r) {
      var i,
        o,
        a = 20,
        s = r
          ? function () {
              return r.cur();
            }
          : function () {
              return S.css(e, t, "");
            },
        u = s(),
        l = (n && n[3]) || (S.cssNumber[t] ? "" : "px"),
        c =
          e.nodeType &&
          (S.cssNumber[t] || ("px" !== l && +u)) &&
          te.exec(S.css(e, t));
      if (c && c[3] !== l) {
        (u /= 2), (l = l || c[3]), (c = +u || 1);
        while (a--)
          S.style(e, t, c + l),
            (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0),
            (c /= o);
        (c *= 2), S.style(e, t, c + l), (n = n || []);
      }
      return (
        n &&
          ((c = +c || +u || 0),
          (i = n[1] ? c + (n[1] + 1) * n[2] : +n[2]),
          r && ((r.unit = l), (r.start = c), (r.end = i))),
        i
      );
    }
    var ue = {};

    function le(e, t) {
      for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
        (r = e[c]).style &&
          ((n = r.style.display),
          t
            ? ("none" === n &&
                ((l[c] = Y.get(r, "display") || null),
                l[c] || (r.style.display = "")),
              "" === r.style.display &&
                ae(r) &&
                (l[c] =
                  ((u = a = o = void 0),
                  (a = (i = r).ownerDocument),
                  (s = i.nodeName),
                  (u = ue[s]) ||
                    ((o = a.body.appendChild(a.createElement(s))),
                    (u = S.css(o, "display")),
                    o.parentNode.removeChild(o),
                    "none" === u && (u = "block"),
                    (ue[s] = u)))))
            : "none" !== n && ((l[c] = "none"), Y.set(r, "display", n)));
      for (c = 0; c < f; c++) null != l[c] && (e[c].style.display = l[c]);
      return e;
    }
    S.fn.extend({
      show: function () {
        return le(this, !0);
      },
      hide: function () {
        return le(this);
      },
      toggle: function (e) {
        return "boolean" == typeof e
          ? e
            ? this.show()
            : this.hide()
          : this.each(function () {
              ae(this) ? S(this).show() : S(this).hide();
            });
      },
    });
    var ce,
      fe,
      pe = /^(?:checkbox|radio)$/i,
      de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
      he = /^$|^module$|\/(?:java|ecma)script/i;
    (ce = E.createDocumentFragment().appendChild(E.createElement("div"))),
      (fe = E.createElement("input")).setAttribute("type", "radio"),
      fe.setAttribute("checked", "checked"),
      fe.setAttribute("name", "t"),
      ce.appendChild(fe),
      (y.checkClone = ce.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (ce.innerHTML = "<textarea>x</textarea>"),
      (y.noCloneChecked = !!ce.cloneNode(!0).lastChild.defaultValue),
      (ce.innerHTML = "<option></option>"),
      (y.option = !!ce.lastChild);
    var ge = {
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""],
    };

    function ve(e, t) {
      var n;
      return (
        (n =
          "undefined" != typeof e.getElementsByTagName
            ? e.getElementsByTagName(t || "*")
            : "undefined" != typeof e.querySelectorAll
            ? e.querySelectorAll(t || "*")
            : []),
        void 0 === t || (t && A(e, t)) ? S.merge([e], n) : n
      );
    }

    function ye(e, t) {
      for (var n = 0, r = e.length; n < r; n++)
        Y.set(e[n], "globalEval", !t || Y.get(t[n], "globalEval"));
    }
    (ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead),
      (ge.th = ge.td),
      y.option ||
        (ge.optgroup = ge.option =
          [1, "<select multiple='multiple'>", "</select>"]);
    var me = /<|&#?\w+;/;

    function xe(e, t, n, r, i) {
      for (
        var o,
          a,
          s,
          u,
          l,
          c,
          f = t.createDocumentFragment(),
          p = [],
          d = 0,
          h = e.length;
        d < h;
        d++
      )
        if ((o = e[d]) || 0 === o)
          if ("object" === w(o)) S.merge(p, o.nodeType ? [o] : o);
          else if (me.test(o)) {
            (a = a || f.appendChild(t.createElement("div"))),
              (s = (de.exec(o) || ["", ""])[1].toLowerCase()),
              (u = ge[s] || ge._default),
              (a.innerHTML = u[1] + S.htmlPrefilter(o) + u[2]),
              (c = u[0]);
            while (c--) a = a.lastChild;
            S.merge(p, a.childNodes), ((a = f.firstChild).textContent = "");
          } else p.push(t.createTextNode(o));
      (f.textContent = ""), (d = 0);
      while ((o = p[d++]))
        if (r && -1 < S.inArray(o, r)) i && i.push(o);
        else if (
          ((l = ie(o)), (a = ve(f.appendChild(o), "script")), l && ye(a), n)
        ) {
          c = 0;
          while ((o = a[c++])) he.test(o.type || "") && n.push(o);
        }
      return f;
    }
    var be = /^([^.]*)(?:\.(.+)|)/;

    function we() {
      return !0;
    }

    function Te() {
      return !1;
    }

    function Ce(e, t) {
      return (
        (e ===
          (function () {
            try {
              return E.activeElement;
            } catch (e) {}
          })()) ==
        ("focus" === t)
      );
    }

    function Ee(e, t, n, r, i, o) {
      var a, s;
      if ("object" == typeof t) {
        for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), t))
          Ee(e, s, n, r, t[s], o);
        return e;
      }
      if (
        (null == r && null == i
          ? ((i = n), (r = n = void 0))
          : null == i &&
            ("string" == typeof n
              ? ((i = r), (r = void 0))
              : ((i = r), (r = n), (n = void 0))),
        !1 === i)
      )
        i = Te;
      else if (!i) return e;
      return (
        1 === o &&
          ((a = i),
          ((i = function (e) {
            return S().off(e), a.apply(this, arguments);
          }).guid = a.guid || (a.guid = S.guid++))),
        e.each(function () {
          S.event.add(this, t, i, r, n);
        })
      );
    }

    function Se(e, i, o) {
      o
        ? (Y.set(e, i, !1),
          S.event.add(e, i, {
            namespace: !1,
            handler: function (e) {
              var t,
                n,
                r = Y.get(this, i);
              if (1 & e.isTrigger && this[i]) {
                if (r.length)
                  (S.event.special[i] || {}).delegateType &&
                    e.stopPropagation();
                else if (
                  ((r = s.call(arguments)),
                  Y.set(this, i, r),
                  (t = o(this, i)),
                  this[i](),
                  r !== (n = Y.get(this, i)) || t
                    ? Y.set(this, i, !1)
                    : (n = {}),
                  r !== n)
                )
                  return (
                    e.stopImmediatePropagation(),
                    e.preventDefault(),
                    n && n.value
                  );
              } else
                r.length &&
                  (Y.set(this, i, {
                    value: S.event.trigger(
                      S.extend(r[0], S.Event.prototype),
                      r.slice(1),
                      this
                    ),
                  }),
                  e.stopImmediatePropagation());
            },
          }))
        : void 0 === Y.get(e, i) && S.event.add(e, i, we);
    }
    (S.event = {
      global: {},
      add: function (t, e, n, r, i) {
        var o,
          a,
          s,
          u,
          l,
          c,
          f,
          p,
          d,
          h,
          g,
          v = Y.get(t);
        if (V(t)) {
          n.handler && ((n = (o = n).handler), (i = o.selector)),
            i && S.find.matchesSelector(re, i),
            n.guid || (n.guid = S.guid++),
            (u = v.events) || (u = v.events = Object.create(null)),
            (a = v.handle) ||
              (a = v.handle =
                function (e) {
                  return "undefined" != typeof S && S.event.triggered !== e.type
                    ? S.event.dispatch.apply(t, arguments)
                    : void 0;
                }),
            (l = (e = (e || "").match(P) || [""]).length);
          while (l--)
            (d = g = (s = be.exec(e[l]) || [])[1]),
              (h = (s[2] || "").split(".").sort()),
              d &&
                ((f = S.event.special[d] || {}),
                (d = (i ? f.delegateType : f.bindType) || d),
                (f = S.event.special[d] || {}),
                (c = S.extend(
                  {
                    type: d,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && S.expr.match.needsContext.test(i),
                    namespace: h.join("."),
                  },
                  o
                )),
                (p = u[d]) ||
                  (((p = u[d] = []).delegateCount = 0),
                  (f.setup && !1 !== f.setup.call(t, r, h, a)) ||
                    (t.addEventListener && t.addEventListener(d, a))),
                f.add &&
                  (f.add.call(t, c),
                  c.handler.guid || (c.handler.guid = n.guid)),
                i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                (S.event.global[d] = !0));
        }
      },
      remove: function (e, t, n, r, i) {
        var o,
          a,
          s,
          u,
          l,
          c,
          f,
          p,
          d,
          h,
          g,
          v = Y.hasData(e) && Y.get(e);
        if (v && (u = v.events)) {
          l = (t = (t || "").match(P) || [""]).length;
          while (l--)
            if (
              ((d = g = (s = be.exec(t[l]) || [])[1]),
              (h = (s[2] || "").split(".").sort()),
              d)
            ) {
              (f = S.event.special[d] || {}),
                (p = u[(d = (r ? f.delegateType : f.bindType) || d)] || []),
                (s =
                  s[2] &&
                  new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)")),
                (a = o = p.length);
              while (o--)
                (c = p[o]),
                  (!i && g !== c.origType) ||
                    (n && n.guid !== c.guid) ||
                    (s && !s.test(c.namespace)) ||
                    (r && r !== c.selector && ("**" !== r || !c.selector)) ||
                    (p.splice(o, 1),
                    c.selector && p.delegateCount--,
                    f.remove && f.remove.call(e, c));
              a &&
                !p.length &&
                ((f.teardown && !1 !== f.teardown.call(e, h, v.handle)) ||
                  S.removeEvent(e, d, v.handle),
                delete u[d]);
            } else for (d in u) S.event.remove(e, d + t[l], n, r, !0);
          S.isEmptyObject(u) && Y.remove(e, "handle events");
        }
      },
      dispatch: function (e) {
        var t,
          n,
          r,
          i,
          o,
          a,
          s = new Array(arguments.length),
          u = S.event.fix(e),
          l = (Y.get(this, "events") || Object.create(null))[u.type] || [],
          c = S.event.special[u.type] || {};
        for (s[0] = u, t = 1; t < arguments.length; t++) s[t] = arguments[t];
        if (
          ((u.delegateTarget = this),
          !c.preDispatch || !1 !== c.preDispatch.call(this, u))
        ) {
          (a = S.event.handlers.call(this, u, l)), (t = 0);
          while ((i = a[t++]) && !u.isPropagationStopped()) {
            (u.currentTarget = i.elem), (n = 0);
            while ((o = i.handlers[n++]) && !u.isImmediatePropagationStopped())
              (u.rnamespace &&
                !1 !== o.namespace &&
                !u.rnamespace.test(o.namespace)) ||
                ((u.handleObj = o),
                (u.data = o.data),
                void 0 !==
                  (r = (
                    (S.event.special[o.origType] || {}).handle || o.handler
                  ).apply(i.elem, s)) &&
                  !1 === (u.result = r) &&
                  (u.preventDefault(), u.stopPropagation()));
          }
          return c.postDispatch && c.postDispatch.call(this, u), u.result;
        }
      },
      handlers: function (e, t) {
        var n,
          r,
          i,
          o,
          a,
          s = [],
          u = t.delegateCount,
          l = e.target;
        if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
          for (; l !== this; l = l.parentNode || this)
            if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
              for (o = [], a = {}, n = 0; n < u; n++)
                void 0 === a[(i = (r = t[n]).selector + " ")] &&
                  (a[i] = r.needsContext
                    ? -1 < S(i, this).index(l)
                    : S.find(i, this, null, [l]).length),
                  a[i] && o.push(r);
              o.length &&
                s.push({
                  elem: l,
                  handlers: o,
                });
            }
        return (
          (l = this),
          u < t.length &&
            s.push({
              elem: l,
              handlers: t.slice(u),
            }),
          s
        );
      },
      addProp: function (t, e) {
        Object.defineProperty(S.Event.prototype, t, {
          enumerable: !0,
          configurable: !0,
          get: m(e)
            ? function () {
                if (this.originalEvent) return e(this.originalEvent);
              }
            : function () {
                if (this.originalEvent) return this.originalEvent[t];
              },
          set: function (e) {
            Object.defineProperty(this, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: e,
            });
          },
        });
      },
      fix: function (e) {
        return e[S.expando] ? e : new S.Event(e);
      },
      special: {
        load: {
          noBubble: !0,
        },
        click: {
          setup: function (e) {
            var t = this || e;
            return (
              pe.test(t.type) && t.click && A(t, "input") && Se(t, "click", we),
              !1
            );
          },
          trigger: function (e) {
            var t = this || e;
            return (
              pe.test(t.type) && t.click && A(t, "input") && Se(t, "click"), !0
            );
          },
          _default: function (e) {
            var t = e.target;
            return (
              (pe.test(t.type) &&
                t.click &&
                A(t, "input") &&
                Y.get(t, "click")) ||
              A(t, "a")
            );
          },
        },
        beforeunload: {
          postDispatch: function (e) {
            void 0 !== e.result &&
              e.originalEvent &&
              (e.originalEvent.returnValue = e.result);
          },
        },
      },
    }),
      (S.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n);
      }),
      (S.Event = function (e, t) {
        if (!(this instanceof S.Event)) return new S.Event(e, t);
        e && e.type
          ? ((this.originalEvent = e),
            (this.type = e.type),
            (this.isDefaultPrevented =
              e.defaultPrevented ||
              (void 0 === e.defaultPrevented && !1 === e.returnValue)
                ? we
                : Te),
            (this.target =
              e.target && 3 === e.target.nodeType
                ? e.target.parentNode
                : e.target),
            (this.currentTarget = e.currentTarget),
            (this.relatedTarget = e.relatedTarget))
          : (this.type = e),
          t && S.extend(this, t),
          (this.timeStamp = (e && e.timeStamp) || Date.now()),
          (this[S.expando] = !0);
      }),
      (S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: Te,
        isPropagationStopped: Te,
        isImmediatePropagationStopped: Te,
        isSimulated: !1,
        preventDefault: function () {
          var e = this.originalEvent;
          (this.isDefaultPrevented = we),
            e && !this.isSimulated && e.preventDefault();
        },
        stopPropagation: function () {
          var e = this.originalEvent;
          (this.isPropagationStopped = we),
            e && !this.isSimulated && e.stopPropagation();
        },
        stopImmediatePropagation: function () {
          var e = this.originalEvent;
          (this.isImmediatePropagationStopped = we),
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation();
        },
      }),
      S.each(
        {
          altKey: !0,
          bubbles: !0,
          cancelable: !0,
          changedTouches: !0,
          ctrlKey: !0,
          detail: !0,
          eventPhase: !0,
          metaKey: !0,
          pageX: !0,
          pageY: !0,
          shiftKey: !0,
          view: !0,
          char: !0,
          code: !0,
          charCode: !0,
          key: !0,
          keyCode: !0,
          button: !0,
          buttons: !0,
          clientX: !0,
          clientY: !0,
          offsetX: !0,
          offsetY: !0,
          pointerId: !0,
          pointerType: !0,
          screenX: !0,
          screenY: !0,
          targetTouches: !0,
          toElement: !0,
          touches: !0,
          which: !0,
        },
        S.event.addProp
      ),
      S.each(
        {
          focus: "focusin",
          blur: "focusout",
        },
        function (e, t) {
          S.event.special[e] = {
            setup: function () {
              return Se(this, e, Ce), !1;
            },
            trigger: function () {
              return Se(this, e), !0;
            },
            _default: function () {
              return !0;
            },
            delegateType: t,
          };
        }
      ),
      S.each(
        {
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout",
        },
        function (e, i) {
          S.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function (e) {
              var t,
                n = e.relatedTarget,
                r = e.handleObj;
              return (
                (n && (n === this || S.contains(this, n))) ||
                  ((e.type = r.origType),
                  (t = r.handler.apply(this, arguments)),
                  (e.type = i)),
                t
              );
            },
          };
        }
      ),
      S.fn.extend({
        on: function (e, t, n, r) {
          return Ee(this, e, t, n, r);
        },
        one: function (e, t, n, r) {
          return Ee(this, e, t, n, r, 1);
        },
        off: function (e, t, n) {
          var r, i;
          if (e && e.preventDefault && e.handleObj)
            return (
              (r = e.handleObj),
              S(e.delegateTarget).off(
                r.namespace ? r.origType + "." + r.namespace : r.origType,
                r.selector,
                r.handler
              ),
              this
            );
          if ("object" == typeof e) {
            for (i in e) this.off(i, t, e[i]);
            return this;
          }
          return (
            (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
            !1 === n && (n = Te),
            this.each(function () {
              S.event.remove(this, e, n, t);
            })
          );
        },
      });
    var ke = /<script|<style|<link/i,
      Ae = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Ne = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function je(e, t) {
      return (
        (A(e, "table") &&
          A(11 !== t.nodeType ? t : t.firstChild, "tr") &&
          S(e).children("tbody")[0]) ||
        e
      );
    }

    function De(e) {
      return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
    }

    function qe(e) {
      return (
        "true/" === (e.type || "").slice(0, 5)
          ? (e.type = e.type.slice(5))
          : e.removeAttribute("type"),
        e
      );
    }

    function Le(e, t) {
      var n, r, i, o, a, s;
      if (1 === t.nodeType) {
        if (Y.hasData(e) && (s = Y.get(e).events))
          for (i in (Y.remove(t, "handle events"), s))
            for (n = 0, r = s[i].length; n < r; n++) S.event.add(t, i, s[i][n]);
        Q.hasData(e) && ((o = Q.access(e)), (a = S.extend({}, o)), Q.set(t, a));
      }
    }

    function He(n, r, i, o) {
      r = g(r);
      var e,
        t,
        a,
        s,
        u,
        l,
        c = 0,
        f = n.length,
        p = f - 1,
        d = r[0],
        h = m(d);
      if (h || (1 < f && "string" == typeof d && !y.checkClone && Ae.test(d)))
        return n.each(function (e) {
          var t = n.eq(e);
          h && (r[0] = d.call(this, e, t.html())), He(t, r, i, o);
        });
      if (
        f &&
        ((t = (e = xe(r, n[0].ownerDocument, !1, n, o)).firstChild),
        1 === e.childNodes.length && (e = t),
        t || o)
      ) {
        for (s = (a = S.map(ve(e, "script"), De)).length; c < f; c++)
          (u = e),
            c !== p &&
              ((u = S.clone(u, !0, !0)), s && S.merge(a, ve(u, "script"))),
            i.call(n[c], u, c);
        if (s)
          for (
            l = a[a.length - 1].ownerDocument, S.map(a, qe), c = 0;
            c < s;
            c++
          )
            (u = a[c]),
              he.test(u.type || "") &&
                !Y.access(u, "globalEval") &&
                S.contains(l, u) &&
                (u.src && "module" !== (u.type || "").toLowerCase()
                  ? S._evalUrl &&
                    !u.noModule &&
                    S._evalUrl(
                      u.src,
                      {
                        nonce: u.nonce || u.getAttribute("nonce"),
                      },
                      l
                    )
                  : b(u.textContent.replace(Ne, ""), u, l));
      }
      return n;
    }

    function Oe(e, t, n) {
      for (var r, i = t ? S.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
        n || 1 !== r.nodeType || S.cleanData(ve(r)),
          r.parentNode &&
            (n && ie(r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
      return e;
    }
    S.extend({
      htmlPrefilter: function (e) {
        return e;
      },
      clone: function (e, t, n) {
        var r,
          i,
          o,
          a,
          s,
          u,
          l,
          c = e.cloneNode(!0),
          f = ie(e);
        if (
          !(
            y.noCloneChecked ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            S.isXMLDoc(e)
          )
        )
          for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++)
            (s = o[r]),
              (u = a[r]),
              void 0,
              "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type)
                ? (u.checked = s.checked)
                : ("input" !== l && "textarea" !== l) ||
                  (u.defaultValue = s.defaultValue);
        if (t)
          if (n)
            for (
              o = o || ve(e), a = a || ve(c), r = 0, i = o.length;
              r < i;
              r++
            )
              Le(o[r], a[r]);
          else Le(e, c);
        return (
          0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c
        );
      },
      cleanData: function (e) {
        for (
          var t, n, r, i = S.event.special, o = 0;
          void 0 !== (n = e[o]);
          o++
        )
          if (V(n)) {
            if ((t = n[Y.expando])) {
              if (t.events)
                for (r in t.events)
                  i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
              n[Y.expando] = void 0;
            }
            n[Q.expando] && (n[Q.expando] = void 0);
          }
      },
    }),
      S.fn.extend({
        detach: function (e) {
          return Oe(this, e, !0);
        },
        remove: function (e) {
          return Oe(this, e);
        },
        text: function (e) {
          return $(
            this,
            function (e) {
              return void 0 === e
                ? S.text(this)
                : this.empty().each(function () {
                    (1 !== this.nodeType &&
                      11 !== this.nodeType &&
                      9 !== this.nodeType) ||
                      (this.textContent = e);
                  });
            },
            null,
            e,
            arguments.length
          );
        },
        append: function () {
          return He(this, arguments, function (e) {
            (1 !== this.nodeType &&
              11 !== this.nodeType &&
              9 !== this.nodeType) ||
              je(this, e).appendChild(e);
          });
        },
        prepend: function () {
          return He(this, arguments, function (e) {
            if (
              1 === this.nodeType ||
              11 === this.nodeType ||
              9 === this.nodeType
            ) {
              var t = je(this, e);
              t.insertBefore(e, t.firstChild);
            }
          });
        },
        before: function () {
          return He(this, arguments, function (e) {
            this.parentNode && this.parentNode.insertBefore(e, this);
          });
        },
        after: function () {
          return He(this, arguments, function (e) {
            this.parentNode &&
              this.parentNode.insertBefore(e, this.nextSibling);
          });
        },
        empty: function () {
          for (var e, t = 0; null != (e = this[t]); t++)
            1 === e.nodeType && (S.cleanData(ve(e, !1)), (e.textContent = ""));
          return this;
        },
        clone: function (e, t) {
          return (
            (e = null != e && e),
            (t = null == t ? e : t),
            this.map(function () {
              return S.clone(this, e, t);
            })
          );
        },
        html: function (e) {
          return $(
            this,
            function (e) {
              var t = this[0] || {},
                n = 0,
                r = this.length;
              if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
              if (
                "string" == typeof e &&
                !ke.test(e) &&
                !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]
              ) {
                e = S.htmlPrefilter(e);
                try {
                  for (; n < r; n++)
                    1 === (t = this[n] || {}).nodeType &&
                      (S.cleanData(ve(t, !1)), (t.innerHTML = e));
                  t = 0;
                } catch (e) {}
              }
              t && this.empty().append(e);
            },
            null,
            e,
            arguments.length
          );
        },
        replaceWith: function () {
          var n = [];
          return He(
            this,
            arguments,
            function (e) {
              var t = this.parentNode;
              S.inArray(this, n) < 0 &&
                (S.cleanData(ve(this)), t && t.replaceChild(e, this));
            },
            n
          );
        },
      }),
      S.each(
        {
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith",
        },
        function (e, a) {
          S.fn[e] = function (e) {
            for (var t, n = [], r = S(e), i = r.length - 1, o = 0; o <= i; o++)
              (t = o === i ? this : this.clone(!0)),
                S(r[o])[a](t),
                u.apply(n, t.get());
            return this.pushStack(n);
          };
        }
      );
    var Pe = new RegExp("^(" + ee + ")(?!px)[a-z%]+$", "i"),
      Re = function (e) {
        var t = e.ownerDocument.defaultView;
        return (t && t.opener) || (t = C), t.getComputedStyle(e);
      },
      Me = function (e, t, n) {
        var r,
          i,
          o = {};
        for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
        for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
        return r;
      },
      Ie = new RegExp(ne.join("|"), "i");

    function We(e, t, n) {
      var r,
        i,
        o,
        a,
        s = e.style;
      return (
        (n = n || Re(e)) &&
          ("" !== (a = n.getPropertyValue(t) || n[t]) ||
            ie(e) ||
            (a = S.style(e, t)),
          !y.pixelBoxStyles() &&
            Pe.test(a) &&
            Ie.test(t) &&
            ((r = s.width),
            (i = s.minWidth),
            (o = s.maxWidth),
            (s.minWidth = s.maxWidth = s.width = a),
            (a = n.width),
            (s.width = r),
            (s.minWidth = i),
            (s.maxWidth = o))),
        void 0 !== a ? a + "" : a
      );
    }

    function Fe(e, t) {
      return {
        get: function () {
          if (!e()) return (this.get = t).apply(this, arguments);
          delete this.get;
        },
      };
    }
    !(function () {
      function e() {
        if (l) {
          (u.style.cssText =
            "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
            (l.style.cssText =
              "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
            re.appendChild(u).appendChild(l);
          var e = C.getComputedStyle(l);
          (n = "1%" !== e.top),
            (s = 12 === t(e.marginLeft)),
            (l.style.right = "60%"),
            (o = 36 === t(e.right)),
            (r = 36 === t(e.width)),
            (l.style.position = "absolute"),
            (i = 12 === t(l.offsetWidth / 3)),
            re.removeChild(u),
            (l = null);
        }
      }

      function t(e) {
        return Math.round(parseFloat(e));
      }
      var n,
        r,
        i,
        o,
        a,
        s,
        u = E.createElement("div"),
        l = E.createElement("div");
      l.style &&
        ((l.style.backgroundClip = "content-box"),
        (l.cloneNode(!0).style.backgroundClip = ""),
        (y.clearCloneStyle = "content-box" === l.style.backgroundClip),
        S.extend(y, {
          boxSizingReliable: function () {
            return e(), r;
          },
          pixelBoxStyles: function () {
            return e(), o;
          },
          pixelPosition: function () {
            return e(), n;
          },
          reliableMarginLeft: function () {
            return e(), s;
          },
          scrollboxSize: function () {
            return e(), i;
          },
          reliableTrDimensions: function () {
            var e, t, n, r;
            return (
              null == a &&
                ((e = E.createElement("table")),
                (t = E.createElement("tr")),
                (n = E.createElement("div")),
                (e.style.cssText =
                  "position:absolute;left:-11111px;border-collapse:separate"),
                (t.style.cssText = "border:1px solid"),
                (t.style.height = "1px"),
                (n.style.height = "9px"),
                (n.style.display = "block"),
                re.appendChild(e).appendChild(t).appendChild(n),
                (r = C.getComputedStyle(t)),
                (a =
                  parseInt(r.height, 10) +
                    parseInt(r.borderTopWidth, 10) +
                    parseInt(r.borderBottomWidth, 10) ===
                  t.offsetHeight),
                re.removeChild(e)),
              a
            );
          },
        }));
    })();
    var Be = ["Webkit", "Moz", "ms"],
      $e = E.createElement("div").style,
      _e = {};

    function ze(e) {
      var t = S.cssProps[e] || _e[e];
      return (
        t ||
        (e in $e
          ? e
          : (_e[e] =
              (function (e) {
                var t = e[0].toUpperCase() + e.slice(1),
                  n = Be.length;
                while (n--) if ((e = Be[n] + t) in $e) return e;
              })(e) || e))
      );
    }
    var Ue = /^(none|table(?!-c[ea]).+)/,
      Xe = /^--/,
      Ve = {
        position: "absolute",
        visibility: "hidden",
        display: "block",
      },
      Ge = {
        letterSpacing: "0",
        fontWeight: "400",
      };

    function Ye(e, t, n) {
      var r = te.exec(t);
      return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
    }

    function Qe(e, t, n, r, i, o) {
      var a = "width" === t ? 1 : 0,
        s = 0,
        u = 0;
      if (n === (r ? "border" : "content")) return 0;
      for (; a < 4; a += 2)
        "margin" === n && (u += S.css(e, n + ne[a], !0, i)),
          r
            ? ("content" === n && (u -= S.css(e, "padding" + ne[a], !0, i)),
              "margin" !== n &&
                (u -= S.css(e, "border" + ne[a] + "Width", !0, i)))
            : ((u += S.css(e, "padding" + ne[a], !0, i)),
              "padding" !== n
                ? (u += S.css(e, "border" + ne[a] + "Width", !0, i))
                : (s += S.css(e, "border" + ne[a] + "Width", !0, i)));
      return (
        !r &&
          0 <= o &&
          (u +=
            Math.max(
              0,
              Math.ceil(
                e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5
              )
            ) || 0),
        u
      );
    }

    function Je(e, t, n) {
      var r = Re(e),
        i =
          (!y.boxSizingReliable() || n) &&
          "border-box" === S.css(e, "boxSizing", !1, r),
        o = i,
        a = We(e, t, r),
        s = "offset" + t[0].toUpperCase() + t.slice(1);
      if (Pe.test(a)) {
        if (!n) return a;
        a = "auto";
      }
      return (
        ((!y.boxSizingReliable() && i) ||
          (!y.reliableTrDimensions() && A(e, "tr")) ||
          "auto" === a ||
          (!parseFloat(a) && "inline" === S.css(e, "display", !1, r))) &&
          e.getClientRects().length &&
          ((i = "border-box" === S.css(e, "boxSizing", !1, r)),
          (o = s in e) && (a = e[s])),
        (a = parseFloat(a) || 0) +
          Qe(e, t, n || (i ? "border" : "content"), o, r, a) +
          "px"
      );
    }

    function Ke(e, t, n, r, i) {
      return new Ke.prototype.init(e, t, n, r, i);
    }
    S.extend({
      cssHooks: {
        opacity: {
          get: function (e, t) {
            if (t) {
              var n = We(e, "opacity");
              return "" === n ? "1" : n;
            }
          },
        },
      },
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        gridArea: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnStart: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowStart: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
      },
      cssProps: {},
      style: function (e, t, n, r) {
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
          var i,
            o,
            a,
            s = X(t),
            u = Xe.test(t),
            l = e.style;
          if (
            (u || (t = ze(s)),
            (a = S.cssHooks[t] || S.cssHooks[s]),
            void 0 === n)
          )
            return a && "get" in a && void 0 !== (i = a.get(e, !1, r))
              ? i
              : l[t];
          "string" === (o = typeof n) &&
            (i = te.exec(n)) &&
            i[1] &&
            ((n = se(e, t, i)), (o = "number")),
            null != n &&
              n == n &&
              ("number" !== o ||
                u ||
                (n += (i && i[3]) || (S.cssNumber[s] ? "" : "px")),
              y.clearCloneStyle ||
                "" !== n ||
                0 !== t.indexOf("background") ||
                (l[t] = "inherit"),
              (a && "set" in a && void 0 === (n = a.set(e, n, r))) ||
                (u ? l.setProperty(t, n) : (l[t] = n)));
        }
      },
      css: function (e, t, n, r) {
        var i,
          o,
          a,
          s = X(t);
        return (
          Xe.test(t) || (t = ze(s)),
          (a = S.cssHooks[t] || S.cssHooks[s]) &&
            "get" in a &&
            (i = a.get(e, !0, n)),
          void 0 === i && (i = We(e, t, r)),
          "normal" === i && t in Ge && (i = Ge[t]),
          "" === n || n
            ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
            : i
        );
      },
    }),
      S.each(["height", "width"], function (e, u) {
        S.cssHooks[u] = {
          get: function (e, t, n) {
            if (t)
              return !Ue.test(S.css(e, "display")) ||
                (e.getClientRects().length && e.getBoundingClientRect().width)
                ? Je(e, u, n)
                : Me(e, Ve, function () {
                    return Je(e, u, n);
                  });
          },
          set: function (e, t, n) {
            var r,
              i = Re(e),
              o = !y.scrollboxSize() && "absolute" === i.position,
              a = (o || n) && "border-box" === S.css(e, "boxSizing", !1, i),
              s = n ? Qe(e, u, n, a, i) : 0;
            return (
              a &&
                o &&
                (s -= Math.ceil(
                  e["offset" + u[0].toUpperCase() + u.slice(1)] -
                    parseFloat(i[u]) -
                    Qe(e, u, "border", !1, i) -
                    0.5
                )),
              s &&
                (r = te.exec(t)) &&
                "px" !== (r[3] || "px") &&
                ((e.style[u] = t), (t = S.css(e, u))),
              Ye(0, t, s)
            );
          },
        };
      }),
      (S.cssHooks.marginLeft = Fe(y.reliableMarginLeft, function (e, t) {
        if (t)
          return (
            (parseFloat(We(e, "marginLeft")) ||
              e.getBoundingClientRect().left -
                Me(
                  e,
                  {
                    marginLeft: 0,
                  },
                  function () {
                    return e.getBoundingClientRect().left;
                  }
                )) + "px"
          );
      })),
      S.each(
        {
          margin: "",
          padding: "",
          border: "Width",
        },
        function (i, o) {
          (S.cssHooks[i + o] = {
            expand: function (e) {
              for (
                var t = 0,
                  n = {},
                  r = "string" == typeof e ? e.split(" ") : [e];
                t < 4;
                t++
              )
                n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
              return n;
            },
          }),
            "margin" !== i && (S.cssHooks[i + o].set = Ye);
        }
      ),
      S.fn.extend({
        css: function (e, t) {
          return $(
            this,
            function (e, t, n) {
              var r,
                i,
                o = {},
                a = 0;
              if (Array.isArray(t)) {
                for (r = Re(e), i = t.length; a < i; a++)
                  o[t[a]] = S.css(e, t[a], !1, r);
                return o;
              }
              return void 0 !== n ? S.style(e, t, n) : S.css(e, t);
            },
            e,
            t,
            1 < arguments.length
          );
        },
      }),
      (((S.Tween = Ke).prototype = {
        constructor: Ke,
        init: function (e, t, n, r, i, o) {
          (this.elem = e),
            (this.prop = n),
            (this.easing = i || S.easing._default),
            (this.options = t),
            (this.start = this.now = this.cur()),
            (this.end = r),
            (this.unit = o || (S.cssNumber[n] ? "" : "px"));
        },
        cur: function () {
          var e = Ke.propHooks[this.prop];
          return e && e.get ? e.get(this) : Ke.propHooks._default.get(this);
        },
        run: function (e) {
          var t,
            n = Ke.propHooks[this.prop];
          return (
            this.options.duration
              ? (this.pos = t =
                  S.easing[this.easing](
                    e,
                    this.options.duration * e,
                    0,
                    1,
                    this.options.duration
                  ))
              : (this.pos = t = e),
            (this.now = (this.end - this.start) * t + this.start),
            this.options.step &&
              this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : Ke.propHooks._default.set(this),
            this
          );
        },
      }).init.prototype = Ke.prototype),
      ((Ke.propHooks = {
        _default: {
          get: function (e) {
            var t;
            return 1 !== e.elem.nodeType ||
              (null != e.elem[e.prop] && null == e.elem.style[e.prop])
              ? e.elem[e.prop]
              : (t = S.css(e.elem, e.prop, "")) && "auto" !== t
              ? t
              : 0;
          },
          set: function (e) {
            S.fx.step[e.prop]
              ? S.fx.step[e.prop](e)
              : 1 !== e.elem.nodeType ||
                (!S.cssHooks[e.prop] && null == e.elem.style[ze(e.prop)])
              ? (e.elem[e.prop] = e.now)
              : S.style(e.elem, e.prop, e.now + e.unit);
          },
        },
      }).scrollTop = Ke.propHooks.scrollLeft =
        {
          set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
          },
        }),
      (S.easing = {
        linear: function (e) {
          return e;
        },
        swing: function (e) {
          return 0.5 - Math.cos(e * Math.PI) / 2;
        },
        _default: "swing",
      }),
      (S.fx = Ke.prototype.init),
      (S.fx.step = {});
    var Ze,
      et,
      tt,
      nt,
      rt = /^(?:toggle|show|hide)$/,
      it = /queueHooks$/;

    function ot() {
      et &&
        (!1 === E.hidden && C.requestAnimationFrame
          ? C.requestAnimationFrame(ot)
          : C.setTimeout(ot, S.fx.interval),
        S.fx.tick());
    }

    function at() {
      return (
        C.setTimeout(function () {
          Ze = void 0;
        }),
        (Ze = Date.now())
      );
    }

    function st(e, t) {
      var n,
        r = 0,
        i = {
          height: e,
        };
      for (t = t ? 1 : 0; r < 4; r += 2 - t)
        i["margin" + (n = ne[r])] = i["padding" + n] = e;
      return t && (i.opacity = i.width = e), i;
    }

    function ut(e, t, n) {
      for (
        var r,
          i = (lt.tweeners[t] || []).concat(lt.tweeners["*"]),
          o = 0,
          a = i.length;
        o < a;
        o++
      )
        if ((r = i[o].call(n, t, e))) return r;
    }

    function lt(o, e, t) {
      var n,
        a,
        r = 0,
        i = lt.prefilters.length,
        s = S.Deferred().always(function () {
          delete u.elem;
        }),
        u = function () {
          if (a) return !1;
          for (
            var e = Ze || at(),
              t = Math.max(0, l.startTime + l.duration - e),
              n = 1 - (t / l.duration || 0),
              r = 0,
              i = l.tweens.length;
            r < i;
            r++
          )
            l.tweens[r].run(n);
          return (
            s.notifyWith(o, [l, n, t]),
            n < 1 && i
              ? t
              : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1)
          );
        },
        l = s.promise({
          elem: o,
          props: S.extend({}, e),
          opts: S.extend(
            !0,
            {
              specialEasing: {},
              easing: S.easing._default,
            },
            t
          ),
          originalProperties: e,
          originalOptions: t,
          startTime: Ze || at(),
          duration: t.duration,
          tweens: [],
          createTween: function (e, t) {
            var n = S.Tween(
              o,
              l.opts,
              e,
              t,
              l.opts.specialEasing[e] || l.opts.easing
            );
            return l.tweens.push(n), n;
          },
          stop: function (e) {
            var t = 0,
              n = e ? l.tweens.length : 0;
            if (a) return this;
            for (a = !0; t < n; t++) l.tweens[t].run(1);
            return (
              e
                ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e]))
                : s.rejectWith(o, [l, e]),
              this
            );
          },
        }),
        c = l.props;
      for (
        !(function (e, t) {
          var n, r, i, o, a;
          for (n in e)
            if (
              ((i = t[(r = X(n))]),
              (o = e[n]),
              Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
              n !== r && ((e[r] = o), delete e[n]),
              (a = S.cssHooks[r]) && ("expand" in a))
            )
              for (n in ((o = a.expand(o)), delete e[r], o))
                (n in e) || ((e[n] = o[n]), (t[n] = i));
            else t[r] = i;
        })(c, l.opts.specialEasing);
        r < i;
        r++
      )
        if ((n = lt.prefilters[r].call(l, o, c, l.opts)))
          return (
            m(n.stop) &&
              (S._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)),
            n
          );
      return (
        S.map(c, ut, l),
        m(l.opts.start) && l.opts.start.call(o, l),
        l
          .progress(l.opts.progress)
          .done(l.opts.done, l.opts.complete)
          .fail(l.opts.fail)
          .always(l.opts.always),
        S.fx.timer(
          S.extend(u, {
            elem: o,
            anim: l,
            queue: l.opts.queue,
          })
        ),
        l
      );
    }
    (S.Animation = S.extend(lt, {
      tweeners: {
        "*": [
          function (e, t) {
            var n = this.createTween(e, t);
            return se(n.elem, e, te.exec(t), n), n;
          },
        ],
      },
      tweener: function (e, t) {
        m(e) ? ((t = e), (e = ["*"])) : (e = e.match(P));
        for (var n, r = 0, i = e.length; r < i; r++)
          (n = e[r]),
            (lt.tweeners[n] = lt.tweeners[n] || []),
            lt.tweeners[n].unshift(t);
      },
      prefilters: [
        function (e, t, n) {
          var r,
            i,
            o,
            a,
            s,
            u,
            l,
            c,
            f = "width" in t || "height" in t,
            p = this,
            d = {},
            h = e.style,
            g = e.nodeType && ae(e),
            v = Y.get(e, "fxshow");
          for (r in (n.queue ||
            (null == (a = S._queueHooks(e, "fx")).unqueued &&
              ((a.unqueued = 0),
              (s = a.empty.fire),
              (a.empty.fire = function () {
                a.unqueued || s();
              })),
            a.unqueued++,
            p.always(function () {
              p.always(function () {
                a.unqueued--, S.queue(e, "fx").length || a.empty.fire();
              });
            })),
          t))
            if (((i = t[r]), rt.test(i))) {
              if (
                (delete t[r],
                (o = o || "toggle" === i),
                i === (g ? "hide" : "show"))
              ) {
                if ("show" !== i || !v || void 0 === v[r]) continue;
                g = !0;
              }
              d[r] = (v && v[r]) || S.style(e, r);
            }
          if ((u = !S.isEmptyObject(t)) || !S.isEmptyObject(d))
            for (r in (f &&
              1 === e.nodeType &&
              ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
              null == (l = v && v.display) && (l = Y.get(e, "display")),
              "none" === (c = S.css(e, "display")) &&
                (l
                  ? (c = l)
                  : (le([e], !0),
                    (l = e.style.display || l),
                    (c = S.css(e, "display")),
                    le([e]))),
              ("inline" === c || ("inline-block" === c && null != l)) &&
                "none" === S.css(e, "float") &&
                (u ||
                  (p.done(function () {
                    h.display = l;
                  }),
                  null == l && ((c = h.display), (l = "none" === c ? "" : c))),
                (h.display = "inline-block"))),
            n.overflow &&
              ((h.overflow = "hidden"),
              p.always(function () {
                (h.overflow = n.overflow[0]),
                  (h.overflowX = n.overflow[1]),
                  (h.overflowY = n.overflow[2]);
              })),
            (u = !1),
            d))
              u ||
                (v
                  ? "hidden" in v && (g = v.hidden)
                  : (v = Y.access(e, "fxshow", {
                      display: l,
                    })),
                o && (v.hidden = !g),
                g && le([e], !0),
                p.done(function () {
                  for (r in (g || le([e]), Y.remove(e, "fxshow"), d))
                    S.style(e, r, d[r]);
                })),
                (u = ut(g ? v[r] : 0, r, p)),
                r in v ||
                  ((v[r] = u.start), g && ((u.end = u.start), (u.start = 0)));
        },
      ],
      prefilter: function (e, t) {
        t ? lt.prefilters.unshift(e) : lt.prefilters.push(e);
      },
    })),
      (S.speed = function (e, t, n) {
        var r =
          e && "object" == typeof e
            ? S.extend({}, e)
            : {
                complete: n || (!n && t) || (m(e) && e),
                duration: e,
                easing: (n && t) || (t && !m(t) && t),
              };
        return (
          S.fx.off
            ? (r.duration = 0)
            : "number" != typeof r.duration &&
              (r.duration in S.fx.speeds
                ? (r.duration = S.fx.speeds[r.duration])
                : (r.duration = S.fx.speeds._default)),
          (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
          (r.old = r.complete),
          (r.complete = function () {
            m(r.old) && r.old.call(this), r.queue && S.dequeue(this, r.queue);
          }),
          r
        );
      }),
      S.fn.extend({
        fadeTo: function (e, t, n, r) {
          return this.filter(ae).css("opacity", 0).show().end().animate(
            {
              opacity: t,
            },
            e,
            n,
            r
          );
        },
        animate: function (t, e, n, r) {
          var i = S.isEmptyObject(t),
            o = S.speed(e, n, r),
            a = function () {
              var e = lt(this, S.extend({}, t), o);
              (i || Y.get(this, "finish")) && e.stop(!0);
            };
          return (
            (a.finish = a),
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
          );
        },
        stop: function (i, e, o) {
          var a = function (e) {
            var t = e.stop;
            delete e.stop, t(o);
          };
          return (
            "string" != typeof i && ((o = e), (e = i), (i = void 0)),
            e && this.queue(i || "fx", []),
            this.each(function () {
              var e = !0,
                t = null != i && i + "queueHooks",
                n = S.timers,
                r = Y.get(this);
              if (t) r[t] && r[t].stop && a(r[t]);
              else for (t in r) r[t] && r[t].stop && it.test(t) && a(r[t]);
              for (t = n.length; t--; )
                n[t].elem !== this ||
                  (null != i && n[t].queue !== i) ||
                  (n[t].anim.stop(o), (e = !1), n.splice(t, 1));
              (!e && o) || S.dequeue(this, i);
            })
          );
        },
        finish: function (a) {
          return (
            !1 !== a && (a = a || "fx"),
            this.each(function () {
              var e,
                t = Y.get(this),
                n = t[a + "queue"],
                r = t[a + "queueHooks"],
                i = S.timers,
                o = n ? n.length : 0;
              for (
                t.finish = !0,
                  S.queue(this, a, []),
                  r && r.stop && r.stop.call(this, !0),
                  e = i.length;
                e--;

              )
                i[e].elem === this &&
                  i[e].queue === a &&
                  (i[e].anim.stop(!0), i.splice(e, 1));
              for (e = 0; e < o; e++)
                n[e] && n[e].finish && n[e].finish.call(this);
              delete t.finish;
            })
          );
        },
      }),
      S.each(["toggle", "show", "hide"], function (e, r) {
        var i = S.fn[r];
        S.fn[r] = function (e, t, n) {
          return null == e || "boolean" == typeof e
            ? i.apply(this, arguments)
            : this.animate(st(r, !0), e, t, n);
        };
      }),
      S.each(
        {
          slideDown: st("show"),
          slideUp: st("hide"),
          slideToggle: st("toggle"),
          fadeIn: {
            opacity: "show",
          },
          fadeOut: {
            opacity: "hide",
          },
          fadeToggle: {
            opacity: "toggle",
          },
        },
        function (e, r) {
          S.fn[e] = function (e, t, n) {
            return this.animate(r, e, t, n);
          };
        }
      ),
      (S.timers = []),
      (S.fx.tick = function () {
        var e,
          t = 0,
          n = S.timers;
        for (Ze = Date.now(); t < n.length; t++)
          (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || S.fx.stop(), (Ze = void 0);
      }),
      (S.fx.timer = function (e) {
        S.timers.push(e), S.fx.start();
      }),
      (S.fx.interval = 13),
      (S.fx.start = function () {
        et || ((et = !0), ot());
      }),
      (S.fx.stop = function () {
        et = null;
      }),
      (S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400,
      }),
      (S.fn.delay = function (r, e) {
        return (
          (r = (S.fx && S.fx.speeds[r]) || r),
          (e = e || "fx"),
          this.queue(e, function (e, t) {
            var n = C.setTimeout(e, r);
            t.stop = function () {
              C.clearTimeout(n);
            };
          })
        );
      }),
      (tt = E.createElement("input")),
      (nt = E.createElement("select").appendChild(E.createElement("option"))),
      (tt.type = "checkbox"),
      (y.checkOn = "" !== tt.value),
      (y.optSelected = nt.selected),
      ((tt = E.createElement("input")).value = "t"),
      (tt.type = "radio"),
      (y.radioValue = "t" === tt.value);
    var ct,
      ft = S.expr.attrHandle;
    S.fn.extend({
      attr: function (e, t) {
        return $(this, S.attr, e, t, 1 < arguments.length);
      },
      removeAttr: function (e) {
        return this.each(function () {
          S.removeAttr(this, e);
        });
      },
    }),
      S.extend({
        attr: function (e, t, n) {
          var r,
            i,
            o = e.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return "undefined" == typeof e.getAttribute
              ? S.prop(e, t, n)
              : ((1 === o && S.isXMLDoc(e)) ||
                  (i =
                    S.attrHooks[t.toLowerCase()] ||
                    (S.expr.match.bool.test(t) ? ct : void 0)),
                void 0 !== n
                  ? null === n
                    ? void S.removeAttr(e, t)
                    : i && "set" in i && void 0 !== (r = i.set(e, n, t))
                    ? r
                    : (e.setAttribute(t, n + ""), n)
                  : i && "get" in i && null !== (r = i.get(e, t))
                  ? r
                  : null == (r = S.find.attr(e, t))
                  ? void 0
                  : r);
        },
        attrHooks: {
          type: {
            set: function (e, t) {
              if (!y.radioValue && "radio" === t && A(e, "input")) {
                var n = e.value;
                return e.setAttribute("type", t), n && (e.value = n), t;
              }
            },
          },
        },
        removeAttr: function (e, t) {
          var n,
            r = 0,
            i = t && t.match(P);
          if (i && 1 === e.nodeType) while ((n = i[r++])) e.removeAttribute(n);
        },
      }),
      (ct = {
        set: function (e, t, n) {
          return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n), n;
        },
      }),
      S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var a = ft[t] || S.find.attr;
        ft[t] = function (e, t, n) {
          var r,
            i,
            o = t.toLowerCase();
          return (
            n ||
              ((i = ft[o]),
              (ft[o] = r),
              (r = null != a(e, t, n) ? o : null),
              (ft[o] = i)),
            r
          );
        };
      });
    var pt = /^(?:input|select|textarea|button)$/i,
      dt = /^(?:a|area)$/i;

    function ht(e) {
      return (e.match(P) || []).join(" ");
    }

    function gt(e) {
      return (e.getAttribute && e.getAttribute("class")) || "";
    }

    function vt(e) {
      return Array.isArray(e) ? e : ("string" == typeof e && e.match(P)) || [];
    }
    S.fn.extend({
      prop: function (e, t) {
        return $(this, S.prop, e, t, 1 < arguments.length);
      },
      removeProp: function (e) {
        return this.each(function () {
          delete this[S.propFix[e] || e];
        });
      },
    }),
      S.extend({
        prop: function (e, t, n) {
          var r,
            i,
            o = e.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return (
              (1 === o && S.isXMLDoc(e)) ||
                ((t = S.propFix[t] || t), (i = S.propHooks[t])),
              void 0 !== n
                ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                  ? r
                  : (e[t] = n)
                : i && "get" in i && null !== (r = i.get(e, t))
                ? r
                : e[t]
            );
        },
        propHooks: {
          tabIndex: {
            get: function (e) {
              var t = S.find.attr(e, "tabindex");
              return t
                ? parseInt(t, 10)
                : pt.test(e.nodeName) || (dt.test(e.nodeName) && e.href)
                ? 0
                : -1;
            },
          },
        },
        propFix: {
          for: "htmlFor",
          class: "className",
        },
      }),
      y.optSelected ||
        (S.propHooks.selected = {
          get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null;
          },
          set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
          },
        }),
      S.each(
        [
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable",
        ],
        function () {
          S.propFix[this.toLowerCase()] = this;
        }
      ),
      S.fn.extend({
        addClass: function (t) {
          var e,
            n,
            r,
            i,
            o,
            a,
            s,
            u = 0;
          if (m(t))
            return this.each(function (e) {
              S(this).addClass(t.call(this, e, gt(this)));
            });
          if ((e = vt(t)).length)
            while ((n = this[u++]))
              if (((i = gt(n)), (r = 1 === n.nodeType && " " + ht(i) + " "))) {
                a = 0;
                while ((o = e[a++]))
                  r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                i !== (s = ht(r)) && n.setAttribute("class", s);
              }
          return this;
        },
        removeClass: function (t) {
          var e,
            n,
            r,
            i,
            o,
            a,
            s,
            u = 0;
          if (m(t))
            return this.each(function (e) {
              S(this).removeClass(t.call(this, e, gt(this)));
            });
          if (!arguments.length) return this.attr("class", "");
          if ((e = vt(t)).length)
            while ((n = this[u++]))
              if (((i = gt(n)), (r = 1 === n.nodeType && " " + ht(i) + " "))) {
                a = 0;
                while ((o = e[a++]))
                  while (-1 < r.indexOf(" " + o + " "))
                    r = r.replace(" " + o + " ", " ");
                i !== (s = ht(r)) && n.setAttribute("class", s);
              }
          return this;
        },
        toggleClass: function (i, t) {
          var o = typeof i,
            a = "string" === o || Array.isArray(i);
          return "boolean" == typeof t && a
            ? t
              ? this.addClass(i)
              : this.removeClass(i)
            : m(i)
            ? this.each(function (e) {
                S(this).toggleClass(i.call(this, e, gt(this), t), t);
              })
            : this.each(function () {
                var e, t, n, r;
                if (a) {
                  (t = 0), (n = S(this)), (r = vt(i));
                  while ((e = r[t++]))
                    n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                } else (void 0 !== i && "boolean" !== o) || ((e = gt(this)) && Y.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Y.get(this, "__className__") || ""));
              });
        },
        hasClass: function (e) {
          var t,
            n,
            r = 0;
          t = " " + e + " ";
          while ((n = this[r++]))
            if (1 === n.nodeType && -1 < (" " + ht(gt(n)) + " ").indexOf(t))
              return !0;
          return !1;
        },
      });
    var yt = /\r/g;
    S.fn.extend({
      val: function (n) {
        var r,
          e,
          i,
          t = this[0];
        return arguments.length
          ? ((i = m(n)),
            this.each(function (e) {
              var t;
              1 === this.nodeType &&
                (null == (t = i ? n.call(this, e, S(this).val()) : n)
                  ? (t = "")
                  : "number" == typeof t
                  ? (t += "")
                  : Array.isArray(t) &&
                    (t = S.map(t, function (e) {
                      return null == e ? "" : e + "";
                    })),
                ((r =
                  S.valHooks[this.type] ||
                  S.valHooks[this.nodeName.toLowerCase()]) &&
                  "set" in r &&
                  void 0 !== r.set(this, t, "value")) ||
                  (this.value = t));
            }))
          : t
          ? (r = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) &&
            "get" in r &&
            void 0 !== (e = r.get(t, "value"))
            ? e
            : "string" == typeof (e = t.value)
            ? e.replace(yt, "")
            : null == e
            ? ""
            : e
          : void 0;
      },
    }),
      S.extend({
        valHooks: {
          option: {
            get: function (e) {
              var t = S.find.attr(e, "value");
              return null != t ? t : ht(S.text(e));
            },
          },
          select: {
            get: function (e) {
              var t,
                n,
                r,
                i = e.options,
                o = e.selectedIndex,
                a = "select-one" === e.type,
                s = a ? null : [],
                u = a ? o + 1 : i.length;
              for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                if (
                  ((n = i[r]).selected || r === o) &&
                  !n.disabled &&
                  (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))
                ) {
                  if (((t = S(n).val()), a)) return t;
                  s.push(t);
                }
              return s;
            },
            set: function (e, t) {
              var n,
                r,
                i = e.options,
                o = S.makeArray(t),
                a = i.length;
              while (a--)
                ((r = i[a]).selected =
                  -1 < S.inArray(S.valHooks.option.get(r), o)) && (n = !0);
              return n || (e.selectedIndex = -1), o;
            },
          },
        },
      }),
      S.each(["radio", "checkbox"], function () {
        (S.valHooks[this] = {
          set: function (e, t) {
            if (Array.isArray(t))
              return (e.checked = -1 < S.inArray(S(e).val(), t));
          },
        }),
          y.checkOn ||
            (S.valHooks[this].get = function (e) {
              return null === e.getAttribute("value") ? "on" : e.value;
            });
      }),
      (y.focusin = "onfocusin" in C);
    var mt = /^(?:focusinfocus|focusoutblur)$/,
      xt = function (e) {
        e.stopPropagation();
      };
    S.extend(S.event, {
      trigger: function (e, t, n, r) {
        var i,
          o,
          a,
          s,
          u,
          l,
          c,
          f,
          p = [n || E],
          d = v.call(e, "type") ? e.type : e,
          h = v.call(e, "namespace") ? e.namespace.split(".") : [];
        if (
          ((o = f = a = n = n || E),
          3 !== n.nodeType &&
            8 !== n.nodeType &&
            !mt.test(d + S.event.triggered) &&
            (-1 < d.indexOf(".") &&
              ((d = (h = d.split(".")).shift()), h.sort()),
            (u = d.indexOf(":") < 0 && "on" + d),
            ((e = e[S.expando]
              ? e
              : new S.Event(d, "object" == typeof e && e)).isTrigger = r
              ? 2
              : 3),
            (e.namespace = h.join(".")),
            (e.rnamespace = e.namespace
              ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)")
              : null),
            (e.result = void 0),
            e.target || (e.target = n),
            (t = null == t ? [e] : S.makeArray(t, [e])),
            (c = S.event.special[d] || {}),
            r || !c.trigger || !1 !== c.trigger.apply(n, t)))
        ) {
          if (!r && !c.noBubble && !x(n)) {
            for (
              s = c.delegateType || d, mt.test(s + d) || (o = o.parentNode);
              o;
              o = o.parentNode
            )
              p.push(o), (a = o);
            a === (n.ownerDocument || E) &&
              p.push(a.defaultView || a.parentWindow || C);
          }
          i = 0;
          while ((o = p[i++]) && !e.isPropagationStopped())
            (f = o),
              (e.type = 1 < i ? s : c.bindType || d),
              (l =
                (Y.get(o, "events") || Object.create(null))[e.type] &&
                Y.get(o, "handle")) && l.apply(o, t),
              (l = u && o[u]) &&
                l.apply &&
                V(o) &&
                ((e.result = l.apply(o, t)),
                !1 === e.result && e.preventDefault());
          return (
            (e.type = d),
            r ||
              e.isDefaultPrevented() ||
              (c._default && !1 !== c._default.apply(p.pop(), t)) ||
              !V(n) ||
              (u &&
                m(n[d]) &&
                !x(n) &&
                ((a = n[u]) && (n[u] = null),
                (S.event.triggered = d),
                e.isPropagationStopped() && f.addEventListener(d, xt),
                n[d](),
                e.isPropagationStopped() && f.removeEventListener(d, xt),
                (S.event.triggered = void 0),
                a && (n[u] = a))),
            e.result
          );
        }
      },
      simulate: function (e, t, n) {
        var r = S.extend(new S.Event(), n, {
          type: e,
          isSimulated: !0,
        });
        S.event.trigger(r, null, t);
      },
    }),
      S.fn.extend({
        trigger: function (e, t) {
          return this.each(function () {
            S.event.trigger(e, t, this);
          });
        },
        triggerHandler: function (e, t) {
          var n = this[0];
          if (n) return S.event.trigger(e, t, n, !0);
        },
      }),
      y.focusin ||
        S.each(
          {
            focus: "focusin",
            blur: "focusout",
          },
          function (n, r) {
            var i = function (e) {
              S.event.simulate(r, e.target, S.event.fix(e));
            };
            S.event.special[r] = {
              setup: function () {
                var e = this.ownerDocument || this.document || this,
                  t = Y.access(e, r);
                t || e.addEventListener(n, i, !0), Y.access(e, r, (t || 0) + 1);
              },
              teardown: function () {
                var e = this.ownerDocument || this.document || this,
                  t = Y.access(e, r) - 1;
                t
                  ? Y.access(e, r, t)
                  : (e.removeEventListener(n, i, !0), Y.remove(e, r));
              },
            };
          }
        );
    var bt = C.location,
      wt = {
        guid: Date.now(),
      },
      Tt = /\?/;
    S.parseXML = function (e) {
      var t, n;
      if (!e || "string" != typeof e) return null;
      try {
        t = new C.DOMParser().parseFromString(e, "text/xml");
      } catch (e) {}
      return (
        (n = t && t.getElementsByTagName("parsererror")[0]),
        (t && !n) ||
          S.error(
            "Invalid XML: " +
              (n
                ? S.map(n.childNodes, function (e) {
                    return e.textContent;
                  }).join("\n")
                : e)
          ),
        t
      );
    };
    var Ct = /\[\]$/,
      Et = /\r?\n/g,
      St = /^(?:submit|button|image|reset|file)$/i,
      kt = /^(?:input|select|textarea|keygen)/i;

    function At(n, e, r, i) {
      var t;
      if (Array.isArray(e))
        S.each(e, function (e, t) {
          r || Ct.test(n)
            ? i(n, t)
            : At(
                n + "[" + ("object" == typeof t && null != t ? e : "") + "]",
                t,
                r,
                i
              );
        });
      else if (r || "object" !== w(e)) i(n, e);
      else for (t in e) At(n + "[" + t + "]", e[t], r, i);
    }
    (S.param = function (e, t) {
      var n,
        r = [],
        i = function (e, t) {
          var n = m(t) ? t() : t;
          r[r.length] =
            encodeURIComponent(e) +
            "=" +
            encodeURIComponent(null == n ? "" : n);
        };
      if (null == e) return "";
      if (Array.isArray(e) || (e.jquery && !S.isPlainObject(e)))
        S.each(e, function () {
          i(this.name, this.value);
        });
      else for (n in e) At(n, e[n], t, i);
      return r.join("&");
    }),
      S.fn.extend({
        serialize: function () {
          return S.param(this.serializeArray());
        },
        serializeArray: function () {
          return this.map(function () {
            var e = S.prop(this, "elements");
            return e ? S.makeArray(e) : this;
          })
            .filter(function () {
              var e = this.type;
              return (
                this.name &&
                !S(this).is(":disabled") &&
                kt.test(this.nodeName) &&
                !St.test(e) &&
                (this.checked || !pe.test(e))
              );
            })
            .map(function (e, t) {
              var n = S(this).val();
              return null == n
                ? null
                : Array.isArray(n)
                ? S.map(n, function (e) {
                    return {
                      name: t.name,
                      value: e.replace(Et, "\r\n"),
                    };
                  })
                : {
                    name: t.name,
                    value: n.replace(Et, "\r\n"),
                  };
            })
            .get();
        },
      });
    var Nt = /%20/g,
      jt = /#.*$/,
      Dt = /([?&])_=[^&]*/,
      qt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      Lt = /^(?:GET|HEAD)$/,
      Ht = /^\/\//,
      Ot = {},
      Pt = {},
      Rt = "*/".concat("*"),
      Mt = E.createElement("a");

    function It(o) {
      return function (e, t) {
        "string" != typeof e && ((t = e), (e = "*"));
        var n,
          r = 0,
          i = e.toLowerCase().match(P) || [];
        if (m(t))
          while ((n = i[r++]))
            "+" === n[0]
              ? ((n = n.slice(1) || "*"), (o[n] = o[n] || []).unshift(t))
              : (o[n] = o[n] || []).push(t);
      };
    }

    function Wt(t, i, o, a) {
      var s = {},
        u = t === Pt;

      function l(e) {
        var r;
        return (
          (s[e] = !0),
          S.each(t[e] || [], function (e, t) {
            var n = t(i, o, a);
            return "string" != typeof n || u || s[n]
              ? u
                ? !(r = n)
                : void 0
              : (i.dataTypes.unshift(n), l(n), !1);
          }),
          r
        );
      }
      return l(i.dataTypes[0]) || (!s["*"] && l("*"));
    }

    function Ft(e, t) {
      var n,
        r,
        i = S.ajaxSettings.flatOptions || {};
      for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
      return r && S.extend(!0, e, r), e;
    }
    (Mt.href = bt.href),
      S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: bt.href,
          type: "GET",
          isLocal:
            /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
              bt.protocol
            ),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          accepts: {
            "*": Rt,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript",
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/,
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON",
          },
          converters: {
            "* text": String,
            "text html": !0,
            "text json": JSON.parse,
            "text xml": S.parseXML,
          },
          flatOptions: {
            url: !0,
            context: !0,
          },
        },
        ajaxSetup: function (e, t) {
          return t ? Ft(Ft(e, S.ajaxSettings), t) : Ft(S.ajaxSettings, e);
        },
        ajaxPrefilter: It(Ot),
        ajaxTransport: It(Pt),
        ajax: function (e, t) {
          "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
          var c,
            f,
            p,
            n,
            d,
            r,
            h,
            g,
            i,
            o,
            v = S.ajaxSetup({}, t),
            y = v.context || v,
            m = v.context && (y.nodeType || y.jquery) ? S(y) : S.event,
            x = S.Deferred(),
            b = S.Callbacks("once memory"),
            w = v.statusCode || {},
            a = {},
            s = {},
            u = "canceled",
            T = {
              readyState: 0,
              getResponseHeader: function (e) {
                var t;
                if (h) {
                  if (!n) {
                    n = {};
                    while ((t = qt.exec(p)))
                      n[t[1].toLowerCase() + " "] = (
                        n[t[1].toLowerCase() + " "] || []
                      ).concat(t[2]);
                  }
                  t = n[e.toLowerCase() + " "];
                }
                return null == t ? null : t.join(", ");
              },
              getAllResponseHeaders: function () {
                return h ? p : null;
              },
              setRequestHeader: function (e, t) {
                return (
                  null == h &&
                    ((e = s[e.toLowerCase()] = s[e.toLowerCase()] || e),
                    (a[e] = t)),
                  this
                );
              },
              overrideMimeType: function (e) {
                return null == h && (v.mimeType = e), this;
              },
              statusCode: function (e) {
                var t;
                if (e)
                  if (h) T.always(e[T.status]);
                  else for (t in e) w[t] = [w[t], e[t]];
                return this;
              },
              abort: function (e) {
                var t = e || u;
                return c && c.abort(t), l(0, t), this;
              },
            };
          if (
            (x.promise(T),
            (v.url = ((e || v.url || bt.href) + "").replace(
              Ht,
              bt.protocol + "//"
            )),
            (v.type = t.method || t.type || v.method || v.type),
            (v.dataTypes = (v.dataType || "*").toLowerCase().match(P) || [""]),
            null == v.crossDomain)
          ) {
            r = E.createElement("a");
            try {
              (r.href = v.url),
                (r.href = r.href),
                (v.crossDomain =
                  Mt.protocol + "//" + Mt.host != r.protocol + "//" + r.host);
            } catch (e) {
              v.crossDomain = !0;
            }
          }
          if (
            (v.data &&
              v.processData &&
              "string" != typeof v.data &&
              (v.data = S.param(v.data, v.traditional)),
            Wt(Ot, v, t, T),
            h)
          )
            return T;
          for (i in ((g = S.event && v.global) &&
            0 == S.active++ &&
            S.event.trigger("ajaxStart"),
          (v.type = v.type.toUpperCase()),
          (v.hasContent = !Lt.test(v.type)),
          (f = v.url.replace(jt, "")),
          v.hasContent
            ? v.data &&
              v.processData &&
              0 ===
                (v.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              (v.data = v.data.replace(Nt, "+"))
            : ((o = v.url.slice(f.length)),
              v.data &&
                (v.processData || "string" == typeof v.data) &&
                ((f += (Tt.test(f) ? "&" : "?") + v.data), delete v.data),
              !1 === v.cache &&
                ((f = f.replace(Dt, "$1")),
                (o = (Tt.test(f) ? "&" : "?") + "_=" + wt.guid++ + o)),
              (v.url = f + o)),
          v.ifModified &&
            (S.lastModified[f] &&
              T.setRequestHeader("If-Modified-Since", S.lastModified[f]),
            S.etag[f] && T.setRequestHeader("If-None-Match", S.etag[f])),
          ((v.data && v.hasContent && !1 !== v.contentType) || t.contentType) &&
            T.setRequestHeader("Content-Type", v.contentType),
          T.setRequestHeader(
            "Accept",
            v.dataTypes[0] && v.accepts[v.dataTypes[0]]
              ? v.accepts[v.dataTypes[0]] +
                  ("*" !== v.dataTypes[0] ? ", " + Rt + "; q=0.01" : "")
              : v.accepts["*"]
          ),
          v.headers))
            T.setRequestHeader(i, v.headers[i]);
          if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
            return T.abort();
          if (
            ((u = "abort"),
            b.add(v.complete),
            T.done(v.success),
            T.fail(v.error),
            (c = Wt(Pt, v, t, T)))
          ) {
            if (((T.readyState = 1), g && m.trigger("ajaxSend", [T, v]), h))
              return T;
            v.async &&
              0 < v.timeout &&
              (d = C.setTimeout(function () {
                T.abort("timeout");
              }, v.timeout));
            try {
              (h = !1), c.send(a, l);
            } catch (e) {
              if (h) throw e;
              l(-1, e);
            }
          } else l(-1, "No Transport");

          function l(e, t, n, r) {
            var i,
              o,
              a,
              s,
              u,
              l = t;
            h ||
              ((h = !0),
              d && C.clearTimeout(d),
              (c = void 0),
              (p = r || ""),
              (T.readyState = 0 < e ? 4 : 0),
              (i = (200 <= e && e < 300) || 304 === e),
              n &&
                (s = (function (e, t, n) {
                  var r,
                    i,
                    o,
                    a,
                    s = e.contents,
                    u = e.dataTypes;
                  while ("*" === u[0])
                    u.shift(),
                      void 0 === r &&
                        (r = e.mimeType || t.getResponseHeader("Content-Type"));
                  if (r)
                    for (i in s)
                      if (s[i] && s[i].test(r)) {
                        u.unshift(i);
                        break;
                      }
                  if (u[0] in n) o = u[0];
                  else {
                    for (i in n) {
                      if (!u[0] || e.converters[i + " " + u[0]]) {
                        o = i;
                        break;
                      }
                      a || (a = i);
                    }
                    o = o || a;
                  }
                  if (o) return o !== u[0] && u.unshift(o), n[o];
                })(v, T, n)),
              !i &&
                -1 < S.inArray("script", v.dataTypes) &&
                S.inArray("json", v.dataTypes) < 0 &&
                (v.converters["text script"] = function () {}),
              (s = (function (e, t, n, r) {
                var i,
                  o,
                  a,
                  s,
                  u,
                  l = {},
                  c = e.dataTypes.slice();
                if (c[1])
                  for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
                o = c.shift();
                while (o)
                  if (
                    (e.responseFields[o] && (n[e.responseFields[o]] = t),
                    !u &&
                      r &&
                      e.dataFilter &&
                      (t = e.dataFilter(t, e.dataType)),
                    (u = o),
                    (o = c.shift()))
                  )
                    if ("*" === o) o = u;
                    else if ("*" !== u && u !== o) {
                      if (!(a = l[u + " " + o] || l["* " + o]))
                        for (i in l)
                          if (
                            (s = i.split(" "))[1] === o &&
                            (a = l[u + " " + s[0]] || l["* " + s[0]])
                          ) {
                            !0 === a
                              ? (a = l[i])
                              : !0 !== l[i] && ((o = s[0]), c.unshift(s[1]));
                            break;
                          }
                      if (!0 !== a)
                        if (a && e["throws"]) t = a(t);
                        else
                          try {
                            t = a(t);
                          } catch (e) {
                            return {
                              state: "parsererror",
                              error: a
                                ? e
                                : "No conversion from " + u + " to " + o,
                            };
                          }
                    }
                return {
                  state: "success",
                  data: t,
                };
              })(v, s, T, i)),
              i
                ? (v.ifModified &&
                    ((u = T.getResponseHeader("Last-Modified")) &&
                      (S.lastModified[f] = u),
                    (u = T.getResponseHeader("etag")) && (S.etag[f] = u)),
                  204 === e || "HEAD" === v.type
                    ? (l = "nocontent")
                    : 304 === e
                    ? (l = "notmodified")
                    : ((l = s.state), (o = s.data), (i = !(a = s.error))))
                : ((a = l), (!e && l) || ((l = "error"), e < 0 && (e = 0))),
              (T.status = e),
              (T.statusText = (t || l) + ""),
              i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]),
              T.statusCode(w),
              (w = void 0),
              g &&
                m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]),
              b.fireWith(y, [T, l]),
              g &&
                (m.trigger("ajaxComplete", [T, v]),
                --S.active || S.event.trigger("ajaxStop")));
          }
          return T;
        },
        getJSON: function (e, t, n) {
          return S.get(e, t, n, "json");
        },
        getScript: function (e, t) {
          return S.get(e, void 0, t, "script");
        },
      }),
      S.each(["get", "post"], function (e, i) {
        S[i] = function (e, t, n, r) {
          return (
            m(t) && ((r = r || n), (n = t), (t = void 0)),
            S.ajax(
              S.extend(
                {
                  url: e,
                  type: i,
                  dataType: r,
                  data: t,
                  success: n,
                },
                S.isPlainObject(e) && e
              )
            )
          );
        };
      }),
      S.ajaxPrefilter(function (e) {
        var t;
        for (t in e.headers)
          "content-type" === t.toLowerCase() &&
            (e.contentType = e.headers[t] || "");
      }),
      (S._evalUrl = function (e, t, n) {
        return S.ajax({
          url: e,
          type: "GET",
          dataType: "script",
          cache: !0,
          async: !1,
          global: !1,
          converters: {
            "text script": function () {},
          },
          dataFilter: function (e) {
            S.globalEval(e, t, n);
          },
        });
      }),
      S.fn.extend({
        wrapAll: function (e) {
          var t;
          return (
            this[0] &&
              (m(e) && (e = e.call(this[0])),
              (t = S(e, this[0].ownerDocument).eq(0).clone(!0)),
              this[0].parentNode && t.insertBefore(this[0]),
              t
                .map(function () {
                  var e = this;
                  while (e.firstElementChild) e = e.firstElementChild;
                  return e;
                })
                .append(this)),
            this
          );
        },
        wrapInner: function (n) {
          return m(n)
            ? this.each(function (e) {
                S(this).wrapInner(n.call(this, e));
              })
            : this.each(function () {
                var e = S(this),
                  t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n);
              });
        },
        wrap: function (t) {
          var n = m(t);
          return this.each(function (e) {
            S(this).wrapAll(n ? t.call(this, e) : t);
          });
        },
        unwrap: function (e) {
          return (
            this.parent(e)
              .not("body")
              .each(function () {
                S(this).replaceWith(this.childNodes);
              }),
            this
          );
        },
      }),
      (S.expr.pseudos.hidden = function (e) {
        return !S.expr.pseudos.visible(e);
      }),
      (S.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
      }),
      (S.ajaxSettings.xhr = function () {
        try {
          return new C.XMLHttpRequest();
        } catch (e) {}
      });
    var Bt = {
        0: 200,
        1223: 204,
      },
      $t = S.ajaxSettings.xhr();
    (y.cors = !!$t && "withCredentials" in $t),
      (y.ajax = $t = !!$t),
      S.ajaxTransport(function (i) {
        var o, a;
        if (y.cors || ($t && !i.crossDomain))
          return {
            send: function (e, t) {
              var n,
                r = i.xhr();
              if (
                (r.open(i.type, i.url, i.async, i.username, i.password),
                i.xhrFields)
              )
                for (n in i.xhrFields) r[n] = i.xhrFields[n];
              for (n in (i.mimeType &&
                r.overrideMimeType &&
                r.overrideMimeType(i.mimeType),
              i.crossDomain ||
                e["X-Requested-With"] ||
                (e["X-Requested-With"] = "XMLHttpRequest"),
              e))
                r.setRequestHeader(n, e[n]);
              (o = function (e) {
                return function () {
                  o &&
                    ((o =
                      a =
                      r.onload =
                      r.onerror =
                      r.onabort =
                      r.ontimeout =
                      r.onreadystatechange =
                        null),
                    "abort" === e
                      ? r.abort()
                      : "error" === e
                      ? "number" != typeof r.status
                        ? t(0, "error")
                        : t(r.status, r.statusText)
                      : t(
                          Bt[r.status] || r.status,
                          r.statusText,
                          "text" !== (r.responseType || "text") ||
                            "string" != typeof r.responseText
                            ? {
                                binary: r.response,
                              }
                            : {
                                text: r.responseText,
                              },
                          r.getAllResponseHeaders()
                        ));
                };
              }),
                (r.onload = o()),
                (a = r.onerror = r.ontimeout = o("error")),
                void 0 !== r.onabort
                  ? (r.onabort = a)
                  : (r.onreadystatechange = function () {
                      4 === r.readyState &&
                        C.setTimeout(function () {
                          o && a();
                        });
                    }),
                (o = o("abort"));
              try {
                r.send((i.hasContent && i.data) || null);
              } catch (e) {
                if (o) throw e;
              }
            },
            abort: function () {
              o && o();
            },
          };
      }),
      S.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = !1);
      }),
      S.ajaxSetup({
        accepts: {
          script:
            "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
        },
        contents: {
          script: /\b(?:java|ecma)script\b/,
        },
        converters: {
          "text script": function (e) {
            return S.globalEval(e), e;
          },
        },
      }),
      S.ajaxPrefilter("script", function (e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
      }),
      S.ajaxTransport("script", function (n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs)
          return {
            send: function (e, t) {
              (r = S("<script>")
                .attr(n.scriptAttrs || {})
                .prop({
                  charset: n.scriptCharset,
                  src: n.url,
                })
                .on(
                  "load error",
                  (i = function (e) {
                    r.remove(),
                      (i = null),
                      e && t("error" === e.type ? 404 : 200, e.type);
                  })
                )),
                E.head.appendChild(r[0]);
            },
            abort: function () {
              i && i();
            },
          };
      });
    var _t,
      zt = [],
      Ut = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function () {
        var e = zt.pop() || S.expando + "_" + wt.guid++;
        return (this[e] = !0), e;
      },
    }),
      S.ajaxPrefilter("json jsonp", function (e, t, n) {
        var r,
          i,
          o,
          a =
            !1 !== e.jsonp &&
            (Ut.test(e.url)
              ? "url"
              : "string" == typeof e.data &&
                0 ===
                  (e.contentType || "").indexOf(
                    "application/x-www-form-urlencoded"
                  ) &&
                Ut.test(e.data) &&
                "data");
        if (a || "jsonp" === e.dataTypes[0])
          return (
            (r = e.jsonpCallback =
              m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback),
            a
              ? (e[a] = e[a].replace(Ut, "$1" + r))
              : !1 !== e.jsonp &&
                (e.url += (Tt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            (e.converters["script json"] = function () {
              return o || S.error(r + " was not called"), o[0];
            }),
            (e.dataTypes[0] = "json"),
            (i = C[r]),
            (C[r] = function () {
              o = arguments;
            }),
            n.always(function () {
              void 0 === i ? S(C).removeProp(r) : (C[r] = i),
                e[r] && ((e.jsonpCallback = t.jsonpCallback), zt.push(r)),
                o && m(i) && i(o[0]),
                (o = i = void 0);
            }),
            "script"
          );
      }),
      (y.createHTMLDocument =
        (((_t = E.implementation.createHTMLDocument("").body).innerHTML =
          "<form></form><form></form>"),
        2 === _t.childNodes.length)),
      (S.parseHTML = function (e, t, n) {
        return "string" != typeof e
          ? []
          : ("boolean" == typeof t && ((n = t), (t = !1)),
            t ||
              (y.createHTMLDocument
                ? (((r = (t =
                    E.implementation.createHTMLDocument("")).createElement(
                    "base"
                  )).href = E.location.href),
                  t.head.appendChild(r))
                : (t = E)),
            (o = !n && []),
            (i = N.exec(e))
              ? [t.createElement(i[1])]
              : ((i = xe([e], t, o)),
                o && o.length && S(o).remove(),
                S.merge([], i.childNodes)));
        var r, i, o;
      }),
      (S.fn.load = function (e, t, n) {
        var r,
          i,
          o,
          a = this,
          s = e.indexOf(" ");
        return (
          -1 < s && ((r = ht(e.slice(s))), (e = e.slice(0, s))),
          m(t)
            ? ((n = t), (t = void 0))
            : t && "object" == typeof t && (i = "POST"),
          0 < a.length &&
            S.ajax({
              url: e,
              type: i || "GET",
              dataType: "html",
              data: t,
            })
              .done(function (e) {
                (o = arguments),
                  a.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e);
              })
              .always(
                n &&
                  function (e, t) {
                    a.each(function () {
                      n.apply(this, o || [e.responseText, t, e]);
                    });
                  }
              ),
          this
        );
      }),
      (S.expr.pseudos.animated = function (t) {
        return S.grep(S.timers, function (e) {
          return t === e.elem;
        }).length;
      }),
      (S.offset = {
        setOffset: function (e, t, n) {
          var r,
            i,
            o,
            a,
            s,
            u,
            l = S.css(e, "position"),
            c = S(e),
            f = {};
          "static" === l && (e.style.position = "relative"),
            (s = c.offset()),
            (o = S.css(e, "top")),
            (u = S.css(e, "left")),
            ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto")
              ? ((a = (r = c.position()).top), (i = r.left))
              : ((a = parseFloat(o) || 0), (i = parseFloat(u) || 0)),
            m(t) && (t = t.call(e, n, S.extend({}, s))),
            null != t.top && (f.top = t.top - s.top + a),
            null != t.left && (f.left = t.left - s.left + i),
            "using" in t ? t.using.call(e, f) : c.css(f);
        },
      }),
      S.fn.extend({
        offset: function (t) {
          if (arguments.length)
            return void 0 === t
              ? this
              : this.each(function (e) {
                  S.offset.setOffset(this, t, e);
                });
          var e,
            n,
            r = this[0];
          return r
            ? r.getClientRects().length
              ? ((e = r.getBoundingClientRect()),
                (n = r.ownerDocument.defaultView),
                {
                  top: e.top + n.pageYOffset,
                  left: e.left + n.pageXOffset,
                })
              : {
                  top: 0,
                  left: 0,
                }
            : void 0;
        },
        position: function () {
          if (this[0]) {
            var e,
              t,
              n,
              r = this[0],
              i = {
                top: 0,
                left: 0,
              };
            if ("fixed" === S.css(r, "position")) t = r.getBoundingClientRect();
            else {
              (t = this.offset()),
                (n = r.ownerDocument),
                (e = r.offsetParent || n.documentElement);
              while (
                e &&
                (e === n.body || e === n.documentElement) &&
                "static" === S.css(e, "position")
              )
                e = e.parentNode;
              e &&
                e !== r &&
                1 === e.nodeType &&
                (((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0)),
                (i.left += S.css(e, "borderLeftWidth", !0)));
            }
            return {
              top: t.top - i.top - S.css(r, "marginTop", !0),
              left: t.left - i.left - S.css(r, "marginLeft", !0),
            };
          }
        },
        offsetParent: function () {
          return this.map(function () {
            var e = this.offsetParent;
            while (e && "static" === S.css(e, "position")) e = e.offsetParent;
            return e || re;
          });
        },
      }),
      S.each(
        {
          scrollLeft: "pageXOffset",
          scrollTop: "pageYOffset",
        },
        function (t, i) {
          var o = "pageYOffset" === i;
          S.fn[t] = function (e) {
            return $(
              this,
              function (e, t, n) {
                var r;
                if (
                  (x(e) ? (r = e) : 9 === e.nodeType && (r = e.defaultView),
                  void 0 === n)
                )
                  return r ? r[i] : e[t];
                r
                  ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset)
                  : (e[t] = n);
              },
              t,
              e,
              arguments.length
            );
          };
        }
      ),
      S.each(["top", "left"], function (e, n) {
        S.cssHooks[n] = Fe(y.pixelPosition, function (e, t) {
          if (t)
            return (t = We(e, n)), Pe.test(t) ? S(e).position()[n] + "px" : t;
        });
      }),
      S.each(
        {
          Height: "height",
          Width: "width",
        },
        function (a, s) {
          S.each(
            {
              padding: "inner" + a,
              content: s,
              "": "outer" + a,
            },
            function (r, o) {
              S.fn[o] = function (e, t) {
                var n = arguments.length && (r || "boolean" != typeof e),
                  i = r || (!0 === e || !0 === t ? "margin" : "border");
                return $(
                  this,
                  function (e, t, n) {
                    var r;
                    return x(e)
                      ? 0 === o.indexOf("outer")
                        ? e["inner" + a]
                        : e.document.documentElement["client" + a]
                      : 9 === e.nodeType
                      ? ((r = e.documentElement),
                        Math.max(
                          e.body["scroll" + a],
                          r["scroll" + a],
                          e.body["offset" + a],
                          r["offset" + a],
                          r["client" + a]
                        ))
                      : void 0 === n
                      ? S.css(e, t, i)
                      : S.style(e, t, n, i);
                  },
                  s,
                  n ? e : void 0,
                  n
                );
              };
            }
          );
        }
      ),
      S.each(
        [
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend",
        ],
        function (e, t) {
          S.fn[t] = function (e) {
            return this.on(t, e);
          };
        }
      ),
      S.fn.extend({
        bind: function (e, t, n) {
          return this.on(e, null, t, n);
        },
        unbind: function (e, t) {
          return this.off(e, null, t);
        },
        delegate: function (e, t, n, r) {
          return this.on(t, e, n, r);
        },
        undelegate: function (e, t, n) {
          return 1 === arguments.length
            ? this.off(e, "**")
            : this.off(t, e || "**", n);
        },
        hover: function (e, t) {
          return this.mouseenter(e).mouseleave(t || e);
        },
      }),
      S.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
          " "
        ),
        function (e, n) {
          S.fn[n] = function (e, t) {
            return 0 < arguments.length
              ? this.on(n, null, e, t)
              : this.trigger(n);
          };
        }
      );
    var Xt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    (S.proxy = function (e, t) {
      var n, r, i;
      if (("string" == typeof t && ((n = e[t]), (t = e), (e = n)), m(e)))
        return (
          (r = s.call(arguments, 2)),
          ((i = function () {
            return e.apply(t || this, r.concat(s.call(arguments)));
          }).guid = e.guid =
            e.guid || S.guid++),
          i
        );
    }),
      (S.holdReady = function (e) {
        e ? S.readyWait++ : S.ready(!0);
      }),
      (S.isArray = Array.isArray),
      (S.parseJSON = JSON.parse),
      (S.nodeName = A),
      (S.isFunction = m),
      (S.isWindow = x),
      (S.camelCase = X),
      (S.type = w),
      (S.now = Date.now),
      (S.isNumeric = function (e) {
        var t = S.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
      }),
      (S.trim = function (e) {
        return null == e ? "" : (e + "").replace(Xt, "");
      }),
      "function" == typeof define &&
        define.amd &&
        define("jquery", [], function () {
          return S;
        });
    var Vt = C.jQuery,
      Gt = C.$;
    return (
      (S.noConflict = function (e) {
        return (
          C.$ === S && (C.$ = Gt), e && C.jQuery === S && (C.jQuery = Vt), S
        );
      }),
      "undefined" == typeof e && (C.jQuery = C.$ = S),
      S
    );
  });
}
// jQuery easie (for easing) e.g. $('#myObject).animate({ left: "-=75"}, 100, $.easie(0.5, 0.5, 1, 1.5))  $.easie(cubic bezier)
if (options.indexOf("jqeasie") >= 0) {
  (function (a) {
    "use strict";
    var b = "easie",
      c = "Ease",
      d = b + c + "In",
      e = b + c + "Out",
      f = b + c + "InOut",
      g = ["Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ"];
    a.easie = function (c, d, e, f, g, h) {
      g = g || [b, c, d, e, f].join("-");
      if (!a.easing[g] || h) {
        var k = i(function (a) {
          return j(a, c, d, e, f, 5);
        });
        (a.easing[g] = function (a, b, c, d) {
          return k.call(null, a);
        }),
          (a.easing[g].params = [c, d, e, f]);
      }
      return g;
    };
    var h = a.easie;
    h(0, 0, 1, 1, b + "Linear"),
      h(0.25, 0.1, 0.25, 1, b + c),
      h(0.42, 0, 1, 1, d),
      h(0, 0, 0.58, 1, e),
      h(0.42, 0, 0.58, 1, f),
      h(0.55, 0.085, 0.68, 0.53, d + g[0]),
      h(0.55, 0.055, 0.675, 0.19, d + g[1]),
      h(0.895, 0.03, 0.685, 0.22, d + g[2]),
      h(0.755, 0.05, 0.855, 0.06, d + g[3]),
      h(0.47, 0, 0.745, 0.715, d + g[4]),
      h(0.95, 0.05, 0.795, 0.035, d + g[5]),
      h(0.6, 0.04, 0.98, 0.335, d + g[6]),
      h(0.25, 0.46, 0.45, 0.94, e + g[0]),
      h(0.215, 0.61, 0.355, 1, e + g[1]),
      h(0.165, 0.84, 0.44, 1, e + g[2]),
      h(0.23, 1, 0.32, 1, e + g[3]),
      h(0.39, 0.575, 0.565, 1, e + g[4]),
      h(0.19, 1, 0.22, 1, e + g[5]),
      h(0.075, 0.82, 0.165, 1, e + g[6]),
      h(0.455, 0.03, 0.515, 0.955, f + g[0]),
      h(0.645, 0.045, 0.355, 1, f + g[1]),
      h(0.77, 0, 0.175, 1, f + g[2]),
      h(0.86, 0, 0.07, 1, f + g[3]),
      h(0.445, 0.05, 0.55, 0.95, f + g[4]),
      h(1, 0, 0, 1, f + g[5]),
      h(0.785, 0.135, 0.15, 0.86, f + g[6]);

    function i(a, b) {
      var c;
      b = b || 101;
      var d = [];
      for (c = 0; c < b + 1; c++) d[c] = a.call(null, c / b);
      return function (a) {
        if (a === 1) return d[b];
        var c = b * a;
        var e = Math.floor(c);
        var f = d[e];
        var g = d[e + 1];
        return f + (g - f) * (c - e);
      };
    }

    function j(a, b, c, d, e, f) {
      var g = 0,
        h = 0,
        i = 0,
        j = 0,
        k = 0,
        l = 0;

      function m(a) {
        return ((g * a + h) * a + i) * a;
      }

      function n(a) {
        return ((j * a + k) * a + l) * a;
      }

      function o(a) {
        return (3 * g * a + 2 * h) * a + i;
      }

      function p(a) {
        return 1 / (200 * a);
      }

      function q(a, b) {
        return n(r(a, b));
      }

      function r(a, b) {
        var c, d, e, f, g, h;

        function i(a) {
          return a >= 0 ? a : 0 - a;
        }
        for (e = a, h = 0; h < 8; h++) {
          f = m(e) - a;
          if (i(f) < b) return e;
          g = o(e);
          if (i(g) < 1e-6) break;
          e = e - f / g;
        }
        (c = 0), (d = 1), (e = a);
        if (e < c) return c;
        if (e > d) return d;
        while (c < d) {
          f = m(e);
          if (i(f - a) < b) return e;
          a > f ? (c = e) : (d = e), (e = (d - c) * 0.5 + c);
        }
        return e;
      }
      (i = 3 * b),
        (h = 3 * (d - b) - i),
        (g = 1 - i - h),
        (l = 3 * c),
        (k = 3 * (e - c) - l),
        (j = 1 - l - k);
      return q(a, p(f));
    }
  })(jQuery);
}
//#region  vue
if (options.indexOf("vue") >= 0) {
  !(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define(t)
      : ((e = e || self).Vue = t());
  })(this, function () {
    "use strict";
    var e = Object.freeze({});

    function t(e) {
      return null == e;
    }

    function n(e) {
      return null != e;
    }

    function r(e) {
      return !0 === e;
    }

    function i(e) {
      return (
        "string" == typeof e ||
        "number" == typeof e ||
        "symbol" == typeof e ||
        "boolean" == typeof e
      );
    }

    function o(e) {
      return null !== e && "object" == typeof e;
    }
    var a = Object.prototype.toString;

    function s(e) {
      return a.call(e).slice(8, -1);
    }

    function c(e) {
      return "[object Object]" === a.call(e);
    }

    function u(e) {
      return "[object RegExp]" === a.call(e);
    }

    function l(e) {
      var t = parseFloat(String(e));
      return t >= 0 && Math.floor(t) === t && isFinite(e);
    }

    function f(e) {
      return (
        n(e) && "function" == typeof e.then && "function" == typeof e.catch
      );
    }

    function p(e) {
      return null == e
        ? ""
        : Array.isArray(e) || (c(e) && e.toString === a)
        ? JSON.stringify(e, null, 2)
        : String(e);
    }

    function d(e) {
      var t = parseFloat(e);
      return isNaN(t) ? e : t;
    }

    function v(e, t) {
      for (
        var n = Object.create(null), r = e.split(","), i = 0;
        i < r.length;
        i++
      )
        n[r[i]] = !0;
      return t
        ? function (e) {
            return n[e.toLowerCase()];
          }
        : function (e) {
            return n[e];
          };
    }
    var h = v("slot,component", !0),
      m = v("key,ref,slot,slot-scope,is");

    function y(e, t) {
      if (e.length) {
        var n = e.indexOf(t);
        if (n > -1) return e.splice(n, 1);
      }
    }
    var g = Object.prototype.hasOwnProperty;

    function b(e, t) {
      return g.call(e, t);
    }

    function _(e) {
      var t = Object.create(null);
      return function (n) {
        return t[n] || (t[n] = e(n));
      };
    }
    var w = /-(\w)/g,
      $ = _(function (e) {
        return e.replace(w, function (e, t) {
          return t ? t.toUpperCase() : "";
        });
      }),
      x = _(function (e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
      }),
      k = /\B([A-Z])/g,
      C = _(function (e) {
        return e.replace(k, "-$1").toLowerCase();
      });
    var A = Function.prototype.bind
      ? function (e, t) {
          return e.bind(t);
        }
      : function (e, t) {
          function n(n) {
            var r = arguments.length;
            return r
              ? r > 1
                ? e.apply(t, arguments)
                : e.call(t, n)
              : e.call(t);
          }
          return (n._length = e.length), n;
        };

    function S(e, t) {
      t = t || 0;
      for (var n = e.length - t, r = new Array(n); n--; ) r[n] = e[n + t];
      return r;
    }

    function O(e, t) {
      for (var n in t) e[n] = t[n];
      return e;
    }

    function T(e) {
      for (var t = {}, n = 0; n < e.length; n++) e[n] && O(t, e[n]);
      return t;
    }

    function M(e, t, n) {}
    var j = function (e, t, n) {
        return !1;
      },
      I = function (e) {
        return e;
      };

    function N(e, t) {
      if (e === t) return !0;
      var n = o(e),
        r = o(t);
      if (!n || !r) return !n && !r && String(e) === String(t);
      try {
        var i = Array.isArray(e),
          a = Array.isArray(t);
        if (i && a)
          return (
            e.length === t.length &&
            e.every(function (e, n) {
              return N(e, t[n]);
            })
          );
        if (e instanceof Date && t instanceof Date)
          return e.getTime() === t.getTime();
        if (i || a) return !1;
        var s = Object.keys(e),
          c = Object.keys(t);
        return (
          s.length === c.length &&
          s.every(function (n) {
            return N(e[n], t[n]);
          })
        );
      } catch (e) {
        return !1;
      }
    }

    function E(e, t) {
      for (var n = 0; n < e.length; n++) if (N(e[n], t)) return n;
      return -1;
    }

    function D(e) {
      var t = !1;
      return function () {
        t || ((t = !0), e.apply(this, arguments));
      };
    }
    var L = "data-server-rendered",
      F = ["component", "directive", "filter"],
      P = [
        "beforeCreate",
        "created",
        "beforeMount",
        "mounted",
        "beforeUpdate",
        "updated",
        "beforeDestroy",
        "destroyed",
        "activated",
        "deactivated",
        "errorCaptured",
        "serverPrefetch",
      ],
      R = {
        optionMergeStrategies: Object.create(null),
        silent: !1,
        productionTip: !0,
        devtools: !0,
        performance: !1,
        errorHandler: null,
        warnHandler: null,
        ignoredElements: [],
        keyCodes: Object.create(null),
        isReservedTag: j,
        isReservedAttr: j,
        isUnknownElement: j,
        getTagNamespace: M,
        parsePlatformTagName: I,
        mustUseProp: j,
        async: !0,
        _lifecycleHooks: P,
      },
      U =
        /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

    function H(e) {
      var t = (e + "").charCodeAt(0);
      return 36 === t || 95 === t;
    }

    function B(e, t, n, r) {
      Object.defineProperty(e, t, {
        value: n,
        enumerable: !!r,
        writable: !0,
        configurable: !0,
      });
    }
    var V = new RegExp("[^" + U.source + ".$_\\d]");
    var z,
      J = "__proto__" in {},
      q = "undefined" != typeof window,
      K = "undefined" != typeof WXEnvironment && !!WXEnvironment.platform,
      W = K && WXEnvironment.platform.toLowerCase(),
      Z = q && window.navigator.userAgent.toLowerCase(),
      G = Z && /msie|trident/.test(Z),
      X = Z && Z.indexOf("msie 9.0") > 0,
      Y = Z && Z.indexOf("edge/") > 0,
      Q =
        (Z && Z.indexOf("android"),
        (Z && /iphone|ipad|ipod|ios/.test(Z)) || "ios" === W),
      ee =
        (Z && /chrome\/\d+/.test(Z),
        Z && /phantomjs/.test(Z),
        Z && Z.match(/firefox\/(\d+)/)),
      te = {}.watch,
      ne = !1;
    if (q)
      try {
        var re = {};
        Object.defineProperty(re, "passive", {
          get: function () {
            ne = !0;
          },
        }),
          window.addEventListener("test-passive", null, re);
      } catch (e) {}
    var ie = function () {
        return (
          void 0 === z &&
            (z =
              !q &&
              !K &&
              "undefined" != typeof global &&
              global.process &&
              "server" === global.process.env.VUE_ENV),
          z
        );
      },
      oe = q && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    function ae(e) {
      return "function" == typeof e && /native code/.test(e.toString());
    }
    var se,
      ce =
        "undefined" != typeof Symbol &&
        ae(Symbol) &&
        "undefined" != typeof Reflect &&
        ae(Reflect.ownKeys);
    se =
      "undefined" != typeof Set && ae(Set)
        ? Set
        : (function () {
            function e() {
              this.set = Object.create(null);
            }
            return (
              (e.prototype.has = function (e) {
                return !0 === this.set[e];
              }),
              (e.prototype.add = function (e) {
                this.set[e] = !0;
              }),
              (e.prototype.clear = function () {
                this.set = Object.create(null);
              }),
              e
            );
          })();
    var ue,
      le,
      fe,
      pe = M,
      de = "undefined" != typeof console,
      ve = /(?:^|[-_])(\w)/g;
    (ue = function (e, t) {
      var n = t ? pe(t) : "";
      R.warnHandler ? R.warnHandler.call(null, e, t, n) : de && R.silent;
    }),
      (le = function (e, t) {
        de && R.silent;
      }),
      (fe = function (e, t) {
        if (e.$root === e) return "<Root>";
        var n =
            "function" == typeof e && null != e.cid
              ? e.options
              : e._isVue
              ? e.$options || e.constructor.options
              : e,
          r = n.name || n._componentTag,
          i = n.__file;
        if (!r && i) {
          var o = i.match(/([^/\\]+)\.vue$/);
          r = o && o[1];
        }
        return (
          (r
            ? "<" +
              (function (e) {
                return e
                  .replace(ve, function (e) {
                    return e.toUpperCase();
                  })
                  .replace(/[-_]/g, "");
              })(r) +
              ">"
            : "<Anonymous>") + (i && !1 !== t ? " at " + i : "")
        );
      });
    pe = function (e) {
      if (e._isVue && e.$parent) {
        for (var t = [], n = 0; e; ) {
          if (t.length > 0) {
            var r = t[t.length - 1];
            if (r.constructor === e.constructor) {
              n++, (e = e.$parent);
              continue;
            }
            n > 0 && ((t[t.length - 1] = [r, n]), (n = 0));
          }
          t.push(e), (e = e.$parent);
        }
        return (
          "\n\nfound in\n\n" +
          t
            .map(function (e, t) {
              return (
                "" +
                (0 === t
                  ? "---\x3e "
                  : (function (e, t) {
                      for (var n = ""; t; )
                        t % 2 == 1 && (n += e), t > 1 && (e += e), (t >>= 1);
                      return n;
                    })(" ", 5 + 2 * t)) +
                (Array.isArray(e)
                  ? fe(e[0]) + "... (" + e[1] + " recursive calls)"
                  : fe(e))
              );
            })
            .join("\n")
        );
      }
      return "\n\n(found in " + fe(e) + ")";
    };
    var he = 0,
      me = function () {
        (this.id = he++), (this.subs = []);
      };
    (me.prototype.addSub = function (e) {
      this.subs.push(e);
    }),
      (me.prototype.removeSub = function (e) {
        y(this.subs, e);
      }),
      (me.prototype.depend = function () {
        me.target && me.target.addDep(this);
      }),
      (me.prototype.notify = function () {
        var e = this.subs.slice();
        R.async ||
          e.sort(function (e, t) {
            return e.id - t.id;
          });
        for (var t = 0, n = e.length; t < n; t++) e[t].update();
      }),
      (me.target = null);
    var ye = [];

    function ge(e) {
      ye.push(e), (me.target = e);
    }

    function be() {
      ye.pop(), (me.target = ye[ye.length - 1]);
    }
    var _e = function (e, t, n, r, i, o, a, s) {
        (this.tag = e),
          (this.data = t),
          (this.children = n),
          (this.text = r),
          (this.elm = i),
          (this.ns = void 0),
          (this.context = o),
          (this.fnContext = void 0),
          (this.fnOptions = void 0),
          (this.fnScopeId = void 0),
          (this.key = t && t.key),
          (this.componentOptions = a),
          (this.componentInstance = void 0),
          (this.parent = void 0),
          (this.raw = !1),
          (this.isStatic = !1),
          (this.isRootInsert = !0),
          (this.isComment = !1),
          (this.isCloned = !1),
          (this.isOnce = !1),
          (this.asyncFactory = s),
          (this.asyncMeta = void 0),
          (this.isAsyncPlaceholder = !1);
      },
      we = {
        child: {
          configurable: !0,
        },
      };
    (we.child.get = function () {
      return this.componentInstance;
    }),
      Object.defineProperties(_e.prototype, we);
    var $e = function (e) {
      void 0 === e && (e = "");
      var t = new _e();
      return (t.text = e), (t.isComment = !0), t;
    };

    function xe(e) {
      return new _e(void 0, void 0, void 0, String(e));
    }

    function ke(e) {
      var t = new _e(
        e.tag,
        e.data,
        e.children && e.children.slice(),
        e.text,
        e.elm,
        e.context,
        e.componentOptions,
        e.asyncFactory
      );
      return (
        (t.ns = e.ns),
        (t.isStatic = e.isStatic),
        (t.key = e.key),
        (t.isComment = e.isComment),
        (t.fnContext = e.fnContext),
        (t.fnOptions = e.fnOptions),
        (t.fnScopeId = e.fnScopeId),
        (t.asyncMeta = e.asyncMeta),
        (t.isCloned = !0),
        t
      );
    }
    var Ce = Array.prototype,
      Ae = Object.create(Ce);
    ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
      function (e) {
        var t = Ce[e];
        B(Ae, e, function () {
          for (var n = [], r = arguments.length; r--; ) n[r] = arguments[r];
          var i,
            o = t.apply(this, n),
            a = this.__ob__;
          switch (e) {
            case "push":
            case "unshift":
              i = n;
              break;
            case "splice":
              i = n.slice(2);
              break;
          }
          return i && a.observeArray(i), a.dep.notify(), o;
        });
      }
    );
    var Se = Object.getOwnPropertyNames(Ae),
      Oe = !0;

    function Te(e) {
      Oe = e;
    }
    var Me = function (e) {
      (this.value = e),
        (this.dep = new me()),
        (this.vmCount = 0),
        B(e, "__ob__", this),
        Array.isArray(e)
          ? (J
              ? (function (e, t) {
                  e.__proto__ = t;
                })(e, Ae)
              : (function (e, t, n) {
                  for (var r = 0, i = n.length; r < i; r++) {
                    var o = n[r];
                    B(e, o, t[o]);
                  }
                })(e, Ae, Se),
            this.observeArray(e))
          : this.walk(e);
    };

    function je(e, t) {
      var n;
      if (o(e) && !(e instanceof _e))
        return (
          b(e, "__ob__") && e.__ob__ instanceof Me
            ? (n = e.__ob__)
            : Oe &&
              !ie() &&
              (Array.isArray(e) || c(e)) &&
              Object.isExtensible(e) &&
              !e._isVue &&
              (n = new Me(e)),
          t && n && n.vmCount++,
          n
        );
    }

    function Ie(e, t, n, r, i) {
      var o = new me(),
        a = Object.getOwnPropertyDescriptor(e, t);
      if (!a || !1 !== a.configurable) {
        var s = a && a.get,
          c = a && a.set;
        (s && !c) || 2 !== arguments.length || (n = e[t]);
        var u = !i && je(n);
        Object.defineProperty(e, t, {
          enumerable: !0,
          configurable: !0,
          get: function () {
            var t = s ? s.call(e) : n;
            return (
              me.target &&
                (o.depend(), u && (u.dep.depend(), Array.isArray(t) && De(t))),
              t
            );
          },
          set: function (t) {
            var a = s ? s.call(e) : n;
            t === a ||
              (t != t && a != a) ||
              (r && r(),
              (s && !c) ||
                (c ? c.call(e, t) : (n = t), (u = !i && je(t)), o.notify()));
          },
        });
      }
    }

    function Ne(e, n, r) {
      if (
        ((t(e) || i(e)) &&
          ue(
            "Cannot set reactive property on undefined, null, or primitive value: " +
              e
          ),
        Array.isArray(e) && l(n))
      )
        return (e.length = Math.max(e.length, n)), e.splice(n, 1, r), r;
      if (n in e && !(n in Object.prototype)) return (e[n] = r), r;
      var o = e.__ob__;
      return e._isVue || (o && o.vmCount)
        ? (ue(
            "Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option."
          ),
          r)
        : o
        ? (Ie(o.value, n, r), o.dep.notify(), r)
        : ((e[n] = r), r);
    }

    function Ee(e, n) {
      if (
        ((t(e) || i(e)) &&
          ue(
            "Cannot delete reactive property on undefined, null, or primitive value: " +
              e
          ),
        Array.isArray(e) && l(n))
      )
        e.splice(n, 1);
      else {
        var r = e.__ob__;
        e._isVue || (r && r.vmCount)
          ? ue(
              "Avoid deleting properties on a Vue instance or its root $data - just set it to null."
            )
          : b(e, n) && (delete e[n], r && r.dep.notify());
      }
    }

    function De(e) {
      for (var t = void 0, n = 0, r = e.length; n < r; n++)
        (t = e[n]) && t.__ob__ && t.__ob__.dep.depend(),
          Array.isArray(t) && De(t);
    }
    (Me.prototype.walk = function (e) {
      for (var t = Object.keys(e), n = 0; n < t.length; n++) Ie(e, t[n]);
    }),
      (Me.prototype.observeArray = function (e) {
        for (var t = 0, n = e.length; t < n; t++) je(e[t]);
      });
    var Le = R.optionMergeStrategies;

    function Fe(e, t) {
      if (!t) return e;
      for (
        var n, r, i, o = ce ? Reflect.ownKeys(t) : Object.keys(t), a = 0;
        a < o.length;
        a++
      )
        "__ob__" !== (n = o[a]) &&
          ((r = e[n]),
          (i = t[n]),
          b(e, n) ? r !== i && c(r) && c(i) && Fe(r, i) : Ne(e, n, i));
      return e;
    }

    function Pe(e, t, n) {
      return n
        ? function () {
            var r = "function" == typeof t ? t.call(n, n) : t,
              i = "function" == typeof e ? e.call(n, n) : e;
            return r ? Fe(r, i) : i;
          }
        : t
        ? e
          ? function () {
              return Fe(
                "function" == typeof t ? t.call(this, this) : t,
                "function" == typeof e ? e.call(this, this) : e
              );
            }
          : t
        : e;
    }

    function Re(e, t) {
      var n = t ? (e ? e.concat(t) : Array.isArray(t) ? t : [t]) : e;
      return n
        ? (function (e) {
            for (var t = [], n = 0; n < e.length; n++)
              -1 === t.indexOf(e[n]) && t.push(e[n]);
            return t;
          })(n)
        : n;
    }

    function Ue(e, t, n, r) {
      var i = Object.create(e || null);
      return t ? (Ve(r, t, n), O(i, t)) : i;
    }
    (Le.el = Le.propsData =
      function (e, t, n, r) {
        return (
          n ||
            ue(
              'option "' +
                r +
                '" can only be used during instance creation with the `new` keyword.'
            ),
          He(e, t)
        );
      }),
      (Le.data = function (e, t, n) {
        return n
          ? Pe(e, t, n)
          : t && "function" != typeof t
          ? (ue(
              'The "data" option should be a function that returns a per-instance value in component definitions.',
              n
            ),
            e)
          : Pe(e, t);
      }),
      P.forEach(function (e) {
        Le[e] = Re;
      }),
      F.forEach(function (e) {
        Le[e + "s"] = Ue;
      }),
      (Le.watch = function (e, t, n, r) {
        if ((e === te && (e = void 0), t === te && (t = void 0), !t))
          return Object.create(e || null);
        if ((Ve(r, t, n), !e)) return t;
        var i = {};
        for (var o in (O(i, e), t)) {
          var a = i[o],
            s = t[o];
          a && !Array.isArray(a) && (a = [a]),
            (i[o] = a ? a.concat(s) : Array.isArray(s) ? s : [s]);
        }
        return i;
      }),
      (Le.props =
        Le.methods =
        Le.inject =
        Le.computed =
          function (e, t, n, r) {
            if ((t && Ve(r, t, n), !e)) return t;
            var i = Object.create(null);
            return O(i, e), t && O(i, t), i;
          }),
      (Le.provide = Pe);
    var He = function (e, t) {
      return void 0 === t ? e : t;
    };

    function Be(e) {
      new RegExp("^[a-zA-Z][\\-\\.0-9_" + U.source + "]*$").test(e) ||
        ue(
          'Invalid component name: "' +
            e +
            '". Component names should conform to valid custom element name in html5 specification.'
        ),
        (h(e) || R.isReservedTag(e)) &&
          ue(
            "Do not use built-in or reserved HTML elements as component id: " +
              e
          );
    }

    function Ve(e, t, n) {
      c(t) ||
        ue(
          'Invalid value for option "' +
            e +
            '": expected an Object, but got ' +
            s(t) +
            ".",
          n
        );
    }

    function ze(e, t, n) {
      if (
        ((function (e) {
          for (var t in e.components) Be(t);
        })(t),
        "function" == typeof t && (t = t.options),
        (function (e, t) {
          var n = e.props;
          if (n) {
            var r,
              i,
              o = {};
            if (Array.isArray(n))
              for (r = n.length; r--; )
                "string" == typeof (i = n[r])
                  ? (o[$(i)] = {
                      type: null,
                    })
                  : ue("props must be strings when using array syntax.");
            else if (c(n))
              for (var a in n)
                (i = n[a]),
                  (o[$(a)] = c(i)
                    ? i
                    : {
                        type: i,
                      });
            else
              ue(
                'Invalid value for option "props": expected an Array or an Object, but got ' +
                  s(n) +
                  ".",
                t
              );
            e.props = o;
          }
        })(t, n),
        (function (e, t) {
          var n = e.inject;
          if (n) {
            var r = (e.inject = {});
            if (Array.isArray(n))
              for (var i = 0; i < n.length; i++)
                r[n[i]] = {
                  from: n[i],
                };
            else if (c(n))
              for (var o in n) {
                var a = n[o];
                r[o] = c(a)
                  ? O(
                      {
                        from: o,
                      },
                      a
                    )
                  : {
                      from: a,
                    };
              }
            else
              ue(
                'Invalid value for option "inject": expected an Array or an Object, but got ' +
                  s(n) +
                  ".",
                t
              );
          }
        })(t, n),
        (function (e) {
          var t = e.directives;
          if (t)
            for (var n in t) {
              var r = t[n];
              "function" == typeof r &&
                (t[n] = {
                  bind: r,
                  update: r,
                });
            }
        })(t),
        !t._base && (t.extends && (e = ze(e, t.extends, n)), t.mixins))
      )
        for (var r = 0, i = t.mixins.length; r < i; r++)
          e = ze(e, t.mixins[r], n);
      var o,
        a = {};
      for (o in e) u(o);
      for (o in t) b(e, o) || u(o);

      function u(r) {
        var i = Le[r] || He;
        a[r] = i(e[r], t[r], n, r);
      }
      return a;
    }

    function Je(e, t, n, r) {
      if ("string" == typeof n) {
        var i = e[t];
        if (b(i, n)) return i[n];
        var o = $(n);
        if (b(i, o)) return i[o];
        var a = x(o);
        if (b(i, a)) return i[a];
        var s = i[n] || i[o] || i[a];
        return (
          r && !s && ue("Failed to resolve " + t.slice(0, -1) + ": " + n, e), s
        );
      }
    }

    function qe(e, t, n, r) {
      var i = t[e],
        a = !b(n, e),
        c = n[e],
        u = Ye(Boolean, i.type);
      if (u > -1)
        if (a && !b(i, "default")) c = !1;
        else if ("" === c || c === C(e)) {
          var l = Ye(String, i.type);
          (l < 0 || u < l) && (c = !0);
        }
      if (void 0 === c) {
        c = (function (e, t, n) {
          if (!b(t, "default")) return;
          var r = t.default;
          o(r) &&
            ue(
              'Invalid default value for prop "' +
                n +
                '": Props with type Object/Array must use a factory function to return the default value.',
              e
            );
          if (
            e &&
            e.$options.propsData &&
            void 0 === e.$options.propsData[n] &&
            void 0 !== e._props[n]
          )
            return e._props[n];
          return "function" == typeof r && "Function" !== Ge(t.type)
            ? r.call(e)
            : r;
        })(r, i, e);
        var f = Oe;
        Te(!0), je(c), Te(f);
      }
      return (
        (function (e, t, n, r, i) {
          if (e.required && i)
            return void ue('Missing required prop: "' + t + '"', r);
          if (null == n && !e.required) return;
          var o = e.type,
            a = !o || !0 === o,
            c = [];
          if (o) {
            Array.isArray(o) || (o = [o]);
            for (var u = 0; u < o.length && !a; u++) {
              var l = We(n, o[u], r);
              c.push(l.expectedType || ""), (a = l.valid);
            }
          }
          var f = c.some(function (e) {
            return e;
          });
          if (!a && f)
            return void ue(
              (function (e, t, n) {
                var r =
                    'Invalid prop: type check failed for prop "' +
                    e +
                    '". Expected ' +
                    n.map(x).join(", "),
                  i = n[0],
                  o = s(t);
                1 === n.length &&
                  tt(i) &&
                  tt(typeof t) &&
                  !(function () {
                    var e = [],
                      t = arguments.length;
                    for (; t--; ) e[t] = arguments[t];
                    return e.some(function (e) {
                      return "boolean" === e.toLowerCase();
                    });
                  })(i, o) &&
                  (r += " with value " + Qe(t, i));
                (r += ", got " + o + " "),
                  tt(o) && (r += "with value " + Qe(t, o) + ".");
                return r;
              })(t, n, c),
              r
            );
          var p = e.validator;
          p &&
            (p(n) ||
              ue(
                'Invalid prop: custom validator check failed for prop "' +
                  t +
                  '".',
                r
              ));
        })(i, e, c, r, a),
        c
      );
    }
    var Ke = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;

    function We(e, t, n) {
      var r,
        i = Ge(t);
      if (Ke.test(i)) {
        var o = typeof e;
        (r = o === i.toLowerCase()) || "object" !== o || (r = e instanceof t);
      } else if ("Object" === i) r = c(e);
      else if ("Array" === i) r = Array.isArray(e);
      else
        try {
          r = e instanceof t;
        } catch (e) {
          ue('Invalid prop type: "' + String(t) + '" is not a constructor', n),
            (r = !1);
        }
      return {
        valid: r,
        expectedType: i,
      };
    }
    var Ze = /^\s*function (\w+)/;

    function Ge(e) {
      var t = e && e.toString().match(Ze);
      return t ? t[1] : "";
    }

    function Xe(e, t) {
      return Ge(e) === Ge(t);
    }

    function Ye(e, t) {
      if (!Array.isArray(t)) return Xe(t, e) ? 0 : -1;
      for (var n = 0, r = t.length; n < r; n++) if (Xe(t[n], e)) return n;
      return -1;
    }

    function Qe(e, t) {
      return "String" === t
        ? '"' + e + '"'
        : "Number" === t
        ? "" + Number(e)
        : "" + e;
    }
    var et = ["string", "number", "boolean"];

    function tt(e) {
      return et.some(function (t) {
        return e.toLowerCase() === t;
      });
    }

    function nt(e, t, n) {
      ge();
      try {
        if (t)
          for (var r = t; (r = r.$parent); ) {
            var i = r.$options.errorCaptured;
            if (i)
              for (var o = 0; o < i.length; o++)
                try {
                  if (!1 === i[o].call(r, e, t, n)) return;
                } catch (e) {
                  it(e, r, "errorCaptured hook");
                }
          }
        it(e, t, n);
      } finally {
        be();
      }
    }

    function rt(e, t, n, r, i) {
      var o;
      try {
        (o = n ? e.apply(t, n) : e.call(t)) &&
          !o._isVue &&
          f(o) &&
          !o._handled &&
          (o.catch(function (e) {
            return nt(e, r, i + " (Promise/async)");
          }),
          (o._handled = !0));
      } catch (e) {
        nt(e, r, i);
      }
      return o;
    }

    function it(e, t, n) {
      if (R.errorHandler)
        try {
          return R.errorHandler.call(null, e, t, n);
        } catch (t) {
          t !== e && ot(t, null, "config.errorHandler");
        }
      ot(e, t, n);
    }

    function ot(e, t, n) {
      if (
        (ue("Error in " + n + ': "' + e.toString() + '"', t),
        (!q && !K) || "undefined" == typeof console)
      )
        throw e;
    }
    var at,
      st,
      ct,
      ut = !1,
      lt = [],
      ft = !1;

    function pt() {
      ft = !1;
      var e = lt.slice(0);
      lt.length = 0;
      for (var t = 0; t < e.length; t++) e[t]();
    }
    if ("undefined" != typeof Promise && ae(Promise)) {
      var dt = Promise.resolve();
      (at = function () {
        dt.then(pt), Q && setTimeout(M);
      }),
        (ut = !0);
    } else if (
      G ||
      "undefined" == typeof MutationObserver ||
      (!ae(MutationObserver) &&
        "[object MutationObserverConstructor]" !== MutationObserver.toString())
    )
      at =
        "undefined" != typeof setImmediate && ae(setImmediate)
          ? function () {
              setImmediate(pt);
            }
          : function () {
              setTimeout(pt, 0);
            };
    else {
      var vt = 1,
        ht = new MutationObserver(pt),
        mt = document.createTextNode(String(vt));
      ht.observe(mt, {
        characterData: !0,
      }),
        (at = function () {
          (vt = (vt + 1) % 2), (mt.data = String(vt));
        }),
        (ut = !0);
    }

    function yt(e, t) {
      var n;
      if (
        (lt.push(function () {
          if (e)
            try {
              e.call(t);
            } catch (e) {
              nt(e, t, "nextTick");
            }
          else n && n(t);
        }),
        ft || ((ft = !0), at()),
        !e && "undefined" != typeof Promise)
      )
        return new Promise(function (e) {
          n = e;
        });
    }
    var gt,
      bt = q && window.performance;
    bt &&
      bt.mark &&
      bt.measure &&
      bt.clearMarks &&
      bt.clearMeasures &&
      ((st = function (e) {
        return bt.mark(e);
      }),
      (ct = function (e, t, n) {
        bt.measure(e, t, n), bt.clearMarks(t), bt.clearMarks(n);
      }));
    var _t = v(
        "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,require"
      ),
      wt = function (e, t) {
        ue(
          'Property or method "' +
            t +
            '" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
          e
        );
      },
      $t = function (e, t) {
        ue(
          'Property "' +
            t +
            '" must be accessed with "$data.' +
            t +
            '" because properties starting with "$" or "_" are not proxied in the Vue instance to prevent conflicts with Vue internals. See: https://vuejs.org/v2/api/#data',
          e
        );
      },
      xt = "undefined" != typeof Proxy && ae(Proxy);
    if (xt) {
      var kt = v("stop,prevent,self,ctrl,shift,alt,meta,exact");
      R.keyCodes = new Proxy(R.keyCodes, {
        set: function (e, t, n) {
          return kt(t)
            ? (ue(
                "Avoid overwriting built-in modifier in config.keyCodes: ." + t
              ),
              !1)
            : ((e[t] = n), !0);
        },
      });
    }
    var Ct = {
        has: function (e, t) {
          var n = t in e,
            r =
              _t(t) ||
              ("string" == typeof t && "_" === t.charAt(0) && !(t in e.$data));
          return n || r || (t in e.$data ? $t(e, t) : wt(e, t)), n || !r;
        },
      },
      At = {
        get: function (e, t) {
          return (
            "string" != typeof t ||
              t in e ||
              (t in e.$data ? $t(e, t) : wt(e, t)),
            e[t]
          );
        },
      };
    gt = function (e) {
      if (xt) {
        var t = e.$options,
          n = t.render && t.render._withStripped ? At : Ct;
        e._renderProxy = new Proxy(e, n);
      } else e._renderProxy = e;
    };
    var St = new se();

    function Ot(e) {
      Tt(e, St), St.clear();
    }

    function Tt(e, t) {
      var n,
        r,
        i = Array.isArray(e);
      if (!((!i && !o(e)) || Object.isFrozen(e) || e instanceof _e)) {
        if (e.__ob__) {
          var a = e.__ob__.dep.id;
          if (t.has(a)) return;
          t.add(a);
        }
        if (i) for (n = e.length; n--; ) Tt(e[n], t);
        else for (n = (r = Object.keys(e)).length; n--; ) Tt(e[r[n]], t);
      }
    }
    var Mt = _(function (e) {
      var t = "&" === e.charAt(0),
        n = "~" === (e = t ? e.slice(1) : e).charAt(0),
        r = "!" === (e = n ? e.slice(1) : e).charAt(0);
      return {
        name: (e = r ? e.slice(1) : e),
        once: n,
        capture: r,
        passive: t,
      };
    });

    function jt(e, t) {
      function n() {
        var e = arguments,
          r = n.fns;
        if (!Array.isArray(r)) return rt(r, null, arguments, t, "v-on handler");
        for (var i = r.slice(), o = 0; o < i.length; o++)
          rt(i[o], null, e, t, "v-on handler");
      }
      return (n.fns = e), n;
    }

    function It(e, n, i, o, a, s) {
      var c, u, l, f;
      for (c in e)
        (u = e[c]),
          (l = n[c]),
          (f = Mt(c)),
          t(u)
            ? ue(
                'Invalid handler for event "' + f.name + '": got ' + String(u),
                s
              )
            : t(l)
            ? (t(u.fns) && (u = e[c] = jt(u, s)),
              r(f.once) && (u = e[c] = a(f.name, u, f.capture)),
              i(f.name, u, f.capture, f.passive, f.params))
            : u !== l && ((l.fns = u), (e[c] = l));
      for (c in n) t(e[c]) && o((f = Mt(c)).name, n[c], f.capture);
    }

    function Nt(e, i, o) {
      var a;
      e instanceof _e && (e = e.data.hook || (e.data.hook = {}));
      var s = e[i];

      function c() {
        o.apply(this, arguments), y(a.fns, c);
      }
      t(s)
        ? (a = jt([c]))
        : n(s.fns) && r(s.merged)
        ? (a = s).fns.push(c)
        : (a = jt([s, c])),
        (a.merged = !0),
        (e[i] = a);
    }

    function Et(e, t, r, i, o) {
      if (n(t)) {
        if (b(t, r)) return (e[r] = t[r]), o || delete t[r], !0;
        if (b(t, i)) return (e[r] = t[i]), o || delete t[i], !0;
      }
      return !1;
    }

    function Dt(e) {
      return i(e) ? [xe(e)] : Array.isArray(e) ? Ft(e) : void 0;
    }

    function Lt(e) {
      return n(e) && n(e.text) && !1 === e.isComment;
    }

    function Ft(e, o) {
      var a,
        s,
        c,
        u,
        l = [];
      for (a = 0; a < e.length; a++)
        t((s = e[a])) ||
          "boolean" == typeof s ||
          ((u = l[(c = l.length - 1)]),
          Array.isArray(s)
            ? s.length > 0 &&
              (Lt((s = Ft(s, (o || "") + "_" + a))[0]) &&
                Lt(u) &&
                ((l[c] = xe(u.text + s[0].text)), s.shift()),
              l.push.apply(l, s))
            : i(s)
            ? Lt(u)
              ? (l[c] = xe(u.text + s))
              : "" !== s && l.push(xe(s))
            : Lt(s) && Lt(u)
            ? (l[c] = xe(u.text + s.text))
            : (r(e._isVList) &&
                n(s.tag) &&
                t(s.key) &&
                n(o) &&
                (s.key = "__vlist" + o + "_" + a + "__"),
              l.push(s)));
      return l;
    }

    function Pt(e, t) {
      if (e) {
        for (
          var n = Object.create(null),
            r = ce ? Reflect.ownKeys(e) : Object.keys(e),
            i = 0;
          i < r.length;
          i++
        ) {
          var o = r[i];
          if ("__ob__" !== o) {
            for (var a = e[o].from, s = t; s; ) {
              if (s._provided && b(s._provided, a)) {
                n[o] = s._provided[a];
                break;
              }
              s = s.$parent;
            }
            if (!s)
              if ("default" in e[o]) {
                var c = e[o].default;
                n[o] = "function" == typeof c ? c.call(t) : c;
              } else ue('Injection "' + o + '" not found', t);
          }
        }
        return n;
      }
    }

    function Rt(e, t) {
      if (!e || !e.length) return {};
      for (var n = {}, r = 0, i = e.length; r < i; r++) {
        var o = e[r],
          a = o.data;
        if (
          (a && a.attrs && a.attrs.slot && delete a.attrs.slot,
          (o.context !== t && o.fnContext !== t) || !a || null == a.slot)
        )
          (n.default || (n.default = [])).push(o);
        else {
          var s = a.slot,
            c = n[s] || (n[s] = []);
          "template" === o.tag ? c.push.apply(c, o.children || []) : c.push(o);
        }
      }
      for (var u in n) n[u].every(Ut) && delete n[u];
      return n;
    }

    function Ut(e) {
      return (e.isComment && !e.asyncFactory) || " " === e.text;
    }

    function Ht(e) {
      return e.isComment && e.asyncFactory;
    }

    function Bt(t, n, r) {
      var i,
        o = Object.keys(n).length > 0,
        a = t ? !!t.$stable : !o,
        s = t && t.$key;
      if (t) {
        if (t._normalized) return t._normalized;
        if (a && r && r !== e && s === r.$key && !o && !r.$hasNormal) return r;
        for (var c in ((i = {}), t))
          t[c] && "$" !== c[0] && (i[c] = Vt(n, c, t[c]));
      } else i = {};
      for (var u in n) u in i || (i[u] = zt(n, u));
      return (
        t && Object.isExtensible(t) && (t._normalized = i),
        B(i, "$stable", a),
        B(i, "$key", s),
        B(i, "$hasNormal", o),
        i
      );
    }

    function Vt(e, t, n) {
      var r = function () {
        var e = arguments.length ? n.apply(null, arguments) : n({}),
          t =
            (e =
              e && "object" == typeof e && !Array.isArray(e) ? [e] : Dt(e)) &&
            e[0];
        return e && (!t || (1 === e.length && t.isComment && !Ht(t)))
          ? void 0
          : e;
      };
      return (
        n.proxy &&
          Object.defineProperty(e, t, {
            get: r,
            enumerable: !0,
            configurable: !0,
          }),
        r
      );
    }

    function zt(e, t) {
      return function () {
        return e[t];
      };
    }

    function Jt(e, t) {
      var r, i, a, s, c;
      if (Array.isArray(e) || "string" == typeof e)
        for (r = new Array(e.length), i = 0, a = e.length; i < a; i++)
          r[i] = t(e[i], i);
      else if ("number" == typeof e)
        for (r = new Array(e), i = 0; i < e; i++) r[i] = t(i + 1, i);
      else if (o(e))
        if (ce && e[Symbol.iterator]) {
          r = [];
          for (var u = e[Symbol.iterator](), l = u.next(); !l.done; )
            r.push(t(l.value, r.length)), (l = u.next());
        } else
          for (
            s = Object.keys(e), r = new Array(s.length), i = 0, a = s.length;
            i < a;
            i++
          )
            (c = s[i]), (r[i] = t(e[c], c, i));
      return n(r) || (r = []), (r._isVList = !0), r;
    }

    function qt(e, t, n, r) {
      var i,
        a = this.$scopedSlots[e];
      a
        ? ((n = n || {}),
          r &&
            (o(r) || ue("slot v-bind without argument expects an Object", this),
            (n = O(O({}, r), n))),
          (i = a(n) || ("function" == typeof t ? t() : t)))
        : (i = this.$slots[e] || ("function" == typeof t ? t() : t));
      var s = n && n.slot;
      return s
        ? this.$createElement(
            "template",
            {
              slot: s,
            },
            i
          )
        : i;
    }

    function Kt(e) {
      return Je(this.$options, "filters", e, !0) || I;
    }

    function Wt(e, t) {
      return Array.isArray(e) ? -1 === e.indexOf(t) : e !== t;
    }

    function Zt(e, t, n, r, i) {
      var o = R.keyCodes[t] || n;
      return i && r && !R.keyCodes[t]
        ? Wt(i, r)
        : o
        ? Wt(o, e)
        : r
        ? C(r) !== t
        : void 0 === e;
    }

    function Gt(e, t, n, r, i) {
      if (n)
        if (o(n)) {
          var a;
          Array.isArray(n) && (n = T(n));
          var s = function (o) {
            if ("class" === o || "style" === o || m(o)) a = e;
            else {
              var s = e.attrs && e.attrs.type;
              a =
                r || R.mustUseProp(t, s, o)
                  ? e.domProps || (e.domProps = {})
                  : e.attrs || (e.attrs = {});
            }
            var c = $(o),
              u = C(o);
            c in a ||
              u in a ||
              ((a[o] = n[o]),
              i &&
                ((e.on || (e.on = {}))["update:" + o] = function (e) {
                  n[o] = e;
                }));
          };
          for (var c in n) s(c);
        } else
          ue("v-bind without argument expects an Object or Array value", this);
      return e;
    }

    function Xt(e, t) {
      var n = this._staticTrees || (this._staticTrees = []),
        r = n[e];
      return (
        (r && !t) ||
          Qt(
            (r = n[e] =
              this.$options.staticRenderFns[e].call(
                this._renderProxy,
                null,
                this
              )),
            "__static__" + e,
            !1
          ),
        r
      );
    }

    function Yt(e, t, n) {
      return Qt(e, "__once__" + t + (n ? "_" + n : ""), !0), e;
    }

    function Qt(e, t, n) {
      if (Array.isArray(e))
        for (var r = 0; r < e.length; r++)
          e[r] && "string" != typeof e[r] && en(e[r], t + "_" + r, n);
      else en(e, t, n);
    }

    function en(e, t, n) {
      (e.isStatic = !0), (e.key = t), (e.isOnce = n);
    }

    function tn(e, t) {
      if (t)
        if (c(t)) {
          var n = (e.on = e.on ? O({}, e.on) : {});
          for (var r in t) {
            var i = n[r],
              o = t[r];
            n[r] = i ? [].concat(i, o) : o;
          }
        } else ue("v-on without argument expects an Object value", this);
      return e;
    }

    function nn(e, t, n, r) {
      t = t || {
        $stable: !n,
      };
      for (var i = 0; i < e.length; i++) {
        var o = e[i];
        Array.isArray(o)
          ? nn(o, t, n)
          : o && (o.proxy && (o.fn.proxy = !0), (t[o.key] = o.fn));
      }
      return r && (t.$key = r), t;
    }

    function rn(e, t) {
      for (var n = 0; n < t.length; n += 2) {
        var r = t[n];
        "string" == typeof r && r
          ? (e[t[n]] = t[n + 1])
          : "" !== r &&
            null !== r &&
            ue(
              "Invalid value for dynamic directive argument (expected string or null): " +
                r,
              this
            );
      }
      return e;
    }

    function on(e, t) {
      return "string" == typeof e ? t + e : e;
    }

    function an(e) {
      (e._o = Yt),
        (e._n = d),
        (e._s = p),
        (e._l = Jt),
        (e._t = qt),
        (e._q = N),
        (e._i = E),
        (e._m = Xt),
        (e._f = Kt),
        (e._k = Zt),
        (e._b = Gt),
        (e._v = xe),
        (e._e = $e),
        (e._u = nn),
        (e._g = tn),
        (e._d = rn),
        (e._p = on);
    }

    function sn(t, n, i, o, a) {
      var s,
        c = this,
        u = a.options;
      b(o, "_uid")
        ? ((s = Object.create(o))._original = o)
        : ((s = o), (o = o._original));
      var l = r(u._compiled),
        f = !l;
      (this.data = t),
        (this.props = n),
        (this.children = i),
        (this.parent = o),
        (this.listeners = t.on || e),
        (this.injections = Pt(u.inject, o)),
        (this.slots = function () {
          return c.$slots || Bt(t.scopedSlots, (c.$slots = Rt(i, o))), c.$slots;
        }),
        Object.defineProperty(this, "scopedSlots", {
          enumerable: !0,
          get: function () {
            return Bt(t.scopedSlots, this.slots());
          },
        }),
        l &&
          ((this.$options = u),
          (this.$slots = this.slots()),
          (this.$scopedSlots = Bt(t.scopedSlots, this.$slots))),
        u._scopeId
          ? (this._c = function (e, t, n, r) {
              var i = vn(s, e, t, n, r, f);
              return (
                i &&
                  !Array.isArray(i) &&
                  ((i.fnScopeId = u._scopeId), (i.fnContext = o)),
                i
              );
            })
          : (this._c = function (e, t, n, r) {
              return vn(s, e, t, n, r, f);
            });
    }

    function cn(e, t, n, r, i) {
      var o = ke(e);
      return (
        (o.fnContext = n),
        (o.fnOptions = r),
        ((o.devtoolsMeta = o.devtoolsMeta || {}).renderContext = i),
        t.slot && ((o.data || (o.data = {})).slot = t.slot),
        o
      );
    }

    function un(e, t) {
      for (var n in t) e[$(n)] = t[n];
    }
    an(sn.prototype);
    var ln = {
        init: function (e, t) {
          if (
            e.componentInstance &&
            !e.componentInstance._isDestroyed &&
            e.data.keepAlive
          ) {
            var r = e;
            ln.prepatch(r, r);
          } else {
            (e.componentInstance = (function (e, t) {
              var r = {
                  _isComponent: !0,
                  _parentVnode: e,
                  parent: t,
                },
                i = e.data.inlineTemplate;
              n(i) &&
                ((r.render = i.render),
                (r.staticRenderFns = i.staticRenderFns));
              return new e.componentOptions.Ctor(r);
            })(e, kn)).$mount(t ? e.elm : void 0, t);
          }
        },
        prepatch: function (t, n) {
          var r = n.componentOptions;
          !(function (t, n, r, i, o) {
            Cn = !0;
            var a = i.data.scopedSlots,
              s = t.$scopedSlots,
              c = !!(
                (a && !a.$stable) ||
                (s !== e && !s.$stable) ||
                (a && t.$scopedSlots.$key !== a.$key) ||
                (!a && t.$scopedSlots.$key)
              ),
              u = !!(o || t.$options._renderChildren || c);
            (t.$options._parentVnode = i),
              (t.$vnode = i),
              t._vnode && (t._vnode.parent = i);
            if (
              ((t.$options._renderChildren = o),
              (t.$attrs = i.data.attrs || e),
              (t.$listeners = r || e),
              n && t.$options.props)
            ) {
              Te(!1);
              for (
                var l = t._props, f = t.$options._propKeys || [], p = 0;
                p < f.length;
                p++
              ) {
                var d = f[p],
                  v = t.$options.props;
                l[d] = qe(d, v, n, t);
              }
              Te(!0), (t.$options.propsData = n);
            }
            r = r || e;
            var h = t.$options._parentListeners;
            (t.$options._parentListeners = r),
              xn(t, r, h),
              u && ((t.$slots = Rt(o, i.context)), t.$forceUpdate());
            Cn = !1;
          })(
            (n.componentInstance = t.componentInstance),
            r.propsData,
            r.listeners,
            n,
            r.children
          );
        },
        insert: function (e) {
          var t,
            n = e.context,
            r = e.componentInstance;
          r._isMounted || ((r._isMounted = !0), Mn(r, "mounted")),
            e.data.keepAlive &&
              (n._isMounted
                ? (((t = r)._inactive = !1), In.push(t))
                : On(r, !0));
        },
        destroy: function (e) {
          var t = e.componentInstance;
          t._isDestroyed || (e.data.keepAlive ? Tn(t, !0) : t.$destroy());
        },
      },
      fn = Object.keys(ln);

    function pn(i, a, s, c, u) {
      if (!t(i)) {
        var l = s.$options._base;
        if ((o(i) && (i = l.extend(i)), "function" == typeof i)) {
          var p;
          if (
            t(i.cid) &&
            ((i = (function (e, i) {
              if (r(e.error) && n(e.errorComp)) return e.errorComp;
              if (n(e.resolved)) return e.resolved;
              var a = yn;
              a &&
                n(e.owners) &&
                -1 === e.owners.indexOf(a) &&
                e.owners.push(a);
              if (r(e.loading) && n(e.loadingComp)) return e.loadingComp;
              if (a && !n(e.owners)) {
                var s = (e.owners = [a]),
                  c = !0,
                  u = null,
                  l = null;
                a.$on("hook:destroyed", function () {
                  return y(s, a);
                });
                var p = function (e) {
                    for (var t = 0, n = s.length; t < n; t++)
                      s[t].$forceUpdate();
                    e &&
                      ((s.length = 0),
                      null !== u && (clearTimeout(u), (u = null)),
                      null !== l && (clearTimeout(l), (l = null)));
                  },
                  d = D(function (t) {
                    (e.resolved = gn(t, i)), c ? (s.length = 0) : p(!0);
                  }),
                  v = D(function (t) {
                    ue(
                      "Failed to resolve async component: " +
                        String(e) +
                        (t ? "\nReason: " + t : "")
                    ),
                      n(e.errorComp) && ((e.error = !0), p(!0));
                  }),
                  h = e(d, v);
                return (
                  o(h) &&
                    (f(h)
                      ? t(e.resolved) && h.then(d, v)
                      : f(h.component) &&
                        (h.component.then(d, v),
                        n(h.error) && (e.errorComp = gn(h.error, i)),
                        n(h.loading) &&
                          ((e.loadingComp = gn(h.loading, i)),
                          0 === h.delay
                            ? (e.loading = !0)
                            : (u = setTimeout(function () {
                                (u = null),
                                  t(e.resolved) &&
                                    t(e.error) &&
                                    ((e.loading = !0), p(!1));
                              }, h.delay || 200))),
                        n(h.timeout) &&
                          (l = setTimeout(function () {
                            (l = null),
                              t(e.resolved) &&
                                v("timeout (" + h.timeout + "ms)");
                          }, h.timeout)))),
                  (c = !1),
                  e.loading ? e.loadingComp : e.resolved
                );
              }
            })((p = i), l)),
            void 0 === i)
          )
            return (function (e, t, n, r, i) {
              var o = $e();
              return (
                (o.asyncFactory = e),
                (o.asyncMeta = {
                  data: t,
                  context: n,
                  children: r,
                  tag: i,
                }),
                o
              );
            })(p, a, s, c, u);
          (a = a || {}),
            Qn(i),
            n(a.model) &&
              (function (e, t) {
                var r = (e.model && e.model.prop) || "value",
                  i = (e.model && e.model.event) || "input";
                (t.attrs || (t.attrs = {}))[r] = t.model.value;
                var o = t.on || (t.on = {}),
                  a = o[i],
                  s = t.model.callback;
                n(a)
                  ? (Array.isArray(a) ? -1 === a.indexOf(s) : a !== s) &&
                    (o[i] = [s].concat(a))
                  : (o[i] = s);
              })(i.options, a);
          var d = (function (e, r, i) {
            var o = r.options.props;
            if (!t(o)) {
              var a = {},
                s = e.attrs,
                c = e.props;
              if (n(s) || n(c))
                for (var u in o) {
                  var l = C(u),
                    f = u.toLowerCase();
                  u !== f && s && b(s, f) && le(fe(i || r)),
                    Et(a, c, u, l, !0) || Et(a, s, u, l, !1);
                }
              return a;
            }
          })(a, i, u);
          if (r(i.options.functional))
            return (function (t, r, i, o, a) {
              var s = t.options,
                c = {},
                u = s.props;
              if (n(u)) for (var l in u) c[l] = qe(l, u, r || e);
              else n(i.attrs) && un(c, i.attrs), n(i.props) && un(c, i.props);
              var f = new sn(i, c, a, o, t),
                p = s.render.call(null, f._c, f);
              if (p instanceof _e) return cn(p, i, f.parent, s, f);
              if (Array.isArray(p)) {
                for (
                  var d = Dt(p) || [], v = new Array(d.length), h = 0;
                  h < d.length;
                  h++
                )
                  v[h] = cn(d[h], i, f.parent, s, f);
                return v;
              }
            })(i, d, a, s, c);
          var v = a.on;
          if (((a.on = a.nativeOn), r(i.options.abstract))) {
            var h = a.slot;
            (a = {}), h && (a.slot = h);
          }
          !(function (e) {
            for (var t = e.hook || (e.hook = {}), n = 0; n < fn.length; n++) {
              var r = fn[n],
                i = t[r],
                o = ln[r];
              i === o || (i && i._merged) || (t[r] = i ? dn(o, i) : o);
            }
          })(a);
          var m = i.options.name || u;
          return new _e(
            "vue-component-" + i.cid + (m ? "-" + m : ""),
            a,
            void 0,
            void 0,
            void 0,
            s,
            {
              Ctor: i,
              propsData: d,
              listeners: v,
              tag: u,
              children: c,
            },
            p
          );
        }
        ue("Invalid Component definition: " + String(i), s);
      }
    }

    function dn(e, t) {
      var n = function (n, r) {
        e(n, r), t(n, r);
      };
      return (n._merged = !0), n;
    }

    function vn(e, t, a, s, c, u) {
      return (
        (Array.isArray(a) || i(a)) && ((c = s), (s = a), (a = void 0)),
        r(u) && (c = 2),
        (function (e, t, r, a, s) {
          if (n(r) && n(r.__ob__))
            return (
              ue(
                "Avoid using observed data object as vnode data: " +
                  JSON.stringify(r) +
                  "\nAlways create fresh vnode data objects in each render!",
                e
              ),
              $e()
            );
          n(r) && n(r.is) && (t = r.is);
          if (!t) return $e();
          n(r) &&
            n(r.key) &&
            !i(r.key) &&
            ue(
              "Avoid using non-primitive value as key, use string/number value instead.",
              e
            );
          Array.isArray(a) &&
            "function" == typeof a[0] &&
            (((r = r || {}).scopedSlots = {
              default: a[0],
            }),
            (a.length = 0));
          2 === s
            ? (a = Dt(a))
            : 1 === s &&
              (a = (function (e) {
                for (var t = 0; t < e.length; t++)
                  if (Array.isArray(e[t]))
                    return Array.prototype.concat.apply([], e);
                return e;
              })(a));
          var c, u;
          if ("string" == typeof t) {
            var l;
            (u = (e.$vnode && e.$vnode.ns) || R.getTagNamespace(t)),
              R.isReservedTag(t)
                ? (n(r) &&
                    n(r.nativeOn) &&
                    "component" !== r.tag &&
                    ue(
                      "The .native modifier for v-on is only valid on components but it was used on <" +
                        t +
                        ">.",
                      e
                    ),
                  (c = new _e(
                    R.parsePlatformTagName(t),
                    r,
                    a,
                    void 0,
                    void 0,
                    e
                  )))
                : (c =
                    (r && r.pre) || !n((l = Je(e.$options, "components", t)))
                      ? new _e(t, r, a, void 0, void 0, e)
                      : pn(l, r, e, a, t));
          } else c = pn(t, r, e, a);
          return Array.isArray(c)
            ? c
            : n(c)
            ? (n(u) && hn(c, u),
              n(r) &&
                (function (e) {
                  o(e.style) && Ot(e.style);
                  o(e.class) && Ot(e.class);
                })(r),
              c)
            : $e();
        })(e, t, a, s, c)
      );
    }

    function hn(e, i, o) {
      if (
        ((e.ns = i),
        "foreignObject" === e.tag && ((i = void 0), (o = !0)),
        n(e.children))
      )
        for (var a = 0, s = e.children.length; a < s; a++) {
          var c = e.children[a];
          n(c.tag) && (t(c.ns) || (r(o) && "svg" !== c.tag)) && hn(c, i, o);
        }
    }
    var mn,
      yn = null;

    function gn(e, t) {
      return (
        (e.__esModule || (ce && "Module" === e[Symbol.toStringTag])) &&
          (e = e.default),
        o(e) ? t.extend(e) : e
      );
    }

    function bn(e) {
      if (Array.isArray(e))
        for (var t = 0; t < e.length; t++) {
          var r = e[t];
          if (n(r) && (n(r.componentOptions) || Ht(r))) return r;
        }
    }

    function _n(e, t) {
      mn.$on(e, t);
    }

    function wn(e, t) {
      mn.$off(e, t);
    }

    function $n(e, t) {
      var n = mn;
      return function r() {
        var i = t.apply(null, arguments);
        null !== i && n.$off(e, r);
      };
    }

    function xn(e, t, n) {
      (mn = e), It(t, n || {}, _n, wn, $n, e), (mn = void 0);
    }
    var kn = null,
      Cn = !1;

    function An(e) {
      var t = kn;
      return (
        (kn = e),
        function () {
          kn = t;
        }
      );
    }

    function Sn(e) {
      for (; e && (e = e.$parent); ) if (e._inactive) return !0;
      return !1;
    }

    function On(e, t) {
      if (t) {
        if (((e._directInactive = !1), Sn(e))) return;
      } else if (e._directInactive) return;
      if (e._inactive || null === e._inactive) {
        e._inactive = !1;
        for (var n = 0; n < e.$children.length; n++) On(e.$children[n]);
        Mn(e, "activated");
      }
    }

    function Tn(e, t) {
      if (!((t && ((e._directInactive = !0), Sn(e))) || e._inactive)) {
        e._inactive = !0;
        for (var n = 0; n < e.$children.length; n++) Tn(e.$children[n]);
        Mn(e, "deactivated");
      }
    }

    function Mn(e, t) {
      ge();
      var n = e.$options[t],
        r = t + " hook";
      if (n) for (var i = 0, o = n.length; i < o; i++) rt(n[i], e, null, e, r);
      e._hasHookEvent && e.$emit("hook:" + t), be();
    }
    var jn = [],
      In = [],
      Nn = {},
      En = {},
      Dn = !1,
      Ln = !1,
      Fn = 0;
    var Pn = 0,
      Rn = Date.now;
    if (q && !G) {
      var Un = window.performance;
      Un &&
        "function" == typeof Un.now &&
        Rn() > document.createEvent("Event").timeStamp &&
        (Rn = function () {
          return Un.now();
        });
    }

    function Hn() {
      var e, t;
      for (
        Pn = Rn(),
          Ln = !0,
          jn.sort(function (e, t) {
            return e.id - t.id;
          }),
          Fn = 0;
        Fn < jn.length;
        Fn++
      )
        if (
          ((e = jn[Fn]).before && e.before(),
          (t = e.id),
          (Nn[t] = null),
          e.run(),
          null != Nn[t] && ((En[t] = (En[t] || 0) + 1), En[t] > 100))
        ) {
          ue(
            "You may have an infinite update loop " +
              (e.user
                ? 'in watcher with expression "' + e.expression + '"'
                : "in a component render function."),
            e.vm
          );
          break;
        }
      var n = In.slice(),
        r = jn.slice();
      (Fn = jn.length = In.length = 0),
        (Nn = {}),
        (En = {}),
        (Dn = Ln = !1),
        (function (e) {
          for (var t = 0; t < e.length; t++)
            (e[t]._inactive = !0), On(e[t], !0);
        })(n),
        (function (e) {
          var t = e.length;
          for (; t--; ) {
            var n = e[t],
              r = n.vm;
            r._watcher === n &&
              r._isMounted &&
              !r._isDestroyed &&
              Mn(r, "updated");
          }
        })(r),
        oe && R.devtools && oe.emit("flush");
    }
    var Bn = 0,
      Vn = function (e, t, n, r, i) {
        (this.vm = e),
          i && (e._watcher = this),
          e._watchers.push(this),
          r
            ? ((this.deep = !!r.deep),
              (this.user = !!r.user),
              (this.lazy = !!r.lazy),
              (this.sync = !!r.sync),
              (this.before = r.before))
            : (this.deep = this.user = this.lazy = this.sync = !1),
          (this.cb = n),
          (this.id = ++Bn),
          (this.active = !0),
          (this.dirty = this.lazy),
          (this.deps = []),
          (this.newDeps = []),
          (this.depIds = new se()),
          (this.newDepIds = new se()),
          (this.expression = t.toString()),
          "function" == typeof t
            ? (this.getter = t)
            : ((this.getter = (function (e) {
                if (!V.test(e)) {
                  var t = e.split(".");
                  return function (e) {
                    for (var n = 0; n < t.length; n++) {
                      if (!e) return;
                      e = e[t[n]];
                    }
                    return e;
                  };
                }
              })(t)),
              this.getter ||
                ((this.getter = M),
                ue(
                  'Failed watching path: "' +
                    t +
                    '" Watcher only accepts simple dot-delimited paths. For full control, use a function instead.',
                  e
                ))),
          (this.value = this.lazy ? void 0 : this.get());
      };
    (Vn.prototype.get = function () {
      var e;
      ge(this);
      var t = this.vm;
      try {
        e = this.getter.call(t, t);
      } catch (e) {
        if (!this.user) throw e;
        nt(e, t, 'getter for watcher "' + this.expression + '"');
      } finally {
        this.deep && Ot(e), be(), this.cleanupDeps();
      }
      return e;
    }),
      (Vn.prototype.addDep = function (e) {
        var t = e.id;
        this.newDepIds.has(t) ||
          (this.newDepIds.add(t),
          this.newDeps.push(e),
          this.depIds.has(t) || e.addSub(this));
      }),
      (Vn.prototype.cleanupDeps = function () {
        for (var e = this.deps.length; e--; ) {
          var t = this.deps[e];
          this.newDepIds.has(t.id) || t.removeSub(this);
        }
        var n = this.depIds;
        (this.depIds = this.newDepIds),
          (this.newDepIds = n),
          this.newDepIds.clear(),
          (n = this.deps),
          (this.deps = this.newDeps),
          (this.newDeps = n),
          (this.newDeps.length = 0);
      }),
      (Vn.prototype.update = function () {
        this.lazy
          ? (this.dirty = !0)
          : this.sync
          ? this.run()
          : (function (e) {
              var t = e.id;
              if (null == Nn[t]) {
                if (((Nn[t] = !0), Ln)) {
                  for (var n = jn.length - 1; n > Fn && jn[n].id > e.id; ) n--;
                  jn.splice(n + 1, 0, e);
                } else jn.push(e);
                if (!Dn) {
                  if (((Dn = !0), !R.async)) return void Hn();
                  yt(Hn);
                }
              }
            })(this);
      }),
      (Vn.prototype.run = function () {
        if (this.active) {
          var e = this.get();
          if (e !== this.value || o(e) || this.deep) {
            var t = this.value;
            if (((this.value = e), this.user)) {
              var n = 'callback for watcher "' + this.expression + '"';
              rt(this.cb, this.vm, [e, t], this.vm, n);
            } else this.cb.call(this.vm, e, t);
          }
        }
      }),
      (Vn.prototype.evaluate = function () {
        (this.value = this.get()), (this.dirty = !1);
      }),
      (Vn.prototype.depend = function () {
        for (var e = this.deps.length; e--; ) this.deps[e].depend();
      }),
      (Vn.prototype.teardown = function () {
        if (this.active) {
          this.vm._isBeingDestroyed || y(this.vm._watchers, this);
          for (var e = this.deps.length; e--; ) this.deps[e].removeSub(this);
          this.active = !1;
        }
      });
    var zn = {
      enumerable: !0,
      configurable: !0,
      get: M,
      set: M,
    };

    function Jn(e, t, n) {
      (zn.get = function () {
        return this[t][n];
      }),
        (zn.set = function (e) {
          this[t][n] = e;
        }),
        Object.defineProperty(e, n, zn);
    }

    function qn(e) {
      e._watchers = [];
      var t = e.$options;
      t.props &&
        (function (e, t) {
          var n = e.$options.propsData || {},
            r = (e._props = {}),
            i = (e.$options._propKeys = []),
            o = !e.$parent;
          o || Te(!1);
          var a = function (a) {
            i.push(a);
            var s = qe(a, t, n, e),
              c = C(a);
            (m(c) || R.isReservedAttr(c)) &&
              ue(
                '"' +
                  c +
                  '" is a reserved attribute and cannot be used as component prop.',
                e
              ),
              Ie(r, a, s, function () {
                o ||
                  Cn ||
                  ue(
                    "Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: \"" +
                      a +
                      '"',
                    e
                  );
              }),
              a in e || Jn(e, "_props", a);
          };
          for (var s in t) a(s);
          Te(!0);
        })(e, t.props),
        t.methods &&
          (function (e, t) {
            var n = e.$options.props;
            for (var r in t)
              "function" != typeof t[r] &&
                ue(
                  'Method "' +
                    r +
                    '" has type "' +
                    typeof t[r] +
                    '" in the component definition. Did you reference the function correctly?',
                  e
                ),
                n &&
                  b(n, r) &&
                  ue(
                    'Method "' + r + '" has already been defined as a prop.',
                    e
                  ),
                r in e &&
                  H(r) &&
                  ue(
                    'Method "' +
                      r +
                      '" conflicts with an existing Vue instance method. Avoid defining component methods that start with _ or $.'
                  ),
                (e[r] = "function" != typeof t[r] ? M : A(t[r], e));
          })(e, t.methods),
        t.data
          ? (function (e) {
              var t = e.$options.data;
              c(
                (t = e._data =
                  "function" == typeof t
                    ? (function (e, t) {
                        ge();
                        try {
                          return e.call(t, t);
                        } catch (e) {
                          return nt(e, t, "data()"), {};
                        } finally {
                          be();
                        }
                      })(t, e)
                    : t || {})
              ) ||
                ((t = {}),
                ue(
                  "data functions should return an object:\nhttps://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
                  e
                ));
              var n = Object.keys(t),
                r = e.$options.props,
                i = e.$options.methods,
                o = n.length;
              for (; o--; ) {
                var a = n[o];
                i &&
                  b(i, a) &&
                  ue(
                    'Method "' +
                      a +
                      '" has already been defined as a data property.',
                    e
                  ),
                  r && b(r, a)
                    ? ue(
                        'The data property "' +
                          a +
                          '" is already declared as a prop. Use prop default value instead.',
                        e
                      )
                    : H(a) || Jn(e, "_data", a);
              }
              je(t, !0);
            })(e)
          : je((e._data = {}), !0),
        t.computed &&
          (function (e, t) {
            var n = (e._computedWatchers = Object.create(null)),
              r = ie();
            for (var i in t) {
              var o = t[i],
                a = "function" == typeof o ? o : o.get;
              null == a &&
                ue('Getter is missing for computed property "' + i + '".', e),
                r || (n[i] = new Vn(e, a || M, M, Kn)),
                i in e
                  ? i in e.$data
                    ? ue(
                        'The computed property "' +
                          i +
                          '" is already defined in data.',
                        e
                      )
                    : e.$options.props && i in e.$options.props
                    ? ue(
                        'The computed property "' +
                          i +
                          '" is already defined as a prop.',
                        e
                      )
                    : e.$options.methods &&
                      i in e.$options.methods &&
                      ue(
                        'The computed property "' +
                          i +
                          '" is already defined as a method.',
                        e
                      )
                  : Wn(e, i, o);
            }
          })(e, t.computed),
        t.watch &&
          t.watch !== te &&
          (function (e, t) {
            for (var n in t) {
              var r = t[n];
              if (Array.isArray(r))
                for (var i = 0; i < r.length; i++) Xn(e, n, r[i]);
              else Xn(e, n, r);
            }
          })(e, t.watch);
    }
    var Kn = {
      lazy: !0,
    };

    function Wn(e, t, n) {
      var r = !ie();
      "function" == typeof n
        ? ((zn.get = r ? Zn(t) : Gn(n)), (zn.set = M))
        : ((zn.get = n.get ? (r && !1 !== n.cache ? Zn(t) : Gn(n.get)) : M),
          (zn.set = n.set || M)),
        zn.set === M &&
          (zn.set = function () {
            ue(
              'Computed property "' +
                t +
                '" was assigned to but it has no setter.',
              this
            );
          }),
        Object.defineProperty(e, t, zn);
    }

    function Zn(e) {
      return function () {
        var t = this._computedWatchers && this._computedWatchers[e];
        if (t) return t.dirty && t.evaluate(), me.target && t.depend(), t.value;
      };
    }

    function Gn(e) {
      return function () {
        return e.call(this, this);
      };
    }

    function Xn(e, t, n, r) {
      return (
        c(n) && ((r = n), (n = n.handler)),
        "string" == typeof n && (n = e[n]),
        e.$watch(t, n, r)
      );
    }
    var Yn = 0;

    function Qn(e) {
      var t = e.options;
      if (e.super) {
        var n = Qn(e.super);
        if (n !== e.superOptions) {
          e.superOptions = n;
          var r = (function (e) {
            var t,
              n = e.options,
              r = e.sealedOptions;
            for (var i in n) n[i] !== r[i] && (t || (t = {}), (t[i] = n[i]));
            return t;
          })(e);
          r && O(e.extendOptions, r),
            (t = e.options = ze(n, e.extendOptions)).name &&
              (t.components[t.name] = e);
        }
      }
      return t;
    }

    function er(e) {
      this instanceof er ||
        ue("Vue is a constructor and should be called with the `new` keyword"),
        this._init(e);
    }

    function tr(e) {
      e.cid = 0;
      var t = 1;
      e.extend = function (e) {
        e = e || {};
        var n = this,
          r = n.cid,
          i = e._Ctor || (e._Ctor = {});
        if (i[r]) return i[r];
        var o = e.name || n.options.name;
        o && Be(o);
        var a = function (e) {
          this._init(e);
        };
        return (
          ((a.prototype = Object.create(n.prototype)).constructor = a),
          (a.cid = t++),
          (a.options = ze(n.options, e)),
          (a.super = n),
          a.options.props &&
            (function (e) {
              var t = e.options.props;
              for (var n in t) Jn(e.prototype, "_props", n);
            })(a),
          a.options.computed &&
            (function (e) {
              var t = e.options.computed;
              for (var n in t) Wn(e.prototype, n, t[n]);
            })(a),
          (a.extend = n.extend),
          (a.mixin = n.mixin),
          (a.use = n.use),
          F.forEach(function (e) {
            a[e] = n[e];
          }),
          o && (a.options.components[o] = a),
          (a.superOptions = n.options),
          (a.extendOptions = e),
          (a.sealedOptions = O({}, a.options)),
          (i[r] = a),
          a
        );
      };
    }

    function nr(e) {
      return e && (e.Ctor.options.name || e.tag);
    }

    function rr(e, t) {
      return Array.isArray(e)
        ? e.indexOf(t) > -1
        : "string" == typeof e
        ? e.split(",").indexOf(t) > -1
        : !!u(e) && e.test(t);
    }

    function ir(e, t) {
      var n = e.cache,
        r = e.keys,
        i = e._vnode;
      for (var o in n) {
        var a = n[o];
        if (a) {
          var s = a.name;
          s && !t(s) && or(n, o, r, i);
        }
      }
    }

    function or(e, t, n, r) {
      var i = e[t];
      !i || (r && i.tag === r.tag) || i.componentInstance.$destroy(),
        (e[t] = null),
        y(n, t);
    }
    !(function (t) {
      t.prototype._init = function (t) {
        var n,
          r,
          i = this;
        (i._uid = Yn++),
          R.performance &&
            st &&
            ((n = "vue-perf-start:" + i._uid),
            (r = "vue-perf-end:" + i._uid),
            st(n)),
          (i._isVue = !0),
          t && t._isComponent
            ? (function (e, t) {
                var n = (e.$options = Object.create(e.constructor.options)),
                  r = t._parentVnode;
                (n.parent = t.parent), (n._parentVnode = r);
                var i = r.componentOptions;
                (n.propsData = i.propsData),
                  (n._parentListeners = i.listeners),
                  (n._renderChildren = i.children),
                  (n._componentTag = i.tag),
                  t.render &&
                    ((n.render = t.render),
                    (n.staticRenderFns = t.staticRenderFns));
              })(i, t)
            : (i.$options = ze(Qn(i.constructor), t || {}, i)),
          gt(i),
          (i._self = i),
          (function (e) {
            var t = e.$options,
              n = t.parent;
            if (n && !t.abstract) {
              for (; n.$options.abstract && n.$parent; ) n = n.$parent;
              n.$children.push(e);
            }
            (e.$parent = n),
              (e.$root = n ? n.$root : e),
              (e.$children = []),
              (e.$refs = {}),
              (e._watcher = null),
              (e._inactive = null),
              (e._directInactive = !1),
              (e._isMounted = !1),
              (e._isDestroyed = !1),
              (e._isBeingDestroyed = !1);
          })(i),
          (function (e) {
            (e._events = Object.create(null)), (e._hasHookEvent = !1);
            var t = e.$options._parentListeners;
            t && xn(e, t);
          })(i),
          (function (t) {
            (t._vnode = null), (t._staticTrees = null);
            var n = t.$options,
              r = (t.$vnode = n._parentVnode),
              i = r && r.context;
            (t.$slots = Rt(n._renderChildren, i)),
              (t.$scopedSlots = e),
              (t._c = function (e, n, r, i) {
                return vn(t, e, n, r, i, !1);
              }),
              (t.$createElement = function (e, n, r, i) {
                return vn(t, e, n, r, i, !0);
              });
            var o = r && r.data;
            Ie(
              t,
              "$attrs",
              (o && o.attrs) || e,
              function () {
                !Cn && ue("$attrs is readonly.", t);
              },
              !0
            ),
              Ie(
                t,
                "$listeners",
                n._parentListeners || e,
                function () {
                  !Cn && ue("$listeners is readonly.", t);
                },
                !0
              );
          })(i),
          Mn(i, "beforeCreate"),
          (function (e) {
            var t = Pt(e.$options.inject, e);
            t &&
              (Te(!1),
              Object.keys(t).forEach(function (n) {
                Ie(e, n, t[n], function () {
                  ue(
                    'Avoid mutating an injected value directly since the changes will be overwritten whenever the provided component re-renders. injection being mutated: "' +
                      n +
                      '"',
                    e
                  );
                });
              }),
              Te(!0));
          })(i),
          qn(i),
          (function (e) {
            var t = e.$options.provide;
            t && (e._provided = "function" == typeof t ? t.call(e) : t);
          })(i),
          Mn(i, "created"),
          R.performance &&
            st &&
            ((i._name = fe(i, !1)),
            st(r),
            ct("vue " + i._name + " init", n, r)),
          i.$options.el && i.$mount(i.$options.el);
      };
    })(er),
      (function (e) {
        var t = {
            get: function () {
              return this._data;
            },
          },
          n = {
            get: function () {
              return this._props;
            },
          };
        (t.set = function () {
          ue(
            "Avoid replacing instance root $data. Use nested data properties instead.",
            this
          );
        }),
          (n.set = function () {
            ue("$props is readonly.", this);
          }),
          Object.defineProperty(e.prototype, "$data", t),
          Object.defineProperty(e.prototype, "$props", n),
          (e.prototype.$set = Ne),
          (e.prototype.$delete = Ee),
          (e.prototype.$watch = function (e, t, n) {
            var r = this;
            if (c(t)) return Xn(r, e, t, n);
            (n = n || {}).user = !0;
            var i = new Vn(r, e, t, n);
            if (n.immediate) {
              var o = 'callback for immediate watcher "' + i.expression + '"';
              ge(), rt(t, r, [i.value], r, o), be();
            }
            return function () {
              i.teardown();
            };
          });
      })(er),
      (function (e) {
        var t = /^hook:/;
        (e.prototype.$on = function (e, n) {
          var r = this;
          if (Array.isArray(e))
            for (var i = 0, o = e.length; i < o; i++) r.$on(e[i], n);
          else
            (r._events[e] || (r._events[e] = [])).push(n),
              t.test(e) && (r._hasHookEvent = !0);
          return r;
        }),
          (e.prototype.$once = function (e, t) {
            var n = this;

            function r() {
              n.$off(e, r), t.apply(n, arguments);
            }
            return (r.fn = t), n.$on(e, r), n;
          }),
          (e.prototype.$off = function (e, t) {
            var n = this;
            if (!arguments.length) return (n._events = Object.create(null)), n;
            if (Array.isArray(e)) {
              for (var r = 0, i = e.length; r < i; r++) n.$off(e[r], t);
              return n;
            }
            var o,
              a = n._events[e];
            if (!a) return n;
            if (!t) return (n._events[e] = null), n;
            for (var s = a.length; s--; )
              if ((o = a[s]) === t || o.fn === t) {
                a.splice(s, 1);
                break;
              }
            return n;
          }),
          (e.prototype.$emit = function (e) {
            var t = this,
              n = e.toLowerCase();
            n !== e && t._events[n] && le((fe(t), C(e)));
            var r = t._events[e];
            if (r) {
              r = r.length > 1 ? S(r) : r;
              for (
                var i = S(arguments, 1),
                  o = 'event handler for "' + e + '"',
                  a = 0,
                  s = r.length;
                a < s;
                a++
              )
                rt(r[a], t, i, t, o);
            }
            return t;
          });
      })(er),
      (function (e) {
        (e.prototype._update = function (e, t) {
          var n = this,
            r = n.$el,
            i = n._vnode,
            o = An(n);
          (n._vnode = e),
            (n.$el = i ? n.__patch__(i, e) : n.__patch__(n.$el, e, t, !1)),
            o(),
            r && (r.__vue__ = null),
            n.$el && (n.$el.__vue__ = n),
            n.$vnode &&
              n.$parent &&
              n.$vnode === n.$parent._vnode &&
              (n.$parent.$el = n.$el);
        }),
          (e.prototype.$forceUpdate = function () {
            this._watcher && this._watcher.update();
          }),
          (e.prototype.$destroy = function () {
            var e = this;
            if (!e._isBeingDestroyed) {
              Mn(e, "beforeDestroy"), (e._isBeingDestroyed = !0);
              var t = e.$parent;
              !t ||
                t._isBeingDestroyed ||
                e.$options.abstract ||
                y(t.$children, e),
                e._watcher && e._watcher.teardown();
              for (var n = e._watchers.length; n--; ) e._watchers[n].teardown();
              e._data.__ob__ && e._data.__ob__.vmCount--,
                (e._isDestroyed = !0),
                e.__patch__(e._vnode, null),
                Mn(e, "destroyed"),
                e.$off(),
                e.$el && (e.$el.__vue__ = null),
                e.$vnode && (e.$vnode.parent = null);
            }
          });
      })(er),
      (function (e) {
        an(e.prototype),
          (e.prototype.$nextTick = function (e) {
            return yt(e, this);
          }),
          (e.prototype._render = function () {
            var e,
              t = this,
              n = t.$options,
              r = n.render,
              i = n._parentVnode;
            i &&
              (t.$scopedSlots = Bt(
                i.data.scopedSlots,
                t.$slots,
                t.$scopedSlots
              )),
              (t.$vnode = i);
            try {
              (yn = t), (e = r.call(t._renderProxy, t.$createElement));
            } catch (n) {
              if ((nt(n, t, "render"), t.$options.renderError))
                try {
                  e = t.$options.renderError.call(
                    t._renderProxy,
                    t.$createElement,
                    n
                  );
                } catch (n) {
                  nt(n, t, "renderError"), (e = t._vnode);
                }
              else e = t._vnode;
            } finally {
              yn = null;
            }
            return (
              Array.isArray(e) && 1 === e.length && (e = e[0]),
              e instanceof _e ||
                (Array.isArray(e) &&
                  ue(
                    "Multiple root nodes returned from render function. Render function should return a single root node.",
                    t
                  ),
                (e = $e())),
              (e.parent = i),
              e
            );
          });
      })(er);
    var ar = [String, RegExp, Array],
      sr = {
        name: "keep-alive",
        abstract: !0,
        props: {
          include: ar,
          exclude: ar,
          max: [String, Number],
        },
        methods: {
          cacheVNode: function () {
            var e = this,
              t = e.cache,
              n = e.keys,
              r = e.vnodeToCache,
              i = e.keyToCache;
            if (r) {
              var o = r.tag,
                a = r.componentInstance,
                s = r.componentOptions;
              (t[i] = {
                name: nr(s),
                tag: o,
                componentInstance: a,
              }),
                n.push(i),
                this.max &&
                  n.length > parseInt(this.max) &&
                  or(t, n[0], n, this._vnode),
                (this.vnodeToCache = null);
            }
          },
        },
        created: function () {
          (this.cache = Object.create(null)), (this.keys = []);
        },
        destroyed: function () {
          for (var e in this.cache) or(this.cache, e, this.keys);
        },
        mounted: function () {
          var e = this;
          this.cacheVNode(),
            this.$watch("include", function (t) {
              ir(e, function (e) {
                return rr(t, e);
              });
            }),
            this.$watch("exclude", function (t) {
              ir(e, function (e) {
                return !rr(t, e);
              });
            });
        },
        updated: function () {
          this.cacheVNode();
        },
        render: function () {
          var e = this.$slots.default,
            t = bn(e),
            n = t && t.componentOptions;
          if (n) {
            var r = nr(n),
              i = this.include,
              o = this.exclude;
            if ((i && (!r || !rr(i, r))) || (o && r && rr(o, r))) return t;
            var a = this.cache,
              s = this.keys,
              c =
                null == t.key
                  ? n.Ctor.cid + (n.tag ? "::" + n.tag : "")
                  : t.key;
            a[c]
              ? ((t.componentInstance = a[c].componentInstance),
                y(s, c),
                s.push(c))
              : ((this.vnodeToCache = t), (this.keyToCache = c)),
              (t.data.keepAlive = !0);
          }
          return t || (e && e[0]);
        },
      },
      cr = {
        KeepAlive: sr,
      };
    !(function (e) {
      var t = {
        get: function () {
          return R;
        },
        set: function () {
          ue(
            "Do not replace the Vue.config object, set individual fields instead."
          );
        },
      };
      Object.defineProperty(e, "config", t),
        (e.util = {
          warn: ue,
          extend: O,
          mergeOptions: ze,
          defineReactive: Ie,
        }),
        (e.set = Ne),
        (e.delete = Ee),
        (e.nextTick = yt),
        (e.observable = function (e) {
          return je(e), e;
        }),
        (e.options = Object.create(null)),
        F.forEach(function (t) {
          e.options[t + "s"] = Object.create(null);
        }),
        (e.options._base = e),
        O(e.options.components, cr),
        (function (e) {
          e.use = function (e) {
            var t = this._installedPlugins || (this._installedPlugins = []);
            if (t.indexOf(e) > -1) return this;
            var n = S(arguments, 1);
            return (
              n.unshift(this),
              "function" == typeof e.install
                ? e.install.apply(e, n)
                : "function" == typeof e && e.apply(null, n),
              t.push(e),
              this
            );
          };
        })(e),
        (function (e) {
          e.mixin = function (e) {
            return (this.options = ze(this.options, e)), this;
          };
        })(e),
        tr(e),
        (function (e) {
          F.forEach(function (t) {
            e[t] = function (e, n) {
              return n
                ? ("component" === t && Be(e),
                  "component" === t &&
                    c(n) &&
                    ((n.name = n.name || e),
                    (n = this.options._base.extend(n))),
                  "directive" === t &&
                    "function" == typeof n &&
                    (n = {
                      bind: n,
                      update: n,
                    }),
                  (this.options[t + "s"][e] = n),
                  n)
                : this.options[t + "s"][e];
            };
          });
        })(e);
    })(er),
      Object.defineProperty(er.prototype, "$isServer", {
        get: ie,
      }),
      Object.defineProperty(er.prototype, "$ssrContext", {
        get: function () {
          return this.$vnode && this.$vnode.ssrContext;
        },
      }),
      Object.defineProperty(er, "FunctionalRenderContext", {
        value: sn,
      }),
      (er.version = "2.6.14");
    var ur = v("style,class"),
      lr = v("input,textarea,option,select,progress"),
      fr = function (e, t, n) {
        return (
          ("value" === n && lr(e) && "button" !== t) ||
          ("selected" === n && "option" === e) ||
          ("checked" === n && "input" === e) ||
          ("muted" === n && "video" === e)
        );
      },
      pr = v("contenteditable,draggable,spellcheck"),
      dr = v("events,caret,typing,plaintext-only"),
      vr = v(
        "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible"
      ),
      hr = "http://www.w3.org/1999/xlink",
      mr = function (e) {
        return ":" === e.charAt(5) && "xlink" === e.slice(0, 5);
      },
      yr = function (e) {
        return mr(e) ? e.slice(6, e.length) : "";
      },
      gr = function (e) {
        return null == e || !1 === e;
      };

    function br(e) {
      for (var t = e.data, r = e, i = e; n(i.componentInstance); )
        (i = i.componentInstance._vnode) && i.data && (t = _r(i.data, t));
      for (; n((r = r.parent)); ) r && r.data && (t = _r(t, r.data));
      return (function (e, t) {
        if (n(e) || n(t)) return wr(e, $r(t));
        return "";
      })(t.staticClass, t.class);
    }

    function _r(e, t) {
      return {
        staticClass: wr(e.staticClass, t.staticClass),
        class: n(e.class) ? [e.class, t.class] : t.class,
      };
    }

    function wr(e, t) {
      return e ? (t ? e + " " + t : e) : t || "";
    }

    function $r(e) {
      return Array.isArray(e)
        ? (function (e) {
            for (var t, r = "", i = 0, o = e.length; i < o; i++)
              n((t = $r(e[i]))) && "" !== t && (r && (r += " "), (r += t));
            return r;
          })(e)
        : o(e)
        ? (function (e) {
            var t = "";
            for (var n in e) e[n] && (t && (t += " "), (t += n));
            return t;
          })(e)
        : "string" == typeof e
        ? e
        : "";
    }
    var xr = {
        svg: "http://www.w3.org/2000/svg",
        math: "http://www.w3.org/1998/Math/MathML",
      },
      kr = v(
        "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"
      ),
      Cr = v(
        "svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",
        !0
      ),
      Ar = function (e) {
        return kr(e) || Cr(e);
      };

    function Sr(e) {
      return Cr(e) ? "svg" : "math" === e ? "math" : void 0;
    }
    var Or = Object.create(null);
    var Tr = v("text,number,password,search,email,tel,url");

    function Mr(e) {
      if ("string" == typeof e) {
        var t = document.querySelector(e);
        return (
          t || (ue("Cannot find element: " + e), document.createElement("div"))
        );
      }
      return e;
    }
    var jr = Object.freeze({
        createElement: function (e, t) {
          var n = document.createElement(e);
          return (
            "select" !== e ||
              (t.data &&
                t.data.attrs &&
                void 0 !== t.data.attrs.multiple &&
                n.setAttribute("multiple", "multiple")),
            n
          );
        },
        createElementNS: function (e, t) {
          return document.createElementNS(xr[e], t);
        },
        createTextNode: function (e) {
          return document.createTextNode(e);
        },
        createComment: function (e) {
          return document.createComment(e);
        },
        insertBefore: function (e, t, n) {
          e.insertBefore(t, n);
        },
        removeChild: function (e, t) {
          e.removeChild(t);
        },
        appendChild: function (e, t) {
          e.appendChild(t);
        },
        parentNode: function (e) {
          return e.parentNode;
        },
        nextSibling: function (e) {
          return e.nextSibling;
        },
        tagName: function (e) {
          return e.tagName;
        },
        setTextContent: function (e, t) {
          e.textContent = t;
        },
        setStyleScope: function (e, t) {
          e.setAttribute(t, "");
        },
      }),
      Ir = {
        create: function (e, t) {
          Nr(t);
        },
        update: function (e, t) {
          e.data.ref !== t.data.ref && (Nr(e, !0), Nr(t));
        },
        destroy: function (e) {
          Nr(e, !0);
        },
      };

    function Nr(e, t) {
      var r = e.data.ref;
      if (n(r)) {
        var i = e.context,
          o = e.componentInstance || e.elm,
          a = i.$refs;
        t
          ? Array.isArray(a[r])
            ? y(a[r], o)
            : a[r] === o && (a[r] = void 0)
          : e.data.refInFor
          ? Array.isArray(a[r])
            ? a[r].indexOf(o) < 0 && a[r].push(o)
            : (a[r] = [o])
          : (a[r] = o);
      }
    }
    var Er = new _e("", {}, []),
      Dr = ["create", "activate", "update", "remove", "destroy"];

    function Lr(e, i) {
      return (
        e.key === i.key &&
        e.asyncFactory === i.asyncFactory &&
        ((e.tag === i.tag &&
          e.isComment === i.isComment &&
          n(e.data) === n(i.data) &&
          (function (e, t) {
            if ("input" !== e.tag) return !0;
            var r,
              i = n((r = e.data)) && n((r = r.attrs)) && r.type,
              o = n((r = t.data)) && n((r = r.attrs)) && r.type;
            return i === o || (Tr(i) && Tr(o));
          })(e, i)) ||
          (r(e.isAsyncPlaceholder) && t(i.asyncFactory.error)))
      );
    }

    function Fr(e, t, r) {
      var i,
        o,
        a = {};
      for (i = t; i <= r; ++i) n((o = e[i].key)) && (a[o] = i);
      return a;
    }
    var Pr = {
      create: Rr,
      update: Rr,
      destroy: function (e) {
        Rr(e, Er);
      },
    };

    function Rr(e, t) {
      (e.data.directives || t.data.directives) &&
        (function (e, t) {
          var n,
            r,
            i,
            o = e === Er,
            a = t === Er,
            s = Hr(e.data.directives, e.context),
            c = Hr(t.data.directives, t.context),
            u = [],
            l = [];
          for (n in c)
            (r = s[n]),
              (i = c[n]),
              r
                ? ((i.oldValue = r.value),
                  (i.oldArg = r.arg),
                  Vr(i, "update", t, e),
                  i.def && i.def.componentUpdated && l.push(i))
                : (Vr(i, "bind", t, e), i.def && i.def.inserted && u.push(i));
          if (u.length) {
            var f = function () {
              for (var n = 0; n < u.length; n++) Vr(u[n], "inserted", t, e);
            };
            o ? Nt(t, "insert", f) : f();
          }
          l.length &&
            Nt(t, "postpatch", function () {
              for (var n = 0; n < l.length; n++)
                Vr(l[n], "componentUpdated", t, e);
            });
          if (!o) for (n in s) c[n] || Vr(s[n], "unbind", e, e, a);
        })(e, t);
    }
    var Ur = Object.create(null);

    function Hr(e, t) {
      var n,
        r,
        i = Object.create(null);
      if (!e) return i;
      for (n = 0; n < e.length; n++)
        (r = e[n]).modifiers || (r.modifiers = Ur),
          (i[Br(r)] = r),
          (r.def = Je(t.$options, "directives", r.name, !0));
      return i;
    }

    function Br(e) {
      return (
        e.rawName || e.name + "." + Object.keys(e.modifiers || {}).join(".")
      );
    }

    function Vr(e, t, n, r, i) {
      var o = e.def && e.def[t];
      if (o)
        try {
          o(n.elm, e, n, r, i);
        } catch (r) {
          nt(r, n.context, "directive " + e.name + " " + t + " hook");
        }
    }
    var zr = [Ir, Pr];

    function Jr(e, r) {
      var i = r.componentOptions;
      if (
        !(
          (n(i) && !1 === i.Ctor.options.inheritAttrs) ||
          (t(e.data.attrs) && t(r.data.attrs))
        )
      ) {
        var o,
          a,
          s = r.elm,
          c = e.data.attrs || {},
          u = r.data.attrs || {};
        for (o in (n(u.__ob__) && (u = r.data.attrs = O({}, u)), u))
          (a = u[o]), c[o] !== a && qr(s, o, a, r.data.pre);
        for (o in ((G || Y) && u.value !== c.value && qr(s, "value", u.value),
        c))
          t(u[o]) &&
            (mr(o)
              ? s.removeAttributeNS(hr, yr(o))
              : pr(o) || s.removeAttribute(o));
      }
    }

    function qr(e, t, n, r) {
      r || e.tagName.indexOf("-") > -1
        ? Kr(e, t, n)
        : vr(t)
        ? gr(n)
          ? e.removeAttribute(t)
          : ((n =
              "allowfullscreen" === t && "EMBED" === e.tagName ? "true" : t),
            e.setAttribute(t, n))
        : pr(t)
        ? e.setAttribute(
            t,
            (function (e, t) {
              return gr(t) || "false" === t
                ? "false"
                : "contenteditable" === e && dr(t)
                ? t
                : "true";
            })(t, n)
          )
        : mr(t)
        ? gr(n)
          ? e.removeAttributeNS(hr, yr(t))
          : e.setAttributeNS(hr, t, n)
        : Kr(e, t, n);
    }

    function Kr(e, t, n) {
      if (gr(n)) e.removeAttribute(t);
      else {
        if (
          G &&
          !X &&
          "TEXTAREA" === e.tagName &&
          "placeholder" === t &&
          "" !== n &&
          !e.__ieph
        ) {
          var r = function (t) {
            t.stopImmediatePropagation(), e.removeEventListener("input", r);
          };
          e.addEventListener("input", r), (e.__ieph = !0);
        }
        e.setAttribute(t, n);
      }
    }
    var Wr = {
      create: Jr,
      update: Jr,
    };

    function Zr(e, r) {
      var i = r.elm,
        o = r.data,
        a = e.data;
      if (
        !(
          t(o.staticClass) &&
          t(o.class) &&
          (t(a) || (t(a.staticClass) && t(a.class)))
        )
      ) {
        var s = br(r),
          c = i._transitionClasses;
        n(c) && (s = wr(s, $r(c))),
          s !== i._prevClass &&
            (i.setAttribute("class", s), (i._prevClass = s));
      }
    }
    var Gr,
      Xr,
      Yr,
      Qr,
      ei,
      ti,
      ni,
      ri = {
        create: Zr,
        update: Zr,
      },
      ii = /[\w).+\-_$\]]/;

    function oi(e) {
      var t,
        n,
        r,
        i,
        o,
        a = !1,
        s = !1,
        c = !1,
        u = !1,
        l = 0,
        f = 0,
        p = 0,
        d = 0;
      for (r = 0; r < e.length; r++)
        if (((n = t), (t = e.charCodeAt(r)), a))
          39 === t && 92 !== n && (a = !1);
        else if (s) 34 === t && 92 !== n && (s = !1);
        else if (c) 96 === t && 92 !== n && (c = !1);
        else if (u) 47 === t && 92 !== n && (u = !1);
        else if (
          124 !== t ||
          124 === e.charCodeAt(r + 1) ||
          124 === e.charCodeAt(r - 1) ||
          l ||
          f ||
          p
        ) {
          switch (t) {
            case 34:
              s = !0;
              break;
            case 39:
              a = !0;
              break;
            case 96:
              c = !0;
              break;
            case 40:
              p++;
              break;
            case 41:
              p--;
              break;
            case 91:
              f++;
              break;
            case 93:
              f--;
              break;
            case 123:
              l++;
              break;
            case 125:
              l--;
              break;
          }
          if (47 === t) {
            for (
              var v = r - 1, h = void 0;
              v >= 0 && " " === (h = e.charAt(v));
              v--
            );
            (h && ii.test(h)) || (u = !0);
          }
        } else void 0 === i ? ((d = r + 1), (i = e.slice(0, r).trim())) : m();

      function m() {
        (o || (o = [])).push(e.slice(d, r).trim()), (d = r + 1);
      }
      if ((void 0 === i ? (i = e.slice(0, r).trim()) : 0 !== d && m(), o))
        for (r = 0; r < o.length; r++) i = ai(i, o[r]);
      return i;
    }

    function ai(e, t) {
      var n = t.indexOf("(");
      if (n < 0) return '_f("' + t + '")(' + e + ")";
      var r = t.slice(0, n),
        i = t.slice(n + 1);
      return '_f("' + r + '")(' + e + (")" !== i ? "," + i : i);
    }

    function si(e, t) {}

    function ci(e, t) {
      return e
        ? e
            .map(function (e) {
              return e[t];
            })
            .filter(function (e) {
              return e;
            })
        : [];
    }

    function ui(e, t, n, r, i) {
      (e.props || (e.props = [])).push(
        bi(
          {
            name: t,
            value: n,
            dynamic: i,
          },
          r
        )
      ),
        (e.plain = !1);
    }

    function li(e, t, n, r, i) {
      (i
        ? e.dynamicAttrs || (e.dynamicAttrs = [])
        : e.attrs || (e.attrs = [])
      ).push(
        bi(
          {
            name: t,
            value: n,
            dynamic: i,
          },
          r
        )
      ),
        (e.plain = !1);
    }

    function fi(e, t, n, r) {
      (e.attrsMap[t] = n),
        e.attrsList.push(
          bi(
            {
              name: t,
              value: n,
            },
            r
          )
        );
    }

    function pi(e, t, n, r, i, o, a, s) {
      (e.directives || (e.directives = [])).push(
        bi(
          {
            name: t,
            rawName: n,
            value: r,
            arg: i,
            isDynamicArg: o,
            modifiers: a,
          },
          s
        )
      ),
        (e.plain = !1);
    }

    function di(e, t, n) {
      return n ? "_p(" + t + ',"' + e + '")' : e + t;
    }

    function vi(t, n, r, i, o, a, s, c) {
      var u;
      (i = i || e),
        a &&
          i.prevent &&
          i.passive &&
          a(
            "passive and prevent can't be used together. Passive handler can't prevent default event.",
            s
          ),
        i.right
          ? c
            ? (n = "(" + n + ")==='click'?'contextmenu':(" + n + ")")
            : "click" === n && ((n = "contextmenu"), delete i.right)
          : i.middle &&
            (c
              ? (n = "(" + n + ")==='click'?'mouseup':(" + n + ")")
              : "click" === n && (n = "mouseup")),
        i.capture && (delete i.capture, (n = di("!", n, c))),
        i.once && (delete i.once, (n = di("~", n, c))),
        i.passive && (delete i.passive, (n = di("&", n, c))),
        i.native
          ? (delete i.native, (u = t.nativeEvents || (t.nativeEvents = {})))
          : (u = t.events || (t.events = {}));
      var l = bi(
        {
          value: r.trim(),
          dynamic: c,
        },
        s
      );
      i !== e && (l.modifiers = i);
      var f = u[n];
      Array.isArray(f)
        ? o
          ? f.unshift(l)
          : f.push(l)
        : (u[n] = f ? (o ? [l, f] : [f, l]) : l),
        (t.plain = !1);
    }

    function hi(e, t) {
      return (
        e.rawAttrsMap[":" + t] ||
        e.rawAttrsMap["v-bind:" + t] ||
        e.rawAttrsMap[t]
      );
    }

    function mi(e, t, n) {
      var r = yi(e, ":" + t) || yi(e, "v-bind:" + t);
      if (null != r) return oi(r);
      if (!1 !== n) {
        var i = yi(e, t);
        if (null != i) return JSON.stringify(i);
      }
    }

    function yi(e, t, n) {
      var r;
      if (null != (r = e.attrsMap[t]))
        for (var i = e.attrsList, o = 0, a = i.length; o < a; o++)
          if (i[o].name === t) {
            i.splice(o, 1);
            break;
          }
      return n && delete e.attrsMap[t], r;
    }

    function gi(e, t) {
      for (var n = e.attrsList, r = 0, i = n.length; r < i; r++) {
        var o = n[r];
        if (t.test(o.name)) return n.splice(r, 1), o;
      }
    }

    function bi(e, t) {
      return (
        t &&
          (null != t.start && (e.start = t.start),
          null != t.end && (e.end = t.end)),
        e
      );
    }

    function _i(e, t, n) {
      var r = n || {},
        i = r.number,
        o = "$$v",
        a = o;
      r.trim && (a = "(typeof $$v === 'string'? $$v.trim(): $$v)"),
        i && (a = "_n(" + a + ")");
      var s = wi(t, a);
      e.model = {
        value: "(" + t + ")",
        expression: JSON.stringify(t),
        callback: "function ($$v) {" + s + "}",
      };
    }

    function wi(e, t) {
      var n = (function (e) {
        if (
          ((e = e.trim()),
          (Gr = e.length),
          e.indexOf("[") < 0 || e.lastIndexOf("]") < Gr - 1)
        )
          return (Qr = e.lastIndexOf(".")) > -1
            ? {
                exp: e.slice(0, Qr),
                key: '"' + e.slice(Qr + 1) + '"',
              }
            : {
                exp: e,
                key: null,
              };
        (Xr = e), (Qr = ei = ti = 0);
        for (; !xi(); ) ki((Yr = $i())) ? Ai(Yr) : 91 === Yr && Ci(Yr);
        return {
          exp: e.slice(0, ei),
          key: e.slice(ei + 1, ti),
        };
      })(e);
      return null === n.key
        ? e + "=" + t
        : "$set(" + n.exp + ", " + n.key + ", " + t + ")";
    }

    function $i() {
      return Xr.charCodeAt(++Qr);
    }

    function xi() {
      return Qr >= Gr;
    }

    function ki(e) {
      return 34 === e || 39 === e;
    }

    function Ci(e) {
      var t = 1;
      for (ei = Qr; !xi(); )
        if (ki((e = $i()))) Ai(e);
        else if ((91 === e && t++, 93 === e && t--, 0 === t)) {
          ti = Qr;
          break;
        }
    }

    function Ai(e) {
      for (var t = e; !xi() && (e = $i()) !== t; );
    }
    var Si,
      Oi = "__r";

    function Ti(e, t, n) {
      var r = Si;
      return function i() {
        var o = t.apply(null, arguments);
        null !== o && Ii(e, i, n, r);
      };
    }
    var Mi = ut && !(ee && Number(ee[1]) <= 53);

    function ji(e, t, n, r) {
      if (Mi) {
        var i = Pn,
          o = t;
        t = o._wrapper = function (e) {
          if (
            e.target === e.currentTarget ||
            e.timeStamp >= i ||
            e.timeStamp <= 0 ||
            e.target.ownerDocument !== document
          )
            return o.apply(this, arguments);
        };
      }
      Si.addEventListener(
        e,
        t,
        ne
          ? {
              capture: n,
              passive: r,
            }
          : n
      );
    }

    function Ii(e, t, n, r) {
      (r || Si).removeEventListener(e, t._wrapper || t, n);
    }

    function Ni(e, r) {
      if (!t(e.data.on) || !t(r.data.on)) {
        var i = r.data.on || {},
          o = e.data.on || {};
        (Si = r.elm),
          (function (e) {
            if (n(e.__r)) {
              var t = G ? "change" : "input";
              (e[t] = [].concat(e.__r, e[t] || [])), delete e.__r;
            }
            n(e.__c) &&
              ((e.change = [].concat(e.__c, e.change || [])), delete e.__c);
          })(i),
          It(i, o, ji, Ii, Ti, r.context),
          (Si = void 0);
      }
    }
    var Ei,
      Di = {
        create: Ni,
        update: Ni,
      };

    function Li(e, r) {
      if (!t(e.data.domProps) || !t(r.data.domProps)) {
        var i,
          o,
          a = r.elm,
          s = e.data.domProps || {},
          c = r.data.domProps || {};
        for (i in (n(c.__ob__) && (c = r.data.domProps = O({}, c)), s))
          i in c || (a[i] = "");
        for (i in c) {
          if (((o = c[i]), "textContent" === i || "innerHTML" === i)) {
            if ((r.children && (r.children.length = 0), o === s[i])) continue;
            1 === a.childNodes.length && a.removeChild(a.childNodes[0]);
          }
          if ("value" === i && "PROGRESS" !== a.tagName) {
            a._value = o;
            var u = t(o) ? "" : String(o);
            Fi(a, u) && (a.value = u);
          } else if ("innerHTML" === i && Cr(a.tagName) && t(a.innerHTML)) {
            (Ei = Ei || document.createElement("div")).innerHTML =
              "<svg>" + o + "</svg>";
            for (var l = Ei.firstChild; a.firstChild; )
              a.removeChild(a.firstChild);
            for (; l.firstChild; ) a.appendChild(l.firstChild);
          } else if (o !== s[i])
            try {
              a[i] = o;
            } catch (e) {}
        }
      }
    }

    function Fi(e, t) {
      return (
        !e.composing &&
        ("OPTION" === e.tagName ||
          (function (e, t) {
            var n = !0;
            try {
              n = document.activeElement !== e;
            } catch (e) {}
            return n && e.value !== t;
          })(e, t) ||
          (function (e, t) {
            var r = e.value,
              i = e._vModifiers;
            if (n(i)) {
              if (i.number) return d(r) !== d(t);
              if (i.trim) return r.trim() !== t.trim();
            }
            return r !== t;
          })(e, t))
      );
    }
    var Pi = {
        create: Li,
        update: Li,
      },
      Ri = _(function (e) {
        var t = {},
          n = /:(.+)/;
        return (
          e.split(/;(?![^(]*\))/g).forEach(function (e) {
            if (e) {
              var r = e.split(n);
              r.length > 1 && (t[r[0].trim()] = r[1].trim());
            }
          }),
          t
        );
      });

    function Ui(e) {
      var t = Hi(e.style);
      return e.staticStyle ? O(e.staticStyle, t) : t;
    }

    function Hi(e) {
      return Array.isArray(e) ? T(e) : "string" == typeof e ? Ri(e) : e;
    }
    var Bi,
      Vi = /^--/,
      zi = /\s*!important$/,
      Ji = function (e, t, n) {
        if (Vi.test(t)) e.style.setProperty(t, n);
        else if (zi.test(n))
          e.style.setProperty(C(t), n.replace(zi, ""), "important");
        else {
          var r = Ki(t);
          if (Array.isArray(n))
            for (var i = 0, o = n.length; i < o; i++) e.style[r] = n[i];
          else e.style[r] = n;
        }
      },
      qi = ["Webkit", "Moz", "ms"],
      Ki = _(function (e) {
        if (
          ((Bi = Bi || document.createElement("div").style),
          "filter" !== (e = $(e)) && e in Bi)
        )
          return e;
        for (
          var t = e.charAt(0).toUpperCase() + e.slice(1), n = 0;
          n < qi.length;
          n++
        ) {
          var r = qi[n] + t;
          if (r in Bi) return r;
        }
      });

    function Wi(e, r) {
      var i = r.data,
        o = e.data;
      if (!(t(i.staticStyle) && t(i.style) && t(o.staticStyle) && t(o.style))) {
        var a,
          s,
          c = r.elm,
          u = o.staticStyle,
          l = o.normalizedStyle || o.style || {},
          f = u || l,
          p = Hi(r.data.style) || {};
        r.data.normalizedStyle = n(p.__ob__) ? O({}, p) : p;
        var d = (function (e, t) {
          var n,
            r = {};
          if (t)
            for (var i = e; i.componentInstance; )
              (i = i.componentInstance._vnode) &&
                i.data &&
                (n = Ui(i.data)) &&
                O(r, n);
          (n = Ui(e.data)) && O(r, n);
          for (var o = e; (o = o.parent); )
            o.data && (n = Ui(o.data)) && O(r, n);
          return r;
        })(r, !0);
        for (s in f) t(d[s]) && Ji(c, s, "");
        for (s in d) (a = d[s]) !== f[s] && Ji(c, s, null == a ? "" : a);
      }
    }
    var Zi = {
        create: Wi,
        update: Wi,
      },
      Gi = /\s+/;

    function Xi(e, t) {
      if (t && (t = t.trim()))
        if (e.classList)
          t.indexOf(" ") > -1
            ? t.split(Gi).forEach(function (t) {
                return e.classList.add(t);
              })
            : e.classList.add(t);
        else {
          var n = " " + (e.getAttribute("class") || "") + " ";
          n.indexOf(" " + t + " ") < 0 &&
            e.setAttribute("class", (n + t).trim());
        }
    }

    function Yi(e, t) {
      if (t && (t = t.trim()))
        if (e.classList)
          t.indexOf(" ") > -1
            ? t.split(Gi).forEach(function (t) {
                return e.classList.remove(t);
              })
            : e.classList.remove(t),
            e.classList.length || e.removeAttribute("class");
        else {
          for (
            var n = " " + (e.getAttribute("class") || "") + " ",
              r = " " + t + " ";
            n.indexOf(r) >= 0;

          )
            n = n.replace(r, " ");
          (n = n.trim())
            ? e.setAttribute("class", n)
            : e.removeAttribute("class");
        }
    }

    function Qi(e) {
      if (e) {
        if ("object" == typeof e) {
          var t = {};
          return !1 !== e.css && O(t, eo(e.name || "v")), O(t, e), t;
        }
        return "string" == typeof e ? eo(e) : void 0;
      }
    }
    var eo = _(function (e) {
        return {
          enterClass: e + "-enter",
          enterToClass: e + "-enter-to",
          enterActiveClass: e + "-enter-active",
          leaveClass: e + "-leave",
          leaveToClass: e + "-leave-to",
          leaveActiveClass: e + "-leave-active",
        };
      }),
      to = q && !X,
      no = "transition",
      ro = "animation",
      io = "transition",
      oo = "transitionend",
      ao = "animation",
      so = "animationend";
    to &&
      (void 0 === window.ontransitionend &&
        void 0 !== window.onwebkittransitionend &&
        ((io = "WebkitTransition"), (oo = "webkitTransitionEnd")),
      void 0 === window.onanimationend &&
        void 0 !== window.onwebkitanimationend &&
        ((ao = "WebkitAnimation"), (so = "webkitAnimationEnd")));
    var co = q
      ? window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout
      : function (e) {
          return e();
        };

    function uo(e) {
      co(function () {
        co(e);
      });
    }

    function lo(e, t) {
      var n = e._transitionClasses || (e._transitionClasses = []);
      n.indexOf(t) < 0 && (n.push(t), Xi(e, t));
    }

    function fo(e, t) {
      e._transitionClasses && y(e._transitionClasses, t), Yi(e, t);
    }

    function po(e, t, n) {
      var r = ho(e, t),
        i = r.type,
        o = r.timeout,
        a = r.propCount;
      if (!i) return n();
      var s = i === no ? oo : so,
        c = 0,
        u = function () {
          e.removeEventListener(s, l), n();
        },
        l = function (t) {
          t.target === e && ++c >= a && u();
        };
      setTimeout(function () {
        c < a && u();
      }, o + 1),
        e.addEventListener(s, l);
    }
    var vo = /\b(transform|all)(,|$)/;

    function ho(e, t) {
      var n,
        r = window.getComputedStyle(e),
        i = (r[io + "Delay"] || "").split(", "),
        o = (r[io + "Duration"] || "").split(", "),
        a = mo(i, o),
        s = (r[ao + "Delay"] || "").split(", "),
        c = (r[ao + "Duration"] || "").split(", "),
        u = mo(s, c),
        l = 0,
        f = 0;
      return (
        t === no
          ? a > 0 && ((n = no), (l = a), (f = o.length))
          : t === ro
          ? u > 0 && ((n = ro), (l = u), (f = c.length))
          : (f = (n = (l = Math.max(a, u)) > 0 ? (a > u ? no : ro) : null)
              ? n === no
                ? o.length
                : c.length
              : 0),
        {
          type: n,
          timeout: l,
          propCount: f,
          hasTransform: n === no && vo.test(r[io + "Property"]),
        }
      );
    }

    function mo(e, t) {
      for (; e.length < t.length; ) e = e.concat(e);
      return Math.max.apply(
        null,
        t.map(function (t, n) {
          return yo(t) + yo(e[n]);
        })
      );
    }

    function yo(e) {
      return 1e3 * Number(e.slice(0, -1).replace(",", "."));
    }

    function go(e, r) {
      var i = e.elm;
      n(i._leaveCb) && ((i._leaveCb.cancelled = !0), i._leaveCb());
      var a = Qi(e.data.transition);
      if (!t(a) && !n(i._enterCb) && 1 === i.nodeType) {
        for (
          var s = a.css,
            c = a.type,
            u = a.enterClass,
            l = a.enterToClass,
            f = a.enterActiveClass,
            p = a.appearClass,
            v = a.appearToClass,
            h = a.appearActiveClass,
            m = a.beforeEnter,
            y = a.enter,
            g = a.afterEnter,
            b = a.enterCancelled,
            _ = a.beforeAppear,
            w = a.appear,
            $ = a.afterAppear,
            x = a.appearCancelled,
            k = a.duration,
            C = kn,
            A = kn.$vnode;
          A && A.parent;

        )
          (C = A.context), (A = A.parent);
        var S = !C._isMounted || !e.isRootInsert;
        if (!S || w || "" === w) {
          var O = S && p ? p : u,
            T = S && h ? h : f,
            M = S && v ? v : l,
            j = (S && _) || m,
            I = S && "function" == typeof w ? w : y,
            N = (S && $) || g,
            E = (S && x) || b,
            L = d(o(k) ? k.enter : k);
          null != L && _o(L, "enter", e);
          var F = !1 !== s && !X,
            P = $o(I),
            R = (i._enterCb = D(function () {
              F && (fo(i, M), fo(i, T)),
                R.cancelled ? (F && fo(i, O), E && E(i)) : N && N(i),
                (i._enterCb = null);
            }));
          e.data.show ||
            Nt(e, "insert", function () {
              var t = i.parentNode,
                n = t && t._pending && t._pending[e.key];
              n && n.tag === e.tag && n.elm._leaveCb && n.elm._leaveCb(),
                I && I(i, R);
            }),
            j && j(i),
            F &&
              (lo(i, O),
              lo(i, T),
              uo(function () {
                fo(i, O),
                  R.cancelled ||
                    (lo(i, M), P || (wo(L) ? setTimeout(R, L) : po(i, c, R)));
              })),
            e.data.show && (r && r(), I && I(i, R)),
            F || P || R();
        }
      }
    }

    function bo(e, r) {
      var i = e.elm;
      n(i._enterCb) && ((i._enterCb.cancelled = !0), i._enterCb());
      var a = Qi(e.data.transition);
      if (t(a) || 1 !== i.nodeType) return r();
      if (!n(i._leaveCb)) {
        var s = a.css,
          c = a.type,
          u = a.leaveClass,
          l = a.leaveToClass,
          f = a.leaveActiveClass,
          p = a.beforeLeave,
          v = a.leave,
          h = a.afterLeave,
          m = a.leaveCancelled,
          y = a.delayLeave,
          g = a.duration,
          b = !1 !== s && !X,
          _ = $o(v),
          w = d(o(g) ? g.leave : g);
        n(w) && _o(w, "leave", e);
        var $ = (i._leaveCb = D(function () {
          i.parentNode &&
            i.parentNode._pending &&
            (i.parentNode._pending[e.key] = null),
            b && (fo(i, l), fo(i, f)),
            $.cancelled ? (b && fo(i, u), m && m(i)) : (r(), h && h(i)),
            (i._leaveCb = null);
        }));
        y ? y(x) : x();
      }

      function x() {
        $.cancelled ||
          (!e.data.show &&
            i.parentNode &&
            ((i.parentNode._pending || (i.parentNode._pending = {}))[e.key] =
              e),
          p && p(i),
          b &&
            (lo(i, u),
            lo(i, f),
            uo(function () {
              fo(i, u),
                $.cancelled ||
                  (lo(i, l), _ || (wo(w) ? setTimeout($, w) : po(i, c, $)));
            })),
          v && v(i, $),
          b || _ || $());
      }
    }

    function _o(e, t, n) {
      "number" != typeof e
        ? ue(
            "<transition> explicit " +
              t +
              " duration is not a valid number - got " +
              JSON.stringify(e) +
              ".",
            n.context
          )
        : isNaN(e) &&
          ue(
            "<transition> explicit " +
              t +
              " duration is NaN - the duration expression might be incorrect.",
            n.context
          );
    }

    function wo(e) {
      return "number" == typeof e && !isNaN(e);
    }

    function $o(e) {
      if (t(e)) return !1;
      var r = e.fns;
      return n(r)
        ? $o(Array.isArray(r) ? r[0] : r)
        : (e._length || e.length) > 1;
    }

    function xo(e, t) {
      !0 !== t.data.show && go(t);
    }
    var ko = (function (e) {
      var o,
        a,
        s = {},
        c = e.modules,
        l = e.nodeOps;
      for (o = 0; o < Dr.length; ++o)
        for (s[Dr[o]] = [], a = 0; a < c.length; ++a)
          n(c[a][Dr[o]]) && s[Dr[o]].push(c[a][Dr[o]]);

      function f(e) {
        var t = l.parentNode(e);
        n(t) && l.removeChild(t, e);
      }

      function p(e, t) {
        return (
          !t &&
          !e.ns &&
          !(
            R.ignoredElements.length &&
            R.ignoredElements.some(function (t) {
              return u(t) ? t.test(e.tag) : t === e.tag;
            })
          ) &&
          R.isUnknownElement(e.tag)
        );
      }
      var d = 0;

      function h(e, t, i, o, a, c, u) {
        if (
          (n(e.elm) && n(c) && (e = c[u] = ke(e)),
          (e.isRootInsert = !a),
          !(function (e, t, i, o) {
            var a = e.data;
            if (n(a)) {
              var c = n(e.componentInstance) && a.keepAlive;
              if (
                (n((a = a.hook)) && n((a = a.init)) && a(e, !1),
                n(e.componentInstance))
              )
                return (
                  m(e, t),
                  y(i, e.elm, o),
                  r(c) &&
                    (function (e, t, r, i) {
                      var o,
                        a = e;
                      for (; a.componentInstance; )
                        if (
                          n((o = (a = a.componentInstance._vnode).data)) &&
                          n((o = o.transition))
                        ) {
                          for (o = 0; o < s.activate.length; ++o)
                            s.activate[o](Er, a);
                          t.push(a);
                          break;
                        }
                      y(r, e.elm, i);
                    })(e, t, i, o),
                  !0
                );
            }
          })(e, t, i, o))
        ) {
          var f = e.data,
            v = e.children,
            h = e.tag;
          n(h)
            ? (f && f.pre && d++,
              p(e, d) &&
                ue(
                  "Unknown custom element: <" +
                    h +
                    '> - did you register the component correctly? For recursive components, make sure to provide the "name" option.',
                  e.context
                ),
              (e.elm = e.ns
                ? l.createElementNS(e.ns, h)
                : l.createElement(h, e)),
              w(e),
              g(e, v, t),
              n(f) && _(e, t),
              y(i, e.elm, o),
              f && f.pre && d--)
            : r(e.isComment)
            ? ((e.elm = l.createComment(e.text)), y(i, e.elm, o))
            : ((e.elm = l.createTextNode(e.text)), y(i, e.elm, o));
        }
      }

      function m(e, t) {
        n(e.data.pendingInsert) &&
          (t.push.apply(t, e.data.pendingInsert),
          (e.data.pendingInsert = null)),
          (e.elm = e.componentInstance.$el),
          b(e) ? (_(e, t), w(e)) : (Nr(e), t.push(e));
      }

      function y(e, t, r) {
        n(e) &&
          (n(r)
            ? l.parentNode(r) === e && l.insertBefore(e, t, r)
            : l.appendChild(e, t));
      }

      function g(e, t, n) {
        if (Array.isArray(t)) {
          A(t);
          for (var r = 0; r < t.length; ++r) h(t[r], n, e.elm, null, !0, t, r);
        } else
          i(e.text) && l.appendChild(e.elm, l.createTextNode(String(e.text)));
      }

      function b(e) {
        for (; e.componentInstance; ) e = e.componentInstance._vnode;
        return n(e.tag);
      }

      function _(e, t) {
        for (var r = 0; r < s.create.length; ++r) s.create[r](Er, e);
        n((o = e.data.hook)) &&
          (n(o.create) && o.create(Er, e), n(o.insert) && t.push(e));
      }

      function w(e) {
        var t;
        if (n((t = e.fnScopeId))) l.setStyleScope(e.elm, t);
        else
          for (var r = e; r; )
            n((t = r.context)) &&
              n((t = t.$options._scopeId)) &&
              l.setStyleScope(e.elm, t),
              (r = r.parent);
        n((t = kn)) &&
          t !== e.context &&
          t !== e.fnContext &&
          n((t = t.$options._scopeId)) &&
          l.setStyleScope(e.elm, t);
      }

      function $(e, t, n, r, i, o) {
        for (; r <= i; ++r) h(n[r], o, e, t, !1, n, r);
      }

      function x(e) {
        var t,
          r,
          i = e.data;
        if (n(i))
          for (
            n((t = i.hook)) && n((t = t.destroy)) && t(e), t = 0;
            t < s.destroy.length;
            ++t
          )
            s.destroy[t](e);
        if (n((t = e.children)))
          for (r = 0; r < e.children.length; ++r) x(e.children[r]);
      }

      function k(e, t, r) {
        for (; t <= r; ++t) {
          var i = e[t];
          n(i) && (n(i.tag) ? (C(i), x(i)) : f(i.elm));
        }
      }

      function C(e, t) {
        if (n(t) || n(e.data)) {
          var r,
            i = s.remove.length + 1;
          for (
            n(t)
              ? (t.listeners += i)
              : (t = (function (e, t) {
                  function n() {
                    0 == --n.listeners && f(e);
                  }
                  return (n.listeners = t), n;
                })(e.elm, i)),
              n((r = e.componentInstance)) &&
                n((r = r._vnode)) &&
                n(r.data) &&
                C(r, t),
              r = 0;
            r < s.remove.length;
            ++r
          )
            s.remove[r](e, t);
          n((r = e.data.hook)) && n((r = r.remove)) ? r(e, t) : t();
        } else f(e.elm);
      }

      function A(e) {
        for (var t = {}, r = 0; r < e.length; r++) {
          var i = e[r],
            o = i.key;
          n(o) &&
            (t[o]
              ? ue(
                  "Duplicate keys detected: '" +
                    o +
                    "'. This may cause an update error.",
                  i.context
                )
              : (t[o] = !0));
        }
      }

      function S(e, t, r, i) {
        for (var o = r; o < i; o++) {
          var a = t[o];
          if (n(a) && Lr(e, a)) return o;
        }
      }

      function O(e, i, o, a, c, u) {
        if (e !== i) {
          n(i.elm) && n(a) && (i = a[c] = ke(i));
          var f = (i.elm = e.elm);
          if (r(e.isAsyncPlaceholder))
            n(i.asyncFactory.resolved)
              ? I(e.elm, i, o)
              : (i.isAsyncPlaceholder = !0);
          else if (
            r(i.isStatic) &&
            r(e.isStatic) &&
            i.key === e.key &&
            (r(i.isCloned) || r(i.isOnce))
          )
            i.componentInstance = e.componentInstance;
          else {
            var p,
              d = i.data;
            n(d) && n((p = d.hook)) && n((p = p.prepatch)) && p(e, i);
            var v = e.children,
              m = i.children;
            if (n(d) && b(i)) {
              for (p = 0; p < s.update.length; ++p) s.update[p](e, i);
              n((p = d.hook)) && n((p = p.update)) && p(e, i);
            }
            t(i.text)
              ? n(v) && n(m)
                ? v !== m &&
                  (function (e, r, i, o, a) {
                    var s,
                      c,
                      u,
                      f = 0,
                      p = 0,
                      d = r.length - 1,
                      v = r[0],
                      m = r[d],
                      y = i.length - 1,
                      g = i[0],
                      b = i[y],
                      _ = !a;
                    for (A(i); f <= d && p <= y; )
                      t(v)
                        ? (v = r[++f])
                        : t(m)
                        ? (m = r[--d])
                        : Lr(v, g)
                        ? (O(v, g, o, i, p), (v = r[++f]), (g = i[++p]))
                        : Lr(m, b)
                        ? (O(m, b, o, i, y), (m = r[--d]), (b = i[--y]))
                        : Lr(v, b)
                        ? (O(v, b, o, i, y),
                          _ && l.insertBefore(e, v.elm, l.nextSibling(m.elm)),
                          (v = r[++f]),
                          (b = i[--y]))
                        : Lr(m, g)
                        ? (O(m, g, o, i, p),
                          _ && l.insertBefore(e, m.elm, v.elm),
                          (m = r[--d]),
                          (g = i[++p]))
                        : (t(s) && (s = Fr(r, f, d)),
                          t((c = n(g.key) ? s[g.key] : S(g, r, f, d)))
                            ? h(g, o, e, v.elm, !1, i, p)
                            : Lr((u = r[c]), g)
                            ? (O(u, g, o, i, p),
                              (r[c] = void 0),
                              _ && l.insertBefore(e, u.elm, v.elm))
                            : h(g, o, e, v.elm, !1, i, p),
                          (g = i[++p]));
                    f > d
                      ? $(e, t(i[y + 1]) ? null : i[y + 1].elm, i, p, y, o)
                      : p > y && k(r, f, d);
                  })(f, v, m, o, u)
                : n(m)
                ? (A(m),
                  n(e.text) && l.setTextContent(f, ""),
                  $(f, null, m, 0, m.length - 1, o))
                : n(v)
                ? k(v, 0, v.length - 1)
                : n(e.text) && l.setTextContent(f, "")
              : e.text !== i.text && l.setTextContent(f, i.text),
              n(d) && n((p = d.hook)) && n((p = p.postpatch)) && p(e, i);
          }
        }
      }

      function T(e, t, i) {
        if (r(i) && n(e.parent)) e.parent.data.pendingInsert = t;
        else for (var o = 0; o < t.length; ++o) t[o].data.hook.insert(t[o]);
      }
      var M = !1,
        j = v("attrs,class,staticClass,staticStyle,key");

      function I(e, t, i, o) {
        var a,
          s = t.tag,
          c = t.data,
          u = t.children;
        if (
          ((o = o || (c && c.pre)),
          (t.elm = e),
          r(t.isComment) && n(t.asyncFactory))
        )
          return (t.isAsyncPlaceholder = !0), !0;
        if (
          !(function (e, t, r) {
            return n(t.tag)
              ? 0 === t.tag.indexOf("vue-component") ||
                  (!p(t, r) &&
                    t.tag.toLowerCase() ===
                      (e.tagName && e.tagName.toLowerCase()))
              : e.nodeType === (t.isComment ? 8 : 3);
          })(e, t, o)
        )
          return !1;
        if (
          n(c) &&
          (n((a = c.hook)) && n((a = a.init)) && a(t, !0),
          n((a = t.componentInstance)))
        )
          return m(t, i), !0;
        if (n(s)) {
          if (n(u))
            if (e.hasChildNodes())
              if (n((a = c)) && n((a = a.domProps)) && n((a = a.innerHTML))) {
                if (a !== e.innerHTML)
                  return "undefined" == typeof console || M || (M = !0), !1;
              } else {
                for (var l = !0, f = e.firstChild, d = 0; d < u.length; d++) {
                  if (!f || !I(f, u[d], i, o)) {
                    l = !1;
                    break;
                  }
                  f = f.nextSibling;
                }
                if (!l || f)
                  return "undefined" == typeof console || M || (M = !0), !1;
              }
            else g(t, u, i);
          if (n(c)) {
            var v = !1;
            for (var h in c)
              if (!j(h)) {
                (v = !0), _(t, i);
                break;
              }
            !v && c.class && Ot(c.class);
          }
        } else e.data !== t.text && (e.data = t.text);
        return !0;
      }
      return function (e, i, o, a) {
        if (!t(i)) {
          var c,
            u = !1,
            f = [];
          if (t(e)) (u = !0), h(i, f);
          else {
            var p = n(e.nodeType);
            if (!p && Lr(e, i)) O(e, i, f, null, null, a);
            else {
              if (p) {
                if (
                  (1 === e.nodeType &&
                    e.hasAttribute(L) &&
                    (e.removeAttribute(L), (o = !0)),
                  r(o))
                ) {
                  if (I(e, i, f)) return T(i, f, !0), e;
                  ue(
                    "The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render."
                  );
                }
                (c = e),
                  (e = new _e(l.tagName(c).toLowerCase(), {}, [], void 0, c));
              }
              var d = e.elm,
                v = l.parentNode(d);
              if (
                (h(i, f, d._leaveCb ? null : v, l.nextSibling(d)), n(i.parent))
              )
                for (var m = i.parent, y = b(i); m; ) {
                  for (var g = 0; g < s.destroy.length; ++g) s.destroy[g](m);
                  if (((m.elm = i.elm), y)) {
                    for (var _ = 0; _ < s.create.length; ++_)
                      s.create[_](Er, m);
                    var w = m.data.hook.insert;
                    if (w.merged)
                      for (var $ = 1; $ < w.fns.length; $++) w.fns[$]();
                  } else Nr(m);
                  m = m.parent;
                }
              n(v) ? k([e], 0, 0) : n(e.tag) && x(e);
            }
          }
          return T(i, f, u), i.elm;
        }
        n(e) && x(e);
      };
    })({
      nodeOps: jr,
      modules: [
        Wr,
        ri,
        Di,
        Pi,
        Zi,
        q
          ? {
              create: xo,
              activate: xo,
              remove: function (e, t) {
                !0 !== e.data.show ? bo(e, t) : t();
              },
            }
          : {},
      ].concat(zr),
    });
    X &&
      document.addEventListener("selectionchange", function () {
        var e = document.activeElement;
        e && e.vmodel && Io(e, "input");
      });
    var Co = {
      inserted: function (e, t, n, r) {
        "select" === n.tag
          ? (r.elm && !r.elm._vOptions
              ? Nt(n, "postpatch", function () {
                  Co.componentUpdated(e, t, n);
                })
              : Ao(e, t, n.context),
            (e._vOptions = [].map.call(e.options, To)))
          : ("textarea" === n.tag || Tr(e.type)) &&
            ((e._vModifiers = t.modifiers),
            t.modifiers.lazy ||
              (e.addEventListener("compositionstart", Mo),
              e.addEventListener("compositionend", jo),
              e.addEventListener("change", jo),
              X && (e.vmodel = !0)));
      },
      componentUpdated: function (e, t, n) {
        if ("select" === n.tag) {
          Ao(e, t, n.context);
          var r = e._vOptions,
            i = (e._vOptions = [].map.call(e.options, To));
          if (
            i.some(function (e, t) {
              return !N(e, r[t]);
            })
          )
            (e.multiple
              ? t.value.some(function (e) {
                  return Oo(e, i);
                })
              : t.value !== t.oldValue && Oo(t.value, i)) && Io(e, "change");
        }
      },
    };

    function Ao(e, t, n) {
      So(e, t, n),
        (G || Y) &&
          setTimeout(function () {
            So(e, t, n);
          }, 0);
    }

    function So(e, t, n) {
      var r = t.value,
        i = e.multiple;
      if (!i || Array.isArray(r)) {
        for (var o, a, s = 0, c = e.options.length; s < c; s++)
          if (((a = e.options[s]), i))
            (o = E(r, To(a)) > -1), a.selected !== o && (a.selected = o);
          else if (N(To(a), r))
            return void (e.selectedIndex !== s && (e.selectedIndex = s));
        i || (e.selectedIndex = -1);
      } else ue('<select multiple v-model="' + t.expression + '"> expects an Array value for its binding, but got ' + Object.prototype.toString.call(r).slice(8, -1), n);
    }

    function Oo(e, t) {
      return t.every(function (t) {
        return !N(t, e);
      });
    }

    function To(e) {
      return "_value" in e ? e._value : e.value;
    }

    function Mo(e) {
      e.target.composing = !0;
    }

    function jo(e) {
      e.target.composing && ((e.target.composing = !1), Io(e.target, "input"));
    }

    function Io(e, t) {
      var n = document.createEvent("HTMLEvents");
      n.initEvent(t, !0, !0), e.dispatchEvent(n);
    }

    function No(e) {
      return !e.componentInstance || (e.data && e.data.transition)
        ? e
        : No(e.componentInstance._vnode);
    }
    var Eo = {
        bind: function (e, t, n) {
          var r = t.value,
            i = (n = No(n)).data && n.data.transition,
            o = (e.__vOriginalDisplay =
              "none" === e.style.display ? "" : e.style.display);
          r && i
            ? ((n.data.show = !0),
              go(n, function () {
                e.style.display = o;
              }))
            : (e.style.display = r ? o : "none");
        },
        update: function (e, t, n) {
          var r = t.value;
          !r != !t.oldValue &&
            ((n = No(n)).data && n.data.transition
              ? ((n.data.show = !0),
                r
                  ? go(n, function () {
                      e.style.display = e.__vOriginalDisplay;
                    })
                  : bo(n, function () {
                      e.style.display = "none";
                    }))
              : (e.style.display = r ? e.__vOriginalDisplay : "none"));
        },
        unbind: function (e, t, n, r, i) {
          i || (e.style.display = e.__vOriginalDisplay);
        },
      },
      Do = {
        model: Co,
        show: Eo,
      },
      Lo = {
        name: String,
        appear: Boolean,
        css: Boolean,
        mode: String,
        type: String,
        enterClass: String,
        leaveClass: String,
        enterToClass: String,
        leaveToClass: String,
        enterActiveClass: String,
        leaveActiveClass: String,
        appearClass: String,
        appearActiveClass: String,
        appearToClass: String,
        duration: [Number, String, Object],
      };

    function Fo(e) {
      var t = e && e.componentOptions;
      return t && t.Ctor.options.abstract ? Fo(bn(t.children)) : e;
    }

    function Po(e) {
      var t = {},
        n = e.$options;
      for (var r in n.propsData) t[r] = e[r];
      var i = n._parentListeners;
      for (var o in i) t[$(o)] = i[o];
      return t;
    }

    function Ro(e, t) {
      if (/\d-keep-alive$/.test(t.tag))
        return e("keep-alive", {
          props: t.componentOptions.propsData,
        });
    }
    var Uo = function (e) {
        return e.tag || Ht(e);
      },
      Ho = function (e) {
        return "show" === e.name;
      },
      Bo = {
        name: "transition",
        props: Lo,
        abstract: !0,
        render: function (e) {
          var t = this,
            n = this.$slots.default;
          if (n && (n = n.filter(Uo)).length) {
            n.length > 1 &&
              ue(
                "<transition> can only be used on a single element. Use <transition-group> for lists.",
                this.$parent
              );
            var r = this.mode;
            r &&
              "in-out" !== r &&
              "out-in" !== r &&
              ue("invalid <transition> mode: " + r, this.$parent);
            var o = n[0];
            if (
              (function (e) {
                for (; (e = e.parent); ) if (e.data.transition) return !0;
              })(this.$vnode)
            )
              return o;
            var a = Fo(o);
            if (!a) return o;
            if (this._leaving) return Ro(e, o);
            var s = "__transition-" + this._uid + "-";
            a.key =
              null == a.key
                ? a.isComment
                  ? s + "comment"
                  : s + a.tag
                : i(a.key)
                ? 0 === String(a.key).indexOf(s)
                  ? a.key
                  : s + a.key
                : a.key;
            var c = ((a.data || (a.data = {})).transition = Po(this)),
              u = this._vnode,
              l = Fo(u);
            if (
              (a.data.directives &&
                a.data.directives.some(Ho) &&
                (a.data.show = !0),
              l &&
                l.data &&
                !(function (e, t) {
                  return t.key === e.key && t.tag === e.tag;
                })(a, l) &&
                !Ht(l) &&
                (!l.componentInstance || !l.componentInstance._vnode.isComment))
            ) {
              var f = (l.data.transition = O({}, c));
              if ("out-in" === r)
                return (
                  (this._leaving = !0),
                  Nt(f, "afterLeave", function () {
                    (t._leaving = !1), t.$forceUpdate();
                  }),
                  Ro(e, o)
                );
              if ("in-out" === r) {
                if (Ht(a)) return u;
                var p,
                  d = function () {
                    p();
                  };
                Nt(c, "afterEnter", d),
                  Nt(c, "enterCancelled", d),
                  Nt(f, "delayLeave", function (e) {
                    p = e;
                  });
              }
            }
            return o;
          }
        },
      },
      Vo = O(
        {
          tag: String,
          moveClass: String,
        },
        Lo
      );
    delete Vo.mode;
    var zo = {
      props: Vo,
      beforeMount: function () {
        var e = this,
          t = this._update;
        this._update = function (n, r) {
          var i = An(e);
          e.__patch__(e._vnode, e.kept, !1, !0),
            (e._vnode = e.kept),
            i(),
            t.call(e, n, r);
        };
      },
      render: function (e) {
        for (
          var t = this.tag || this.$vnode.data.tag || "span",
            n = Object.create(null),
            r = (this.prevChildren = this.children),
            i = this.$slots.default || [],
            o = (this.children = []),
            a = Po(this),
            s = 0;
          s < i.length;
          s++
        ) {
          var c = i[s];
          if (c.tag)
            if (null != c.key && 0 !== String(c.key).indexOf("__vlist"))
              o.push(c),
                (n[c.key] = c),
                ((c.data || (c.data = {})).transition = a);
            else {
              var u = c.componentOptions,
                l = u ? u.Ctor.options.name || u.tag || "" : c.tag;
              ue("<transition-group> children must be keyed: <" + l + ">");
            }
        }
        if (r) {
          for (var f = [], p = [], d = 0; d < r.length; d++) {
            var v = r[d];
            (v.data.transition = a),
              (v.data.pos = v.elm.getBoundingClientRect()),
              n[v.key] ? f.push(v) : p.push(v);
          }
          (this.kept = e(t, null, f)), (this.removed = p);
        }
        return e(t, null, o);
      },
      updated: function () {
        var e = this.prevChildren,
          t = this.moveClass || (this.name || "v") + "-move";
        e.length &&
          this.hasMove(e[0].elm, t) &&
          (e.forEach(Jo),
          e.forEach(qo),
          e.forEach(Ko),
          (this._reflow = document.body.offsetHeight),
          e.forEach(function (e) {
            if (e.data.moved) {
              var n = e.elm,
                r = n.style;
              lo(n, t),
                (r.transform = r.WebkitTransform = r.transitionDuration = ""),
                n.addEventListener(
                  oo,
                  (n._moveCb = function e(r) {
                    (r && r.target !== n) ||
                      (r && !/transform$/.test(r.propertyName)) ||
                      (n.removeEventListener(oo, e),
                      (n._moveCb = null),
                      fo(n, t));
                  })
                );
            }
          }));
      },
      methods: {
        hasMove: function (e, t) {
          if (!to) return !1;
          if (this._hasMove) return this._hasMove;
          var n = e.cloneNode();
          e._transitionClasses &&
            e._transitionClasses.forEach(function (e) {
              Yi(n, e);
            }),
            Xi(n, t),
            (n.style.display = "none"),
            this.$el.appendChild(n);
          var r = ho(n);
          return this.$el.removeChild(n), (this._hasMove = r.hasTransform);
        },
      },
    };

    function Jo(e) {
      e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb();
    }

    function qo(e) {
      e.data.newPos = e.elm.getBoundingClientRect();
    }

    function Ko(e) {
      var t = e.data.pos,
        n = e.data.newPos,
        r = t.left - n.left,
        i = t.top - n.top;
      if (r || i) {
        e.data.moved = !0;
        var o = e.elm.style;
        (o.transform = o.WebkitTransform =
          "translate(" + r + "px," + i + "px)"),
          (o.transitionDuration = "0s");
      }
    }
    var Wo = {
      Transition: Bo,
      TransitionGroup: zo,
    };
    (er.config.mustUseProp = fr),
      (er.config.isReservedTag = Ar),
      (er.config.isReservedAttr = ur),
      (er.config.getTagNamespace = Sr),
      (er.config.isUnknownElement = function (e) {
        if (!q) return !0;
        if (Ar(e)) return !1;
        if (((e = e.toLowerCase()), null != Or[e])) return Or[e];
        var t = document.createElement(e);
        return e.indexOf("-") > -1
          ? (Or[e] =
              t.constructor === window.HTMLUnknownElement ||
              t.constructor === window.HTMLElement)
          : (Or[e] = /HTMLUnknownElement/.test(t.toString()));
      }),
      O(er.options.directives, Do),
      O(er.options.components, Wo),
      (er.prototype.__patch__ = q ? ko : M),
      (er.prototype.$mount = function (e, t) {
        return (function (e, t, n) {
          var r;
          return (
            (e.$el = t),
            e.$options.render ||
              ((e.$options.render = $e),
              (e.$options.template && "#" !== e.$options.template.charAt(0)) ||
              e.$options.el ||
              t
                ? ue(
                    "You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.",
                    e
                  )
                : ue(
                    "Failed to mount component: template or render function not defined.",
                    e
                  )),
            Mn(e, "beforeMount"),
            (r =
              R.performance && st
                ? function () {
                    var t = e._name,
                      r = e._uid,
                      i = "vue-perf-start:" + r,
                      o = "vue-perf-end:" + r;
                    st(i);
                    var a = e._render();
                    st(o),
                      ct("vue " + t + " render", i, o),
                      st(i),
                      e._update(a, n),
                      st(o),
                      ct("vue " + t + " patch", i, o);
                  }
                : function () {
                    e._update(e._render(), n);
                  }),
            new Vn(
              e,
              r,
              M,
              {
                before: function () {
                  e._isMounted && !e._isDestroyed && Mn(e, "beforeUpdate");
                },
              },
              !0
            ),
            (n = !1),
            null == e.$vnode && ((e._isMounted = !0), Mn(e, "mounted")),
            e
          );
        })(this, (e = e && q ? Mr(e) : void 0), t);
      }),
      q &&
        setTimeout(function () {
          R.devtools && oe && oe.emit("init", er), R.productionTip;
        }, 0);
    var Zo = /\{\{((?:.|\r?\n)+?)\}\}/g,
      Go = /[-.*+?^${}()|[\]\/\\]/g,
      Xo = _(function (e) {
        var t = e[0].replace(Go, "\\$&"),
          n = e[1].replace(Go, "\\$&");
        return new RegExp(t + "((?:.|\\n)+?)" + n, "g");
      });

    function Yo(e, t) {
      var n = t ? Xo(t) : Zo;
      if (n.test(e)) {
        for (
          var r, i, o, a = [], s = [], c = (n.lastIndex = 0);
          (r = n.exec(e));

        ) {
          (i = r.index) > c &&
            (s.push((o = e.slice(c, i))), a.push(JSON.stringify(o)));
          var u = oi(r[1].trim());
          a.push("_s(" + u + ")"),
            s.push({
              "@binding": u,
            }),
            (c = i + r[0].length);
        }
        return (
          c < e.length && (s.push((o = e.slice(c))), a.push(JSON.stringify(o))),
          {
            expression: a.join("+"),
            tokens: s,
          }
        );
      }
    }
    var Qo = {
      staticKeys: ["staticClass"],
      transformNode: function (e, t) {
        var n = t.warn || si,
          r = yi(e, "class");
        r &&
          Yo(r, t.delimiters) &&
          n(
            'class="' +
              r +
              '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div class="{{ val }}">, use <div :class="val">.',
            e.rawAttrsMap.class
          ),
          r && (e.staticClass = JSON.stringify(r));
        var i = mi(e, "class", !1);
        i && (e.classBinding = i);
      },
      genData: function (e) {
        var t = "";
        return (
          e.staticClass && (t += "staticClass:" + e.staticClass + ","),
          e.classBinding && (t += "class:" + e.classBinding + ","),
          t
        );
      },
    };
    var ea,
      ta = {
        staticKeys: ["staticStyle"],
        transformNode: function (e, t) {
          var n = t.warn || si,
            r = yi(e, "style");
          r &&
            (Yo(r, t.delimiters) &&
              n(
                'style="' +
                  r +
                  '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div style="{{ val }}">, use <div :style="val">.',
                e.rawAttrsMap.style
              ),
            (e.staticStyle = JSON.stringify(Ri(r))));
          var i = mi(e, "style", !1);
          i && (e.styleBinding = i);
        },
        genData: function (e) {
          var t = "";
          return (
            e.staticStyle && (t += "staticStyle:" + e.staticStyle + ","),
            e.styleBinding && (t += "style:(" + e.styleBinding + "),"),
            t
          );
        },
      },
      na = function (e) {
        return (
          ((ea = ea || document.createElement("div")).innerHTML = e),
          ea.textContent
        );
      },
      ra = v(
        "area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"
      ),
      ia = v("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),
      oa = v(
        "address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"
      ),
      aa =
        /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
      sa =
        /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
      ca = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + U.source + "]*",
      ua = "((?:" + ca + "\\:)?" + ca + ")",
      la = new RegExp("^<" + ua),
      fa = /^\s*(\/?)>/,
      pa = new RegExp("^<\\/" + ua + "[^>]*>"),
      da = /^<!DOCTYPE [^>]+>/i,
      va = /^<!\--/,
      ha = /^<!\[/,
      ma = v("script,style,textarea", !0),
      ya = {},
      ga = {
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&amp;": "&",
        "&#10;": "\n",
        "&#9;": "\t",
        "&#39;": "'",
      },
      ba = /&(?:lt|gt|quot|amp|#39);/g,
      _a = /&(?:lt|gt|quot|amp|#39|#10|#9);/g,
      wa = v("pre,textarea", !0),
      $a = function (e, t) {
        return e && wa(e) && "\n" === t[0];
      };

    function xa(e, t) {
      var n = t ? _a : ba;
      return e.replace(n, function (e) {
        return ga[e];
      });
    }
    var ka,
      Ca,
      Aa,
      Sa,
      Oa,
      Ta,
      Ma,
      ja,
      Ia,
      Na = /^@|^v-on:/,
      Ea = /^v-|^@|^:|^#/,
      Da = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
      La = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
      Fa = /^\(|\)$/g,
      Pa = /^\[.*\]$/,
      Ra = /:(.*)$/,
      Ua = /^:|^\.|^v-bind:/,
      Ha = /\.[^.\]]+(?=[^\]]*$)/g,
      Ba = /^v-slot(:|$)|^#/,
      Va = /[\r\n]/,
      za = /[ \f\t\r\n]+/g,
      Ja = /[\s"'<>\/=]/,
      qa = _(na),
      Ka = "_empty_";

    function Wa(e, t, n) {
      return {
        type: 1,
        tag: e,
        attrsList: t,
        attrsMap: ts(t),
        rawAttrsMap: {},
        parent: n,
        children: [],
      };
    }

    function Za(e, t) {
      (ka = t.warn || si),
        (Ta = t.isPreTag || j),
        (Ma = t.mustUseProp || j),
        (ja = t.getTagNamespace || j);
      var n = t.isReservedTag || j;
      (Ia = function (e) {
        return !(
          !(e.component || e.attrsMap[":is"] || e.attrsMap["v-bind:is"]) &&
          (e.attrsMap.is ? n(e.attrsMap.is) : n(e.tag))
        );
      }),
        (Aa = ci(t.modules, "transformNode")),
        (Sa = ci(t.modules, "preTransformNode")),
        (Oa = ci(t.modules, "postTransformNode")),
        (Ca = t.delimiters);
      var r,
        i,
        o = [],
        a = !1 !== t.preserveWhitespace,
        s = t.whitespace,
        c = !1,
        u = !1,
        l = !1;

      function f(e, t) {
        l || ((l = !0), ka(e, t));
      }

      function p(e) {
        if (
          (d(e),
          c || e.processed || (e = Ga(e, t)),
          o.length ||
            e === r ||
            (r.if && (e.elseif || e.else)
              ? (v(e),
                Ya(r, {
                  exp: e.elseif,
                  block: e,
                }))
              : f(
                  "Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead.",
                  {
                    start: e.start,
                  }
                )),
          i && !e.forbidden)
        )
          if (e.elseif || e.else)
            (a = e),
              (s = (function (e) {
                for (var t = e.length; t--; ) {
                  if (1 === e[t].type) return e[t];
                  " " !== e[t].text &&
                    ka(
                      'text "' +
                        e[t].text.trim() +
                        '" between v-if and v-else(-if) will be ignored.',
                      e[t]
                    ),
                    e.pop();
                }
              })(i.children)),
              s && s.if
                ? Ya(s, {
                    exp: a.elseif,
                    block: a,
                  })
                : ka(
                    "v-" +
                      (a.elseif ? 'else-if="' + a.elseif + '"' : "else") +
                      " used on element <" +
                      a.tag +
                      "> without corresponding v-if.",
                    a.rawAttrsMap[a.elseif ? "v-else-if" : "v-else"]
                  );
          else {
            if (e.slotScope) {
              var n = e.slotTarget || '"default"';
              (i.scopedSlots || (i.scopedSlots = {}))[n] = e;
            }
            i.children.push(e), (e.parent = i);
          }
        var a, s;
        (e.children = e.children.filter(function (e) {
          return !e.slotScope;
        })),
          d(e),
          e.pre && (c = !1),
          Ta(e.tag) && (u = !1);
        for (var l = 0; l < Oa.length; l++) Oa[l](e, t);
      }

      function d(e) {
        if (!u)
          for (
            var t;
            (t = e.children[e.children.length - 1]) &&
            3 === t.type &&
            " " === t.text;

          )
            e.children.pop();
      }

      function v(e) {
        ("slot" !== e.tag && "template" !== e.tag) ||
          f(
            "Cannot use <" +
              e.tag +
              "> as component root element because it may contain multiple nodes.",
            {
              start: e.start,
            }
          ),
          e.attrsMap.hasOwnProperty("v-for") &&
            f(
              "Cannot use v-for on stateful component root element because it renders multiple elements.",
              e.rawAttrsMap["v-for"]
            );
      }
      return (
        (function (e, t) {
          for (
            var n,
              r,
              i = [],
              o = t.expectHTML,
              a = t.isUnaryTag || j,
              s = t.canBeLeftOpenTag || j,
              c = 0;
            e;

          ) {
            if (((n = e), r && ma(r))) {
              var u = 0,
                l = r.toLowerCase(),
                f =
                  ya[l] ||
                  (ya[l] = new RegExp("([\\s\\S]*?)(</" + l + "[^>]*>)", "i")),
                p = e.replace(f, function (e, n, r) {
                  return (
                    (u = r.length),
                    ma(l) ||
                      "noscript" === l ||
                      (n = n
                        .replace(/<!\--([\s\S]*?)-->/g, "$1")
                        .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1")),
                    $a(l, n) && (n = n.slice(1)),
                    t.chars && t.chars(n),
                    ""
                  );
                });
              (c += e.length - p.length), (e = p), A(l, c - u, c);
            } else {
              var d = e.indexOf("<");
              if (0 === d) {
                if (va.test(e)) {
                  var v = e.indexOf("--\x3e");
                  if (v >= 0) {
                    t.shouldKeepComment &&
                      t.comment(e.substring(4, v), c, c + v + 3),
                      x(v + 3);
                    continue;
                  }
                }
                if (ha.test(e)) {
                  var h = e.indexOf("]>");
                  if (h >= 0) {
                    x(h + 2);
                    continue;
                  }
                }
                var m = e.match(da);
                if (m) {
                  x(m[0].length);
                  continue;
                }
                var y = e.match(pa);
                if (y) {
                  var g = c;
                  x(y[0].length), A(y[1], g, c);
                  continue;
                }
                var b = k();
                if (b) {
                  C(b), $a(b.tagName, e) && x(1);
                  continue;
                }
              }
              var _ = void 0,
                w = void 0,
                $ = void 0;
              if (d >= 0) {
                for (
                  w = e.slice(d);
                  !(
                    pa.test(w) ||
                    la.test(w) ||
                    va.test(w) ||
                    ha.test(w) ||
                    ($ = w.indexOf("<", 1)) < 0
                  );

                )
                  (d += $), (w = e.slice(d));
                _ = e.substring(0, d);
              }
              d < 0 && (_ = e),
                _ && x(_.length),
                t.chars && _ && t.chars(_, c - _.length, c);
            }
            if (e === n) {
              t.chars && t.chars(e),
                !i.length &&
                  t.warn &&
                  t.warn('Mal-formatted tag at end of template: "' + e + '"', {
                    start: c + e.length,
                  });
              break;
            }
          }

          function x(t) {
            (c += t), (e = e.substring(t));
          }

          function k() {
            var t = e.match(la);
            if (t) {
              var n,
                r,
                i = {
                  tagName: t[1],
                  attrs: [],
                  start: c,
                };
              for (
                x(t[0].length);
                !(n = e.match(fa)) && (r = e.match(sa) || e.match(aa));

              )
                (r.start = c), x(r[0].length), (r.end = c), i.attrs.push(r);
              if (n)
                return (i.unarySlash = n[1]), x(n[0].length), (i.end = c), i;
            }
          }

          function C(e) {
            var n = e.tagName,
              c = e.unarySlash;
            o && ("p" === r && oa(n) && A(r), s(n) && r === n && A(n));
            for (
              var u = a(n) || !!c, l = e.attrs.length, f = new Array(l), p = 0;
              p < l;
              p++
            ) {
              var d = e.attrs[p],
                v = d[3] || d[4] || d[5] || "",
                h =
                  "a" === n && "href" === d[1]
                    ? t.shouldDecodeNewlinesForHref
                    : t.shouldDecodeNewlines;
              (f[p] = {
                name: d[1],
                value: xa(v, h),
              }),
                t.outputSourceRange &&
                  ((f[p].start = d.start + d[0].match(/^\s*/).length),
                  (f[p].end = d.end));
            }
            u ||
              (i.push({
                tag: n,
                lowerCasedTag: n.toLowerCase(),
                attrs: f,
                start: e.start,
                end: e.end,
              }),
              (r = n)),
              t.start && t.start(n, f, u, e.start, e.end);
          }

          function A(e, n, o) {
            var a, s;
            if ((null == n && (n = c), null == o && (o = c), e))
              for (
                s = e.toLowerCase(), a = i.length - 1;
                a >= 0 && i[a].lowerCasedTag !== s;
                a--
              );
            else a = 0;
            if (a >= 0) {
              for (var u = i.length - 1; u >= a; u--)
                (u > a || (!e && t.warn)) &&
                  t.warn("tag <" + i[u].tag + "> has no matching end tag.", {
                    start: i[u].start,
                    end: i[u].end,
                  }),
                  t.end && t.end(i[u].tag, n, o);
              (i.length = a), (r = a && i[a - 1].tag);
            } else
              "br" === s
                ? t.start && t.start(e, [], !0, n, o)
                : "p" === s &&
                  (t.start && t.start(e, [], !1, n, o),
                  t.end && t.end(e, n, o));
          }
          A();
        })(e, {
          warn: ka,
          expectHTML: t.expectHTML,
          isUnaryTag: t.isUnaryTag,
          canBeLeftOpenTag: t.canBeLeftOpenTag,
          shouldDecodeNewlines: t.shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: t.shouldDecodeNewlinesForHref,
          shouldKeepComment: t.comments,
          outputSourceRange: t.outputSourceRange,
          start: function (e, n, a, s, l) {
            var f = (i && i.ns) || ja(e);
            G &&
              "svg" === f &&
              (n = (function (e) {
                for (var t = [], n = 0; n < e.length; n++) {
                  var r = e[n];
                  ns.test(r.name) ||
                    ((r.name = r.name.replace(rs, "")), t.push(r));
                }
                return t;
              })(n));
            var d,
              h = Wa(e, n, i);
            f && (h.ns = f),
              t.outputSourceRange &&
                ((h.start = s),
                (h.end = l),
                (h.rawAttrsMap = h.attrsList.reduce(function (e, t) {
                  return (e[t.name] = t), e;
                }, {}))),
              n.forEach(function (e) {
                Ja.test(e.name) &&
                  ka(
                    "Invalid dynamic argument expression: attribute names cannot contain spaces, quotes, <, >, / or =.",
                    {
                      start: e.start + e.name.indexOf("["),
                      end: e.start + e.name.length,
                    }
                  );
              }),
              ("style" !== (d = h).tag &&
                ("script" !== d.tag ||
                  (d.attrsMap.type &&
                    "text/javascript" !== d.attrsMap.type))) ||
                ie() ||
                ((h.forbidden = !0),
                ka(
                  "Templates should only be responsible for mapping the state to the UI. Avoid placing tags with side-effects in your templates, such as <" +
                    e +
                    ">, as they will not be parsed.",
                  {
                    start: h.start,
                  }
                ));
            for (var m = 0; m < Sa.length; m++) h = Sa[m](h, t) || h;
            c ||
              (!(function (e) {
                null != yi(e, "v-pre") && (e.pre = !0);
              })(h),
              h.pre && (c = !0)),
              Ta(h.tag) && (u = !0),
              c
                ? (function (e) {
                    var t = e.attrsList,
                      n = t.length;
                    if (n)
                      for (var r = (e.attrs = new Array(n)), i = 0; i < n; i++)
                        (r[i] = {
                          name: t[i].name,
                          value: JSON.stringify(t[i].value),
                        }),
                          null != t[i].start &&
                            ((r[i].start = t[i].start), (r[i].end = t[i].end));
                    else e.pre || (e.plain = !0);
                  })(h)
                : h.processed ||
                  (Xa(h),
                  (function (e) {
                    var t = yi(e, "v-if");
                    if (t)
                      (e.if = t),
                        Ya(e, {
                          exp: t,
                          block: e,
                        });
                    else {
                      null != yi(e, "v-else") && (e.else = !0);
                      var n = yi(e, "v-else-if");
                      n && (e.elseif = n);
                    }
                  })(h),
                  (function (e) {
                    null != yi(e, "v-once") && (e.once = !0);
                  })(h)),
              r || v((r = h)),
              a ? p(h) : ((i = h), o.push(h));
          },
          end: function (e, n, r) {
            var a = o[o.length - 1];
            (o.length -= 1),
              (i = o[o.length - 1]),
              t.outputSourceRange && (a.end = r),
              p(a);
          },
          chars: function (n, r, o) {
            if (i) {
              if (!G || "textarea" !== i.tag || i.attrsMap.placeholder !== n) {
                var l,
                  p,
                  d,
                  v = i.children;
                if (
                  (n =
                    u || n.trim()
                      ? "script" === (l = i).tag || "style" === l.tag
                        ? n
                        : qa(n)
                      : v.length
                      ? s
                        ? "condense" === s && Va.test(n)
                          ? ""
                          : " "
                        : a
                        ? " "
                        : ""
                      : "")
                )
                  u || "condense" !== s || (n = n.replace(za, " ")),
                    !c && " " !== n && (p = Yo(n, Ca))
                      ? (d = {
                          type: 2,
                          expression: p.expression,
                          tokens: p.tokens,
                          text: n,
                        })
                      : (" " === n &&
                          v.length &&
                          " " === v[v.length - 1].text) ||
                        (d = {
                          type: 3,
                          text: n,
                        }),
                    d &&
                      (t.outputSourceRange && ((d.start = r), (d.end = o)),
                      v.push(d));
              }
            } else
              n === e
                ? f(
                    "Component template requires a root element, rather than just text.",
                    {
                      start: r,
                    }
                  )
                : (n = n.trim()) &&
                  f('text "' + n + '" outside root element will be ignored.', {
                    start: r,
                  });
          },
          comment: function (e, n, r) {
            if (i) {
              var o = {
                type: 3,
                text: e,
                isComment: !0,
              };
              t.outputSourceRange && ((o.start = n), (o.end = r)),
                i.children.push(o);
            }
          },
        }),
        r
      );
    }

    function Ga(e, t) {
      var n;
      !(function (e) {
        var t = mi(e, "key");
        if (t) {
          if (
            ("template" === e.tag &&
              ka(
                "<template> cannot be keyed. Place the key on real elements instead.",
                hi(e, "key")
              ),
            e.for)
          ) {
            var n = e.iterator2 || e.iterator1,
              r = e.parent;
            n &&
              n === t &&
              r &&
              "transition-group" === r.tag &&
              ka(
                "Do not use v-for index as key on <transition-group> children, this is the same as not using keys.",
                hi(e, "key"),
                !0
              );
          }
          e.key = t;
        }
      })(e),
        (e.plain = !e.key && !e.scopedSlots && !e.attrsList.length),
        (function (e) {
          var t = mi(e, "ref");
          t &&
            ((e.ref = t),
            (e.refInFor = (function (e) {
              var t = e;
              for (; t; ) {
                if (void 0 !== t.for) return !0;
                t = t.parent;
              }
              return !1;
            })(e)));
        })(e),
        (function (e) {
          var t;
          "template" === e.tag
            ? ((t = yi(e, "scope")) &&
                ka(
                  'the "scope" attribute for scoped slots have been deprecated and replaced by "slot-scope" since 2.5. The new "slot-scope" attribute can also be used on plain elements in addition to <template> to denote scoped slots.',
                  e.rawAttrsMap.scope,
                  !0
                ),
              (e.slotScope = t || yi(e, "slot-scope")))
            : (t = yi(e, "slot-scope")) &&
              (e.attrsMap["v-for"] &&
                ka(
                  "Ambiguous combined usage of slot-scope and v-for on <" +
                    e.tag +
                    "> (v-for takes higher priority). Use a wrapper <template> for the scoped slot to make it clearer.",
                  e.rawAttrsMap["slot-scope"],
                  !0
                ),
              (e.slotScope = t));
          var n = mi(e, "slot");
          n &&
            ((e.slotTarget = '""' === n ? '"default"' : n),
            (e.slotTargetDynamic = !(
              !e.attrsMap[":slot"] && !e.attrsMap["v-bind:slot"]
            )),
            "template" === e.tag ||
              e.slotScope ||
              li(e, "slot", n, hi(e, "slot")));
          if ("template" === e.tag) {
            var r = gi(e, Ba);
            if (r) {
              (e.slotTarget || e.slotScope) &&
                ka("Unexpected mixed usage of different slot syntaxes.", e),
                e.parent &&
                  !Ia(e.parent) &&
                  ka(
                    "<template v-slot> can only appear at the root level inside the receiving component",
                    e
                  );
              var i = Qa(r),
                o = i.name,
                a = i.dynamic;
              (e.slotTarget = o),
                (e.slotTargetDynamic = a),
                (e.slotScope = r.value || Ka);
            }
          } else {
            var s = gi(e, Ba);
            if (s) {
              Ia(e) ||
                ka("v-slot can only be used on components or <template>.", s),
                (e.slotScope || e.slotTarget) &&
                  ka("Unexpected mixed usage of different slot syntaxes.", e),
                e.scopedSlots &&
                  ka(
                    "To avoid scope ambiguity, the default slot should also use <template> syntax when there are other named slots.",
                    s
                  );
              var c = e.scopedSlots || (e.scopedSlots = {}),
                u = Qa(s),
                l = u.name,
                f = u.dynamic,
                p = (c[l] = Wa("template", [], e));
              (p.slotTarget = l),
                (p.slotTargetDynamic = f),
                (p.children = e.children.filter(function (e) {
                  if (!e.slotScope) return (e.parent = p), !0;
                })),
                (p.slotScope = s.value || Ka),
                (e.children = []),
                (e.plain = !1);
            }
          }
        })(e),
        "slot" === (n = e).tag &&
          ((n.slotName = mi(n, "name")),
          n.key &&
            ka(
              "`key` does not work on <slot> because slots are abstract outlets and can possibly expand into multiple elements. Use the key on a wrapping element instead.",
              hi(n, "key")
            )),
        (function (e) {
          var t;
          (t = mi(e, "is")) && (e.component = t);
          null != yi(e, "inline-template") && (e.inlineTemplate = !0);
        })(e);
      for (var r = 0; r < Aa.length; r++) e = Aa[r](e, t) || e;
      return (
        (function (e) {
          var t,
            n,
            r,
            i,
            o,
            a,
            s,
            c,
            u = e.attrsList;
          for (t = 0, n = u.length; t < n; t++) {
            if (((r = i = u[t].name), (o = u[t].value), Ea.test(r)))
              if (
                ((e.hasBindings = !0),
                (a = es(r.replace(Ea, ""))) && (r = r.replace(Ha, "")),
                Ua.test(r))
              )
                (r = r.replace(Ua, "")),
                  (o = oi(o)),
                  (c = Pa.test(r)) && (r = r.slice(1, -1)),
                  0 === o.trim().length &&
                    ka(
                      'The value for a v-bind expression cannot be empty. Found in "v-bind:' +
                        r +
                        '"'
                    ),
                  a &&
                    (a.prop &&
                      !c &&
                      "innerHtml" === (r = $(r)) &&
                      (r = "innerHTML"),
                    a.camel && !c && (r = $(r)),
                    a.sync &&
                      ((s = wi(o, "$event")),
                      c
                        ? vi(
                            e,
                            '"update:"+(' + r + ")",
                            s,
                            null,
                            !1,
                            ka,
                            u[t],
                            !0
                          )
                        : (vi(e, "update:" + $(r), s, null, !1, ka, u[t]),
                          C(r) !== $(r) &&
                            vi(e, "update:" + C(r), s, null, !1, ka, u[t])))),
                  (a && a.prop) ||
                  (!e.component && Ma(e.tag, e.attrsMap.type, r))
                    ? ui(e, r, o, u[t], c)
                    : li(e, r, o, u[t], c);
              else if (Na.test(r))
                (r = r.replace(Na, "")),
                  (c = Pa.test(r)) && (r = r.slice(1, -1)),
                  vi(e, r, o, a, !1, ka, u[t], c);
              else {
                var l = (r = r.replace(Ea, "")).match(Ra),
                  f = l && l[1];
                (c = !1),
                  f &&
                    ((r = r.slice(0, -(f.length + 1))),
                    Pa.test(f) && ((f = f.slice(1, -1)), (c = !0))),
                  pi(e, r, i, o, f, c, a, u[t]),
                  "model" === r && is(e, o);
              }
            else
              Yo(o, Ca) &&
                ka(
                  r +
                    '="' +
                    o +
                    '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div id="{{ val }}">, use <div :id="val">.',
                  u[t]
                ),
                li(e, r, JSON.stringify(o), u[t]),
                !e.component &&
                  "muted" === r &&
                  Ma(e.tag, e.attrsMap.type, r) &&
                  ui(e, r, "true", u[t]);
          }
        })(e),
        e
      );
    }

    function Xa(e) {
      var t;
      if ((t = yi(e, "v-for"))) {
        var n = (function (e) {
          var t = e.match(Da);
          if (!t) return;
          var n = {};
          n.for = t[2].trim();
          var r = t[1].trim().replace(Fa, ""),
            i = r.match(La);
          i
            ? ((n.alias = r.replace(La, "").trim()),
              (n.iterator1 = i[1].trim()),
              i[2] && (n.iterator2 = i[2].trim()))
            : (n.alias = r);
          return n;
        })(t);
        n
          ? O(e, n)
          : ka("Invalid v-for expression: " + t, e.rawAttrsMap["v-for"]);
      }
    }

    function Ya(e, t) {
      e.ifConditions || (e.ifConditions = []), e.ifConditions.push(t);
    }

    function Qa(e) {
      var t = e.name.replace(Ba, "");
      return (
        t ||
          ("#" !== e.name[0]
            ? (t = "default")
            : ka("v-slot shorthand syntax requires a slot name.", e)),
        Pa.test(t)
          ? {
              name: t.slice(1, -1),
              dynamic: !0,
            }
          : {
              name: '"' + t + '"',
              dynamic: !1,
            }
      );
    }

    function es(e) {
      var t = e.match(Ha);
      if (t) {
        var n = {};
        return (
          t.forEach(function (e) {
            n[e.slice(1)] = !0;
          }),
          n
        );
      }
    }

    function ts(e) {
      for (var t = {}, n = 0, r = e.length; n < r; n++)
        !t[e[n].name] ||
          G ||
          Y ||
          ka("duplicate attribute: " + e[n].name, e[n]),
          (t[e[n].name] = e[n].value);
      return t;
    }
    var ns = /^xmlns:NS\d+/,
      rs = /^NS\d+:/;

    function is(e, t) {
      for (var n = e; n; )
        n.for &&
          n.alias === t &&
          ka(
            "<" +
              e.tag +
              ' v-model="' +
              t +
              '">: You are binding v-model directly to a v-for iteration alias. This will not be able to modify the v-for source array because writing to the alias is like modifying a function local variable. Consider using an array of objects and use v-model on an object property instead.',
            e.rawAttrsMap["v-model"]
          ),
          (n = n.parent);
    }

    function os(e) {
      return Wa(e.tag, e.attrsList.slice(), e.parent);
    }
    var as = [
      Qo,
      ta,
      {
        preTransformNode: function (e, t) {
          if ("input" === e.tag) {
            var n,
              r = e.attrsMap;
            if (!r["v-model"]) return;
            if (
              ((r[":type"] || r["v-bind:type"]) && (n = mi(e, "type")),
              r.type || n || !r["v-bind"] || (n = "(" + r["v-bind"] + ").type"),
              n)
            ) {
              var i = yi(e, "v-if", !0),
                o = i ? "&&(" + i + ")" : "",
                a = null != yi(e, "v-else", !0),
                s = yi(e, "v-else-if", !0),
                c = os(e);
              Xa(c),
                fi(c, "type", "checkbox"),
                Ga(c, t),
                (c.processed = !0),
                (c.if = "(" + n + ")==='checkbox'" + o),
                Ya(c, {
                  exp: c.if,
                  block: c,
                });
              var u = os(e);
              yi(u, "v-for", !0),
                fi(u, "type", "radio"),
                Ga(u, t),
                Ya(c, {
                  exp: "(" + n + ")==='radio'" + o,
                  block: u,
                });
              var l = os(e);
              return (
                yi(l, "v-for", !0),
                fi(l, ":type", n),
                Ga(l, t),
                Ya(c, {
                  exp: i,
                  block: l,
                }),
                a ? (c.else = !0) : s && (c.elseif = s),
                c
              );
            }
          }
        },
      },
    ];
    var ss,
      cs,
      us = {
        model: function (e, t, n) {
          ni = n;
          var r = t.value,
            i = t.modifiers,
            o = e.tag,
            a = e.attrsMap.type;
          if (
            ("input" === o &&
              "file" === a &&
              ni(
                "<" +
                  e.tag +
                  ' v-model="' +
                  r +
                  '" type="file">:\nFile inputs are read only. Use a v-on:change listener instead.',
                e.rawAttrsMap["v-model"]
              ),
            e.component)
          )
            return _i(e, r, i), !1;
          if ("select" === o)
            !(function (e, t, n) {
              var r =
                'var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return ' +
                (n && n.number ? "_n(val)" : "val") +
                "});";
              (r =
                r +
                " " +
                wi(
                  t,
                  "$event.target.multiple ? $$selectedVal : $$selectedVal[0]"
                )),
                vi(e, "change", r, null, !0);
            })(e, r, i);
          else if ("input" === o && "checkbox" === a)
            !(function (e, t, n) {
              var r = n && n.number,
                i = mi(e, "value") || "null",
                o = mi(e, "true-value") || "true",
                a = mi(e, "false-value") || "false";
              ui(
                e,
                "checked",
                "Array.isArray(" +
                  t +
                  ")?_i(" +
                  t +
                  "," +
                  i +
                  ")>-1" +
                  ("true" === o ? ":(" + t + ")" : ":_q(" + t + "," + o + ")")
              ),
                vi(
                  e,
                  "change",
                  "var $$a=" +
                    t +
                    ",$$el=$event.target,$$c=$$el.checked?(" +
                    o +
                    "):(" +
                    a +
                    ");if(Array.isArray($$a)){var $$v=" +
                    (r ? "_n(" + i + ")" : i) +
                    ",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(" +
                    wi(t, "$$a.concat([$$v])") +
                    ")}else{$$i>-1&&(" +
                    wi(t, "$$a.slice(0,$$i).concat($$a.slice($$i+1))") +
                    ")}}else{" +
                    wi(t, "$$c") +
                    "}",
                  null,
                  !0
                );
            })(e, r, i);
          else if ("input" === o && "radio" === a)
            !(function (e, t, n) {
              var r = n && n.number,
                i = mi(e, "value") || "null";
              ui(
                e,
                "checked",
                "_q(" + t + "," + (i = r ? "_n(" + i + ")" : i) + ")"
              ),
                vi(e, "change", wi(t, i), null, !0);
            })(e, r, i);
          else if ("input" === o || "textarea" === o)
            !(function (e, t, n) {
              var r = e.attrsMap.type,
                i = e.attrsMap["v-bind:value"] || e.attrsMap[":value"],
                o = e.attrsMap["v-bind:type"] || e.attrsMap[":type"];
              if (i && !o) {
                var a = e.attrsMap["v-bind:value"] ? "v-bind:value" : ":value";
                ni(
                  a +
                    '="' +
                    i +
                    '" conflicts with v-model on the same element because the latter already expands to a value binding internally',
                  e.rawAttrsMap[a]
                );
              }
              var s = n || {},
                c = s.lazy,
                u = s.number,
                l = s.trim,
                f = !c && "range" !== r,
                p = c ? "change" : "range" === r ? Oi : "input",
                d = "$event.target.value";
              l && (d = "$event.target.value.trim()");
              u && (d = "_n(" + d + ")");
              var v = wi(t, d);
              f && (v = "if($event.target.composing)return;" + v);
              ui(e, "value", "(" + t + ")"),
                vi(e, p, v, null, !0),
                (l || u) && vi(e, "blur", "$forceUpdate()");
            })(e, r, i);
          else {
            if (!R.isReservedTag(o)) return _i(e, r, i), !1;
            ni(
              "<" +
                e.tag +
                ' v-model="' +
                r +
                "\">: v-model is not supported on this element type. If you are working with contenteditable, it's recommended to wrap a library dedicated for that purpose inside a custom component.",
              e.rawAttrsMap["v-model"]
            );
          }
          return !0;
        },
        text: function (e, t) {
          t.value && ui(e, "textContent", "_s(" + t.value + ")", t);
        },
        html: function (e, t) {
          t.value && ui(e, "innerHTML", "_s(" + t.value + ")", t);
        },
      },
      ls = {
        expectHTML: !0,
        modules: as,
        directives: us,
        isPreTag: function (e) {
          return "pre" === e;
        },
        isUnaryTag: ra,
        mustUseProp: fr,
        canBeLeftOpenTag: ia,
        isReservedTag: Ar,
        getTagNamespace: Sr,
        staticKeys: (function (e) {
          return e
            .reduce(function (e, t) {
              return e.concat(t.staticKeys || []);
            }, [])
            .join(",");
        })(as),
      },
      fs = _(function (e) {
        return v(
          "type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap" +
            (e ? "," + e : "")
        );
      });

    function ps(e, t) {
      e &&
        ((ss = fs(t.staticKeys || "")),
        (cs = t.isReservedTag || j),
        ds(e),
        vs(e, !1));
    }

    function ds(e) {
      if (
        ((e.static = (function (e) {
          if (2 === e.type) return !1;
          if (3 === e.type) return !0;
          return !(
            !e.pre &&
            (e.hasBindings ||
              e.if ||
              e.for ||
              h(e.tag) ||
              !cs(e.tag) ||
              (function (e) {
                for (; e.parent; ) {
                  if ("template" !== (e = e.parent).tag) return !1;
                  if (e.for) return !0;
                }
                return !1;
              })(e) ||
              !Object.keys(e).every(ss))
          );
        })(e)),
        1 === e.type)
      ) {
        if (
          !cs(e.tag) &&
          "slot" !== e.tag &&
          null == e.attrsMap["inline-template"]
        )
          return;
        for (var t = 0, n = e.children.length; t < n; t++) {
          var r = e.children[t];
          ds(r), r.static || (e.static = !1);
        }
        if (e.ifConditions)
          for (var i = 1, o = e.ifConditions.length; i < o; i++) {
            var a = e.ifConditions[i].block;
            ds(a), a.static || (e.static = !1);
          }
      }
    }

    function vs(e, t) {
      if (1 === e.type) {
        if (
          ((e.static || e.once) && (e.staticInFor = t),
          e.static &&
            e.children.length &&
            (1 !== e.children.length || 3 !== e.children[0].type))
        )
          return void (e.staticRoot = !0);
        if (((e.staticRoot = !1), e.children))
          for (var n = 0, r = e.children.length; n < r; n++)
            vs(e.children[n], t || !!e.for);
        if (e.ifConditions)
          for (var i = 1, o = e.ifConditions.length; i < o; i++)
            vs(e.ifConditions[i].block, t);
      }
    }
    var hs = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,
      ms = /\([^)]*?\);*$/,
      ys =
        /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,
      gs = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        up: 38,
        left: 37,
        right: 39,
        down: 40,
        delete: [8, 46],
      },
      bs = {
        esc: ["Esc", "Escape"],
        tab: "Tab",
        enter: "Enter",
        space: [" ", "Spacebar"],
        up: ["Up", "ArrowUp"],
        left: ["Left", "ArrowLeft"],
        right: ["Right", "ArrowRight"],
        down: ["Down", "ArrowDown"],
        delete: ["Backspace", "Delete", "Del"],
      },
      _s = function (e) {
        return "if(" + e + ")return null;";
      },
      ws = {
        stop: "$event.stopPropagation();",
        prevent: "$event.preventDefault();",
        self: _s("$event.target !== $event.currentTarget"),
        ctrl: _s("!$event.ctrlKey"),
        shift: _s("!$event.shiftKey"),
        alt: _s("!$event.altKey"),
        meta: _s("!$event.metaKey"),
        left: _s("'button' in $event && $event.button !== 0"),
        middle: _s("'button' in $event && $event.button !== 1"),
        right: _s("'button' in $event && $event.button !== 2"),
      };

    function $s(e, t) {
      var n = t ? "nativeOn:" : "on:",
        r = "",
        i = "";
      for (var o in e) {
        var a = xs(e[o]);
        e[o] && e[o].dynamic
          ? (i += o + "," + a + ",")
          : (r += '"' + o + '":' + a + ",");
      }
      return (
        (r = "{" + r.slice(0, -1) + "}"),
        i ? n + "_d(" + r + ",[" + i.slice(0, -1) + "])" : n + r
      );
    }

    function xs(e) {
      if (!e) return "function(){}";
      if (Array.isArray(e))
        return (
          "[" +
          e
            .map(function (e) {
              return xs(e);
            })
            .join(",") +
          "]"
        );
      var t = ys.test(e.value),
        n = hs.test(e.value),
        r = ys.test(e.value.replace(ms, ""));
      if (e.modifiers) {
        var i = "",
          o = "",
          a = [];
        for (var s in e.modifiers)
          if (ws[s]) (o += ws[s]), gs[s] && a.push(s);
          else if ("exact" === s) {
            var c = e.modifiers;
            o += _s(
              ["ctrl", "shift", "alt", "meta"]
                .filter(function (e) {
                  return !c[e];
                })
                .map(function (e) {
                  return "$event." + e + "Key";
                })
                .join("||")
            );
          } else a.push(s);
        return (
          a.length &&
            (i += (function (e) {
              return (
                "if(!$event.type.indexOf('key')&&" +
                e.map(ks).join("&&") +
                ")return null;"
              );
            })(a)),
          o && (i += o),
          "function($event){" +
            i +
            (t
              ? "return " + e.value + ".apply(null, arguments)"
              : n
              ? "return (" + e.value + ").apply(null, arguments)"
              : r
              ? "return " + e.value
              : e.value) +
            "}"
        );
      }
      return t || n
        ? e.value
        : "function($event){" + (r ? "return " + e.value : e.value) + "}";
    }

    function ks(e) {
      var t = parseInt(e, 10);
      if (t) return "$event.keyCode!==" + t;
      var n = gs[e],
        r = bs[e];
      return (
        "_k($event.keyCode," +
        JSON.stringify(e) +
        "," +
        JSON.stringify(n) +
        ",$event.key," +
        JSON.stringify(r) +
        ")"
      );
    }
    var Cs = {
        on: function (e, t) {
          t.modifiers &&
            ue("v-on without argument does not support modifiers."),
            (e.wrapListeners = function (e) {
              return "_g(" + e + "," + t.value + ")";
            });
        },
        bind: function (e, t) {
          e.wrapData = function (n) {
            return (
              "_b(" +
              n +
              ",'" +
              e.tag +
              "'," +
              t.value +
              "," +
              (t.modifiers && t.modifiers.prop ? "true" : "false") +
              (t.modifiers && t.modifiers.sync ? ",true" : "") +
              ")"
            );
          };
        },
        cloak: M,
      },
      As = function (e) {
        (this.options = e),
          (this.warn = e.warn || si),
          (this.transforms = ci(e.modules, "transformCode")),
          (this.dataGenFns = ci(e.modules, "genData")),
          (this.directives = O(O({}, Cs), e.directives));
        var t = e.isReservedTag || j;
        (this.maybeComponent = function (e) {
          return !!e.component || !t(e.tag);
        }),
          (this.onceId = 0),
          (this.staticRenderFns = []),
          (this.pre = !1);
      };

    function Ss(e, t) {
      var n = new As(t);
      return {
        render:
          "with(this){return " +
          (e ? ("script" === e.tag ? "null" : Os(e, n)) : '_c("div")') +
          "}",
        staticRenderFns: n.staticRenderFns,
      };
    }

    function Os(e, t) {
      if (
        (e.parent && (e.pre = e.pre || e.parent.pre),
        e.staticRoot && !e.staticProcessed)
      )
        return Ts(e, t);
      if (e.once && !e.onceProcessed) return Ms(e, t);
      if (e.for && !e.forProcessed) return Ns(e, t);
      if (e.if && !e.ifProcessed) return js(e, t);
      if ("template" !== e.tag || e.slotTarget || t.pre) {
        if ("slot" === e.tag)
          return (function (e, t) {
            var n = e.slotName || '"default"',
              r = Fs(e, t),
              i = "_t(" + n + (r ? ",function(){return " + r + "}" : ""),
              o =
                e.attrs || e.dynamicAttrs
                  ? Us(
                      (e.attrs || [])
                        .concat(e.dynamicAttrs || [])
                        .map(function (e) {
                          return {
                            name: $(e.name),
                            value: e.value,
                            dynamic: e.dynamic,
                          };
                        })
                    )
                  : null,
              a = e.attrsMap["v-bind"];
            (!o && !a) || r || (i += ",null");
            o && (i += "," + o);
            a && (i += (o ? "" : ",null") + "," + a);
            return i + ")";
          })(e, t);
        var n;
        if (e.component)
          n = (function (e, t, n) {
            var r = t.inlineTemplate ? null : Fs(t, n, !0);
            return "_c(" + e + "," + Es(t, n) + (r ? "," + r : "") + ")";
          })(e.component, e, t);
        else {
          var r;
          (!e.plain || (e.pre && t.maybeComponent(e))) && (r = Es(e, t));
          var i = e.inlineTemplate ? null : Fs(e, t, !0);
          n =
            "_c('" +
            e.tag +
            "'" +
            (r ? "," + r : "") +
            (i ? "," + i : "") +
            ")";
        }
        for (var o = 0; o < t.transforms.length; o++) n = t.transforms[o](e, n);
        return n;
      }
      return Fs(e, t) || "void 0";
    }

    function Ts(e, t) {
      e.staticProcessed = !0;
      var n = t.pre;
      return (
        e.pre && (t.pre = e.pre),
        t.staticRenderFns.push("with(this){return " + Os(e, t) + "}"),
        (t.pre = n),
        "_m(" +
          (t.staticRenderFns.length - 1) +
          (e.staticInFor ? ",true" : "") +
          ")"
      );
    }

    function Ms(e, t) {
      if (((e.onceProcessed = !0), e.if && !e.ifProcessed)) return js(e, t);
      if (e.staticInFor) {
        for (var n = "", r = e.parent; r; ) {
          if (r.for) {
            n = r.key;
            break;
          }
          r = r.parent;
        }
        return n
          ? "_o(" + Os(e, t) + "," + t.onceId++ + "," + n + ")"
          : (t.warn(
              "v-once can only be used inside v-for that is keyed. ",
              e.rawAttrsMap["v-once"]
            ),
            Os(e, t));
      }
      return Ts(e, t);
    }

    function js(e, t, n, r) {
      return (e.ifProcessed = !0), Is(e.ifConditions.slice(), t, n, r);
    }

    function Is(e, t, n, r) {
      if (!e.length) return r || "_e()";
      var i = e.shift();
      return i.exp
        ? "(" + i.exp + ")?" + o(i.block) + ":" + Is(e, t, n, r)
        : "" + o(i.block);

      function o(e) {
        return n ? n(e, t) : e.once ? Ms(e, t) : Os(e, t);
      }
    }

    function Ns(e, t, n, r) {
      var i = e.for,
        o = e.alias,
        a = e.iterator1 ? "," + e.iterator1 : "",
        s = e.iterator2 ? "," + e.iterator2 : "";
      return (
        t.maybeComponent(e) &&
          "slot" !== e.tag &&
          "template" !== e.tag &&
          !e.key &&
          t.warn(
            "<" +
              e.tag +
              ' v-for="' +
              o +
              " in " +
              i +
              '">: component lists rendered with v-for should have explicit keys. See https://vuejs.org/guide/list.html#key for more info.',
            e.rawAttrsMap["v-for"],
            !0
          ),
        (e.forProcessed = !0),
        (r || "_l") +
          "((" +
          i +
          "),function(" +
          o +
          a +
          s +
          "){return " +
          (n || Os)(e, t) +
          "})"
      );
    }

    function Es(e, t) {
      var n = "{",
        r = (function (e, t) {
          var n = e.directives;
          if (!n) return;
          var r,
            i,
            o,
            a,
            s = "directives:[",
            c = !1;
          for (r = 0, i = n.length; r < i; r++) {
            (o = n[r]), (a = !0);
            var u = t.directives[o.name];
            u && (a = !!u(e, o, t.warn)),
              a &&
                ((c = !0),
                (s +=
                  '{name:"' +
                  o.name +
                  '",rawName:"' +
                  o.rawName +
                  '"' +
                  (o.value
                    ? ",value:(" +
                      o.value +
                      "),expression:" +
                      JSON.stringify(o.value)
                    : "") +
                  (o.arg
                    ? ",arg:" + (o.isDynamicArg ? o.arg : '"' + o.arg + '"')
                    : "") +
                  (o.modifiers
                    ? ",modifiers:" + JSON.stringify(o.modifiers)
                    : "") +
                  "},"));
          }
          if (c) return s.slice(0, -1) + "]";
        })(e, t);
      r && (n += r + ","),
        e.key && (n += "key:" + e.key + ","),
        e.ref && (n += "ref:" + e.ref + ","),
        e.refInFor && (n += "refInFor:true,"),
        e.pre && (n += "pre:true,"),
        e.component && (n += 'tag:"' + e.tag + '",');
      for (var i = 0; i < t.dataGenFns.length; i++) n += t.dataGenFns[i](e);
      if (
        (e.attrs && (n += "attrs:" + Us(e.attrs) + ","),
        e.props && (n += "domProps:" + Us(e.props) + ","),
        e.events && (n += $s(e.events, !1) + ","),
        e.nativeEvents && (n += $s(e.nativeEvents, !0) + ","),
        e.slotTarget && !e.slotScope && (n += "slot:" + e.slotTarget + ","),
        e.scopedSlots &&
          (n +=
            (function (e, t, n) {
              var r =
                  e.for ||
                  Object.keys(t).some(function (e) {
                    var n = t[e];
                    return n.slotTargetDynamic || n.if || n.for || Ds(n);
                  }),
                i = !!e.if;
              if (!r)
                for (var o = e.parent; o; ) {
                  if ((o.slotScope && o.slotScope !== Ka) || o.for) {
                    r = !0;
                    break;
                  }
                  o.if && (i = !0), (o = o.parent);
                }
              var a = Object.keys(t)
                .map(function (e) {
                  return Ls(t[e], n);
                })
                .join(",");
              return (
                "scopedSlots:_u([" +
                a +
                "]" +
                (r ? ",null,true" : "") +
                (!r && i
                  ? ",null,false," +
                    (function (e) {
                      var t = 5381,
                        n = e.length;
                      for (; n; ) t = (33 * t) ^ e.charCodeAt(--n);
                      return t >>> 0;
                    })(a)
                  : "") +
                ")"
              );
            })(e, e.scopedSlots, t) + ","),
        e.model &&
          (n +=
            "model:{value:" +
            e.model.value +
            ",callback:" +
            e.model.callback +
            ",expression:" +
            e.model.expression +
            "},"),
        e.inlineTemplate)
      ) {
        var o = (function (e, t) {
          var n = e.children[0];
          (1 === e.children.length && 1 === n.type) ||
            t.warn(
              "Inline-template components must have exactly one child element.",
              {
                start: e.start,
              }
            );
          if (n && 1 === n.type) {
            var r = Ss(n, t.options);
            return (
              "inlineTemplate:{render:function(){" +
              r.render +
              "},staticRenderFns:[" +
              r.staticRenderFns
                .map(function (e) {
                  return "function(){" + e + "}";
                })
                .join(",") +
              "]}"
            );
          }
        })(e, t);
        o && (n += o + ",");
      }
      return (
        (n = n.replace(/,$/, "") + "}"),
        e.dynamicAttrs &&
          (n = "_b(" + n + ',"' + e.tag + '",' + Us(e.dynamicAttrs) + ")"),
        e.wrapData && (n = e.wrapData(n)),
        e.wrapListeners && (n = e.wrapListeners(n)),
        n
      );
    }

    function Ds(e) {
      return 1 === e.type && ("slot" === e.tag || e.children.some(Ds));
    }

    function Ls(e, t) {
      var n = e.attrsMap["slot-scope"];
      if (e.if && !e.ifProcessed && !n) return js(e, t, Ls, "null");
      if (e.for && !e.forProcessed) return Ns(e, t, Ls);
      var r = e.slotScope === Ka ? "" : String(e.slotScope),
        i =
          "function(" +
          r +
          "){return " +
          ("template" === e.tag
            ? e.if && n
              ? "(" + e.if + ")?" + (Fs(e, t) || "undefined") + ":undefined"
              : Fs(e, t) || "undefined"
            : Os(e, t)) +
          "}",
        o = r ? "" : ",proxy:true";
      return "{key:" + (e.slotTarget || '"default"') + ",fn:" + i + o + "}";
    }

    function Fs(e, t, n, r, i) {
      var o = e.children;
      if (o.length) {
        var a = o[0];
        if (
          1 === o.length &&
          a.for &&
          "template" !== a.tag &&
          "slot" !== a.tag
        ) {
          var s = n ? (t.maybeComponent(a) ? ",1" : ",0") : "";
          return "" + (r || Os)(a, t) + s;
        }
        var c = n
            ? (function (e, t) {
                for (var n = 0, r = 0; r < e.length; r++) {
                  var i = e[r];
                  if (1 === i.type) {
                    if (
                      Ps(i) ||
                      (i.ifConditions &&
                        i.ifConditions.some(function (e) {
                          return Ps(e.block);
                        }))
                    ) {
                      n = 2;
                      break;
                    }
                    (t(i) ||
                      (i.ifConditions &&
                        i.ifConditions.some(function (e) {
                          return t(e.block);
                        }))) &&
                      (n = 1);
                  }
                }
                return n;
              })(o, t.maybeComponent)
            : 0,
          u = i || Rs;
        return (
          "[" +
          o
            .map(function (e) {
              return u(e, t);
            })
            .join(",") +
          "]" +
          (c ? "," + c : "")
        );
      }
    }

    function Ps(e) {
      return void 0 !== e.for || "template" === e.tag || "slot" === e.tag;
    }

    function Rs(e, t) {
      return 1 === e.type
        ? Os(e, t)
        : 3 === e.type && e.isComment
        ? (function (e) {
            return "_e(" + JSON.stringify(e.text) + ")";
          })(e)
        : (function (e) {
            return (
              "_v(" +
              (2 === e.type ? e.expression : Hs(JSON.stringify(e.text))) +
              ")"
            );
          })(e);
    }

    function Us(e) {
      for (var t = "", n = "", r = 0; r < e.length; r++) {
        var i = e[r],
          o = Hs(i.value);
        i.dynamic
          ? (n += i.name + "," + o + ",")
          : (t += '"' + i.name + '":' + o + ",");
      }
      return (
        (t = "{" + t.slice(0, -1) + "}"),
        n ? "_d(" + t + ",[" + n.slice(0, -1) + "])" : t
      );
    }

    function Hs(e) {
      return e.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    var Bs = new RegExp(
        "\\b" +
          "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments"
            .split(",")
            .join("\\b|\\b") +
          "\\b"
      ),
      Vs = new RegExp(
        "\\b" +
          "delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b") +
          "\\s*\\([^\\)]*\\)"
      ),
      zs =
        /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

    function Js(e, t) {
      e && qs(e, t);
    }

    function qs(e, t) {
      if (1 === e.type) {
        for (var n in e.attrsMap)
          if (Ea.test(n)) {
            var r = e.attrsMap[n];
            if (r) {
              var i = e.rawAttrsMap[n];
              "v-for" === n
                ? Ws(e, 'v-for="' + r + '"', t, i)
                : "v-slot" === n || "#" === n[0]
                ? Xs(r, n + '="' + r + '"', t, i)
                : Na.test(n)
                ? Ks(r, n + '="' + r + '"', t, i)
                : Gs(r, n + '="' + r + '"', t, i);
            }
          }
        if (e.children)
          for (var o = 0; o < e.children.length; o++) qs(e.children[o], t);
      } else 2 === e.type && Gs(e.expression, e.text, t, e);
    }

    function Ks(e, t, n, r) {
      var i = e.replace(zs, ""),
        o = i.match(Vs);
      o &&
        "$" !== i.charAt(o.index - 1) &&
        n(
          'avoid using JavaScript unary operator as property name: "' +
            o[0] +
            '" in expression ' +
            t.trim(),
          r
        ),
        Gs(e, t, n, r);
    }

    function Ws(e, t, n, r) {
      Gs(e.for || "", t, n, r),
        Zs(e.alias, "v-for alias", t, n, r),
        Zs(e.iterator1, "v-for iterator", t, n, r),
        Zs(e.iterator2, "v-for iterator", t, n, r);
    }

    function Zs(e, t, n, r, i) {
      if ("string" == typeof e)
        try {
          new Function("var " + e + "=_");
        } catch (o) {
          r("invalid " + t + ' "' + e + '" in expression: ' + n.trim(), i);
        }
    }

    function Gs(e, t, n, r) {
      try {
        new Function("return " + e);
      } catch (o) {
        var i = e.replace(zs, "").match(Bs);
        n(
          i
            ? 'avoid using JavaScript keyword as property name: "' +
                i[0] +
                '"\n  Raw expression: ' +
                t.trim()
            : "invalid expression: " +
                o.message +
                " in\n\n    " +
                e +
                "\n\n  Raw expression: " +
                t.trim() +
                "\n",
          r
        );
      }
    }

    function Xs(e, t, n, r) {
      try {
        new Function(e, "");
      } catch (i) {
        n(
          "invalid function parameter expression: " +
            i.message +
            " in\n\n    " +
            e +
            "\n\n  Raw expression: " +
            t.trim() +
            "\n",
          r
        );
      }
    }

    function Ys(e, t) {
      var n = "";
      if (t > 0) for (; 1 & t && (n += e), !((t >>>= 1) <= 0); ) e += e;
      return n;
    }

    function Qs(e, t) {
      try {
        return new Function(e);
      } catch (n) {
        return (
          t.push({
            err: n,
            code: e,
          }),
          M
        );
      }
    }

    function ec(e) {
      var t = Object.create(null);
      return function (n, r, i) {
        var o = (r = O({}, r)).warn || ue;
        delete r.warn;
        try {
          new Function("return 1");
        } catch (e) {
          e.toString().match(/unsafe-eval|CSP/) &&
            o(
              "It seems you are using the standalone build of Vue.js in an environment with Content Security Policy that prohibits unsafe-eval. The template compiler cannot work in this environment. Consider relaxing the policy to allow unsafe-eval or pre-compiling your templates into render functions."
            );
        }
        var a = r.delimiters ? String(r.delimiters) + n : n;
        if (t[a]) return t[a];
        var s = e(n, r);
        s.errors &&
          s.errors.length &&
          (r.outputSourceRange
            ? s.errors.forEach(function (e) {
                o(
                  "Error compiling template:\n\n" +
                    e.msg +
                    "\n\n" +
                    (function (e, t, n) {
                      void 0 === t && (t = 0), void 0 === n && (n = e.length);
                      for (
                        var r = e.split(/\r?\n/), i = 0, o = [], a = 0;
                        a < r.length;
                        a++
                      )
                        if ((i += r[a].length + 1) >= t) {
                          for (var s = a - 2; s <= a + 2 || n > i; s++)
                            if (!(s < 0 || s >= r.length)) {
                              o.push(
                                "" +
                                  (s + 1) +
                                  Ys(" ", 3 - String(s + 1).length) +
                                  "|  " +
                                  r[s]
                              );
                              var c = r[s].length;
                              if (s === a) {
                                var u = t - (i - c) + 1,
                                  l = n > i ? c - u : n - t;
                                o.push("   |  " + Ys(" ", u) + Ys("^", l));
                              } else if (s > a) {
                                if (n > i) {
                                  var f = Math.min(n - i, c);
                                  o.push("   |  " + Ys("^", f));
                                }
                                i += c + 1;
                              }
                            }
                          break;
                        }
                      return o.join("\n");
                    })(n, e.start, e.end),
                  i
                );
              })
            : o(
                "Error compiling template:\n\n" +
                  n +
                  "\n\n" +
                  s.errors
                    .map(function (e) {
                      return "- " + e;
                    })
                    .join("\n") +
                  "\n",
                i
              )),
          s.tips &&
            s.tips.length &&
            (r.outputSourceRange
              ? s.tips.forEach(function (e) {
                  return le(e.msg);
                })
              : s.tips.forEach(function (e) {
                  return le();
                }));
        var c = {},
          u = [];
        return (
          (c.render = Qs(s.render, u)),
          (c.staticRenderFns = s.staticRenderFns.map(function (e) {
            return Qs(e, u);
          })),
          (s.errors && s.errors.length) ||
            !u.length ||
            o(
              "Failed to generate render function:\n\n" +
                u
                  .map(function (e) {
                    var t = e.err,
                      n = e.code;
                    return t.toString() + " in\n\n" + n + "\n";
                  })
                  .join("\n"),
              i
            ),
          (t[a] = c)
        );
      };
    }
    var tc,
      nc,
      rc =
        ((tc = function (e, t) {
          var n = Za(e.trim(), t);
          !1 !== t.optimize && ps(n, t);
          var r = Ss(n, t);
          return {
            ast: n,
            render: r.render,
            staticRenderFns: r.staticRenderFns,
          };
        }),
        function (e) {
          function t(t, n) {
            var r = Object.create(e),
              i = [],
              o = [],
              a = function (e, t, n) {
                (n ? o : i).push(e);
              };
            if (n) {
              if (n.outputSourceRange) {
                var s = t.match(/^\s*/)[0].length;
                a = function (e, t, n) {
                  var r = {
                    msg: e,
                  };
                  t &&
                    (null != t.start && (r.start = t.start + s),
                    null != t.end && (r.end = t.end + s)),
                    (n ? o : i).push(r);
                };
              }
              for (var c in (n.modules &&
                (r.modules = (e.modules || []).concat(n.modules)),
              n.directives &&
                (r.directives = O(
                  Object.create(e.directives || null),
                  n.directives
                )),
              n))
                "modules" !== c && "directives" !== c && (r[c] = n[c]);
            }
            r.warn = a;
            var u = tc(t.trim(), r);
            return Js(u.ast, a), (u.errors = i), (u.tips = o), u;
          }
          return {
            compile: t,
            compileToFunctions: ec(t),
          };
        }),
      ic = rc(ls),
      oc = (ic.compile, ic.compileToFunctions);

    function ac(e) {
      return (
        ((nc = nc || document.createElement("div")).innerHTML = e
          ? '<a href="\n"/>'
          : '<div a="\n"/>'),
        nc.innerHTML.indexOf("&#10;") > 0
      );
    }
    var sc = !!q && ac(!1),
      cc = !!q && ac(!0),
      uc = _(function (e) {
        var t = Mr(e);
        return t && t.innerHTML;
      }),
      lc = er.prototype.$mount;
    return (
      (er.prototype.$mount = function (e, t) {
        if (
          (e = e && Mr(e)) === document.body ||
          e === document.documentElement
        )
          return (
            ue(
              "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            ),
            this
          );
        var n = this.$options;
        if (!n.render) {
          var r = n.template;
          if (r)
            if ("string" == typeof r)
              "#" === r.charAt(0) &&
                ((r = uc(r)) ||
                  ue(
                    "Template element not found or is empty: " + n.template,
                    this
                  ));
            else {
              if (!r.nodeType)
                return ue("invalid template option:" + r, this), this;
              r = r.innerHTML;
            }
          else
            e &&
              (r = (function (e) {
                if (e.outerHTML) return e.outerHTML;
                var t = document.createElement("div");
                return t.appendChild(e.cloneNode(!0)), t.innerHTML;
              })(e));
          if (r) {
            R.performance && st && st("compile");
            var i = oc(
                r,
                {
                  outputSourceRange: !0,
                  shouldDecodeNewlines: sc,
                  shouldDecodeNewlinesForHref: cc,
                  delimiters: n.delimiters,
                  comments: n.comments,
                },
                this
              ),
              o = i.render,
              a = i.staticRenderFns;
            (n.render = o),
              (n.staticRenderFns = a),
              R.performance &&
                st &&
                (st("compile end"),
                ct("vue " + this._name + " compile", "compile", "compile end"));
          }
        }
        return lc.call(this, e, t);
      }),
      (er.compile = oc),
      er
    );
  });
}
//#endregion

//checkValidInstallation
if (options.indexOf("cvi") >= 0) console.log("Mystils successfully loaded");

/*********************************
       :\     /;               _
      ;  \___/  ;             ; ;
     ,:-"'   `"-:.            / ;
    /,---.   ,---.\         _; /
   ((  |  ) (  |  ))    ,-""_,"
    \`````   `````/""""",-""
     '-.._ v _..-'      )
       / ___   ____,..  \
      / /   | |   | ( \. \
     / /    | |    | |  \ \
     `"     `"     `"    `"
*********************************/
