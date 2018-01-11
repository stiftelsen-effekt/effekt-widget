(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*! decimal.js v7.3.0 https://github.com/MikeMcl/decimal.js/LICENCE */
;(function (globalScope) {
  'use strict';


  /*
   *  decimal.js v7.3.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2017 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   */


  // -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


    // The maximum exponent magnitude.
    // The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
  var EXP_LIMIT = 9e15,                      // 0 to 9e15

    // The limit on the value of `precision`, and on the value of the first argument to
    // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
    MAX_DIGITS = 1e9,                        // 0 to 1e9

    // Base conversion alphabet.
    NUMERALS = '0123456789abcdef',

    // The natural logarithm of 10 (1025 digits).
    LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',

    // Pi (1025 digits).
    PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',


    // The initial configuration properties of the Decimal constructor.
    Decimal = {

      // These values must be integers within the stated ranges (inclusive).
      // Most of these values can be changed at run-time using the `Decimal.config` method.

      // The maximum number of significant digits of the result of a calculation or base conversion.
      // E.g. `Decimal.config({ precision: 20 });`
      precision: 20,                         // 1 to MAX_DIGITS

      // The rounding mode used when rounding to `precision`.
      //
      // ROUND_UP         0 Away from zero.
      // ROUND_DOWN       1 Towards zero.
      // ROUND_CEIL       2 Towards +Infinity.
      // ROUND_FLOOR      3 Towards -Infinity.
      // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      //
      // E.g.
      // `Decimal.rounding = 4;`
      // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
      rounding: 4,                           // 0 to 8

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP         0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
      // FLOOR      3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN  6 The IEEE 754 remainder function.
      // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
      //
      // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
      // division (9) are commonly used for the modulus operation. The other rounding modes can also
      // be used, but they may not give useful results.
      modulo: 1,                             // 0 to 9

      // The exponent value at and beneath which `toString` returns exponential notation.
      // JavaScript numbers: -7
      toExpNeg: -7,                          // 0 to -EXP_LIMIT

      // The exponent value at and above which `toString` returns exponential notation.
      // JavaScript numbers: 21
      toExpPos:  21,                         // 0 to EXP_LIMIT

      // The minimum exponent value, beneath which underflow to zero occurs.
      // JavaScript numbers: -324  (5e-324)
      minE: -EXP_LIMIT,                      // -1 to -EXP_LIMIT

      // The maximum exponent value, above which overflow to Infinity occurs.
      // JavaScript numbers: 308  (1.7976931348623157e+308)
      maxE: EXP_LIMIT,                       // 1 to EXP_LIMIT

      // Whether to use cryptographically-secure random number generation, if available.
      crypto: false                          // true/false
    },


  // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


    inexact, noConflict, quadrant,
    external = true,

    decimalError = '[DecimalError] ',
    invalidArgument = decimalError + 'Invalid argument: ',
    precisionLimitExceeded = decimalError + 'Precision limit exceeded',
    cryptoUnavailable = decimalError + 'crypto unavailable',

    mathfloor = Math.floor,
    mathpow = Math.pow,

    isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

    BASE = 1e7,
    LOG_BASE = 7,
    MAX_SAFE_INTEGER = 9007199254740991,

    LN10_PRECISION = LN10.length - 1,
    PI_PRECISION = PI.length - 1,

    // Decimal.prototype object
    P = {};


  // Decimal prototype methods


  /*
   *  absoluteValue             abs
   *  ceil
   *  comparedTo                cmp
   *  cosine                    cos
   *  cubeRoot                  cbrt
   *  decimalPlaces             dp
   *  dividedBy                 div
   *  dividedToIntegerBy        divToInt
   *  equals                    eq
   *  floor
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyperbolicCosine          cosh
   *  hyperbolicSine            sinh
   *  hyperbolicTangent         tanh
   *  inverseCosine             acos
   *  inverseHyperbolicCosine   acosh
   *  inverseHyperbolicSine     asinh
   *  inverseHyperbolicTangent  atanh
   *  inverseSine               asin
   *  inverseTangent            atan
   *  isFinite
   *  isInteger                 isInt
   *  isNaN
   *  isNegative                isNeg
   *  isPositive                isPos
   *  isZero
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 log
   *  [maximum]                 [max]
   *  [minimum]                 [min]
   *  minus                     sub
   *  modulo                    mod
   *  naturalExponential        exp
   *  naturalLogarithm          ln
   *  negated                   neg
   *  plus                      add
   *  precision                 sd
   *  round
   *  sine                      sin
   *  squareRoot                sqrt
   *  tangent                   tan
   *  times                     mul
   *  toBinary
   *  toDecimalPlaces           toDP
   *  toExponential
   *  toFixed
   *  toFraction
   *  toHexadecimal             toHex
   *  toNearest
   *  toNumber
   *  toOctal
   *  toPower                   pow
   *  toPrecision
   *  toSignificantDigits       toSD
   *  toString
   *  truncated                 trunc
   *  valueOf                   toJSON
   */


  /*
   * Return a new Decimal whose value is the absolute value of this Decimal.
   *
   */
  P.absoluteValue = P.abs = function () {
    var x = new this.constructor(this);
    if (x.s < 0) x.s = 1;
    return finalise(x);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of positive Infinity.
   *
   */
  P.ceil = function () {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };


  /*
   * Return
   *   1    if the value of this Decimal is greater than the value of `y`,
   *  -1    if the value of this Decimal is less than the value of `y`,
   *   0    if they have the same value,
   *   NaN  if the value of either Decimal is NaN.
   *
   */
  P.comparedTo = P.cmp = function (y) {
    var i, j, xdL, ydL,
      x = this,
      xd = x.d,
      yd = (y = new x.constructor(y)).d,
      xs = x.s,
      ys = y.s;

    // Either NaN or ±Infinity?
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }

    // Either zero?
    if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;

    // Signs differ?
    if (xs !== ys) return xs;

    // Compare exponents.
    if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;

    xdL = xd.length;
    ydL = yd.length;

    // Compare digit by digit.
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }

    // Compare lengths.
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };


  /*
   * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * cos(0)         = 1
   * cos(-0)        = 1
   * cos(Infinity)  = NaN
   * cos(-Infinity) = NaN
   * cos(NaN)       = NaN
   *
   */
  P.cosine = P.cos = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.d) return new Ctor(NaN);

    // cos(0) = cos(-0) = 1
    if (!x.d[0]) return new Ctor(1);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
  };


  /*
   *
   * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   *  cbrt(0)  =  0
   *  cbrt(-0) = -0
   *  cbrt(1)  =  1
   *  cbrt(-1) = -1
   *  cbrt(N)  =  N
   *  cbrt(-I) = -I
   *  cbrt(I)  =  I
   *
   * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
   *
   */
  P.cubeRoot = P.cbrt = function () {
    var e, m, n, r, rep, s, sd, t, t3, t3plusx,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    external = false;

    // Initial estimate.
    s = x.s * Math.pow(x.s * x, 1 / 3);

     // Math.cbrt underflow/overflow?
     // Pass x to Math.pow as integer, then adjust the exponent of the result.
    if (!s || Math.abs(s) == 1 / 0) {
      n = digitsToString(x.d);
      e = x.e;

      // Adjust n exponent so it is a multiple of 3 away from x exponent.
      if (s = (e - n.length + 1) % 3) n += (s == 1 || s == -2 ? '0' : '00');
      s = Math.pow(n, 1 / 3);

      // Rarely, e may be one less than the result exponent value.
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Halley's method.
    // TODO? Compare Newton's method.
    for (;;) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
        // , i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return the number of decimal places of the value of this Decimal.
   *
   */
  P.decimalPlaces = P.dp = function () {
    var w,
      d = this.d,
      n = NaN;

    if (d) {
      w = d.length - 1;
      n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last word.
      w = d[w];
      if (w) for (; w % 10 == 0; w /= 10) n--;
      if (n < 0) n = 0;
    }

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedBy = P.div = function (y) {
    return divide(this, new this.constructor(y));
  };


  /*
   * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
   * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedToIntegerBy = P.divToInt = function (y) {
    var x = this,
      Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };


  /*
   * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
   *
   */
  P.equals = P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of negative Infinity.
   *
   */
  P.floor = function () {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };


  /*
   * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
   * false.
   *
   */
  P.greaterThan = P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Decimal is greater than or equal to the value of `y`,
   * otherwise return false.
   *
   */
  P.greaterThanOrEqualTo = P.gte = function (y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
  };


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [1, Infinity]
   *
   * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
   *
   * cosh(0)         = 1
   * cosh(-0)        = 1
   * cosh(Infinity)  = Infinity
   * cosh(-Infinity) = Infinity
   * cosh(NaN)       = NaN
   *
   *  x        time taken (ms)   result
   * 1000      9                 9.8503555700852349694e+433
   * 10000     25                4.4034091128314607936e+4342
   * 100000    171               1.4033316802130615897e+43429
   * 1000000   3817              1.5166076984010437725e+434294
   * 10000000  abandoned after 2 minute wait
   *
   * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
   *
   */
  P.hyperbolicCosine = P.cosh = function () {
    var k, n, pr, rm, len,
      x = this,
      Ctor = x.constructor,
      one = new Ctor(1);

    if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero()) return one;

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
    // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))

    // Estimate the optimum number of times to use the argument reduction.
    // TODO? Estimation reused from cosine() and may not be optimal here.
    if (len < 32) {
      k = Math.ceil(len / 3);
      n = Math.pow(4, -k).toString();
    } else {
      k = 16;
      n = '2.3283064365386962890625e-10';
    }

    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);

    // Reverse argument reduction
    var cosh2_x,
      i = k,
      d8 = new Ctor(8);
    for (; i--;) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }

    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
   *
   * sinh(0)         = 0
   * sinh(-0)        = -0
   * sinh(Infinity)  = Infinity
   * sinh(-Infinity) = -Infinity
   * sinh(NaN)       = NaN
   *
   * x        time taken (ms)
   * 10       2 ms
   * 100      5 ms
   * 1000     14 ms
   * 10000    82 ms
   * 100000   886 ms            1.4033316802130615897e+43429
   * 200000   2613 ms
   * 300000   5407 ms
   * 400000   8824 ms
   * 500000   13026 ms          8.7080643612718084129e+217146
   * 1000000  48543 ms
   *
   * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
   *
   */
  P.hyperbolicSine = P.sinh = function () {
    var k, pr, rm, len,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {

      // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
      // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
      // 3 multiplications and 1 addition

      // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
      // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
      // 4 multiplications and 2 additions

      // Estimate the optimum number of times to use the argument reduction.
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;

      x = x.times(Math.pow(5, -k));

      x = taylorSeries(Ctor, 2, x, x, true);

      // Reverse argument reduction
      var sinh2_x,
        d5 = new Ctor(5),
        d16 = new Ctor(16),
        d20 = new Ctor(20);
      for (; k--;) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * tanh(x) = sinh(x) / cosh(x)
   *
   * tanh(0)         = 0
   * tanh(-0)        = -0
   * tanh(Infinity)  = 1
   * tanh(-Infinity) = -1
   * tanh(NaN)       = NaN
   *
   */
  P.hyperbolicTangent = P.tanh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(x.s);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;

    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };


  /*
   * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
   * this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [0, pi]
   *
   * acos(x) = pi/2 - asin(x)
   *
   * acos(0)       = pi/2
   * acos(-0)      = pi/2
   * acos(1)       = 0
   * acos(-1)      = pi
   * acos(1/2)     = pi/3
   * acos(-1/2)    = 2*pi/3
   * acos(|x| > 1) = NaN
   * acos(NaN)     = NaN
   *
   */
  P.inverseCosine = P.acos = function () {
    var halfPi,
      x = this,
      Ctor = x.constructor,
      k = x.abs().cmp(1),
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (k !== -1) {
      return k === 0
        // |x| is 1
        ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0)
        // |x| > 1 or x is NaN
        : new Ctor(NaN);
    }

    if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);

    // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return halfPi.minus(x);
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
   * value of this Decimal.
   *
   * Domain: [1, Infinity]
   * Range: [0, Infinity]
   *
   * acosh(x) = ln(x + sqrt(x^2 - 1))
   *
   * acosh(x < 1)     = NaN
   * acosh(NaN)       = NaN
   * acosh(Infinity)  = Infinity
   * acosh(-Infinity) = NaN
   * acosh(0)         = NaN
   * acosh(-0)        = NaN
   * acosh(1)         = 0
   * acosh(-1)        = NaN
   *
   */
  P.inverseHyperbolicCosine = P.acosh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).minus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * asinh(x) = ln(x + sqrt(x^2 + 1))
   *
   * asinh(NaN)       = NaN
   * asinh(Infinity)  = Infinity
   * asinh(-Infinity) = -Infinity
   * asinh(0)         = 0
   * asinh(-0)        = -0
   *
   */
  P.inverseHyperbolicSine = P.asinh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).plus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
   * value of this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [-Infinity, Infinity]
   *
   * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
   *
   * atanh(|x| > 1)   = NaN
   * atanh(NaN)       = NaN
   * atanh(Infinity)  = NaN
   * atanh(-Infinity) = NaN
   * atanh(0)         = 0
   * atanh(-0)        = -0
   * atanh(1)         = Infinity
   * atanh(-1)        = -Infinity
   *
   */
  P.inverseHyperbolicTangent = P.atanh = function () {
    var pr, rm, wpr, xsd,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();

    if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);

    Ctor.precision = wpr = xsd - x.e;

    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);

    Ctor.precision = pr + 4;
    Ctor.rounding = 1;

    x = x.ln();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(0.5);
  };


  /*
   * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
   *
   * asin(0)       = 0
   * asin(-0)      = -0
   * asin(1/2)     = pi/6
   * asin(-1/2)    = -pi/6
   * asin(1)       = pi/2
   * asin(-1)      = -pi/2
   * asin(|x| > 1) = NaN
   * asin(NaN)     = NaN
   *
   * TODO? Compare performance of Taylor series.
   *
   */
  P.inverseSine = P.asin = function () {
    var halfPi, k,
      pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.isZero()) return new Ctor(x);

    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (k !== -1) {

      // |x| is 1
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x.s;
        return halfPi;
      }

      // |x| > 1 or x is NaN
      return new Ctor(NaN);
    }

    // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(2);
  };


  /*
   * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
   *
   * atan(0)         = 0
   * atan(-0)        = -0
   * atan(1)         = pi/4
   * atan(-1)        = -pi/4
   * atan(Infinity)  = pi/2
   * atan(-Infinity) = -pi/2
   * atan(NaN)       = NaN
   *
   */
  P.inverseTangent = P.atan = function () {
    var i, j, k, n, px, t, r, wpr, x2,
      x = this,
      Ctor = x.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (!x.isFinite()) {
      if (!x.s) return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x.s;
      return r;
    }

    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;

    // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);

    // Argument reduction
    // Ensure |x| < 0.42
    // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

    k = Math.min(28, wpr / LOG_BASE + 2 | 0);

    for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

    external = false;

    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;

    // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
    for (; i !== -1;) {
      px = px.times(x2);
      t = r.minus(px.div(n += 2));

      px = px.times(x2);
      r = t.plus(px.div(n += 2));

      if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
    }

    if (k) r = r.times(2 << (k - 1));

    external = true;

    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return true if the value of this Decimal is a finite number, otherwise return false.
   *
   */
  P.isFinite = function () {
    return !!this.d;
  };


  /*
   * Return true if the value of this Decimal is an integer, otherwise return false.
   *
   */
  P.isInteger = P.isInt = function () {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };


  /*
   * Return true if the value of this Decimal is NaN, otherwise return false.
   *
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this Decimal is negative, otherwise return false.
   *
   */
  P.isNegative = P.isNeg = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this Decimal is positive, otherwise return false.
   *
   */
  P.isPositive = P.isPos = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this Decimal is 0 or -0, otherwise return false.
   *
   */
  P.isZero = function () {
    return !!this.d && this.d[0] === 0;
  };


  /*
   * Return true if the value of this Decimal is less than `y`, otherwise return false.
   *
   */
  P.lessThan = P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
   *
   */
  P.lessThanOrEqualTo = P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * If no base is specified, return log[10](arg).
   *
   * log[base](arg) = ln(arg) / ln(base)
   *
   * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
   * otherwise:
   *
   * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
   * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
   * between the result and the correctly rounded result will be one ulp (unit in the last place).
   *
   * log[-b](a)       = NaN
   * log[0](a)        = NaN
   * log[1](a)        = NaN
   * log[NaN](a)      = NaN
   * log[Infinity](a) = NaN
   * log[b](0)        = -Infinity
   * log[b](-0)       = -Infinity
   * log[b](-a)       = NaN
   * log[b](1)        = 0
   * log[b](Infinity) = Infinity
   * log[b](NaN)      = NaN
   *
   * [base] {number|string|Decimal} The base of the logarithm.
   *
   */
  P.logarithm = P.log = function (base) {
    var isBase10, d, denominator, k, inf, num, sd, r,
      arg = this,
      Ctor = arg.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding,
      guard = 5;

    // Default base is 10.
    if (base == null) {
      base = new Ctor(10);
      isBase10 = true;
    } else {
      base = new Ctor(base);
      d = base.d;

      // Return NaN if base is negative, or non-finite, or is 0 or 1.
      if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);

      isBase10 = base.eq(10);
    }

    d = arg.d;

    // Is arg negative, non-finite, 0 or 1?
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }

    // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
    // integer power of 10.
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0;) k /= 10;
        inf = k !== 1;
      }
    }

    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);

    // The result will have 5 rounding digits.
    r = divide(num, denominator, sd, 1);

    // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
    // calculate 10 further digits.
    //
    // If the result is known to have an infinite decimal expansion, repeat this until it is clear
    // that the result is above or below the boundary. Otherwise, if after calculating the 10
    // further digits, the last 14 are nines, round up and assume the result is exact.
    // Also assume the result is exact if the last 14 are zero.
    //
    // Example of a result that will be incorrectly rounded:
    // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
    // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
    // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
    // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
    // place is still 2.6.
    if (checkRoundingDigits(r.d, k = pr, rm)) {

      do {
        sd += 10;
        num = naturalLogarithm(arg, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
        r = divide(num, denominator, sd, 1);

        if (!inf) {

          // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
          if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
            r = finalise(r, pr + 1, 0);
          }

          break;
        }
      } while (checkRoundingDigits(r.d, k += 10, rm));
    }

    external = true;

    return finalise(r, pr, rm);
  };


  /*
   * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.max = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'lt');
  };
   */


  /*
   * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.min = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'gt');
  };
   */


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.minus = P.sub = function (y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return y negated if x is finite and y is ±Infinity.
      else if (x.d) y.s = -y.s;

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with different signs.
      // Return NaN if both are ±Infinity with the same sign.
      else y = new Ctor(y.d || x.s !== y.s ? x : NaN);

      return y;
    }

    // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.plus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return y negated if x is zero and y is non-zero.
      if (yd[0]) y.s = -y.s;

      // Return x if y is zero and x is non-zero.
      else if (xd[0]) y = new Ctor(x);

      // Return zero if both are zero.
      // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
      else return new Ctor(rm === 3 ? -0 : 0);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);

    xd = xd.slice();
    k = xe - e;

    // If base 1e7 exponents differ...
    if (k) {
      xLTy = k < 0;

      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e = xe;
        len = xd.length;
      }

      // Numbers with massively different exponents would result in a very high number of
      // zeros needing to be prepended, but this can be avoided while still ensuring correct
      // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

      if (k > i) {
        k = i;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents.
      d.reverse();
      for (i = k; i--;) d.push(0);
      d.reverse();

    // Base 1e7 exponents equal.
    } else {

      // Check digits to determine which is the bigger number.

      i = xd.length;
      len = yd.length;
      xLTy = i < len;
      if (xLTy) len = i;

      for (i = 0; i < len; i++) {
        if (xd[i] != yd[i]) {
          xLTy = xd[i] < yd[i];
          break;
        }
      }

      k = 0;
    }

    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y.s = -y.s;
    }

    len = xd.length;

    // Append zeros to `xd` if shorter.
    // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.
    for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

    // Subtract yd from xd.
    for (i = yd.length; i > k;) {

      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
        --xd[j];
        xd[i] += BASE;
      }

      xd[i] -= yd[i];
    }

    // Remove trailing zeros.
    for (; xd[--len] === 0;) xd.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xd[0] === 0; xd.shift()) --e;

    // Zero?
    if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * The result depends on the modulo mode.
   *
   */
  P.modulo = P.mod = function (y) {
    var q,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // Return NaN if x is ±Infinity or NaN, or y is NaN or ±0.
    if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);

    // Return x if y is ±Infinity or x is ±0.
    if (!y.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }

    // Prevent rounding of intermediate calculations.
    external = false;

    if (Ctor.modulo == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // result = x - q * y    where  0 <= result < abs(y)
      q = divide(x, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x, y, 0, Ctor.modulo, 1);
    }

    q = q.times(y);

    external = true;

    return x.minus(q);
  };


  /*
   * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
   * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.naturalExponential = P.exp = function () {
    return naturalExponential(this);
  };


  /*
   * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.naturalLogarithm = P.ln = function () {
    return naturalLogarithm(this);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
   * -1.
   *
   */
  P.negated = P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.plus = P.add = function (y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with the same sign.
      // Return NaN if both are ±Infinity with different signs.
      // Return y if x is finite and y is ±Infinity.
      else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);

      return y;
    }

     // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return x if y is zero.
      // Return y if y is non-zero.
      if (!yd[0]) y = new Ctor(x);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    k = mathfloor(x.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);

    xd = xd.slice();
    i = k - e;

    // If base 1e7 exponents differ...
    if (i) {

      if (i < 0) {
        d = xd;
        i = -i;
        len = yd.length;
      } else {
        d = yd;
        e = k;
        len = xd.length;
      }

      // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;

      if (i > len) {
        i = len;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
      d.reverse();
      for (; i--;) d.push(0);
      d.reverse();
    }

    len = xd.length;
    i = yd.length;

    // If yd is longer than xd, swap xd and yd so xd points to the longer array.
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }

    // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
    for (carry = 0; i;) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }

    if (carry) {
      xd.unshift(carry);
      ++e;
    }

    // Remove trailing zeros.
    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    for (len = xd.length; xd[--len] == 0;) xd.pop();

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   * Return the number of significant digits of the value of this Decimal.
   *
   * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
   *
   */
  P.precision = P.sd = function (z) {
    var k,
      x = this;

    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k) k = x.e + 1;
    } else {
      k = NaN;
    }

    return k;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
   * rounding mode `rounding`.
   *
   */
  P.round = function () {
    var x = this,
      Ctor = x.constructor;

    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };


  /*
   * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * sin(x) = x - x^3/3! + x^5/5! - ...
   *
   * sin(0)         = 0
   * sin(-0)        = -0
   * sin(Infinity)  = NaN
   * sin(-Infinity) = NaN
   * sin(NaN)       = NaN
   *
   */
  P.sine = P.sin = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = sine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   *  sqrt(-n) =  N
   *  sqrt(N)  =  N
   *  sqrt(-I) =  N
   *  sqrt(I)  =  I
   *  sqrt(0)  =  0
   *  sqrt(-0) = -0
   *
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, sd, r, rep, t,
      x = this,
      d = x.d,
      e = x.e,
      s = x.s,
      Ctor = x.constructor;

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }

    external = false;

    // Initial estimate.
    s = Math.sqrt(+x);

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(d);

      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(n);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '1e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Newton-Raphson iteration.
    for (;;) {
      t = r;
      r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
        // 4999, i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * tan(0)         = 0
   * tan(-0)        = -0
   * tan(Infinity)  = NaN
   * tan(-Infinity) = NaN
   * tan(NaN)       = NaN
   *
   */
  P.tangent = P.tan = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;

    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   */
  P.times = P.mul = function (y) {
    var carry, e, i, k, r, rL, t, xdL, ydL,
      x = this,
      Ctor = x.constructor,
      xd = x.d,
      yd = (y = new Ctor(y)).d;

    y.s *= x.s;

     // If either is NaN, ±Infinity or ±0...
    if (!xd || !xd[0] || !yd || !yd[0]) {

      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd

        // Return NaN if either is NaN.
        // Return NaN if x is ±0 and y is ±Infinity, or y is ±0 and x is ±Infinity.
        ? NaN

        // Return ±Infinity if either is ±Infinity.
        // Return ±0 if either is ±0.
        : !xd || !yd ? y.s / 0 : y.s * 0);
    }

    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;

    // Ensure xd points to the longer array.
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }

    // Initialise the result array with zeros.
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--;) r.push(0);

    // Multiply!
    for (i = ydL; --i >= 0;) {
      carry = 0;
      for (k = xdL + i; k > i;) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }

      r[k] = (r[k] + carry) % BASE | 0;
    }

    // Remove trailing zeros.
    for (; !r[--rL];) r.pop();

    if (carry) ++e;
    else r.shift();

    y.d = r;
    y.e = getBase10Exponent(r, e);

    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
  };


  /*
   * Return a string representing the value of this Decimal in base 2, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toBinary = function (sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
   * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
   *
   * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toDecimalPlaces = P.toDP = function (dp, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);
    if (dp === void 0) return x;

    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    return finalise(x, dp + x.e + 1, rm);
  };


  /*
   * Return a string representing the value of this Decimal in exponential notation rounded to
   * `dp` fixed decimal places using rounding mode `rounding`.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toExponential = function (dp, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a string representing the value of this Decimal in normal (fixed-point) notation to
   * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
   * omitted.
   *
   * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   * (-0).toFixed(3) is '0.000'.
   * (-0.5).toFixed(0) is '-0'.
   *
   */
  P.toFixed = function (dp, rm) {
    var str, y,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      y = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }

    // To determine whether to add the minus sign look at the value before it was rounded,
    // i.e. look at `x` rather than `y`.
    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return an array representing the value of this Decimal as a simple fraction with an integer
   * numerator and an integer denominator.
   *
   * The denominator will be a positive non-zero value less than or equal to the specified maximum
   * denominator. If a maximum denominator is not specified, the denominator will be the lowest
   * value necessary to represent the number exactly.
   *
   * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
   *
   */
  P.toFraction = function (maxD) {
    var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r,
      x = this,
      xd = x.d,
      Ctor = x.constructor;

    if (!xd) return new Ctor(x);

    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);

    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

    if (maxD == null) {

      // d is 10**e, the minimum max-denominator needed.
      maxD = e > 0 ? d : n1;
    } else {
      n = new Ctor(maxD);
      if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
      maxD = n.gt(d) ? (e > 0 ? d : n1) : n;
    }

    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;

    for (;;)  {
      q = divide(n, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1) break;
      d0 = d1;
      d1 = d2;
      d2 = n1;
      n1 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n.minus(q.times(d2));
      n = d2;
    }

    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;

    // Determine which fraction is closer to x, n0/d0 or n1/d1?
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1
        ? [n1, d1] : [n0, d0];

    Ctor.precision = pr;
    external = true;

    return r;
  };


  /*
   * Return a string representing the value of this Decimal in base 16, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toHexadecimal = P.toHex = function (sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };



  /*
   * Returns a new Decimal whose value is the nearest multiple of the magnitude of `y` to the value
   * of this Decimal.
   *
   * If the value of this Decimal is equidistant from two multiples of `y`, the rounding mode `rm`,
   * or `Decimal.rounding` if `rm` is omitted, determines the direction of the nearest multiple.
   *
   * In the context of this method, rounding mode 4 (ROUND_HALF_UP) is the same as rounding mode 0
   * (ROUND_UP), and so on.
   *
   * The return value will always have the same sign as this Decimal, unless either this Decimal
   * or `y` is NaN, in which case the return value will be also be NaN.
   *
   * The return value is not affected by the value of `precision`.
   *
   * y {number|string|Decimal} The magnitude to round to a multiple of.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toNearest() rounding mode not an integer: {rm}'
   * 'toNearest() rounding mode out of range: {rm}'
   *
   */
  P.toNearest = function (y, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);

    if (y == null) {

      // If x is not finite, return x.
      if (!x.d) return x;

      y = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y = new Ctor(y);
      if (rm !== void 0) checkInt32(rm, 0, 8);

      // If x is not finite, return x if y is not NaN, else NaN.
      if (!x.d) return y.s ? x : y;

      // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.
      if (!y.d) {
        if (y.s) y.s = x.s;
        return y;
      }
    }

    // If y is not zero, calculate the nearest multiple of y to x.
    if (y.d[0]) {
      external = false;
      if (rm < 4) rm = [4, 5, 7, 8][rm];
      x = divide(x, y, 0, rm, 1).times(y);
      external = true;
      finalise(x);

    // If y is zero, return zero with the sign of x.
    } else {
      y.s = x.s;
      x = y;
    }

    return x;
  };


  /*
   * Return the value of this Decimal converted to a number primitive.
   * Zero keeps its sign.
   *
   */
  P.toNumber = function () {
    return +this;
  };


  /*
   * Return a string representing the value of this Decimal in base 8, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toOctal = function (sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
   * to `precision` significant digits using rounding mode `rounding`.
   *
   * ECMAScript compliant.
   *
   *   pow(x, NaN)                           = NaN
   *   pow(x, ±0)                            = 1

   *   pow(NaN, non-zero)                    = NaN
   *   pow(abs(x) > 1, +Infinity)            = +Infinity
   *   pow(abs(x) > 1, -Infinity)            = +0
   *   pow(abs(x) == 1, ±Infinity)           = NaN
   *   pow(abs(x) < 1, +Infinity)            = +0
   *   pow(abs(x) < 1, -Infinity)            = +Infinity
   *   pow(+Infinity, y > 0)                 = +Infinity
   *   pow(+Infinity, y < 0)                 = +0
   *   pow(-Infinity, odd integer > 0)       = -Infinity
   *   pow(-Infinity, even integer > 0)      = +Infinity
   *   pow(-Infinity, odd integer < 0)       = -0
   *   pow(-Infinity, even integer < 0)      = +0
   *   pow(+0, y > 0)                        = +0
   *   pow(+0, y < 0)                        = +Infinity
   *   pow(-0, odd integer > 0)              = -0
   *   pow(-0, even integer > 0)             = +0
   *   pow(-0, odd integer < 0)              = -Infinity
   *   pow(-0, even integer < 0)             = +Infinity
   *   pow(finite x < 0, finite non-integer) = NaN
   *
   * For non-integer or very large exponents pow(x, y) is calculated using
   *
   *   x^y = exp(y*ln(x))
   *
   * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
   * probability of an incorrectly rounded result
   * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
   * i.e. 1 in 250,000,000,000,000
   *
   * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
   *
   * y {number|string|Decimal} The power to which to raise this Decimal.
   *
   */
  P.toPower = P.pow = function (y) {
    var e, k, pr, r, rm, s,
      x = this,
      Ctor = x.constructor,
      yn = +(y = new Ctor(y));

    // Either ±Infinity, NaN or ±0?
    if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));

    x = new Ctor(x);

    if (x.eq(1)) return x;

    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (y.eq(1)) return finalise(x, pr, rm);

    // y exponent
    e = mathfloor(y.e / LOG_BASE);

    // If y is a small integer use the 'exponentiation by squaring' algorithm.
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }

    s = x.s;

    // if x is negative
    if (s < 0) {

      // if y is not an integer
      if (e < y.d.length - 1) return new Ctor(NaN);

      // Result is positive if x is negative and the last digit of integer y is even.
      if ((y.d[e] & 1) == 0) s = 1;

      // if x.eq(-1)
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }

    // Estimate result exponent.
    // x^y = 10^e,  where e = y * log10(x)
    // log10(x) = log10(x_significand) + x_exponent
    // log10(x_significand) = ln(x_significand) / ln(10)
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k)
      ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1))
      : new Ctor(k + '').e;

    // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.

    // Overflow/underflow?
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);

    external = false;
    Ctor.rounding = x.s = 1;

    // Estimate the extra guard digits needed to ensure five correct rounding digits from
    // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
    // new Decimal(2.32456).pow('2087987436534566.46411')
    // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
    k = Math.min(12, (e + '').length);

    // r = x^y = exp(y*ln(x))
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);

    // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)
    if (r.d) {

      // Truncate to the required precision plus five rounding digits.
      r = finalise(r, pr + 5, 1);

      // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
      // the result.
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;

        // Truncate to the increased precision plus five rounding digits.
        r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);

        // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).
        if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
      }
    }

    r.s = s;
    external = true;
    Ctor.rounding = rm;

    return finalise(r, pr, rm);
  };


  /*
   * Return a string representing the value of this Decimal rounded to `sd` significant digits
   * using rounding mode `rounding`.
   *
   * Return exponential notation if `sd` is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toPrecision = function (sd, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
   * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
   * omitted.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toSD() digits out of range: {sd}'
   * 'toSD() digits not an integer: {sd}'
   * 'toSD() rounding mode not an integer: {rm}'
   * 'toSD() rounding mode out of range: {rm}'
   *
   */
  P.toSignificantDigits = P.toSD = function (sd, rm) {
    var x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    }

    return finalise(new Ctor(x), sd, rm);
  };


  /*
   * Return a string representing the value of this Decimal.
   *
   * Return exponential notation if this Decimal has a positive exponent equal to or greater than
   * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
   *
   */
  P.toString = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
   *
   */
  P.truncated = P.trunc = function () {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };


  /*
   * Return a string representing the value of this Decimal.
   * Unlike `toString`, negative zero will include the minus sign.
   *
   */
  P.valueOf = P.toJSON = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() ? '-' + str : str;
  };


  /*
  // Add aliases to match BigDecimal method names.
  // P.add = P.plus;
  P.subtract = P.minus;
  P.multiply = P.times;
  P.divide = P.div;
  P.remainder = P.mod;
  P.compareTo = P.cmp;
  P.negate = P.neg;
   */


  // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


  /*
   *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
   *                           finiteToString, naturalExponential, naturalLogarithm
   *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
   *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
   *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
   *  convertBase              toStringBinary, parseOther
   *  cos                      P.cos
   *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
   *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
   *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
   *                           taylorSeries, atan2, parseOther
   *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
   *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
   *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
   *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
   *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
   *                           P.truncated, divide, getLn10, getPi, naturalExponential,
   *                           naturalLogarithm, ceil, floor, round, trunc
   *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
   *                           toStringBinary
   *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
   *  getLn10                  P.logarithm, naturalLogarithm
   *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
   *  getPrecision             P.precision, P.toFraction
   *  getZeroString            digitsToString, finiteToString
   *  intPow                   P.toPower, parseOther
   *  isOdd                    toLessThanHalfPi
   *  maxOrMin                 max, min
   *  naturalExponential       P.naturalExponential, P.toPower
   *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
   *                           P.toPower, naturalExponential
   *  nonFiniteToString        finiteToString, toStringBinary
   *  parseDecimal             Decimal
   *  parseOther               Decimal
   *  sin                      P.sin
   *  taylorSeries             P.cosh, P.sinh, cos, sin
   *  toLessThanHalfPi         P.cos, P.sin
   *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
   *  truncate                 intPow
   *
   *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
   *                           naturalLogarithm, config, parseOther, random, Decimal
   */


  function digitsToString(d) {
    var i, k, ws,
      indexOfLastWord = d.length - 1,
      str = '',
      w = d[0];

    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + '';
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
        str += ws;
      }

      w = d[i];
      ws = w + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
    } else if (w === 0) {
      return '0';
    }

    // Remove trailing zeros of last w.
    for (; w % 10 === 0;) w /= 10;

    return str + w;
  }


  function checkInt32(i, min, max) {
    if (i !== ~~i || i < min || i > max) {
      throw Error(invalidArgument + i);
    }
  }


  /*
   * Check 5 rounding digits if `repeating` is null, 4 otherwise.
   * `repeating == null` if caller is `log` or `pow`,
   * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
   */
  function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;

    // Get the length of the first word of the array d.
    for (k = d[0]; k >= 10; k /= 10) --i;

    // Is the rounding digit in the first word of d?
    if (--i < 0) {
      i += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i + 1) / LOG_BASE);
      i %= LOG_BASE;
    }

    // i is the index (0 - 6) of the rounding digit.
    // E.g. if within the word 3487563 the first rounding digit is 5,
    // then i = 4, k = 1000, rd = 3487563 % 1000 = 563
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;

    if (repeating == null) {
      if (i < 3) {
        if (i == 0) rd = rd / 100 | 0;
        else if (i == 1) rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) &&
          (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 ||
            (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i < 4) {
        if (i == 0) rd = rd / 1000 | 0;
        else if (i == 1) rd = rd / 100 | 0;
        else if (i == 2) rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k ||
        (!repeating && rm > 3) && rd + 1 == k / 2) &&
          (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
      }
    }

    return r;
  }


  // Convert string of `baseIn` to an array of numbers of `baseOut`.
  // Eg. convertBase('255', 10, 16) returns [15, 15].
  // Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
  function convertBase(str, baseIn, baseOut) {
    var j,
      arr = [0],
      arrL,
      i = 0,
      strL = str.length;

    for (; i < strL;) {
      for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
      arr[0] += NUMERALS.indexOf(str.charAt(i++));
      for (j = 0; j < arr.length; j++) {
        if (arr[j] > baseOut - 1) {
          if (arr[j + 1] === void 0) arr[j + 1] = 0;
          arr[j + 1] += arr[j] / baseOut | 0;
          arr[j] %= baseOut;
        }
      }
    }

    return arr.reverse();
  }


  /*
   * cos(x) = 1 - x^2/2! + x^4/4! - ...
   * |x| < pi/2
   *
   */
  function cosine(Ctor, x) {
    var k, y,
      len = x.d.length;

    // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
    // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1

    // Estimate the optimum number of times to use the argument reduction.
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = Math.pow(4, -k).toString();
    } else {
      k = 16;
      y = '2.3283064365386962890625e-10';
    }

    Ctor.precision += k;

    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));

    // Reverse argument reduction
    for (var i = k; i--;) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }

    Ctor.precision -= k;

    return x;
  }


  /*
   * Perform division in the specified base.
   */
  var divide = (function () {

    // Assumes non-zero x and k, and hence non-zero result.
    function multiplyInteger(x, k, base) {
      var temp,
        carry = 0,
        i = x.length;

      for (x = x.slice(); i--;) {
        temp = x[i] * k + carry;
        x[i] = temp % base | 0;
        carry = temp / base | 0;
      }

      if (carry) x.unshift(carry);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, r;

      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i = r = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            r = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return r;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1;) a.shift();
    }

    return function (x, y, pr, rm, dp, base) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0,
        yL, yz,
        Ctor = x.constructor,
        sign = x.s == y.s ? 1 : -1,
        xd = x.d,
        yd = y.d;

      // Either NaN, Infinity or 0?
      if (!xd || !xd[0] || !yd || !yd[0]) {

        return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN :

          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
      }

      if (base) {
        logBase = 1;
        e = x.e - y.e;
      } else {
        base = BASE;
        logBase = LOG_BASE;
        e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
      }

      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign);
      qd = q.d = [];

      // Result exponent may be one less than e.
      // The digit array of a Decimal from toStringBinary may have trailing zeros.
      for (i = 0; yd[i] == (xd[i] || 0); i++);

      if (yd[i] > (xd[i] || 0)) e--;

      if (pr == null) {
        sd = pr = Ctor.precision;
        rm = Ctor.rounding;
      } else if (dp) {
        sd = pr + (x.e - y.e) + 1;
      } else {
        sd = pr;
      }

      if (sd < 0) {
        qd.push(1);
        more = true;
      } else {

        // Convert precision in number of base 10 digits to base 1e7 digits.
        sd = sd / logBase + 2 | 0;
        i = 0;

        // divisor < 1e7
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;

          // k is the carry.
          for (; (i < xL || k) && sd--; i++) {
            t = k * base + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }

          more = k || i < xL;

        // divisor >= 1e7
        } else {

          // Normalise xd and yd so highest order digit of yd is >= base/2
          k = base / (yd[0] + 1) | 0;

          if (k > 1) {
            yd = multiplyInteger(yd, k, base);
            xd = multiplyInteger(xd, k, base);
            yL = yd.length;
            xL = xd.length;
          }

          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL;) rem[remL++] = 0;

          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];

          if (yd[1] >= base / 2) ++yd0;

          do {
            k = 0;

            // Compare divisor and remainder.
            cmp = compare(yd, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, k.
              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // k will be how many times the divisor goes into the current remainder.
              k = rem0 / yd0 | 0;

              //  Algorithm:
              //  1. product = divisor * trial digit (k)
              //  2. if product > remainder: product -= divisor, k--
              //  3. remainder -= product
              //  4. if product was < remainder at 2:
              //    5. compare new remainder and divisor
              //    6. If remainder > divisor: remainder -= divisor, k++

              if (k > 1) {
                if (k >= base) k = base - 1;

                // product = divisor * trial digit.
                prod = multiplyInteger(yd, k, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                cmp = compare(prod, rem, prodL, remL);

                // product > remainder.
                if (cmp == 1) {
                  k--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yd, prodL, base);
                }
              } else {

                // cmp is -1.
                // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
                // to avoid it. If k is 1 there is a need to compare yd and rem again below.
                if (k == 0) cmp = k = 1;
                prod = yd.slice();
              }

              prodL = prod.length;
              if (prodL < remL) prod.unshift(0);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);

              // If product was < previous remainder.
              if (cmp == -1) {
                remL = rem.length;

                // Compare divisor and new remainder.
                cmp = compare(yd, rem, yL, remL);

                // If divisor < new remainder, subtract divisor from remainder.
                if (cmp < 1) {
                  k++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yd, remL, base);
                }
              }

              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }    // if cmp === 1, k will be 0

            // Add the next digit, k, to the result array.
            qd[i++] = k;

            // Update the remainder.
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }

          } while ((xi++ < xL || rem[0] !== void 0) && sd--);

          more = rem[0] !== void 0;
        }

        // Leading zero?
        if (!qd[0]) qd.shift();
      }

      // logBase is 1 when divide is being used for base conversion.
      if (logBase == 1) {
        q.e = e;
        inexact = more;
      } else {

        // To calculate q.e, first get the number of digits of qd[0].
        for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
        q.e = i + e * logBase - 1;

        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }

      return q;
    };
  })();


  /*
   * Round `x` to `sd` significant digits using rounding mode `rm`.
   * Check for over/under-flow.
   */
   function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi,
      Ctor = x.constructor;

    // Don't round if sd is null or undefined.
    out: if (sd != null) {
      xd = x.d;

      // Infinity/NaN.
      if (!xd) return x;

      // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
      // w: the word of xd containing rd, a base 1e7 number.
      // xdi: the index of w within xd.
      // digits: the number of digits of w.
      // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
      // they had leading zeros)
      // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

      // Get the length of the first word of the digits array xd.
      for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
      i = sd - digits;

      // Is the rounding digit in the first word of xd?
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];

        // Get the rounding digit at index j of w.
        rd = w / mathpow(10, digits - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {

            // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
            for (; k++ <= xdi;) xd.push(0);
            w = rd = 0;
            digits = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];

          // Get the number of digits of w.
          for (digits = 1; k >= 10; k /= 10) digits++;

          // Get the index of rd within w.
          i %= LOG_BASE;

          // Get the index of rd within w, adjusted for leading zeros.
          // The number of leading zeros of w is given by LOG_BASE - digits.
          j = i - LOG_BASE + digits;

          // Get the rounding digit at index j of w.
          rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
        }
      }

      // Are there any non-zero digits after the rounding digit?
      isTruncated = isTruncated || sd < 0 ||
        xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));

      // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
      // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
      // will give 714.

      roundUp = rm < 4
        ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
        : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
            rm == (x.s < 0 ? 8 : 7));

      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {

          // Convert sd to decimal places.
          sd -= x.e + 1;

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {

          // Zero.
          xd[0] = x.e = 0;
        }

        return x;
      }

      // Remove excess digits.
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);

        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
        // j > 0 means i > number of leading zeros of w.
        xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
      }

      if (roundUp) {
        for (;;) {

          // Is the digit to be rounded up in the first word of xd?
          if (xdi == 0) {

            // i will be the length of xd[0] before k is added.
            for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10) k++;

            // if i != k the length has increased.
            if (i != k) {
              x.e++;
              if (xd[0] == BASE) xd[0] = 1;
            }

            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE) break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }

      // Remove trailing zeros.
      for (i = xd.length; xd[--i] === 0;) xd.pop();
    }

    if (external) {

      // Overflow?
      if (x.e > Ctor.maxE) {

        // Infinity.
        x.d = null;
        x.e = NaN;

      // Underflow?
      } else if (x.e < Ctor.minE) {

        // Zero.
        x.e = 0;
        x.d = [0];
        // Ctor.underflow = true;
      } // else Ctor.underflow = false;
    }

    return x;
  }


  function finiteToString(x, isExp, sd) {
    if (!x.isFinite()) return nonFiniteToString(x);
    var k,
      e = x.e,
      str = digitsToString(x.d),
      len = str.length;

    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + '.' + str.slice(1);
      }

      str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
    } else if (e < 0) {
      str = '0.' + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
    } else {
      if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len) str += '.';
        str += getZeroString(k);
      }
    }

    return str;
  }


  // Calculate the base 10 exponent from the base 1e7 exponent.
  function getBase10Exponent(digits, e) {
    var w = digits[0];

    // Add the number of digits of the first word of the digits array.
    for ( e *= LOG_BASE; w >= 10; w /= 10) e++;
    return e;
  }


  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {

      // Reset global state in case the exception is caught.
      external = true;
      if (pr) Ctor.precision = pr;
      throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
  }


  function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
  }


  function getPrecision(digits) {
    var w = digits.length - 1,
      len = w * LOG_BASE + 1;

    w = digits[w];

    // If non-zero...
    if (w) {

      // Subtract the number of trailing zeros of the last word.
      for (; w % 10 == 0; w /= 10) len--;

      // Add the number of digits of the first word.
      for (w = digits[0]; w >= 10; w /= 10) len++;
    }

    return len;
  }


  function getZeroString(k) {
    var zs = '';
    for (; k--;) zs += '0';
    return zs;
  }


  /*
   * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
   * integer of type number.
   *
   * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
   *
   */
  function intPow(Ctor, x, n, pr) {
    var isTruncated,
      r = new Ctor(1),

      // Max n of 9007199254740991 takes 53 loop iterations.
      // Maximum digits array length; leaves [28, 34] guard digits.
      k = Math.ceil(pr / LOG_BASE + 4);

    external = false;

    for (;;) {
      if (n % 2) {
        r = r.times(x);
        if (truncate(r.d, k)) isTruncated = true;
      }

      n = mathfloor(n / 2);
      if (n === 0) {

        // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
        n = r.d.length - 1;
        if (isTruncated && r.d[n] === 0) ++r.d[n];
        break;
      }

      x = x.times(x);
      truncate(x.d, k);
    }

    external = true;

    return r;
  }


  function isOdd(n) {
    return n.d[n.d.length - 1] & 1;
  }


  /*
   * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
   */
  function maxOrMin(Ctor, args, ltgt) {
    var y,
      x = new Ctor(args[0]),
      i = 0;

    for (; ++i < args.length;) {
      y = new Ctor(args[i]);
      if (!y.s) {
        x = y;
        break;
      } else if (x[ltgt](y)) {
        x = y;
      }
    }

    return x;
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
   * digits.
   *
   * Taylor/Maclaurin series.
   *
   * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
   *
   * Argument reduction:
   *   Repeat x = x / 32, k += 5, until |x| < 0.1
   *   exp(x) = exp(x / 2^k)^(2^k)
   *
   * Previously, the argument was initially reduced by
   * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
   * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
   * found to be slower than just dividing repeatedly by 32 as above.
   *
   * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
   * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
   * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
   *
   *  exp(Infinity)  = Infinity
   *  exp(-Infinity) = 0
   *  exp(NaN)       = NaN
   *  exp(±0)        = 1
   *
   *  exp(x) is non-terminating for any finite, non-zero x.
   *
   *  The result will always be correctly rounded.
   *
   */
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow, sum, t, wpr,
      rep = 0,
      i = 0,
      k = 0,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // 0/NaN/Infinity?
    if (!x.d || !x.d[0] || x.e > 17) {

      return new Ctor(x.d
        ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0
        : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    t = new Ctor(0.03125);

    // while abs(x) >= 0.1
    while (x.e > -2) {

      // x = x / 2^5
      x = x.times(t);
      k += 5;
    }

    // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
    // necessary to ensure the first 4 rounding digits are correct.
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow = sum = new Ctor(1);
    Ctor.precision = wpr;

    for (;;) {
      pow = finalise(pow.times(x), wpr, 1);
      denominator = denominator.times(++i);
      t = sum.plus(divide(pow, denominator, wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        j = k;
        while (j--) sum = finalise(sum.times(sum), wpr, 1);

        // Check to see if the first 4 rounding digits are [49]999.
        // If so, repeat the summation with a higher precision, otherwise
        // e.g. with precision: 18, rounding: 1
        // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {

          if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += 10;
            denominator = pow = t = new Ctor(1);
            i = 0;
            rep++;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
    }
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
   * digits.
   *
   *  ln(-n)        = NaN
   *  ln(0)         = -Infinity
   *  ln(-0)        = -Infinity
   *  ln(1)         = 0
   *  ln(Infinity)  = Infinity
   *  ln(-Infinity) = NaN
   *  ln(NaN)       = NaN
   *
   *  ln(n) (n != 1) is non-terminating.
   *
   */
  function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2,
      n = 1,
      guard = 10,
      x = y,
      xd = x.d,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // Is x negative or Infinity, NaN, 0 or 1?
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);

    if (Math.abs(e = x.e) < 1.5e15) {

      // Argument reduction.
      // The series converges faster the closer the argument is to 1, so using
      // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
      // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
      // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
      // later be divided by this number, then separate out the power of 10 using
      // ln(a*10^b) = ln(a) + b*ln(10).

      // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
      //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
      // max n is 6 (gives 0.7 - 1.3)
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }

      e = x.e;

      if (c0 > 1) {
        x = new Ctor('0.' + c);
        e++;
      } else {
        x = new Ctor(c0 + '.' + c.slice(1));
      }
    } else {

      // The argument reduction method above may result in overflow if the argument y is a massive
      // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
      // function using ln(x*10^e) = ln(x) + e*ln(10).
      t = getLn10(Ctor, wpr + 2, pr).times(e + '');
      x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;

      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }

    // x1 is x reduced to a value near 1.
    x1 = x;

    // Taylor series.
    // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
    // where x = (y - 1)/(y + 1)    (|x| < 1)
    sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;

    for (;;) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        sum = sum.times(2);

        // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
        // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.
        if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
        sum = divide(sum, new Ctor(n), wpr, 1);

        // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
        // been repeated previously) and the first 4 rounding digits 9999?
        // If so, restart the summation with a higher precision, otherwise
        // e.g. with precision: 12, rounding: 1
        // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {
          if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += guard;
            t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x.times(x), wpr, 1);
            denominator = rep = 1;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
      denominator += 2;
    }
  }


  // ±Infinity, NaN.
  function nonFiniteToString(x) {
    // Unsigned.
    return String(x.s * x.s / 0);
  }


  /*
   * Parse the value of a new Decimal `x` from string `str`.
   */
  function parseDecimal(x, str) {
    var e, i, len;

    // Decimal point?
    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

    // Exponential form?
    if ((i = str.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
    str = str.slice(i, len);

    if (str) {
      len -= i;
      x.e = e = e - i - 1;
      x.d = [];

      // Transform base

      // e is the base 10 exponent.
      // i is where to slice str to get the first word of the digits array.
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;

      if (i < len) {
        if (i) x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }

      for (; i--;) str += '0';
      x.d.push(+str);

      if (external) {

        // Overflow?
        if (x.e > x.constructor.maxE) {

          // Infinity.
          x.d = null;
          x.e = NaN;

        // Underflow?
        } else if (x.e < x.constructor.minE) {

          // Zero.
          x.e = 0;
          x.d = [0];
          // x.constructor.underflow = true;
        } // else x.constructor.underflow = false;
      }
    } else {

      // Zero.
      x.e = 0;
      x.d = [0];
    }

    return x;
  }


  /*
   * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
   */
  function parseOther(x, str) {
    var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

    if (str === 'Infinity' || str === 'NaN') {
      if (!+str) x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
    }

    if (isHex.test(str))  {
      base = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str))  {
      base = 2;
    } else if (isOctal.test(str))  {
      base = 8;
    } else {
      throw Error(invalidArgument + str);
    }

    // Is there a binary exponent part?
    i = str.search(/p/i);

    if (i > 0) {
      p = +str.slice(i + 1);
      str = str.substring(2, i);
    } else {
      str = str.slice(2);
    }

    // Convert `str` as an integer then divide the result by `base` raised to a power such that the
    // fraction part will be restored.
    i = str.indexOf('.');
    isFloat = i >= 0;
    Ctor = x.constructor;

    if (isFloat) {
      str = str.replace('.', '');
      len = str.length;
      i = len - i;

      // log[10](16) = 1.2041... , log[10](88) = 1.9444....
      divisor = intPow(Ctor, new Ctor(base), i, i * 2);
    }

    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;

    // Remove trailing zeros.
    for (i = xe; xd[i] === 0; --i) xd.pop();
    if (i < 0) return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;

    // At what precision to perform the division to ensure exact conversion?
    // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
    // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
    // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
    // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
    // Therefore using 4 * the number of digits of str will always be enough.
    if (isFloat) x = divide(x, divisor, len * 4);

    // Multiply by the binary exponent part if present.
    if (p) x = x.times(Math.abs(p) < 54 ? Math.pow(2, p) : Decimal.pow(2, p));
    external = true;

    return x;
  }


  /*
   * sin(x) = x - x^3/3! + x^5/5! - ...
   * |x| < pi/2
   *
   */
  function sine(Ctor, x) {
    var k,
      len = x.d.length;

    if (len < 3) return taylorSeries(Ctor, 2, x, x);

    // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
    // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
    // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))

    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;

    // Max k before Math.pow precision loss is 22
    x = x.times(Math.pow(5, -k));
    x = taylorSeries(Ctor, 2, x, x);

    // Reverse argument reduction
    var sin2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);
    for (; k--;) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }

    return x;
  }


  // Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.
  function taylorSeries(Ctor, n, x, y, isHyperbolic) {
    var j, t, u, x2,
      i = 1,
      pr = Ctor.precision,
      k = Math.ceil(pr / LOG_BASE);

    external = false;
    x2 = x.times(x);
    u = new Ctor(y);

    for (;;) {
      t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
      t = u.plus(y);

      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--;);
        if (j == -1) break;
      }

      j = u;
      u = y;
      y = t;
      t = j;
      i++;
    }

    external = true;
    t.d.length = k + 1;

    return t;
  }


  // Return the absolute value of `x` reduced to less than or equal to half pi.
  function toLessThanHalfPi(Ctor, x) {
    var t,
      isNeg = x.s < 0,
      pi = getPi(Ctor, Ctor.precision, 1),
      halfPi = pi.times(0.5);

    x = x.abs();

    if (x.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x;
    }

    t = x.divToInt(pi);

    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x = x.minus(t.times(pi));

      // 0 <= x < pi
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? (isNeg ? 2 : 3) : (isNeg ? 4 : 1);
        return x;
      }

      quadrant = isOdd(t) ? (isNeg ? 1 : 4) : (isNeg ? 3 : 2);
    }

    return x.minus(pi).abs();
  }


  /*
   * Return the value of Decimal `x` as a string in base `baseOut`.
   *
   * If the optional `sd` argument is present include a binary exponent suffix.
   */
  function toStringBinary(x, baseOut, sd, rm) {
    var base, e, i, k, len, roundUp, str, xd, y,
      Ctor = x.constructor,
      isExp = sd !== void 0;

    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }

    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
      i = str.indexOf('.');

      // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
      // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
      // minBinaryExponent = floor(decimalExponent * log[2](10))
      // log[2](10) = 3.321928094887362347870319429489390175864

      if (isExp) {
        base = 2;
        if (baseOut == 16) {
          sd = sd * 4 - 3;
        } else if (baseOut == 8) {
          sd = sd * 3 - 2;
        }
      } else {
        base = baseOut;
      }

      // Convert the number as an integer then divide the result by its base raised to a power such
      // that the fraction part will be restored.

      // Non-integer.
      if (i >= 0) {
        str = str.replace('.', '');
        y = new Ctor(1);
        y.e = str.length - i;
        y.d = convertBase(finiteToString(y), 10, base);
        y.e = y.d.length;
      }

      xd = convertBase(str, 10, base);
      e = len = xd.length;

      // Remove trailing zeros.
      for (; xd[--len] == 0;) xd.pop();

      if (!xd[0]) {
        str = isExp ? '0p+0' : '0';
      } else {
        if (i < 0) {
          e--;
        } else {
          x = new Ctor(x);
          x.d = xd;
          x.e = e;
          x = divide(x, y, sd, rm, 0, base);
          xd = x.d;
          e = x.e;
          roundUp = inexact;
        }

        // The rounding digit, i.e. the digit after the digit that may be rounded up.
        i = xd[sd];
        k = base / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;

        roundUp = rm < 4
          ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2))
          : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 ||
            rm === (x.s < 0 ? 8 : 7));

        xd.length = sd;

        if (roundUp) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (; ++xd[--sd] > base - 1;) {
            xd[sd] = 0;
            if (!sd) {
              ++e;
              xd.unshift(1);
            }
          }
        }

        // Determine trailing zeros.
        for (len = xd.length; !xd[len - 1]; --len);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]);

        // Add binary exponent suffix?
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i = baseOut == 16 ? 4 : 3;
              for (--len; len % i; len++) str += '0';
              xd = convertBase(str, base, baseOut);
              for (len = xd.length; !xd[len - 1]; --len);

              // xd[0] will always be be 1
              for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
            } else {
              str = str.charAt(0) + '.' + str.slice(1);
            }
          }

          str =  str + (e < 0 ? 'p' : 'p+') + e;
        } else if (e < 0) {
          for (; ++e;) str = '0' + str;
          str = '0.' + str;
        } else {
          if (++e > len) for (e -= len; e-- ;) str += '0';
          else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
        }
      }

      str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
    }

    return x.s < 0 ? '-' + str : str;
  }


  // Does not strip trailing zeros.
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }


  // Decimal methods


  /*
   *  abs
   *  acos
   *  acosh
   *  add
   *  asin
   *  asinh
   *  atan
   *  atanh
   *  atan2
   *  cbrt
   *  ceil
   *  clone
   *  config
   *  cos
   *  cosh
   *  div
   *  exp
   *  floor
   *  hypot
   *  ln
   *  log
   *  log2
   *  log10
   *  max
   *  min
   *  mod
   *  mul
   *  pow
   *  random
   *  round
   *  set
   *  sign
   *  sin
   *  sinh
   *  sqrt
   *  sub
   *  tan
   *  tanh
   *  trunc
   */


  /*
   * Return a new Decimal whose value is the absolute value of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function abs(x) {
    return new this(x).abs();
  }


  /*
   * Return a new Decimal whose value is the arccosine in radians of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function acos(x) {
    return new this(x).acos();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function acosh(x) {
    return new this(x).acosh();
  }


  /*
   * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function add(x, y) {
    return new this(x).plus(y);
  }


  /*
   * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function asin(x) {
    return new this(x).asin();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function asinh(x) {
    return new this(x).asinh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function atan(x) {
    return new this(x).atan();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function atanh(x) {
    return new this(x).atanh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
   * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi, pi]
   *
   * y {number|string|Decimal} The y-coordinate.
   * x {number|string|Decimal} The x-coordinate.
   *
   * atan2(±0, -0)               = ±pi
   * atan2(±0, +0)               = ±0
   * atan2(±0, -x)               = ±pi for x > 0
   * atan2(±0, x)                = ±0 for x > 0
   * atan2(-y, ±0)               = -pi/2 for y > 0
   * atan2(y, ±0)                = pi/2 for y > 0
   * atan2(±y, -Infinity)        = ±pi for finite y > 0
   * atan2(±y, +Infinity)        = ±0 for finite y > 0
   * atan2(±Infinity, x)         = ±pi/2 for finite x
   * atan2(±Infinity, -Infinity) = ±3*pi/4
   * atan2(±Infinity, +Infinity) = ±pi/4
   * atan2(NaN, x) = NaN
   * atan2(y, NaN) = NaN
   *
   */
  function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r,
      pr = this.precision,
      rm = this.rounding,
      wpr = pr + 4;

    // Either NaN
    if (!y.s || !x.s) {
      r = new this(NaN);

    // Both ±Infinity
    } else if (!y.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
      r.s = y.s;

    // x is ±Infinity or y is ±0
    } else if (!x.d || y.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;

    // y is ±Infinity or x is ±0
    } else if (!y.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y.s;

    // Both non-zero and finite
    } else if (x.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y, x, wpr, 1));
      x = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y.s < 0 ? r.minus(x) : r.plus(x);
    } else {
      r = this.atan(divide(y, x, wpr, 1));
    }

    return r;
  }


  /*
   * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function cbrt(x) {
    return new this(x).cbrt();
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
   *
   * x {number|string|Decimal}
   *
   */
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }


  /*
   * Configure global settings for a Decimal constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *   maxE       {number}
   *   minE       {number}
   *   modulo     {number}
   *   crypto     {boolean|number}
   *
   * E.g. Decimal.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj) {
    if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
    var i, p, v,
      ps = [
        'precision', 1, MAX_DIGITS,
        'rounding', 0, 8,
        'toExpNeg', -EXP_LIMIT, 0,
        'toExpPos', 0, EXP_LIMIT,
        'maxE', 0, EXP_LIMIT,
        'minE', -EXP_LIMIT, 0,
        'modulo', 0, 9
      ];

    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if ((v = obj[p = 'crypto']) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != 'undefined' && crypto &&
            (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  /*
   * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cos(x) {
    return new this(x).cos();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cosh(x) {
    return new this(x).cosh();
  }


  /*
   * Create and return a Decimal constructor with the same configuration properties as this Decimal
   * constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;

    /*
     * The Decimal constructor and exported function.
     * Return a new Decimal instance.
     *
     * v {number|string|Decimal} A numeric value.
     *
     */
    function Decimal(v) {
      var e, i, t,
        x = this;

      // Decimal called without new.
      if (!(x instanceof Decimal)) return new Decimal(v);

      // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
      // which points to Object.
      x.constructor = Decimal;

      // Duplicate.
      if (v instanceof Decimal) {
        x.s = v.s;
        x.e = v.e;
        x.d = (v = v.d) ? v.slice() : v;
        return;
      }

      t = typeof v;

      if (t === 'number') {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [0];
          return;
        }

        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }

        // Fast path for small integers.
        if (v === ~~v && v < 1e7) {
          for (e = 0, i = v; i >= 10; i /= 10) e++;
          x.e = e;
          x.d = [v];
          return;

        // Infinity, NaN.
        } else if (v * 0 !== 0) {
          if (!v) x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }

        return parseDecimal(x, v.toString());

      } else if (t !== 'string') {
        throw Error(invalidArgument + v);
      }

      // Minus sign?
      if (v.charCodeAt(0) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        x.s = 1;
      }

      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }

    Decimal.prototype = P;

    Decimal.ROUND_UP = 0;
    Decimal.ROUND_DOWN = 1;
    Decimal.ROUND_CEIL = 2;
    Decimal.ROUND_FLOOR = 3;
    Decimal.ROUND_HALF_UP = 4;
    Decimal.ROUND_HALF_DOWN = 5;
    Decimal.ROUND_HALF_EVEN = 6;
    Decimal.ROUND_HALF_CEIL = 7;
    Decimal.ROUND_HALF_FLOOR = 8;
    Decimal.EUCLID = 9;

    Decimal.config = Decimal.set = config;
    Decimal.clone = clone;

    Decimal.abs = abs;
    Decimal.acos = acos;
    Decimal.acosh = acosh;        // ES6
    Decimal.add = add;
    Decimal.asin = asin;
    Decimal.asinh = asinh;        // ES6
    Decimal.atan = atan;
    Decimal.atanh = atanh;        // ES6
    Decimal.atan2 = atan2;
    Decimal.cbrt = cbrt;          // ES6
    Decimal.ceil = ceil;
    Decimal.cos = cos;
    Decimal.cosh = cosh;          // ES6
    Decimal.div = div;
    Decimal.exp = exp;
    Decimal.floor = floor;
    Decimal.hypot = hypot;        // ES6
    Decimal.ln = ln;
    Decimal.log = log;
    Decimal.log10 = log10;        // ES6
    Decimal.log2 = log2;          // ES6
    Decimal.max = max;
    Decimal.min = min;
    Decimal.mod = mod;
    Decimal.mul = mul;
    Decimal.pow = pow;
    Decimal.random = random;
    Decimal.round = round;
    Decimal.sign = sign;          // ES6
    Decimal.sin = sin;
    Decimal.sinh = sinh;          // ES6
    Decimal.sqrt = sqrt;
    Decimal.sub = sub;
    Decimal.tan = tan;
    Decimal.tanh = tanh;          // ES6
    Decimal.trunc = trunc;        // ES6

    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    Decimal.config(obj);

    return Decimal;
  }


  /*
   * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function div(x, y) {
    return new this(x).div(y);
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The power to which to raise the base of the natural log.
   *
   */
  function exp(x) {
    return new this(x).exp();
  }


  /*
   * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
   *
   * x {number|string|Decimal}
   *
   */
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
  }


  /*
   * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
   *
   */
  function hypot() {
    var i, n,
      t = new this(0);

    external = false;

    for (i = 0; i < arguments.length;) {
      n = new this(arguments[i++]);
      if (!n.d) {
        if (n.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n;
      } else if (t.d) {
        t = t.plus(n.times(n));
      }
    }

    external = true;

    return t.sqrt();
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function ln(x) {
    return new this(x).ln();
  }


  /*
   * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
   * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * log[y](x)
   *
   * x {number|string|Decimal} The argument of the logarithm.
   * y {number|string|Decimal} The base of the logarithm.
   *
   */
  function log(x, y) {
    return new this(x).log(y);
  }


  /*
   * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log2(x) {
    return new this(x).log(2);
  }


  /*
   * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log10(x) {
    return new this(x).log(10);
  }


  /*
   * Return a new Decimal whose value is the maximum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function max() {
    return maxOrMin(this, arguments, 'lt');
  }


  /*
   * Return a new Decimal whose value is the minimum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function min() {
    return maxOrMin(this, arguments, 'gt');
  }


  /*
   * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mod(x, y) {
    return new this(x).mod(y);
  }


  /*
   * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mul(x, y) {
    return new this(x).mul(y);
  }


  /*
   * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The base.
   * y {number|string|Decimal} The exponent.
   *
   */
  function pow(x, y) {
    return new this(x).pow(y);
  }


  /*
   * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
   * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
   * are produced).
   *
   * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
   *
   */
  function random(sd) {
    var d, e, k, n,
      i = 0,
      r = new this(1),
      rd = [];

    if (sd === void 0) sd = this.precision;
    else checkInt32(sd, 1, MAX_DIGITS);

    k = Math.ceil(sd / LOG_BASE);

    if (!this.crypto) {
      for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;

    // Browsers supporting crypto.getRandomValues.
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));

      for (; i < k;) {
        n = d[i];

        // 0 <= n < 4294967296
        // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
        if (n >= 4.29e9) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {

          // 0 <= n <= 4289999999
          // 0 <= (n % 1e7) <= 9999999
          rd[i++] = n % 1e7;
        }
      }

    // Node.js supporting crypto.randomBytes.
    } else if (crypto.randomBytes) {

      // buffer
      d = crypto.randomBytes(k *= 4);

      for (; i < k;) {

        // 0 <= n < 2147483648
        n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24);

        // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
        if (n >= 2.14e9) {
          crypto.randomBytes(4).copy(d, i);
        } else {

          // 0 <= n <= 2139999999
          // 0 <= (n % 1e7) <= 9999999
          rd.push(n % 1e7);
          i += 4;
        }
      }

      i = k / 4;
    } else {
      throw Error(cryptoUnavailable);
    }

    k = rd[--i];
    sd %= LOG_BASE;

    // Convert trailing digits to zeros according to sd.
    if (k && sd) {
      n = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n | 0) * n;
    }

    // Remove trailing words which are zero.
    for (; rd[i] === 0; i--) rd.pop();

    // Zero?
    if (i < 0) {
      e = 0;
      rd = [0];
    } else {
      e = -1;

      // Remove leading words which are zero and adjust exponent accordingly.
      for (; rd[0] === 0; e -= LOG_BASE) rd.shift();

      // Count the digits of the first word of rd to determine leading zeros.
      for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;

      // Adjust the exponent for leading zeros of the first word of rd.
      if (k < LOG_BASE) e -= LOG_BASE - k;
    }

    r.e = e;
    r.d = rd;

    return r;
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
   *
   * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
   *
   * x {number|string|Decimal}
   *
   */
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }


  /*
   * Return
   *   1    if x > 0,
   *  -1    if x < 0,
   *   0    if x is 0,
   *  -0    if x is -0,
   *   NaN  otherwise
   *
   */
  function sign(x) {
    x = new this(x);
    return x.d ? (x.d[0] ? x.s : 0 * x.s) : x.s || NaN;
  }


  /*
   * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sin(x) {
    return new this(x).sin();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sinh(x) {
    return new this(x).sinh();
  }


  /*
   * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function sqrt(x) {
    return new this(x).sqrt();
  }


  /*
   * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function sub(x, y) {
    return new this(x).sub(y);
  }


  /*
   * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tan(x) {
    return new this(x).tan();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tanh(x) {
    return new this(x).tanh();
  }


  /*
   * Return a new Decimal whose value is `x` truncated to an integer.
   *
   * x {number|string|Decimal}
   *
   */
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }


  // Create and configure initial Decimal constructor.
  Decimal = clone(Decimal);

  Decimal['default'] = Decimal.Decimal = Decimal;

  // Create the internal constants from their string values.
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);


  // Export.


  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return Decimal;
    });

  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Decimal;

  // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }

    noConflict = globalScope.Decimal;
    Decimal.noConflict = function () {
      globalScope.Decimal = noConflict;
      return Decimal;
    };

    globalScope.Decimal = Decimal;
  }
})(this);

},{}],3:[function(require,module,exports){
module.exports = require('./lib/email-validation');

},{"./lib/email-validation":4}],4:[function(require,module,exports){
var util = require('util');
var email = module.exports = function() {};

var strToObj = function(str) {
  var obj = {};
  for(var i = 0; i < str.length; i++) {
    obj[str[i]] = str.charCodeAt(i);
  }
  return obj;
};

var chars = strToObj("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.");
var specialchars = strToObj("\\\"(),:;<>@[\] ");
var escapers = strToObj('\\"');
var hostchars = strToObj("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-");

email.parse = function(address, dothrow, callback) {
  callback = (typeof callback == 'undefined' && typeof dothrow == 'function') ? dothrow : null;
  var userland = true;
  var quotation = false;
  var escaped = false;
  var _user = "", _domain = "";
  var hostisip = false;
  var hoststartpos = 0;
  try {
    if(address.length >= 254) throw util.format("[Error parsing email address: address is longer than 253, actual]", address.length);
    for(var i = 0; i < address.length; i++) {
      //console.log(i, address[i])
      if(userland) {
        if(address[i] == '"' && i == 0) { quotation = true; _user += address[i]; continue; }
        if(typeof chars[address[i]] != 'undefined') { //needed I'm sure.
          _user += address[i]; continue;
        } else if(typeof specialchars[address[i]] != 'undefined') {
          if(quotation) {
            if(!escaped && address[i] == "\\") { escaped = true; _user += address[i]; continue; }
            if(!escaped && address[i] == '"' && address[i+1] == "@") { userland = false; hoststartpos = i+2; _user += address[i]; i+=1; continue; }
            if(escaped && typeof escapers[address[i]] != 'undefined') { escaped = false; _user += address[i]; continue; }
            if(!escaped && typeof escapers[address[i]] != 'undefined') throw util.format("[Error parsing email address: invalid use of %s (pos: %s)]", address[i], i, address);
          } else if(address[i] == "@" && !quotation) {
            userland = false;
            hoststartpos = i+1;
            continue;
          } else {
            throw util.format("[Error parsing email address: special character '%s' (pos: %s) used without quotation marks]", address[i], i);
          }
        } else {
          throw util.format("[Error parsing email address: character '%s' (pos: %s) is not allowed in an email address user space.]", address[i], i, address);
        }
        _user += address[i];
      } else { //parsing hostname. Probably could be done with regex.
        if(i == hoststartpos && address[i] == '[') { hostisip = true; hostchars['['] = '['; hostchars[']'] = ']'; hostchars[':'] = ':'; _domain += address[i]; continue; }
        if(typeof hostchars[address[i]] == 'undefined') throw util.format("[Error parsing email address: character '%s' (pos: %s) is not allowed in the hostname section]", address[i], i);
        if(i >= hoststartpos && /[@\.]/.test(address[i - 1]) && !/[a-z0-9]/i.test(address[i])) throw util.format("[Error parsing email address: All domain segments must start with a letter or number, never a symbol like '%s'.")
        _domain += address[i];
      }
    }
    if(_domain === '') throw util.format("[Error parseing email address: no domain part]", address);
    if(hostisip && !require('net').isIP(address.substring(hoststartpos+1,address.length-1))) throw util.format("[Error parsing email address: invalid IP address]");
    if(hostisip && address[address.length-1] != "]") throw util.format("[Error parsing email address: IP address notation must end with a ']']");
    if(!hostisip && (/^.+@([a-z0-9]{64,}(|\.))/i).test(address)) throw util.format("[Error parsing email address: hostname has elements greater than 63 characters]");
    if(userland) throw util.format("[Error parsing email address: quotation mark not closed]" , address);
  } catch (err) {
    if(callback) callback(err);
    if(typeof dothrow != 'undefined' && typeof dothrow != 'function') throw err;
    return false; //redundant?
  }
  if(callback) callback(null, {user: _user, domain: _domain});
  else return {user: _user, domain: _domain};
}

email.valid = function(address, dothrow, callback) {
  return !!email.parse(address, dothrow, callback);
}

},{"net":1,"util":8}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],7:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":7,"_process":5,"inherits":6}],9:[function(require,module,exports){
var decimal = require('decimal.js')

module.exports = {
    toPercent: function(input, total, decimals) {
        total = new decimal(total)

        var result = []
        var lastWithValue = undefined

        for (var i = 0; i < input.length; i++) {
            result[i] = new decimal(input[i])

            result[i] = result[i].div(total).mul(100)
            
            if (decimals) result[i] = setDecimals(result[i], decimals)
            if (result[i].greaterThan(0)) lastWithValue = i
        }

        if (lastWithValue) {
            var percentOfTotal = setDecimals(new decimal(this.sumWithPrecision(input)).div(total).mul(100), decimals)

            var remainder = percentOfTotal.sub(this.sumWithPrecision(result))
            result[lastWithValue] = result[lastWithValue].add(remainder)
        }

        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].toString()
        }
        
        return result
    },

    toAbsolute: function(total, spread) {
        total = new decimal(total)

        var result = []
        var lastWithValue = undefined
        for (var i = 0; i < spread.length; i++) {
            var split = new decimal(spread[i]).div(100)

            result[i] = setDecimals(total.mul(split), 0)

            if (!split.eq(0)) lastWithValue = i
        }

        if (lastWithValue) {
            var remainder = setDecimals(total.mul(new decimal(this.sumWithPrecision(spread)).div(100)).sub(this.sumWithPrecision(result)),0)
            result[lastWithValue] = result[lastWithValue].add(remainder)
        }

        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].toString()
        }

        return result
    },

    sumWithPrecision: function(input) {
        var total = new decimal(0)

        for (var i = 0; i < input.length; i++) {
            total = total.add(input[i])
        }

        return total.toString()
    }
}

function setDecimals(num, decimals) {
    return new decimal(num.toFixed(decimals))
}
},{"decimal.js":2}],10:[function(require,module,exports){
module.exports = function(widget, pane) { 
    this.widget = widget;
    this.pane = pane;

    setupSelectSplitCheckbox();

    pane.dispatchEvent(new CustomEvent('ready', pane));

    return {
        submit: submitAmount,
        focus: focusAmount,
        widget: widget,
        pane: pane
    } 
}

function submitAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    widget.donationAmount = parseInt(pane.getElementsByClassName("amount")[0].value);

    if (widget.donationAmount > 0) {
        if (widget.submitOnAmount) {
            widget.panes[2].classList.add("hidden");
            widget.postDonation({
                donor: {
                    name: widget.name,
                    email: widget.email
                },
                amount: widget.donationAmount
            }, nxtBtn);
        } else {
            widget.nextSlide();

            setTimeout(function() {
                nxtBtn.classList.remove("loading");
            }, 200);
        }
    }
    else {
        widget.error("Du må angi en sum");
        nxtBtn.classList.remove("loading");
    }
}

function focusAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var input = pane.getElementsByClassName("amount")[0];

    widget.element.style.height = "";

    setTimeout(function () {
        input.focus();
    }, 200);
}

/* Setup select split checkbox */
function setupSelectSplitCheckbox() {
    var widget = this.widget;

    var selectSplit = document.getElementById("check-select-split");
    var selectRecommended = document.getElementById("check-select-recommended");

    selectSplit.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.remove("hidden");
        widget.submitOnAmount = false;
        widget.activePanes++;
        widget.updateSliderProgress();
    });

    selectRecommended.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.add("hidden");
        widget.submitOnAmount = true;
        widget.activePanes--;
        widget.updateSliderProgress();
    })
}
},{}],11:[function(require,module,exports){
var rounding = require('../lib/rounding.js'); 

module.exports = function(widget, pane) {
    this.pane = pane;
    this.widget = widget;

    setup(pane);

    return {
        submit: submitDonation,
        focus: focusDonation,
        widget: widget,
        pane: pane
    }
}

function submitDonation() {
    var widget = this.widget;
    var pane = this.pane;

    if (widget.sharesType == "decimal") {
        var percentSplit = rounding.toPercent(widget.organizations.map(function(org) { return org.setValue; }), widget.donationAmount, 3);

        var donationSplit = widget.organizations.map(function(org, i) {
            if (org.setValue != "0") {
                return {
                    id: org.id,
                    split: percentSplit[i]
                } 
            } else {
                return false;
            }
        }).filter(function(item) { return item })
    } 
    else {
        var donationSplit = widget.organizations.map(function(org) {
            if (org.setValue != "0") {
                return {
                    id: org.id,
                    split: org.setValue
                }
            } else {
                return false;
            }
        }).filter(function(item) { return item })
    }
    

    if (rounding.sumWithPrecision(donationSplit.map(function(item) {return item.split})) === '100') {
        var nxtBtn = pane.getElementsByClassName("btn")[0];
        nxtBtn.classList.add("loading");

        widget.postDonation({
            donor: {
                name: widget.name,
                email: widget.email
            },
            amount: widget.donationAmount,
            organizations: donationSplit
        }, nxtBtn);
    }
    else {
        widget.error("Du må fordele alle midlene");
    }
}

function focusDonation() {
    var widget = this.widget;
    var pane = this.pane;

    var organizations = pane.getElementsByClassName("organizations")[0];

    setSplitValues();

    setTimeout(function() {
        pane.getElementsByTagName("input")[0].focus();
    }, 200);
}

/* Setup donation split pane */
function setup(pane) {
    setupModeButton(pane);
    setupDonationList(pane);
}

function setupDonationList(pane) { 
    var widget = this.widget;

    setTimeout(function() {
        widget.request("organizations/active", "GET", { }, function(err, data) {
            if (err == 0) {
                setNoApiError();
            } else {
                widget.organizations = data.content;

                var list = pane.getElementsByClassName("organizations")[0];
                var leftover = 0;

                widget.splitSharesTotal = pane.getElementsByClassName("total")[0];

                for (var i = 0; i < widget.organizations.length; i++) {
                    var org = widget.organizations[i];
                    org.element = createListItem(org);

                    list.appendChild(org.element);
                }

                function createListItem(org) {

                    var li = document.createElement("li");
                    //li.setAttribute("data-id", org._id);

                    var span = document.createElement("span");
                    span.innerHTML = org.name;

                    li.appendChild(span);

                    var info = document.createElement("div");
                    info.classList.add("info");
                    info.onclick = function() { window.open(org.infoUrl, "_blank"); }

                    li.appendChild(info);

                    var inputWrapper = document.createElement("div");
                    inputWrapper.classList.add("input-wrapper");

                    li.appendChild(inputWrapper);

                    var input = document.createElement("input");
                    input.setAttribute("type", "tel");
                    input.setAttribute("inputmode", "numeric");
                    input.setAttribute("nocomma", "true");

                    org.inputElement = input;

                    input.addEventListener("keyup", function(e) {
                        var val;
                        if (this.value.length > 0) val = this.value;
                        else val = "0";

                        org.setValue = val;
                        updateTotalShares();
                    });

                    input.addEventListener("focus", function(e) {
                        if (e.target.value == "0") e.target.value = "";
                    })

                    input.addEventListener("blur", function(e) {
                        if (e.target.value.length == 0) e.target.value = "0";
                    })

                    inputWrapper.appendChild(input);

                    return li;
                }

                function createInfoListItem(org) {
                    var li = document.createElement("li");

                    var header = document.createElement("div");
                    header.classList.add("header");

                    header.style.backgroundImage = org.headerImage;

                    var headerText = document.createElement("h3");
                    headerText.innerHTML = org.name;

                    header.appendChild(headerText);

                    li.appendChild(header);

                    var content = document.createElement("div");
                    content.classList.add("content");

                    var contentParagraph = document.createElement("p");
                    contentParagraph.innerHTML = org.longDesc;

                    content.appendChild(contentParagraph);

                    return li;
                }
            }

            pane.dispatchEvent(new CustomEvent('ready', pane));
        });
    }, 10)
}

function setSplitValues() {
    var widget = this.widget;

    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        if (typeof org.setValue === "undefined") {
            org.setValue = Math.round(widget.donationAmount * (org.standardShare / 100));
        }

        org.inputElement.value = org.setValue;
    }

    updateTotalShares();
}

function organizationValuesToPercent() {
    var widget = this.widget;

    var input = widget.organizations.map(function(org) {return org.setValue} );
    var converted = rounding.toPercent(input, widget.donationAmount, 2);
    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        org.setValue = converted[i];
        org.inputElement.value = org.setValue;
        org.inputElement.setAttribute("nocomma",  "false");
    }
    updateTotalShares(); 
}

function organizationValuesToAmount() {
    var widget = this.widget;

    var input = widget.organizations.map(function(org) {return org.setValue});
    var converted = rounding.toAbsolute(widget.donationAmount, input);
    for (var i = 0; i < widget.organizations.length; i++) {
        var org = widget.organizations[i];

        org.setValue = converted[i];
        org.inputElement.value = org.setValue;
        org.inputElement.setAttribute("nocomma",  "true");
    }
    updateTotalShares();
}

function updateTotalShares() {
    var widget = this.widget;

    var total = rounding.sumWithPrecision(widget.organizations.map(function(org) {return org.setValue}));
    if (!isNaN(total)) {
        if (widget.sharesType == "decimal") {
            if (total == widget.donationAmount) setDonationSplitValidAmount();
            else {
                widget.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av " + widget.donationAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "kr";
                setDonationSplitInvalidAmount();
            }
        } else if (widget.sharesType == "percentage") {
            if (total == 100) setDonationSplitValidAmount();
            else {
                widget.splitSharesTotal.innerHTML = "Du har fordelt " + total.toString().toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " av 100%"; 
                setDonationSplitInvalidAmount();
            }
        }
    }
}

function setDonationSplitValidAmount() {
    var widget = this.widget;

    widget.splitSharesTotal.classList.add("total-hidden");
    //Hardcoded slide 2, update later
    widget.panes[2].getElementsByClassName("btn")[0].classList.remove("inactive");
}

function setDonationSplitInvalidAmount() {
    var widget = this.widget;

    widget.splitSharesTotal.classList.remove("total-hidden");
    //Hardcoded slide 2, update later
    widget.panes[2].getElementsByClassName("btn")[0].classList.add("inactive");
}

function setupModeButton(pane) {
    var widget = this.widget;

    var btn = pane.getElementsByClassName("mode-switch")[0];
    var organizationList = pane.getElementsByClassName("organizations")[0];

    widget.sharesType = "decimal";
    var hasSwitched = false;
    btn.addEventListener("click", function(e) {
        if (hasSwitched) {
            btn.classList.remove("switched");
            widget.sharesType = "decimal";
            organizationList.classList.remove("percentage-mode");
            organizationValuesToAmount();
            hasSwitched = false;
        } else {
            btn.classList.add("switched");
            widget.sharesType = "percentage";
            organizationList.classList.add("percentage-mode");
            organizationValuesToPercent();
            hasSwitched = true;
        }
    });
}
},{"../lib/rounding.js":9}],12:[function(require,module,exports){
var emailvalidation = require('email-validation');

module.exports = function(widget, pane) {
    this.widget = widget;
    this.pane = pane;

    if (window.localStorage) {
        pane.getElementsByClassName("name")[0].value = window.localStorage.getItem("donation-name");
        pane.getElementsByClassName("email")[0].value = window.localStorage.getItem("donation-email");
    }

    pane.dispatchEvent(new CustomEvent('ready', pane));

    return {
        submit: submitUser,
        focus: focusUser,
        pane: pane,
        widget: widget
    }
}

function submitUser() {
    var pane = this.pane;
    var widget = this.widget;

    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    var email = pane.getElementsByClassName("email")[0].value.trim();
    var name = pane.getElementsByClassName("name")[0].value.trim();

    //Validate input
    if (name.length < 2 || name.length > 32) { //Invalid name
        widget.error("Ikke et gyldig navn");
        return;
    } 

    if (!emailvalidation.valid(email)) { //Invalid email
        widget.error("Ikke en gyldig mail");
        return;
    }

    widget.name = name;
    widget.email = email;

    if (window.localStorage) {
        window.localStorage.setItem("donation-name", name);
        window.localStorage.setItem("donation-email", email);
    }

    widget.nextSlide();
    
    setTimeout(function() {
        nxtBtn.classList.remove("loading");
    }, 200);
}

function focusUser() {
    var input = this.pane.getElementsByClassName("name")[0];
    setTimeout(function () {
        input.focus();
    }, 200);
}

},{"email-validation":3}],13:[function(require,module,exports){
function DonationWidget() {
    var _self = undefined;

    this.setup = function (self, widgetElement) {
        _self = self;

        this.assetsUrl = "https://api.gieffektivt.no/static/";
        
        this.localStorage = window.localStorage;
    
        this.element = widgetElement;
        this.wrapper = this.element.parentElement;
        this.activeError = false;
    
        this.submitOnAmount = true;
    
        this.slider = this.element.getElementsByClassName("slider")[0];
        if (!this.slider) throw Error("No slider element in widget");
    
        this.progress = this.element.getElementsByClassName("progress")[0];
        if (!this.progress) throw new Error("No progress element in slider");
    
        this.errorElement = this.element.getElementsByClassName("error")[0];
        if (!this.error) throw new Error("No error element in slider");
    
        this.closeBtn = this.element.getElementsByClassName("close-btn")[0];
        if (!this.closeBtn) throw new Error("No close button element in widget")
    
        this.width = this.element.clientWidth;
        this.currentSlide = 0;
    
        this.panes = this.element.getElementsByClassName("pane");
        this.activePanes = 0;
        for (var i = 1; i < this.panes.length; i++) {
            if(!this.panes[i].classList.contains("hidden")) this.activePanes++;
        }
    
        var notDefaultPanes = ["shares"]
    
        this.defaultPanes = 90;
    
        this.slider.style.width = (this.panes.length * this.width) + "px";
    
        for (var i = 0; i < this.panes.length; i++) {
            var pane = this.panes[i];
            pane.style.width = this.width + "px";

            pane.addEventListener("ready", function(pane) {
                submitOnEnter(pane);
            }); 
    
            if (i == 0) {
                var donorPane = require('./panes/donor.js')(_self, _self.panes[0])

                pane.submit = function() {
                    donorPane.submit();
                };
                pane.focus = function() {
                    universalPaneFocus(self, donorPane.pane);
                    donorPane.focus();
                };
            } else if (i == 1) {
                var amountPane = require('./panes/amount.js')(_self, _self.panes[1])
                
                pane.submit = function() { 
                    amountPane.submit(_self, this);
                };
                pane.focus = function() { 
                    universalPaneFocus(self, amountPane.pane);
                    amountPane.focus(_self, this);
                };
            } else if (i == 2) {
                var donationPane = require('./panes/donation.js')(_self, _self.panes[2])

                pane.submit = function() { 
                    donationPane.submit(_self, this);
                };
                pane.focus = function() {
                    universalPaneFocus(self, donationPane.pane); 
                    donationPane.focus(_self, this);
                };
            } else if (i == this.panes.length-1) {
                //No submit function needed on last pane
            } else {
                throw new Error("No submit function specified for a pane");
            }
    
            if (i != this.panes.length-1) insertNextButton(pane, (i == 0)); //No next button on last pane
            if (i != 0 && i != this.panes.length-1) insertPrevButton(pane); //No prev button on first and last pane
        }

        setupCloseBtn();
        setupHasBtnClasses();
        setupSelectOnClick();
    }

    function universalPaneFocus(widget, pane) {
        var allInputs = widget.element.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("tabindex", "-1");
        }

        var paneInputs = pane.getElementsByTagName("input");
        for (var i = 0; i < paneInputs.length; i++) {
            paneInputs[i].setAttribute("tabindex", i+1);
        }
    }

    /* Setup helpers */
    function setupCloseBtn() {
        _self.closeBtn.addEventListener("click", function() {
            _self.close();
        })
    }

    function setupHasBtnClasses() {
        for (var i = 0; i < _self.panes.length; i++) {
            var pane = _self.panes[i];

            if (pane.getElementsByClassName("btn").length > 0) pane.classList.add("has-buttons");
        }
    }

    function insertNextButton(pane, lonely) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("frwd");

        if (lonely) btn.classList.add("lonely");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            pane.submit(_self, pane)
        })
    }

    function insertPrevButton(pane) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("back");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            _self.prevSlide();
        })
    }

    function submitOnEnter(e) {
        var pane = e.target;

        var inputs = pane.querySelectorAll("input[type=text], input[type=tel]");
        if (inputs.length > 0) {
            for (var i = 0; i < inputs.length; i++) {
                if (i == inputs.length-1) {
                    inputs[i].addEventListener("input", function(e) {
                        var valid = true;
                        if (this.getAttribute("inputmode") == "numeric") {
                            valid = numberInputWhitelistCheck(e);
                        }

                        if (_self.activeError) _self.hideError();

                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit(_self, pane);
                        }
                        return valid;
                    });

                    inputs[i].addEventListener("keydown", function(e) {
                        if (_self.activeError) _self.hideError();
                        
                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit(_self, pane);
                        }
                    });
                } else {
                    (function() {
                        var next = inputs[i+1];
                        inputs[i].addEventListener("input", function(e) {
                            var valid = true;
                            if (this.getAttribute("inputmode") == "numeric") {
                                valid = numberInputWhitelistCheck(e);
                            }

                            return valid;
                        });

                        inputs[i].addEventListener("keydown", function(e) {
                            if (_self.activeError) _self.hideError();
                            
                            if (e.keyCode == 13) { //enter
                                next.focus();
                            }
                        });
                    }());
                }
            }

        }
    }

    function numberInputWhitelistCheck(e) {
        //e.preventDefault(); 

        var valid = true;

        var carrotPosition = e.target.selectionStart;
        var value = e.target.value.replace(new RegExp(",", "g"), ".");

        if (e.target.getAttribute("nocomma") == "true" && (value.indexOf(".") != -1)) valid = false;
        if (valid && value.indexOf(" ") != -1) valid = false;

        if (valid) {
            var numDecimals = value.split(".");
            numDecimals = (numDecimals.length  > 1 ? numDecimals[1].length : 0);
            valid = ((~~value > 0 && numDecimals < 3) || value == "0");
        }
 
        if (!valid) {
            e.target.value = e.target.value.slice(0,carrotPosition-1) + e.target.value.slice(carrotPosition);

            e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
            //timeout needed for mobile android
            setTimeout(function() {
                e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
            }, 0);
            
        } else {
            e.target.value = value;
        }

        return valid;
    }

    function postDonation(postData, nxtBtn) {
        _self.request("donations", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) _self.error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) _self.error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }
            nxtBtn.classList.remove("loading");

            var resultPane = _self.element.getElementsByClassName("result")[0];

            resultPane.getElementsByClassName("amount")[0].innerHTML = _self.donationAmount + "kr";
            var KIDstring = data.content.KID.toString();
            KIDstring = KIDstring.slice(0,3) + " " + KIDstring.slice(3,5) + " " + KIDstring.slice(5);
            resultPane.getElementsByClassName("KID")[0].innerHTML = KIDstring;
            resultPane.getElementsByClassName("email")[0].innerHTML = _self.email;

            _self.nextSlide();
        });
    }
    this.postDonation = postDonation;

    /* Slider control */
    this.goToSlide = function(slidenum) {
        if (slidenum < 0 || slidenum > _self.panes.length - 1) throw Error("Slide under 0 or larger than set")
        _self.slider.style.transform = "translateX(-" + (slidenum * _self.width) + "px)";

        var pane = _self.panes[slidenum];

        if (pane.classList.contains("hidden")) {
            if (_self.currentSlide < slidenum) slidenum++;
            else if (_self.currentSlide > slidenum) slidenum--;
        }

        pane = _self.panes[slidenum];

        if (pane.getElementsByClassName("btn").length > 0) {
            //If pane has button, make room for those
            var padding = 90;
        } else {
            var padding = 50;
        }

        var height = pane.getElementsByClassName("inner")[0].clientHeight + padding;

        if (slidenum == _self.panes.length-1) _self.element.style.maxHeight = "3000px";

        if (height < 300) height = 300;
        _self.element.style.height = height + "px";
        if (_self.active) pane.focus(_self, pane);
 
        setTimeout(function() {
            _self.element.style.overflow = "hidden";
            _self.element.getElementsByClassName("inner")[0].style.position = "static";

            setTimeout(function() {
                _self.element.getElementsByClassName("inner")[0].style.position = "";
                _self.element.style.overflow = "";
            }, 5);
        }, 500);

        _self.currentSlide = slidenum;
        updateSliderProgress();
    }

    this.nextSlide = function() {
        this.goToSlide(_self.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(_self.currentSlide -  1);
    }

    //Progress bar
    function updateSliderProgress() {
        _self.progress.style.width = (100 / (_self.activePanes)) * _self.currentSlide + "%";
    }
    this.updateSliderProgress = updateSliderProgress;

    /* Error element */
    this.error = function(msg) {
        _self.activeError = true;
        _self.errorElement.innerHTML = msg;
        _self.errorElement.classList.add("active");
        _self.panes[_self.currentSlide].getElementsByClassName("loading")[0].classList.remove("loading");

        setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        _self.errorElement.classList.remove("active");
        _self.activeError = false;
    }
    this.hideError = hideError;

    function setNoApiError() {
        var noApiErrorElement = document.getElementById("no_api_error");

        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
    }

    /* Network helpers */
    var api_url = "https://api.gieffektivt.no/";
    //var api_url = "http://localhost:3000/";

    this.request = function(endpoint, type, data, cb) {
        var http = new XMLHttpRequest();
        var url = api_url + endpoint;

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

    //UI snazzyness
    function setupSelectOnClick() {
        var elems = _self.panes[_self.panes.length - 1].getElementsByClassName("select-on-click");

        for (var i = 0; i < elems.length; i++) {
            elems[i].addEventListener("click", selectNodeText);
        }
    }

    function selectNodeText(e) {
        e.preventDefault();
        e.stopPropagation();

        var node = this;
 
        if ( document.selection ) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    //Activate UI
    this.show = function() {
        var widget = _self;

        document.body.classList.add("widget-active");
        _self.wrapper.style.zIndex = 100000;

        _self.element.classList.add("active");
        _self.wrapper.classList.add("active");
        var activePane = _self.panes[_self.currentSlide];
        activePane.focus(_self, activePane);

        _self.active = true;

        //User is engaged in form, activate "are you sure you want to leave" prompt on attempt to navigate away
        window.onbeforeunload = function() {
            return true;
        };
    }

    this.close = function() {
        document.body.classList.remove("widget-active");
        _self.element.classList.remove("active");
        _self.wrapper.classList.remove("active");
        _self.element.style.maxHeight = "";

        window.onbeforeunload = null;

        _self.active = false;

        setTimeout(function() {
            _self.wrapper.style.zIndex = -1;
            if (_self.currentSlide == _self.panes.length-1) { 
                _self.goToSlide(0);
                _self.panes[2].classList.remove("hidden");
                document.getElementById("check-select-recommended").click();
            }
        }, 500);
    }  

    /* Return */
    var properties = {
        element: this.element,
        panes: this.panes,
        goToSlide: this.goToSlide,
        nextSlide: this.nextSlide,
        slider: this.slider,
        setsplit: this.setSplitValues,
        show: this.show,
        close: this.close,
        error: this.error,
        request: this.request,
        updateSliderProgress: this.updateSliderProgress,
        postDonation: this.postDonation,
        prevSlide: this.prevSlide,
        hideError: this.hideError,
        setup: this.setup
    }
    return properties;
} 

window.DonationWidget = DonationWidget;

},{"./panes/amount.js":10,"./panes/donation.js":11,"./panes/donor.js":12}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2RlY2ltYWwuanMvZGVjaW1hbC5qcyIsIm5vZGVfbW9kdWxlcy9lbWFpbC12YWxpZGF0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VtYWlsLXZhbGlkYXRpb24vbGliL2VtYWlsLXZhbGlkYXRpb24uanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJzY3JpcHQvbGliL3JvdW5kaW5nLmpzIiwic2NyaXB0L3BhbmVzL2Ftb3VudC5qcyIsInNjcmlwdC9wYW5lcy9kb25hdGlvbi5qcyIsInNjcmlwdC9wYW5lcy9kb25vci5qcyIsInNjcmlwdC93aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvc0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIvKiEgZGVjaW1hbC5qcyB2Ny4zLjAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qcy9MSUNFTkNFICovXHJcbjsoZnVuY3Rpb24gKGdsb2JhbFNjb3BlKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgZGVjaW1hbC5qcyB2Ny4zLjBcclxuICAgKiAgQW4gYXJiaXRyYXJ5LXByZWNpc2lvbiBEZWNpbWFsIHR5cGUgZm9yIEphdmFTY3JpcHQuXHJcbiAgICogIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2RlY2ltYWwuanNcclxuICAgKiAgQ29weXJpZ2h0IChjKSAyMDE3IE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAgICogIE1JVCBMaWNlbmNlXHJcbiAgICovXHJcblxyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRURJVEFCTEUgREVGQVVMVFMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCBtYWduaXR1ZGUuXHJcbiAgICAvLyBUaGUgbGltaXQgb24gdGhlIHZhbHVlIG9mIGB0b0V4cE5lZ2AsIGB0b0V4cFBvc2AsIGBtaW5FYCBhbmQgYG1heEVgLlxyXG4gIHZhciBFWFBfTElNSVQgPSA5ZTE1LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDllMTVcclxuXHJcbiAgICAvLyBUaGUgbGltaXQgb24gdGhlIHZhbHVlIG9mIGBwcmVjaXNpb25gLCBhbmQgb24gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBhcmd1bWVudCB0b1xyXG4gICAgLy8gYHRvRGVjaW1hbFBsYWNlc2AsIGB0b0V4cG9uZW50aWFsYCwgYHRvRml4ZWRgLCBgdG9QcmVjaXNpb25gIGFuZCBgdG9TaWduaWZpY2FudERpZ2l0c2AuXHJcbiAgICBNQVhfRElHSVRTID0gMWU5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMWU5XHJcblxyXG4gICAgLy8gQmFzZSBjb252ZXJzaW9uIGFscGhhYmV0LlxyXG4gICAgTlVNRVJBTFMgPSAnMDEyMzQ1Njc4OWFiY2RlZicsXHJcblxyXG4gICAgLy8gVGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIDEwICgxMDI1IGRpZ2l0cykuXHJcbiAgICBMTjEwID0gJzIuMzAyNTg1MDkyOTk0MDQ1Njg0MDE3OTkxNDU0Njg0MzY0MjA3NjAxMTAxNDg4NjI4NzcyOTc2MDMzMzI3OTAwOTY3NTcyNjA5Njc3MzUyNDgwMjM1OTk3MjA1MDg5NTk4Mjk4MzQxOTY3Nzg0MDQyMjg2MjQ4NjMzNDA5NTI1NDY1MDgyODA2NzU2NjY2Mjg3MzY5MDk4NzgxNjg5NDgyOTA3MjA4MzI1NTU0NjgwODQzNzk5ODk0ODI2MjMzMTk4NTI4MzkzNTA1MzA4OTY1Mzc3NzMyNjI4ODQ2MTYzMzY2MjIyMjg3Njk4MjE5ODg2NzQ2NTQzNjY3NDc0NDA0MjQzMjc0MzY1MTU1MDQ4OTM0MzE0OTM5MzkxNDc5NjE5NDA0NDAwMjIyMTA1MTAxNzE0MTc0ODAwMzY4ODA4NDAxMjY0NzA4MDY4NTU2Nzc0MzIxNjIyODM1NTIyMDExNDgwNDY2MzcxNTY1OTEyMTM3MzQ1MDc0Nzg1Njk0NzY4MzQ2MzYxNjc5MjEwMTgwNjQ0NTA3MDY0ODAwMDI3NzUwMjY4NDkxNjc0NjU1MDU4Njg1NjkzNTY3MzQyMDY3MDU4MTEzNjQyOTIyNDU1NDQwNTc1ODkyNTcyNDIwODI0MTMxNDY5NTY4OTAxNjc1ODk0MDI1Njc3NjMxMTM1NjkxOTI5MjAzMzM3NjU4NzE0MTY2MDIzMDEwNTcwMzA4OTYzNDU3MjA3NTQ0MDM3MDg0NzQ2OTk0MDE2ODI2OTI4MjgwODQ4MTE4NDI4OTMxNDg0ODUyNDk0ODY0NDg3MTkyNzgwOTY3NjI3MTI3NTc3NTM5NzAyNzY2ODYwNTk1MjQ5NjcxNjY3NDE4MzQ4NTcwNDQyMjUwNzE5Nzk2NTAwNDcxNDk1MTA1MDQ5MjIxNDc3NjU2NzYzNjkzODY2Mjk3Njk3OTUyMjExMDcxODI2NDU0OTczNDc3MjY2MjQyNTcwOTQyOTMyMjU4Mjc5ODUwMjU4NTUwOTc4NTI2NTM4MzIwNzYwNjcyNjMxNzE2NDMwOTUwNTk5NTA4NzgwNzUyMzcxMDMzMzEwMTE5Nzg1NzU0NzMzMTU0MTQyMTgwODQyNzU0Mzg2MzU5MTc3ODExNzA1NDMwOTgyNzQ4MjM4NTA0NTY0ODAxOTA5NTYxMDI5OTI5MTgyNDMxODIzNzUyNTM1NzcwOTc1MDUzOTU2NTE4NzY5NzUxMDM3NDk3MDg4ODY5MjE4MDIwNTE4OTMzOTUwNzIzODUzOTIwNTE0NDYzNDE5NzI2NTI4NzI4Njk2NTExMDg2MjU3MTQ5MjE5ODg0OTk3ODc0ODg3Mzc3MTM0NTY4NjIwOTE2NzA1OCcsXHJcblxyXG4gICAgLy8gUGkgKDEwMjUgZGlnaXRzKS5cclxuICAgIFBJID0gJzMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4OScsXHJcblxyXG5cclxuICAgIC8vIFRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBvZiB0aGUgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICAgIERlY2ltYWwgPSB7XHJcblxyXG4gICAgICAvLyBUaGVzZSB2YWx1ZXMgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHN0YXRlZCByYW5nZXMgKGluY2x1c2l2ZSkuXHJcbiAgICAgIC8vIE1vc3Qgb2YgdGhlc2UgdmFsdWVzIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIHRoZSBgRGVjaW1hbC5jb25maWdgIG1ldGhvZC5cclxuXHJcbiAgICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgICAgLy8gRS5nLiBgRGVjaW1hbC5jb25maWcoeyBwcmVjaXNpb246IDIwIH0pO2BcclxuICAgICAgcHJlY2lzaW9uOiAyMCwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhfRElHSVRTXHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFJPVU5EX1VQICAgICAgICAgMCBBd2F5IGZyb20gemVyby5cclxuICAgICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgICAgLy8gUk9VTkRfQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9GTE9PUiAgICAgIDMgVG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgICAgLy8gUk9VTkRfSEFMRl9FVkVOICA2IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIGV2ZW4gbmVpZ2hib3VyLlxyXG4gICAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9IQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBFLmcuXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gNDtgXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gRGVjaW1hbC5ST1VORF9IQUxGX1VQO2BcclxuICAgICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgICAvLyBUaGUgbW9kdWxvIG1vZGUgdXNlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBtb2R1bHVzOiBhIG1vZCBuLlxyXG4gICAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVVAgICAgICAgICAwIFRoZSByZW1haW5kZXIgaXMgcG9zaXRpdmUgaWYgdGhlIGRpdmlkZW5kIGlzIG5lZ2F0aXZlLCBlbHNlIGlzIG5lZ2F0aXZlLlxyXG4gICAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAgIC8vIEZMT09SICAgICAgMyBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpc29yIChQeXRob24gJSkuXHJcbiAgICAgIC8vIEhBTEZfRVZFTiAgNiBUaGUgSUVFRSA3NTQgcmVtYWluZGVyIGZ1bmN0aW9uLlxyXG4gICAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRydW5jYXRlZCBkaXZpc2lvbiAoMSksIGZsb29yZWQgZGl2aXNpb24gKDMpLCB0aGUgSUVFRSA3NTQgcmVtYWluZGVyICg2KSwgYW5kIEV1Y2xpZGlhblxyXG4gICAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAgIC8vIGJlIHVzZWQsIGJ1dCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgICAgbW9kdWxvOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5XHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC03XHJcbiAgICAgIHRvRXhwTmVnOiAtNywgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLUVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMjFcclxuICAgICAgdG9FeHBQb3M6ICAyMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBFWFBfTElNSVRcclxuXHJcbiAgICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtMzI0ICAoNWUtMzI0KVxyXG4gICAgICBtaW5FOiAtRVhQX0xJTUlULCAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgICBtYXhFOiBFWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgICBjcnlwdG86IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlL2ZhbHNlXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gICAgaW5leGFjdCwgbm9Db25mbGljdCwgcXVhZHJhbnQsXHJcbiAgICBleHRlcm5hbCA9IHRydWUsXHJcblxyXG4gICAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgICBpbnZhbGlkQXJndW1lbnQgPSBkZWNpbWFsRXJyb3IgKyAnSW52YWxpZCBhcmd1bWVudDogJyxcclxuICAgIHByZWNpc2lvbkxpbWl0RXhjZWVkZWQgPSBkZWNpbWFsRXJyb3IgKyAnUHJlY2lzaW9uIGxpbWl0IGV4Y2VlZGVkJyxcclxuICAgIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcblxyXG4gICAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuICAgIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgICBpc0JpbmFyeSA9IC9eMGIoWzAxXSsoXFwuWzAxXSopP3xcXC5bMDFdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gICAgaXNIZXggPSAvXjB4KFswLTlhLWZdKyhcXC5bMC05YS1mXSopP3xcXC5bMC05YS1mXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzRGVjaW1hbCA9IC9eKFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaSxcclxuXHJcbiAgICBCQVNFID0gMWU3LFxyXG4gICAgTE9HX0JBU0UgPSA3LFxyXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXHJcblxyXG4gICAgTE4xMF9QUkVDSVNJT04gPSBMTjEwLmxlbmd0aCAtIDEsXHJcbiAgICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAgIC8vIERlY2ltYWwucHJvdG90eXBlIG9iamVjdFxyXG4gICAgUCA9IHt9O1xyXG5cclxuXHJcbiAgLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgICBhYnNcclxuICAgKiAgY2VpbFxyXG4gICAqICBjb21wYXJlZFRvICAgICAgICAgICAgICAgIGNtcFxyXG4gICAqICBjb3NpbmUgICAgICAgICAgICAgICAgICAgIGNvc1xyXG4gICAqICBjdWJlUm9vdCAgICAgICAgICAgICAgICAgIGNicnRcclxuICAgKiAgZGVjaW1hbFBsYWNlcyAgICAgICAgICAgICBkcFxyXG4gICAqICBkaXZpZGVkQnkgICAgICAgICAgICAgICAgIGRpdlxyXG4gICAqICBkaXZpZGVkVG9JbnRlZ2VyQnkgICAgICAgIGRpdlRvSW50XHJcbiAgICogIGVxdWFscyAgICAgICAgICAgICAgICAgICAgZXFcclxuICAgKiAgZmxvb3JcclxuICAgKiAgZ3JlYXRlclRoYW4gICAgICAgICAgICAgICBndFxyXG4gICAqICBncmVhdGVyVGhhbk9yRXF1YWxUbyAgICAgIGd0ZVxyXG4gICAqICBoeXBlcmJvbGljQ29zaW5lICAgICAgICAgIGNvc2hcclxuICAgKiAgaHlwZXJib2xpY1NpbmUgICAgICAgICAgICBzaW5oXHJcbiAgICogIGh5cGVyYm9saWNUYW5nZW50ICAgICAgICAgdGFuaFxyXG4gICAqICBpbnZlcnNlQ29zaW5lICAgICAgICAgICAgIGFjb3NcclxuICAgKiAgaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgICBhY29zaFxyXG4gICAqICBpbnZlcnNlSHlwZXJib2xpY1NpbmUgICAgIGFzaW5oXHJcbiAgICogIGludmVyc2VIeXBlcmJvbGljVGFuZ2VudCAgYXRhbmhcclxuICAgKiAgaW52ZXJzZVNpbmUgICAgICAgICAgICAgICBhc2luXHJcbiAgICogIGludmVyc2VUYW5nZW50ICAgICAgICAgICAgYXRhblxyXG4gICAqICBpc0Zpbml0ZVxyXG4gICAqICBpc0ludGVnZXIgICAgICAgICAgICAgICAgIGlzSW50XHJcbiAgICogIGlzTmFOXHJcbiAgICogIGlzTmVnYXRpdmUgICAgICAgICAgICAgICAgaXNOZWdcclxuICAgKiAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICBpc1Bvc1xyXG4gICAqICBpc1plcm9cclxuICAgKiAgbGVzc1RoYW4gICAgICAgICAgICAgICAgICBsdFxyXG4gICAqICBsZXNzVGhhbk9yRXF1YWxUbyAgICAgICAgIGx0ZVxyXG4gICAqICBsb2dhcml0aG0gICAgICAgICAgICAgICAgIGxvZ1xyXG4gICAqICBbbWF4aW11bV0gICAgICAgICAgICAgICAgIFttYXhdXHJcbiAgICogIFttaW5pbXVtXSAgICAgICAgICAgICAgICAgW21pbl1cclxuICAgKiAgbWludXMgICAgICAgICAgICAgICAgICAgICBzdWJcclxuICAgKiAgbW9kdWxvICAgICAgICAgICAgICAgICAgICBtb2RcclxuICAgKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgICBleHBcclxuICAgKiAgbmF0dXJhbExvZ2FyaXRobSAgICAgICAgICBsblxyXG4gICAqICBuZWdhdGVkICAgICAgICAgICAgICAgICAgIG5lZ1xyXG4gICAqICBwbHVzICAgICAgICAgICAgICAgICAgICAgIGFkZFxyXG4gICAqICBwcmVjaXNpb24gICAgICAgICAgICAgICAgIHNkXHJcbiAgICogIHJvdW5kXHJcbiAgICogIHNpbmUgICAgICAgICAgICAgICAgICAgICAgc2luXHJcbiAgICogIHNxdWFyZVJvb3QgICAgICAgICAgICAgICAgc3FydFxyXG4gICAqICB0YW5nZW50ICAgICAgICAgICAgICAgICAgIHRhblxyXG4gICAqICB0aW1lcyAgICAgICAgICAgICAgICAgICAgIG11bFxyXG4gICAqICB0b0JpbmFyeVxyXG4gICAqICB0b0RlY2ltYWxQbGFjZXMgICAgICAgICAgIHRvRFBcclxuICAgKiAgdG9FeHBvbmVudGlhbFxyXG4gICAqICB0b0ZpeGVkXHJcbiAgICogIHRvRnJhY3Rpb25cclxuICAgKiAgdG9IZXhhZGVjaW1hbCAgICAgICAgICAgICB0b0hleFxyXG4gICAqICB0b05lYXJlc3RcclxuICAgKiAgdG9OdW1iZXJcclxuICAgKiAgdG9PY3RhbFxyXG4gICAqICB0b1Bvd2VyICAgICAgICAgICAgICAgICAgIHBvd1xyXG4gICAqICB0b1ByZWNpc2lvblxyXG4gICAqICB0b1NpZ25pZmljYW50RGlnaXRzICAgICAgIHRvU0RcclxuICAgKiAgdG9TdHJpbmdcclxuICAgKiAgdHJ1bmNhdGVkICAgICAgICAgICAgICAgICB0cnVuY1xyXG4gICAqICB2YWx1ZU9mICAgICAgICAgICAgICAgICAgIHRvSlNPTlxyXG4gICAqL1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgaWYgKHgucyA8IDApIHgucyA9IDE7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gICAqIGRpcmVjdGlvbiBvZiBwb3NpdGl2ZSBJbmZpbml0eS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY2VpbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMik7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuXHJcbiAgICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAgICogIC0xICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAgICogICAwICAgIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSB2YWx1ZSxcclxuICAgKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBpLCBqLCB4ZEwsIHlkTCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICB5ZCA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmQsXHJcbiAgICAgIHhzID0geC5zLFxyXG4gICAgICB5cyA9IHkucztcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOIG9yIMKxSW5maW5pdHk/XHJcbiAgICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgICByZXR1cm4gIXhzIHx8ICF5cyA/IE5hTiA6IHhzICE9PSB5cyA/IHhzIDogeGQgPT09IHlkID8gMCA6ICF4ZCBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFaXRoZXIgemVybz9cclxuICAgIGlmICgheGRbMF0gfHwgIXlkWzBdKSByZXR1cm4geGRbMF0gPyB4cyA6IHlkWzBdID8gLXlzIDogMDtcclxuXHJcbiAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gICAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgICBpZiAoeC5lICE9PSB5LmUpIHJldHVybiB4LmUgPiB5LmUgXiB4cyA8IDAgPyAxIDogLTE7XHJcblxyXG4gICAgeGRMID0geGQubGVuZ3RoO1xyXG4gICAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAgIC8vIENvbXBhcmUgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICAgIGlmICh4ZFtpXSAhPT0geWRbaV0pIHJldHVybiB4ZFtpXSA+IHlkW2ldIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICAgIHJldHVybiB4ZEwgPT09IHlkTCA/IDAgOiB4ZEwgPiB5ZEwgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLTEsIDFdXHJcbiAgICpcclxuICAgKiBjb3MoMCkgICAgICAgICA9IDFcclxuICAgKiBjb3MoLTApICAgICAgICA9IDFcclxuICAgKiBjb3MoSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAgICogY29zKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY29zaW5lID0gUC5jb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmQpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgICBpZiAoIXguZFswXSkgcmV0dXJuIG5ldyBDdG9yKDEpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqICBjYnJ0KDApICA9ICAwXHJcbiAgICogIGNicnQoLTApID0gLTBcclxuICAgKiAgY2JydCgxKSAgPSAgMVxyXG4gICAqICBjYnJ0KC0xKSA9IC0xXHJcbiAgICogIGNicnQoTikgID0gIE5cclxuICAgKiAgY2JydCgtSSkgPSAtSVxyXG4gICAqICBjYnJ0KEkpICA9ICBJXHJcbiAgICpcclxuICAgKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlLCBtLCBuLCByLCByZXAsIHMsIHNkLCB0LCB0MywgdDNwbHVzeCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgIHMgPSB4LnMgKiBNYXRoLnBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAgIC8vIE1hdGguY2JydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgICAgLy8gUGFzcyB4IHRvIE1hdGgucG93IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBlID0geC5lO1xyXG5cclxuICAgICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgICBpZiAocyA9IChlIC0gbi5sZW5ndGggKyAxKSAlIDMpIG4gKz0gKHMgPT0gMSB8fCBzID09IC0yID8gJzAnIDogJzAwJyk7XHJcbiAgICAgIHMgPSBNYXRoLnBvdyhuLCAxIC8gMyk7XHJcblxyXG4gICAgICAvLyBSYXJlbHksIGUgbWF5IGJlIG9uZSBsZXNzIHRoYW4gdGhlIHJlc3VsdCBleHBvbmVudCB2YWx1ZS5cclxuICAgICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMykgLSAoZSAlIDMgPT0gKGUgPCAwID8gLTEgOiAyKSk7XHJcblxyXG4gICAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHIgPSBuZXcgQ3RvcihuKTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gICAgLy8gSGFsbGV5J3MgbWV0aG9kLlxyXG4gICAgLy8gVE9ETz8gQ29tcGFyZSBOZXd0b24ncyBtZXRob2QuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIHQgPSByO1xyXG4gICAgICB0MyA9IHQudGltZXModCkudGltZXModCk7XHJcbiAgICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xyXG4gICAgICByID0gZGl2aWRlKHQzcGx1c3gucGx1cyh4KS50aW1lcyh0KSwgdDNwbHVzeC5wbHVzKHQzKSwgc2QgKyAyLCAxKTtcclxuXHJcbiAgICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yIDQ5OTlcclxuICAgICAgICAvLyAsIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgICBpZiAobiA9PSAnOTk5OScgfHwgIXJlcCAmJiBuID09ICc0OTk5Jykge1xyXG5cclxuICAgICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZSBleGFjdCByZXN1bHQgYXMgdGhlXHJcbiAgICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgICBpZiAoIXJlcCkge1xyXG4gICAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2QgKz0gNDtcclxuICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGFuIGV4YWN0IHJlc3VsdC5cclxuICAgICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgICBtID0gIXIudGltZXMocikudGltZXMocikuZXEoeCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShyLCBlLCBDdG9yLnJvdW5kaW5nLCBtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3LFxyXG4gICAgICBkID0gdGhpcy5kLFxyXG4gICAgICBuID0gTmFOO1xyXG5cclxuICAgIGlmIChkKSB7XHJcbiAgICAgIHcgPSBkLmxlbmd0aCAtIDE7XHJcbiAgICAgIG4gPSAodyAtIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkpICogTE9HX0JBU0U7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICAgIHcgPSBkW3ddO1xyXG4gICAgICBpZiAodykgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKSBuLS07XHJcbiAgICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG47XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gLyAwID0gSVxyXG4gICAqICBuIC8gTiA9IE5cclxuICAgKiAgbiAvIEkgPSAwXHJcbiAgICogIDAgLyBuID0gMFxyXG4gICAqICAwIC8gMCA9IE5cclxuICAgKiAgMCAvIE4gPSBOXHJcbiAgICogIDAgLyBJID0gMFxyXG4gICAqICBOIC8gbiA9IE5cclxuICAgKiAgTiAvIDAgPSBOXHJcbiAgICogIE4gLyBOID0gTlxyXG4gICAqICBOIC8gSSA9IE5cclxuICAgKiAgSSAvIG4gPSBJXHJcbiAgICogIEkgLyAwID0gSVxyXG4gICAqICBJIC8gTiA9IE5cclxuICAgKiAgSSAvIEkgPSBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZGl2aWRlZEJ5ID0gUC5kaXYgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIGRpdmlkZSh0aGlzLCBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih5KSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludGVnZXIgcGFydCBvZiBkaXZpZGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsXHJcbiAgICogYnkgdGhlIHZhbHVlIG9mIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXAoeSkgPT09IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gICAqIGRpcmVjdGlvbiBvZiBuZWdhdGl2ZSBJbmZpbml0eS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZmxvb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm5cclxuICAgKiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZ3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA+IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCxcclxuICAgKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBrID0gdGhpcy5jbXAoeSk7XHJcbiAgICByZXR1cm4gayA9PSAxIHx8IGsgPT09IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWzEsIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogY29zaCh4KSA9IDEgKyB4XjIvMiEgKyB4XjQvNCEgKyB4XjYvNiEgKyAuLi5cclxuICAgKlxyXG4gICAqIGNvc2goMCkgICAgICAgICA9IDFcclxuICAgKiBjb3NoKC0wKSAgICAgICAgPSAxXHJcbiAgICogY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBjb3NoKC1JbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gICAqIGNvc2goTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogIHggICAgICAgIHRpbWUgdGFrZW4gKG1zKSAgIHJlc3VsdFxyXG4gICAqIDEwMDAgICAgICA5ICAgICAgICAgICAgICAgICA5Ljg1MDM1NTU3MDA4NTIzNDk2OTRlKzQzM1xyXG4gICAqIDEwMDAwICAgICAyNSAgICAgICAgICAgICAgICA0LjQwMzQwOTExMjgzMTQ2MDc5MzZlKzQzNDJcclxuICAgKiAxMDAwMDAgICAgMTcxICAgICAgICAgICAgICAgMS40MDMzMzE2ODAyMTMwNjE1ODk3ZSs0MzQyOVxyXG4gICAqIDEwMDAwMDAgICAzODE3ICAgICAgICAgICAgICAxLjUxNjYwNzY5ODQwMTA0Mzc3MjVlKzQzNDI5NFxyXG4gICAqIDEwMDAwMDAwICBhYmFuZG9uZWQgYWZ0ZXIgMiBtaW51dGUgd2FpdFxyXG4gICAqXHJcbiAgICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBjb3NoKHgpID0gMC41ICogKGV4cCh4KSArIGV4cCgteCkpXHJcbiAgICpcclxuICAgKi9cclxuICBQLmh5cGVyYm9saWNDb3NpbmUgPSBQLmNvc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgb25lID0gbmV3IEN0b3IoMSk7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMgPyAxIC8gMCA6IE5hTik7XHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG9uZTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gMSAtIDhjb3NeMih4KSArIDhjb3NeNCh4KSArIDFcclxuICAgIC8vIGkuZS4gY29zKHgpID0gMSAtIGNvc14yKHgvNCkoOCAtIDhjb3NeMih4LzQpKVxyXG5cclxuICAgIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIC8vIFRPRE8/IEVzdGltYXRpb24gcmV1c2VkIGZyb20gY29zaW5lKCkgYW5kIG1heSBub3QgYmUgb3B0aW1hbCBoZXJlLlxyXG4gICAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XHJcbiAgICAgIG4gPSBNYXRoLnBvdyg0LCAtaykudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSAxNjtcclxuICAgICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICAgIH1cclxuXHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMobiksIG5ldyBDdG9yKDEpLCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIGNvc2gyX3gsXHJcbiAgICAgIGkgPSBrLFxyXG4gICAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gICAgZm9yICg7IGktLTspIHtcclxuICAgICAgY29zaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBzaW5oKHgpID0geCArIHheMy8zISArIHheNS81ISArIHheNy83ISArIC4uLlxyXG4gICAqXHJcbiAgICogc2luaCgwKSAgICAgICAgID0gMFxyXG4gICAqIHNpbmgoLTApICAgICAgICA9IC0wXHJcbiAgICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICAgKiBzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqIHggICAgICAgIHRpbWUgdGFrZW4gKG1zKVxyXG4gICAqIDEwICAgICAgIDIgbXNcclxuICAgKiAxMDAgICAgICA1IG1zXHJcbiAgICogMTAwMCAgICAgMTQgbXNcclxuICAgKiAxMDAwMCAgICA4MiBtc1xyXG4gICAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICAgKiAyMDAwMDAgICAyNjEzIG1zXHJcbiAgICogMzAwMDAwICAgNTQwNyBtc1xyXG4gICAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICAgKiA1MDAwMDAgICAxMzAyNiBtcyAgICAgICAgICA4LjcwODA2NDM2MTI3MTgwODQxMjllKzIxNzE0NlxyXG4gICAqIDEwMDAwMDAgIDQ4NTQzIG1zXHJcbiAgICpcclxuICAgKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIHNpbmgoeCkgPSAwLjUgKiAoZXhwKHgpIC0gZXhwKC14KSlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY1NpbmUgPSBQLnNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaywgcHIsIHJtLCBsZW4sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIGlmIChsZW4gPCAzKSB7XHJcbiAgICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQWx0ZXJuYXRpdmUgYXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDN4KSA9IHNpbmgoeCkoMyArIDRzaW5oXjIoeCkpXHJcbiAgICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgICAvLyAzIG11bHRpcGxpY2F0aW9ucyBhbmQgMSBhZGRpdGlvblxyXG5cclxuICAgICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDV4KSA9IHNpbmgoeCkoNSArIHNpbmheMih4KSgyMCArIDE2c2luaF4yKHgpKSlcclxuICAgICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgICAvLyA0IG11bHRpcGxpY2F0aW9ucyBhbmQgMiBhZGRpdGlvbnNcclxuXHJcbiAgICAgIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgICAgIHggPSB4LnRpbWVzKE1hdGgucG93KDUsIC1rKSk7XHJcblxyXG4gICAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xyXG5cclxuICAgICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgICAgZDUgPSBuZXcgQ3Rvcig1KSxcclxuICAgICAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgICBmb3IgKDsgay0tOykge1xyXG4gICAgICAgIHNpbmgyX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgcHIsIHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy0xLCAxXVxyXG4gICAqXHJcbiAgICogdGFuaCh4KSA9IHNpbmgoeCkgLyBjb3NoKHgpXHJcbiAgICpcclxuICAgKiB0YW5oKDApICAgICAgICAgPSAwXHJcbiAgICogdGFuaCgtMCkgICAgICAgID0gLTBcclxuICAgKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAgICogdGFuaCgtSW5maW5pdHkpID0gLTFcclxuICAgKiB0YW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY1RhbmdlbnQgPSBQLnRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDc7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICAgKiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstMSwgMV1cclxuICAgKiBSYW5nZTogWzAsIHBpXVxyXG4gICAqXHJcbiAgICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAgICpcclxuICAgKiBhY29zKDApICAgICAgID0gcGkvMlxyXG4gICAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAgICogYWNvcygxKSAgICAgICA9IDBcclxuICAgKiBhY29zKC0xKSAgICAgID0gcGlcclxuICAgKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gICAqIGFjb3MoLTEvMikgICAgPSAyKnBpLzNcclxuICAgKiBhY29zKHx4fCA+IDEpID0gTmFOXHJcbiAgICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhhbGZQaSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBrID0geC5hYnMoKS5jbXAoMSksXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoayAhPT0gLTEpIHtcclxuICAgICAgcmV0dXJuIGsgPT09IDBcclxuICAgICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICAgID8geC5pc05lZygpID8gZ2V0UGkoQ3RvciwgcHIsIHJtKSA6IG5ldyBDdG9yKDApXHJcbiAgICAgICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSB4LmFzaW4oKTtcclxuICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gaGFsZlBpLm1pbnVzKHgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBpbiByYWRpYW5zIG9mIHRoZVxyXG4gICAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWzEsIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbMCwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBhY29zaCh4KSA9IGxuKHggKyBzcXJ0KHheMiAtIDEpKVxyXG4gICAqXHJcbiAgICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKE5hTikgICAgICAgPSBOYU5cclxuICAgKiBhY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAgICogYWNvc2goMCkgICAgICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKC0wKSAgICAgICAgPSBOYU5cclxuICAgKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gICAqIGFjb3NoKC0xKSAgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgPSBQLmFjb3NoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICh4Lmx0ZSgxKSkgcmV0dXJuIG5ldyBDdG9yKHguZXEoMSkgPyAwIDogTmFOKTtcclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LmxuKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZVxyXG4gICAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogYXNpbmgoeCkgPSBsbih4ICsgc3FydCh4XjIgKyAxKSlcclxuICAgKlxyXG4gICAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKiBhc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBhc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAgICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICAgKiBhc2luaCgtMCkgICAgICAgID0gLTBcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUh5cGVyYm9saWNTaW5lID0gUC5hc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyAyICogTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDY7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgeCA9IHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LmxuKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gICAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy0xLCAxXVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAgICpcclxuICAgKiBhdGFuaCh8eHwgPiAxKSAgID0gTmFOXHJcbiAgICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqIGF0YW5oKEluZmluaXR5KSAgPSBOYU5cclxuICAgKiBhdGFuaCgtSW5maW5pdHkpID0gTmFOXHJcbiAgICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICAgKiBhdGFuaCgtMCkgICAgICAgID0gLTBcclxuICAgKiBhdGFuaCgxKSAgICAgICAgID0gSW5maW5pdHlcclxuICAgKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLCB3cHIsIHhzZCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmICh4LmUgPj0gMCkgcmV0dXJuIG5ldyBDdG9yKHguYWJzKCkuZXEoMSkgPyB4LnMgLyAwIDogeC5pc1plcm8oKSA/IHggOiBOYU4pO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB4c2QgPSB4LnNkKCk7XHJcblxyXG4gICAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSB4c2QgLSB4LmU7XHJcblxyXG4gICAgeCA9IGRpdmlkZSh4LnBsdXMoMSksIG5ldyBDdG9yKDEpLm1pbnVzKHgpLCB3cHIgKyBwciwgMSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5sbigpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIHgudGltZXMoMC41KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSAoaW52ZXJzZSBzaW5lKSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICAgKlxyXG4gICAqIGFzaW4oeCkgPSAyKmF0YW4oeC8oMSArIHNxcnQoMSAtIHheMikpKVxyXG4gICAqXHJcbiAgICogYXNpbigwKSAgICAgICA9IDBcclxuICAgKiBhc2luKC0wKSAgICAgID0gLTBcclxuICAgKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gICAqIGFzaW4oLTEvMikgICAgPSAtcGkvNlxyXG4gICAqIGFzaW4oMSkgICAgICAgPSBwaS8yXHJcbiAgICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAgICogYXNpbih8eHwgPiAxKSA9IE5hTlxyXG4gICAqIGFzaW4oTmFOKSAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2YgVGF5bG9yIHNlcmllcy5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZVNpbmUgPSBQLmFzaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGFsZlBpLCBrLFxyXG4gICAgICBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIGsgPSB4LmFicygpLmNtcCgxKTtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKGsgIT09IC0xKSB7XHJcblxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcbiAgICAgICAgaGFsZlBpLnMgPSB4LnM7XHJcbiAgICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPPyBTcGVjaWFsIGNhc2UgYXNpbigxLzIpID0gcGkvNiBhbmQgYXNpbigtMS8yKSA9IC1waS82XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5kaXYobmV3IEN0b3IoMSkubWludXMoeC50aW1lcyh4KSkuc3FydCgpLnBsdXMoMSkpLmF0YW4oKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LnRpbWVzKDIpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IChpbnZlcnNlIHRhbmdlbnQpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlXHJcbiAgICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gICAqXHJcbiAgICogYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICAgKlxyXG4gICAqIGF0YW4oMCkgICAgICAgICA9IDBcclxuICAgKiBhdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICAgKiBhdGFuKC0xKSAgICAgICAgPSAtcGkvNFxyXG4gICAqIGF0YW4oSW5maW5pdHkpICA9IHBpLzJcclxuICAgKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gICAqIGF0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlVGFuZ2VudCA9IFAuYXRhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpLCBqLCBrLCBuLCBweCwgdCwgciwgd3ByLCB4MixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHtcclxuICAgICAgaWYgKCF4LnMpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICAgIHIucyA9IHgucztcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh4LmlzWmVybygpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICAgIH0gZWxzZSBpZiAoeC5hYnMoKS5lcSgxKSAmJiBwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XHJcbiAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjI1KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICAvLyBUT0RPPyBpZiAoeCA+PSAxICYmIHByIDw9IFBJX1BSRUNJU0lPTikgYXRhbih4KSA9IGhhbGZQaSAqIHgucyAtIGF0YW4oMSAvIHgpO1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgLy8gRW5zdXJlIHx4fCA8IDAuNDJcclxuICAgIC8vIGF0YW4oeCkgPSAyICogYXRhbih4IC8gKDEgKyBzcXJ0KDEgKyB4XjIpKSlcclxuXHJcbiAgICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICAgIGZvciAoaSA9IGs7IGk7IC0taSkgeCA9IHguZGl2KHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cygxKSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICAgIG4gPSAxO1xyXG4gICAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gICAgciA9IG5ldyBDdG9yKHgpO1xyXG4gICAgcHggPSB4O1xyXG5cclxuICAgIC8vIGF0YW4oeCkgPSB4IC0geF4zLzMgKyB4XjUvNSAtIHheNy83ICsgLi4uXHJcbiAgICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICAgIHB4ID0gcHgudGltZXMoeDIpO1xyXG4gICAgICB0ID0gci5taW51cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgICAgciA9IHQucGx1cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgICBpZiAoci5kW2pdICE9PSB2b2lkIDApIGZvciAoaSA9IGo7IHIuZFtpXSA9PT0gdC5kW2ldICYmIGktLTspO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChrKSByID0gci50aW1lcygyIDw8IChrIC0gMSkpO1xyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLmQ7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBhbiBpbnRlZ2VyLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc0ludGVnZXIgPSBQLmlzSW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5kICYmIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmQubGVuZ3RoIC0gMjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIE5hTiwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMucztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnMgPCAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgcG9zaXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzUG9zaXRpdmUgPSBQLmlzUG9zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucyA+IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc1plcm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5sZXNzVGhhbk9yRXF1YWxUbyA9IFAubHRlID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSBsb2dhcml0aG0gb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0byB0aGUgc3BlY2lmaWVkIGJhc2UsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogSWYgbm8gYmFzZSBpcyBzcGVjaWZpZWQsIHJldHVybiBsb2dbMTBdKGFyZykuXHJcbiAgICpcclxuICAgKiBsb2dbYmFzZV0oYXJnKSA9IGxuKGFyZykgLyBsbihiYXNlKVxyXG4gICAqXHJcbiAgICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAgICogb3RoZXJ3aXNlOlxyXG4gICAqXHJcbiAgICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAgICogcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OTk5OTk5OTk5OTkgb3IgWzUwXTAwMDAwMDAwMDAwMDAwLiBJbiB0aGF0IGNhc2UsIHRoZSBtYXhpbXVtIGVycm9yXHJcbiAgICogYmV0d2VlbiB0aGUgcmVzdWx0IGFuZCB0aGUgY29ycmVjdGx5IHJvdW5kZWQgcmVzdWx0IHdpbGwgYmUgb25lIHVscCAodW5pdCBpbiB0aGUgbGFzdCBwbGFjZSkuXHJcbiAgICpcclxuICAgKiBsb2dbLWJdKGEpICAgICAgID0gTmFOXHJcbiAgICogbG9nWzBdKGEpICAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICAgKiBsb2dbTmFOXShhKSAgICAgID0gTmFOXHJcbiAgICogbG9nW0luZmluaXR5XShhKSA9IE5hTlxyXG4gICAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiBsb2dbYl0oLTApICAgICAgID0gLUluZmluaXR5XHJcbiAgICogbG9nW2JdKC1hKSAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAgICogbG9nW2JdKEluZmluaXR5KSA9IEluZmluaXR5XHJcbiAgICogbG9nW2JdKE5hTikgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogW2Jhc2VdIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlIG9mIHRoZSBsb2dhcml0aG0uXHJcbiAgICpcclxuICAgKi9cclxuICBQLmxvZ2FyaXRobSA9IFAubG9nID0gZnVuY3Rpb24gKGJhc2UpIHtcclxuICAgIHZhciBpc0Jhc2UxMCwgZCwgZGVub21pbmF0b3IsIGssIGluZiwgbnVtLCBzZCwgcixcclxuICAgICAgYXJnID0gdGhpcyxcclxuICAgICAgQ3RvciA9IGFyZy5jb25zdHJ1Y3RvcixcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgICBndWFyZCA9IDU7XHJcblxyXG4gICAgLy8gRGVmYXVsdCBiYXNlIGlzIDEwLlxyXG4gICAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgICBiYXNlID0gbmV3IEN0b3IoMTApO1xyXG4gICAgICBpc0Jhc2UxMCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYXNlID0gbmV3IEN0b3IoYmFzZSk7XHJcbiAgICAgIGQgPSBiYXNlLmQ7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgICAgaWYgKGJhc2UucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYmFzZS5lcSgxKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICBpc0Jhc2UxMCA9IGJhc2UuZXEoMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGQgPSBhcmcuZDtcclxuXHJcbiAgICAvLyBJcyBhcmcgbmVnYXRpdmUsIG5vbi1maW5pdGUsIDAgb3IgMT9cclxuICAgIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcihkICYmICFkWzBdID8gLTEgLyAwIDogYXJnLnMgIT0gMSA/IE5hTiA6IGQgPyAwIDogMSAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAgIC8vIGludGVnZXIgcG93ZXIgb2YgMTAuXHJcbiAgICBpZiAoaXNCYXNlMTApIHtcclxuICAgICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGluZiA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgICBpbmYgPSBrICE9PSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHNkID0gcHIgKyBndWFyZDtcclxuICAgIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG5cclxuICAgIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIDUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgLy8gSWYgYXQgYSByb3VuZGluZyBib3VuZGFyeSwgaS5lLiB0aGUgcmVzdWx0J3Mgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCxcclxuICAgIC8vIGNhbGN1bGF0ZSAxMCBmdXJ0aGVyIGRpZ2l0cy5cclxuICAgIC8vXHJcbiAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIGtub3duIHRvIGhhdmUgYW4gaW5maW5pdGUgZGVjaW1hbCBleHBhbnNpb24sIHJlcGVhdCB0aGlzIHVudGlsIGl0IGlzIGNsZWFyXHJcbiAgICAvLyB0aGF0IHRoZSByZXN1bHQgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGJvdW5kYXJ5LiBPdGhlcndpc2UsIGlmIGFmdGVyIGNhbGN1bGF0aW5nIHRoZSAxMFxyXG4gICAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gICAgLy8gQWxzbyBhc3N1bWUgdGhlIHJlc3VsdCBpcyBleGFjdCBpZiB0aGUgbGFzdCAxNCBhcmUgemVyby5cclxuICAgIC8vXHJcbiAgICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gICAgLy8gbG9nWzEwNDg1NzZdKDQ1MDM1OTk2MjczNzA1MDIpID0gMi42MDAwMDAwMDAwMDAwMDAwOTYxMDI3OTUxMTQ0NDc0Ni4uLlxyXG4gICAgLy8gVGhlIGFib3ZlIHJlc3VsdCBjb3JyZWN0bHkgcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbCBwbGFjZSBzaG91bGQgYmUgMi43LCBidXQgaXRcclxuICAgIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgICAvLyB0aGUgZXhhY3QgcmVzdWx0IHdvdWxkIGJlIGFzc3VtZWQgdG8gYmUgMi42LCB3aGljaCByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsXHJcbiAgICAvLyBwbGFjZSBpcyBzdGlsbCAyLjYuXHJcbiAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgc2QgKz0gMTA7XHJcbiAgICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG4gICAgICAgIHIgPSBkaXZpZGUobnVtLCBkZW5vbWluYXRvciwgc2QsIDEpO1xyXG5cclxuICAgICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQsIGFzIHRoZSBmaXJzdCBtYXkgYmUgNC5cclxuICAgICAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShrICsgMSwgayArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrICs9IDEwLCBybSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzIGFuZCB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICBQLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLmNvbnN0cnVjdG9yLCBhcmd1bWVudHMsICdsdCcpO1xyXG4gIH07XHJcbiAgICovXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMgYW5kIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gIFAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcmd1bWVudHMsIHRoaXMpO1xyXG4gICAgcmV0dXJuIG1heE9yTWluKHRoaXMuY29uc3RydWN0b3IsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbiAgfTtcclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gLSAwID0gblxyXG4gICAqICBuIC0gTiA9IE5cclxuICAgKiAgbiAtIEkgPSAtSVxyXG4gICAqICAwIC0gbiA9IC1uXHJcbiAgICogIDAgLSAwID0gMFxyXG4gICAqICAwIC0gTiA9IE5cclxuICAgKiAgMCAtIEkgPSAtSVxyXG4gICAqICBOIC0gbiA9IE5cclxuICAgKiAgTiAtIDAgPSBOXHJcbiAgICogIE4gLSBOID0gTlxyXG4gICAqICBOIC0gSSA9IE5cclxuICAgKiAgSSAtIG4gPSBJXHJcbiAgICogIEkgLSAwID0gSVxyXG4gICAqICBJIC0gTiA9IE5cclxuICAgKiAgSSAtIEkgPSBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG1pbnVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHkgbmVnYXRlZCBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyDCsUluZmluaXR5LlxyXG4gICAgICBlbHNlIGlmICh4LmQpIHkucyA9IC15LnM7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyDCsUluZmluaXR5LlxyXG4gICAgICAvLyBSZXR1cm4geCBpZiBib3RoIGFyZSDCsUluZmluaXR5IHdpdGggZGlmZmVyZW50IHNpZ25zLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIMKxSW5maW5pdHkgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG4gICAgICBlbHNlIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zICE9PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gICAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IHguZDtcclxuICAgIHlkID0geS5kO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICAvLyBJZiBlaXRoZXIgaXMgemVyby4uLlxyXG4gICAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIC8vIFJldHVybiB5IG5lZ2F0ZWQgaWYgeCBpcyB6ZXJvIGFuZCB5IGlzIG5vbi16ZXJvLlxyXG4gICAgICBpZiAoeWRbMF0pIHkucyA9IC15LnM7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICAgIGVsc2UgaWYgKHhkWzBdKSB5ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gemVybyBpZiBib3RoIGFyZSB6ZXJvLlxyXG4gICAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgICBlbHNlIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gICAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB4IGFuZCB5IGFyZSBmaW5pdGUsIG5vbi16ZXJvIG51bWJlcnMgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBiYXNlIDFlNyBleHBvbmVudHMuXHJcbiAgICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICAgIHhlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuXHJcbiAgICB4ZCA9IHhkLnNsaWNlKCk7XHJcbiAgICBrID0geGUgLSBlO1xyXG5cclxuICAgIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICAgIGlmIChrKSB7XHJcbiAgICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICAgIGlmICh4TFR5KSB7XHJcbiAgICAgICAgZCA9IHhkO1xyXG4gICAgICAgIGsgPSAtaztcclxuICAgICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZCA9IHlkO1xyXG4gICAgICAgIGUgPSB4ZTtcclxuICAgICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE51bWJlcnMgd2l0aCBtYXNzaXZlbHkgZGlmZmVyZW50IGV4cG9uZW50cyB3b3VsZCByZXN1bHQgaW4gYSB2ZXJ5IGhpZ2ggbnVtYmVyIG9mXHJcbiAgICAgIC8vIHplcm9zIG5lZWRpbmcgdG8gYmUgcHJlcGVuZGVkLCBidXQgdGhpcyBjYW4gYmUgYXZvaWRlZCB3aGlsZSBzdGlsbCBlbnN1cmluZyBjb3JyZWN0XHJcbiAgICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgICBpID0gTWF0aC5tYXgoTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMjtcclxuXHJcbiAgICAgIGlmIChrID4gaSkge1xyXG4gICAgICAgIGsgPSBpO1xyXG4gICAgICAgIGQubGVuZ3RoID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgICBmb3IgKGkgPSBrOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAgIC8vIEJhc2UgMWU3IGV4cG9uZW50cyBlcXVhbC5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgICAgaSA9IHhkLmxlbmd0aDtcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgICAgaWYgKHhMVHkpIGxlbiA9IGk7XHJcblxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICAgIHhMVHkgPSB4ZFtpXSA8IHlkW2ldO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBrID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIHhkID0geWQ7XHJcbiAgICAgIHlkID0gZDtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgIH1cclxuXHJcbiAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gQXBwZW5kIHplcm9zIHRvIGB4ZGAgaWYgc2hvcnRlci5cclxuICAgIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICAgIGZvciAoaSA9IHlkLmxlbmd0aCAtIGxlbjsgaSA+IDA7IC0taSkgeGRbbGVuKytdID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB5ZCBmcm9tIHhkLlxyXG4gICAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICAgIGlmICh4ZFstLWldIDwgeWRbaV0pIHtcclxuICAgICAgICBmb3IgKGogPSBpOyBqICYmIHhkWy0tal0gPT09IDA7KSB4ZFtqXSA9IEJBU0UgLSAxO1xyXG4gICAgICAgIC0teGRbal07XHJcbiAgICAgICAgeGRbaV0gKz0gQkFTRTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGRbaV0gLT0geWRbaV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICBmb3IgKDsgeGRbMF0gPT09IDA7IHhkLnNoaWZ0KCkpIC0tZTtcclxuXHJcbiAgICAvLyBaZXJvP1xyXG4gICAgaWYgKCF4ZFswXSkgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcclxuXHJcbiAgICB5LmQgPSB4ZDtcclxuICAgIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgIG4gJSAwID0gIE5cclxuICAgKiAgIG4gJSBOID0gIE5cclxuICAgKiAgIG4gJSBJID0gIG5cclxuICAgKiAgIDAgJSBuID0gIDBcclxuICAgKiAgLTAgJSBuID0gLTBcclxuICAgKiAgIDAgJSAwID0gIE5cclxuICAgKiAgIDAgJSBOID0gIE5cclxuICAgKiAgIDAgJSBJID0gIDBcclxuICAgKiAgIE4gJSBuID0gIE5cclxuICAgKiAgIE4gJSAwID0gIE5cclxuICAgKiAgIE4gJSBOID0gIE5cclxuICAgKiAgIE4gJSBJID0gIE5cclxuICAgKiAgIEkgJSBuID0gIE5cclxuICAgKiAgIEkgJSAwID0gIE5cclxuICAgKiAgIEkgJSBOID0gIE5cclxuICAgKiAgIEkgJSBJID0gIE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgcSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgwrFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIMKxMC5cclxuICAgIGlmICgheC5kIHx8ICF5LnMgfHwgeS5kICYmICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgwrFJbmZpbml0eSBvciB4IGlzIMKxMC5cclxuICAgIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKEN0b3IubW9kdWxvID09IDkpIHtcclxuXHJcbiAgICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgICAvLyByZXN1bHQgPSB4IC0gcSAqIHkgICAgd2hlcmUgIDAgPD0gcmVzdWx0IDwgYWJzKHkpXHJcbiAgICAgIHEgPSBkaXZpZGUoeCwgeS5hYnMoKSwgMCwgMywgMSk7XHJcbiAgICAgIHEucyAqPSB5LnM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBxID0gZGl2aWRlKHgsIHksIDAsIEN0b3IubW9kdWxvLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBxID0gcS50aW1lcyh5KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHgubWludXMocSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICAgKiBpLmUuIHRoZSBiYXNlIGUgcmFpc2VkIHRvIHRoZSBwb3dlciB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubmF0dXJhbEV4cG9uZW50aWFsID0gUC5leHAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gICAqIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubmF0dXJhbExvZ2FyaXRobSA9IFAubG4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbmF0dXJhbExvZ2FyaXRobSh0aGlzKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG5lZ2F0ZWQsIGkuZS4gYXMgaWYgbXVsdGlwbGllZCBieVxyXG4gICAqIC0xLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgeC5zID0gLXgucztcclxuICAgIHJldHVybiBmaW5hbGlzZSh4KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiArIDAgPSBuXHJcbiAgICogIG4gKyBOID0gTlxyXG4gICAqICBuICsgSSA9IElcclxuICAgKiAgMCArIG4gPSBuXHJcbiAgICogIDAgKyAwID0gMFxyXG4gICAqICAwICsgTiA9IE5cclxuICAgKiAgMCArIEkgPSBJXHJcbiAgICogIE4gKyBuID0gTlxyXG4gICAqICBOICsgMCA9IE5cclxuICAgKiAgTiArIE4gPSBOXHJcbiAgICogIE4gKyBJID0gTlxyXG4gICAqICBJICsgbiA9IElcclxuICAgKiAgSSArIDAgPSBJXHJcbiAgICogIEkgKyBOID0gTlxyXG4gICAqICBJICsgSSA9IElcclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcGx1cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5wbHVzID0gUC5hZGQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyBmaW5pdGUgYW5kIHggaXMgwrFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIGRpZmZlcmVudCBzaWducy5cclxuICAgICAgLy8gUmV0dXJuIHkgaWYgeCBpcyBmaW5pdGUgYW5kIHkgaXMgwrFJbmZpbml0eS5cclxuICAgICAgZWxzZSBpZiAoIXguZCkgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgPT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gICAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgeGQgPSB4LmQ7XHJcbiAgICB5ZCA9IHkuZDtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgLy8gSWYgZWl0aGVyIGlzIHplcm8uLi5cclxuICAgIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAgIC8vIFJldHVybiB5IGlmIHkgaXMgbm9uLXplcm8uXHJcbiAgICAgIGlmICgheWRbMF0pIHkgPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHggYW5kIHkgYXJlIGZpbml0ZSwgbm9uLXplcm8gbnVtYmVycyB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICAgIGsgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xyXG4gICAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gICAgaSA9IGsgLSBlO1xyXG5cclxuICAgIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICAgIGlmIChpKSB7XHJcblxyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBkID0geGQ7XHJcbiAgICAgICAgaSA9IC1pO1xyXG4gICAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkID0geWQ7XHJcbiAgICAgICAgZSA9IGs7XHJcbiAgICAgICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBMaW1pdCBudW1iZXIgb2YgemVyb3MgcHJlcGVuZGVkIHRvIG1heChjZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMS5cclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuICAgICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICAgIGlmIChpID4gbGVuKSB7XHJcbiAgICAgICAgaSA9IGxlbjtcclxuICAgICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLiBOb3RlOiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgICAgZC5yZXZlcnNlKCk7XHJcbiAgICAgIGZvciAoOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIGkgPSB5ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gICAgaWYgKGxlbiAtIGkgPCAwKSB7XHJcbiAgICAgIGkgPSBsZW47XHJcbiAgICAgIGQgPSB5ZDtcclxuICAgICAgeWQgPSB4ZDtcclxuICAgICAgeGQgPSBkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHlkLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhkIGNhbiBiZSBsZWZ0IGFzIHRoZXkgYXJlLlxyXG4gICAgZm9yIChjYXJyeSA9IDA7IGk7KSB7XHJcbiAgICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICAgIHhkW2ldICU9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB7XHJcbiAgICAgIHhkLnVuc2hpZnQoY2FycnkpO1xyXG4gICAgICArK2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG4gICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgeS5kID0geGQ7XHJcbiAgICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBbel0ge2Jvb2xlYW58bnVtYmVyfSBXaGV0aGVyIHRvIGNvdW50IGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvczogdHJ1ZSwgZmFsc2UsIDEgb3IgMC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uICh6KSB7XHJcbiAgICB2YXIgayxcclxuICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHogIT09IHZvaWQgMCAmJiB6ICE9PSAhIXogJiYgeiAhPT0gMSAmJiB6ICE9PSAwKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB6KTtcclxuXHJcbiAgICBpZiAoeC5kKSB7XHJcbiAgICAgIGsgPSBnZXRQcmVjaXNpb24oeC5kKTtcclxuICAgICAgaWYgKHogJiYgeC5lICsgMSA+IGspIGsgPSB4LmUgKyAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IE5hTjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICAgKiByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnJvdW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHguZSArIDEsIEN0b3Iucm91bmRpbmcpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstMSwgMV1cclxuICAgKlxyXG4gICAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICAgKlxyXG4gICAqIHNpbigwKSAgICAgICAgID0gMFxyXG4gICAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICAgKiBzaW4oSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIHNpbigtSW5maW5pdHkpID0gTmFOXHJcbiAgICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSBzaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID4gMiA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogIHNxcnQoLW4pID0gIE5cclxuICAgKiAgc3FydChOKSAgPSAgTlxyXG4gICAqICBzcXJ0KC1JKSA9ICBOXHJcbiAgICogIHNxcnQoSSkgID0gIElcclxuICAgKiAgc3FydCgwKSAgPSAgMFxyXG4gICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICpcclxuICAgKi9cclxuICBQLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbSwgbiwgc2QsIHIsIHJlcCwgdCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIGQgPSB4LmQsXHJcbiAgICAgIGUgPSB4LmUsXHJcbiAgICAgIHMgPSB4LnMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIC8vIE5lZ2F0aXZlL05hTi9JbmZpbml0eS96ZXJvP1xyXG4gICAgaWYgKHMgIT09IDEgfHwgIWQgfHwgIWRbMF0pIHtcclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgIHMgPSBNYXRoLnNxcnQoK3gpO1xyXG5cclxuICAgIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgaWYgKHMgPT0gMCB8fCBzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSBkaWdpdHNUb1N0cmluZyhkKTtcclxuXHJcbiAgICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICAgIHMgPSBNYXRoLnNxcnQobik7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICcxZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICB0ID0gcjtcclxuICAgICAgciA9IHQucGx1cyhkaXZpZGUoeCwgdCwgc2QgKyAyLCAxKSkudGltZXMoMC41KTtcclxuXHJcbiAgICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgICAgLy8gNDk5OSwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgICAgcmVwID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogdGFuKDApICAgICAgICAgPSAwXHJcbiAgICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIHRhbihJbmZpbml0eSkgID0gTmFOXHJcbiAgICogdGFuKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDEwO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHguc2luKCk7XHJcbiAgICB4LnMgPSAxO1xyXG4gICAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuICogMCA9IDBcclxuICAgKiAgbiAqIE4gPSBOXHJcbiAgICogIG4gKiBJID0gSVxyXG4gICAqICAwICogbiA9IDBcclxuICAgKiAgMCAqIDAgPSAwXHJcbiAgICogIDAgKiBOID0gTlxyXG4gICAqICAwICogSSA9IE5cclxuICAgKiAgTiAqIG4gPSBOXHJcbiAgICogIE4gKiAwID0gTlxyXG4gICAqICBOICogTiA9IE5cclxuICAgKiAgTiAqIEkgPSBOXHJcbiAgICogIEkgKiBuID0gSVxyXG4gICAqICBJICogMCA9IE5cclxuICAgKiAgSSAqIE4gPSBOXHJcbiAgICogIEkgKiBJID0gSVxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhpcyBEZWNpbWFsIHRpbWVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIHlkID0gKHkgPSBuZXcgQ3Rvcih5KSkuZDtcclxuXHJcbiAgICB5LnMgKj0geC5zO1xyXG5cclxuICAgICAvLyBJZiBlaXRoZXIgaXMgTmFOLCDCsUluZmluaXR5IG9yIMKxMC4uLlxyXG4gICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCF5LnMgfHwgeGQgJiYgIXhkWzBdICYmICF5ZCB8fCB5ZCAmJiAheWRbMF0gJiYgIXhkXHJcblxyXG4gICAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgwrEwIGFuZCB5IGlzIMKxSW5maW5pdHksIG9yIHkgaXMgwrEwIGFuZCB4IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgPyBOYU5cclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxMCBpZiBlaXRoZXIgaXMgwrEwLlxyXG4gICAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICAgIH1cclxuXHJcbiAgICBlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKSArIG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgICB5ZEwgPSB5ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gRW5zdXJlIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gICAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgICByID0geGQ7XHJcbiAgICAgIHhkID0geWQ7XHJcbiAgICAgIHlkID0gcjtcclxuICAgICAgckwgPSB4ZEw7XHJcbiAgICAgIHhkTCA9IHlkTDtcclxuICAgICAgeWRMID0gckw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW5pdGlhbGlzZSB0aGUgcmVzdWx0IGFycmF5IHdpdGggemVyb3MuXHJcbiAgICByID0gW107XHJcbiAgICByTCA9IHhkTCArIHlkTDtcclxuICAgIGZvciAoaSA9IHJMOyBpLS07KSByLnB1c2goMCk7XHJcblxyXG4gICAgLy8gTXVsdGlwbHkhXHJcbiAgICBmb3IgKGkgPSB5ZEw7IC0taSA+PSAwOykge1xyXG4gICAgICBjYXJyeSA9IDA7XHJcbiAgICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICAgIHQgPSByW2tdICsgeWRbaV0gKiB4ZFtrIC0gaSAtIDFdICsgY2Fycnk7XHJcbiAgICAgICAgcltrLS1dID0gdCAlIEJBU0UgfCAwO1xyXG4gICAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByW2tdID0gKHJba10gKyBjYXJyeSkgJSBCQVNFIHwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgIXJbLS1yTF07KSByLnBvcCgpO1xyXG5cclxuICAgIGlmIChjYXJyeSkgKytlO1xyXG4gICAgZWxzZSByLnNoaWZ0KCk7XHJcblxyXG4gICAgeS5kID0gcjtcclxuICAgIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKSA6IHk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMiwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9CaW5hcnkgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMiwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGBkcGBcclxuICAgKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBJZiBgZHBgIGlzIG9taXR0ZWQsIHJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9EZWNpbWFsUGxhY2VzID0gUC50b0RQID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcbiAgICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgsIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBleHBvbmVudGlhbCBub3RhdGlvbiByb3VuZGVkIHRvXHJcbiAgICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIHZhciBzdHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUsIGRwICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICAgKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIGFuZCByb3VuZGVkIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCBvciBgcm91bmRpbmdgIGlmIGBybWAgaXNcclxuICAgKiBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogQXMgd2l0aCBKYXZhU2NyaXB0IG51bWJlcnMsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsIGJ1dCBlLmcuICgtMC4wMDAwMSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgKiAoLTApLnRvRml4ZWQoMSkgaXMgJzAuMCcsIGJ1dCAoLTAuMDEpLnRvRml4ZWQoMSkgaXMgJy0wLjAnLlxyXG4gICAqICgtMCkudG9GaXhlZCgzKSBpcyAnMC4wMDAnLlxyXG4gICAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgICB2YXIgc3RyLCB5LFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKGRwID09PSB2b2lkIDApIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgICB5ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh5LCBmYWxzZSwgZHAgKyB5LmUgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBkZXRlcm1pbmUgd2hldGhlciB0byBhZGQgdGhlIG1pbnVzIHNpZ24gbG9vayBhdCB0aGUgdmFsdWUgYmVmb3JlIGl0IHdhcyByb3VuZGVkLFxyXG4gICAgLy8gaS5lLiBsb29rIGF0IGB4YCByYXRoZXIgdGhhbiBgeWAuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICAgKiBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAgICpcclxuICAgKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICAgKiBkZW5vbWluYXRvci4gSWYgYSBtYXhpbXVtIGRlbm9taW5hdG9yIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBkZW5vbWluYXRvciB3aWxsIGJlIHRoZSBsb3dlc3RcclxuICAgKiB2YWx1ZSBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIgZXhhY3RseS5cclxuICAgKlxyXG4gICAqIFttYXhEXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBNYXhpbXVtIGRlbm9taW5hdG9yLiBJbnRlZ2VyID49IDEgYW5kIDwgSW5maW5pdHkuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRnJhY3Rpb24gPSBmdW5jdGlvbiAobWF4RCkge1xyXG4gICAgdmFyIGQsIGQwLCBkMSwgZDIsIGUsIGssIG4sIG4wLCBuMSwgcHIsIHEsIHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIG4xID0gZDAgPSBuZXcgQ3RvcigxKTtcclxuICAgIGQxID0gbjAgPSBuZXcgQ3RvcigwKTtcclxuXHJcbiAgICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gICAgZSA9IGQuZSA9IGdldFByZWNpc2lvbih4ZCkgLSB4LmUgLSAxO1xyXG4gICAgayA9IGUgJSBMT0dfQkFTRTtcclxuICAgIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gICAgaWYgKG1heEQgPT0gbnVsbCkge1xyXG5cclxuICAgICAgLy8gZCBpcyAxMCoqZSwgdGhlIG1pbmltdW0gbWF4LWRlbm9taW5hdG9yIG5lZWRlZC5cclxuICAgICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IG5ldyBDdG9yKG1heEQpO1xyXG4gICAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICAgIG1heEQgPSBuLmd0KGQpID8gKGUgPiAwID8gZCA6IG4xKSA6IG47XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIG4gPSBuZXcgQ3RvcihkaWdpdHNUb1N0cmluZyh4ZCkpO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgICBmb3IgKDs7KSAge1xyXG4gICAgICBxID0gZGl2aWRlKG4sIGQsIDAsIDEsIDEpO1xyXG4gICAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgICBpZiAoZDIuY21wKG1heEQpID09IDEpIGJyZWFrO1xyXG4gICAgICBkMCA9IGQxO1xyXG4gICAgICBkMSA9IGQyO1xyXG4gICAgICBkMiA9IG4xO1xyXG4gICAgICBuMSA9IG4wLnBsdXMocS50aW1lcyhkMikpO1xyXG4gICAgICBuMCA9IGQyO1xyXG4gICAgICBkMiA9IGQ7XHJcbiAgICAgIGQgPSBuLm1pbnVzKHEudGltZXMoZDIpKTtcclxuICAgICAgbiA9IGQyO1xyXG4gICAgfVxyXG5cclxuICAgIGQyID0gZGl2aWRlKG1heEQubWludXMoZDApLCBkMSwgMCwgMSwgMSk7XHJcbiAgICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICAgIGQwID0gZDAucGx1cyhkMi50aW1lcyhkMSkpO1xyXG4gICAgbjAucyA9IG4xLnMgPSB4LnM7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICAgIHIgPSBkaXZpZGUobjEsIGQxLCBlLCAxKS5taW51cyh4KS5hYnMoKS5jbXAoZGl2aWRlKG4wLCBkMCwgZSwgMSkubWludXMoeCkuYWJzKCkpIDwgMVxyXG4gICAgICAgID8gW24xLCBkMV0gOiBbbjAsIGQwXTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDE2LCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICAgKlxyXG4gICAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0hleGFkZWNpbWFsID0gUC50b0hleCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHRoZSBtYWduaXR1ZGUgb2YgYHlgIHRvIHRoZSB2YWx1ZVxyXG4gICAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIElmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1aWRpc3RhbnQgZnJvbSB0d28gbXVsdGlwbGVzIG9mIGB5YCwgdGhlIHJvdW5kaW5nIG1vZGUgYHJtYCxcclxuICAgKiBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCBkZXRlcm1pbmVzIHRoZSBkaXJlY3Rpb24gb2YgdGhlIG5lYXJlc3QgbXVsdGlwbGUuXHJcbiAgICpcclxuICAgKiBJbiB0aGUgY29udGV4dCBvZiB0aGlzIG1ldGhvZCwgcm91bmRpbmcgbW9kZSA0IChST1VORF9IQUxGX1VQKSBpcyB0aGUgc2FtZSBhcyByb3VuZGluZyBtb2RlIDBcclxuICAgKiAoUk9VTkRfVVApLCBhbmQgc28gb24uXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAgICogb3IgYHlgIGlzIE5hTiwgaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgYWxzbyBiZSBOYU4uXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBtYWduaXR1ZGUgdG8gcm91bmQgdG8gYSBtdWx0aXBsZSBvZi5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgaWYgKHkgPT0gbnVsbCkge1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geC5cclxuICAgICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5ID0gbmV3IEN0b3IoeSk7XHJcbiAgICAgIGlmIChybSAhPT0gdm9pZCAwKSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIC8vIElmIHggaXMgbm90IGZpbml0ZSwgcmV0dXJuIHggaWYgeSBpcyBub3QgTmFOLCBlbHNlIE5hTi5cclxuICAgICAgaWYgKCF4LmQpIHJldHVybiB5LnMgPyB4IDogeTtcclxuXHJcbiAgICAgIC8vIElmIHkgaXMgbm90IGZpbml0ZSwgcmV0dXJuIEluZmluaXR5IHdpdGggdGhlIHNpZ24gb2YgeCBpZiB5IGlzIEluZmluaXR5LCBlbHNlIE5hTi5cclxuICAgICAgaWYgKCF5LmQpIHtcclxuICAgICAgICBpZiAoeS5zKSB5LnMgPSB4LnM7XHJcbiAgICAgICAgcmV0dXJuIHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiB5IGlzIG5vdCB6ZXJvLCBjYWxjdWxhdGUgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgeSB0byB4LlxyXG4gICAgaWYgKHkuZFswXSkge1xyXG4gICAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICBpZiAocm0gPCA0KSBybSA9IFs0LCA1LCA3LCA4XVtybV07XHJcbiAgICAgIHggPSBkaXZpZGUoeCwgeSwgMCwgcm0sIDEpLnRpbWVzKHkpO1xyXG4gICAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICAgIGZpbmFsaXNlKHgpO1xyXG5cclxuICAgIC8vIElmIHkgaXMgemVybywgcmV0dXJuIHplcm8gd2l0aCB0aGUgc2lnbiBvZiB4LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeS5zID0geC5zO1xyXG4gICAgICB4ID0geTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gICAqIFplcm8ga2VlcHMgaXRzIHNpZ24uXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICt0aGlzO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgOCwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJhaXNlZCB0byB0aGUgcG93ZXIgYHlgLCByb3VuZGVkXHJcbiAgICogdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIEVDTUFTY3JpcHQgY29tcGxpYW50LlxyXG4gICAqXHJcbiAgICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coeCwgwrEwKSAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IDFcclxuXHJcbiAgICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coYWJzKHgpID4gMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coYWJzKHgpID4gMSwgLUluZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdyhhYnMoeCkgPT0gMSwgwrFJbmZpbml0eSkgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coYWJzKHgpIDwgMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdygrSW5maW5pdHksIHkgPiAwKSAgICAgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdygrSW5maW5pdHksIHkgPCAwKSAgICAgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPCAwKSAgICAgICA9IC0wXHJcbiAgICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICAgKiAgIHBvdygrMCwgeSA+IDApICAgICAgICAgICAgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KCswLCB5IDwgMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAgICogICBwb3coLTAsIGV2ZW4gaW50ZWdlciA+IDApICAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdygtMCwgb2RkIGludGVnZXIgPCAwKSAgICAgICAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdyhmaW5pdGUgeCA8IDAsIGZpbml0ZSBub24taW50ZWdlcikgPSBOYU5cclxuICAgKlxyXG4gICAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gICAqXHJcbiAgICogICB4XnkgPSBleHAoeSpsbih4KSlcclxuICAgKlxyXG4gICAqIEFzc3VtaW5nIHRoZSBmaXJzdCAxNSByb3VuZGluZyBkaWdpdHMgYXJlIGVhY2ggZXF1YWxseSBsaWtlbHkgdG8gYmUgYW55IGRpZ2l0IDAtOSwgdGhlXHJcbiAgICogcHJvYmFiaWxpdHkgb2YgYW4gaW5jb3JyZWN0bHkgcm91bmRlZCByZXN1bHRcclxuICAgKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICAgKiBpLmUuIDEgaW4gMjUwLDAwMCwwMDAsMDAwLDAwMFxyXG4gICAqXHJcbiAgICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gICAqXHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1Bvd2VyID0gUC5wb3cgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgICAvLyBFaXRoZXIgwrFJbmZpbml0eSwgTmFOIG9yIMKxMD9cclxuICAgIGlmICgheC5kIHx8ICF5LmQgfHwgIXguZFswXSB8fCAheS5kWzBdKSByZXR1cm4gbmV3IEN0b3IobWF0aHBvdygreCwgeW4pKTtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAgIC8vIHkgZXhwb25lbnRcclxuICAgIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgICBpZiAoZSA+PSB5LmQubGVuZ3RoIC0gMSAmJiAoayA9IHluIDwgMCA/IC15biA6IHluKSA8PSBNQVhfU0FGRV9JTlRFR0VSKSB7XHJcbiAgICAgIHIgPSBpbnRQb3coQ3RvciwgeCwgaywgcHIpO1xyXG4gICAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgICB9XHJcblxyXG4gICAgcyA9IHgucztcclxuXHJcbiAgICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgICBpZiAocyA8IDApIHtcclxuXHJcbiAgICAgIC8vIGlmIHkgaXMgbm90IGFuIGludGVnZXJcclxuICAgICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICAvLyBSZXN1bHQgaXMgcG9zaXRpdmUgaWYgeCBpcyBuZWdhdGl2ZSBhbmQgdGhlIGxhc3QgZGlnaXQgb2YgaW50ZWdlciB5IGlzIGV2ZW4uXHJcbiAgICAgIGlmICgoeS5kW2VdICYgMSkgPT0gMCkgcyA9IDE7XHJcblxyXG4gICAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgICBpZiAoeC5lID09IDAgJiYgeC5kWzBdID09IDEgJiYgeC5kLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgeC5zID0gcztcclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAgIC8vIHheeSA9IDEwXmUsICB3aGVyZSBlID0geSAqIGxvZzEwKHgpXHJcbiAgICAvLyBsb2cxMCh4KSA9IGxvZzEwKHhfc2lnbmlmaWNhbmQpICsgeF9leHBvbmVudFxyXG4gICAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gICAgayA9IG1hdGhwb3coK3gsIHluKTtcclxuICAgIGUgPSBrID09IDAgfHwgIWlzRmluaXRlKGspXHJcbiAgICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgICA6IG5ldyBDdG9yKGsgKyAnJykuZTtcclxuXHJcbiAgICAvLyBFeHBvbmVudCBlc3RpbWF0ZSBtYXkgYmUgaW5jb3JyZWN0IGUuZy4geDogMC45OTk5OTk5OTk5OTk5OTk5OTksIHk6IDIuMjksIGU6IDAsIHIuZTogLTEuXHJcblxyXG4gICAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gICAgaWYgKGUgPiBDdG9yLm1heEUgKyAxIHx8IGUgPCBDdG9yLm1pbkUgLSAxKSByZXR1cm4gbmV3IEN0b3IoZSA+IDAgPyBzIC8gMCA6IDApO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgZXh0cmEgZ3VhcmQgZGlnaXRzIG5lZWRlZCB0byBlbnN1cmUgZml2ZSBjb3JyZWN0IHJvdW5kaW5nIGRpZ2l0cyBmcm9tXHJcbiAgICAvLyBuYXR1cmFsTG9nYXJpdGhtKHgpLiBFeGFtcGxlIG9mIGZhaWx1cmUgd2l0aG91dCB0aGVzZSBleHRyYSBkaWdpdHMgKHByZWNpc2lvbjogMTApOlxyXG4gICAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAgIC8vIHNob3VsZCBiZSAxLjE2MjM3NzgyM2UrNzY0OTE0OTA1MTczODE1LCBidXQgaXMgMS4xNjIzNTU4MjNlKzc2NDkxNDkwNTE3MzgxNVxyXG4gICAgayA9IE1hdGgubWluKDEyLCAoZSArICcnKS5sZW5ndGgpO1xyXG5cclxuICAgIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICAgIHIgPSBuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIHByICsgaykpLCBwcik7XHJcblxyXG4gICAgLy8gciBtYXkgYmUgSW5maW5pdHksIGUuZy4gKDAuOTk5OTk5OTk5OTk5OTk5OSkucG93KC0xZSs0MClcclxuICAgIGlmIChyLmQpIHtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSByZXF1aXJlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgICAvLyB0aGUgcmVzdWx0LlxyXG4gICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIHByLCBybSkpIHtcclxuICAgICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGluY3JlYXNlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgICAgICByID0gZmluYWxpc2UobmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBlICsgaykpLCBlKSwgZSArIDUsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKHByICsgMSwgcHIgKyAxNSkgKyAxID09IDFlMTQpIHtcclxuICAgICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHIucyA9IHM7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gICAqIHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIG5vcm1hbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYHNkYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gICAqIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAgICogJ3RvU0QoKSBkaWdpdHMgbm90IGFuIGludGVnZXI6IHtzZH0nXHJcbiAgICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gICAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgRGVjaW1hbCBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICAgKiBgdG9FeHBQb3NgLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBgdG9FeHBOZWdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICogVW5saWtlIGB0b1N0cmluZ2AsIG5lZ2F0aXZlIHplcm8gd2lsbCBpbmNsdWRlIHRoZSBtaW51cyBzaWduLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcblxyXG4gICAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAvLyBBZGQgYWxpYXNlcyB0byBtYXRjaCBCaWdEZWNpbWFsIG1ldGhvZCBuYW1lcy5cclxuICAvLyBQLmFkZCA9IFAucGx1cztcclxuICBQLnN1YnRyYWN0ID0gUC5taW51cztcclxuICBQLm11bHRpcGx5ID0gUC50aW1lcztcclxuICBQLmRpdmlkZSA9IFAuZGl2O1xyXG4gIFAucmVtYWluZGVyID0gUC5tb2Q7XHJcbiAgUC5jb21wYXJlVG8gPSBQLmNtcDtcclxuICBQLm5lZ2F0ZSA9IFAubmVnO1xyXG4gICAqL1xyXG5cclxuXHJcbiAgLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgRGVjaW1hbC5wcm90b3R5cGUgKFApIGFuZC9vciBEZWNpbWFsIG1ldGhvZHMsIGFuZCB0aGVpciBjYWxsZXJzLlxyXG5cclxuXHJcbiAgLypcclxuICAgKiAgZGlnaXRzVG9TdHJpbmcgICAgICAgICAgIFAuY3ViZVJvb3QsIFAubG9nYXJpdGhtLCBQLnNxdWFyZVJvb3QsIFAudG9GcmFjdGlvbiwgUC50b1Bvd2VyLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXRlVG9TdHJpbmcsIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobVxyXG4gICAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cywgdG9TdHJpbmdCaW5hcnksIHJhbmRvbVxyXG4gICAqICBjaGVja1JvdW5kaW5nRGlnaXRzICAgICAgUC5sb2dhcml0aG0sIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gICAqICBjb3MgICAgICAgICAgICAgICAgICAgICAgUC5jb3NcclxuICAgKiAgZGl2aWRlICAgICAgICAgICAgICAgICAgIFAuYXRhbmgsIFAuY3ViZVJvb3QsIFAuZGl2aWRlZEJ5LCBQLmRpdmlkZWRUb0ludGVnZXJCeSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgdG9TdHJpbmdCaW5hcnksIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRheWxvclNlcmllcywgYXRhbjIsIHBhcnNlT3RoZXJcclxuICAgKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLmN1YmVSb290LCBQLmRpdmlkZWRUb0ludGVnZXJCeSwgUC5mbG9vciwgUC5sb2dhcml0aG0sIFAubWludXMsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLm1vZHVsbywgUC5uZWdhdGVkLCBQLnBsdXMsIFAucm91bmQsIFAuc2luLCBQLnNpbmgsIFAuc3F1YXJlUm9vdCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgUC50b1Bvd2VyLCBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRydW5jYXRlZCwgZGl2aWRlLCBnZXRMbjEwLCBnZXRQaSwgbmF0dXJhbEV4cG9uZW50aWFsLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gICAqICBmaW5pdGVUb1N0cmluZyAgICAgICAgICAgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9QcmVjaXNpb24sIFAudG9TdHJpbmcsIFAudmFsdWVPZixcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5XHJcbiAgICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICAgKiAgZ2V0TG4xMCAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGdldFBpICAgICAgICAgICAgICAgICAgICBQLmFjb3MsIFAuYXNpbiwgUC5hdGFuLCB0b0xlc3NUaGFuSGFsZlBpLCBhdGFuMlxyXG4gICAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gICAqICBnZXRaZXJvU3RyaW5nICAgICAgICAgICAgZGlnaXRzVG9TdHJpbmcsIGZpbml0ZVRvU3RyaW5nXHJcbiAgICogIGludFBvdyAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIHBhcnNlT3RoZXJcclxuICAgKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICAgKiAgbWF4T3JNaW4gICAgICAgICAgICAgICAgIG1heCwgbWluXHJcbiAgICogIG5hdHVyYWxFeHBvbmVudGlhbCAgICAgICBQLm5hdHVyYWxFeHBvbmVudGlhbCwgUC50b1Bvd2VyXHJcbiAgICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWxcclxuICAgKiAgbm9uRmluaXRlVG9TdHJpbmcgICAgICAgIGZpbml0ZVRvU3RyaW5nLCB0b1N0cmluZ0JpbmFyeVxyXG4gICAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gICAqICBwYXJzZU90aGVyICAgICAgICAgICAgICAgRGVjaW1hbFxyXG4gICAqICBzaW4gICAgICAgICAgICAgICAgICAgICAgUC5zaW5cclxuICAgKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gICAqICB0b0xlc3NUaGFuSGFsZlBpICAgICAgICAgUC5jb3MsIFAuc2luXHJcbiAgICogIHRvU3RyaW5nQmluYXJ5ICAgICAgICAgICBQLnRvQmluYXJ5LCBQLnRvSGV4YWRlY2ltYWwsIFAudG9PY3RhbFxyXG4gICAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAgICpcclxuICAgKiAgVGhyb3dzOiAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uLCBjaGVja0ludDMyLCBnZXRMbjEwLCBnZXRQaSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAgICovXHJcblxyXG5cclxuICBmdW5jdGlvbiBkaWdpdHNUb1N0cmluZyhkKSB7XHJcbiAgICB2YXIgaSwgaywgd3MsXHJcbiAgICAgIGluZGV4T2ZMYXN0V29yZCA9IGQubGVuZ3RoIC0gMSxcclxuICAgICAgc3RyID0gJycsXHJcbiAgICAgIHcgPSBkWzBdO1xyXG5cclxuICAgIGlmIChpbmRleE9mTGFzdFdvcmQgPiAwKSB7XHJcbiAgICAgIHN0ciArPSB3O1xyXG4gICAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgICB3cyA9IGRbaV0gKyAnJztcclxuICAgICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICAgIHN0ciArPSB3cztcclxuICAgICAgfVxyXG5cclxuICAgICAgdyA9IGRbaV07XHJcbiAgICAgIHdzID0gdyArICcnO1xyXG4gICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSBpZiAodyA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gJzAnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcyBvZiBsYXN0IHcuXHJcbiAgICBmb3IgKDsgdyAlIDEwID09PSAwOykgdyAvPSAxMDtcclxuXHJcbiAgICByZXR1cm4gc3RyICsgdztcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjaGVja0ludDMyKGksIG1pbiwgbWF4KSB7XHJcbiAgICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENoZWNrIDUgcm91bmRpbmcgZGlnaXRzIGlmIGByZXBlYXRpbmdgIGlzIG51bGwsIDQgb3RoZXJ3aXNlLlxyXG4gICAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gICAqIGByZXBlYXRpbmcgIT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBuYXR1cmFsTG9nYXJpdGhtYCBvciBgbmF0dXJhbEV4cG9uZW50aWFsYC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICAgIHZhciBkaSwgaywgciwgcmQ7XHJcblxyXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGFycmF5IGQuXHJcbiAgICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gICAgLy8gSXMgdGhlIHJvdW5kaW5nIGRpZ2l0IGluIHRoZSBmaXJzdCB3b3JkIG9mIGQ/XHJcbiAgICBpZiAoLS1pIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBkaSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgLy8gRS5nLiBpZiB3aXRoaW4gdGhlIHdvcmQgMzQ4NzU2MyB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgaXMgNSxcclxuICAgIC8vIHRoZW4gaSA9IDQsIGsgPSAxMDAwLCByZCA9IDM0ODc1NjMgJSAxMDAwID0gNTYzXHJcbiAgICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICAgIHJkID0gZFtkaV0gJSBrIHwgMDtcclxuXHJcbiAgICBpZiAocmVwZWF0aW5nID09IG51bGwpIHtcclxuICAgICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgICAgaWYgKGkgPT0gMCkgcmQgPSByZCAvIDEwMCB8IDA7XHJcbiAgICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgciA9IChybSA8IDQgJiYgcmQgKyAxID09IGsgfHwgcm0gPiAzICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgICAocmQgPT0gayAvIDIgfHwgcmQgPT0gMCkgJiYgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSAwO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDQpIHtcclxuICAgICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwMCB8IDA7XHJcbiAgICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDIpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgICAgciA9IChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCA9PSA5OTk5IHx8ICFyZXBlYXRpbmcgJiYgcm0gPiAzICYmIHJkID09IDQ5OTk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgciA9ICgocmVwZWF0aW5nIHx8IHJtIDwgNCkgJiYgcmQgKyAxID09IGsgfHxcclxuICAgICAgICAoIXJlcGVhdGluZyAmJiBybSA+IDMpICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICAvLyBDb252ZXJ0IHN0cmluZyBvZiBgYmFzZUluYCB0byBhbiBhcnJheSBvZiBudW1iZXJzIG9mIGBiYXNlT3V0YC5cclxuICAvLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuICAvLyBFZy4gY29udmVydEJhc2UoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICBmdW5jdGlvbiBjb252ZXJ0QmFzZShzdHIsIGJhc2VJbiwgYmFzZU91dCkge1xyXG4gICAgdmFyIGosXHJcbiAgICAgIGFyciA9IFswXSxcclxuICAgICAgYXJyTCxcclxuICAgICAgaSA9IDAsXHJcbiAgICAgIHN0ckwgPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoOyBpIDwgc3RyTDspIHtcclxuICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgICAgYXJyWzBdICs9IE5VTUVSQUxTLmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcclxuICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgaWYgKGFycltqICsgMV0gPT09IHZvaWQgMCkgYXJyW2ogKyAxXSA9IDA7XHJcbiAgICAgICAgICBhcnJbaiArIDFdICs9IGFycltqXSAvIGJhc2VPdXQgfCAwO1xyXG4gICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFyci5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBjb3MoeCkgPSAxIC0geF4yLzIhICsgeF40LzQhIC0gLi4uXHJcbiAgICogfHh8IDwgcGkvMlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zaW5lKEN0b3IsIHgpIHtcclxuICAgIHZhciBrLCB5LFxyXG4gICAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogY29zKDR4KSA9IDgqKGNvc140KHgpIC0gY29zXjIoeCkpICsgMVxyXG4gICAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XHJcbiAgICAgIHkgPSBNYXRoLnBvdyg0LCAtaykudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSAxNjtcclxuICAgICAgeSA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiArPSBrO1xyXG5cclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyh5KSwgbmV3IEN0b3IoMSkpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICBmb3IgKHZhciBpID0gazsgaS0tOykge1xyXG4gICAgICB2YXIgY29zMnggPSB4LnRpbWVzKHgpO1xyXG4gICAgICB4ID0gY29zMngudGltZXMoY29zMngpLm1pbnVzKGNvczJ4KS50aW1lcyg4KS5wbHVzKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uIC09IGs7XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBQZXJmb3JtIGRpdmlzaW9uIGluIHRoZSBzcGVjaWZpZWQgYmFzZS5cclxuICAgKi9cclxuICB2YXIgZGl2aWRlID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBBc3N1bWVzIG5vbi16ZXJvIHggYW5kIGssIGFuZCBoZW5jZSBub24temVybyByZXN1bHQuXHJcbiAgICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xyXG4gICAgICB2YXIgdGVtcCxcclxuICAgICAgICBjYXJyeSA9IDAsXHJcbiAgICAgICAgaSA9IHgubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yICh4ID0geC5zbGljZSgpOyBpLS07KSB7XHJcbiAgICAgICAgdGVtcCA9IHhbaV0gKiBrICsgY2Fycnk7XHJcbiAgICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcclxuICAgICAgICBjYXJyeSA9IHRlbXAgLyBiYXNlIHwgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnJ5KSB4LnVuc2hpZnQoY2FycnkpO1xyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgICAgdmFyIGksIHI7XHJcblxyXG4gICAgICBpZiAoYUwgIT0gYkwpIHtcclxuICAgICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGkgPSByID0gMDsgaSA8IGFMOyBpKyspIHtcclxuICAgICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcclxuICAgICAgICAgICAgciA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGFMLCBiYXNlKSB7XHJcbiAgICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IGIgZnJvbSBhLlxyXG4gICAgICBmb3IgKDsgYUwtLTspIHtcclxuICAgICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICAgIGkgPSBhW2FMXSA8IGJbYUxdID8gMSA6IDA7XHJcbiAgICAgICAgYVthTF0gPSBpICogYmFzZSArIGFbYUxdIC0gYlthTF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKDsgIWFbMF0gJiYgYS5sZW5ndGggPiAxOykgYS5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoeCwgeSwgcHIsIHJtLCBkcCwgYmFzZSkge1xyXG4gICAgICB2YXIgY21wLCBlLCBpLCBrLCBsb2dCYXNlLCBtb3JlLCBwcm9kLCBwcm9kTCwgcSwgcWQsIHJlbSwgcmVtTCwgcmVtMCwgc2QsIHQsIHhpLCB4TCwgeWQwLFxyXG4gICAgICAgIHlMLCB5eixcclxuICAgICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgICBzaWduID0geC5zID09IHkucyA/IDEgOiAtMSxcclxuICAgICAgICB4ZCA9IHguZCxcclxuICAgICAgICB5ZCA9IHkuZDtcclxuXHJcbiAgICAgIC8vIEVpdGhlciBOYU4sIEluZmluaXR5IG9yIDA/XHJcbiAgICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBDdG9yKC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIE5hTiwgb3IgYm90aCBJbmZpbml0eSBvciAwLlxyXG4gICAgICAgICAgIXgucyB8fCAheS5zIHx8ICh4ZCA/IHlkICYmIHhkWzBdID09IHlkWzBdIDogIXlkKSA/IE5hTiA6XHJcblxyXG4gICAgICAgICAgLy8gUmV0dXJuIMKxMCBpZiB4IGlzIDAgb3IgeSBpcyDCsUluZmluaXR5LCBvciByZXR1cm4gwrFJbmZpbml0eSBhcyB5IGlzIDAuXHJcbiAgICAgICAgICB4ZCAmJiB4ZFswXSA9PSAwIHx8ICF5ZCA/IHNpZ24gKiAwIDogc2lnbiAvIDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYmFzZSkge1xyXG4gICAgICAgIGxvZ0Jhc2UgPSAxO1xyXG4gICAgICAgIGUgPSB4LmUgLSB5LmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmFzZSA9IEJBU0U7XHJcbiAgICAgICAgbG9nQmFzZSA9IExPR19CQVNFO1xyXG4gICAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgICAgcSA9IG5ldyBDdG9yKHNpZ24pO1xyXG4gICAgICBxZCA9IHEuZCA9IFtdO1xyXG5cclxuICAgICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGFuIGUuXHJcbiAgICAgIC8vIFRoZSBkaWdpdCBhcnJheSBvZiBhIERlY2ltYWwgZnJvbSB0b1N0cmluZ0JpbmFyeSBtYXkgaGF2ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChpID0gMDsgeWRbaV0gPT0gKHhkW2ldIHx8IDApOyBpKyspO1xyXG5cclxuICAgICAgaWYgKHlkW2ldID4gKHhkW2ldIHx8IDApKSBlLS07XHJcblxyXG4gICAgICBpZiAocHIgPT0gbnVsbCkge1xyXG4gICAgICAgIHNkID0gcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIH0gZWxzZSBpZiAoZHApIHtcclxuICAgICAgICBzZCA9IHByICsgKHguZSAtIHkuZSkgKyAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNkID0gcHI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZCA8IDApIHtcclxuICAgICAgICBxZC5wdXNoKDEpO1xyXG4gICAgICAgIG1vcmUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBDb252ZXJ0IHByZWNpc2lvbiBpbiBudW1iZXIgb2YgYmFzZSAxMCBkaWdpdHMgdG8gYmFzZSAxZTcgZGlnaXRzLlxyXG4gICAgICAgIHNkID0gc2QgLyBsb2dCYXNlICsgMiB8IDA7XHJcbiAgICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAgIC8vIGRpdmlzb3IgPCAxZTdcclxuICAgICAgICBpZiAoeUwgPT0gMSkge1xyXG4gICAgICAgICAgayA9IDA7XHJcbiAgICAgICAgICB5ZCA9IHlkWzBdO1xyXG4gICAgICAgICAgc2QrKztcclxuXHJcbiAgICAgICAgICAvLyBrIGlzIHRoZSBjYXJyeS5cclxuICAgICAgICAgIGZvciAoOyAoaSA8IHhMIHx8IGspICYmIHNkLS07IGkrKykge1xyXG4gICAgICAgICAgICB0ID0gayAqIGJhc2UgKyAoeGRbaV0gfHwgMCk7XHJcbiAgICAgICAgICAgIHFkW2ldID0gdCAvIHlkIHwgMDtcclxuICAgICAgICAgICAgayA9IHQgJSB5ZCB8IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xyXG5cclxuICAgICAgICAvLyBkaXZpc29yID49IDFlN1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gTm9ybWFsaXNlIHhkIGFuZCB5ZCBzbyBoaWdoZXN0IG9yZGVyIGRpZ2l0IG9mIHlkIGlzID49IGJhc2UvMlxyXG4gICAgICAgICAgayA9IGJhc2UgLyAoeWRbMF0gKyAxKSB8IDA7XHJcblxyXG4gICAgICAgICAgaWYgKGsgPiAxKSB7XHJcbiAgICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgICAgeGQgPSBtdWx0aXBseUludGVnZXIoeGQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgICB5TCA9IHlkLmxlbmd0aDtcclxuICAgICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgeGkgPSB5TDtcclxuICAgICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgIC8vIEFkZCB6ZXJvcyB0byBtYWtlIHJlbWFpbmRlciBhcyBsb25nIGFzIGRpdmlzb3IuXHJcbiAgICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOykgcmVtW3JlbUwrK10gPSAwO1xyXG5cclxuICAgICAgICAgIHl6ID0geWQuc2xpY2UoKTtcclxuICAgICAgICAgIHl6LnVuc2hpZnQoMCk7XHJcbiAgICAgICAgICB5ZDAgPSB5ZFswXTtcclxuXHJcbiAgICAgICAgICBpZiAoeWRbMV0gPj0gYmFzZSAvIDIpICsreWQwO1xyXG5cclxuICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgayA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgY21wID0gY29tcGFyZSh5ZCwgcmVtLCB5TCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdHJpYWwgZGlnaXQsIGsuXHJcbiAgICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgICBpZiAoeUwgIT0gcmVtTCkgcmVtMCA9IHJlbTAgKiBiYXNlICsgKHJlbVsxXSB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gayB3aWxsIGJlIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byB0aGUgY3VycmVudCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgayA9IHJlbTAgLyB5ZDAgfCAwO1xyXG5cclxuICAgICAgICAgICAgICAvLyAgQWxnb3JpdGhtOlxyXG4gICAgICAgICAgICAgIC8vICAxLiBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0IChrKVxyXG4gICAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIGstLVxyXG4gICAgICAgICAgICAgIC8vICAzLiByZW1haW5kZXIgLT0gcHJvZHVjdFxyXG4gICAgICAgICAgICAgIC8vICA0LiBpZiBwcm9kdWN0IHdhcyA8IHJlbWFpbmRlciBhdCAyOlxyXG4gICAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxyXG4gICAgICAgICAgICAgIC8vICAgIDYuIElmIHJlbWFpbmRlciA+IGRpdmlzb3I6IHJlbWFpbmRlciAtPSBkaXZpc29yLCBrKytcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGsgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKSBrID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcHJvZHVjdCA9IGRpdmlzb3IgKiB0cmlhbCBkaWdpdC5cclxuICAgICAgICAgICAgICAgIHByb2QgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbXBhcmUgcHJvZHVjdCBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID4gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgaWYgKGNtcCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIGstLTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSBwcm9kdWN0LlxyXG4gICAgICAgICAgICAgICAgICBzdWJ0cmFjdChwcm9kLCB5TCA8IHByb2RMID8geXogOiB5ZCwgcHJvZEwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgayBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdywgc28gY2hhbmdlIGNtcCB0byAxXHJcbiAgICAgICAgICAgICAgICAvLyB0byBhdm9pZCBpdC4gSWYgayBpcyAxIHRoZXJlIGlzIGEgbmVlZCB0byBjb21wYXJlIHlkIGFuZCByZW0gYWdhaW4gYmVsb3cuXHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PSAwKSBjbXAgPSBrID0gMTtcclxuICAgICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICBpZiAocHJvZEwgPCByZW1MKSBwcm9kLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCBwcm9kLCByZW1MLCBiYXNlKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCBwcmV2aW91cyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgaWYgKGNtcCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgY21wID0gY29tcGFyZSh5ZCwgcmVtLCB5TCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IG5ldyByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICBrKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgICAgfSAgICAvLyBpZiBjbXAgPT09IDEsIGsgd2lsbCBiZSAwXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdGhlIG5leHQgZGlnaXQsIGssIHRvIHRoZSByZXN1bHQgYXJyYXkuXHJcbiAgICAgICAgICAgIHFkW2krK10gPSBrO1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgJiYgcmVtWzBdKSB7XHJcbiAgICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZW0gPSBbeGRbeGldXTtcclxuICAgICAgICAgICAgICByZW1MID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9PSB2b2lkIDApICYmIHNkLS0pO1xyXG5cclxuICAgICAgICAgIG1vcmUgPSByZW1bMF0gIT09IHZvaWQgMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExlYWRpbmcgemVybz9cclxuICAgICAgICBpZiAoIXFkWzBdKSBxZC5zaGlmdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBsb2dCYXNlIGlzIDEgd2hlbiBkaXZpZGUgaXMgYmVpbmcgdXNlZCBmb3IgYmFzZSBjb252ZXJzaW9uLlxyXG4gICAgICBpZiAobG9nQmFzZSA9PSAxKSB7XHJcbiAgICAgICAgcS5lID0gZTtcclxuICAgICAgICBpbmV4YWN0ID0gbW9yZTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gVG8gY2FsY3VsYXRlIHEuZSwgZmlyc3QgZ2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHFkWzBdLlxyXG4gICAgICAgIGZvciAoaSA9IDEsIGsgPSBxZFswXTsgayA+PSAxMDsgayAvPSAxMCkgaSsrO1xyXG4gICAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XHJcblxyXG4gICAgICAgIGZpbmFsaXNlKHEsIGRwID8gcHIgKyBxLmUgKyAxIDogcHIsIHJtLCBtb3JlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHE7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJvdW5kIGB4YCB0byBgc2RgIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICogQ2hlY2sgZm9yIG92ZXIvdW5kZXItZmxvdy5cclxuICAgKi9cclxuICAgZnVuY3Rpb24gZmluYWxpc2UoeCwgc2QsIHJtLCBpc1RydW5jYXRlZCkge1xyXG4gICAgdmFyIGRpZ2l0cywgaSwgaiwgaywgcmQsIHJvdW5kVXAsIHcsIHhkLCB4ZGksXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIC8vIERvbid0IHJvdW5kIGlmIHNkIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxyXG4gICAgb3V0OiBpZiAoc2QgIT0gbnVsbCkge1xyXG4gICAgICB4ZCA9IHguZDtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5L05hTi5cclxuICAgICAgaWYgKCF4ZCkgcmV0dXJuIHg7XHJcblxyXG4gICAgICAvLyByZDogdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgLy8gdzogdGhlIHdvcmQgb2YgeGQgY29udGFpbmluZyByZCwgYSBiYXNlIDFlNyBudW1iZXIuXHJcbiAgICAgIC8vIHhkaTogdGhlIGluZGV4IG9mIHcgd2l0aGluIHhkLlxyXG4gICAgICAvLyBkaWdpdHM6IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgIC8vIGk6IHdoYXQgd291bGQgYmUgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3IGlmIGFsbCB0aGUgbnVtYmVycyB3ZXJlIDcgZGlnaXRzIGxvbmcgKGkuZS4gaWZcclxuICAgICAgLy8gdGhleSBoYWQgbGVhZGluZyB6ZXJvcylcclxuICAgICAgLy8gajogaWYgPiAwLCB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiB3IChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuXHJcbiAgICAgIC8vIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkgeGQuXHJcbiAgICAgIGZvciAoZGlnaXRzID0gMSwgayA9IHhkWzBdOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuICAgICAgaSA9IHNkIC0gZGlnaXRzO1xyXG5cclxuICAgICAgLy8gSXMgdGhlIHJvdW5kaW5nIGRpZ2l0IGluIHRoZSBmaXJzdCB3b3JkIG9mIHhkP1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICAgIGogPSBzZDtcclxuICAgICAgICB3ID0geGRbeGRpID0gMF07XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICAgIHJkID0gdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSAlIDEwIHwgMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgICAgICBrID0geGQubGVuZ3RoO1xyXG4gICAgICAgIGlmICh4ZGkgPj0gaykge1xyXG4gICAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBOZWVkZWQgYnkgYG5hdHVyYWxFeHBvbmVudGlhbGAsIGBuYXR1cmFsTG9nYXJpdGhtYCBhbmQgYHNxdWFyZVJvb3RgLlxyXG4gICAgICAgICAgICBmb3IgKDsgaysrIDw9IHhkaTspIHhkLnB1c2goMCk7XHJcbiAgICAgICAgICAgIHcgPSByZCA9IDA7XHJcbiAgICAgICAgICAgIGRpZ2l0cyA9IDE7XHJcbiAgICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcbiAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWsgb3V0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3ID0gayA9IHhkW3hkaV07XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgICAgICBmb3IgKGRpZ2l0cyA9IDE7IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG5cclxuICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcuXHJcbiAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcsIGFkanVzdGVkIGZvciBsZWFkaW5nIHplcm9zLlxyXG4gICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIHcgaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkaWdpdHMuXHJcbiAgICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZGlnaXRzO1xyXG5cclxuICAgICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICAgICAgcmQgPSBqIDwgMCA/IDAgOiB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQXJlIHRoZXJlIGFueSBub24temVybyBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0P1xyXG4gICAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fFxyXG4gICAgICAgIHhkW3hkaSArIDFdICE9PSB2b2lkIDAgfHwgKGogPCAwID8gdyA6IHcgJSBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkpO1xyXG5cclxuICAgICAgLy8gVGhlIGV4cHJlc3Npb24gYHcgJSBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSlgIHJldHVybnMgYWxsIHRoZSBkaWdpdHMgb2YgdyB0byB0aGUgcmlnaHRcclxuICAgICAgLy8gb2YgdGhlIGRpZ2l0IGF0IChsZWZ0LXRvLXJpZ2h0KSBpbmRleCBqLCBlLmcuIGlmIHcgaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uXHJcbiAgICAgIC8vIHdpbGwgZ2l2ZSA3MTQuXHJcblxyXG4gICAgICByb3VuZFVwID0gcm0gPCA0XHJcbiAgICAgICAgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKHJtID09IDQgfHwgaXNUcnVuY2F0ZWQgfHwgcm0gPT0gNiAmJlxyXG5cclxuICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGRpZ2l0IHRvIHRoZSBsZWZ0IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBvZGQuXHJcbiAgICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgICBybSA9PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgICBpZiAoc2QgPCAxIHx8ICF4ZFswXSkge1xyXG4gICAgICAgIHhkLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgICAvLyBDb252ZXJ0IHNkIHRvIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgICAgc2QgLT0geC5lICsgMTtcclxuXHJcbiAgICAgICAgICAvLyAxLCAwLjEsIDAuMDEsIDAuMDAxLCAwLjAwMDEgZXRjLlxyXG4gICAgICAgICAgeGRbMF0gPSBtYXRocG93KDEwLCAoTE9HX0JBU0UgLSBzZCAlIExPR19CQVNFKSAlIExPR19CQVNFKTtcclxuICAgICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHhkWzBdID0geC5lID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgZXhjZXNzIGRpZ2l0cy5cclxuICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgIHhkLmxlbmd0aCA9IHhkaTtcclxuICAgICAgICBrID0gMTtcclxuICAgICAgICB4ZGktLTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4ZC5sZW5ndGggPSB4ZGkgKyAxO1xyXG4gICAgICAgIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xyXG5cclxuICAgICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgLy8gaiA+IDAgbWVhbnMgaSA+IG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIHcuXHJcbiAgICAgICAgeGRbeGRpXSA9IGogPiAwID8gKHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSAlIG1hdGhwb3coMTAsIGopIHwgMCkgKiBrIDogMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuICAgICAgICBmb3IgKDs7KSB7XHJcblxyXG4gICAgICAgICAgLy8gSXMgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgICAgICBpZiAoeGRpID09IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgbGVuZ3RoIG9mIHhkWzBdIGJlZm9yZSBrIGlzIGFkZGVkLlxyXG4gICAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApIGkrKztcclxuICAgICAgICAgICAgaiA9IHhkWzBdICs9IGs7XHJcbiAgICAgICAgICAgIGZvciAoayA9IDE7IGogPj0gMTA7IGogLz0gMTApIGsrKztcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICAgIGlmIChpICE9IGspIHtcclxuICAgICAgICAgICAgICB4LmUrKztcclxuICAgICAgICAgICAgICBpZiAoeGRbMF0gPT0gQkFTRSkgeGRbMF0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhkW3hkaV0gKz0gaztcclxuICAgICAgICAgICAgaWYgKHhkW3hkaV0gIT0gQkFTRSkgYnJlYWs7XHJcbiAgICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XHJcbiAgICAgICAgICAgIGsgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGkgPSB4ZC5sZW5ndGg7IHhkWy0taV0gPT09IDA7KSB4ZC5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXh0ZXJuYWwpIHtcclxuXHJcbiAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICBpZiAoeC5lID4gQ3Rvci5tYXhFKSB7XHJcblxyXG4gICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgeC5lID0gTmFOO1xyXG5cclxuICAgICAgLy8gVW5kZXJmbG93P1xyXG4gICAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIC8vIEN0b3IudW5kZXJmbG93ID0gdHJ1ZTtcclxuICAgICAgfSAvLyBlbHNlIEN0b3IudW5kZXJmbG93ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5vbkZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgdmFyIGssXHJcbiAgICAgIGUgPSB4LmUsXHJcbiAgICAgIHN0ciA9IGRpZ2l0c1RvU3RyaW5nKHguZCksXHJcbiAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpICsgZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyAnZScgOiAnZSsnKSArIHguZTtcclxuICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuICAgICAgc3RyID0gJzAuJyArIGdldFplcm9TdHJpbmcoLWUgLSAxKSArIHN0cjtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICB9IGVsc2UgaWYgKGUgPj0gbGVuKSB7XHJcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGUgKyAxIC0gbGVuKTtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBlIC0gMSkgPiAwKSBzdHIgPSBzdHIgKyAnLicgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKChrID0gZSArIDEpIDwgbGVuKSBzdHIgPSBzdHIuc2xpY2UoMCwgaykgKyAnLicgKyBzdHIuc2xpY2Uoayk7XHJcbiAgICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgICBpZiAoZSArIDEgPT09IGxlbikgc3RyICs9ICcuJztcclxuICAgICAgICBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIHRoZSBiYXNlIDEwIGV4cG9uZW50IGZyb20gdGhlIGJhc2UgMWU3IGV4cG9uZW50LlxyXG4gIGZ1bmN0aW9uIGdldEJhc2UxMEV4cG9uZW50KGRpZ2l0cywgZSkge1xyXG4gICAgdmFyIHcgPSBkaWdpdHNbMF07XHJcblxyXG4gICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkuXHJcbiAgICBmb3IgKCBlICo9IExPR19CQVNFOyB3ID49IDEwOyB3IC89IDEwKSBlKys7XHJcbiAgICByZXR1cm4gZTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBnZXRMbjEwKEN0b3IsIHNkLCBwcikge1xyXG4gICAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcclxuXHJcbiAgICAgIC8vIFJlc2V0IGdsb2JhbCBzdGF0ZSBpbiBjYXNlIHRoZSBleGNlcHRpb24gaXMgY2F1Z2h0LlxyXG4gICAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICAgIGlmIChwcikgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBnZXRQaShDdG9yLCBzZCwgcm0pIHtcclxuICAgIGlmIChzZCA+IFBJX1BSRUNJU0lPTikgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoUEkpLCBzZCwgcm0sIHRydWUpO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldFByZWNpc2lvbihkaWdpdHMpIHtcclxuICAgIHZhciB3ID0gZGlnaXRzLmxlbmd0aCAtIDEsXHJcbiAgICAgIGxlbiA9IHcgKiBMT0dfQkFTRSArIDE7XHJcblxyXG4gICAgdyA9IGRpZ2l0c1t3XTtcclxuXHJcbiAgICAvLyBJZiBub24temVyby4uLlxyXG4gICAgaWYgKHcpIHtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgICAgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKSBsZW4tLTtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZC5cclxuICAgICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKSBsZW4rKztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGVuO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldFplcm9TdHJpbmcoaykge1xyXG4gICAgdmFyIHpzID0gJyc7XHJcbiAgICBmb3IgKDsgay0tOykgenMgKz0gJzAnO1xyXG4gICAgcmV0dXJuIHpzO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIERlY2ltYWwgYHhgIHRvIHRoZSBwb3dlciBgbmAsIHdoZXJlIGBuYCBpcyBhblxyXG4gICAqIGludGVnZXIgb2YgdHlwZSBudW1iZXIuXHJcbiAgICpcclxuICAgKiBJbXBsZW1lbnRzICdleHBvbmVudGlhdGlvbiBieSBzcXVhcmluZycuIENhbGxlZCBieSBgcG93YCBhbmQgYHBhcnNlT3RoZXJgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaW50UG93KEN0b3IsIHgsIG4sIHByKSB7XHJcbiAgICB2YXIgaXNUcnVuY2F0ZWQsXHJcbiAgICAgIHIgPSBuZXcgQ3RvcigxKSxcclxuXHJcbiAgICAgIC8vIE1heCBuIG9mIDkwMDcxOTkyNTQ3NDA5OTEgdGFrZXMgNTMgbG9vcCBpdGVyYXRpb25zLlxyXG4gICAgICAvLyBNYXhpbXVtIGRpZ2l0cyBhcnJheSBsZW5ndGg7IGxlYXZlcyBbMjgsIDM0XSBndWFyZCBkaWdpdHMuXHJcbiAgICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICBpZiAobiAlIDIpIHtcclxuICAgICAgICByID0gci50aW1lcyh4KTtcclxuICAgICAgICBpZiAodHJ1bmNhdGUoci5kLCBrKSkgaXNUcnVuY2F0ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuID0gbWF0aGZsb29yKG4gLyAyKTtcclxuICAgICAgaWYgKG4gPT09IDApIHtcclxuXHJcbiAgICAgICAgLy8gVG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgd2hlbiByLmQgaXMgdHJ1bmNhdGVkLCBpbmNyZW1lbnQgdGhlIGxhc3Qgd29yZCBpZiBpdCBpcyB6ZXJvLlxyXG4gICAgICAgIG4gPSByLmQubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoaXNUcnVuY2F0ZWQgJiYgci5kW25dID09PSAwKSArK3IuZFtuXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHRydW5jYXRlKHguZCwgayk7XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGlzT2RkKG4pIHtcclxuICAgIHJldHVybiBuLmRbbi5kLmxlbmd0aCAtIDFdICYgMTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIEhhbmRsZSBgbWF4YCBhbmQgYG1pbmAuIGBsdGd0YCBpcyAnbHQnIG9yICdndCcuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWF4T3JNaW4oQ3RvciwgYXJncywgbHRndCkge1xyXG4gICAgdmFyIHksXHJcbiAgICAgIHggPSBuZXcgQ3RvcihhcmdzWzBdKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOykge1xyXG4gICAgICB5ID0gbmV3IEN0b3IoYXJnc1tpXSk7XHJcbiAgICAgIGlmICgheS5zKSB7XHJcbiAgICAgICAgeCA9IHk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH0gZWxzZSBpZiAoeFtsdGd0XSh5KSkge1xyXG4gICAgICAgIHggPSB5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzLlxyXG4gICAqXHJcbiAgICogVGF5bG9yL01hY2xhdXJpbiBzZXJpZXMuXHJcbiAgICpcclxuICAgKiBleHAoeCkgPSB4XjAvMCEgKyB4XjEvMSEgKyB4XjIvMiEgKyB4XjMvMyEgKyAuLi5cclxuICAgKlxyXG4gICAqIEFyZ3VtZW50IHJlZHVjdGlvbjpcclxuICAgKiAgIFJlcGVhdCB4ID0geCAvIDMyLCBrICs9IDUsIHVudGlsIHx4fCA8IDAuMVxyXG4gICAqICAgZXhwKHgpID0gZXhwKHggLyAyXmspXigyXmspXHJcbiAgICpcclxuICAgKiBQcmV2aW91c2x5LCB0aGUgYXJndW1lbnQgd2FzIGluaXRpYWxseSByZWR1Y2VkIGJ5XHJcbiAgICogZXhwKHgpID0gZXhwKHIpICogMTBeayAgd2hlcmUgciA9IHggLSBrICogbG4xMCwgayA9IGZsb29yKHggLyBsbjEwKVxyXG4gICAqIHRvIGZpcnN0IHB1dCByIGluIHRoZSByYW5nZSBbMCwgbG4xMF0sIGJlZm9yZSBkaXZpZGluZyBieSAzMiB1bnRpbCB8eHwgPCAwLjEsIGJ1dCB0aGlzIHdhc1xyXG4gICAqIGZvdW5kIHRvIGJlIHNsb3dlciB0aGFuIGp1c3QgZGl2aWRpbmcgcmVwZWF0ZWRseSBieSAzMiBhcyBhYm92ZS5cclxuICAgKlxyXG4gICAqIE1heCBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJzIwNzIzMjY1ODM2OTQ2NDEzJykgPSA2LjNlKzkwMDAwMDAwMDAwMDAwMDBcclxuICAgKiBNaW4gaW50ZWdlciBhcmd1bWVudDogZXhwKCctMjA3MjMyNjU4MzY5NDY0MTEnKSA9IDEuMmUtOTAwMDAwMDAwMDAwMDAwMFxyXG4gICAqIChNYXRoIG9iamVjdCBpbnRlZ2VyIG1pbi9tYXg6IE1hdGguZXhwKDcwOSkgPSA4LjJlKzMwNywgTWF0aC5leHAoLTc0NSkgPSA1ZS0zMjQpXHJcbiAgICpcclxuICAgKiAgZXhwKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqICBleHAoLUluZmluaXR5KSA9IDBcclxuICAgKiAgZXhwKE5hTikgICAgICAgPSBOYU5cclxuICAgKiAgZXhwKMKxMCkgICAgICAgID0gMVxyXG4gICAqXHJcbiAgICogIGV4cCh4KSBpcyBub24tdGVybWluYXRpbmcgZm9yIGFueSBmaW5pdGUsIG5vbi16ZXJvIHguXHJcbiAgICpcclxuICAgKiAgVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG5hdHVyYWxFeHBvbmVudGlhbCh4LCBzZCkge1xyXG4gICAgdmFyIGRlbm9taW5hdG9yLCBndWFyZCwgaiwgcG93LCBzdW0sIHQsIHdwcixcclxuICAgICAgcmVwID0gMCxcclxuICAgICAgaSA9IDAsXHJcbiAgICAgIGsgPSAwLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG5cclxuICAgIC8vIDAvTmFOL0luZmluaXR5P1xyXG4gICAgaWYgKCF4LmQgfHwgIXguZFswXSB8fCB4LmUgPiAxNykge1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKHguZFxyXG4gICAgICAgID8gIXguZFswXSA/IDEgOiB4LnMgPCAwID8gMCA6IDEgLyAwXHJcbiAgICAgICAgOiB4LnMgPyB4LnMgPCAwID8gMCA6IHggOiAwIC8gMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgd3ByID0gcHI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3cHIgPSBzZDtcclxuICAgIH1cclxuXHJcbiAgICB0ID0gbmV3IEN0b3IoMC4wMzEyNSk7XHJcblxyXG4gICAgLy8gd2hpbGUgYWJzKHgpID49IDAuMVxyXG4gICAgd2hpbGUgKHguZSA+IC0yKSB7XHJcblxyXG4gICAgICAvLyB4ID0geCAvIDJeNVxyXG4gICAgICB4ID0geC50aW1lcyh0KTtcclxuICAgICAgayArPSA1O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVzZSAyICogbG9nMTAoMl5rKSArIDUgKGVtcGlyaWNhbGx5IGRlcml2ZWQpIHRvIGVzdGltYXRlIHRoZSBpbmNyZWFzZSBpbiBwcmVjaXNpb25cclxuICAgIC8vIG5lY2Vzc2FyeSB0byBlbnN1cmUgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBjb3JyZWN0LlxyXG4gICAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcclxuICAgIHdwciArPSBndWFyZDtcclxuICAgIGRlbm9taW5hdG9yID0gcG93ID0gc3VtID0gbmV3IEN0b3IoMSk7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHdwcjtcclxuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIHBvdyA9IGZpbmFsaXNlKHBvdy50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgICAgZGVub21pbmF0b3IgPSBkZW5vbWluYXRvci50aW1lcygrK2kpO1xyXG4gICAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKHBvdywgZGVub21pbmF0b3IsIHdwciwgMSkpO1xyXG5cclxuICAgICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcclxuICAgICAgICBqID0gaztcclxuICAgICAgICB3aGlsZSAoai0tKSBzdW0gPSBmaW5hbGlzZShzdW0udGltZXMoc3VtKSwgd3ByLCAxKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OS5cclxuICAgICAgICAvLyBJZiBzbywgcmVwZWF0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDE4LCByb3VuZGluZzogMVxyXG4gICAgICAgIC8vIGV4cCgxOC40MDQyNzI0NjI1OTUwMzQwODM1Njc3OTM5MTk4NDM3NjEpID0gOTgzNzI1NjAuMTIyOTk5OTk5OSAoc2hvdWxkIGJlIDk4MzcyNTYwLjEyMylcclxuICAgICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgIGlmIChyZXAgPCAzICYmIGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xyXG4gICAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcclxuICAgICAgICAgICAgZGVub21pbmF0b3IgPSBwb3cgPSB0ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICByZXArKztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5hbGlzZShzdW0sIEN0b3IucHJlY2lzaW9uID0gcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN1bSA9IHQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cy5cclxuICAgKlxyXG4gICAqICBsbigtbikgICAgICAgID0gTmFOXHJcbiAgICogIGxuKDApICAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiAgbG4oLTApICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICBsbigxKSAgICAgICAgID0gMFxyXG4gICAqICBsbihJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiAgbG4oLUluZmluaXR5KSA9IE5hTlxyXG4gICAqICBsbihOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKiAgbG4obikgKG4gIT0gMSkgaXMgbm9uLXRlcm1pbmF0aW5nLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xyXG4gICAgdmFyIGMsIGMwLCBkZW5vbWluYXRvciwgZSwgbnVtZXJhdG9yLCByZXAsIHN1bSwgdCwgd3ByLCB4MSwgeDIsXHJcbiAgICAgIG4gPSAxLFxyXG4gICAgICBndWFyZCA9IDEwLFxyXG4gICAgICB4ID0geSxcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gICAgLy8gSXMgeCBuZWdhdGl2ZSBvciBJbmZpbml0eSwgTmFOLCAwIG9yIDE/XHJcbiAgICBpZiAoeC5zIDwgMCB8fCAheGQgfHwgIXhkWzBdIHx8ICF4LmUgJiYgeGRbMF0gPT0gMSAmJiB4ZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoeGQgJiYgIXhkWzBdID8gLTEgLyAwIDogeC5zICE9IDEgPyBOYU4gOiB4ZCA/IDAgOiB4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICB3cHIgPSBwcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdwciA9IHNkO1xyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IGd1YXJkO1xyXG4gICAgYyA9IGRpZ2l0c1RvU3RyaW5nKHhkKTtcclxuICAgIGMwID0gYy5jaGFyQXQoMCk7XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKGUgPSB4LmUpIDwgMS41ZTE1KSB7XHJcblxyXG4gICAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICAgIC8vIFRoZSBzZXJpZXMgY29udmVyZ2VzIGZhc3RlciB0aGUgY2xvc2VyIHRoZSBhcmd1bWVudCBpcyB0byAxLCBzbyB1c2luZ1xyXG4gICAgICAvLyBsbihhXmIpID0gYiAqIGxuKGEpLCAgIGxuKGEpID0gbG4oYV5iKSAvIGJcclxuICAgICAgLy8gbXVsdGlwbHkgdGhlIGFyZ3VtZW50IGJ5IGl0c2VsZiB1bnRpbCB0aGUgbGVhZGluZyBkaWdpdHMgb2YgdGhlIHNpZ25pZmljYW5kIGFyZSA3LCA4LCA5LFxyXG4gICAgICAvLyAxMCwgMTEsIDEyIG9yIDEzLCByZWNvcmRpbmcgdGhlIG51bWJlciBvZiBtdWx0aXBsaWNhdGlvbnMgc28gdGhlIHN1bSBvZiB0aGUgc2VyaWVzIGNhblxyXG4gICAgICAvLyBsYXRlciBiZSBkaXZpZGVkIGJ5IHRoaXMgbnVtYmVyLCB0aGVuIHNlcGFyYXRlIG91dCB0aGUgcG93ZXIgb2YgMTAgdXNpbmdcclxuICAgICAgLy8gbG4oYSoxMF5iKSA9IGxuKGEpICsgYipsbigxMCkuXHJcblxyXG4gICAgICAvLyBtYXggbiBpcyAyMSAoZ2l2ZXMgMC45LCAxLjAgb3IgMS4xKSAoOWUxNSAvIDIxID0gNC4yZTE0KS5cclxuICAgICAgLy93aGlsZSAoYzAgPCA5ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDEpIHtcclxuICAgICAgLy8gbWF4IG4gaXMgNiAoZ2l2ZXMgMC43IC0gMS4zKVxyXG4gICAgICB3aGlsZSAoYzAgPCA3ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDMpIHtcclxuICAgICAgICB4ID0geC50aW1lcyh5KTtcclxuICAgICAgICBjID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgICAgICBjMCA9IGMuY2hhckF0KDApO1xyXG4gICAgICAgIG4rKztcclxuICAgICAgfVxyXG5cclxuICAgICAgZSA9IHguZTtcclxuXHJcbiAgICAgIGlmIChjMCA+IDEpIHtcclxuICAgICAgICB4ID0gbmV3IEN0b3IoJzAuJyArIGMpO1xyXG4gICAgICAgIGUrKztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4ID0gbmV3IEN0b3IoYzAgKyAnLicgKyBjLnNsaWNlKDEpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFRoZSBhcmd1bWVudCByZWR1Y3Rpb24gbWV0aG9kIGFib3ZlIG1heSByZXN1bHQgaW4gb3ZlcmZsb3cgaWYgdGhlIGFyZ3VtZW50IHkgaXMgYSBtYXNzaXZlXHJcbiAgICAgIC8vIG51bWJlciB3aXRoIGV4cG9uZW50ID49IDE1MDAwMDAwMDAwMDAwMDAgKDllMTUgLyA2ID0gMS41ZTE1KSwgc28gaW5zdGVhZCByZWNhbGwgdGhpc1xyXG4gICAgICAvLyBmdW5jdGlvbiB1c2luZyBsbih4KjEwXmUpID0gbG4oeCkgKyBlKmxuKDEwKS5cclxuICAgICAgdCA9IGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyAnJyk7XHJcbiAgICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSksIHdwciAtIGd1YXJkKS5wbHVzKHQpO1xyXG4gICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG5cclxuICAgICAgcmV0dXJuIHNkID09IG51bGwgPyBmaW5hbGlzZSh4LCBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSkgOiB4O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHgxIGlzIHggcmVkdWNlZCB0byBhIHZhbHVlIG5lYXIgMS5cclxuICAgIHgxID0geDtcclxuXHJcbiAgICAvLyBUYXlsb3Igc2VyaWVzLlxyXG4gICAgLy8gbG4oeSkgPSBsbigoMSArIHgpLygxIC0geCkpID0gMih4ICsgeF4zLzMgKyB4XjUvNSArIHheNy83ICsgLi4uKVxyXG4gICAgLy8gd2hlcmUgeCA9ICh5IC0gMSkvKHkgKyAxKSAgICAofHh8IDwgMSlcclxuICAgIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgZGVub21pbmF0b3IgPSAzO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgbnVtZXJhdG9yID0gZmluYWxpc2UobnVtZXJhdG9yLnRpbWVzKHgyKSwgd3ByLCAxKTtcclxuICAgICAgdCA9IHN1bS5wbHVzKGRpdmlkZShudW1lcmF0b3IsIG5ldyBDdG9yKGRlbm9taW5hdG9yKSwgd3ByLCAxKSk7XHJcblxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICAgIHN1bSA9IHN1bS50aW1lcygyKTtcclxuXHJcbiAgICAgICAgLy8gUmV2ZXJzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLiBDaGVjayB0aGF0IGUgaXMgbm90IDAgYmVjYXVzZSwgYmVzaWRlcyBwcmV2ZW50aW5nIGFuXHJcbiAgICAgICAgLy8gdW5uZWNlc3NhcnkgY2FsY3VsYXRpb24sIC0wICsgMCA9ICswIGFuZCB0byBlbnN1cmUgY29ycmVjdCByb3VuZGluZyAtMCBuZWVkcyB0byBzdGF5IC0wLlxyXG4gICAgICAgIGlmIChlICE9PSAwKSBzdW0gPSBzdW0ucGx1cyhnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgJycpKTtcclxuICAgICAgICBzdW0gPSBkaXZpZGUoc3VtLCBuZXcgQ3RvcihuKSwgd3ByLCAxKTtcclxuXHJcbiAgICAgICAgLy8gSXMgcm0gPiAzIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgNDk5OSwgb3Igcm0gPCA0IChvciB0aGUgc3VtbWF0aW9uIGhhc1xyXG4gICAgICAgIC8vIGJlZW4gcmVwZWF0ZWQgcHJldmlvdXNseSkgYW5kIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyA5OTk5P1xyXG4gICAgICAgIC8vIElmIHNvLCByZXN0YXJ0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDEyLCByb3VuZGluZzogMVxyXG4gICAgICAgIC8vIGxuKDEzNTUyMDAyOC42MTI2MDkxNzE0MjY1MzgxNTMzKSA9IDE4LjcyNDYyOTk5OTkgd2hlbiBpdCBzaG91bGQgYmUgMTguNzI0NjMuXHJcbiAgICAgICAgLy8gYHdwciAtIGd1YXJkYCBpcyB0aGUgaW5kZXggb2YgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcclxuICAgICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XHJcbiAgICAgICAgICAgIHQgPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgxLm1pbnVzKDEpLCB4MS5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICAgICAgICAgIGRlbm9taW5hdG9yID0gcmVwID0gMTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5hbGlzZShzdW0sIEN0b3IucHJlY2lzaW9uID0gcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN1bSA9IHQ7XHJcbiAgICAgIGRlbm9taW5hdG9yICs9IDI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gwrFJbmZpbml0eSwgTmFOLlxyXG4gIGZ1bmN0aW9uIG5vbkZpbml0ZVRvU3RyaW5nKHgpIHtcclxuICAgIC8vIFVuc2lnbmVkLlxyXG4gICAgcmV0dXJuIFN0cmluZyh4LnMgKiB4LnMgLyAwKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIHN0cmluZyBgc3RyYC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XHJcbiAgICB2YXIgZSwgaSwgbGVuO1xyXG5cclxuICAgIC8vIERlY2ltYWwgcG9pbnQ/XHJcbiAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gICAgaWYgKChpID0gc3RyLnNlYXJjaCgvZS9pKSkgPiAwKSB7XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICAgIGlmIChlIDwgMCkgZSA9IGk7XHJcbiAgICAgIGUgKz0gK3N0ci5zbGljZShpICsgMSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgICAvLyBJbnRlZ2VyLlxyXG4gICAgICBlID0gc3RyLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KGxlbiAtIDEpID09PSA0ODsgLS1sZW4pO1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XHJcblxyXG4gICAgaWYgKHN0cikge1xyXG4gICAgICBsZW4gLT0gaTtcclxuICAgICAgeC5lID0gZSA9IGUgLSBpIC0gMTtcclxuICAgICAgeC5kID0gW107XHJcblxyXG4gICAgICAvLyBUcmFuc2Zvcm0gYmFzZVxyXG5cclxuICAgICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgICAgLy8gaSBpcyB3aGVyZSB0byBzbGljZSBzdHIgdG8gZ2V0IHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkuXHJcbiAgICAgIGkgPSAoZSArIDEpICUgTE9HX0JBU0U7XHJcbiAgICAgIGlmIChlIDwgMCkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgIGlmIChpIDwgbGVuKSB7XHJcbiAgICAgICAgaWYgKGkpIHguZC5wdXNoKCtzdHIuc2xpY2UoMCwgaSkpO1xyXG4gICAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XHJcbiAgICAgICAgc3RyID0gc3RyLnNsaWNlKGkpO1xyXG4gICAgICAgIGkgPSBMT0dfQkFTRSAtIHN0ci5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaSAtPSBsZW47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoOyBpLS07KSBzdHIgKz0gJzAnO1xyXG4gICAgICB4LmQucHVzaCgrc3RyKTtcclxuXHJcbiAgICAgIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgICBpZiAoeC5lID4geC5jb25zdHJ1Y3Rvci5tYXhFKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgeC5lID0gTmFOO1xyXG5cclxuICAgICAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICAgICAgfSBlbHNlIGlmICh4LmUgPCB4LmNvbnN0cnVjdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgeC5lID0gMDtcclxuICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgIC8vIHguY29uc3RydWN0b3IudW5kZXJmbG93ID0gdHJ1ZTtcclxuICAgICAgICB9IC8vIGVsc2UgeC5jb25zdHJ1Y3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFplcm8uXHJcbiAgICAgIHguZSA9IDA7XHJcbiAgICAgIHguZCA9IFswXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIGEgc3RyaW5nIGBzdHJgLCB3aGljaCBpcyBub3QgYSBkZWNpbWFsIHZhbHVlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBhcnNlT3RoZXIoeCwgc3RyKSB7XHJcbiAgICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XHJcblxyXG4gICAgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICAgIGlmICghK3N0cikgeC5zID0gTmFOO1xyXG4gICAgICB4LmUgPSBOYU47XHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICAgIGJhc2UgPSAxNjtcclxuICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICB9IGVsc2UgaWYgKGlzT2N0YWwudGVzdChzdHIpKSAge1xyXG4gICAgICBiYXNlID0gODtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHN0cik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSXMgdGhlcmUgYSBiaW5hcnkgZXhwb25lbnQgcGFydD9cclxuICAgIGkgPSBzdHIuc2VhcmNoKC9wL2kpO1xyXG5cclxuICAgIGlmIChpID4gMCkge1xyXG4gICAgICBwID0gK3N0ci5zbGljZShpICsgMSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMiwgaSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAgIC8vIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuICAgIGkgPSBzdHIuaW5kZXhPZignLicpO1xyXG4gICAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChpc0Zsb2F0KSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgICBpID0gbGVuIC0gaTtcclxuXHJcbiAgICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICAgIGRpdmlzb3IgPSBpbnRQb3coQ3RvciwgbmV3IEN0b3IoYmFzZSksIGksIGkgKiAyKTtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgICB4ZSA9IHhkLmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gICAgaWYgKGkgPCAwKSByZXR1cm4gbmV3IEN0b3IoeC5zICogMCk7XHJcbiAgICB4LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgeGUpO1xyXG4gICAgeC5kID0geGQ7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIEF0IHdoYXQgcHJlY2lzaW9uIHRvIHBlcmZvcm0gdGhlIGRpdmlzaW9uIHRvIGVuc3VyZSBleGFjdCBjb252ZXJzaW9uP1xyXG4gICAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAgIC8vIGxvZ1sxMF0oMikgPSAwLjMwMTAzLCBsb2dbMTBdKDgpID0gMC45MDMwOSwgbG9nWzEwXSgxNikgPSAxLjIwNDEyXHJcbiAgICAvLyBFLmcuIGNlaWwoMS4yICogMykgPSA0LCBzbyB1cCB0byA0IGRlY2ltYWwgZGlnaXRzIGFyZSBuZWVkZWQgdG8gcmVwcmVzZW50IDMgaGV4IGludCBkaWdpdHMuXHJcbiAgICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgICAvLyBUaGVyZWZvcmUgdXNpbmcgNCAqIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHN0ciB3aWxsIGFsd2F5cyBiZSBlbm91Z2guXHJcbiAgICBpZiAoaXNGbG9hdCkgeCA9IGRpdmlkZSh4LCBkaXZpc29yLCBsZW4gKiA0KTtcclxuXHJcbiAgICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICAgIGlmIChwKSB4ID0geC50aW1lcyhNYXRoLmFicyhwKSA8IDU0ID8gTWF0aC5wb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBzaW4oeCkgPSB4IC0geF4zLzMhICsgeF41LzUhIC0gLi4uXHJcbiAgICogfHh8IDwgcGkvMlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgICB2YXIgayxcclxuICAgICAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgICBpZiAobGVuIDwgMykgcmV0dXJuIHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbig1eCkgPSAxNipzaW5eNSh4KSAtIDIwKnNpbl4zKHgpICsgNSpzaW4oeClcclxuICAgIC8vIGkuZS4gc2luKHgpID0gMTYqc2luXjUoeC81KSAtIDIwKnNpbl4zKHgvNSkgKyA1KnNpbih4LzUpXHJcbiAgICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgICAvLyBNYXggayBiZWZvcmUgTWF0aC5wb3cgcHJlY2lzaW9uIGxvc3MgaXMgMjJcclxuICAgIHggPSB4LnRpbWVzKE1hdGgucG93KDUsIC1rKSk7XHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICB2YXIgc2luMl94LFxyXG4gICAgICBkNSA9IG5ldyBDdG9yKDUpLFxyXG4gICAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICAgIGQyMCA9IG5ldyBDdG9yKDIwKTtcclxuICAgIGZvciAoOyBrLS07KSB7XHJcbiAgICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luMl94LnRpbWVzKGQxNi50aW1lcyhzaW4yX3gpLm1pbnVzKGQyMCkpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIFRheWxvciBzZXJpZXMgZm9yIGBjb3NgLCBgY29zaGAsIGBzaW5gIGFuZCBgc2luaGAuXHJcbiAgZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gICAgdmFyIGosIHQsIHUsIHgyLFxyXG4gICAgICBpID0gMSxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gICAgdSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgICB1ID0gaXNIeXBlcmJvbGljID8geS5wbHVzKHQpIDogeS5taW51cyh0KTtcclxuICAgICAgeSA9IGRpdmlkZSh0LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgICAgaWYgKHQuZFtrXSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgZm9yIChqID0gazsgdC5kW2pdID09PSB1LmRbal0gJiYgai0tOyk7XHJcbiAgICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBqID0gdTtcclxuICAgICAgdSA9IHk7XHJcbiAgICAgIHkgPSB0O1xyXG4gICAgICB0ID0gajtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgICByZXR1cm4gdDtcclxuICB9XHJcblxyXG5cclxuICAvLyBSZXR1cm4gdGhlIGFic29sdXRlIHZhbHVlIG9mIGB4YCByZWR1Y2VkIHRvIGxlc3MgdGhhbiBvciBlcXVhbCB0byBoYWxmIHBpLlxyXG4gIGZ1bmN0aW9uIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkge1xyXG4gICAgdmFyIHQsXHJcbiAgICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgICAgcGkgPSBnZXRQaShDdG9yLCBDdG9yLnByZWNpc2lvbiwgMSksXHJcbiAgICAgIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgeCA9IHguYWJzKCk7XHJcblxyXG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc05lZyA/IDQgOiAxO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICB0ID0geC5kaXZUb0ludChwaSk7XHJcblxyXG4gICAgaWYgKHQuaXNaZXJvKCkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc05lZyA/IDMgOiAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeCA9IHgubWludXModC50aW1lcyhwaSkpO1xyXG5cclxuICAgICAgLy8gMCA8PSB4IDwgcGlcclxuICAgICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgICBxdWFkcmFudCA9IGlzT2RkKHQpID8gKGlzTmVnID8gMiA6IDMpIDogKGlzTmVnID8gNCA6IDEpO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBxdWFkcmFudCA9IGlzT2RkKHQpID8gKGlzTmVnID8gMSA6IDQpIDogKGlzTmVnID8gMyA6IDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4Lm1pbnVzKHBpKS5hYnMoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgYXMgYSBzdHJpbmcgaW4gYmFzZSBgYmFzZU91dGAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IGluY2x1ZGUgYSBiaW5hcnkgZXhwb25lbnQgc3VmZml4LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRvU3RyaW5nQmluYXJ5KHgsIGJhc2VPdXQsIHNkLCBybSkge1xyXG4gICAgdmFyIGJhc2UsIGUsIGksIGssIGxlbiwgcm91bmRVcCwgc3RyLCB4ZCwgeSxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIGlzRXhwID0gc2QgIT09IHZvaWQgMDtcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHtcclxuICAgICAgc3RyID0gbm9uRmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICAgICAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcblxyXG4gICAgICAvLyBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gYWNjb3JkaW5nIHRvIGB0b0V4cFBvc2AgYW5kIGB0b0V4cE5lZ2A/IE5vLCBidXQgaWYgcmVxdWlyZWQ6XHJcbiAgICAgIC8vIG1heEJpbmFyeUV4cG9uZW50ID0gZmxvb3IoKGRlY2ltYWxFeHBvbmVudCArIDEpICogbG9nWzJdKDEwKSlcclxuICAgICAgLy8gbWluQmluYXJ5RXhwb25lbnQgPSBmbG9vcihkZWNpbWFsRXhwb25lbnQgKiBsb2dbMl0oMTApKVxyXG4gICAgICAvLyBsb2dbMl0oMTApID0gMy4zMjE5MjgwOTQ4ODczNjIzNDc4NzAzMTk0Mjk0ODkzOTAxNzU4NjRcclxuXHJcbiAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgIGJhc2UgPSAyO1xyXG4gICAgICAgIGlmIChiYXNlT3V0ID09IDE2KSB7XHJcbiAgICAgICAgICBzZCA9IHNkICogNCAtIDM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChiYXNlT3V0ID09IDgpIHtcclxuICAgICAgICAgIHNkID0gc2QgKiAzIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmFzZSA9IGJhc2VPdXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENvbnZlcnQgdGhlIG51bWJlciBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgaXRzIGJhc2UgcmFpc2VkIHRvIGEgcG93ZXIgc3VjaFxyXG4gICAgICAvLyB0aGF0IHRoZSBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcblxyXG4gICAgICAvLyBOb24taW50ZWdlci5cclxuICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgICB5LmUgPSBzdHIubGVuZ3RoIC0gaTtcclxuICAgICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xyXG4gICAgICAgIHkuZSA9IHkuZC5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCAxMCwgYmFzZSk7XHJcbiAgICAgIGUgPSBsZW4gPSB4ZC5sZW5ndGg7XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgICAgaWYgKCF4ZFswXSkge1xyXG4gICAgICAgIHN0ciA9IGlzRXhwID8gJzBwKzAnIDogJzAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgZS0tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ID0gbmV3IEN0b3IoeCk7XHJcbiAgICAgICAgICB4LmQgPSB4ZDtcclxuICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICB4ID0gZGl2aWRlKHgsIHksIHNkLCBybSwgMCwgYmFzZSk7XHJcbiAgICAgICAgICB4ZCA9IHguZDtcclxuICAgICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgICByb3VuZFVwID0gaW5leGFjdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgICAgaSA9IHhkW3NkXTtcclxuICAgICAgICBrID0gYmFzZSAvIDI7XHJcbiAgICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xyXG5cclxuICAgICAgICByb3VuZFVwID0gcm0gPCA0XHJcbiAgICAgICAgICA/IChpICE9PSB2b2lkIDAgfHwgcm91bmRVcCkgJiYgKHJtID09PSAwIHx8IHJtID09PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICAgIDogaSA+IGsgfHwgaSA9PT0gayAmJiAocm0gPT09IDQgfHwgcm91bmRVcCB8fCBybSA9PT0gNiAmJiB4ZFtzZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgICBybSA9PT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgICB4ZC5sZW5ndGggPSBzZDtcclxuXHJcbiAgICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgICAvLyBSb3VuZGluZyB1cCBtYXkgbWVhbiB0aGUgcHJldmlvdXMgZGlnaXQgaGFzIHRvIGJlIHJvdW5kZWQgdXAgYW5kIHNvIG9uLlxyXG4gICAgICAgICAgZm9yICg7ICsreGRbLS1zZF0gPiBiYXNlIC0gMTspIHtcclxuICAgICAgICAgICAgeGRbc2RdID0gMDtcclxuICAgICAgICAgICAgaWYgKCFzZCkge1xyXG4gICAgICAgICAgICAgICsrZTtcclxuICAgICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pO1xyXG5cclxuICAgICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICAgIGZvciAoaSA9IDAsIHN0ciA9ICcnOyBpIDwgbGVuOyBpKyspIHN0ciArPSBOVU1FUkFMUy5jaGFyQXQoeGRbaV0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgYmluYXJ5IGV4cG9uZW50IHN1ZmZpeD9cclxuICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgICAgIGlmIChiYXNlT3V0ID09IDE2IHx8IGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XHJcbiAgICAgICAgICAgICAgZm9yICgtLWxlbjsgbGVuICUgaTsgbGVuKyspIHN0ciArPSAnMCc7XHJcbiAgICAgICAgICAgICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIGJhc2VPdXQpO1xyXG4gICAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8geGRbMF0gd2lsbCBhbHdheXMgYmUgYmUgMVxyXG4gICAgICAgICAgICAgIGZvciAoaSA9IDEsIHN0ciA9ICcxLic7IGkgPCBsZW47IGkrKykgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHN0ciA9ICBzdHIgKyAoZSA8IDAgPyAncCcgOiAncCsnKSArIGU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgICAgICAgZm9yICg7ICsrZTspIHN0ciA9ICcwJyArIHN0cjtcclxuICAgICAgICAgIHN0ciA9ICcwLicgKyBzdHI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgrK2UgPiBsZW4pIGZvciAoZSAtPSBsZW47IGUtLSA7KSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZSA8IGxlbikgc3RyID0gc3RyLnNsaWNlKDAsIGUpICsgJy4nICsgc3RyLnNsaWNlKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3RyID0gKGJhc2VPdXQgPT0gMTYgPyAnMHgnIDogYmFzZU91dCA9PSAyID8gJzBiJyA6IGJhc2VPdXQgPT0gOCA/ICcwbycgOiAnJykgKyBzdHI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHgucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRG9lcyBub3Qgc3RyaXAgdHJhaWxpbmcgemVyb3MuXHJcbiAgZnVuY3Rpb24gdHJ1bmNhdGUoYXJyLCBsZW4pIHtcclxuICAgIGlmIChhcnIubGVuZ3RoID4gbGVuKSB7XHJcbiAgICAgIGFyci5sZW5ndGggPSBsZW47XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIERlY2ltYWwgbWV0aG9kc1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgYWJzXHJcbiAgICogIGFjb3NcclxuICAgKiAgYWNvc2hcclxuICAgKiAgYWRkXHJcbiAgICogIGFzaW5cclxuICAgKiAgYXNpbmhcclxuICAgKiAgYXRhblxyXG4gICAqICBhdGFuaFxyXG4gICAqICBhdGFuMlxyXG4gICAqICBjYnJ0XHJcbiAgICogIGNlaWxcclxuICAgKiAgY2xvbmVcclxuICAgKiAgY29uZmlnXHJcbiAgICogIGNvc1xyXG4gICAqICBjb3NoXHJcbiAgICogIGRpdlxyXG4gICAqICBleHBcclxuICAgKiAgZmxvb3JcclxuICAgKiAgaHlwb3RcclxuICAgKiAgbG5cclxuICAgKiAgbG9nXHJcbiAgICogIGxvZzJcclxuICAgKiAgbG9nMTBcclxuICAgKiAgbWF4XHJcbiAgICogIG1pblxyXG4gICAqICBtb2RcclxuICAgKiAgbXVsXHJcbiAgICogIHBvd1xyXG4gICAqICByYW5kb21cclxuICAgKiAgcm91bmRcclxuICAgKiAgc2V0XHJcbiAgICogIHNpZ25cclxuICAgKiAgc2luXHJcbiAgICogIHNpbmhcclxuICAgKiAgc3FydFxyXG4gICAqICBzdWJcclxuICAgKiAgdGFuXHJcbiAgICogIHRhbmhcclxuICAgKiAgdHJ1bmNcclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIGB4YC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYWJzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIGluIHJhZGlhbnMgb2YgYHhgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvcygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFjb3NoKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hY29zaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiBgeGAgYW5kIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5wbHVzKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3NpbmUgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXNpbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhc2luaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXRhbmgoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW5oKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCBpbiByYWRpYW5zIG9mIGB5L3hgIGluIHRoZSByYW5nZSAtcGkgdG8gcGlcclxuICAgKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1waSwgcGldXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB5LWNvb3JkaW5hdGUuXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gICAqXHJcbiAgICogYXRhbjIowrEwLCAtMCkgICAgICAgICAgICAgICA9IMKxcGlcclxuICAgKiBhdGFuMijCsTAsICswKSAgICAgICAgICAgICAgID0gwrEwXHJcbiAgICogYXRhbjIowrEwLCAteCkgICAgICAgICAgICAgICA9IMKxcGkgZm9yIHggPiAwXHJcbiAgICogYXRhbjIowrEwLCB4KSAgICAgICAgICAgICAgICA9IMKxMCBmb3IgeCA+IDBcclxuICAgKiBhdGFuMigteSwgwrEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAgICogYXRhbjIoeSwgwrEwKSAgICAgICAgICAgICAgICA9IHBpLzIgZm9yIHkgPiAwXHJcbiAgICogYXRhbjIowrF5LCAtSW5maW5pdHkpICAgICAgICA9IMKxcGkgZm9yIGZpbml0ZSB5ID4gMFxyXG4gICAqIGF0YW4yKMKxeSwgK0luZmluaXR5KSAgICAgICAgPSDCsTAgZm9yIGZpbml0ZSB5ID4gMFxyXG4gICAqIGF0YW4yKMKxSW5maW5pdHksIHgpICAgICAgICAgPSDCsXBpLzIgZm9yIGZpbml0ZSB4XHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgLUluZmluaXR5KSA9IMKxMypwaS80XHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgK0luZmluaXR5KSA9IMKxcGkvNFxyXG4gICAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICAgKiBhdGFuMih5LCBOYU4pID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhdGFuMih5LCB4KSB7XHJcbiAgICB5ID0gbmV3IHRoaXMoeSk7XHJcbiAgICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgICB2YXIgcixcclxuICAgICAgcHIgPSB0aGlzLnByZWNpc2lvbixcclxuICAgICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgICB3cHIgPSBwciArIDQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTlxyXG4gICAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgICByID0gbmV3IHRoaXMoTmFOKTtcclxuXHJcbiAgICAvLyBCb3RoIMKxSW5maW5pdHlcclxuICAgIH0gZWxzZSBpZiAoIXkuZCAmJiAheC5kKSB7XHJcbiAgICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKHgucyA+IDAgPyAwLjI1IDogMC43NSk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyB4IGlzIMKxSW5maW5pdHkgb3IgeSBpcyDCsTBcclxuICAgIH0gZWxzZSBpZiAoIXguZCB8fCB5LmlzWmVybygpKSB7XHJcbiAgICAgIHIgPSB4LnMgPCAwID8gZ2V0UGkodGhpcywgcHIsIHJtKSA6IG5ldyB0aGlzKDApO1xyXG4gICAgICByLnMgPSB5LnM7XHJcblxyXG4gICAgLy8geSBpcyDCsUluZmluaXR5IG9yIHggaXMgwrEwXHJcbiAgICB9IGVsc2UgaWYgKCF5LmQgfHwgeC5pc1plcm8oKSkge1xyXG4gICAgICByID0gZ2V0UGkodGhpcywgd3ByLCAxKS50aW1lcygwLjUpO1xyXG4gICAgICByLnMgPSB5LnM7XHJcblxyXG4gICAgLy8gQm90aCBub24temVybyBhbmQgZmluaXRlXHJcbiAgICB9IGVsc2UgaWYgKHgucyA8IDApIHtcclxuICAgICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICAgIHRoaXMucm91bmRpbmcgPSAxO1xyXG4gICAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICAgICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICAgIHRoaXMucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgIHRoaXMucm91bmRpbmcgPSBybTtcclxuICAgICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IHRoaXMuYXRhbihkaXZpZGUoeSwgeCwgd3ByLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY3ViZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjYnJ0KHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5jYnJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmRlZCB0byBhbiBpbnRlZ2VyIHVzaW5nIGBST1VORF9DRUlMYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNlaWwoeCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBDb25maWd1cmUgZ2xvYmFsIHNldHRpbmdzIGZvciBhIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgICpcclxuICAgKiBgb2JqYCBpcyBhbiBvYmplY3Qgd2l0aCBvbmUgb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMsXHJcbiAgICpcclxuICAgKiAgIHByZWNpc2lvbiAge251bWJlcn1cclxuICAgKiAgIHJvdW5kaW5nICAge251bWJlcn1cclxuICAgKiAgIHRvRXhwTmVnICAge251bWJlcn1cclxuICAgKiAgIHRvRXhwUG9zICAge251bWJlcn1cclxuICAgKiAgIG1heEUgICAgICAge251bWJlcn1cclxuICAgKiAgIG1pbkUgICAgICAge251bWJlcn1cclxuICAgKiAgIG1vZHVsbyAgICAge251bWJlcn1cclxuICAgKiAgIGNyeXB0byAgICAge2Jvb2xlYW58bnVtYmVyfVxyXG4gICAqXHJcbiAgICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgdGhyb3cgRXJyb3IoZGVjaW1hbEVycm9yICsgJ09iamVjdCBleHBlY3RlZCcpO1xyXG4gICAgdmFyIGksIHAsIHYsXHJcbiAgICAgIHBzID0gW1xyXG4gICAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAgICdyb3VuZGluZycsIDAsIDgsXHJcbiAgICAgICAgJ3RvRXhwTmVnJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICAgJ21heEUnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICAgJ21pbkUnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICAgIF07XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgIGlmICgodiA9IG9ialtwID0gcHNbaV1dKSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSkgdGhpc1twXSA9IHY7XHJcbiAgICAgICAgZWxzZSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgJzogJyArIHYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCh2ID0gb2JqW3AgPSAnY3J5cHRvJ10pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKHYgPT09IHRydWUgfHwgdiA9PT0gZmFsc2UgfHwgdiA9PT0gMCB8fCB2ID09PSAxKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIGNyeXB0byAmJlxyXG4gICAgICAgICAgICAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyB8fCBjcnlwdG8ucmFuZG9tQnl0ZXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzW3BdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuY29zaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBEZWNpbWFsIGNvbnN0cnVjdG9yIHdpdGggdGhlIHNhbWUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIHRoaXMgRGVjaW1hbFxyXG4gICAqIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAgICpcclxuICAgICAqIHYge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSBudW1lcmljIHZhbHVlLlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGVjaW1hbCh2KSB7XHJcbiAgICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgICAgLy8gRGVjaW1hbCBjYWxsZWQgd2l0aG91dCBuZXcuXHJcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgICAgLy8gUmV0YWluIGEgcmVmZXJlbmNlIHRvIHRoaXMgRGVjaW1hbCBjb25zdHJ1Y3RvciwgYW5kIHNoYWRvdyBEZWNpbWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvclxyXG4gICAgICAvLyB3aGljaCBwb2ludHMgdG8gT2JqZWN0LlxyXG4gICAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAgIC8vIER1cGxpY2F0ZS5cclxuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEZWNpbWFsKSB7XHJcbiAgICAgICAgeC5zID0gdi5zO1xyXG4gICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICB4LmQgPSAodiA9IHYuZCkgPyB2LnNsaWNlKCkgOiB2O1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdCA9IHR5cGVvZiB2O1xyXG5cclxuICAgICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgaWYgKHYgPT09IDApIHtcclxuICAgICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IC0xIDogMTtcclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodiA8IDApIHtcclxuICAgICAgICAgIHYgPSAtdjtcclxuICAgICAgICAgIHgucyA9IC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LnMgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBzbWFsbCBpbnRlZ2Vycy5cclxuICAgICAgICBpZiAodiA9PT0gfn52ICYmIHYgPCAxZTcpIHtcclxuICAgICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcbiAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgeC5kID0gW3ZdO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eSwgTmFOLlxyXG4gICAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICAgIGlmICghdikgeC5zID0gTmFOO1xyXG4gICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAodCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB2KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTWludXMgc2lnbj9cclxuICAgICAgaWYgKHYuY2hhckNvZGVBdCgwKSA9PT0gNDUpIHtcclxuICAgICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgICB4LnMgPSAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LnMgPSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaXNEZWNpbWFsLnRlc3QodikgPyBwYXJzZURlY2ltYWwoeCwgdikgOiBwYXJzZU90aGVyKHgsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgICBEZWNpbWFsLlJPVU5EX1VQID0gMDtcclxuICAgIERlY2ltYWwuUk9VTkRfRE9XTiA9IDE7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gICAgRGVjaW1hbC5ST1VORF9GTE9PUiA9IDM7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0hBTEZfVVAgPSA0O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0VWRU4gPSA2O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0NFSUwgPSA3O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICAgIERlY2ltYWwuRVVDTElEID0gOTtcclxuXHJcbiAgICBEZWNpbWFsLmNvbmZpZyA9IERlY2ltYWwuc2V0ID0gY29uZmlnO1xyXG4gICAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG5cclxuICAgIERlY2ltYWwuYWJzID0gYWJzO1xyXG4gICAgRGVjaW1hbC5hY29zID0gYWNvcztcclxuICAgIERlY2ltYWwuYWNvc2ggPSBhY29zaDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5hZGQgPSBhZGQ7XHJcbiAgICBEZWNpbWFsLmFzaW4gPSBhc2luO1xyXG4gICAgRGVjaW1hbC5hc2luaCA9IGFzaW5oOyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmF0YW4gPSBhdGFuO1xyXG4gICAgRGVjaW1hbC5hdGFuaCA9IGF0YW5oOyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmF0YW4yID0gYXRhbjI7XHJcbiAgICBEZWNpbWFsLmNicnQgPSBjYnJ0OyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuY2VpbCA9IGNlaWw7XHJcbiAgICBEZWNpbWFsLmNvcyA9IGNvcztcclxuICAgIERlY2ltYWwuY29zaCA9IGNvc2g7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5kaXYgPSBkaXY7XHJcbiAgICBEZWNpbWFsLmV4cCA9IGV4cDtcclxuICAgIERlY2ltYWwuZmxvb3IgPSBmbG9vcjtcclxuICAgIERlY2ltYWwuaHlwb3QgPSBoeXBvdDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5sbiA9IGxuO1xyXG4gICAgRGVjaW1hbC5sb2cgPSBsb2c7XHJcbiAgICBEZWNpbWFsLmxvZzEwID0gbG9nMTA7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwubG9nMiA9IGxvZzI7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5tYXggPSBtYXg7XHJcbiAgICBEZWNpbWFsLm1pbiA9IG1pbjtcclxuICAgIERlY2ltYWwubW9kID0gbW9kO1xyXG4gICAgRGVjaW1hbC5tdWwgPSBtdWw7XHJcbiAgICBEZWNpbWFsLnBvdyA9IHBvdztcclxuICAgIERlY2ltYWwucmFuZG9tID0gcmFuZG9tO1xyXG4gICAgRGVjaW1hbC5yb3VuZCA9IHJvdW5kO1xyXG4gICAgRGVjaW1hbC5zaWduID0gc2lnbjsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLnNpbiA9IHNpbjtcclxuICAgIERlY2ltYWwuc2luaCA9IHNpbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5zcXJ0ID0gc3FydDtcclxuICAgIERlY2ltYWwuc3ViID0gc3ViO1xyXG4gICAgRGVjaW1hbC50YW4gPSB0YW47XHJcbiAgICBEZWNpbWFsLnRhbmggPSB0YW5oOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICAgIGlmIChvYmogPT09IHZvaWQgMCkgb2JqID0ge307XHJcbiAgICBpZiAob2JqKSB7XHJcbiAgICAgIHBzID0gWydwcmVjaXNpb24nLCAncm91bmRpbmcnLCAndG9FeHBOZWcnLCAndG9FeHBQb3MnLCAnbWF4RScsICdtaW5FJywgJ21vZHVsbycsICdjcnlwdG8nXTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDspIGlmICghb2JqLmhhc093blByb3BlcnR5KHAgPSBwc1tpKytdKSkgb2JqW3BdID0gdGhpc1twXTtcclxuICAgIH1cclxuXHJcbiAgICBEZWNpbWFsLmNvbmZpZyhvYmopO1xyXG5cclxuICAgIHJldHVybiBEZWNpbWFsO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmRpdih5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGUgYmFzZSBvZiB0aGUgbmF0dXJhbCBsb2cuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBleHAoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmV4cCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0ZMT09SYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGZsb29yKHgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDMpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzdW0gb2YgdGhlIHNxdWFyZXMgb2YgdGhlIGFyZ3VtZW50cyxcclxuICAgKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBoeXBvdChhLCBiLCAuLi4pID0gc3FydChhXjIgKyBiXjIgKyAuLi4pXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBoeXBvdCgpIHtcclxuICAgIHZhciBpLCBuLFxyXG4gICAgICB0ID0gbmV3IHRoaXMoMCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDspIHtcclxuICAgICAgbiA9IG5ldyB0aGlzKGFyZ3VtZW50c1tpKytdKTtcclxuICAgICAgaWYgKCFuLmQpIHtcclxuICAgICAgICBpZiAobi5zKSB7XHJcbiAgICAgICAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ID0gbjtcclxuICAgICAgfSBlbHNlIGlmICh0LmQpIHtcclxuICAgICAgICB0ID0gdC5wbHVzKG4udGltZXMobikpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0LnNxcnQoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxuKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbG9nIG9mIGB4YCB0byB0aGUgYmFzZSBgeWAsIG9yIHRvIGJhc2UgMTAgaWYgbm8gYmFzZVxyXG4gICAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogbG9nW3ldKHgpXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBhcmd1bWVudCBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2Ugb2YgdGhlIGxvZ2FyaXRobS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvZyh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygyKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBiYXNlIDEwIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG9nMTAoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygxMCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtYXgoKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCAnbHQnKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1pbigpIHtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdndCcpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG1vZHVsbyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubW9kKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG11bHRpcGxpZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtdWwoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBleHBvbmVudC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBvdyh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkucG93KHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdpdGggYSByYW5kb20gdmFsdWUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAgYW5kIGxlc3MgdGhhbiAxLCBhbmQgd2l0aFxyXG4gICAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICAgKiBhcmUgcHJvZHVjZWQpLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICAgIHZhciBkLCBlLCBrLCBuLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgICByZCA9IFtdO1xyXG5cclxuICAgIGlmIChzZCA9PT0gdm9pZCAwKSBzZCA9IHRoaXMucHJlY2lzaW9uO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBrID0gTWF0aC5jZWlsKHNkIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIGlmICghdGhpcy5jcnlwdG8pIHtcclxuICAgICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAgIC8vIEJyb3dzZXJzIHN1cHBvcnRpbmcgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5cclxuICAgIH0gZWxzZSBpZiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gICAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICAgIG4gPSBkW2ldO1xyXG5cclxuICAgICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgICAgLy8gUHJvYmFiaWxpdHkgbiA+PSA0LjI5ZTksIGlzIDQ5NjcyOTYgLyA0Mjk0OTY3Mjk2ID0gMC4wMDExNiAoMSBpbiA4NjUpLlxyXG4gICAgICAgIGlmIChuID49IDQuMjllOSkge1xyXG4gICAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIDAgPD0gbiA8PSA0Mjg5OTk5OTk5XHJcbiAgICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgICByZFtpKytdID0gbiAlIDFlNztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAvLyBOb2RlLmpzIHN1cHBvcnRpbmcgY3J5cHRvLnJhbmRvbUJ5dGVzLlxyXG4gICAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAgIC8vIGJ1ZmZlclxyXG4gICAgICBkID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNCk7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgICBuID0gZFtpXSArIChkW2kgKyAxXSA8PCA4KSArIChkW2kgKyAyXSA8PCAxNikgKyAoKGRbaSArIDNdICYgMHg3ZikgPDwgMjQpO1xyXG5cclxuICAgICAgICAvLyBQcm9iYWJpbGl0eSBuID49IDIuMTRlOSwgaXMgNzQ4MzY0OCAvIDIxNDc0ODM2NDggPSAwLjAwMzUgKDEgaW4gMjg2KS5cclxuICAgICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICAgIGNyeXB0by5yYW5kb21CeXRlcyg0KS5jb3B5KGQsIGkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAgIC8vIDAgPD0gKG4gJSAxZTcpIDw9IDk5OTk5OTlcclxuICAgICAgICAgIHJkLnB1c2gobiAlIDFlNyk7XHJcbiAgICAgICAgICBpICs9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpID0gayAvIDQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgayA9IHJkWy0taV07XHJcbiAgICBzZCAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgICBpZiAoayAmJiBzZCkge1xyXG4gICAgICBuID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBzZCk7XHJcbiAgICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB3b3JkcyB3aGljaCBhcmUgemVyby5cclxuICAgIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgICAvLyBaZXJvP1xyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGUgPSAwO1xyXG4gICAgICByZCA9IFswXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGUgPSAtMTtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgIGZvciAoOyByZFswXSA9PT0gMDsgZSAtPSBMT0dfQkFTRSkgcmQuc2hpZnQoKTtcclxuXHJcbiAgICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoayA9IDEsIG4gPSByZFswXTsgbiA+PSAxMDsgbiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgLy8gQWRqdXN0IHRoZSBleHBvbmVudCBmb3IgbGVhZGluZyB6ZXJvcyBvZiB0aGUgZmlyc3Qgd29yZCBvZiByZC5cclxuICAgICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgICB9XHJcblxyXG4gICAgci5lID0gZTtcclxuICAgIHIuZCA9IHJkO1xyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kZWQgdG8gYW4gaW50ZWdlciB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiByb3VuZCh4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVyblxyXG4gICAqICAgMSAgICBpZiB4ID4gMCxcclxuICAgKiAgLTEgICAgaWYgeCA8IDAsXHJcbiAgICogICAwICAgIGlmIHggaXMgMCxcclxuICAgKiAgLTAgICAgaWYgeCBpcyAtMCxcclxuICAgKiAgIE5hTiAgb3RoZXJ3aXNlXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaWduKHgpIHtcclxuICAgIHggPSBuZXcgdGhpcyh4KTtcclxuICAgIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zaW4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuc2luaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzcXJ0KHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzdWIoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnN1Yih5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRhbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCB0cnVuY2F0ZWQgdG8gYW4gaW50ZWdlci5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDEpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENyZWF0ZSBhbmQgY29uZmlndXJlIGluaXRpYWwgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICBEZWNpbWFsID0gY2xvbmUoRGVjaW1hbCk7XHJcblxyXG4gIERlY2ltYWxbJ2RlZmF1bHQnXSA9IERlY2ltYWwuRGVjaW1hbCA9IERlY2ltYWw7XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgaW50ZXJuYWwgY29uc3RhbnRzIGZyb20gdGhlaXIgc3RyaW5nIHZhbHVlcy5cclxuICBMTjEwID0gbmV3IERlY2ltYWwoTE4xMCk7XHJcbiAgUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5cclxuICAvLyBFeHBvcnQuXHJcblxyXG5cclxuICAvLyBBTUQuXHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gRGVjaW1hbDtcclxuICAgIH0pO1xyXG5cclxuICAvLyBOb2RlIGFuZCBvdGhlciBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLlxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEZWNpbWFsO1xyXG5cclxuICAvLyBCcm93c2VyLlxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoIWdsb2JhbFNjb3BlKSB7XHJcbiAgICAgIGdsb2JhbFNjb3BlID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiAmJiBzZWxmLnNlbGYgPT0gc2VsZlxyXG4gICAgICAgID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9Db25mbGljdCA9IGdsb2JhbFNjb3BlLkRlY2ltYWw7XHJcbiAgICBEZWNpbWFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGdsb2JhbFNjb3BlLkRlY2ltYWwgPSBub0NvbmZsaWN0O1xyXG4gICAgICByZXR1cm4gRGVjaW1hbDtcclxuICAgIH07XHJcblxyXG4gICAgZ2xvYmFsU2NvcGUuRGVjaW1hbCA9IERlY2ltYWw7XHJcbiAgfVxyXG59KSh0aGlzKTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9lbWFpbC12YWxpZGF0aW9uJyk7XHJcbiIsInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG52YXIgZW1haWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge307XHJcblxyXG52YXIgc3RyVG9PYmogPSBmdW5jdGlvbihzdHIpIHtcclxuICB2YXIgb2JqID0ge307XHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgb2JqW3N0cltpXV0gPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbnZhciBjaGFycyA9IHN0clRvT2JqKFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODkhIyQlJicqKy0vPT9eX2B7fH1+LlwiKTtcclxudmFyIHNwZWNpYWxjaGFycyA9IHN0clRvT2JqKFwiXFxcXFxcXCIoKSw6Ozw+QFtcXF0gXCIpO1xyXG52YXIgZXNjYXBlcnMgPSBzdHJUb09iaignXFxcXFwiJyk7XHJcbnZhciBob3N0Y2hhcnMgPSBzdHJUb09iaihcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5Li1cIik7XHJcblxyXG5lbWFpbC5wYXJzZSA9IGZ1bmN0aW9uKGFkZHJlc3MsIGRvdGhyb3csIGNhbGxiYWNrKSB7XHJcbiAgY2FsbGJhY2sgPSAodHlwZW9mIGNhbGxiYWNrID09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb3Rocm93ID09ICdmdW5jdGlvbicpID8gZG90aHJvdyA6IG51bGw7XHJcbiAgdmFyIHVzZXJsYW5kID0gdHJ1ZTtcclxuICB2YXIgcXVvdGF0aW9uID0gZmFsc2U7XHJcbiAgdmFyIGVzY2FwZWQgPSBmYWxzZTtcclxuICB2YXIgX3VzZXIgPSBcIlwiLCBfZG9tYWluID0gXCJcIjtcclxuICB2YXIgaG9zdGlzaXAgPSBmYWxzZTtcclxuICB2YXIgaG9zdHN0YXJ0cG9zID0gMDtcclxuICB0cnkge1xyXG4gICAgaWYoYWRkcmVzcy5sZW5ndGggPj0gMjU0KSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGFkZHJlc3MgaXMgbG9uZ2VyIHRoYW4gMjUzLCBhY3R1YWxdXCIsIGFkZHJlc3MubGVuZ3RoKTtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhZGRyZXNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coaSwgYWRkcmVzc1tpXSlcclxuICAgICAgaWYodXNlcmxhbmQpIHtcclxuICAgICAgICBpZihhZGRyZXNzW2ldID09ICdcIicgJiYgaSA9PSAwKSB7IHF1b3RhdGlvbiA9IHRydWU7IF91c2VyICs9IGFkZHJlc3NbaV07IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgaWYodHlwZW9mIGNoYXJzW2FkZHJlc3NbaV1dICE9ICd1bmRlZmluZWQnKSB7IC8vbmVlZGVkIEknbSBzdXJlLlxyXG4gICAgICAgICAgX3VzZXIgKz0gYWRkcmVzc1tpXTsgY29udGludWU7XHJcbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBzcGVjaWFsY2hhcnNbYWRkcmVzc1tpXV0gIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGlmKHF1b3RhdGlvbikge1xyXG4gICAgICAgICAgICBpZighZXNjYXBlZCAmJiBhZGRyZXNzW2ldID09IFwiXFxcXFwiKSB7IGVzY2FwZWQgPSB0cnVlOyBfdXNlciArPSBhZGRyZXNzW2ldOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBpZighZXNjYXBlZCAmJiBhZGRyZXNzW2ldID09ICdcIicgJiYgYWRkcmVzc1tpKzFdID09IFwiQFwiKSB7IHVzZXJsYW5kID0gZmFsc2U7IGhvc3RzdGFydHBvcyA9IGkrMjsgX3VzZXIgKz0gYWRkcmVzc1tpXTsgaSs9MTsgY29udGludWU7IH1cclxuICAgICAgICAgICAgaWYoZXNjYXBlZCAmJiB0eXBlb2YgZXNjYXBlcnNbYWRkcmVzc1tpXV0gIT0gJ3VuZGVmaW5lZCcpIHsgZXNjYXBlZCA9IGZhbHNlOyBfdXNlciArPSBhZGRyZXNzW2ldOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBpZighZXNjYXBlZCAmJiB0eXBlb2YgZXNjYXBlcnNbYWRkcmVzc1tpXV0gIT0gJ3VuZGVmaW5lZCcpIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNpbmcgZW1haWwgYWRkcmVzczogaW52YWxpZCB1c2Ugb2YgJXMgKHBvczogJXMpXVwiLCBhZGRyZXNzW2ldLCBpLCBhZGRyZXNzKTtcclxuICAgICAgICAgIH0gZWxzZSBpZihhZGRyZXNzW2ldID09IFwiQFwiICYmICFxdW90YXRpb24pIHtcclxuICAgICAgICAgICAgdXNlcmxhbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaG9zdHN0YXJ0cG9zID0gaSsxO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNpbmcgZW1haWwgYWRkcmVzczogc3BlY2lhbCBjaGFyYWN0ZXIgJyVzJyAocG9zOiAlcykgdXNlZCB3aXRob3V0IHF1b3RhdGlvbiBtYXJrc11cIiwgYWRkcmVzc1tpXSwgaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNpbmcgZW1haWwgYWRkcmVzczogY2hhcmFjdGVyICclcycgKHBvczogJXMpIGlzIG5vdCBhbGxvd2VkIGluIGFuIGVtYWlsIGFkZHJlc3MgdXNlciBzcGFjZS5dXCIsIGFkZHJlc3NbaV0sIGksIGFkZHJlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfdXNlciArPSBhZGRyZXNzW2ldO1xyXG4gICAgICB9IGVsc2UgeyAvL3BhcnNpbmcgaG9zdG5hbWUuIFByb2JhYmx5IGNvdWxkIGJlIGRvbmUgd2l0aCByZWdleC5cclxuICAgICAgICBpZihpID09IGhvc3RzdGFydHBvcyAmJiBhZGRyZXNzW2ldID09ICdbJykgeyBob3N0aXNpcCA9IHRydWU7IGhvc3RjaGFyc1snWyddID0gJ1snOyBob3N0Y2hhcnNbJ10nXSA9ICddJzsgaG9zdGNoYXJzWyc6J10gPSAnOic7IF9kb21haW4gKz0gYWRkcmVzc1tpXTsgY29udGludWU7IH1cclxuICAgICAgICBpZih0eXBlb2YgaG9zdGNoYXJzW2FkZHJlc3NbaV1dID09ICd1bmRlZmluZWQnKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGNoYXJhY3RlciAnJXMnIChwb3M6ICVzKSBpcyBub3QgYWxsb3dlZCBpbiB0aGUgaG9zdG5hbWUgc2VjdGlvbl1cIiwgYWRkcmVzc1tpXSwgaSk7XHJcbiAgICAgICAgaWYoaSA+PSBob3N0c3RhcnRwb3MgJiYgL1tAXFwuXS8udGVzdChhZGRyZXNzW2kgLSAxXSkgJiYgIS9bYS16MC05XS9pLnRlc3QoYWRkcmVzc1tpXSkpIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNpbmcgZW1haWwgYWRkcmVzczogQWxsIGRvbWFpbiBzZWdtZW50cyBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIgb3IgbnVtYmVyLCBuZXZlciBhIHN5bWJvbCBsaWtlICclcycuXCIpXHJcbiAgICAgICAgX2RvbWFpbiArPSBhZGRyZXNzW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihfZG9tYWluID09PSAnJykgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2VpbmcgZW1haWwgYWRkcmVzczogbm8gZG9tYWluIHBhcnRdXCIsIGFkZHJlc3MpO1xyXG4gICAgaWYoaG9zdGlzaXAgJiYgIXJlcXVpcmUoJ25ldCcpLmlzSVAoYWRkcmVzcy5zdWJzdHJpbmcoaG9zdHN0YXJ0cG9zKzEsYWRkcmVzcy5sZW5ndGgtMSkpKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGludmFsaWQgSVAgYWRkcmVzc11cIik7XHJcbiAgICBpZihob3N0aXNpcCAmJiBhZGRyZXNzW2FkZHJlc3MubGVuZ3RoLTFdICE9IFwiXVwiKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IElQIGFkZHJlc3Mgbm90YXRpb24gbXVzdCBlbmQgd2l0aCBhICddJ11cIik7XHJcbiAgICBpZighaG9zdGlzaXAgJiYgKC9eLitAKFthLXowLTldezY0LH0ofFxcLikpL2kpLnRlc3QoYWRkcmVzcykpIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNpbmcgZW1haWwgYWRkcmVzczogaG9zdG5hbWUgaGFzIGVsZW1lbnRzIGdyZWF0ZXIgdGhhbiA2MyBjaGFyYWN0ZXJzXVwiKTtcclxuICAgIGlmKHVzZXJsYW5kKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IHF1b3RhdGlvbiBtYXJrIG5vdCBjbG9zZWRdXCIgLCBhZGRyZXNzKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGlmKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIpO1xyXG4gICAgaWYodHlwZW9mIGRvdGhyb3cgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvdGhyb3cgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgZXJyO1xyXG4gICAgcmV0dXJuIGZhbHNlOyAvL3JlZHVuZGFudD9cclxuICB9XHJcbiAgaWYoY2FsbGJhY2spIGNhbGxiYWNrKG51bGwsIHt1c2VyOiBfdXNlciwgZG9tYWluOiBfZG9tYWlufSk7XHJcbiAgZWxzZSByZXR1cm4ge3VzZXI6IF91c2VyLCBkb21haW46IF9kb21haW59O1xyXG59XHJcblxyXG5lbWFpbC52YWxpZCA9IGZ1bmN0aW9uKGFkZHJlc3MsIGRvdGhyb3csIGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuICEhZW1haWwucGFyc2UoYWRkcmVzcywgZG90aHJvdywgY2FsbGJhY2spO1xyXG59XHJcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJ2YXIgZGVjaW1hbCA9IHJlcXVpcmUoJ2RlY2ltYWwuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB0b1BlcmNlbnQ6IGZ1bmN0aW9uKGlucHV0LCB0b3RhbCwgZGVjaW1hbHMpIHtcclxuICAgICAgICB0b3RhbCA9IG5ldyBkZWNpbWFsKHRvdGFsKVxyXG5cclxuICAgICAgICB2YXIgcmVzdWx0ID0gW11cclxuICAgICAgICB2YXIgbGFzdFdpdGhWYWx1ZSA9IHVuZGVmaW5lZFxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IG5ldyBkZWNpbWFsKGlucHV0W2ldKVxyXG5cclxuICAgICAgICAgICAgcmVzdWx0W2ldID0gcmVzdWx0W2ldLmRpdih0b3RhbCkubXVsKDEwMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkZWNpbWFscykgcmVzdWx0W2ldID0gc2V0RGVjaW1hbHMocmVzdWx0W2ldLCBkZWNpbWFscylcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFtpXS5ncmVhdGVyVGhhbigwKSkgbGFzdFdpdGhWYWx1ZSA9IGlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXN0V2l0aFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBwZXJjZW50T2ZUb3RhbCA9IHNldERlY2ltYWxzKG5ldyBkZWNpbWFsKHRoaXMuc3VtV2l0aFByZWNpc2lvbihpbnB1dCkpLmRpdih0b3RhbCkubXVsKDEwMCksIGRlY2ltYWxzKVxyXG5cclxuICAgICAgICAgICAgdmFyIHJlbWFpbmRlciA9IHBlcmNlbnRPZlRvdGFsLnN1Yih0aGlzLnN1bVdpdGhQcmVjaXNpb24ocmVzdWx0KSlcclxuICAgICAgICAgICAgcmVzdWx0W2xhc3RXaXRoVmFsdWVdID0gcmVzdWx0W2xhc3RXaXRoVmFsdWVdLmFkZChyZW1haW5kZXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHRbaV0gPSByZXN1bHRbaV0udG9TdHJpbmcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9LFxyXG5cclxuICAgIHRvQWJzb2x1dGU6IGZ1bmN0aW9uKHRvdGFsLCBzcHJlYWQpIHtcclxuICAgICAgICB0b3RhbCA9IG5ldyBkZWNpbWFsKHRvdGFsKVxyXG5cclxuICAgICAgICB2YXIgcmVzdWx0ID0gW11cclxuICAgICAgICB2YXIgbGFzdFdpdGhWYWx1ZSA9IHVuZGVmaW5lZFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3ByZWFkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzcGxpdCA9IG5ldyBkZWNpbWFsKHNwcmVhZFtpXSkuZGl2KDEwMClcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHNldERlY2ltYWxzKHRvdGFsLm11bChzcGxpdCksIDApXHJcblxyXG4gICAgICAgICAgICBpZiAoIXNwbGl0LmVxKDApKSBsYXN0V2l0aFZhbHVlID0gaVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxhc3RXaXRoVmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlbWFpbmRlciA9IHNldERlY2ltYWxzKHRvdGFsLm11bChuZXcgZGVjaW1hbCh0aGlzLnN1bVdpdGhQcmVjaXNpb24oc3ByZWFkKSkuZGl2KDEwMCkpLnN1Yih0aGlzLnN1bVdpdGhQcmVjaXNpb24ocmVzdWx0KSksMClcclxuICAgICAgICAgICAgcmVzdWx0W2xhc3RXaXRoVmFsdWVdID0gcmVzdWx0W2xhc3RXaXRoVmFsdWVdLmFkZChyZW1haW5kZXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHRbaV0gPSByZXN1bHRbaV0udG9TdHJpbmcoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfSxcclxuXHJcbiAgICBzdW1XaXRoUHJlY2lzaW9uOiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHZhciB0b3RhbCA9IG5ldyBkZWNpbWFsKDApXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdG90YWwgPSB0b3RhbC5hZGQoaW5wdXRbaV0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG90YWwudG9TdHJpbmcoKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXREZWNpbWFscyhudW0sIGRlY2ltYWxzKSB7XHJcbiAgICByZXR1cm4gbmV3IGRlY2ltYWwobnVtLnRvRml4ZWQoZGVjaW1hbHMpKVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aWRnZXQsIHBhbmUpIHsgXHJcbiAgICB0aGlzLndpZGdldCA9IHdpZGdldDtcclxuICAgIHRoaXMucGFuZSA9IHBhbmU7XHJcblxyXG4gICAgc2V0dXBTZWxlY3RTcGxpdENoZWNrYm94KCk7XHJcblxyXG4gICAgcGFuZS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVhZHknLCBwYW5lKSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdWJtaXQ6IHN1Ym1pdEFtb3VudCxcclxuICAgICAgICBmb2N1czogZm9jdXNBbW91bnQsXHJcbiAgICAgICAgd2lkZ2V0OiB3aWRnZXQsXHJcbiAgICAgICAgcGFuZTogcGFuZVxyXG4gICAgfSBcclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0QW1vdW50KCkge1xyXG4gICAgdmFyIHdpZGdldCA9IHRoaXMud2lkZ2V0O1xyXG4gICAgdmFyIHBhbmUgPSB0aGlzLnBhbmU7XHJcblxyXG4gICAgdmFyIG54dEJ0biA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKVswXTtcclxuICAgIG54dEJ0bi5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTtcclxuXHJcbiAgICB3aWRnZXQuZG9uYXRpb25BbW91bnQgPSBwYXJzZUludChwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhbW91bnRcIilbMF0udmFsdWUpO1xyXG5cclxuICAgIGlmICh3aWRnZXQuZG9uYXRpb25BbW91bnQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHdpZGdldC5zdWJtaXRPbkFtb3VudCkge1xyXG4gICAgICAgICAgICB3aWRnZXQucGFuZXNbMl0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgd2lkZ2V0LnBvc3REb25hdGlvbih7XHJcbiAgICAgICAgICAgICAgICBkb25vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHdpZGdldC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB3aWRnZXQuZW1haWxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHdpZGdldC5kb25hdGlvbkFtb3VudFxyXG4gICAgICAgICAgICB9LCBueHRCdG4pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpZGdldC5uZXh0U2xpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBueHRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbiAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgd2lkZ2V0LmVycm9yKFwiRHUgbcOlIGFuZ2kgZW4gc3VtXCIpO1xyXG4gICAgICAgIG54dEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9jdXNBbW91bnQoKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcbiAgICB2YXIgcGFuZSA9IHRoaXMucGFuZTtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhbW91bnRcIilbMF07XHJcblxyXG4gICAgd2lkZ2V0LmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCJcIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5cclxuLyogU2V0dXAgc2VsZWN0IHNwbGl0IGNoZWNrYm94ICovXHJcbmZ1bmN0aW9uIHNldHVwU2VsZWN0U3BsaXRDaGVja2JveCgpIHtcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICB2YXIgc2VsZWN0U3BsaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrLXNlbGVjdC1zcGxpdFwiKTtcclxuICAgIHZhciBzZWxlY3RSZWNvbW1lbmRlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2stc2VsZWN0LXJlY29tbWVuZGVkXCIpO1xyXG5cclxuICAgIHNlbGVjdFNwbGl0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHdpZGdldC5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXNcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB3aWRnZXQuc3VibWl0T25BbW91bnQgPSBmYWxzZTtcclxuICAgICAgICB3aWRnZXQuYWN0aXZlUGFuZXMrKztcclxuICAgICAgICB3aWRnZXQudXBkYXRlU2xpZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNlbGVjdFJlY29tbWVuZGVkLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHdpZGdldC5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXNcIilbMF0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICB3aWRnZXQuc3VibWl0T25BbW91bnQgPSB0cnVlO1xyXG4gICAgICAgIHdpZGdldC5hY3RpdmVQYW5lcy0tO1xyXG4gICAgICAgIHdpZGdldC51cGRhdGVTbGlkZXJQcm9ncmVzcygpO1xyXG4gICAgfSlcclxufSIsInZhciByb3VuZGluZyA9IHJlcXVpcmUoJy4uL2xpYi9yb3VuZGluZy5qcycpOyBcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2lkZ2V0LCBwYW5lKSB7XHJcbiAgICB0aGlzLnBhbmUgPSBwYW5lO1xyXG4gICAgdGhpcy53aWRnZXQgPSB3aWRnZXQ7XHJcblxyXG4gICAgc2V0dXAocGFuZSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdWJtaXQ6IHN1Ym1pdERvbmF0aW9uLFxyXG4gICAgICAgIGZvY3VzOiBmb2N1c0RvbmF0aW9uLFxyXG4gICAgICAgIHdpZGdldDogd2lkZ2V0LFxyXG4gICAgICAgIHBhbmU6IHBhbmVcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0RG9uYXRpb24oKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcbiAgICB2YXIgcGFuZSA9IHRoaXMucGFuZTtcclxuXHJcbiAgICBpZiAod2lkZ2V0LnNoYXJlc1R5cGUgPT0gXCJkZWNpbWFsXCIpIHtcclxuICAgICAgICB2YXIgcGVyY2VudFNwbGl0ID0gcm91bmRpbmcudG9QZXJjZW50KHdpZGdldC5vcmdhbml6YXRpb25zLm1hcChmdW5jdGlvbihvcmcpIHsgcmV0dXJuIG9yZy5zZXRWYWx1ZTsgfSksIHdpZGdldC5kb25hdGlvbkFtb3VudCwgMyk7XHJcblxyXG4gICAgICAgIHZhciBkb25hdGlvblNwbGl0ID0gd2lkZ2V0Lm9yZ2FuaXphdGlvbnMubWFwKGZ1bmN0aW9uKG9yZywgaSkge1xyXG4gICAgICAgICAgICBpZiAob3JnLnNldFZhbHVlICE9IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBvcmcuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQ6IHBlcmNlbnRTcGxpdFtpXVxyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtIH0pXHJcbiAgICB9IFxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGRvbmF0aW9uU3BsaXQgPSB3aWRnZXQub3JnYW5pemF0aW9ucy5tYXAoZnVuY3Rpb24ob3JnKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmcuc2V0VmFsdWUgIT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG9yZy5pZCxcclxuICAgICAgICAgICAgICAgICAgICBzcGxpdDogb3JnLnNldFZhbHVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbSB9KVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgaWYgKHJvdW5kaW5nLnN1bVdpdGhQcmVjaXNpb24oZG9uYXRpb25TcGxpdC5tYXAoZnVuY3Rpb24oaXRlbSkge3JldHVybiBpdGVtLnNwbGl0fSkpID09PSAnMTAwJykge1xyXG4gICAgICAgIHZhciBueHRCdG4gPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG5cIilbMF07XHJcbiAgICAgICAgbnh0QnRuLmNsYXNzTGlzdC5hZGQoXCJsb2FkaW5nXCIpO1xyXG5cclxuICAgICAgICB3aWRnZXQucG9zdERvbmF0aW9uKHtcclxuICAgICAgICAgICAgZG9ub3I6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHdpZGdldC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHdpZGdldC5lbWFpbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbW91bnQ6IHdpZGdldC5kb25hdGlvbkFtb3VudCxcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogZG9uYXRpb25TcGxpdFxyXG4gICAgICAgIH0sIG54dEJ0bik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB3aWRnZXQuZXJyb3IoXCJEdSBtw6UgZm9yZGVsZSBhbGxlIG1pZGxlbmVcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvY3VzRG9uYXRpb24oKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcbiAgICB2YXIgcGFuZSA9IHRoaXMucGFuZTtcclxuXHJcbiAgICB2YXIgb3JnYW5pemF0aW9ucyA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm9yZ2FuaXphdGlvbnNcIilbMF07XHJcblxyXG4gICAgc2V0U3BsaXRWYWx1ZXMoKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBhbmUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5mb2N1cygpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5cclxuLyogU2V0dXAgZG9uYXRpb24gc3BsaXQgcGFuZSAqL1xyXG5mdW5jdGlvbiBzZXR1cChwYW5lKSB7XHJcbiAgICBzZXR1cE1vZGVCdXR0b24ocGFuZSk7XHJcbiAgICBzZXR1cERvbmF0aW9uTGlzdChwYW5lKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBEb25hdGlvbkxpc3QocGFuZSkgeyBcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHdpZGdldC5yZXF1ZXN0KFwib3JnYW5pemF0aW9ucy9hY3RpdmVcIiwgXCJHRVRcIiwgeyB9LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVyciA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzZXROb0FwaUVycm9yKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXQub3JnYW5pemF0aW9ucyA9IGRhdGEuY29udGVudDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm9yZ2FuaXphdGlvbnNcIilbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGVmdG92ZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpZGdldC5zcGxpdFNoYXJlc1RvdGFsID0gcGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidG90YWxcIilbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXQub3JnYW5pemF0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmcgPSB3aWRnZXQub3JnYW5pemF0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBvcmcuZWxlbWVudCA9IGNyZWF0ZUxpc3RJdGVtKG9yZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQob3JnLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3RJdGVtKG9yZykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9saS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIG9yZy5faWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4uaW5uZXJIVE1MID0gb3JnLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKHNwYW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby5jbGFzc0xpc3QuYWRkKFwiaW5mb1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLm9uY2xpY2sgPSBmdW5jdGlvbigpIHsgd2luZG93Lm9wZW4ob3JnLmluZm9VcmwsIFwiX2JsYW5rXCIpOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGluZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImlucHV0LXdyYXBwZXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGlucHV0V3JhcHBlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImlucHV0bW9kZVwiLCBcIm51bWVyaWNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibm9jb21tYVwiLCBcInRydWVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9yZy5pbnB1dEVsZW1lbnQgPSBpbnB1dDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID4gMCkgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB2YWwgPSBcIjBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZy5zZXRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVG90YWxTaGFyZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlID09IFwiMFwiKSBlLnRhcmdldC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID09IDApIGUudGFyZ2V0LnZhbHVlID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZm9MaXN0SXRlbShvcmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gb3JnLmhlYWRlckltYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVyVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJUZXh0LmlubmVySFRNTCA9IG9yZy5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGhlYWRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZW50XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudFBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRQYXJhZ3JhcGguaW5uZXJIVE1MID0gb3JnLmxvbmdEZXNjO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGNvbnRlbnRQYXJhZ3JhcGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhbmUuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlYWR5JywgcGFuZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgMTApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNwbGl0VmFsdWVzKCkge1xyXG4gICAgdmFyIHdpZGdldCA9IHRoaXMud2lkZ2V0O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0Lm9yZ2FuaXphdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgb3JnID0gd2lkZ2V0Lm9yZ2FuaXphdGlvbnNbaV07XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3JnLnNldFZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIG9yZy5zZXRWYWx1ZSA9IE1hdGgucm91bmQod2lkZ2V0LmRvbmF0aW9uQW1vdW50ICogKG9yZy5zdGFuZGFyZFNoYXJlIC8gMTAwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcmcuaW5wdXRFbGVtZW50LnZhbHVlID0gb3JnLnNldFZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRvdGFsU2hhcmVzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9yZ2FuaXphdGlvblZhbHVlc1RvUGVyY2VudCgpIHtcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSB3aWRnZXQub3JnYW5pemF0aW9ucy5tYXAoZnVuY3Rpb24ob3JnKSB7cmV0dXJuIG9yZy5zZXRWYWx1ZX0gKTtcclxuICAgIHZhciBjb252ZXJ0ZWQgPSByb3VuZGluZy50b1BlcmNlbnQoaW5wdXQsIHdpZGdldC5kb25hdGlvbkFtb3VudCwgMik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldC5vcmdhbml6YXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG9yZyA9IHdpZGdldC5vcmdhbml6YXRpb25zW2ldO1xyXG5cclxuICAgICAgICBvcmcuc2V0VmFsdWUgPSBjb252ZXJ0ZWRbaV07XHJcbiAgICAgICAgb3JnLmlucHV0RWxlbWVudC52YWx1ZSA9IG9yZy5zZXRWYWx1ZTtcclxuICAgICAgICBvcmcuaW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vY29tbWFcIiwgIFwiZmFsc2VcIik7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUb3RhbFNoYXJlcygpOyBcclxufVxyXG5cclxuZnVuY3Rpb24gb3JnYW5pemF0aW9uVmFsdWVzVG9BbW91bnQoKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcblxyXG4gICAgdmFyIGlucHV0ID0gd2lkZ2V0Lm9yZ2FuaXphdGlvbnMubWFwKGZ1bmN0aW9uKG9yZykge3JldHVybiBvcmcuc2V0VmFsdWV9KTtcclxuICAgIHZhciBjb252ZXJ0ZWQgPSByb3VuZGluZy50b0Fic29sdXRlKHdpZGdldC5kb25hdGlvbkFtb3VudCwgaW5wdXQpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXQub3JnYW5pemF0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBvcmcgPSB3aWRnZXQub3JnYW5pemF0aW9uc1tpXTtcclxuXHJcbiAgICAgICAgb3JnLnNldFZhbHVlID0gY29udmVydGVkW2ldO1xyXG4gICAgICAgIG9yZy5pbnB1dEVsZW1lbnQudmFsdWUgPSBvcmcuc2V0VmFsdWU7XHJcbiAgICAgICAgb3JnLmlucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub2NvbW1hXCIsICBcInRydWVcIik7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUb3RhbFNoYXJlcygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUb3RhbFNoYXJlcygpIHtcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICB2YXIgdG90YWwgPSByb3VuZGluZy5zdW1XaXRoUHJlY2lzaW9uKHdpZGdldC5vcmdhbml6YXRpb25zLm1hcChmdW5jdGlvbihvcmcpIHtyZXR1cm4gb3JnLnNldFZhbHVlfSkpO1xyXG4gICAgaWYgKCFpc05hTih0b3RhbCkpIHtcclxuICAgICAgICBpZiAod2lkZ2V0LnNoYXJlc1R5cGUgPT0gXCJkZWNpbWFsXCIpIHtcclxuICAgICAgICAgICAgaWYgKHRvdGFsID09IHdpZGdldC5kb25hdGlvbkFtb3VudCkgc2V0RG9uYXRpb25TcGxpdFZhbGlkQW1vdW50KCk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2lkZ2V0LnNwbGl0U2hhcmVzVG90YWwuaW5uZXJIVE1MID0gXCJEdSBoYXIgZm9yZGVsdCBcIiArIHRvdGFsLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIgXCIpICsgXCIgYXYgXCIgKyB3aWRnZXQuZG9uYXRpb25BbW91bnQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIikgKyBcImtyXCI7XHJcbiAgICAgICAgICAgICAgICBzZXREb25hdGlvblNwbGl0SW52YWxpZEFtb3VudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh3aWRnZXQuc2hhcmVzVHlwZSA9PSBcInBlcmNlbnRhZ2VcIikge1xyXG4gICAgICAgICAgICBpZiAodG90YWwgPT0gMTAwKSBzZXREb25hdGlvblNwbGl0VmFsaWRBbW91bnQoKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXQuc3BsaXRTaGFyZXNUb3RhbC5pbm5lckhUTUwgPSBcIkR1IGhhciBmb3JkZWx0IFwiICsgdG90YWwudG9TdHJpbmcoKS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiIFwiKSArIFwiIGF2IDEwMCVcIjsgXHJcbiAgICAgICAgICAgICAgICBzZXREb25hdGlvblNwbGl0SW52YWxpZEFtb3VudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXREb25hdGlvblNwbGl0VmFsaWRBbW91bnQoKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcblxyXG4gICAgd2lkZ2V0LnNwbGl0U2hhcmVzVG90YWwuY2xhc3NMaXN0LmFkZChcInRvdGFsLWhpZGRlblwiKTtcclxuICAgIC8vSGFyZGNvZGVkIHNsaWRlIDIsIHVwZGF0ZSBsYXRlclxyXG4gICAgd2lkZ2V0LnBhbmVzWzJdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG5cIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImluYWN0aXZlXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXREb25hdGlvblNwbGl0SW52YWxpZEFtb3VudCgpIHtcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICB3aWRnZXQuc3BsaXRTaGFyZXNUb3RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidG90YWwtaGlkZGVuXCIpO1xyXG4gICAgLy9IYXJkY29kZWQgc2xpZGUgMiwgdXBkYXRlIGxhdGVyXHJcbiAgICB3aWRnZXQucGFuZXNbMl0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKVswXS5jbGFzc0xpc3QuYWRkKFwiaW5hY3RpdmVcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwTW9kZUJ1dHRvbihwYW5lKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcblxyXG4gICAgdmFyIGJ0biA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1vZGUtc3dpdGNoXCIpWzBdO1xyXG4gICAgdmFyIG9yZ2FuaXphdGlvbkxpc3QgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJvcmdhbml6YXRpb25zXCIpWzBdO1xyXG5cclxuICAgIHdpZGdldC5zaGFyZXNUeXBlID0gXCJkZWNpbWFsXCI7XHJcbiAgICB2YXIgaGFzU3dpdGNoZWQgPSBmYWxzZTtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmIChoYXNTd2l0Y2hlZCkge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZShcInN3aXRjaGVkXCIpO1xyXG4gICAgICAgICAgICB3aWRnZXQuc2hhcmVzVHlwZSA9IFwiZGVjaW1hbFwiO1xyXG4gICAgICAgICAgICBvcmdhbml6YXRpb25MaXN0LmNsYXNzTGlzdC5yZW1vdmUoXCJwZXJjZW50YWdlLW1vZGVcIik7XHJcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvblZhbHVlc1RvQW1vdW50KCk7XHJcbiAgICAgICAgICAgIGhhc1N3aXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJzd2l0Y2hlZFwiKTtcclxuICAgICAgICAgICAgd2lkZ2V0LnNoYXJlc1R5cGUgPSBcInBlcmNlbnRhZ2VcIjtcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTGlzdC5jbGFzc0xpc3QuYWRkKFwicGVyY2VudGFnZS1tb2RlXCIpO1xyXG4gICAgICAgICAgICBvcmdhbml6YXRpb25WYWx1ZXNUb1BlcmNlbnQoKTtcclxuICAgICAgICAgICAgaGFzU3dpdGNoZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwidmFyIGVtYWlsdmFsaWRhdGlvbiA9IHJlcXVpcmUoJ2VtYWlsLXZhbGlkYXRpb24nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2lkZ2V0LCBwYW5lKSB7XHJcbiAgICB0aGlzLndpZGdldCA9IHdpZGdldDtcclxuICAgIHRoaXMucGFuZSA9IHBhbmU7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgICBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYW1lXCIpWzBdLnZhbHVlID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZG9uYXRpb24tbmFtZVwiKTtcclxuICAgICAgICBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlbWFpbFwiKVswXS52YWx1ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRvbmF0aW9uLWVtYWlsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhbmUuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlYWR5JywgcGFuZSkpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3VibWl0OiBzdWJtaXRVc2VyLFxyXG4gICAgICAgIGZvY3VzOiBmb2N1c1VzZXIsXHJcbiAgICAgICAgcGFuZTogcGFuZSxcclxuICAgICAgICB3aWRnZXQ6IHdpZGdldFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdWJtaXRVc2VyKCkge1xyXG4gICAgdmFyIHBhbmUgPSB0aGlzLnBhbmU7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcblxyXG4gICAgdmFyIG54dEJ0biA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKVswXTtcclxuICAgIG54dEJ0bi5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTtcclxuXHJcbiAgICB2YXIgZW1haWwgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlbWFpbFwiKVswXS52YWx1ZS50cmltKCk7XHJcbiAgICB2YXIgbmFtZSA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5hbWVcIilbMF0udmFsdWUudHJpbSgpO1xyXG5cclxuICAgIC8vVmFsaWRhdGUgaW5wdXRcclxuICAgIGlmIChuYW1lLmxlbmd0aCA8IDIgfHwgbmFtZS5sZW5ndGggPiAzMikgeyAvL0ludmFsaWQgbmFtZVxyXG4gICAgICAgIHdpZGdldC5lcnJvcihcIklra2UgZXQgZ3lsZGlnIG5hdm5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBcclxuXHJcbiAgICBpZiAoIWVtYWlsdmFsaWRhdGlvbi52YWxpZChlbWFpbCkpIHsgLy9JbnZhbGlkIGVtYWlsXHJcbiAgICAgICAgd2lkZ2V0LmVycm9yKFwiSWtrZSBlbiBneWxkaWcgbWFpbFwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgd2lkZ2V0Lm5hbWUgPSBuYW1lO1xyXG4gICAgd2lkZ2V0LmVtYWlsID0gZW1haWw7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkb25hdGlvbi1uYW1lXCIsIG5hbWUpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRvbmF0aW9uLWVtYWlsXCIsIGVtYWlsKTtcclxuICAgIH1cclxuXHJcbiAgICB3aWRnZXQubmV4dFNsaWRlKCk7XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbnh0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9jdXNVc2VyKCkge1xyXG4gICAgdmFyIGlucHV0ID0gdGhpcy5wYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYW1lXCIpWzBdO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH0sIDIwMCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gRG9uYXRpb25XaWRnZXQoKSB7XHJcbiAgICB2YXIgX3NlbGYgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5zZXR1cCA9IGZ1bmN0aW9uIChzZWxmLCB3aWRnZXRFbGVtZW50KSB7XHJcbiAgICAgICAgX3NlbGYgPSBzZWxmO1xyXG5cclxuICAgICAgICB0aGlzLmFzc2V0c1VybCA9IFwiaHR0cHM6Ly9hcGkuZ2llZmZla3RpdnQubm8vc3RhdGljL1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHdpZGdldEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy53cmFwcGVyID0gdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVFcnJvciA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5zdWJtaXRPbkFtb3VudCA9IHRydWU7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnNsaWRlciA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2xpZGVyXCIpWzBdO1xyXG4gICAgICAgIGlmICghdGhpcy5zbGlkZXIpIHRocm93IEVycm9yKFwiTm8gc2xpZGVyIGVsZW1lbnQgaW4gd2lkZ2V0XCIpO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJvZ3Jlc3NcIilbMF07XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb2dyZXNzKSB0aHJvdyBuZXcgRXJyb3IoXCJObyBwcm9ncmVzcyBlbGVtZW50IGluIHNsaWRlclwiKTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuZXJyb3JFbGVtZW50ID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlcnJvclwiKVswXTtcclxuICAgICAgICBpZiAoIXRoaXMuZXJyb3IpIHRocm93IG5ldyBFcnJvcihcIk5vIGVycm9yIGVsZW1lbnQgaW4gc2xpZGVyXCIpO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2xvc2UtYnRuXCIpWzBdO1xyXG4gICAgICAgIGlmICghdGhpcy5jbG9zZUJ0bikgdGhyb3cgbmV3IEVycm9yKFwiTm8gY2xvc2UgYnV0dG9uIGVsZW1lbnQgaW4gd2lkZ2V0XCIpXHJcbiAgICBcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNsaWRlID0gMDtcclxuICAgIFxyXG4gICAgICAgIHRoaXMucGFuZXMgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBhbmVcIik7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVQYW5lcyA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLnBhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVzW2ldLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkgdGhpcy5hY3RpdmVQYW5lcysrO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHZhciBub3REZWZhdWx0UGFuZXMgPSBbXCJzaGFyZXNcIl1cclxuICAgIFxyXG4gICAgICAgIHRoaXMuZGVmYXVsdFBhbmVzID0gOTA7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnNsaWRlci5zdHlsZS53aWR0aCA9ICh0aGlzLnBhbmVzLmxlbmd0aCAqIHRoaXMud2lkdGgpICsgXCJweFwiO1xyXG4gICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYW5lID0gdGhpcy5wYW5lc1tpXTtcclxuICAgICAgICAgICAgcGFuZS5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgICBwYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeVwiLCBmdW5jdGlvbihwYW5lKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJtaXRPbkVudGVyKHBhbmUpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbm9yUGFuZSA9IHJlcXVpcmUoJy4vcGFuZXMvZG9ub3IuanMnKShfc2VsZiwgX3NlbGYucGFuZXNbMF0pXHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb25vclBhbmUuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcGFuZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXZlcnNhbFBhbmVGb2N1cyhzZWxmLCBkb25vclBhbmUucGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9ub3JQYW5lLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFtb3VudFBhbmUgPSByZXF1aXJlKCcuL3BhbmVzL2Ftb3VudC5qcycpKF9zZWxmLCBfc2VsZi5wYW5lc1sxXSlcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50UGFuZS5zdWJtaXQoX3NlbGYsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHBhbmUuZm9jdXMgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdmVyc2FsUGFuZUZvY3VzKHNlbGYsIGFtb3VudFBhbmUucGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50UGFuZS5mb2N1cyhfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbmF0aW9uUGFuZSA9IHJlcXVpcmUoJy4vcGFuZXMvZG9uYXRpb24uanMnKShfc2VsZiwgX3NlbGYucGFuZXNbMl0pXHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uYXRpb25QYW5lLnN1Ym1pdChfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcGFuZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXZlcnNhbFBhbmVGb2N1cyhzZWxmLCBkb25hdGlvblBhbmUucGFuZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbmF0aW9uUGFuZS5mb2N1cyhfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gdGhpcy5wYW5lcy5sZW5ndGgtMSkge1xyXG4gICAgICAgICAgICAgICAgLy9ObyBzdWJtaXQgZnVuY3Rpb24gbmVlZGVkIG9uIGxhc3QgcGFuZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VibWl0IGZ1bmN0aW9uIHNwZWNpZmllZCBmb3IgYSBwYW5lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKGkgIT0gdGhpcy5wYW5lcy5sZW5ndGgtMSkgaW5zZXJ0TmV4dEJ1dHRvbihwYW5lLCAoaSA9PSAwKSk7IC8vTm8gbmV4dCBidXR0b24gb24gbGFzdCBwYW5lXHJcbiAgICAgICAgICAgIGlmIChpICE9IDAgJiYgaSAhPSB0aGlzLnBhbmVzLmxlbmd0aC0xKSBpbnNlcnRQcmV2QnV0dG9uKHBhbmUpOyAvL05vIHByZXYgYnV0dG9uIG9uIGZpcnN0IGFuZCBsYXN0IHBhbmVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwQ2xvc2VCdG4oKTtcclxuICAgICAgICBzZXR1cEhhc0J0bkNsYXNzZXMoKTtcclxuICAgICAgICBzZXR1cFNlbGVjdE9uQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1bml2ZXJzYWxQYW5lRm9jdXMod2lkZ2V0LCBwYW5lKSB7XHJcbiAgICAgICAgdmFyIGFsbElucHV0cyA9IHdpZGdldC5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYWxsSW5wdXRzW2ldLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGFuZUlucHV0cyA9IHBhbmUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhbmVJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcGFuZUlucHV0c1tpXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBpKzEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBTZXR1cCBoZWxwZXJzICovXHJcbiAgICBmdW5jdGlvbiBzZXR1cENsb3NlQnRuKCkge1xyXG4gICAgICAgIF9zZWxmLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3NlbGYuY2xvc2UoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwSGFzQnRuQ2xhc3NlcygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9zZWxmLnBhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYW5lID0gX3NlbGYucGFuZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAocGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuXCIpLmxlbmd0aCA+IDApIHBhbmUuY2xhc3NMaXN0LmFkZChcImhhcy1idXR0b25zXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnNlcnROZXh0QnV0dG9uKHBhbmUsIGxvbmVseSkge1xyXG4gICAgICAgIHZhciBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcclxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImZyd2RcIik7XHJcblxyXG4gICAgICAgIGlmIChsb25lbHkpIGJ0bi5jbGFzc0xpc3QuYWRkKFwibG9uZWx5XCIpO1xyXG5cclxuICAgICAgICB2YXIgbnh0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBueHRJbWcuY2xhc3NMaXN0LmFkZChcImFycm93SW1hZ2VcIik7XHJcbiAgICAgICAgbnh0SW1nLnNyYyA9IF9zZWxmLmFzc2V0c1VybCArIFwibmV4dC5zdmdcIjtcclxuXHJcbiAgICAgICAgbG9hZGluZ0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbG9hZGluZ0ltZy5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ0ltYWdlXCIpO1xyXG4gICAgICAgIGxvYWRpbmdJbWcuc3JjID0gX3NlbGYuYXNzZXRzVXJsICsgXCJsb2FkaW5nLnN2Z1wiO1xyXG5cclxuICAgICAgICBidG4uYXBwZW5kQ2hpbGQobnh0SW1nKTtcclxuICAgICAgICBidG4uYXBwZW5kQ2hpbGQobG9hZGluZ0ltZyk7XHJcblxyXG4gICAgICAgIHBhbmUuYXBwZW5kQ2hpbGQoYnRuKTtcclxuXHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHBhbmUuc3VibWl0KF9zZWxmLCBwYW5lKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5zZXJ0UHJldkJ1dHRvbihwYW5lKSB7XHJcbiAgICAgICAgdmFyIGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIpO1xyXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiYmFja1wiKTtcclxuXHJcbiAgICAgICAgdmFyIG54dEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbnh0SW1nLmNsYXNzTGlzdC5hZGQoXCJhcnJvd0ltYWdlXCIpO1xyXG4gICAgICAgIG54dEltZy5zcmMgPSBfc2VsZi5hc3NldHNVcmwgKyBcIm5leHQuc3ZnXCI7XHJcblxyXG4gICAgICAgIGxvYWRpbmdJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxvYWRpbmdJbWcuY2xhc3NMaXN0LmFkZChcImxvYWRpbmdJbWFnZVwiKTtcclxuICAgICAgICBsb2FkaW5nSW1nLnNyYyA9IF9zZWxmLmFzc2V0c1VybCArIFwibG9hZGluZy5zdmdcIjtcclxuXHJcbiAgICAgICAgYnRuLmFwcGVuZENoaWxkKG54dEltZyk7XHJcbiAgICAgICAgYnRuLmFwcGVuZENoaWxkKGxvYWRpbmdJbWcpO1xyXG5cclxuICAgICAgICBwYW5lLmFwcGVuZENoaWxkKGJ0bik7XHJcblxyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBfc2VsZi5wcmV2U2xpZGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN1Ym1pdE9uRW50ZXIoZSkge1xyXG4gICAgICAgIHZhciBwYW5lID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIHZhciBpbnB1dHMgPSBwYW5lLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFt0eXBlPXRleHRdLCBpbnB1dFt0eXBlPXRlbF1cIik7XHJcbiAgICAgICAgaWYgKGlucHV0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBpbnB1dHMubGVuZ3RoLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKFwiaW5wdXRtb2RlXCIpID09IFwibnVtZXJpY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IG51bWJlcklucHV0V2hpdGVsaXN0Q2hlY2soZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfc2VsZi5hY3RpdmVFcnJvcikgX3NlbGYuaGlkZUVycm9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmUuc3VibWl0KF9zZWxmLCBwYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfc2VsZi5hY3RpdmVFcnJvcikgX3NlbGYuaGlkZUVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmUuc3VibWl0KF9zZWxmLCBwYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gaW5wdXRzW2krMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShcImlucHV0bW9kZVwiKSA9PSBcIm51bWVyaWNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gbnVtYmVySW5wdXRXaGl0ZWxpc3RDaGVjayhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfc2VsZi5hY3RpdmVFcnJvcikgX3NlbGYuaGlkZUVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHsgLy9lbnRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbnVtYmVySW5wdXRXaGl0ZWxpc3RDaGVjayhlKSB7XHJcbiAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgY2Fycm90UG9zaXRpb24gPSBlLnRhcmdldC5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICB2YXIgdmFsdWUgPSBlLnRhcmdldC52YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIsXCIsIFwiZ1wiKSwgXCIuXCIpO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwibm9jb21tYVwiKSA9PSBcInRydWVcIiAmJiAodmFsdWUuaW5kZXhPZihcIi5cIikgIT0gLTEpKSB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh2YWxpZCAmJiB2YWx1ZS5pbmRleE9mKFwiIFwiKSAhPSAtMSkgdmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBudW1EZWNpbWFscyA9IHZhbHVlLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgbnVtRGVjaW1hbHMgPSAobnVtRGVjaW1hbHMubGVuZ3RoICA+IDEgPyBudW1EZWNpbWFsc1sxXS5sZW5ndGggOiAwKTtcclxuICAgICAgICAgICAgdmFsaWQgPSAoKH5+dmFsdWUgPiAwICYmIG51bURlY2ltYWxzIDwgMykgfHwgdmFsdWUgPT0gXCIwXCIpO1xyXG4gICAgICAgIH1cclxuIFxyXG4gICAgICAgIGlmICghdmFsaWQpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPSBlLnRhcmdldC52YWx1ZS5zbGljZSgwLGNhcnJvdFBvc2l0aW9uLTEpICsgZS50YXJnZXQudmFsdWUuc2xpY2UoY2Fycm90UG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgZS50YXJnZXQuc2V0U2VsZWN0aW9uUmFuZ2UoY2Fycm90UG9zaXRpb24tMSwgY2Fycm90UG9zaXRpb24tMSk7XHJcbiAgICAgICAgICAgIC8vdGltZW91dCBuZWVkZWQgZm9yIG1vYmlsZSBhbmRyb2lkXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zZXRTZWxlY3Rpb25SYW5nZShjYXJyb3RQb3NpdGlvbi0xLCBjYXJyb3RQb3NpdGlvbi0xKTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcG9zdERvbmF0aW9uKHBvc3REYXRhLCBueHRCdG4pIHtcclxuICAgICAgICBfc2VsZi5yZXF1ZXN0KFwiZG9uYXRpb25zXCIsIFwiUE9TVFwiLCBwb3N0RGF0YSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgPT0gMCB8fCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIgPT0gMCkgX3NlbGYuZXJyb3IoXCJOw6VyIGlra2Ugc2VydmVyLiBGb3Jzw7hrIGlnamVuIHNlbmVyZS5cIik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlcnIgPT0gNTAwKSBfc2VsZi5lcnJvcihcIkRldCBlciBub2UgZmVpbCBtZWQgZG9uYXNqb25lblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBueHRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbnh0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3VsdFBhbmUgPSBfc2VsZi5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJyZXN1bHRcIilbMF07XHJcblxyXG4gICAgICAgICAgICByZXN1bHRQYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhbW91bnRcIilbMF0uaW5uZXJIVE1MID0gX3NlbGYuZG9uYXRpb25BbW91bnQgKyBcImtyXCI7XHJcbiAgICAgICAgICAgIHZhciBLSURzdHJpbmcgPSBkYXRhLmNvbnRlbnQuS0lELnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIEtJRHN0cmluZyA9IEtJRHN0cmluZy5zbGljZSgwLDMpICsgXCIgXCIgKyBLSURzdHJpbmcuc2xpY2UoMyw1KSArIFwiIFwiICsgS0lEc3RyaW5nLnNsaWNlKDUpO1xyXG4gICAgICAgICAgICByZXN1bHRQYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJLSURcIilbMF0uaW5uZXJIVE1MID0gS0lEc3RyaW5nO1xyXG4gICAgICAgICAgICByZXN1bHRQYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlbWFpbFwiKVswXS5pbm5lckhUTUwgPSBfc2VsZi5lbWFpbDtcclxuXHJcbiAgICAgICAgICAgIF9zZWxmLm5leHRTbGlkZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb3N0RG9uYXRpb24gPSBwb3N0RG9uYXRpb247XHJcblxyXG4gICAgLyogU2xpZGVyIGNvbnRyb2wgKi9cclxuICAgIHRoaXMuZ29Ub1NsaWRlID0gZnVuY3Rpb24oc2xpZGVudW0pIHtcclxuICAgICAgICBpZiAoc2xpZGVudW0gPCAwIHx8IHNsaWRlbnVtID4gX3NlbGYucGFuZXMubGVuZ3RoIC0gMSkgdGhyb3cgRXJyb3IoXCJTbGlkZSB1bmRlciAwIG9yIGxhcmdlciB0aGFuIHNldFwiKVxyXG4gICAgICAgIF9zZWxmLnNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoLVwiICsgKHNsaWRlbnVtICogX3NlbGYud2lkdGgpICsgXCJweClcIjtcclxuXHJcbiAgICAgICAgdmFyIHBhbmUgPSBfc2VsZi5wYW5lc1tzbGlkZW51bV07XHJcblxyXG4gICAgICAgIGlmIChwYW5lLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xyXG4gICAgICAgICAgICBpZiAoX3NlbGYuY3VycmVudFNsaWRlIDwgc2xpZGVudW0pIHNsaWRlbnVtKys7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKF9zZWxmLmN1cnJlbnRTbGlkZSA+IHNsaWRlbnVtKSBzbGlkZW51bS0tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFuZSA9IF9zZWxmLnBhbmVzW3NsaWRlbnVtXTtcclxuXHJcbiAgICAgICAgaWYgKHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vSWYgcGFuZSBoYXMgYnV0dG9uLCBtYWtlIHJvb20gZm9yIHRob3NlXHJcbiAgICAgICAgICAgIHZhciBwYWRkaW5nID0gOTA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBhZGRpbmcgPSA1MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbm5lclwiKVswXS5jbGllbnRIZWlnaHQgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGVudW0gPT0gX3NlbGYucGFuZXMubGVuZ3RoLTEpIF9zZWxmLmVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0ID0gXCIzMDAwcHhcIjtcclxuXHJcbiAgICAgICAgaWYgKGhlaWdodCA8IDMwMCkgaGVpZ2h0ID0gMzAwO1xyXG4gICAgICAgIF9zZWxmLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgIGlmIChfc2VsZi5hY3RpdmUpIHBhbmUuZm9jdXMoX3NlbGYsIHBhbmUpO1xyXG4gXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3NlbGYuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIF9zZWxmLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImlubmVyXCIpWzBdLnN0eWxlLnBvc2l0aW9uID0gXCJzdGF0aWNcIjtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfc2VsZi5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbm5lclwiKVswXS5zdHlsZS5wb3NpdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBfc2VsZi5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcclxuICAgICAgICAgICAgfSwgNSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgX3NlbGYuY3VycmVudFNsaWRlID0gc2xpZGVudW07XHJcbiAgICAgICAgdXBkYXRlU2xpZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5leHRTbGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ29Ub1NsaWRlKF9zZWxmLmN1cnJlbnRTbGlkZSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJldlNsaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nb1RvU2xpZGUoX3NlbGYuY3VycmVudFNsaWRlIC0gIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vUHJvZ3Jlc3MgYmFyXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZXJQcm9ncmVzcygpIHtcclxuICAgICAgICBfc2VsZi5wcm9ncmVzcy5zdHlsZS53aWR0aCA9ICgxMDAgLyAoX3NlbGYuYWN0aXZlUGFuZXMpKSAqIF9zZWxmLmN1cnJlbnRTbGlkZSArIFwiJVwiO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVTbGlkZXJQcm9ncmVzcyA9IHVwZGF0ZVNsaWRlclByb2dyZXNzO1xyXG5cclxuICAgIC8qIEVycm9yIGVsZW1lbnQgKi9cclxuICAgIHRoaXMuZXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICBfc2VsZi5hY3RpdmVFcnJvciA9IHRydWU7XHJcbiAgICAgICAgX3NlbGYuZXJyb3JFbGVtZW50LmlubmVySFRNTCA9IG1zZztcclxuICAgICAgICBfc2VsZi5lcnJvckVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICBfc2VsZi5wYW5lc1tfc2VsZi5jdXJyZW50U2xpZGVdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsb2FkaW5nXCIpWzBdLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoaWRlRXJyb3IoKTtcclxuICAgICAgICB9LCA1MDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoaWRlRXJyb3IoKSB7XHJcbiAgICAgICAgX3NlbGYuZXJyb3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgX3NlbGYuYWN0aXZlRXJyb3IgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMuaGlkZUVycm9yID0gaGlkZUVycm9yO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldE5vQXBpRXJyb3IoKSB7XHJcbiAgICAgICAgdmFyIG5vQXBpRXJyb3JFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub19hcGlfZXJyb3JcIik7XHJcblxyXG4gICAgICAgIG5vQXBpRXJyb3JFbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwO1xyXG4gICAgICAgIG5vQXBpRXJyb3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyogTmV0d29yayBoZWxwZXJzICovXHJcbiAgICB2YXIgYXBpX3VybCA9IFwiaHR0cHM6Ly9hcGkuZ2llZmZla3RpdnQubm8vXCI7XHJcbiAgICAvL3ZhciBhcGlfdXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvXCI7XHJcblxyXG4gICAgdGhpcy5yZXF1ZXN0ID0gZnVuY3Rpb24oZW5kcG9pbnQsIHR5cGUsIGRhdGEsIGNiKSB7XHJcbiAgICAgICAgdmFyIGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgdXJsID0gYXBpX3VybCArIGVuZHBvaW50O1xyXG5cclxuICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIMKgwqDCoCBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYihyZXNwb25zZS5jb250ZW50LCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNiKHRoaXMuc3RhdHVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICDCoMKgwqAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09IFwiUE9TVFwiKSB7XHJcbiAgICAgICAgICAgIGh0dHAub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xyXG4gICAgICAgICAgICBodHRwLnNlbmQoXCJkYXRhPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGRhdGEpKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiR0VUXCIpIHtcclxuICAgICAgICAgICAgaHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGh0dHAuc2VuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9VSSBzbmF6enluZXNzXHJcbiAgICBmdW5jdGlvbiBzZXR1cFNlbGVjdE9uQ2xpY2soKSB7XHJcbiAgICAgICAgdmFyIGVsZW1zID0gX3NlbGYucGFuZXNbX3NlbGYucGFuZXMubGVuZ3RoIC0gMV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGVjdC1vbi1jbGlja1wiKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBlbGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0Tm9kZVRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3ROb2RlVGV4dChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcztcclxuIFxyXG4gICAgICAgIGlmICggZG9jdW1lbnQuc2VsZWN0aW9uICkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICAgICAgICByYW5nZS5tb3ZlVG9FbGVtZW50VGV4dChub2RlKTtcclxuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggd2luZG93LmdldFNlbGVjdGlvbiApIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKG5vZGUpO1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5hZGRSYW5nZShyYW5nZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vQWN0aXZhdGUgVUlcclxuICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB3aWRnZXQgPSBfc2VsZjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwid2lkZ2V0LWFjdGl2ZVwiKTtcclxuICAgICAgICBfc2VsZi53cmFwcGVyLnN0eWxlLnpJbmRleCA9IDEwMDAwMDtcclxuXHJcbiAgICAgICAgX3NlbGYuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIF9zZWxmLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICB2YXIgYWN0aXZlUGFuZSA9IF9zZWxmLnBhbmVzW19zZWxmLmN1cnJlbnRTbGlkZV07XHJcbiAgICAgICAgYWN0aXZlUGFuZS5mb2N1cyhfc2VsZiwgYWN0aXZlUGFuZSk7XHJcblxyXG4gICAgICAgIF9zZWxmLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vVXNlciBpcyBlbmdhZ2VkIGluIGZvcm0sIGFjdGl2YXRlIFwiYXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlXCIgcHJvbXB0IG9uIGF0dGVtcHQgdG8gbmF2aWdhdGUgYXdheVxyXG4gICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJ3aWRnZXQtYWN0aXZlXCIpO1xyXG4gICAgICAgIF9zZWxmLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICBfc2VsZi53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgX3NlbGYuZWxlbWVudC5zdHlsZS5tYXhIZWlnaHQgPSBcIlwiO1xyXG5cclxuICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBudWxsO1xyXG5cclxuICAgICAgICBfc2VsZi5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3NlbGYud3JhcHBlci5zdHlsZS56SW5kZXggPSAtMTtcclxuICAgICAgICAgICAgaWYgKF9zZWxmLmN1cnJlbnRTbGlkZSA9PSBfc2VsZi5wYW5lcy5sZW5ndGgtMSkgeyBcclxuICAgICAgICAgICAgICAgIF9zZWxmLmdvVG9TbGlkZSgwKTtcclxuICAgICAgICAgICAgICAgIF9zZWxmLnBhbmVzWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrLXNlbGVjdC1yZWNvbW1lbmRlZFwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH0gIFxyXG5cclxuICAgIC8qIFJldHVybiAqL1xyXG4gICAgdmFyIHByb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxyXG4gICAgICAgIHBhbmVzOiB0aGlzLnBhbmVzLFxyXG4gICAgICAgIGdvVG9TbGlkZTogdGhpcy5nb1RvU2xpZGUsXHJcbiAgICAgICAgbmV4dFNsaWRlOiB0aGlzLm5leHRTbGlkZSxcclxuICAgICAgICBzbGlkZXI6IHRoaXMuc2xpZGVyLFxyXG4gICAgICAgIHNldHNwbGl0OiB0aGlzLnNldFNwbGl0VmFsdWVzLFxyXG4gICAgICAgIHNob3c6IHRoaXMuc2hvdyxcclxuICAgICAgICBjbG9zZTogdGhpcy5jbG9zZSxcclxuICAgICAgICBlcnJvcjogdGhpcy5lcnJvcixcclxuICAgICAgICByZXF1ZXN0OiB0aGlzLnJlcXVlc3QsXHJcbiAgICAgICAgdXBkYXRlU2xpZGVyUHJvZ3Jlc3M6IHRoaXMudXBkYXRlU2xpZGVyUHJvZ3Jlc3MsXHJcbiAgICAgICAgcG9zdERvbmF0aW9uOiB0aGlzLnBvc3REb25hdGlvbixcclxuICAgICAgICBwcmV2U2xpZGU6IHRoaXMucHJldlNsaWRlLFxyXG4gICAgICAgIGhpZGVFcnJvcjogdGhpcy5oaWRlRXJyb3IsXHJcbiAgICAgICAgc2V0dXA6IHRoaXMuc2V0dXBcclxuICAgIH1cclxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG59IFxyXG5cclxud2luZG93LkRvbmF0aW9uV2lkZ2V0ID0gRG9uYXRpb25XaWRnZXQ7XHJcbiJdfQ==
