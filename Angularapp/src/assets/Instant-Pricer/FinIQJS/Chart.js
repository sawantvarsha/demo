(function(global, factory) { typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(function() { try { return require('moment') } catch (e) {} }()) : typeof define === 'function' && define.amd ? define(['require'], function(require) { return factory(function() { try { return require('moment') } catch (e) {} }()) }) : (global.Chart = factory(global.moment)) }(this, (function(moment) {
    'use strict';
    moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;
    var conversions = { rgb2hsl: rgb2hsl, rgb2hsv: rgb2hsv, rgb2hwb: rgb2hwb, rgb2cmyk: rgb2cmyk, rgb2keyword: rgb2keyword, rgb2xyz: rgb2xyz, rgb2lab: rgb2lab, rgb2lch: rgb2lch, hsl2rgb: hsl2rgb, hsl2hsv: hsl2hsv, hsl2hwb: hsl2hwb, hsl2cmyk: hsl2cmyk, hsl2keyword: hsl2keyword, hsv2rgb: hsv2rgb, hsv2hsl: hsv2hsl, hsv2hwb: hsv2hwb, hsv2cmyk: hsv2cmyk, hsv2keyword: hsv2keyword, hwb2rgb: hwb2rgb, hwb2hsl: hwb2hsl, hwb2hsv: hwb2hsv, hwb2cmyk: hwb2cmyk, hwb2keyword: hwb2keyword, cmyk2rgb: cmyk2rgb, cmyk2hsl: cmyk2hsl, cmyk2hsv: cmyk2hsv, cmyk2hwb: cmyk2hwb, cmyk2keyword: cmyk2keyword, keyword2rgb: keyword2rgb, keyword2hsl: keyword2hsl, keyword2hsv: keyword2hsv, keyword2hwb: keyword2hwb, keyword2cmyk: keyword2cmyk, keyword2lab: keyword2lab, keyword2xyz: keyword2xyz, xyz2rgb: xyz2rgb, xyz2lab: xyz2lab, xyz2lch: xyz2lch, lab2xyz: lab2xyz, lab2rgb: lab2rgb, lab2lch: lab2lch, lch2lab: lch2lab, lch2xyz: lch2xyz, lch2rgb: lch2rgb };

    function rgb2hsl(rgb) {
        var r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            delta = max - min,
            h, s, l;
        if (max == min) h = 0;
        else if (r == max) h = (g - b) / delta;
        else if (g == max) h = 2 + (b - r) / delta;
        else if (b == max) h = 4 + (r - g) / delta;
        h = Math.min(h * 60, 360);
        if (h < 0) h += 360;
        l = (min + max) / 2;
        if (max == min) s = 0;
        else if (l <= 0.5) s = delta / (max + min);
        else s = delta / (2 - max - min);
        return [h, s * 100, l * 100]
    }

    function rgb2hsv(rgb) {
        var r = rgb[0],
            g = rgb[1],
            b = rgb[2],
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            delta = max - min,
            h, s, v;
        if (max == 0) s = 0;
        else s = (delta / max * 1000) / 10;
        if (max == min) h = 0;
        else if (r == max) h = (g - b) / delta;
        else if (g == max) h = 2 + (b - r) / delta;
        else if (b == max) h = 4 + (r - g) / delta;
        h = Math.min(h * 60, 360);
        if (h < 0) h += 360;
        v = ((max / 255) * 1000) / 10;
        return [h, s, v]
    }

    function rgb2hwb(rgb) {
        var r = rgb[0],
            g = rgb[1],
            b = rgb[2],
            h = rgb2hsl(rgb)[0],
            w = 1 / 255 * Math.min(r, Math.min(g, b)),
            b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
        return [h, w * 100, b * 100]
    }

    function rgb2cmyk(rgb) {
        var r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255,
            c, m, y, k;
        k = Math.min(1 - r, 1 - g, 1 - b);
        c = (1 - r - k) / (1 - k) || 0;
        m = (1 - g - k) / (1 - k) || 0;
        y = (1 - b - k) / (1 - k) || 0;
        return [c * 100, m * 100, y * 100, k * 100]
    }

    function rgb2keyword(rgb) { return reverseKeywords[JSON.stringify(rgb)] }

    function rgb2xyz(rgb) {
        var r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255;
        r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
        g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
        b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
        var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805),
            y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722),
            z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
        return [x * 100, y * 100, z * 100]
    }

    function rgb2lab(rgb) {
        var xyz = rgb2xyz(rgb),
            x = xyz[0],
            y = xyz[1],
            z = xyz[2],
            l, a, b;
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);
        return [l, a, b]
    }

    function rgb2lch(args) { return lab2lch(rgb2lab(args)) }

    function hsl2rgb(hsl) {
        var h = hsl[0] / 360,
            s = hsl[1] / 100,
            l = hsl[2] / 100,
            t1, t2, t3, rgb, val;
        if (s == 0) { val = l * 255; return [val, val, val] }
        if (l < 0.5) t2 = l * (1 + s);
        else t2 = l + s - l * s;
        t1 = 2 * l - t2;
        rgb = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            t3 = h + 1 / 3 * -(i - 1);
            t3 < 0 && t3++;
            t3 > 1 && t3--;
            if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;
            else if (2 * t3 < 1) val = t2;
            else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
            else val = t1;
            rgb[i] = val * 255
        }
        return rgb
    }

    function hsl2hsv(hsl) {
        var h = hsl[0],
            s = hsl[1] / 100,
            l = hsl[2] / 100,
            sv, v;
        if (l === 0) { return [0, 0, 0] }
        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        v = (l + s) / 2;
        sv = (2 * s) / (l + s);
        return [h, sv * 100, v * 100]
    }

    function hsl2hwb(args) { return rgb2hwb(hsl2rgb(args)) }

    function hsl2cmyk(args) { return rgb2cmyk(hsl2rgb(args)) }

    function hsl2keyword(args) { return rgb2keyword(hsl2rgb(args)) }

    function hsv2rgb(hsv) {
        var h = hsv[0] / 60,
            s = hsv[1] / 100,
            v = hsv[2] / 100,
            hi = Math.floor(h) % 6,
            f = h - Math.floor(h),
            p = 255 * v * (1 - s),
            q = 255 * v * (1 - (s * f)),
            t = 255 * v * (1 - (s * (1 - f))),
            v = 255 * v;
        switch (hi) {
            case 0:
                return [v, t, p];
            case 1:
                return [q, v, p];
            case 2:
                return [p, v, t];
            case 3:
                return [p, q, v];
            case 4:
                return [t, p, v];
            case 5:
                return [v, p, q]
        }
    }

    function hsv2hsl(hsv) {
        var h = hsv[0],
            s = hsv[1] / 100,
            v = hsv[2] / 100,
            sl, l;
        l = (2 - s) * v;
        sl = s * v;
        sl /= (l <= 1) ? l : 2 - l;
        sl = sl || 0;
        l /= 2;
        return [h, sl * 100, l * 100]
    }

    function hsv2hwb(args) { return rgb2hwb(hsv2rgb(args)) }

    function hsv2cmyk(args) { return rgb2cmyk(hsv2rgb(args)) }

    function hsv2keyword(args) { return rgb2keyword(hsv2rgb(args)) }

    function hwb2rgb(hwb) {
        var h = hwb[0] / 360,
            wh = hwb[1] / 100,
            bl = hwb[2] / 100,
            ratio = wh + bl,
            i, v, f, n;
        if (ratio > 1) {
            wh /= ratio;
            bl /= ratio
        }
        i = Math.floor(6 * h);
        v = 1 - bl;
        f = 6 * h - i;
        if ((i & 0x01) != 0) { f = 1 - f }
        n = wh + f * (v - wh);
        switch (i) {
            default:
                case 6:
                case 0:
                r = v;g = n;b = wh;
            break;
            case 1:
                    r = n;g = v;b = wh;
                break;
            case 2:
                    r = wh;g = v;b = n;
                break;
            case 3:
                    r = wh;g = n;b = v;
                break;
            case 4:
                    r = n;g = wh;b = v;
                break;
            case 5:
                    r = v;g = wh;b = n;
                break
        }
        return [r * 255, g * 255, b * 255]
    }

    function hwb2hsl(args) { return rgb2hsl(hwb2rgb(args)) }

    function hwb2hsv(args) { return rgb2hsv(hwb2rgb(args)) }

    function hwb2cmyk(args) { return rgb2cmyk(hwb2rgb(args)) }

    function hwb2keyword(args) { return rgb2keyword(hwb2rgb(args)) }

    function cmyk2rgb(cmyk) {
        var c = cmyk[0] / 100,
            m = cmyk[1] / 100,
            y = cmyk[2] / 100,
            k = cmyk[3] / 100,
            r, g, b;
        r = 1 - Math.min(1, c * (1 - k) + k);
        g = 1 - Math.min(1, m * (1 - k) + k);
        b = 1 - Math.min(1, y * (1 - k) + k);
        return [r * 255, g * 255, b * 255]
    }

    function cmyk2hsl(args) { return rgb2hsl(cmyk2rgb(args)) }

    function cmyk2hsv(args) { return rgb2hsv(cmyk2rgb(args)) }

    function cmyk2hwb(args) { return rgb2hwb(cmyk2rgb(args)) }

    function cmyk2keyword(args) { return rgb2keyword(cmyk2rgb(args)) }

    function xyz2rgb(xyz) {
        var x = xyz[0] / 100,
            y = xyz[1] / 100,
            z = xyz[2] / 100,
            r, g, b;
        r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
        g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
        b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);
        r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055) : r = (r * 12.92);
        g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055) : g = (g * 12.92);
        b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055) : b = (b * 12.92);
        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);
        return [r * 255, g * 255, b * 255]
    }

    function xyz2lab(xyz) {
        var x = xyz[0],
            y = xyz[1],
            z = xyz[2],
            l, a, b;
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);
        return [l, a, b]
    }

    function xyz2lch(args) { return lab2lch(xyz2lab(args)) }

    function lab2xyz(lab) {
        var l = lab[0],
            a = lab[1],
            b = lab[2],
            x, y, z, y2;
        if (l <= 8) {
            y = (l * 100) / 903.3;
            y2 = (7.787 * (y / 100)) + (16 / 116)
        } else {
            y = 100 * Math.pow((l + 16) / 116, 3);
            y2 = Math.pow(y / 100, 1 / 3)
        }
        x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);
        z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);
        return [x, y, z]
    }

    function lab2lch(lab) {
        var l = lab[0],
            a = lab[1],
            b = lab[2],
            hr, h, c;
        hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;
        if (h < 0) { h += 360 }
        c = Math.sqrt(a * a + b * b);
        return [l, c, h]
    }

    function lab2rgb(args) { return xyz2rgb(lab2xyz(args)) }

    function lch2lab(lch) {
        var l = lch[0],
            c = lch[1],
            h = lch[2],
            a, b, hr;
        hr = h / 360 * 2 * Math.PI;
        a = c * Math.cos(hr);
        b = c * Math.sin(hr);
        return [l, a, b]
    }

    function lch2xyz(args) { return lab2xyz(lch2lab(args)) }

    function lch2rgb(args) { return lab2rgb(lch2lab(args)) }

    function keyword2rgb(keyword) { return cssKeywords[keyword] }

    function keyword2hsl(args) { return rgb2hsl(keyword2rgb(args)) }

    function keyword2hsv(args) { return rgb2hsv(keyword2rgb(args)) }

    function keyword2hwb(args) { return rgb2hwb(keyword2rgb(args)) }

    function keyword2cmyk(args) { return rgb2cmyk(keyword2rgb(args)) }

    function keyword2lab(args) { return rgb2lab(keyword2rgb(args)) }

    function keyword2xyz(args) { return rgb2xyz(keyword2rgb(args)) }
    var cssKeywords = { aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255], aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220], bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205], blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42], burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0], chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237], cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11], darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255], firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34], fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255], gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128], green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128], honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222], lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50], linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0], mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238], mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133], midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238], palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185], peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221], powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153], red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225], saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96], seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45], silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205], slategray: [112, 128, 144], slategrey: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128], thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50] };
    var reverseKeywords = {};
    for (var key in cssKeywords) { reverseKeywords[JSON.stringify(cssKeywords[key])] = key }
    var convert = function() { return new Converter() };
    for (var func in conversions) {
        convert[func + "Raw"] = (function(func) { return function(arg) { if (typeof arg == "number") arg = Array.prototype.slice.call(arguments); return conversions[func](arg) }; })(func);
        var pair = /(\w+)2(\w+)/.exec(func),
            from = pair[1],
            to = pair[2];
        convert[from] = convert[from] || {};
        convert[from][to] = convert[func] = (function(func) { return function(arg) { if (typeof arg == "number") arg = Array.prototype.slice.call(arguments); var val = conversions[func](arg); if (typeof val == "string" || val === undefined) return val; for (var i = 0; i < val.length; i++) val[i] = Math.round(val[i]); return val }; })(func)
    }
    var Converter = function() { this.convs = {} };
    Converter.prototype.routeSpace = function(space, args) { var values = args[0]; if (values === undefined) { return this.getValues(space) } if (typeof values == "number") { values = Array.prototype.slice.call(args) } return this.setValues(space, values) };
    Converter.prototype.setValues = function(space, values) {
        this.space = space;
        this.convs = {};
        this.convs[space] = values;
        return this
    };
    Converter.prototype.getValues = function(space) {
        var vals = this.convs[space];
        if (!vals) {
            var fspace = this.space,
                from = this.convs[fspace];
            vals = convert[fspace][space](from);
            this.convs[space] = vals
        }
        return vals
    };
    ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) { Converter.prototype[space] = function(vals) { return this.routeSpace(space, arguments) } });
    var colorConvert = convert,
        colorName = { "aliceblue": [240, 248, 255], "antiquewhite": [250, 235, 215], "aqua": [0, 255, 255], "aquamarine": [127, 255, 212], "azure": [240, 255, 255], "beige": [245, 245, 220], "bisque": [255, 228, 196], "black": [0, 0, 0], "blanchedalmond": [255, 235, 205], "blue": [0, 0, 255], "blueviolet": [138, 43, 226], "brown": [165, 42, 42], "burlywood": [222, 184, 135], "cadetblue": [95, 158, 160], "chartreuse": [127, 255, 0], "chocolate": [210, 105, 30], "coral": [255, 127, 80], "cornflowerblue": [100, 149, 237], "cornsilk": [255, 248, 220], "crimson": [220, 20, 60], "cyan": [0, 255, 255], "darkblue": [0, 0, 139], "darkcyan": [0, 139, 139], "darkgoldenrod": [184, 134, 11], "darkgray": [169, 169, 169], "darkgreen": [0, 100, 0], "darkgrey": [169, 169, 169], "darkkhaki": [189, 183, 107], "darkmagenta": [139, 0, 139], "darkolivegreen": [85, 107, 47], "darkorange": [255, 140, 0], "darkorchid": [153, 50, 204], "darkred": [139, 0, 0], "darksalmon": [233, 150, 122], "darkseagreen": [143, 188, 143], "darkslateblue": [72, 61, 139], "darkslategray": [47, 79, 79], "darkslategrey": [47, 79, 79], "darkturquoise": [0, 206, 209], "darkviolet": [148, 0, 211], "deeppink": [255, 20, 147], "deepskyblue": [0, 191, 255], "dimgray": [105, 105, 105], "dimgrey": [105, 105, 105], "dodgerblue": [30, 144, 255], "firebrick": [178, 34, 34], "floralwhite": [255, 250, 240], "forestgreen": [34, 139, 34], "fuchsia": [255, 0, 255], "gainsboro": [220, 220, 220], "ghostwhite": [248, 248, 255], "gold": [255, 215, 0], "goldenrod": [218, 165, 32], "gray": [128, 128, 128], "green": [0, 128, 0], "greenyellow": [173, 255, 47], "grey": [128, 128, 128], "honeydew": [240, 255, 240], "hotpink": [255, 105, 180], "indianred": [205, 92, 92], "indigo": [75, 0, 130], "ivory": [255, 255, 240], "khaki": [240, 230, 140], "lavender": [230, 230, 250], "lavenderblush": [255, 240, 245], "lawngreen": [124, 252, 0], "lemonchiffon": [255, 250, 205], "lightblue": [173, 216, 230], "lightcoral": [240, 128, 128], "lightcyan": [224, 255, 255], "lightgoldenrodyellow": [250, 250, 210], "lightgray": [211, 211, 211], "lightgreen": [144, 238, 144], "lightgrey": [211, 211, 211], "lightpink": [255, 182, 193], "lightsalmon": [255, 160, 122], "lightseagreen": [32, 178, 170], "lightskyblue": [135, 206, 250], "lightslategray": [119, 136, 153], "lightslategrey": [119, 136, 153], "lightsteelblue": [176, 196, 222], "lightyellow": [255, 255, 224], "lime": [0, 255, 0], "limegreen": [50, 205, 50], "linen": [250, 240, 230], "magenta": [255, 0, 255], "maroon": [128, 0, 0], "mediumaquamarine": [102, 205, 170], "mediumblue": [0, 0, 205], "mediumorchid": [186, 85, 211], "mediumpurple": [147, 112, 219], "mediumseagreen": [60, 179, 113], "mediumslateblue": [123, 104, 238], "mediumspringgreen": [0, 250, 154], "mediumturquoise": [72, 209, 204], "mediumvioletred": [199, 21, 133], "midnightblue": [25, 25, 112], "mintcream": [245, 255, 250], "mistyrose": [255, 228, 225], "moccasin": [255, 228, 181], "navajowhite": [255, 222, 173], "navy": [0, 0, 128], "oldlace": [253, 245, 230], "olive": [128, 128, 0], "olivedrab": [107, 142, 35], "orange": [255, 165, 0], "orangered": [255, 69, 0], "orchid": [218, 112, 214], "palegoldenrod": [238, 232, 170], "palegreen": [152, 251, 152], "paleturquoise": [175, 238, 238], "palevioletred": [219, 112, 147], "papayawhip": [255, 239, 213], "peachpuff": [255, 218, 185], "peru": [205, 133, 63], "pink": [255, 192, 203], "plum": [221, 160, 221], "powderblue": [176, 224, 230], "purple": [128, 0, 128], "rebeccapurple": [102, 51, 153], "red": [255, 0, 0], "rosybrown": [188, 143, 143], "royalblue": [65, 105, 225], "saddlebrown": [139, 69, 19], "salmon": [250, 128, 114], "sandybrown": [244, 164, 96], "seagreen": [46, 139, 87], "seashell": [255, 245, 238], "sienna": [160, 82, 45], "silver": [192, 192, 192], "skyblue": [135, 206, 235], "slateblue": [106, 90, 205], "slategray": [112, 128, 144], "slategrey": [112, 128, 144], "snow": [255, 250, 250], "springgreen": [0, 255, 127], "steelblue": [70, 130, 180], "tan": [210, 180, 140], "teal": [0, 128, 128], "thistle": [216, 191, 216], "tomato": [255, 99, 71], "turquoise": [64, 224, 208], "violet": [238, 130, 238], "wheat": [245, 222, 179], "white": [255, 255, 255], "whitesmoke": [245, 245, 245], "yellow": [255, 255, 0], "yellowgreen": [154, 205, 50] };
    var colorString = { getRgba: getRgba, getHsla: getHsla, getRgb: getRgb, getHsl: getHsl, getHwb: getHwb, getAlpha: getAlpha, hexString: hexString, rgbString: rgbString, rgbaString: rgbaString, percentString: percentString, percentaString: percentaString, hslString: hslString, hslaString: hslaString, hwbString: hwbString, keyword: keyword };

    function getRgba(string) {
        if (!string) { return }
        var abbr = /^#([a-fA-F0-9]{3,4})$/i,
            hex = /^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i,
            rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
            per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
            keyword = /(\w+)/,
            rgb = [0, 0, 0],
            a = 1,
            match = string.match(abbr),
            hexAlpha = "";
        if (match) {
            match = match[1];
            hexAlpha = match[3];
            for (var i = 0; i < rgb.length; i++) { rgb[i] = parseInt(match[i] + match[i], 16) }
            if (hexAlpha) { a = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100 }
        } else if (match = string.match(hex)) {
            hexAlpha = match[2];
            match = match[1];
            for (var i = 0; i < rgb.length; i++) { rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16) }
            if (hexAlpha) { a = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100 }
        } else if (match = string.match(rgba)) {
            for (var i = 0; i < rgb.length; i++) { rgb[i] = parseInt(match[i + 1]) }
            a = parseFloat(match[4])
        } else if (match = string.match(per)) {
            for (var i = 0; i < rgb.length; i++) { rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55) }
            a = parseFloat(match[4])
        } else if (match = string.match(keyword)) {
            if (match[1] == "transparent") { return [0, 0, 0, 0] }
            rgb = colorName[match[1]];
            if (!rgb) { return }
        }
        for (var i = 0; i < rgb.length; i++) { rgb[i] = scale(rgb[i], 0, 255) }
        if (!a && a != 0) { a = 1 } else { a = scale(a, 0, 1) }
        rgb[3] = a;
        return rgb
    }

    function getHsla(string) {
        if (!string) { return }
        var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
            match = string.match(hsl);
        if (match) {
            var alpha = parseFloat(match[4]),
                h = scale(parseInt(match[1]), 0, 360),
                s = scale(parseFloat(match[2]), 0, 100),
                l = scale(parseFloat(match[3]), 0, 100),
                a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
            return [h, s, l, a]
        }
    }

    function getHwb(string) {
        if (!string) { return }
        var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
            match = string.match(hwb);
        if (match) {
            var alpha = parseFloat(match[4]),
                h = scale(parseInt(match[1]), 0, 360),
                w = scale(parseFloat(match[2]), 0, 100),
                b = scale(parseFloat(match[3]), 0, 100),
                a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
            return [h, w, b, a]
        }
    }

    function getRgb(string) { var rgba = getRgba(string); return rgba && rgba.slice(0, 3) }

    function getHsl(string) { var hsla = getHsla(string); return hsla && hsla.slice(0, 3) }

    function getAlpha(string) { var vals = getRgba(string); if (vals) { return vals[3] } else if (vals = getHsla(string)) { return vals[3] } else if (vals = getHwb(string)) { return vals[3] } }

    function hexString(rgba, a) { var a = (a !== undefined && rgba.length === 3) ? a : rgba[3]; return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + ((a >= 0 && a < 1) ? hexDouble(Math.round(a * 255)) : "") }

    function rgbString(rgba, alpha) { if (alpha < 1 || (rgba[3] && rgba[3] < 1)) { return rgbaString(rgba, alpha) } return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")" }

    function rgbaString(rgba, alpha) { if (alpha === undefined) { alpha = (rgba[3] !== undefined ? rgba[3] : 1) } return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + alpha + ")" }

    function percentString(rgba, alpha) {
        if (alpha < 1 || (rgba[3] && rgba[3] < 1)) { return percentaString(rgba, alpha) }
        var r = Math.round(rgba[0] / 255 * 100),
            g = Math.round(rgba[1] / 255 * 100),
            b = Math.round(rgba[2] / 255 * 100);
        return "rgb(" + r + "%, " + g + "%, " + b + "%)"
    }

    function percentaString(rgba, alpha) {
        var r = Math.round(rgba[0] / 255 * 100),
            g = Math.round(rgba[1] / 255 * 100),
            b = Math.round(rgba[2] / 255 * 100);
        return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")"
    }

    function hslString(hsla, alpha) { if (alpha < 1 || (hsla[3] && hsla[3] < 1)) { return hslaString(hsla, alpha) } return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" }

    function hslaString(hsla, alpha) { if (alpha === undefined) { alpha = (hsla[3] !== undefined ? hsla[3] : 1) } return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + alpha + ")" }

    function hwbString(hwb, alpha) { if (alpha === undefined) { alpha = (hwb[3] !== undefined ? hwb[3] : 1) } return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%" + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")" }

    function keyword(rgb) { return reverseNames[rgb.slice(0, 3)] }

    function scale(num, min, max) { return Math.min(Math.max(min, num), max) }

    function hexDouble(num) { var str = num.toString(16).toUpperCase(); return (str.length < 2) ? "0" + str : str }
    var reverseNames = {};
    for (var name in colorName) { reverseNames[colorName[name]] = name }
    var Color = function(obj) {
        if (obj instanceof Color) { return obj }
        if (!(this instanceof Color)) { return new Color(obj) }
        this.valid = false;
        this.values = { rgb: [0, 0, 0], hsl: [0, 0, 0], hsv: [0, 0, 0], hwb: [0, 0, 0], cmyk: [0, 0, 0, 0], alpha: 1 };
        var vals;
        if (typeof obj === 'string') { vals = colorString.getRgba(obj); if (vals) { this.setValues('rgb', vals) } else if (vals = colorString.getHsla(obj)) { this.setValues('hsl', vals) } else if (vals = colorString.getHwb(obj)) { this.setValues('hwb', vals) } } else if (typeof obj === 'object') { vals = obj; if (vals.r !== undefined || vals.red !== undefined) { this.setValues('rgb', vals) } else if (vals.l !== undefined || vals.lightness !== undefined) { this.setValues('hsl', vals) } else if (vals.v !== undefined || vals.value !== undefined) { this.setValues('hsv', vals) } else if (vals.w !== undefined || vals.whiteness !== undefined) { this.setValues('hwb', vals) } else if (vals.c !== undefined || vals.cyan !== undefined) { this.setValues('cmyk', vals) } }
    };
    Color.prototype = {
        isValid: function() { return this.valid },
        rgb: function() { return this.setSpace('rgb', arguments) },
        hsl: function() { return this.setSpace('hsl', arguments) },
        hsv: function() { return this.setSpace('hsv', arguments) },
        hwb: function() { return this.setSpace('hwb', arguments) },
        cmyk: function() { return this.setSpace('cmyk', arguments) },
        rgbArray: function() { return this.values.rgb },
        hslArray: function() { return this.values.hsl },
        hsvArray: function() { return this.values.hsv },
        hwbArray: function() { var values = this.values; if (values.alpha !== 1) { return values.hwb.concat([values.alpha]) } return values.hwb },
        cmykArray: function() { return this.values.cmyk },
        rgbaArray: function() { var values = this.values; return values.rgb.concat([values.alpha]) },
        hslaArray: function() { var values = this.values; return values.hsl.concat([values.alpha]) },
        alpha: function(val) {
            if (val === undefined) { return this.values.alpha }
            this.setValues('alpha', val);
            return this
        },
        red: function(val) { return this.setChannel('rgb', 0, val) },
        green: function(val) { return this.setChannel('rgb', 1, val) },
        blue: function(val) { return this.setChannel('rgb', 2, val) },
        hue: function(val) {
            if (val) {
                val %= 360;
                val = val < 0 ? 360 + val : val
            }
            return this.setChannel('hsl', 0, val)
        },
        saturation: function(val) { return this.setChannel('hsl', 1, val) },
        lightness: function(val) { return this.setChannel('hsl', 2, val) },
        saturationv: function(val) { return this.setChannel('hsv', 1, val) },
        whiteness: function(val) { return this.setChannel('hwb', 1, val) },
        blackness: function(val) { return this.setChannel('hwb', 2, val) },
        value: function(val) { return this.setChannel('hsv', 2, val) },
        cyan: function(val) { return this.setChannel('cmyk', 0, val) },
        magenta: function(val) { return this.setChannel('cmyk', 1, val) },
        yellow: function(val) { return this.setChannel('cmyk', 2, val) },
        black: function(val) { return this.setChannel('cmyk', 3, val) },
        hexString: function() { return colorString.hexString(this.values.rgb) },
        rgbString: function() { return colorString.rgbString(this.values.rgb, this.values.alpha) },
        rgbaString: function() { return colorString.rgbaString(this.values.rgb, this.values.alpha) },
        percentString: function() { return colorString.percentString(this.values.rgb, this.values.alpha) },
        hslString: function() { return colorString.hslString(this.values.hsl, this.values.alpha) },
        hslaString: function() { return colorString.hslaString(this.values.hsl, this.values.alpha) },
        hwbString: function() { return colorString.hwbString(this.values.hwb, this.values.alpha) },
        keyword: function() { return colorString.keyword(this.values.rgb, this.values.alpha) },
        rgbNumber: function() { var rgb = this.values.rgb; return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2] },
        luminosity: function() {
            var rgb = this.values.rgb,
                lum = [];
            for (var i = 0; i < rgb.length; i++) {
                var chan = rgb[i] / 255;
                lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4)
            }
            return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2]
        },
        contrast: function(color2) {
            var lum1 = this.luminosity(),
                lum2 = color2.luminosity();
            if (lum1 > lum2) { return (lum1 + 0.05) / (lum2 + 0.05) }
            return (lum2 + 0.05) / (lum1 + 0.05)
        },
        level: function(color2) { var contrastRatio = this.contrast(color2); if (contrastRatio >= 7.1) { return 'AAA' } return (contrastRatio >= 4.5) ? 'AA' : '' },
        dark: function() {
            var rgb = this.values.rgb,
                yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            return yiq < 128
        },
        light: function() { return !this.dark() },
        negate: function() {
            var rgb = [];
            for (var i = 0; i < 3; i++) { rgb[i] = 255 - this.values.rgb[i] }
            this.setValues('rgb', rgb);
            return this
        },
        lighten: function(ratio) {
            var hsl = this.values.hsl;
            hsl[2] += hsl[2] * ratio;
            this.setValues('hsl', hsl);
            return this
        },
        darken: function(ratio) {
            var hsl = this.values.hsl;
            hsl[2] -= hsl[2] * ratio;
            this.setValues('hsl', hsl);
            return this
        },
        saturate: function(ratio) {
            var hsl = this.values.hsl;
            hsl[1] += hsl[1] * ratio;
            this.setValues('hsl', hsl);
            return this
        },
        desaturate: function(ratio) {
            var hsl = this.values.hsl;
            hsl[1] -= hsl[1] * ratio;
            this.setValues('hsl', hsl);
            return this
        },
        whiten: function(ratio) {
            var hwb = this.values.hwb;
            hwb[1] += hwb[1] * ratio;
            this.setValues('hwb', hwb);
            return this
        },
        blacken: function(ratio) {
            var hwb = this.values.hwb;
            hwb[2] += hwb[2] * ratio;
            this.setValues('hwb', hwb);
            return this
        },
        greyscale: function() {
            var rgb = this.values.rgb,
                val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
            this.setValues('rgb', [val, val, val]);
            return this
        },
        clearer: function(ratio) {
            var alpha = this.values.alpha;
            this.setValues('alpha', alpha - (alpha * ratio));
            return this
        },
        opaquer: function(ratio) {
            var alpha = this.values.alpha;
            this.setValues('alpha', alpha + (alpha * ratio));
            return this
        },
        rotate: function(degrees) {
            var hsl = this.values.hsl,
                hue = (hsl[0] + degrees) % 360;
            hsl[0] = hue < 0 ? 360 + hue : hue;
            this.setValues('hsl', hsl);
            return this
        },
        mix: function(mixinColor, weight) {
            var color1 = this,
                color2 = mixinColor,
                p = weight === undefined ? 0.5 : weight,
                w = 2 * p - 1,
                a = color1.alpha() - color2.alpha(),
                w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0,
                w2 = 1 - w1;
            return this.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue()).alpha(color1.alpha() * p + color2.alpha() * (1 - p))
        },
        toJSON: function() { return this.rgb() },
        clone: function() {
            var result = new Color(),
                source = this.values,
                target = result.values,
                value, type;
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    value = source[prop];
                    type = ({}).toString.call(value);
                    if (type === '[object Array]') { target[prop] = value.slice(0) } else if (type === '[object Number]') { target[prop] = value } else { console.error('unexpected color value:', value) }
                }
            }
            return result
        }
    };
    Color.prototype.spaces = { rgb: ['red', 'green', 'blue'], hsl: ['hue', 'saturation', 'lightness'], hsv: ['hue', 'saturation', 'value'], hwb: ['hue', 'whiteness', 'blackness'], cmyk: ['cyan', 'magenta', 'yellow', 'black'] };
    Color.prototype.maxes = { rgb: [255, 255, 255], hsl: [360, 100, 100], hsv: [360, 100, 100], hwb: [360, 100, 100], cmyk: [100, 100, 100, 100] };
    Color.prototype.getValues = function(space) {
        var values = this.values,
            vals = {};
        for (var i = 0; i < space.length; i++) { vals[space.charAt(i)] = values[space][i] }
        if (values.alpha !== 1) { vals.a = values.alpha }
        return vals
    };
    Color.prototype.setValues = function(space, vals) {
        var values = this.values,
            spaces = this.spaces,
            maxes = this.maxes,
            alpha = 1,
            i;
        this.valid = true;
        if (space === 'alpha') { alpha = vals } else if (vals.length) {
            values[space] = vals.slice(0, space.length);
            alpha = vals[space.length]
        } else if (vals[space.charAt(0)] !== undefined) {
            for (i = 0; i < space.length; i++) { values[space][i] = vals[space.charAt(i)] }
            alpha = vals.a
        } else if (vals[spaces[space][0]] !== undefined) {
            var chans = spaces[space];
            for (i = 0; i < space.length; i++) { values[space][i] = vals[chans[i]] }
            alpha = vals.alpha
        }
        values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));
        if (space === 'alpha') { return false }
        var capped;
        for (i = 0; i < space.length; i++) {
            capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
            values[space][i] = Math.round(capped)
        }
        for (var sname in spaces) { if (sname !== space) { values[sname] = colorConvert[space][sname](values[space]) } }
        return true
    };
    Color.prototype.setSpace = function(space, args) {
        var vals = args[0];
        if (vals === undefined) { return this.getValues(space) }
        if (typeof vals === 'number') { vals = Array.prototype.slice.call(args) }
        this.setValues(space, vals);
        return this
    };
    Color.prototype.setChannel = function(space, index, val) {
        var svalues = this.values[space];
        if (val === undefined) { return svalues[index] } else if (val === svalues[index]) { return this }
        svalues[index] = val;
        this.setValues(space, svalues);
        return this
    };
    if (typeof window !== 'undefined') { window.Color = Color }
    var chartjsColor = Color,
        helpers = {
            noop: function() {},
            uid: (function() { var id = 0; return function() { return id++ } }()),
            isNullOrUndef: function(value) { return value === null || typeof value === 'undefined' },
            isArray: function(value) { if (Array.isArray && Array.isArray(value)) { return true } var type = Object.prototype.toString.call(value); if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') { return true } return false },
            isObject: function(value) { return value !== null && Object.prototype.toString.call(value) === '[object Object]' },
            isFinite: function(value) { return (typeof value === 'number' || value instanceof Number) && isFinite(value) },
            valueOrDefault: function(value, defaultValue) { return typeof value === 'undefined' ? defaultValue : value },
            valueAtIndexOrDefault: function(value, index, defaultValue) { return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue) },
            callback: function(fn, args, thisArg) { if (fn && typeof fn.call === 'function') { return fn.apply(thisArg, args) } },
            each: function(loopable, fn, thisArg, reverse) {
                var i, len, keys;
                if (helpers.isArray(loopable)) { len = loopable.length; if (reverse) { for (i = len - 1; i >= 0; i--) { fn.call(thisArg, loopable[i], i) } } else { for (i = 0; i < len; i++) { fn.call(thisArg, loopable[i], i) } } } else if (helpers.isObject(loopable)) {
                    keys = Object.keys(loopable);
                    len = keys.length;
                    for (i = 0; i < len; i++) { fn.call(thisArg, loopable[keys[i]], keys[i]) }
                }
            },
            arrayEquals: function(a0, a1) {
                var i, ilen, v0, v1;
                if (!a0 || !a1 || a0.length !== a1.length) { return false }
                for (i = 0, ilen = a0.length; i < ilen; ++i) {
                    v0 = a0[i];
                    v1 = a1[i];
                    if (v0 instanceof Array && v1 instanceof Array) { if (!helpers.arrayEquals(v0, v1)) { return false } } else if (v0 !== v1) { return false }
                }
                return true
            },
            clone: function(source) {
                if (helpers.isArray(source)) { return source.map(helpers.clone) }
                if (helpers.isObject(source)) {
                    var target = {},
                        keys = Object.keys(source),
                        klen = keys.length,
                        k = 0;
                    for (; k < klen; ++k) { target[keys[k]] = helpers.clone(source[keys[k]]) }
                    return target
                }
                return source
            },
            _merger: function(key, target, source, options) {
                var tval = target[key],
                    sval = source[key];
                if (helpers.isObject(tval) && helpers.isObject(sval)) { helpers.merge(tval, sval, options) } else { target[key] = helpers.clone(sval) }
            },
            _mergerIf: function(key, target, source) {
                var tval = target[key],
                    sval = source[key];
                if (helpers.isObject(tval) && helpers.isObject(sval)) { helpers.mergeIf(tval, sval) } else if (!target.hasOwnProperty(key)) { target[key] = helpers.clone(sval) }
            },
            merge: function(target, source, options) {
                var sources = helpers.isArray(source) ? source : [source],
                    ilen = sources.length,
                    merge, i, keys, klen, k;
                if (!helpers.isObject(target)) { return target }
                options = options || {};
                merge = options.merger || helpers._merger;
                for (i = 0; i < ilen; ++i) {
                    source = sources[i];
                    if (!helpers.isObject(source)) { continue }
                    keys = Object.keys(source);
                    for (k = 0, klen = keys.length; k < klen; ++k) { merge(keys[k], target, source, options) }
                }
                return target
            },
            mergeIf: function(target, source) { return helpers.merge(target, source, { merger: helpers._mergerIf }) },
            extend: function(target) { var setFn = function(value, key) { target[key] = value }; for (var i = 1, ilen = arguments.length; i < ilen; ++i) { helpers.each(arguments[i], setFn) } return target },
            inherits: function(extensions) {
                var me = this,
                    ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() { return me.apply(this, arguments) };
                var Surrogate = function() { this.constructor = ChartElement };
                Surrogate.prototype = me.prototype;
                ChartElement.prototype = new Surrogate();
                ChartElement.extend = helpers.inherits;
                if (extensions) { helpers.extend(ChartElement.prototype, extensions) }
                ChartElement.__super__ = me.prototype;
                return ChartElement
            }
        };
    var helpers_core = helpers;
    helpers.callCallback = helpers.callback;
    helpers.indexOf = function(array, item, fromIndex) { return Array.prototype.indexOf.call(array, item, fromIndex) };
    helpers.getValueOrDefault = helpers.valueOrDefault;
    helpers.getValueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    var effects = {
        linear: function(t) { return t },
        easeInQuad: function(t) { return t * t },
        easeOutQuad: function(t) { return -t * (t - 2) },
        easeInOutQuad: function(t) { if ((t /= 0.5) < 1) { return 0.5 * t * t } return -0.5 * ((--t) * (t - 2) - 1) },
        easeInCubic: function(t) { return t * t * t },
        easeOutCubic: function(t) { return (t = t - 1) * t * t + 1 },
        easeInOutCubic: function(t) { if ((t /= 0.5) < 1) { return 0.5 * t * t * t } return 0.5 * ((t -= 2) * t * t + 2) },
        easeInQuart: function(t) { return t * t * t * t },
        easeOutQuart: function(t) { return -((t = t - 1) * t * t * t - 1) },
        easeInOutQuart: function(t) { if ((t /= 0.5) < 1) { return 0.5 * t * t * t * t } return -0.5 * ((t -= 2) * t * t * t - 2) },
        easeInQuint: function(t) { return t * t * t * t * t },
        easeOutQuint: function(t) { return (t = t - 1) * t * t * t * t + 1 },
        easeInOutQuint: function(t) { if ((t /= 0.5) < 1) { return 0.5 * t * t * t * t * t } return 0.5 * ((t -= 2) * t * t * t * t + 2) },
        easeInSine: function(t) { return -Math.cos(t * (Math.PI / 2)) + 1 },
        easeOutSine: function(t) { return Math.sin(t * (Math.PI / 2)) },
        easeInOutSine: function(t) { return -0.5 * (Math.cos(Math.PI * t) - 1) },
        easeInExpo: function(t) { return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1)) },
        easeOutExpo: function(t) { return (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1 },
        easeInOutExpo: function(t) { if (t === 0) { return 0 } if (t === 1) { return 1 } if ((t /= 0.5) < 1) { return 0.5 * Math.pow(2, 10 * (t - 1)) } return 0.5 * (-Math.pow(2, -10 * --t) + 2) },
        easeInCirc: function(t) { if (t >= 1) { return t } return -(Math.sqrt(1 - t * t) - 1) },
        easeOutCirc: function(t) { return Math.sqrt(1 - (t = t - 1) * t) },
        easeInOutCirc: function(t) { if ((t /= 0.5) < 1) { return -0.5 * (Math.sqrt(1 - t * t) - 1) } return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) },
        easeInElastic: function(t) {
            var s = 1.70158,
                p = 0,
                a = 1;
            if (t === 0) { return 0 }
            if (t === 1) { return 1 }
            if (!p) { p = 0.3 }
            if (a < 1) {
                a = 1;
                s = p / 4
            } else { s = p / (2 * Math.PI) * Math.asin(1 / a) }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p))
        },
        easeOutElastic: function(t) {
            var s = 1.70158,
                p = 0,
                a = 1;
            if (t === 0) { return 0 }
            if (t === 1) { return 1 }
            if (!p) { p = 0.3 }
            if (a < 1) {
                a = 1;
                s = p / 4
            } else { s = p / (2 * Math.PI) * Math.asin(1 / a) }
            return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1
        },
        easeInOutElastic: function(t) {
            var s = 1.70158,
                p = 0,
                a = 1;
            if (t === 0) { return 0 }
            if ((t /= 0.5) === 2) { return 1 }
            if (!p) { p = 0.45 }
            if (a < 1) {
                a = 1;
                s = p / 4
            } else { s = p / (2 * Math.PI) * Math.asin(1 / a) }
            if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p)) }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1
        },
        easeInBack: function(t) { var s = 1.70158; return t * t * ((s + 1) * t - s) },
        easeOutBack: function(t) { var s = 1.70158; return (t = t - 1) * t * ((s + 1) * t + s) + 1 },
        easeInOutBack: function(t) { var s = 1.70158; if ((t /= 0.5) < 1) { return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s)) } return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) },
        easeInBounce: function(t) { return 1 - effects.easeOutBounce(1 - t) },
        easeOutBounce: function(t) { if (t < (1 / 2.75)) { return 7.5625 * t * t } if (t < (2 / 2.75)) { return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75 } if (t < (2.5 / 2.75)) { return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375 } return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375 },
        easeInOutBounce: function(t) { if (t < 0.5) { return effects.easeInBounce(t * 2) * 0.5 } return effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5 }
    };
    var helpers_easing = { effects: effects };
    helpers_core.easingEffects = effects;
    var PI = Math.PI,
        RAD_PER_DEG = PI / 180,
        DOUBLE_PI = PI * 2,
        HALF_PI = PI / 2,
        QUARTER_PI = PI / 4,
        TWO_THIRDS_PI = PI * 2 / 3,
        exports$1 = {
            clear: function(chart) { chart.ctx.clearRect(0, 0, chart.width, chart.height) },
            roundedRect: function(ctx, x, y, width, height, radius) {
                if (radius) {
                    var r = Math.min(radius, height / 2, width / 2),
                        left = x + r,
                        top = y + r,
                        right = x + width - r,
                        bottom = y + height - r;
                    ctx.moveTo(x, top);
                    if (left < right && top < bottom) {
                        ctx.arc(left, top, r, -PI, -HALF_PI);
                        ctx.arc(right, top, r, -HALF_PI, 0);
                        ctx.arc(right, bottom, r, 0, HALF_PI);
                        ctx.arc(left, bottom, r, HALF_PI, PI)
                    } else if (left < right) {
                        ctx.moveTo(left, y);
                        ctx.arc(right, top, r, -HALF_PI, HALF_PI);
                        ctx.arc(left, top, r, HALF_PI, PI + HALF_PI)
                    } else if (top < bottom) {
                        ctx.arc(left, top, r, -PI, 0);
                        ctx.arc(left, bottom, r, 0, PI)
                    } else { ctx.arc(left, top, r, -PI, PI) }
                    ctx.closePath();
                    ctx.moveTo(x, y)
                } else { ctx.rect(x, y, width, height) }
            },
            drawPoint: function(ctx, style, radius, x, y, rotation) {
                var type, xOffset, yOffset, size, cornerRadius, rad = (rotation || 0) * RAD_PER_DEG;
                if (style && typeof style === 'object') { type = style.toString(); if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') { ctx.drawImage(style, x - style.width / 2, y - style.height / 2, style.width, style.height); return } }
                if (isNaN(radius) || radius <= 0) { return }
                ctx.beginPath();
                switch (style) {
                    default: ctx.arc(x, y, radius, 0, DOUBLE_PI);ctx.closePath();
                    break;
                    case 'triangle':
                            ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);rad += TWO_THIRDS_PI;ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);rad += TWO_THIRDS_PI;ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);ctx.closePath();
                        break;
                    case 'rectRounded':
                            cornerRadius = radius * 0.516;size = radius - cornerRadius;xOffset = Math.cos(rad + QUARTER_PI) * size;yOffset = Math.sin(rad + QUARTER_PI) * size;ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);ctx.closePath();
                        break;
                    case 'rect':
                            if (!rotation) {
                            size = Math.SQRT1_2 * radius;
                            ctx.rect(x - size, y - size, 2 * size, 2 * size);
                            break
                        }rad += QUARTER_PI;
                    case 'rectRot':
                            xOffset = Math.cos(rad) * radius;yOffset = Math.sin(rad) * radius;ctx.moveTo(x - xOffset, y - yOffset);ctx.lineTo(x + yOffset, y - xOffset);ctx.lineTo(x + xOffset, y + yOffset);ctx.lineTo(x - yOffset, y + xOffset);ctx.closePath();
                        break;
                    case 'crossRot':
                            rad += QUARTER_PI;
                    case 'cross':
                            xOffset = Math.cos(rad) * radius;yOffset = Math.sin(rad) * radius;ctx.moveTo(x - xOffset, y - yOffset);ctx.lineTo(x + xOffset, y + yOffset);ctx.moveTo(x + yOffset, y - xOffset);ctx.lineTo(x - yOffset, y + xOffset);
                        break;
                    case 'star':
                            xOffset = Math.cos(rad) * radius;yOffset = Math.sin(rad) * radius;ctx.moveTo(x - xOffset, y - yOffset);ctx.lineTo(x + xOffset, y + yOffset);ctx.moveTo(x + yOffset, y - xOffset);ctx.lineTo(x - yOffset, y + xOffset);rad += QUARTER_PI;xOffset = Math.cos(rad) * radius;yOffset = Math.sin(rad) * radius;ctx.moveTo(x - xOffset, y - yOffset);ctx.lineTo(x + xOffset, y + yOffset);ctx.moveTo(x + yOffset, y - xOffset);ctx.lineTo(x - yOffset, y + xOffset);
                        break;
                    case 'line':
                            xOffset = Math.cos(rad) * radius;yOffset = Math.sin(rad) * radius;ctx.moveTo(x - xOffset, y - yOffset);ctx.lineTo(x + xOffset, y + yOffset);
                        break;
                    case 'dash':
                            ctx.moveTo(x, y);ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
                        break
                }
                ctx.fill();
                ctx.stroke()
            },
            _isPointInArea: function(point, area) { var epsilon = 1e-6; return point.x > area.left - epsilon && point.x < area.right + epsilon && point.y > area.top - epsilon && point.y < area.bottom + epsilon },
            clipArea: function(ctx, area) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
                ctx.clip()
            },
            unclipArea: function(ctx) { ctx.restore() },
            lineTo: function(ctx, previous, target, flip) {
                var stepped = target.steppedLine;
                if (stepped) {
                    if (stepped === 'middle') {
                        var midpoint = (previous.x + target.x) / 2.0;
                        ctx.lineTo(midpoint, flip ? target.y : previous.y);
                        ctx.lineTo(midpoint, flip ? previous.y : target.y)
                    } else if ((stepped === 'after' && !flip) || (stepped !== 'after' && flip)) { ctx.lineTo(previous.x, target.y) } else { ctx.lineTo(target.x, previous.y) }
                    ctx.lineTo(target.x, target.y);
                    return
                }
                if (!target.tension) { ctx.lineTo(target.x, target.y); return }
                ctx.bezierCurveTo(flip ? previous.controlPointPreviousX : previous.controlPointNextX, flip ? previous.controlPointPreviousY : previous.controlPointNextY, flip ? target.controlPointNextX : target.controlPointPreviousX, flip ? target.controlPointNextY : target.controlPointPreviousY, target.x, target.y)
            }
        };
    var helpers_canvas = exports$1;
    helpers_core.clear = exports$1.clear;
    helpers_core.drawRoundedRectangle = function(ctx) {
        ctx.beginPath();
        exports$1.roundedRect.apply(exports$1, arguments)
    };
    var defaults = { _set: function(scope, values) { return helpers_core.merge(this[scope] || (this[scope] = {}), values) } };
    defaults._set('global', { defaultColor: 'rgba(0,0,0,0.1)', defaultFontColor: '#666', defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", defaultFontSize: 12, defaultFontStyle: 'normal', defaultLineHeight: 1.2, showLines: true });
    var core_defaults = defaults,
        valueOrDefault = helpers_core.valueOrDefault;

    function toFontString(font) { if (!font || helpers_core.isNullOrUndef(font.size) || helpers_core.isNullOrUndef(font.family)) { return null } return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family }
    var helpers_options = {
        toLineHeight: function(value, size) {
            var matches = ('' + value).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
            if (!matches || matches[1] === 'normal') { return size * 1.2 }
            value = +matches[2];
            switch (matches[3]) {
                case 'px':
                    return value;
                case '%':
                    value /= 100;
                    break;
                default:
                    break
            }
            return size * value
        },
        toPadding: function(value) {
            var t, r, b, l;
            if (helpers_core.isObject(value)) {
                t = +value.top || 0;
                r = +value.right || 0;
                b = +value.bottom || 0;
                l = +value.left || 0
            } else { t = r = b = l = +value || 0 }
            return { top: t, right: r, bottom: b, left: l, height: t + b, width: l + r }
        },
        _parseFont: function(options) {
            var globalDefaults = core_defaults.global,
                size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize),
                font = { family: valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily), lineHeight: helpers_core.options.toLineHeight(valueOrDefault(options.lineHeight, globalDefaults.defaultLineHeight), size), size: size, style: valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle), weight: null, string: '' };
            font.string = toFontString(font);
            return font
        },
        resolve: function(inputs, context, index) { var i, ilen, value; for (i = 0, ilen = inputs.length; i < ilen; ++i) { value = inputs[i]; if (value === undefined) { continue } if (context !== undefined && typeof value === 'function') { value = value(context) } if (index !== undefined && helpers_core.isArray(value)) { value = value[index] } if (value !== undefined) { return value } } }
    };
    var helpers$1 = helpers_core,
        easing = helpers_easing,
        canvas = helpers_canvas,
        options = helpers_options;
    helpers$1.easing = easing;
    helpers$1.canvas = canvas;
    helpers$1.options = options;

    function interpolate(start, view, model, ease) {
        var keys = Object.keys(model),
            i, ilen, key, actual, origin, target, type, c0, c1;
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            target = model[key];
            if (!view.hasOwnProperty(key)) { view[key] = target }
            actual = view[key];
            if (actual === target || key[0] === '_') { continue }
            if (!start.hasOwnProperty(key)) { start[key] = actual }
            origin = start[key];
            type = typeof target;
            if (type === typeof origin) { if (type === 'string') { c0 = chartjsColor(origin); if (c0.valid) { c1 = chartjsColor(target); if (c1.valid) { view[key] = c1.mix(c0, ease).rgbString(); continue } } } else if (helpers$1.isFinite(origin) && helpers$1.isFinite(target)) { view[key] = origin + (target - origin) * ease; continue } }
            view[key] = target
        }
    }
    var Element = function(configuration) {
        helpers$1.extend(this, configuration);
        this.initialize.apply(this, arguments)
    };
    helpers$1.extend(Element.prototype, {
        initialize: function() { this.hidden = false },
        pivot: function() {
            var me = this;
            if (!me._view) { me._view = helpers$1.clone(me._model) }
            me._start = {};
            return me
        },
        transition: function(ease) {
            var me = this,
                model = me._model,
                start = me._start,
                view = me._view;
            if (!model || ease === 1) {
                me._view = model;
                me._start = null;
                return me
            }
            if (!view) { view = me._view = {} }
            if (!start) { start = me._start = {} }
            interpolate(start, view, model, ease);
            return me
        },
        tooltipPosition: function() { return { x: this._model.x, y: this._model.y } },
        hasValue: function() { return helpers$1.isNumber(this._model.x) && helpers$1.isNumber(this._model.y) }
    });
    Element.extend = helpers$1.inherits;
    var core_element = Element,
        exports$2 = core_element.extend({ chart: null, currentStep: 0, numSteps: 60, easing: '', render: null, onAnimationProgress: null, onAnimationComplete: null, });
    var core_animation = exports$2;
    Object.defineProperty(exports$2.prototype, 'animationObject', { get: function() { return this } });
    Object.defineProperty(exports$2.prototype, 'chartInstance', { get: function() { return this.chart }, set: function(value) { this.chart = value } });
    core_defaults._set('global', { animation: { duration: 1000, easing: 'easeOutQuart', onProgress: helpers$1.noop, onComplete: helpers$1.noop } });
    var core_animations = {
        animations: [],
        request: null,
        addAnimation: function(chart, animation, duration, lazy) {
            var animations = this.animations,
                i, ilen;
            animation.chart = chart;
            animation.startTime = Date.now();
            animation.duration = duration;
            if (!lazy) { chart.animating = true }
            for (i = 0, ilen = animations.length; i < ilen; ++i) { if (animations[i].chart === chart) { animations[i] = animation; return } }
            animations.push(animation);
            if (animations.length === 1) { this.requestAnimationFrame() }
        },
        cancelAnimation: function(chart) {
            var index = helpers$1.findIndex(this.animations, function(animation) { return animation.chart === chart });
            if (index !== -1) {
                this.animations.splice(index, 1);
                chart.animating = false
            }
        },
        requestAnimationFrame: function() {
            var me = this;
            if (me.request === null) {
                me.request = helpers$1.requestAnimFrame.call(window, function() {
                    me.request = null;
                    me.startDigest()
                })
            }
        },
        startDigest: function() {
            var me = this;
            me.advance();
            if (me.animations.length > 0) { me.requestAnimationFrame() }
        },
        advance: function() {
            var animations = this.animations,
                animation, chart, numSteps, nextStep, i = 0;
            while (i < animations.length) {
                animation = animations[i];
                chart = animation.chart;
                numSteps = animation.numSteps;
                nextStep = Math.floor((Date.now() - animation.startTime) / animation.duration * numSteps) + 1;
                animation.currentStep = Math.min(nextStep, numSteps);
                helpers$1.callback(animation.render, [chart, animation], chart);
                helpers$1.callback(animation.onAnimationProgress, [animation], chart);
                if (animation.currentStep >= numSteps) {
                    helpers$1.callback(animation.onAnimationComplete, [animation], chart);
                    chart.animating = false;
                    animations.splice(i, 1)
                } else {++i }
            }
        }
    };
    var resolve = helpers$1.options.resolve,
        arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

    function listenArrayEvents(array, listener) {
        if (array._chartjs) { array._chartjs.listeners.push(listener); return }
        Object.defineProperty(array, '_chartjs', { configurable: true, enumerable: false, value: { listeners: [listener] } });
        arrayEvents.forEach(function(key) {
            var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1),
                base = array[key];
            Object.defineProperty(array, key, {
                configurable: true,
                enumerable: false,
                value: function() {
                    var args = Array.prototype.slice.call(arguments),
                        res = base.apply(this, args);
                    helpers$1.each(array._chartjs.listeners, function(object) { if (typeof object[method] === 'function') { object[method].apply(object, args) } });
                    return res
                }
            })
        })
    }

    function unlistenArrayEvents(array, listener) {
        var stub = array._chartjs;
        if (!stub) { return }
        var listeners = stub.listeners,
            index = listeners.indexOf(listener);
        if (index !== -1) { listeners.splice(index, 1) }
        if (listeners.length > 0) { return }
        arrayEvents.forEach(function(key) { delete array[key] });
        delete array._chartjs
    }
    var DatasetController = function(chart, datasetIndex) { this.initialize(chart, datasetIndex) };
    helpers$1.extend(DatasetController.prototype, {
        datasetElementType: null,
        dataElementType: null,
        initialize: function(chart, datasetIndex) {
            var me = this;
            me.chart = chart;
            me.index = datasetIndex;
            me.linkScales();
            me.addElements()
        },
        updateIndex: function(datasetIndex) { this.index = datasetIndex },
        linkScales: function() {
            var me = this,
                meta = me.getMeta(),
                dataset = me.getDataset();
            if (meta.xAxisID === null || !(meta.xAxisID in me.chart.scales)) { meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id }
            if (meta.yAxisID === null || !(meta.yAxisID in me.chart.scales)) { meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id }
        },
        getDataset: function() { return this.chart.data.datasets[this.index] },
        getMeta: function() { return this.chart.getDatasetMeta(this.index) },
        getScaleForId: function(scaleID) { return this.chart.scales[scaleID] },
        _getValueScaleId: function() { return this.getMeta().yAxisID },
        _getIndexScaleId: function() { return this.getMeta().xAxisID },
        _getValueScale: function() { return this.getScaleForId(this._getValueScaleId()) },
        _getIndexScale: function() { return this.getScaleForId(this._getIndexScaleId()) },
        reset: function() { this.update(true) },
        destroy: function() { if (this._data) { unlistenArrayEvents(this._data, this) } },
        createMetaDataset: function() {
            var me = this,
                type = me.datasetElementType;
            return type && new type({ _chart: me.chart, _datasetIndex: me.index })
        },
        createMetaData: function(index) {
            var me = this,
                type = me.dataElementType;
            return type && new type({ _chart: me.chart, _datasetIndex: me.index, _index: index })
        },
        addElements: function() {
            var me = this,
                meta = me.getMeta(),
                data = me.getDataset().data || [],
                metaData = meta.data,
                i, ilen;
            for (i = 0, ilen = data.length; i < ilen; ++i) { metaData[i] = metaData[i] || me.createMetaData(i) }
            meta.dataset = meta.dataset || me.createMetaDataset()
        },
        addElementAndReset: function(index) {
            var element = this.createMetaData(index);
            this.getMeta().data.splice(index, 0, element);
            this.updateElement(element, index, true)
        },
        buildOrUpdateElements: function() {
            var me = this,
                dataset = me.getDataset(),
                data = dataset.data || (dataset.data = []);
            if (me._data !== data) {
                if (me._data) { unlistenArrayEvents(me._data, me) }
                if (data && Object.isExtensible(data)) { listenArrayEvents(data, me) }
                me._data = data
            }
            me.resyncElements()
        },
        update: helpers$1.noop,
        transition: function(easingValue) {
            var meta = this.getMeta(),
                elements = meta.data || [],
                ilen = elements.length,
                i = 0;
            for (; i < ilen; ++i) { elements[i].transition(easingValue) }
            if (meta.dataset) { meta.dataset.transition(easingValue) }
        },
        draw: function() {
            var meta = this.getMeta(),
                elements = meta.data || [],
                ilen = elements.length,
                i = 0;
            if (meta.dataset) { meta.dataset.draw() }
            for (; i < ilen; ++i) { elements[i].draw() }
        },
        removeHoverStyle: function(element) {
            helpers$1.merge(element._model, element.$previousStyle || {});
            delete element.$previousStyle
        },
        setHoverStyle: function(element) {
            var dataset = this.chart.data.datasets[element._datasetIndex],
                index = element._index,
                custom = element.custom || {},
                model = element._model,
                getHoverColor = helpers$1.getHoverColor;
            element.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth };
            model.backgroundColor = resolve([custom.hoverBackgroundColor, dataset.hoverBackgroundColor, getHoverColor(model.backgroundColor)], undefined, index);
            model.borderColor = resolve([custom.hoverBorderColor, dataset.hoverBorderColor, getHoverColor(model.borderColor)], undefined, index);
            model.borderWidth = resolve([custom.hoverBorderWidth, dataset.hoverBorderWidth, model.borderWidth], undefined, index)
        },
        resyncElements: function() {
            var me = this,
                meta = me.getMeta(),
                data = me.getDataset().data,
                numMeta = meta.data.length,
                numData = data.length;
            if (numData < numMeta) { meta.data.splice(numData, numMeta - numData) } else if (numData > numMeta) { me.insertElements(numMeta, numData - numMeta) }
        },
        insertElements: function(start, count) { for (var i = 0; i < count; ++i) { this.addElementAndReset(start + i) } },
        onDataPush: function() {
            var count = arguments.length;
            this.insertElements(this.getDataset().data.length - count, count)
        },
        onDataPop: function() { this.getMeta().data.pop() },
        onDataShift: function() { this.getMeta().data.shift() },
        onDataSplice: function(start, count) {
            this.getMeta().data.splice(start, count);
            this.insertElements(start, arguments.length - 2)
        },
        onDataUnshift: function() { this.insertElements(0, arguments.length) }
    });
    DatasetController.extend = helpers$1.inherits;
    var core_datasetController = DatasetController;
    core_defaults._set('global', { elements: { arc: { backgroundColor: core_defaults.global.defaultColor, borderColor: '#fff', borderWidth: 2, borderAlign: 'center' } } });
    var element_arc = core_element.extend({
        inLabelRange: function(mouseX) { var vm = this._view; if (vm) { return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2)) } return false },
        inRange: function(chartX, chartY) {
            var vm = this._view;
            if (vm) {
                var pointRelativePosition = helpers$1.getAngleFromPoint(vm, { x: chartX, y: chartY });
                var angle = pointRelativePosition.angle,
                    distance = pointRelativePosition.distance,
                    startAngle = vm.startAngle,
                    endAngle = vm.endAngle;
                while (endAngle < startAngle) { endAngle += 2.0 * Math.PI }
                while (angle > endAngle) { angle -= 2.0 * Math.PI }
                while (angle < startAngle) { angle += 2.0 * Math.PI }
                var betweenAngles = (angle >= startAngle && angle <= endAngle),
                    withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);
                return (betweenAngles && withinRadius)
            }
            return false
        },
        getCenterPoint: function() {
            var vm = this._view,
                halfAngle = (vm.startAngle + vm.endAngle) / 2,
                halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
            return { x: vm.x + Math.cos(halfAngle) * halfRadius, y: vm.y + Math.sin(halfAngle) * halfRadius }
        },
        getArea: function() { var vm = this._view; return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2)) },
        tooltipPosition: function() {
            var vm = this._view,
                centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2),
                rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
            return { x: vm.x + (Math.cos(centreAngle) * rangeFromCentre), y: vm.y + (Math.sin(centreAngle) * rangeFromCentre) }
        },
        draw: function() {
            var ctx = this._chart.ctx,
                vm = this._view,
                sA = vm.startAngle,
                eA = vm.endAngle,
                pixelMargin = (vm.borderAlign === 'inner') ? 0.33 : 0,
                angleMargin;
            ctx.save();
            ctx.beginPath();
            ctx.arc(vm.x, vm.y, Math.max(vm.outerRadius - pixelMargin, 0), sA, eA);
            ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
            ctx.closePath();
            ctx.fillStyle = vm.backgroundColor;
            ctx.fill();
            if (vm.borderWidth) {
                if (vm.borderAlign === 'inner') {
                    ctx.beginPath();
                    angleMargin = pixelMargin / vm.outerRadius;
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA - angleMargin, eA + angleMargin);
                    if (vm.innerRadius > pixelMargin) {
                        angleMargin = pixelMargin / vm.innerRadius;
                        ctx.arc(vm.x, vm.y, vm.innerRadius - pixelMargin, eA + angleMargin, sA - angleMargin, true)
                    } else { ctx.arc(vm.x, vm.y, pixelMargin, eA + Math.PI / 2, sA - Math.PI / 2) }
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
                    ctx.closePath();
                    ctx.lineWidth = vm.borderWidth * 2;
                    ctx.lineJoin = 'round'
                } else {
                    ctx.lineWidth = vm.borderWidth;
                    ctx.lineJoin = 'bevel'
                }
                ctx.strokeStyle = vm.borderColor;
                ctx.stroke()
            }
            ctx.restore()
        }
    });
    var valueOrDefault$1 = helpers$1.valueOrDefault,
        defaultColor = core_defaults.global.defaultColor;
    core_defaults._set('global', { elements: { line: { tension: 0.4, backgroundColor: defaultColor, borderWidth: 3, borderColor: defaultColor, borderCapStyle: 'butt', borderDash: [], borderDashOffset: 0.0, borderJoinStyle: 'miter', capBezierPoints: true, fill: true, } } });
    var element_line = core_element.extend({
        draw: function() {
            var me = this,
                vm = me._view,
                ctx = me._chart.ctx,
                spanGaps = vm.spanGaps,
                points = me._children.slice(),
                globalDefaults = core_defaults.global,
                globalOptionLineElements = globalDefaults.elements.line,
                lastDrawnIndex = -1,
                index, current, previous, currentVM;
            if (me._loop && points.length) { points.push(points[0]) }
            ctx.save();
            ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;
            if (ctx.setLineDash) { ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash) }
            ctx.lineDashOffset = valueOrDefault$1(vm.borderDashOffset, globalOptionLineElements.borderDashOffset);
            ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
            ctx.lineWidth = valueOrDefault$1(vm.borderWidth, globalOptionLineElements.borderWidth);
            ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;
            ctx.beginPath();
            lastDrawnIndex = -1;
            for (index = 0; index < points.length; ++index) {
                current = points[index];
                previous = helpers$1.previousItem(points, index);
                currentVM = current._view;
                if (index === 0) {
                    if (!currentVM.skip) {
                        ctx.moveTo(currentVM.x, currentVM.y);
                        lastDrawnIndex = index
                    }
                } else {
                    previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];
                    if (!currentVM.skip) {
                        if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) { ctx.moveTo(currentVM.x, currentVM.y) } else { helpers$1.canvas.lineTo(ctx, previous._view, current._view) }
                        lastDrawnIndex = index
                    }
                }
            }
            ctx.stroke();
            ctx.restore()
        }
    });
    var valueOrDefault$2 = helpers$1.valueOrDefault,
        defaultColor$1 = core_defaults.global.defaultColor;
    core_defaults._set('global', { elements: { point: { radius: 3, pointStyle: 'circle', backgroundColor: defaultColor$1, borderColor: defaultColor$1, borderWidth: 1, hitRadius: 1, hoverRadius: 4, hoverBorderWidth: 1 } } });

    function xRange(mouseX) { var vm = this._view; return vm ? (Math.abs(mouseX - vm.x) < vm.radius + vm.hitRadius) : false }

    function yRange(mouseY) { var vm = this._view; return vm ? (Math.abs(mouseY - vm.y) < vm.radius + vm.hitRadius) : false }
    var element_point = core_element.extend({
        inRange: function(mouseX, mouseY) { var vm = this._view; return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false },
        inLabelRange: xRange,
        inXRange: xRange,
        inYRange: yRange,
        getCenterPoint: function() { var vm = this._view; return { x: vm.x, y: vm.y } },
        getArea: function() { return Math.PI * Math.pow(this._view.radius, 2) },
        tooltipPosition: function() { var vm = this._view; return { x: vm.x, y: vm.y, padding: vm.radius + vm.borderWidth } },
        draw: function(chartArea) {
            var vm = this._view,
                ctx = this._chart.ctx,
                pointStyle = vm.pointStyle,
                rotation = vm.rotation,
                radius = vm.radius,
                x = vm.x,
                y = vm.y,
                globalDefaults = core_defaults.global,
                defaultColor = globalDefaults.defaultColor;
            if (vm.skip) { return }
            if (chartArea === undefined || helpers$1.canvas._isPointInArea(vm, chartArea)) {
                ctx.strokeStyle = vm.borderColor || defaultColor;
                ctx.lineWidth = valueOrDefault$2(vm.borderWidth, globalDefaults.elements.point.borderWidth);
                ctx.fillStyle = vm.backgroundColor || defaultColor;
                helpers$1.canvas.drawPoint(ctx, pointStyle, radius, x, y, rotation)
            }
        }
    });
    var defaultColor$2 = core_defaults.global.defaultColor;
    core_defaults._set('global', { elements: { rectangle: { backgroundColor: defaultColor$2, borderColor: defaultColor$2, borderSkipped: 'bottom', borderWidth: 0 } } });

    function isVertical(vm) { return vm && vm.width !== undefined }

    function getBarBounds(vm) {
        var x1, x2, y1, y2, half;
        if (isVertical(vm)) {
            half = vm.width / 2;
            x1 = vm.x - half;
            x2 = vm.x + half;
            y1 = Math.min(vm.y, vm.base);
            y2 = Math.max(vm.y, vm.base)
        } else {
            half = vm.height / 2;
            x1 = Math.min(vm.x, vm.base);
            x2 = Math.max(vm.x, vm.base);
            y1 = vm.y - half;
            y2 = vm.y + half
        }
        return { left: x1, top: y1, right: x2, bottom: y2 }
    }

    function swap(orig, v1, v2) { return orig === v1 ? v2 : orig === v2 ? v1 : orig }

    function parseBorderSkipped(vm) {
        var edge = vm.borderSkipped,
            res = {};
        if (!edge) { return res }
        if (vm.horizontal) { if (vm.base > vm.x) { edge = swap(edge, 'left', 'right') } } else if (vm.base < vm.y) { edge = swap(edge, 'bottom', 'top') }
        res[edge] = true;
        return res
    }

    function parseBorderWidth(vm, maxW, maxH) {
        var value = vm.borderWidth,
            skip = parseBorderSkipped(vm),
            t, r, b, l;
        if (helpers$1.isObject(value)) {
            t = +value.top || 0;
            r = +value.right || 0;
            b = +value.bottom || 0;
            l = +value.left || 0
        } else { t = r = b = l = +value || 0 }
        return { t: skip.top || (t < 0) ? 0 : t > maxH ? maxH : t, r: skip.right || (r < 0) ? 0 : r > maxW ? maxW : r, b: skip.bottom || (b < 0) ? 0 : b > maxH ? maxH : b, l: skip.left || (l < 0) ? 0 : l > maxW ? maxW : l }
    }

    function boundingRects(vm) {
        var bounds = getBarBounds(vm),
            width = bounds.right - bounds.left,
            height = bounds.bottom - bounds.top,
            border = parseBorderWidth(vm, width / 2, height / 2);
        return { outer: { x: bounds.left, y: bounds.top, w: width, h: height }, inner: { x: bounds.left + border.l, y: bounds.top + border.t, w: width - border.l - border.r, h: height - border.t - border.b } }
    }

    function inRange(vm, x, y) {
        var skipX = x === null,
            skipY = y === null,
            bounds = !vm || (skipX && skipY) ? false : getBarBounds(vm);
        return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom)
    }
    var element_rectangle = core_element.extend({
        draw: function() {
            var ctx = this._chart.ctx,
                vm = this._view,
                rects = boundingRects(vm),
                outer = rects.outer,
                inner = rects.inner;
            ctx.fillStyle = vm.backgroundColor;
            ctx.fillRect(outer.x, outer.y, outer.w, outer.h);
            if (outer.w === inner.w && outer.h === inner.h) { return }
            ctx.save();
            ctx.beginPath();
            ctx.rect(outer.x, outer.y, outer.w, outer.h);
            ctx.clip();
            ctx.fillStyle = vm.borderColor;
            ctx.rect(inner.x, inner.y, inner.w, inner.h);
            ctx.fill('evenodd');
            ctx.restore()
        },
        height: function() { var vm = this._view; return vm.base - vm.y },
        inRange: function(mouseX, mouseY) { return inRange(this._view, mouseX, mouseY) },
        inLabelRange: function(mouseX, mouseY) { var vm = this._view; return isVertical(vm) ? inRange(vm, mouseX, null) : inRange(vm, null, mouseY) },
        inXRange: function(mouseX) { return inRange(this._view, mouseX, null) },
        inYRange: function(mouseY) { return inRange(this._view, null, mouseY) },
        getCenterPoint: function() {
            var vm = this._view,
                x, y;
            if (isVertical(vm)) {
                x = vm.x;
                y = (vm.y + vm.base) / 2
            } else {
                x = (vm.x + vm.base) / 2;
                y = vm.y
            }
            return { x: x, y: y }
        },
        getArea: function() { var vm = this._view; return isVertical(vm) ? vm.width * Math.abs(vm.y - vm.base) : vm.height * Math.abs(vm.x - vm.base) },
        tooltipPosition: function() { var vm = this._view; return { x: vm.x, y: vm.y } }
    });
    var elements = {},
        Arc = element_arc,
        Line = element_line,
        Point = element_point,
        Rectangle = element_rectangle;
    elements.Arc = Arc;
    elements.Line = Line;
    elements.Point = Point;
    elements.Rectangle = Rectangle;
    var resolve$1 = helpers$1.options.resolve;
    core_defaults._set('bar', { hover: { mode: 'label' }, scales: { xAxes: [{ type: 'category', categoryPercentage: 0.8, barPercentage: 0.9, offset: true, gridLines: { offsetGridLines: true } }], yAxes: [{ type: 'linear' }] } });

    function computeMinSampleSize(scale, pixels) {
        var min = scale.isHorizontal() ? scale.width : scale.height,
            ticks = scale.getTicks(),
            prev, curr, i, ilen;
        for (i = 1, ilen = pixels.length; i < ilen; ++i) { min = Math.min(min, Math.abs(pixels[i] - pixels[i - 1])) }
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            curr = scale.getPixelForTick(i);
            min = i > 0 ? Math.min(min, curr - prev) : min;
            prev = curr
        }
        return min
    }

    function computeFitCategoryTraits(index, ruler, options) {
        var thickness = options.barThickness,
            count = ruler.stackCount,
            curr = ruler.pixels[index],
            size, ratio;
        if (helpers$1.isNullOrUndef(thickness)) {
            size = ruler.min * options.categoryPercentage;
            ratio = options.barPercentage
        } else {
            size = thickness * count;
            ratio = 1
        }
        return { chunk: size / count, ratio: ratio, start: curr - (size / 2) }
    }

    function computeFlexCategoryTraits(index, ruler, options) {
        var pixels = ruler.pixels,
            curr = pixels[index],
            prev = index > 0 ? pixels[index - 1] : null,
            next = index < pixels.length - 1 ? pixels[index + 1] : null,
            percent = options.categoryPercentage,
            start, size;
        if (prev === null) { prev = curr - (next === null ? ruler.end - ruler.start : next - curr) }
        if (next === null) { next = curr + curr - prev }
        start = curr - (curr - Math.min(prev, next)) / 2 * percent;
        size = Math.abs(next - prev) / 2 * percent;
        return { chunk: size / ruler.stackCount, ratio: options.barPercentage, start: start }
    }
    var controller_bar = core_datasetController.extend({
        dataElementType: elements.Rectangle,
        initialize: function() {
            var me = this,
                meta;
            core_datasetController.prototype.initialize.apply(me, arguments);
            meta = me.getMeta();
            meta.stack = me.getDataset().stack;
            meta.bar = true
        },
        update: function(reset) {
            var me = this,
                rects = me.getMeta().data,
                i, ilen;
            me._ruler = me.getRuler();
            for (i = 0, ilen = rects.length; i < ilen; ++i) { me.updateElement(rects[i], i, reset) }
        },
        updateElement: function(rectangle, index, reset) {
            var me = this,
                meta = me.getMeta(),
                dataset = me.getDataset(),
                options = me._resolveElementOptions(rectangle, index);
            rectangle._xScale = me.getScaleForId(meta.xAxisID);
            rectangle._yScale = me.getScaleForId(meta.yAxisID);
            rectangle._datasetIndex = me.index;
            rectangle._index = index;
            rectangle._model = { backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderSkipped: options.borderSkipped, borderWidth: options.borderWidth, datasetLabel: dataset.label, label: me.chart.data.labels[index] };
            me._updateElementGeometry(rectangle, index, reset);
            rectangle.pivot()
        },
        _updateElementGeometry: function(rectangle, index, reset) {
            var me = this,
                model = rectangle._model,
                vscale = me._getValueScale(),
                base = vscale.getBasePixel(),
                horizontal = vscale.isHorizontal(),
                ruler = me._ruler || me.getRuler(),
                vpixels = me.calculateBarValuePixels(me.index, index),
                ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
            model.horizontal = horizontal;
            model.base = reset ? base : vpixels.base;
            model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
            model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
            model.height = horizontal ? ipixels.size : undefined;
            model.width = horizontal ? undefined : ipixels.size
        },
        _getStacks: function(last) {
            var me = this,
                chart = me.chart,
                scale = me._getIndexScale(),
                stacked = scale.options.stacked,
                ilen = last === undefined ? chart.data.datasets.length : last + 1,
                stacks = [],
                i, meta;
            for (i = 0; i < ilen; ++i) { meta = chart.getDatasetMeta(i); if (meta.bar && chart.isDatasetVisible(i) && (stacked === false || (stacked === true && stacks.indexOf(meta.stack) === -1) || (stacked === undefined && (meta.stack === undefined || stacks.indexOf(meta.stack) === -1)))) { stacks.push(meta.stack) } }
            return stacks
        },
        getStackCount: function() { return this._getStacks().length },
        getStackIndex: function(datasetIndex, name) {
            var stacks = this._getStacks(datasetIndex),
                index = (name !== undefined) ? stacks.indexOf(name) : -1;
            return (index === -1) ? stacks.length - 1 : index
        },
        getRuler: function() {
            var me = this,
                scale = me._getIndexScale(),
                stackCount = me.getStackCount(),
                datasetIndex = me.index,
                isHorizontal = scale.isHorizontal(),
                start = isHorizontal ? scale.left : scale.top,
                end = start + (isHorizontal ? scale.width : scale.height),
                pixels = [],
                i, ilen, min;
            for (i = 0, ilen = me.getMeta().data.length; i < ilen; ++i) { pixels.push(scale.getPixelForValue(null, i, datasetIndex)) }
            min = helpers$1.isNullOrUndef(scale.options.barThickness) ? computeMinSampleSize(scale, pixels) : -1;
            return { min: min, pixels: pixels, start: start, end: end, stackCount: stackCount, scale: scale }
        },
        calculateBarValuePixels: function(datasetIndex, index) {
            var me = this,
                chart = me.chart,
                meta = me.getMeta(),
                scale = me._getValueScale(),
                isHorizontal = scale.isHorizontal(),
                datasets = chart.data.datasets,
                value = +scale.getRightValue(datasets[datasetIndex].data[index]),
                minBarLength = scale.options.minBarLength,
                stacked = scale.options.stacked,
                stack = meta.stack,
                start = 0,
                i, imeta, ivalue, base, head, size;
            if (stacked || (stacked === undefined && stack !== undefined)) { for (i = 0; i < datasetIndex; ++i) { imeta = chart.getDatasetMeta(i); if (imeta.bar && imeta.stack === stack && imeta.controller._getValueScaleId() === scale.id && chart.isDatasetVisible(i)) { ivalue = +scale.getRightValue(datasets[i].data[index]); if ((value < 0 && ivalue < 0) || (value >= 0 && ivalue > 0)) { start += ivalue } } } }
            base = scale.getPixelForValue(start);
            head = scale.getPixelForValue(start + value);
            size = head - base;
            if (minBarLength !== undefined && Math.abs(size) < minBarLength) { size = minBarLength; if (value >= 0 && !isHorizontal || value < 0 && isHorizontal) { head = base - minBarLength } else { head = base + minBarLength } }
            return { size: size, base: base, head: head, center: head + size / 2 }
        },
        calculateBarIndexPixels: function(datasetIndex, index, ruler) {
            var me = this,
                options = ruler.scale.options,
                range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options) : computeFitCategoryTraits(index, ruler, options),
                stackIndex = me.getStackIndex(datasetIndex, me.getMeta().stack),
                center = range.start + (range.chunk * stackIndex) + (range.chunk / 2),
                size = Math.min(helpers$1.valueOrDefault(options.maxBarThickness, Infinity), range.chunk * range.ratio);
            return { base: center - size / 2, head: center + size / 2, center: center, size: size }
        },
        draw: function() {
            var me = this,
                chart = me.chart,
                scale = me._getValueScale(),
                rects = me.getMeta().data,
                dataset = me.getDataset(),
                ilen = rects.length,
                i = 0;
            helpers$1.canvas.clipArea(chart.ctx, chart.chartArea);
            for (; i < ilen; ++i) { if (!isNaN(scale.getRightValue(dataset.data[i]))) { rects[i].draw() } }
            helpers$1.canvas.unclipArea(chart.ctx)
        },
        _resolveElementOptions: function(rectangle, index) {
            var me = this,
                chart = me.chart,
                datasets = chart.data.datasets,
                dataset = datasets[me.index],
                custom = rectangle.custom || {},
                options = chart.options.elements.rectangle,
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var keys = ['backgroundColor', 'borderColor', 'borderSkipped', 'borderWidth'];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$1([custom[key], dataset[key], options[key]], context, index)
            }
            return values
        }
    });
    var valueOrDefault$3 = helpers$1.valueOrDefault,
        resolve$2 = helpers$1.options.resolve;
    core_defaults._set('bubble', {
        hover: { mode: 'single' },
        scales: { xAxes: [{ type: 'linear', position: 'bottom', id: 'x-axis-0' }], yAxes: [{ type: 'linear', position: 'left', id: 'y-axis-0' }] },
        tooltips: {
            callbacks: {
                title: function() { return '' },
                label: function(item, data) {
                    var datasetLabel = data.datasets[item.datasetIndex].label || '',
                        dataPoint = data.datasets[item.datasetIndex].data[item.index];
                    return datasetLabel + ': (' + item.xLabel + ', ' + item.yLabel + ', ' + dataPoint.r + ')'
                }
            }
        }
    });
    var controller_bubble = core_datasetController.extend({
        dataElementType: elements.Point,
        update: function(reset) {
            var me = this,
                meta = me.getMeta(),
                points = meta.data;
            helpers$1.each(points, function(point, index) { me.updateElement(point, index, reset) })
        },
        updateElement: function(point, index, reset) {
            var me = this,
                meta = me.getMeta(),
                custom = point.custom || {},
                xScale = me.getScaleForId(meta.xAxisID),
                yScale = me.getScaleForId(meta.yAxisID),
                options = me._resolveElementOptions(point, index),
                data = me.getDataset().data[index],
                dsIndex = me.index,
                x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex),
                y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);
            point._xScale = xScale;
            point._yScale = yScale;
            point._options = options;
            point._datasetIndex = dsIndex;
            point._index = index;
            point._model = { backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderWidth: options.borderWidth, hitRadius: options.hitRadius, pointStyle: options.pointStyle, rotation: options.rotation, radius: reset ? 0 : options.radius, skip: custom.skip || isNaN(x) || isNaN(y), x: x, y: y, };
            point.pivot()
        },
        setHoverStyle: function(point) {
            var model = point._model,
                options = point._options,
                getHoverColor = helpers$1.getHoverColor;
            point.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth, radius: model.radius };
            model.backgroundColor = valueOrDefault$3(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault$3(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault$3(options.hoverBorderWidth, options.borderWidth);
            model.radius = options.radius + options.hoverRadius
        },
        _resolveElementOptions: function(point, index) {
            var me = this,
                chart = me.chart,
                datasets = chart.data.datasets,
                dataset = datasets[me.index],
                custom = point.custom || {},
                options = chart.options.elements.point,
                data = dataset.data[index],
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var keys = ['backgroundColor', 'borderColor', 'borderWidth', 'hoverBackgroundColor', 'hoverBorderColor', 'hoverBorderWidth', 'hoverRadius', 'hitRadius', 'pointStyle', 'rotation'];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$2([custom[key], dataset[key], options[key]], context, index)
            }
            values.radius = resolve$2([custom.radius, data ? data.r : undefined, dataset.radius, options.radius], context, index);
            return values
        }
    });
    var resolve$3 = helpers$1.options.resolve,
        valueOrDefault$4 = helpers$1.valueOrDefault;
    core_defaults._set('doughnut', {
        animation: { animateRotate: true, animateScale: false },
        hover: { mode: 'single' },
        legendCallback: function(chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            var data = chart.data,
                datasets = data.datasets,
                labels = data.labels;
            if (datasets.length) {
                for (var i = 0; i < datasets[0].data.length; ++i) {
                    text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
                    if (labels[i]) { text.push(labels[i]) }
                    text.push('</li>')
                }
            }
            text.push('</ul>');
            return text.join('')
        },
        legend: {
            labels: {
                generateLabels: function(chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function(label, i) {
                            var meta = chart.getDatasetMeta(0),
                                ds = data.datasets[0],
                                arc = meta.data[i],
                                custom = arc && arc.custom || {},
                                arcOpts = chart.options.elements.arc,
                                fill = resolve$3([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i),
                                stroke = resolve$3([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i),
                                bw = resolve$3([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);
                            return { text: label, fillStyle: fill, strokeStyle: stroke, lineWidth: bw, hidden: isNaN(ds.data[i]) || meta.data[i].hidden, index: i }
                        })
                    }
                    return []
                }
            },
            onClick: function(e, legendItem) {
                var index = legendItem.index,
                    chart = this.chart,
                    i, ilen, meta;
                for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) { meta = chart.getDatasetMeta(i); if (meta.data[index]) { meta.data[index].hidden = !meta.data[index].hidden } }
                chart.update()
            }
        },
        cutoutPercentage: 50,
        rotation: Math.PI * -0.5,
        circumference: Math.PI * 2.0,
        tooltips: {
            callbacks: {
                title: function() { return '' },
                label: function(tooltipItem, data) {
                    var dataLabel = data.labels[tooltipItem.index],
                        value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    if (helpers$1.isArray(dataLabel)) {
                        dataLabel = dataLabel.slice();
                        dataLabel[0] += value
                    } else { dataLabel += value }
                    return dataLabel
                }
            }
        }
    });
    var controller_doughnut = core_datasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers$1.noop,
        getRingIndex: function(datasetIndex) { var ringIndex = 0; for (var j = 0; j < datasetIndex; ++j) { if (this.chart.isDatasetVisible(j)) {++ringIndex } } return ringIndex },
        update: function(reset) {
            var me = this,
                chart = me.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                availableWidth = chartArea.right - chartArea.left,
                availableHeight = chartArea.bottom - chartArea.top,
                minSize = Math.min(availableWidth, availableHeight),
                offset = { x: 0, y: 0 };
            var meta = me.getMeta(),
                arcs = meta.data,
                cutoutPercentage = opts.cutoutPercentage,
                circumference = opts.circumference,
                chartWeight = me._getRingWeight(me.index),
                i, ilen;
            if (circumference < Math.PI * 2.0) {
                var startAngle = opts.rotation % (Math.PI * 2.0);
                startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
                var endAngle = startAngle + circumference,
                    start = { x: Math.cos(startAngle), y: Math.sin(startAngle) };
                var end = { x: Math.cos(endAngle), y: Math.sin(endAngle) };
                var contains0 = (startAngle <= 0 && endAngle >= 0) || (startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle),
                    contains90 = (startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle),
                    contains180 = (startAngle <= -Math.PI && -Math.PI <= endAngle) || (startAngle <= Math.PI && Math.PI <= endAngle),
                    contains270 = (startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle),
                    cutout = cutoutPercentage / 100.0,
                    min = { x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout)) };
                var max = { x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout)) };
                var size = { width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5 };
                minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
                offset = { x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5 }
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) { arcs[i]._options = me._resolveElementOptions(arcs[i], i) }
            chart.borderWidth = me.getMaxBorderWidth();
            chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
            chart.innerRadius = Math.max(cutoutPercentage ? (chart.outerRadius / 100) * (cutoutPercentage) : 0, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / (me._getVisibleDatasetWeightTotal() || 1);
            chart.offsetX = offset.x * chart.outerRadius;
            chart.offsetY = offset.y * chart.outerRadius;
            meta.total = me.calculateTotal();
            me.outerRadius = chart.outerRadius - chart.radiusLength * me._getRingWeightOffset(me.index);
            me.innerRadius = Math.max(me.outerRadius - chart.radiusLength * chartWeight, 0);
            for (i = 0, ilen = arcs.length; i < ilen; ++i) { me.updateElement(arcs[i], i, reset) }
        },
        updateElement: function(arc, index, reset) {
            var me = this,
                chart = me.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                animationOpts = opts.animation,
                centerX = (chartArea.left + chartArea.right) / 2,
                centerY = (chartArea.top + chartArea.bottom) / 2,
                startAngle = opts.rotation,
                endAngle = opts.rotation,
                dataset = me.getDataset(),
                circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
                innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius,
                outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius,
                options = arc._options || {};
            helpers$1.extend(arc, { _datasetIndex: me.index, _index: index, _model: { backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderWidth: options.borderWidth, borderAlign: options.borderAlign, x: centerX + chart.offsetX, y: centerY + chart.offsetY, startAngle: startAngle, endAngle: endAngle, circumference: circumference, outerRadius: outerRadius, innerRadius: innerRadius, label: helpers$1.valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index]) } });
            var model = arc._model;
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) { model.startAngle = opts.rotation } else { model.startAngle = me.getMeta().data[index - 1]._model.endAngle }
                model.endAngle = model.startAngle + model.circumference
            }
            arc.pivot()
        },
        calculateTotal: function() {
            var dataset = this.getDataset(),
                meta = this.getMeta(),
                total = 0,
                value;
            helpers$1.each(meta.data, function(element, index) { value = dataset.data[index]; if (!isNaN(value) && !element.hidden) { total += Math.abs(value) } });
            return total
        },
        calculateCircumference: function(value) { var total = this.getMeta().total; if (total > 0 && !isNaN(value)) { return (Math.PI * 2.0) * (Math.abs(value) / total) } return 0 },
        getMaxBorderWidth: function(arcs) {
            var me = this,
                max = 0,
                chart = me.chart,
                i, ilen, meta, arc, controller, options, borderWidth, hoverWidth;
            if (!arcs) {
                for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                    if (chart.isDatasetVisible(i)) {
                        meta = chart.getDatasetMeta(i);
                        arcs = meta.data;
                        if (i !== me.index) { controller = meta.controller }
                        break
                    }
                }
            }
            if (!arcs) { return 0 }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arc = arcs[i];
                options = controller ? controller._resolveElementOptions(arc, i) : arc._options;
                if (options.borderAlign !== 'inner') {
                    borderWidth = options.borderWidth;
                    hoverWidth = options.hoverBorderWidth;
                    max = borderWidth > max ? borderWidth : max;
                    max = hoverWidth > max ? hoverWidth : max
                }
            }
            return max
        },
        setHoverStyle: function(arc) {
            var model = arc._model,
                options = arc._options,
                getHoverColor = helpers$1.getHoverColor;
            arc.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth, };
            model.backgroundColor = valueOrDefault$4(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault$4(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault$4(options.hoverBorderWidth, options.borderWidth)
        },
        _resolveElementOptions: function(arc, index) {
            var me = this,
                chart = me.chart,
                dataset = me.getDataset(),
                custom = arc.custom || {},
                options = chart.options.elements.arc,
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var keys = ['backgroundColor', 'borderColor', 'borderWidth', 'borderAlign', 'hoverBackgroundColor', 'hoverBorderColor', 'hoverBorderWidth', ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$3([custom[key], dataset[key], options[key]], context, index)
            }
            return values
        },
        _getRingWeightOffset: function(datasetIndex) { var ringWeightOffset = 0; for (var i = 0; i < datasetIndex; ++i) { if (this.chart.isDatasetVisible(i)) { ringWeightOffset += this._getRingWeight(i) } } return ringWeightOffset },
        _getRingWeight: function(dataSetIndex) { return Math.max(valueOrDefault$4(this.chart.data.datasets[dataSetIndex].weight, 1), 0) },
        _getVisibleDatasetWeightTotal: function() { return this._getRingWeightOffset(this.chart.data.datasets.length) }
    });
    core_defaults._set('horizontalBar', { hover: { mode: 'index', axis: 'y' }, scales: { xAxes: [{ type: 'linear', position: 'bottom' }], yAxes: [{ type: 'category', position: 'left', categoryPercentage: 0.8, barPercentage: 0.9, offset: true, gridLines: { offsetGridLines: true } }] }, elements: { rectangle: { borderSkipped: 'left' } }, tooltips: { mode: 'index', axis: 'y' } });
    var controller_horizontalBar = controller_bar.extend({ _getValueScaleId: function() { return this.getMeta().xAxisID }, _getIndexScaleId: function() { return this.getMeta().yAxisID } });
    var valueOrDefault$5 = helpers$1.valueOrDefault,
        resolve$4 = helpers$1.options.resolve,
        isPointInArea = helpers$1.canvas._isPointInArea;
    core_defaults._set('line', { showLines: true, spanGaps: false, hover: { mode: 'label' }, scales: { xAxes: [{ type: 'category', id: 'x-axis-0' }], yAxes: [{ type: 'linear', id: 'y-axis-0' }] } });

    function lineEnabled(dataset, options) { return valueOrDefault$5(dataset.showLine, options.showLines) }
    var controller_line = core_datasetController.extend({
        datasetElementType: elements.Line,
        dataElementType: elements.Point,
        update: function(reset) {
            var me = this,
                meta = me.getMeta(),
                line = meta.dataset,
                points = meta.data || [],
                scale = me.getScaleForId(meta.yAxisID),
                dataset = me.getDataset(),
                showLine = lineEnabled(dataset, me.chart.options),
                i, ilen;
            if (showLine) {
                if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) { dataset.lineTension = dataset.tension }
                line._scale = scale;
                line._datasetIndex = me.index;
                line._children = points;
                line._model = me._resolveLineOptions(line);
                line.pivot()
            }
            for (i = 0, ilen = points.length; i < ilen; ++i) { me.updateElement(points[i], i, reset) }
            if (showLine && line._model.tension !== 0) { me.updateBezierControlPoints() }
            for (i = 0, ilen = points.length; i < ilen; ++i) { points[i].pivot() }
        },
        updateElement: function(point, index, reset) {
            var me = this,
                meta = me.getMeta(),
                custom = point.custom || {},
                dataset = me.getDataset(),
                datasetIndex = me.index,
                value = dataset.data[index],
                yScale = me.getScaleForId(meta.yAxisID),
                xScale = me.getScaleForId(meta.xAxisID),
                lineModel = meta.dataset._model,
                x, y, options = me._resolvePointOptions(point, index);
            x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex);
            y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);
            point._xScale = xScale;
            point._yScale = yScale;
            point._options = options;
            point._datasetIndex = datasetIndex;
            point._index = index;
            point._model = { x: x, y: y, skip: custom.skip || isNaN(x) || isNaN(y), radius: options.radius, pointStyle: options.pointStyle, rotation: options.rotation, backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderWidth: options.borderWidth, tension: valueOrDefault$5(custom.tension, lineModel ? lineModel.tension : 0), steppedLine: lineModel ? lineModel.steppedLine : false, hitRadius: options.hitRadius }
        },
        _resolvePointOptions: function(element, index) {
            var me = this,
                chart = me.chart,
                dataset = chart.data.datasets[me.index],
                custom = element.custom || {},
                options = chart.options.elements.point,
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var ELEMENT_OPTIONS = { backgroundColor: 'pointBackgroundColor', borderColor: 'pointBorderColor', borderWidth: 'pointBorderWidth', hitRadius: 'pointHitRadius', hoverBackgroundColor: 'pointHoverBackgroundColor', hoverBorderColor: 'pointHoverBorderColor', hoverBorderWidth: 'pointHoverBorderWidth', hoverRadius: 'pointHoverRadius', pointStyle: 'pointStyle', radius: 'pointRadius', rotation: 'pointRotation' };
            var keys = Object.keys(ELEMENT_OPTIONS);
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$4([custom[key], dataset[ELEMENT_OPTIONS[key]], dataset[key], options[key]], context, index)
            }
            return values
        },
        _resolveLineOptions: function(element) {
            var me = this,
                chart = me.chart,
                dataset = chart.data.datasets[me.index],
                custom = element.custom || {},
                options = chart.options,
                elementOptions = options.elements.line,
                values = {},
                i, ilen, key, keys = ['backgroundColor', 'borderWidth', 'borderColor', 'borderCapStyle', 'borderDash', 'borderDashOffset', 'borderJoinStyle', 'fill', 'cubicInterpolationMode'];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$4([custom[key], dataset[key], elementOptions[key]])
            }
            values.spanGaps = valueOrDefault$5(dataset.spanGaps, options.spanGaps);
            values.tension = valueOrDefault$5(dataset.lineTension, elementOptions.tension);
            values.steppedLine = resolve$4([custom.steppedLine, dataset.steppedLine, elementOptions.stepped]);
            return values
        },
        calculatePointY: function(value, index, datasetIndex) {
            var me = this,
                chart = me.chart,
                meta = me.getMeta(),
                yScale = me.getScaleForId(meta.yAxisID),
                sumPos = 0,
                sumNeg = 0,
                i, ds, dsMeta;
            if (yScale.options.stacked) {
                for (i = 0; i < datasetIndex; i++) {
                    ds = chart.data.datasets[i];
                    dsMeta = chart.getDatasetMeta(i);
                    if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) { var stackedRightValue = Number(yScale.getRightValue(ds.data[index])); if (stackedRightValue < 0) { sumNeg += stackedRightValue || 0 } else { sumPos += stackedRightValue || 0 } }
                }
                var rightValue = Number(yScale.getRightValue(value));
                if (rightValue < 0) { return yScale.getPixelForValue(sumNeg + rightValue) }
                return yScale.getPixelForValue(sumPos + rightValue)
            }
            return yScale.getPixelForValue(value)
        },
        updateBezierControlPoints: function() {
            var me = this,
                chart = me.chart,
                meta = me.getMeta(),
                lineModel = meta.dataset._model,
                area = chart.chartArea,
                points = meta.data || [],
                i, ilen, model, controlPoints;
            if (lineModel.spanGaps) { points = points.filter(function(pt) { return !pt._model.skip }) }

            function capControlPoint(pt, min, max) { return Math.max(Math.min(pt, max), min) }
            if (lineModel.cubicInterpolationMode === 'monotone') { helpers$1.splineCurveMonotone(points) } else {
                for (i = 0, ilen = points.length; i < ilen; ++i) {
                    model = points[i]._model;
                    controlPoints = helpers$1.splineCurve(helpers$1.previousItem(points, i)._model, model, helpers$1.nextItem(points, i)._model, lineModel.tension);
                    model.controlPointPreviousX = controlPoints.previous.x;
                    model.controlPointPreviousY = controlPoints.previous.y;
                    model.controlPointNextX = controlPoints.next.x;
                    model.controlPointNextY = controlPoints.next.y
                }
            }
            if (chart.options.elements.line.capBezierPoints) {
                for (i = 0, ilen = points.length; i < ilen; ++i) {
                    model = points[i]._model;
                    if (isPointInArea(model, area)) {
                        if (i > 0 && isPointInArea(points[i - 1]._model, area)) {
                            model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
                            model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom)
                        }
                        if (i < points.length - 1 && isPointInArea(points[i + 1]._model, area)) {
                            model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
                            model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom)
                        }
                    }
                }
            }
        },
        draw: function() {
            var me = this,
                chart = me.chart,
                meta = me.getMeta(),
                points = meta.data || [],
                area = chart.chartArea,
                ilen = points.length,
                halfBorderWidth, i = 0;
            if (lineEnabled(me.getDataset(), chart.options)) {
                halfBorderWidth = (meta.dataset._model.borderWidth || 0) / 2;
                helpers$1.canvas.clipArea(chart.ctx, { left: area.left, right: area.right, top: area.top - halfBorderWidth, bottom: area.bottom + halfBorderWidth });
                meta.dataset.draw();
                helpers$1.canvas.unclipArea(chart.ctx)
            }
            for (; i < ilen; ++i) { points[i].draw(area) }
        },
        setHoverStyle: function(point) {
            var model = point._model,
                options = point._options,
                getHoverColor = helpers$1.getHoverColor;
            point.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth, radius: model.radius };
            model.backgroundColor = valueOrDefault$5(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault$5(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault$5(options.hoverBorderWidth, options.borderWidth);
            model.radius = valueOrDefault$5(options.hoverRadius, options.radius)
        },
    });
    var resolve$5 = helpers$1.options.resolve;
    core_defaults._set('polarArea', {
        scale: { type: 'radialLinear', angleLines: { display: false }, gridLines: { circular: true }, pointLabels: { display: false }, ticks: { beginAtZero: true } },
        animation: { animateRotate: true, animateScale: true },
        startAngle: -0.5 * Math.PI,
        legendCallback: function(chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            var data = chart.data,
                datasets = data.datasets,
                labels = data.labels;
            if (datasets.length) {
                for (var i = 0; i < datasets[0].data.length; ++i) {
                    text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
                    if (labels[i]) { text.push(labels[i]) }
                    text.push('</li>')
                }
            }
            text.push('</ul>');
            return text.join('')
        },
        legend: {
            labels: {
                generateLabels: function(chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function(label, i) {
                            var meta = chart.getDatasetMeta(0),
                                ds = data.datasets[0],
                                arc = meta.data[i],
                                custom = arc.custom || {},
                                arcOpts = chart.options.elements.arc,
                                fill = resolve$5([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i),
                                stroke = resolve$5([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i),
                                bw = resolve$5([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);
                            return { text: label, fillStyle: fill, strokeStyle: stroke, lineWidth: bw, hidden: isNaN(ds.data[i]) || meta.data[i].hidden, index: i }
                        })
                    }
                    return []
                }
            },
            onClick: function(e, legendItem) {
                var index = legendItem.index,
                    chart = this.chart,
                    i, ilen, meta;
                for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                    meta = chart.getDatasetMeta(i);
                    meta.data[index].hidden = !meta.data[index].hidden
                }
                chart.update()
            }
        },
        tooltips: { callbacks: { title: function() { return '' }, label: function(item, data) { return data.labels[item.index] + ': ' + item.yLabel } } }
    });
    var controller_polarArea = core_datasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers$1.noop,
        update: function(reset) {
            var me = this,
                dataset = me.getDataset(),
                meta = me.getMeta(),
                start = me.chart.options.startAngle || 0,
                starts = me._starts = [],
                angles = me._angles = [],
                arcs = meta.data,
                i, ilen, angle;
            me._updateRadius();
            meta.count = me.countVisibleElements();
            for (i = 0, ilen = dataset.data.length; i < ilen; i++) {
                starts[i] = start;
                angle = me._computeAngle(i);
                angles[i] = angle;
                start += angle
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arcs[i]._options = me._resolveElementOptions(arcs[i], i);
                me.updateElement(arcs[i], i, reset)
            }
        },
        _updateRadius: function() {
            var me = this,
                chart = me.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            chart.outerRadius = Math.max(minSize / 2, 0);
            chart.innerRadius = Math.max(opts.cutoutPercentage ? (chart.outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
            me.outerRadius = chart.outerRadius - (chart.radiusLength * me.index);
            me.innerRadius = me.outerRadius - chart.radiusLength
        },
        updateElement: function(arc, index, reset) {
            var me = this,
                chart = me.chart,
                dataset = me.getDataset(),
                opts = chart.options,
                animationOpts = opts.animation,
                scale = chart.scale,
                labels = chart.data.labels,
                centerX = scale.xCenter,
                centerY = scale.yCenter,
                datasetStartAngle = opts.startAngle,
                distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]),
                startAngle = me._starts[index],
                endAngle = startAngle + (arc.hidden ? 0 : me._angles[index]),
                resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]),
                options = arc._options || {};
            helpers$1.extend(arc, { _datasetIndex: me.index, _index: index, _scale: scale, _model: { backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderWidth: options.borderWidth, borderAlign: options.borderAlign, x: centerX, y: centerY, innerRadius: 0, outerRadius: reset ? resetRadius : distance, startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle, endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle, label: helpers$1.valueAtIndexOrDefault(labels, index, labels[index]) } });
            arc.pivot()
        },
        countVisibleElements: function() {
            var dataset = this.getDataset(),
                meta = this.getMeta(),
                count = 0;
            helpers$1.each(meta.data, function(element, index) { if (!isNaN(dataset.data[index]) && !element.hidden) { count++ } });
            return count
        },
        setHoverStyle: function(arc) {
            var model = arc._model,
                options = arc._options,
                getHoverColor = helpers$1.getHoverColor,
                valueOrDefault = helpers$1.valueOrDefault;
            arc.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth, };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth)
        },
        _resolveElementOptions: function(arc, index) {
            var me = this,
                chart = me.chart,
                dataset = me.getDataset(),
                custom = arc.custom || {},
                options = chart.options.elements.arc,
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var keys = ['backgroundColor', 'borderColor', 'borderWidth', 'borderAlign', 'hoverBackgroundColor', 'hoverBorderColor', 'hoverBorderWidth', ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$5([custom[key], dataset[key], options[key]], context, index)
            }
            return values
        },
        _computeAngle: function(index) {
            var me = this,
                count = this.getMeta().count,
                dataset = me.getDataset(),
                meta = me.getMeta();
            if (isNaN(dataset.data[index]) || meta.data[index].hidden) { return 0 }
            var context = { chart: me.chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            return resolve$5([me.chart.options.elements.arc.angle, (2 * Math.PI) / count], context, index)
        }
    });
    core_defaults._set('pie', helpers$1.clone(core_defaults.doughnut));
    core_defaults._set('pie', { cutoutPercentage: 0 });
    var controller_pie = controller_doughnut,
        valueOrDefault$6 = helpers$1.valueOrDefault,
        resolve$6 = helpers$1.options.resolve;
    core_defaults._set('radar', { scale: { type: 'radialLinear' }, elements: { line: { tension: 0 } } });
    var controller_radar = core_datasetController.extend({
        datasetElementType: elements.Line,
        dataElementType: elements.Point,
        linkScales: helpers$1.noop,
        update: function(reset) {
            var me = this,
                meta = me.getMeta(),
                line = meta.dataset,
                points = meta.data || [],
                scale = me.chart.scale,
                dataset = me.getDataset(),
                i, ilen;
            if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) { dataset.lineTension = dataset.tension }
            line._scale = scale;
            line._datasetIndex = me.index;
            line._children = points;
            line._loop = true;
            line._model = me._resolveLineOptions(line);
            line.pivot();
            for (i = 0, ilen = points.length; i < ilen; ++i) { me.updateElement(points[i], i, reset) }
            me.updateBezierControlPoints();
            for (i = 0, ilen = points.length; i < ilen; ++i) { points[i].pivot() }
        },
        updateElement: function(point, index, reset) {
            var me = this,
                custom = point.custom || {},
                dataset = me.getDataset(),
                scale = me.chart.scale,
                pointPosition = scale.getPointPositionForValue(index, dataset.data[index]),
                options = me._resolvePointOptions(point, index),
                lineModel = me.getMeta().dataset._model,
                x = reset ? scale.xCenter : pointPosition.x,
                y = reset ? scale.yCenter : pointPosition.y;
            point._scale = scale;
            point._options = options;
            point._datasetIndex = me.index;
            point._index = index;
            point._model = { x: x, y: y, skip: custom.skip || isNaN(x) || isNaN(y), radius: options.radius, pointStyle: options.pointStyle, rotation: options.rotation, backgroundColor: options.backgroundColor, borderColor: options.borderColor, borderWidth: options.borderWidth, tension: valueOrDefault$6(custom.tension, lineModel ? lineModel.tension : 0), hitRadius: options.hitRadius }
        },
        _resolvePointOptions: function(element, index) {
            var me = this,
                chart = me.chart,
                dataset = chart.data.datasets[me.index],
                custom = element.custom || {},
                options = chart.options.elements.point,
                values = {},
                i, ilen, key, context = { chart: chart, dataIndex: index, dataset: dataset, datasetIndex: me.index };
            var ELEMENT_OPTIONS = { backgroundColor: 'pointBackgroundColor', borderColor: 'pointBorderColor', borderWidth: 'pointBorderWidth', hitRadius: 'pointHitRadius', hoverBackgroundColor: 'pointHoverBackgroundColor', hoverBorderColor: 'pointHoverBorderColor', hoverBorderWidth: 'pointHoverBorderWidth', hoverRadius: 'pointHoverRadius', pointStyle: 'pointStyle', radius: 'pointRadius', rotation: 'pointRotation' };
            var keys = Object.keys(ELEMENT_OPTIONS);
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$6([custom[key], dataset[ELEMENT_OPTIONS[key]], dataset[key], options[key]], context, index)
            }
            return values
        },
        _resolveLineOptions: function(element) {
            var me = this,
                chart = me.chart,
                dataset = chart.data.datasets[me.index],
                custom = element.custom || {},
                options = chart.options.elements.line,
                values = {},
                i, ilen, key, keys = ['backgroundColor', 'borderWidth', 'borderColor', 'borderCapStyle', 'borderDash', 'borderDashOffset', 'borderJoinStyle', 'fill'];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve$6([custom[key], dataset[key], options[key]])
            }
            values.tension = valueOrDefault$6(dataset.lineTension, options.tension);
            return values
        },
        updateBezierControlPoints: function() {
            var me = this,
                meta = me.getMeta(),
                area = me.chart.chartArea,
                points = meta.data || [],
                i, ilen, model, controlPoints;

            function capControlPoint(pt, min, max) { return Math.max(Math.min(pt, max), min) }
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                model = points[i]._model;
                controlPoints = helpers$1.splineCurve(helpers$1.previousItem(points, i, true)._model, model, helpers$1.nextItem(points, i, true)._model, model.tension);
                model.controlPointPreviousX = capControlPoint(controlPoints.previous.x, area.left, area.right);
                model.controlPointPreviousY = capControlPoint(controlPoints.previous.y, area.top, area.bottom);
                model.controlPointNextX = capControlPoint(controlPoints.next.x, area.left, area.right);
                model.controlPointNextY = capControlPoint(controlPoints.next.y, area.top, area.bottom)
            }
        },
        setHoverStyle: function(point) {
            var model = point._model,
                options = point._options,
                getHoverColor = helpers$1.getHoverColor;
            point.$previousStyle = { backgroundColor: model.backgroundColor, borderColor: model.borderColor, borderWidth: model.borderWidth, radius: model.radius };
            model.backgroundColor = valueOrDefault$6(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault$6(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault$6(options.hoverBorderWidth, options.borderWidth);
            model.radius = valueOrDefault$6(options.hoverRadius, options.radius)
        }
    });
    core_defaults._set('scatter', { hover: { mode: 'single' }, scales: { xAxes: [{ id: 'x-axis-1', type: 'linear', position: 'bottom' }], yAxes: [{ id: 'y-axis-1', type: 'linear', position: 'left' }] }, showLines: false, tooltips: { callbacks: { title: function() { return '' }, label: function(item) { return '(' + item.xLabel + ', ' + item.yLabel + ')' } } } });
    var controller_scatter = controller_line,
        controllers = { bar: controller_bar, bubble: controller_bubble, doughnut: controller_doughnut, horizontalBar: controller_horizontalBar, line: controller_line, polarArea: controller_polarArea, pie: controller_pie, radar: controller_radar, scatter: controller_scatter };

    function getRelativePosition(e, chart) { if (e.native) { return { x: e.x, y: e.y } } return helpers$1.getRelativePosition(e, chart) }

    function parseVisibleItems(chart, handler) {
        var datasets = chart.data.datasets,
            meta, i, j, ilen, jlen;
        for (i = 0, ilen = datasets.length; i < ilen; ++i) {
            if (!chart.isDatasetVisible(i)) { continue }
            meta = chart.getDatasetMeta(i);
            for (j = 0, jlen = meta.data.length; j < jlen; ++j) { var element = meta.data[j]; if (!element._view.skip) { handler(element) } }
        }
    }

    function getIntersectItems(chart, position) {
        var elements = [];
        parseVisibleItems(chart, function(element) { if (element.inRange(position.x, position.y)) { elements.push(element) } });
        return elements
    }

    function getNearestItems(chart, position, intersect, distanceMetric) {
        var minDistance = Number.POSITIVE_INFINITY,
            nearestItems = [];
        parseVisibleItems(chart, function(element) {
            if (intersect && !element.inRange(position.x, position.y)) { return }
            var center = element.getCenterPoint(),
                distance = distanceMetric(position, center);
            if (distance < minDistance) {
                nearestItems = [element];
                minDistance = distance
            } else if (distance === minDistance) { nearestItems.push(element) }
        });
        return nearestItems
    }

    function getDistanceMetricForAxis(axis) {
        var useX = axis.indexOf('x') !== -1,
            useY = axis.indexOf('y') !== -1;
        return function(pt1, pt2) {
            var deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0,
                deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
        }
    }

    function indexMode(chart, e, options) {
        var position = getRelativePosition(e, chart);
        options.axis = options.axis || 'x';
        var distanceMetric = getDistanceMetricForAxis(options.axis),
            items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric),
            elements = [];
        if (!items.length) { return [] }
        chart.data.datasets.forEach(function(dataset, datasetIndex) {
            if (chart.isDatasetVisible(datasetIndex)) {
                var meta = chart.getDatasetMeta(datasetIndex),
                    element = meta.data[items[0]._index];
                if (element && !element._view.skip) { elements.push(element) }
            }
        });
        return elements
    }
    var core_interaction = {
        modes: {
            single: function(chart, e) {
                var position = getRelativePosition(e, chart),
                    elements = [];
                parseVisibleItems(chart, function(element) { if (element.inRange(position.x, position.y)) { elements.push(element); return elements } });
                return elements.slice(0, 1)
            },
            label: indexMode,
            index: indexMode,
            dataset: function(chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis),
                    items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
                if (items.length > 0) { items = chart.getDatasetMeta(items[0]._datasetIndex).data }
                return items
            },
            'x-axis': function(chart, e) { return indexMode(chart, e, { intersect: false }) },
            point: function(chart, e) { var position = getRelativePosition(e, chart); return getIntersectItems(chart, position) },
            nearest: function(chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis);
                return getNearestItems(chart, position, options.intersect, distanceMetric)
            },
            x: function(chart, e, options) {
                var position = getRelativePosition(e, chart),
                    items = [],
                    intersectsItem = false;
                parseVisibleItems(chart, function(element) { if (element.inXRange(position.x)) { items.push(element) } if (element.inRange(position.x, position.y)) { intersectsItem = true } });
                if (options.intersect && !intersectsItem) { items = [] }
                return items
            },
            y: function(chart, e, options) {
                var position = getRelativePosition(e, chart),
                    items = [],
                    intersectsItem = false;
                parseVisibleItems(chart, function(element) { if (element.inYRange(position.y)) { items.push(element) } if (element.inRange(position.x, position.y)) { intersectsItem = true } });
                if (options.intersect && !intersectsItem) { items = [] }
                return items
            }
        }
    };

    function filterByPosition(array, position) { return helpers$1.where(array, function(v) { return v.position === position }) }

    function sortByWeight(array, reverse) {
        array.forEach(function(v, i) { v._tmpIndex_ = i; return v });
        array.sort(function(a, b) {
            var v0 = reverse ? b : a,
                v1 = reverse ? a : b;
            return v0.weight === v1.weight ? v0._tmpIndex_ - v1._tmpIndex_ : v0.weight - v1.weight
        });
        array.forEach(function(v) { delete v._tmpIndex_ })
    }

    function findMaxPadding(boxes) {
        var top = 0,
            left = 0,
            bottom = 0,
            right = 0;
        helpers$1.each(boxes, function(box) {
            if (box.getPadding) {
                var boxPadding = box.getPadding();
                top = Math.max(top, boxPadding.top);
                left = Math.max(left, boxPadding.left);
                bottom = Math.max(bottom, boxPadding.bottom);
                right = Math.max(right, boxPadding.right)
            }
        });
        return { top: top, left: left, bottom: bottom, right: right }
    }

    function addSizeByPosition(boxes, size) { helpers$1.each(boxes, function(box) { size[box.position] += box.isHorizontal() ? box.height : box.width }) }
    core_defaults._set('global', { layout: { padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
    var core_layouts = {
        defaults: {},
        addBox: function(chart, item) {
            if (!chart.boxes) { chart.boxes = [] }
            item.fullWidth = item.fullWidth || false;
            item.position = item.position || 'top';
            item.weight = item.weight || 0;
            chart.boxes.push(item)
        },
        removeBox: function(chart, layoutItem) { var index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1; if (index !== -1) { chart.boxes.splice(index, 1) } },
        configure: function(chart, item, options) {
            var props = ['fullWidth', 'position', 'weight'],
                ilen = props.length,
                i = 0,
                prop;
            for (; i < ilen; ++i) { prop = props[i]; if (options.hasOwnProperty(prop)) { item[prop] = options[prop] } }
        },
        update: function(chart, width, height) {
            if (!chart) { return }
            var layoutOptions = chart.options.layout || {},
                padding = helpers$1.options.toPadding(layoutOptions.padding),
                leftPadding = padding.left,
                rightPadding = padding.right,
                topPadding = padding.top,
                bottomPadding = padding.bottom,
                leftBoxes = filterByPosition(chart.boxes, 'left'),
                rightBoxes = filterByPosition(chart.boxes, 'right'),
                topBoxes = filterByPosition(chart.boxes, 'top'),
                bottomBoxes = filterByPosition(chart.boxes, 'bottom'),
                chartAreaBoxes = filterByPosition(chart.boxes, 'chartArea');
            sortByWeight(leftBoxes, true);
            sortByWeight(rightBoxes, false);
            sortByWeight(topBoxes, true);
            sortByWeight(bottomBoxes, false);
            var verticalBoxes = leftBoxes.concat(rightBoxes),
                horizontalBoxes = topBoxes.concat(bottomBoxes),
                outerBoxes = verticalBoxes.concat(horizontalBoxes),
                chartWidth = width - leftPadding - rightPadding,
                chartHeight = height - topPadding - bottomPadding,
                chartAreaWidth = chartWidth / 2,
                verticalBoxWidth = (width - chartAreaWidth) / verticalBoxes.length,
                maxChartAreaWidth = chartWidth,
                maxChartAreaHeight = chartHeight,
                outerBoxSizes = { top: topPadding, left: leftPadding, bottom: bottomPadding, right: rightPadding };
            var minBoxSizes = [],
                maxPadding;

            function getMinimumBoxSize(box) {
                var minSize, isHorizontal = box.isHorizontal();
                if (isHorizontal) {
                    minSize = box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2);
                    maxChartAreaHeight -= minSize.height
                } else {
                    minSize = box.update(verticalBoxWidth, maxChartAreaHeight);
                    maxChartAreaWidth -= minSize.width
                }
                minBoxSizes.push({ horizontal: isHorizontal, width: minSize.width, box: box, })
            }
            helpers$1.each(outerBoxes, getMinimumBoxSize);
            maxPadding = findMaxPadding(outerBoxes);

            function fitBox(box) {
                var minBoxSize = helpers$1.findNextWhere(minBoxSizes, function(minBox) { return minBox.box === box });
                if (minBoxSize) {
                    if (minBoxSize.horizontal) {
                        var scaleMargin = { left: Math.max(outerBoxSizes.left, maxPadding.left), right: Math.max(outerBoxSizes.right, maxPadding.right), top: 0, bottom: 0 };
                        box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin)
                    } else { box.update(minBoxSize.width, maxChartAreaHeight) }
                }
            }
            helpers$1.each(verticalBoxes, fitBox);
            addSizeByPosition(verticalBoxes, outerBoxSizes);
            helpers$1.each(horizontalBoxes, fitBox);
            addSizeByPosition(horizontalBoxes, outerBoxSizes);

            function finalFitVerticalBox(box) { var minBoxSize = helpers$1.findNextWhere(minBoxSizes, function(minSize) { return minSize.box === box }); var scaleMargin = { left: 0, right: 0, top: outerBoxSizes.top, bottom: outerBoxSizes.bottom }; if (minBoxSize) { box.update(minBoxSize.width, maxChartAreaHeight, scaleMargin) } }
            helpers$1.each(verticalBoxes, finalFitVerticalBox);
            outerBoxSizes = { top: topPadding, left: leftPadding, bottom: bottomPadding, right: rightPadding };
            addSizeByPosition(outerBoxes, outerBoxSizes);
            var leftPaddingAddition = Math.max(maxPadding.left - outerBoxSizes.left, 0);
            outerBoxSizes.left += leftPaddingAddition;
            outerBoxSizes.right += Math.max(maxPadding.right - outerBoxSizes.right, 0);
            var topPaddingAddition = Math.max(maxPadding.top - outerBoxSizes.top, 0);
            outerBoxSizes.top += topPaddingAddition;
            outerBoxSizes.bottom += Math.max(maxPadding.bottom - outerBoxSizes.bottom, 0);
            var newMaxChartAreaHeight = height - outerBoxSizes.top - outerBoxSizes.bottom,
                newMaxChartAreaWidth = width - outerBoxSizes.left - outerBoxSizes.right;
            if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
                helpers$1.each(verticalBoxes, function(box) { box.height = newMaxChartAreaHeight });
                helpers$1.each(horizontalBoxes, function(box) { if (!box.fullWidth) { box.width = newMaxChartAreaWidth } });
                maxChartAreaHeight = newMaxChartAreaHeight;
                maxChartAreaWidth = newMaxChartAreaWidth
            }
            var left = leftPadding + leftPaddingAddition,
                top = topPadding + topPaddingAddition;

            function placeBox(box) {
                if (box.isHorizontal()) {
                    box.left = box.fullWidth ? leftPadding : outerBoxSizes.left;
                    box.right = box.fullWidth ? width - rightPadding : outerBoxSizes.left + maxChartAreaWidth;
                    box.top = top;
                    box.bottom = top + box.height;
                    top = box.bottom
                } else {
                    box.left = left;
                    box.right = left + box.width;
                    box.top = outerBoxSizes.top;
                    box.bottom = outerBoxSizes.top + maxChartAreaHeight;
                    left = box.right
                }
            }
            helpers$1.each(leftBoxes.concat(topBoxes), placeBox);
            left += maxChartAreaWidth;
            top += maxChartAreaHeight;
            helpers$1.each(rightBoxes, placeBox);
            helpers$1.each(bottomBoxes, placeBox);
            chart.chartArea = { left: outerBoxSizes.left, top: outerBoxSizes.top, right: outerBoxSizes.left + maxChartAreaWidth, bottom: outerBoxSizes.top + maxChartAreaHeight };
            helpers$1.each(chartAreaBoxes, function(box) {
                box.left = chart.chartArea.left;
                box.top = chart.chartArea.top;
                box.right = chart.chartArea.right;
                box.bottom = chart.chartArea.bottom;
                box.update(maxChartAreaWidth, maxChartAreaHeight)
            })
        }
    };
    var platform_basic = { acquireContext: function(item) { if (item && item.canvas) { item = item.canvas } return item && item.getContext('2d') || null } };
    var platform_dom = "/*\n * DOM element rendering detection\n * https://davidwalsh.name/detect-node-insertion\n */\n@keyframes chartjs-render-animation {\n\tfrom { opacity: 0.99; }\n\tto { opacity: 1; }\n}\n\n.chartjs-render-monitor {\n\tanimation: chartjs-render-animation 0.001s;\n}\n\n/*\n * DOM element resizing detection\n * https://github.com/marcj/css-element-queries\n */\n.chartjs-size-monitor,\n.chartjs-size-monitor-expand,\n.chartjs-size-monitor-shrink {\n\tposition: absolute;\n\tdirection: ltr;\n\tleft: 0;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\toverflow: hidden;\n\tpointer-events: none;\n\tvisibility: hidden;\n\tz-index: -1;\n}\n\n.chartjs-size-monitor-expand > div {\n\tposition: absolute;\n\twidth: 1000000px;\n\theight: 1000000px;\n\tleft: 0;\n\ttop: 0;\n}\n\n.chartjs-size-monitor-shrink > div {\n\tposition: absolute;\n\twidth: 200%;\n\theight: 200%;\n\tleft: 0;\n\ttop: 0;\n}\n",
        platform_dom$1 = Object.freeze({ default: platform_dom });

    function getCjsExportFromNamespace(n) { return n && n.default || n }
    var stylesheet = getCjsExportFromNamespace(platform_dom$1),
        EXPANDO_KEY = '$chartjs',
        CSS_PREFIX = 'chartjs-',
        CSS_SIZE_MONITOR = CSS_PREFIX + 'size-monitor',
        CSS_RENDER_MONITOR = CSS_PREFIX + 'render-monitor',
        CSS_RENDER_ANIMATION = CSS_PREFIX + 'render-animation',
        ANIMATION_START_EVENTS = ['animationstart', 'webkitAnimationStart'],
        EVENT_TYPES = { touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup', pointerenter: 'mouseenter', pointerdown: 'mousedown', pointermove: 'mousemove', pointerup: 'mouseup', pointerleave: 'mouseout', pointerout: 'mouseout' };

    function readUsedSize(element, property) {
        var value = helpers$1.getStyle(element, property),
            matches = value && value.match(/^(\d+)(\.\d+)?px$/);
        return matches ? Number(matches[1]) : undefined
    }

    function initCanvas(canvas, config) {
        var style = canvas.style,
            renderHeight = canvas.getAttribute('height'),
            renderWidth = canvas.getAttribute('width');
        canvas[EXPANDO_KEY] = { initial: { height: renderHeight, width: renderWidth, style: { display: style.display, height: style.height, width: style.width } } };
        style.display = style.display || 'block';
        if (renderWidth === null || renderWidth === '') { var displayWidth = readUsedSize(canvas, 'width'); if (displayWidth !== undefined) { canvas.width = displayWidth } }
        if (renderHeight === null || renderHeight === '') { if (canvas.style.height === '') { canvas.height = canvas.width / (config.options.aspectRatio || 2) } else { var displayHeight = readUsedSize(canvas, 'height'); if (displayWidth !== undefined) { canvas.height = displayHeight } } }
        return canvas
    }
    var supportsEventListenerOptions = (function() {
        var supports = false;
        try {
            var options = Object.defineProperty({}, 'passive', { get: function() { supports = true } });
            window.addEventListener('e', null, options)
        } catch (e) {}
        return supports
    }());
    var eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;

    function addListener(node, type, listener) { node.addEventListener(type, listener, eventListenerOptions) }

    function removeListener(node, type, listener) { node.removeEventListener(type, listener, eventListenerOptions) }

    function createEvent(type, chart, x, y, nativeEvent) { return { type: type, chart: chart, native: nativeEvent || null, x: x !== undefined ? x : null, y: y !== undefined ? y : null, } }

    function fromNativeEvent(event, chart) {
        var type = EVENT_TYPES[event.type] || event.type,
            pos = helpers$1.getRelativePosition(event, chart);
        return createEvent(type, chart, pos.x, pos.y, event)
    }

    function throttled(fn, thisArg) {
        var ticking = false,
            args = [];
        return function() {
            args = Array.prototype.slice.call(arguments);
            thisArg = thisArg || this;
            if (!ticking) {
                ticking = true;
                helpers$1.requestAnimFrame.call(window, function() {
                    ticking = false;
                    fn.apply(thisArg, args)
                })
            }
        }
    }

    function createDiv(cls) {
        var el = document.createElement('div');
        el.className = cls || '';
        return el
    }

    function createResizer(handler) {
        var maxSize = 1000000,
            resizer = createDiv(CSS_SIZE_MONITOR),
            expand = createDiv(CSS_SIZE_MONITOR + '-expand'),
            shrink = createDiv(CSS_SIZE_MONITOR + '-shrink');
        expand.appendChild(createDiv());
        shrink.appendChild(createDiv());
        resizer.appendChild(expand);
        resizer.appendChild(shrink);
        resizer._reset = function() {
            expand.scrollLeft = maxSize;
            expand.scrollTop = maxSize;
            shrink.scrollLeft = maxSize;
            shrink.scrollTop = maxSize
        };
        var onScroll = function() {
            resizer._reset();
            handler()
        };
        addListener(expand, 'scroll', onScroll.bind(expand, 'expand'));
        addListener(shrink, 'scroll', onScroll.bind(shrink, 'shrink'));
        return resizer
    }

    function watchForRender(node, handler) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {}),
            proxy = expando.renderProxy = function(e) { if (e.animationName === CSS_RENDER_ANIMATION) { handler() } };
        helpers$1.each(ANIMATION_START_EVENTS, function(type) { addListener(node, type, proxy) });
        expando.reflow = !!node.offsetParent;
        node.classList.add(CSS_RENDER_MONITOR)
    }

    function unwatchForRender(node) {
        var expando = node[EXPANDO_KEY] || {},
            proxy = expando.renderProxy;
        if (proxy) {
            helpers$1.each(ANIMATION_START_EVENTS, function(type) { removeListener(node, type, proxy) });
            delete expando.renderProxy
        }
        node.classList.remove(CSS_RENDER_MONITOR)
    }

    function addResizeListener(node, listener, chart) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {}),
            resizer = expando.resizer = createResizer(throttled(function() {
                if (expando.resizer) {
                    var container = chart.options.maintainAspectRatio && node.parentNode,
                        w = container ? container.clientWidth : 0;
                    listener(createEvent('resize', chart));
                    if (container && container.clientWidth < w && chart.canvas) { listener(createEvent('resize', chart)) }
                }
            }));
        watchForRender(node, function() {
            if (expando.resizer) {
                var container = node.parentNode;
                if (container && container !== resizer.parentNode) { container.insertBefore(resizer, container.firstChild) }
                resizer._reset()
            }
        })
    }

    function removeResizeListener(node) {
        var expando = node[EXPANDO_KEY] || {},
            resizer = expando.resizer;
        delete expando.resizer;
        unwatchForRender(node);
        if (resizer && resizer.parentNode) { resizer.parentNode.removeChild(resizer) }
    }

    function injectCSS(platform, css) {
        var style = platform._style || document.createElement('style');
        if (!platform._style) {
            platform._style = style;
            css = '/* Chart.js */\n' + css;
            style.setAttribute('type', 'text/css');
            document.getElementsByTagName('head')[0].appendChild(style)
        }
        style.appendChild(document.createTextNode(css))
    }
    var platform_dom$2 = {
        disableCSSInjection: false,
        _enabled: typeof window !== 'undefined' && typeof document !== 'undefined',
        _ensureLoaded: function() {
            if (this._loaded) { return }
            this._loaded = true;
            if (!this.disableCSSInjection) { injectCSS(this, stylesheet) }
        },
        acquireContext: function(item, config) {
            if (typeof item === 'string') { item = document.getElementById(item) } else if (item.length) { item = item[0] }
            if (item && item.canvas) { item = item.canvas }
            var context = item && item.getContext && item.getContext('2d');
            this._ensureLoaded();
            if (context && context.canvas === item) { initCanvas(item, config); return context }
            return null
        },
        releaseContext: function(context) {
            var canvas = context.canvas;
            if (!canvas[EXPANDO_KEY]) { return }
            var initial = canvas[EXPANDO_KEY].initial;
            ['height', 'width'].forEach(function(prop) { var value = initial[prop]; if (helpers$1.isNullOrUndef(value)) { canvas.removeAttribute(prop) } else { canvas.setAttribute(prop, value) } });
            helpers$1.each(initial.style || {}, function(value, key) { canvas.style[key] = value });
            canvas.width = canvas.width;
            delete canvas[EXPANDO_KEY]
        },
        addEventListener: function(chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') { addResizeListener(canvas, listener, chart); return }
            var expando = listener[EXPANDO_KEY] || (listener[EXPANDO_KEY] = {}),
                proxies = expando.proxies || (expando.proxies = {}),
                proxy = proxies[chart.id + '_' + type] = function(event) { listener(fromNativeEvent(event, chart)) };
            addListener(canvas, type, proxy)
        },
        removeEventListener: function(chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') { removeResizeListener(canvas); return }
            var expando = listener[EXPANDO_KEY] || {},
                proxies = expando.proxies || {},
                proxy = proxies[chart.id + '_' + type];
            if (!proxy) { return }
            removeListener(canvas, type, proxy)
        }
    };
    helpers$1.addEvent = addListener;
    helpers$1.removeEvent = removeListener;
    var implementation = platform_dom$2._enabled ? platform_dom$2 : platform_basic,
        platform = helpers$1.extend({ initialize: function() {}, acquireContext: function() {}, releaseContext: function() {}, addEventListener: function() {}, removeEventListener: function() {} }, implementation);
    core_defaults._set('global', { plugins: {} });
    var core_plugins = {
        _plugins: [],
        _cacheId: 0,
        register: function(plugins) {
            var p = this._plugins;
            ([]).concat(plugins).forEach(function(plugin) { if (p.indexOf(plugin) === -1) { p.push(plugin) } });
            this._cacheId++
        },
        unregister: function(plugins) {
            var p = this._plugins;
            ([]).concat(plugins).forEach(function(plugin) { var idx = p.indexOf(plugin); if (idx !== -1) { p.splice(idx, 1) } });
            this._cacheId++
        },
        clear: function() {
            this._plugins = [];
            this._cacheId++
        },
        count: function() { return this._plugins.length },
        getAll: function() { return this._plugins },
        notify: function(chart, hook, args) {
            var descriptors = this.descriptors(chart),
                ilen = descriptors.length,
                i, descriptor, plugin, params, method;
            for (i = 0; i < ilen; ++i) {
                descriptor = descriptors[i];
                plugin = descriptor.plugin;
                method = plugin[hook];
                if (typeof method === 'function') {
                    params = [chart].concat(args || []);
                    params.push(descriptor.options);
                    if (method.apply(plugin, params) === false) { return false }
                }
            }
            return true
        },
        descriptors: function(chart) {
            var cache = chart.$plugins || (chart.$plugins = {});
            if (cache.id === this._cacheId) { return cache.descriptors }
            var plugins = [],
                descriptors = [],
                config = (chart && chart.config) || {},
                options = (config.options && config.options.plugins) || {};
            this._plugins.concat(config.plugins || []).forEach(function(plugin) {
                var idx = plugins.indexOf(plugin);
                if (idx !== -1) { return }
                var id = plugin.id,
                    opts = options[id];
                if (opts === false) { return }
                if (opts === true) { opts = helpers$1.clone(core_defaults.global.plugins[id]) }
                plugins.push(plugin);
                descriptors.push({ plugin: plugin, options: opts || {} })
            });
            cache.descriptors = descriptors;
            cache.id = this._cacheId;
            return descriptors
        },
        _invalidate: function(chart) { delete chart.$plugins }
    };
    var core_scaleService = {
        constructors: {},
        defaults: {},
        registerScaleType: function(type, scaleConstructor, scaleDefaults) {
            this.constructors[type] = scaleConstructor;
            this.defaults[type] = helpers$1.clone(scaleDefaults)
        },
        getScaleConstructor: function(type) { return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined },
        getScaleDefaults: function(type) { return this.defaults.hasOwnProperty(type) ? helpers$1.merge({}, [core_defaults.scale, this.defaults[type]]) : {} },
        updateScaleDefaults: function(type, additions) { var me = this; if (me.defaults.hasOwnProperty(type)) { me.defaults[type] = helpers$1.extend(me.defaults[type], additions) } },
        addScalesToLayout: function(chart) {
            helpers$1.each(chart.scales, function(scale) {
                scale.fullWidth = scale.options.fullWidth;
                scale.position = scale.options.position;
                scale.weight = scale.options.weight;
                core_layouts.addBox(chart, scale)
            })
        }
    };
    var valueOrDefault$7 = helpers$1.valueOrDefault;
    core_defaults._set('global', {
        tooltips: {
            enabled: true,
            custom: null,
            mode: 'nearest',
            position: 'average',
            intersect: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFontStyle: 'bold',
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleFontColor: '#fff',
            titleAlign: 'left',
            bodySpacing: 2,
            bodyFontColor: '#fff',
            bodyAlign: 'left',
            footerFontStyle: 'bold',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFontColor: '#fff',
            footerAlign: 'left',
            yPadding: 6,
            xPadding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            multiKeyBackground: '#fff',
            displayColors: true,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            callbacks: {
                beforeTitle: helpers$1.noop,
                title: function(tooltipItems, data) {
                    var title = '',
                        labels = data.labels,
                        labelCount = labels ? labels.length : 0;
                    if (tooltipItems.length > 0) { var item = tooltipItems[0]; if (item.label) { title = item.label } else if (item.xLabel) { title = item.xLabel } else if (labelCount > 0 && item.index < labelCount) { title = labels[item.index] } }
                    return title
                },
                afterTitle: helpers$1.noop,
                beforeBody: helpers$1.noop,
                beforeLabel: helpers$1.noop,
                label: function(tooltipItem, data) { var label = data.datasets[tooltipItem.datasetIndex].label || ''; if (label) { label += ': ' } if (!helpers$1.isNullOrUndef(tooltipItem.value)) { label += tooltipItem.value } else { label += tooltipItem.yLabel } return label },
                labelColor: function(tooltipItem, chart) {
                    var meta = chart.getDatasetMeta(tooltipItem.datasetIndex),
                        activeElement = meta.data[tooltipItem.index],
                        view = activeElement._view;
                    return { borderColor: view.borderColor, backgroundColor: view.backgroundColor }
                },
                labelTextColor: function() { return this._options.bodyFontColor },
                afterLabel: helpers$1.noop,
                afterBody: helpers$1.noop,
                beforeFooter: helpers$1.noop,
                footer: helpers$1.noop,
                afterFooter: helpers$1.noop
            }
        }
    });
    var positioners = {
        average: function(elements) {
            if (!elements.length) { return false }
            var i, len, x = 0,
                y = 0,
                count = 0;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var pos = el.tooltipPosition();
                    x += pos.x;
                    y += pos.y;
                    ++count
                }
            }
            return { x: x / count, y: y / count }
        },
        nearest: function(elements, eventPosition) {
            var x = eventPosition.x,
                y = eventPosition.y,
                minDistance = Number.POSITIVE_INFINITY,
                i, len, nearestElement;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var center = el.getCenterPoint(),
                        d = helpers$1.distanceBetweenPoints(eventPosition, center);
                    if (d < minDistance) {
                        minDistance = d;
                        nearestElement = el
                    }
                }
            }
            if (nearestElement) {
                var tp = nearestElement.tooltipPosition();
                x = tp.x;
                y = tp.y
            }
            return { x: x, y: y }
        }
    };

    function pushOrConcat(base, toPush) { if (toPush) { if (helpers$1.isArray(toPush)) { Array.prototype.push.apply(base, toPush) } else { base.push(toPush) } } return base }

    function splitNewlines(str) { if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) { return str.split('\n') } return str }

    function createTooltipItem(element) {
        var xScale = element._xScale,
            yScale = element._yScale || element._scale,
            index = element._index,
            datasetIndex = element._datasetIndex,
            controller = element._chart.getDatasetMeta(datasetIndex).controller,
            indexScale = controller._getIndexScale(),
            valueScale = controller._getValueScale();
        return { xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '', yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '', label: indexScale ? '' + indexScale.getLabelForIndex(index, datasetIndex) : '', value: valueScale ? '' + valueScale.getLabelForIndex(index, datasetIndex) : '', index: index, datasetIndex: datasetIndex, x: element._model.x, y: element._model.y }
    }

    function getBaseModel(tooltipOpts) { var globalDefaults = core_defaults.global; return { xPadding: tooltipOpts.xPadding, yPadding: tooltipOpts.yPadding, xAlign: tooltipOpts.xAlign, yAlign: tooltipOpts.yAlign, bodyFontColor: tooltipOpts.bodyFontColor, _bodyFontFamily: valueOrDefault$7(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily), _bodyFontStyle: valueOrDefault$7(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle), _bodyAlign: tooltipOpts.bodyAlign, bodyFontSize: valueOrDefault$7(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize), bodySpacing: tooltipOpts.bodySpacing, titleFontColor: tooltipOpts.titleFontColor, _titleFontFamily: valueOrDefault$7(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily), _titleFontStyle: valueOrDefault$7(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle), titleFontSize: valueOrDefault$7(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize), _titleAlign: tooltipOpts.titleAlign, titleSpacing: tooltipOpts.titleSpacing, titleMarginBottom: tooltipOpts.titleMarginBottom, footerFontColor: tooltipOpts.footerFontColor, _footerFontFamily: valueOrDefault$7(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily), _footerFontStyle: valueOrDefault$7(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle), footerFontSize: valueOrDefault$7(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize), _footerAlign: tooltipOpts.footerAlign, footerSpacing: tooltipOpts.footerSpacing, footerMarginTop: tooltipOpts.footerMarginTop, caretSize: tooltipOpts.caretSize, cornerRadius: tooltipOpts.cornerRadius, backgroundColor: tooltipOpts.backgroundColor, opacity: 0, legendColorBackground: tooltipOpts.multiKeyBackground, displayColors: tooltipOpts.displayColors, borderColor: tooltipOpts.borderColor, borderWidth: tooltipOpts.borderWidth } }

    function getTooltipSize(tooltip, model) {
        var ctx = tooltip._chart.ctx,
            height = model.yPadding * 2,
            width = 0,
            body = model.body,
            combinedBodyLength = body.reduce(function(count, bodyItem) { return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length }, 0);
        combinedBodyLength += model.beforeBody.length + model.afterBody.length;
        var titleLineCount = model.title.length,
            footerLineCount = model.footer.length,
            titleFontSize = model.titleFontSize,
            bodyFontSize = model.bodyFontSize,
            footerFontSize = model.footerFontSize;
        height += titleLineCount * titleFontSize;
        height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0;
        height += titleLineCount ? model.titleMarginBottom : 0;
        height += combinedBodyLength * bodyFontSize;
        height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0;
        height += footerLineCount ? model.footerMarginTop : 0;
        height += footerLineCount * (footerFontSize);
        height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0;
        var widthPadding = 0,
            maxLineWidth = function(line) { width = Math.max(width, ctx.measureText(line).width + widthPadding) };
        ctx.font = helpers$1.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
        helpers$1.each(model.title, maxLineWidth);
        ctx.font = helpers$1.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
        helpers$1.each(model.beforeBody.concat(model.afterBody), maxLineWidth);
        widthPadding = model.displayColors ? (bodyFontSize + 2) : 0;
        helpers$1.each(body, function(bodyItem) {
            helpers$1.each(bodyItem.before, maxLineWidth);
            helpers$1.each(bodyItem.lines, maxLineWidth);
            helpers$1.each(bodyItem.after, maxLineWidth)
        });
        widthPadding = 0;
        ctx.font = helpers$1.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
        helpers$1.each(model.footer, maxLineWidth);
        width += 2 * model.xPadding;
        return { width: width, height: height }
    }

    function determineAlignment(tooltip, size) {
        var model = tooltip._model,
            chart = tooltip._chart,
            chartArea = tooltip._chart.chartArea,
            xAlign = 'center',
            yAlign = 'center';
        if (model.y < size.height) { yAlign = 'top' } else if (model.y > (chart.height - size.height)) { yAlign = 'bottom' }
        var lf, rf, olf, orf, yf, midX = (chartArea.left + chartArea.right) / 2,
            midY = (chartArea.top + chartArea.bottom) / 2;
        if (yAlign === 'center') {
            lf = function(x) { return x <= midX };
            rf = function(x) { return x > midX }
        } else {
            lf = function(x) { return x <= (size.width / 2) };
            rf = function(x) { return x >= (chart.width - (size.width / 2)) }
        }
        olf = function(x) { return x + size.width + model.caretSize + model.caretPadding > chart.width };
        orf = function(x) { return x - size.width - model.caretSize - model.caretPadding < 0 };
        yf = function(y) { return y <= midY ? 'top' : 'bottom' };
        if (lf(model.x)) {
            xAlign = 'left';
            if (olf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y)
            }
        } else if (rf(model.x)) {
            xAlign = 'right';
            if (orf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y)
            }
        }
        var opts = tooltip._options;
        return { xAlign: opts.xAlign ? opts.xAlign : xAlign, yAlign: opts.yAlign ? opts.yAlign : yAlign }
    }

    function getBackgroundPoint(vm, size, alignment, chart) {
        var x = vm.x,
            y = vm.y,
            caretSize = vm.caretSize,
            caretPadding = vm.caretPadding,
            cornerRadius = vm.cornerRadius,
            xAlign = alignment.xAlign,
            yAlign = alignment.yAlign,
            paddingAndSize = caretSize + caretPadding,
            radiusAndPadding = cornerRadius + caretPadding;
        if (xAlign === 'right') { x -= size.width } else if (xAlign === 'center') { x -= (size.width / 2); if (x + size.width > chart.width) { x = chart.width - size.width } if (x < 0) { x = 0 } }
        if (yAlign === 'top') { y += paddingAndSize } else if (yAlign === 'bottom') { y -= size.height + paddingAndSize } else { y -= (size.height / 2) }
        if (yAlign === 'center') { if (xAlign === 'left') { x += paddingAndSize } else if (xAlign === 'right') { x -= paddingAndSize } } else if (xAlign === 'left') { x -= radiusAndPadding } else if (xAlign === 'right') { x += radiusAndPadding }
        return { x: x, y: y }
    }

    function getAlignedX(vm, align) { return align === 'center' ? vm.x + vm.width / 2 : align === 'right' ? vm.x + vm.width - vm.xPadding : vm.x + vm.xPadding }

    function getBeforeAfterBodyLines(callback) { return pushOrConcat([], splitNewlines(callback)) }
    var exports$3 = core_element.extend({
        initialize: function() {
            this._model = getBaseModel(this._options);
            this._lastActive = []
        },
        getTitle: function() {
            var me = this,
                opts = me._options,
                callbacks = opts.callbacks,
                beforeTitle = callbacks.beforeTitle.apply(me, arguments),
                title = callbacks.title.apply(me, arguments),
                afterTitle = callbacks.afterTitle.apply(me, arguments),
                lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeTitle));
            lines = pushOrConcat(lines, splitNewlines(title));
            lines = pushOrConcat(lines, splitNewlines(afterTitle));
            return lines
        },
        getBeforeBody: function() { return getBeforeAfterBodyLines(this._options.callbacks.beforeBody.apply(this, arguments)) },
        getBody: function(tooltipItems, data) {
            var me = this,
                callbacks = me._options.callbacks,
                bodyItems = [];
            helpers$1.each(tooltipItems, function(tooltipItem) {
                var bodyItem = { before: [], lines: [], after: [] };
                pushOrConcat(bodyItem.before, splitNewlines(callbacks.beforeLabel.call(me, tooltipItem, data)));
                pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
                pushOrConcat(bodyItem.after, splitNewlines(callbacks.afterLabel.call(me, tooltipItem, data)));
                bodyItems.push(bodyItem)
            });
            return bodyItems
        },
        getAfterBody: function() { return getBeforeAfterBodyLines(this._options.callbacks.afterBody.apply(this, arguments)) },
        getFooter: function() {
            var me = this,
                callbacks = me._options.callbacks,
                beforeFooter = callbacks.beforeFooter.apply(me, arguments),
                footer = callbacks.footer.apply(me, arguments),
                afterFooter = callbacks.afterFooter.apply(me, arguments),
                lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeFooter));
            lines = pushOrConcat(lines, splitNewlines(footer));
            lines = pushOrConcat(lines, splitNewlines(afterFooter));
            return lines
        },
        update: function(changed) {
            var me = this,
                opts = me._options,
                existingModel = me._model,
                model = me._model = getBaseModel(opts),
                active = me._active,
                data = me._data,
                alignment = { xAlign: existingModel.xAlign, yAlign: existingModel.yAlign };
            var backgroundPoint = { x: existingModel.x, y: existingModel.y };
            var tooltipSize = { width: existingModel.width, height: existingModel.height };
            var tooltipPosition = { x: existingModel.caretX, y: existingModel.caretY };
            var i, len;
            if (active.length) {
                model.opacity = 1;
                var labelColors = [],
                    labelTextColors = [];
                tooltipPosition = positioners[opts.position].call(me, active, me._eventPosition);
                var tooltipItems = [];
                for (i = 0, len = active.length; i < len; ++i) { tooltipItems.push(createTooltipItem(active[i])) }
                if (opts.filter) { tooltipItems = tooltipItems.filter(function(a) { return opts.filter(a, data) }) }
                if (opts.itemSort) { tooltipItems = tooltipItems.sort(function(a, b) { return opts.itemSort(a, b, data) }) }
                helpers$1.each(tooltipItems, function(tooltipItem) {
                    labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, me._chart));
                    labelTextColors.push(opts.callbacks.labelTextColor.call(me, tooltipItem, me._chart))
                });
                model.title = me.getTitle(tooltipItems, data);
                model.beforeBody = me.getBeforeBody(tooltipItems, data);
                model.body = me.getBody(tooltipItems, data);
                model.afterBody = me.getAfterBody(tooltipItems, data);
                model.footer = me.getFooter(tooltipItems, data);
                model.x = tooltipPosition.x;
                model.y = tooltipPosition.y;
                model.caretPadding = opts.caretPadding;
                model.labelColors = labelColors;
                model.labelTextColors = labelTextColors;
                model.dataPoints = tooltipItems;
                tooltipSize = getTooltipSize(this, model);
                alignment = determineAlignment(this, tooltipSize);
                backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment, me._chart)
            } else { model.opacity = 0 }
            model.xAlign = alignment.xAlign;
            model.yAlign = alignment.yAlign;
            model.x = backgroundPoint.x;
            model.y = backgroundPoint.y;
            model.width = tooltipSize.width;
            model.height = tooltipSize.height;
            model.caretX = tooltipPosition.x;
            model.caretY = tooltipPosition.y;
            me._model = model;
            if (changed && opts.custom) { opts.custom.call(me, model) }
            return me
        },
        drawCaret: function(tooltipPoint, size) {
            var ctx = this._chart.ctx,
                vm = this._view,
                caretPosition = this.getCaretPosition(tooltipPoint, size, vm);
            ctx.lineTo(caretPosition.x1, caretPosition.y1);
            ctx.lineTo(caretPosition.x2, caretPosition.y2);
            ctx.lineTo(caretPosition.x3, caretPosition.y3)
        },
        getCaretPosition: function(tooltipPoint, size, vm) {
            var x1, x2, x3, y1, y2, y3, caretSize = vm.caretSize,
                cornerRadius = vm.cornerRadius,
                xAlign = vm.xAlign,
                yAlign = vm.yAlign,
                ptX = tooltipPoint.x,
                ptY = tooltipPoint.y,
                width = size.width,
                height = size.height;
            if (yAlign === 'center') {
                y2 = ptY + (height / 2);
                if (xAlign === 'left') {
                    x1 = ptX;
                    x2 = x1 - caretSize;
                    x3 = x1;
                    y1 = y2 + caretSize;
                    y3 = y2 - caretSize
                } else {
                    x1 = ptX + width;
                    x2 = x1 + caretSize;
                    x3 = x1;
                    y1 = y2 - caretSize;
                    y3 = y2 + caretSize
                }
            } else {
                if (xAlign === 'left') {
                    x2 = ptX + cornerRadius + (caretSize);
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize
                } else if (xAlign === 'right') {
                    x2 = ptX + width - cornerRadius - caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize
                } else {
                    x2 = vm.caretX;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize
                }
                if (yAlign === 'top') {
                    y1 = ptY;
                    y2 = y1 - caretSize;
                    y3 = y1
                } else {
                    y1 = ptY + height;
                    y2 = y1 + caretSize;
                    y3 = y1;
                    var tmp = x3;
                    x3 = x1;
                    x1 = tmp
                }
            }
            return { x1: x1, x2: x2, x3: x3, y1: y1, y2: y2, y3: y3 }
        },
        drawTitle: function(pt, vm, ctx) {
            var title = vm.title;
            if (title.length) {
                pt.x = getAlignedX(vm, vm._titleAlign);
                ctx.textAlign = vm._titleAlign;
                ctx.textBaseline = 'top';
                var titleFontSize = vm.titleFontSize,
                    titleSpacing = vm.titleSpacing;
                ctx.fillStyle = vm.titleFontColor;
                ctx.font = helpers$1.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);
                var i, len;
                for (i = 0, len = title.length; i < len; ++i) {
                    ctx.fillText(title[i], pt.x, pt.y);
                    pt.y += titleFontSize + titleSpacing;
                    if (i + 1 === title.length) { pt.y += vm.titleMarginBottom - titleSpacing }
                }
            }
        },
        drawBody: function(pt, vm, ctx) {
            var bodyFontSize = vm.bodyFontSize,
                bodySpacing = vm.bodySpacing,
                bodyAlign = vm._bodyAlign,
                body = vm.body,
                drawColorBoxes = vm.displayColors,
                labelColors = vm.labelColors,
                xLinePadding = 0,
                colorX = drawColorBoxes ? getAlignedX(vm, 'left') : 0,
                textColor;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = 'top';
            ctx.font = helpers$1.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
            pt.x = getAlignedX(vm, bodyAlign);
            var fillLineOfText = function(line) {
                ctx.fillText(line, pt.x + xLinePadding, pt.y);
                pt.y += bodyFontSize + bodySpacing
            };
            ctx.fillStyle = vm.bodyFontColor;
            helpers$1.each(vm.beforeBody, fillLineOfText);
            xLinePadding = drawColorBoxes && bodyAlign !== 'right' ? bodyAlign === 'center' ? (bodyFontSize / 2 + 1) : (bodyFontSize + 2) : 0;
            helpers$1.each(body, function(bodyItem, i) {
                textColor = vm.labelTextColors[i];
                ctx.fillStyle = textColor;
                helpers$1.each(bodyItem.before, fillLineOfText);
                helpers$1.each(bodyItem.lines, function(line) {
                    if (drawColorBoxes) {
                        ctx.fillStyle = vm.legendColorBackground;
                        ctx.fillRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = labelColors[i].borderColor;
                        ctx.strokeRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.fillStyle = labelColors[i].backgroundColor;
                        ctx.fillRect(colorX + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
                        ctx.fillStyle = textColor
                    }
                    fillLineOfText(line)
                });
                helpers$1.each(bodyItem.after, fillLineOfText)
            });
            xLinePadding = 0;
            helpers$1.each(vm.afterBody, fillLineOfText);
            pt.y -= bodySpacing
        },
        drawFooter: function(pt, vm, ctx) {
            var footer = vm.footer;
            if (footer.length) {
                pt.x = getAlignedX(vm, vm._footerAlign);
                pt.y += vm.footerMarginTop;
                ctx.textAlign = vm._footerAlign;
                ctx.textBaseline = 'top';
                ctx.fillStyle = vm.footerFontColor;
                ctx.font = helpers$1.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);
                helpers$1.each(footer, function(line) {
                    ctx.fillText(line, pt.x, pt.y);
                    pt.y += vm.footerFontSize + vm.footerSpacing
                })
            }
        },
        drawBackground: function(pt, vm, ctx, tooltipSize) {
            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = vm.borderWidth;
            var xAlign = vm.xAlign,
                yAlign = vm.yAlign,
                x = pt.x,
                y = pt.y,
                width = tooltipSize.width,
                height = tooltipSize.height,
                radius = vm.cornerRadius;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            if (yAlign === 'top') { this.drawCaret(pt, tooltipSize) }
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            if (yAlign === 'center' && xAlign === 'right') { this.drawCaret(pt, tooltipSize) }
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            if (yAlign === 'bottom') { this.drawCaret(pt, tooltipSize) }
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            if (yAlign === 'center' && xAlign === 'left') { this.drawCaret(pt, tooltipSize) }
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            if (vm.borderWidth > 0) { ctx.stroke() }
        },
        draw: function() {
            var ctx = this._chart.ctx,
                vm = this._view;
            if (vm.opacity === 0) { return }
            var tooltipSize = { width: vm.width, height: vm.height };
            var pt = { x: vm.x, y: vm.y };
            var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity,
                hasTooltipContent = vm.title.length || vm.beforeBody.length || vm.body.length || vm.afterBody.length || vm.footer.length;
            if (this._options.enabled && hasTooltipContent) {
                ctx.save();
                ctx.globalAlpha = opacity;
                this.drawBackground(pt, vm, ctx, tooltipSize);
                pt.y += vm.yPadding;
                this.drawTitle(pt, vm, ctx);
                this.drawBody(pt, vm, ctx);
                this.drawFooter(pt, vm, ctx);
                ctx.restore()
            }
        },
        handleEvent: function(e) {
            var me = this,
                options = me._options,
                changed = false;
            me._lastActive = me._lastActive || [];
            if (e.type === 'mouseout') { me._active = [] } else { me._active = me._chart.getElementsAtEventForMode(e, options.mode, options) }
            changed = !helpers$1.arrayEquals(me._active, me._lastActive);
            if (changed) {
                me._lastActive = me._active;
                if (options.enabled || options.custom) {
                    me._eventPosition = { x: e.x, y: e.y };
                    me.update(true);
                    me.pivot()
                }
            }
            return changed
        }
    });
    var positioners_1 = positioners,
        core_tooltip = exports$3;
    core_tooltip.positioners = positioners_1;
    var valueOrDefault$8 = helpers$1.valueOrDefault;
    core_defaults._set('global', { elements: {}, events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'], hover: { onHover: null, mode: 'nearest', intersect: true, animationDuration: 400 }, onClick: null, maintainAspectRatio: true, responsive: true, responsiveAnimationDuration: 0 });

    function mergeScaleConfig() {
        return helpers$1.merge({}, [].slice.call(arguments), {
            merger: function(key, target, source, options) {
                if (key === 'xAxes' || key === 'yAxes') {
                    var slen = source[key].length,
                        i, type, scale;
                    if (!target[key]) { target[key] = [] }
                    for (i = 0; i < slen; ++i) {
                        scale = source[key][i];
                        type = valueOrDefault$8(scale.type, key === 'xAxes' ? 'category' : 'linear');
                        if (i >= target[key].length) { target[key].push({}) }
                        if (!target[key][i].type || (scale.type && scale.type !== target[key][i].type)) { helpers$1.merge(target[key][i], [core_scaleService.getScaleDefaults(type), scale]) } else { helpers$1.merge(target[key][i], scale) }
                    }
                } else { helpers$1._merger(key, target, source, options) }
            }
        })
    }

    function mergeConfig() {
        return helpers$1.merge({}, [].slice.call(arguments), {
            merger: function(key, target, source, options) {
                var tval = target[key] || {},
                    sval = source[key];
                if (key === 'scales') { target[key] = mergeScaleConfig(tval, sval) } else if (key === 'scale') { target[key] = helpers$1.merge(tval, [core_scaleService.getScaleDefaults(sval.type), sval]) } else { helpers$1._merger(key, target, source, options) }
            }
        })
    }

    function initConfig(config) {
        config = config || {};
        var data = config.data = config.data || {};
        data.datasets = data.datasets || [];
        data.labels = data.labels || [];
        config.options = mergeConfig(core_defaults.global, core_defaults[config.type], config.options || {});
        return config
    }

    function updateConfig(chart) {
        var newOptions = chart.options;
        helpers$1.each(chart.scales, function(scale) { core_layouts.removeBox(chart, scale) });
        newOptions = mergeConfig(core_defaults.global, core_defaults[chart.config.type], newOptions);
        chart.options = chart.config.options = newOptions;
        chart.ensureScalesHaveIDs();
        chart.buildOrUpdateScales();
        chart.tooltip._options = newOptions.tooltips;
        chart.tooltip.initialize()
    }

    function positionIsHorizontal(position) { return position === 'top' || position === 'bottom' }
    var Chart = function(item, config) { this.construct(item, config); return this };
    helpers$1.extend(Chart.prototype, {
        construct: function(item, config) {
            var me = this;
            config = initConfig(config);
            var context = platform.acquireContext(item, config),
                canvas = context && context.canvas,
                height = canvas && canvas.height,
                width = canvas && canvas.width;
            me.id = helpers$1.uid();
            me.ctx = context;
            me.canvas = canvas;
            me.config = config;
            me.width = width;
            me.height = height;
            me.aspectRatio = height ? width / height : null;
            me.options = config.options;
            me._bufferedRender = false;
            me.chart = me;
            me.controller = me;
            Chart.instances[me.id] = me;
            Object.defineProperty(me, 'data', { get: function() { return me.config.data }, set: function(value) { me.config.data = value } });
            if (!context || !canvas) { console.error("Failed to create chart: can't acquire context from the given item"); return }
            me.initialize();
            me.update()
        },
        initialize: function() {
            var me = this;
            core_plugins.notify(me, 'beforeInit');
            helpers$1.retinaScale(me, me.options.devicePixelRatio);
            me.bindEvents();
            if (me.options.responsive) { me.resize(true) }
            me.ensureScalesHaveIDs();
            me.buildOrUpdateScales();
            me.initToolTip();
            core_plugins.notify(me, 'afterInit');
            return me
        },
        clear: function() { helpers$1.canvas.clear(this); return this },
        stop: function() { core_animations.cancelAnimation(this); return this },
        resize: function(silent) {
            var me = this,
                options = me.options,
                canvas = me.canvas,
                aspectRatio = (options.maintainAspectRatio && me.aspectRatio) || null,
                newWidth = Math.max(0, Math.floor(helpers$1.getMaximumWidth(canvas))),
                newHeight = Math.max(0, Math.floor(aspectRatio ? newWidth / aspectRatio : helpers$1.getMaximumHeight(canvas)));
            if (me.width === newWidth && me.height === newHeight) { return }
            canvas.width = me.width = newWidth;
            canvas.height = me.height = newHeight;
            canvas.style.width = newWidth + 'px';
            canvas.style.height = newHeight + 'px';
            helpers$1.retinaScale(me, options.devicePixelRatio);
            if (!silent) {
                var newSize = { width: newWidth, height: newHeight };
                core_plugins.notify(me, 'resize', [newSize]);
                if (options.onResize) { options.onResize(me, newSize) }
                me.stop();
                me.update({ duration: options.responsiveAnimationDuration })
            }
        },
        ensureScalesHaveIDs: function() {
            var options = this.options,
                scalesOptions = options.scales || {},
                scaleOptions = options.scale;
            helpers$1.each(scalesOptions.xAxes, function(xAxisOptions, index) { xAxisOptions.id = xAxisOptions.id || ('x-axis-' + index) });
            helpers$1.each(scalesOptions.yAxes, function(yAxisOptions, index) { yAxisOptions.id = yAxisOptions.id || ('y-axis-' + index) });
            if (scaleOptions) { scaleOptions.id = scaleOptions.id || 'scale' }
        },
        buildOrUpdateScales: function() {
            var me = this,
                options = me.options,
                scales = me.scales || {},
                items = [],
                updated = Object.keys(scales).reduce(function(obj, id) { obj[id] = false; return obj }, {});
            if (options.scales) { items = items.concat((options.scales.xAxes || []).map(function(xAxisOptions) { return { options: xAxisOptions, dtype: 'category', dposition: 'bottom' } }), (options.scales.yAxes || []).map(function(yAxisOptions) { return { options: yAxisOptions, dtype: 'linear', dposition: 'left' } })) }
            if (options.scale) { items.push({ options: options.scale, dtype: 'radialLinear', isDefault: true, dposition: 'chartArea' }) }
            helpers$1.each(items, function(item) {
                var scaleOptions = item.options,
                    id = scaleOptions.id,
                    scaleType = valueOrDefault$8(scaleOptions.type, item.dtype);
                if (positionIsHorizontal(scaleOptions.position) !== positionIsHorizontal(item.dposition)) { scaleOptions.position = item.dposition }
                updated[id] = true;
                var scale = null;
                if (id in scales && scales[id].type === scaleType) {
                    scale = scales[id];
                    scale.options = scaleOptions;
                    scale.ctx = me.ctx;
                    scale.chart = me
                } else {
                    var scaleClass = core_scaleService.getScaleConstructor(scaleType);
                    if (!scaleClass) { return }
                    scale = new scaleClass({ id: id, type: scaleType, options: scaleOptions, ctx: me.ctx, chart: me });
                    scales[scale.id] = scale
                }
                scale.mergeTicksOptions();
                if (item.isDefault) { me.scale = scale }
            });
            helpers$1.each(updated, function(hasUpdated, id) { if (!hasUpdated) { delete scales[id] } });
            me.scales = scales;
            core_scaleService.addScalesToLayout(this)
        },
        buildOrUpdateControllers: function() {
            var me = this,
                newControllers = [];
            helpers$1.each(me.data.datasets, function(dataset, datasetIndex) {
                var meta = me.getDatasetMeta(datasetIndex),
                    type = dataset.type || me.config.type;
                if (meta.type && meta.type !== type) {
                    me.destroyDatasetMeta(datasetIndex);
                    meta = me.getDatasetMeta(datasetIndex)
                }
                meta.type = type;
                if (meta.controller) {
                    meta.controller.updateIndex(datasetIndex);
                    meta.controller.linkScales()
                } else {
                    var ControllerClass = controllers[meta.type];
                    if (ControllerClass === undefined) { throw new Error('"' + meta.type + '" is not a chart type.') }
                    meta.controller = new ControllerClass(me, datasetIndex);
                    newControllers.push(meta.controller)
                }
            }, me);
            return newControllers
        },
        resetElements: function() {
            var me = this;
            helpers$1.each(me.data.datasets, function(dataset, datasetIndex) { me.getDatasetMeta(datasetIndex).controller.reset() }, me)
        },
        reset: function() {
            this.resetElements();
            this.tooltip.initialize()
        },
        update: function(config) {
            var me = this;
            if (!config || typeof config !== 'object') { config = { duration: config, lazy: arguments[1] } }
            updateConfig(me);
            core_plugins._invalidate(me);
            if (core_plugins.notify(me, 'beforeUpdate') === false) { return }
            me.tooltip._data = me.data;
            var newControllers = me.buildOrUpdateControllers();
            helpers$1.each(me.data.datasets, function(dataset, datasetIndex) { me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements() }, me);
            me.updateLayout();
            if (me.options.animation && me.options.animation.duration) { helpers$1.each(newControllers, function(controller) { controller.reset() }) }
            me.updateDatasets();
            me.tooltip.initialize();
            me.lastActive = [];
            core_plugins.notify(me, 'afterUpdate');
            if (me._bufferedRender) { me._bufferedRequest = { duration: config.duration, easing: config.easing, lazy: config.lazy } } else { me.render(config) }
        },
        updateLayout: function() {
            var me = this;
            if (core_plugins.notify(me, 'beforeLayout') === false) { return }
            core_layouts.update(this, this.width, this.height);
            core_plugins.notify(me, 'afterScaleUpdate');
            core_plugins.notify(me, 'afterLayout')
        },
        updateDatasets: function() {
            var me = this;
            if (core_plugins.notify(me, 'beforeDatasetsUpdate') === false) { return }
            for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) { me.updateDataset(i) }
            core_plugins.notify(me, 'afterDatasetsUpdate')
        },
        updateDataset: function(index) {
            var me = this,
                meta = me.getDatasetMeta(index),
                args = { meta: meta, index: index };
            if (core_plugins.notify(me, 'beforeDatasetUpdate', [args]) === false) { return }
            meta.controller.update();
            core_plugins.notify(me, 'afterDatasetUpdate', [args])
        },
        render: function(config) {
            var me = this;
            if (!config || typeof config !== 'object') { config = { duration: config, lazy: arguments[1] } }
            var animationOptions = me.options.animation,
                duration = valueOrDefault$8(config.duration, animationOptions && animationOptions.duration),
                lazy = config.lazy;
            if (core_plugins.notify(me, 'beforeRender') === false) { return }
            var onComplete = function(animation) {
                core_plugins.notify(me, 'afterRender');
                helpers$1.callback(animationOptions && animationOptions.onComplete, [animation], me)
            };
            if (animationOptions && duration) {
                var animation = new core_animation({
                    numSteps: duration / 16.66,
                    easing: config.easing || animationOptions.easing,
                    render: function(chart, animationObject) {
                        var easingFunction = helpers$1.easing.effects[animationObject.easing],
                            currentStep = animationObject.currentStep,
                            stepDecimal = currentStep / animationObject.numSteps;
                        chart.draw(easingFunction(stepDecimal), stepDecimal, currentStep)
                    },
                    onAnimationProgress: animationOptions.onProgress,
                    onAnimationComplete: onComplete
                });
                core_animations.addAnimation(me, animation, duration, lazy)
            } else {
                me.draw();
                onComplete(new core_animation({ numSteps: 0, chart: me }))
            }
            return me
        },
        draw: function(easingValue) {
            var me = this;
            me.clear();
            if (helpers$1.isNullOrUndef(easingValue)) { easingValue = 1 }
            me.transition(easingValue);
            if (me.width <= 0 || me.height <= 0) { return }
            if (core_plugins.notify(me, 'beforeDraw', [easingValue]) === false) { return }
            helpers$1.each(me.boxes, function(box) { box.draw(me.chartArea) }, me);
            me.drawDatasets(easingValue);
            me._drawTooltip(easingValue);
            core_plugins.notify(me, 'afterDraw', [easingValue])
        },
        transition: function(easingValue) {
            var me = this;
            for (var i = 0, ilen = (me.data.datasets || []).length; i < ilen; ++i) { if (me.isDatasetVisible(i)) { me.getDatasetMeta(i).controller.transition(easingValue) } }
            me.tooltip.transition(easingValue)
        },
        drawDatasets: function(easingValue) {
            var me = this;
            if (core_plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) { return }
            for (var i = (me.data.datasets || []).length - 1; i >= 0; --i) { if (me.isDatasetVisible(i)) { me.drawDataset(i, easingValue) } }
            core_plugins.notify(me, 'afterDatasetsDraw', [easingValue])
        },
        drawDataset: function(index, easingValue) {
            var me = this,
                meta = me.getDatasetMeta(index),
                args = { meta: meta, index: index, easingValue: easingValue };
            if (core_plugins.notify(me, 'beforeDatasetDraw', [args]) === false) { return }
            meta.controller.draw(easingValue);
            core_plugins.notify(me, 'afterDatasetDraw', [args])
        },
        _drawTooltip: function(easingValue) {
            var me = this,
                tooltip = me.tooltip,
                args = { tooltip: tooltip, easingValue: easingValue };
            if (core_plugins.notify(me, 'beforeTooltipDraw', [args]) === false) { return }
            tooltip.draw();
            core_plugins.notify(me, 'afterTooltipDraw', [args])
        },
        getElementAtEvent: function(e) { return core_interaction.modes.single(this, e) },
        getElementsAtEvent: function(e) { return core_interaction.modes.label(this, e, { intersect: true }) },
        getElementsAtXAxis: function(e) { return core_interaction.modes['x-axis'](this, e, { intersect: true }) },
        getElementsAtEventForMode: function(e, mode, options) { var method = core_interaction.modes[mode]; if (typeof method === 'function') { return method(this, e, options) } return [] },
        getDatasetAtEvent: function(e) { return core_interaction.modes.dataset(this, e, { intersect: true }) },
        getDatasetMeta: function(datasetIndex) {
            var me = this,
                dataset = me.data.datasets[datasetIndex];
            if (!dataset._meta) { dataset._meta = {} }
            var meta = dataset._meta[me.id];
            if (!meta) { meta = dataset._meta[me.id] = { type: null, data: [], dataset: null, controller: null, hidden: null, xAxisID: null, yAxisID: null } }
            return meta
        },
        getVisibleDatasetCount: function() { var count = 0; for (var i = 0, ilen = this.data.datasets.length; i < ilen; ++i) { if (this.isDatasetVisible(i)) { count++ } } return count },
        isDatasetVisible: function(datasetIndex) { var meta = this.getDatasetMeta(datasetIndex); return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden },
        generateLegend: function() { return this.options.legendCallback(this) },
        destroyDatasetMeta: function(datasetIndex) {
            var id = this.id,
                dataset = this.data.datasets[datasetIndex],
                meta = dataset._meta && dataset._meta[id];
            if (meta) {
                meta.controller.destroy();
                delete dataset._meta[id]
            }
        },
        destroy: function() {
            var me = this,
                canvas = me.canvas,
                i, ilen;
            me.stop();
            for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) { me.destroyDatasetMeta(i) }
            if (canvas) {
                me.unbindEvents();
                helpers$1.canvas.clear(me);
                platform.releaseContext(me.ctx);
                me.canvas = null;
                me.ctx = null
            }
            core_plugins.notify(me, 'destroy');
            delete Chart.instances[me.id]
        },
        toBase64Image: function() { return this.canvas.toDataURL.apply(this.canvas, arguments) },
        initToolTip: function() {
            var me = this;
            me.tooltip = new core_tooltip({ _chart: me, _chartInstance: me, _data: me.data, _options: me.options.tooltips }, me)
        },
        bindEvents: function() {
            var me = this,
                listeners = me._listeners = {},
                listener = function() { me.eventHandler.apply(me, arguments) };
            helpers$1.each(me.options.events, function(type) {
                platform.addEventListener(me, type, listener);
                listeners[type] = listener
            });
            if (me.options.responsive) {
                listener = function() { me.resize() };
                platform.addEventListener(me, 'resize', listener);
                listeners.resize = listener
            }
        },
        unbindEvents: function() {
            var me = this,
                listeners = me._listeners;
            if (!listeners) { return }
            delete me._listeners;
            helpers$1.each(listeners, function(listener, type) { platform.removeEventListener(me, type, listener) })
        },
        updateHoverStyle: function(elements, mode, enabled) {
            var method = enabled ? 'setHoverStyle' : 'removeHoverStyle',
                element, i, ilen;
            for (i = 0, ilen = elements.length; i < ilen; ++i) { element = elements[i]; if (element) { this.getDatasetMeta(element._datasetIndex).controller[method](element) } }
        },
        eventHandler: function(e) {
            var me = this,
                tooltip = me.tooltip;
            if (core_plugins.notify(me, 'beforeEvent', [e]) === false) { return }
            me._bufferedRender = true;
            me._bufferedRequest = null;
            var changed = me.handleEvent(e);
            if (tooltip) { changed = tooltip._start ? tooltip.handleEvent(e) : changed | tooltip.handleEvent(e) }
            core_plugins.notify(me, 'afterEvent', [e]);
            var bufferedRequest = me._bufferedRequest;
            if (bufferedRequest) { me.render(bufferedRequest) } else if (changed && !me.animating) {
                me.stop();
                me.render({ duration: me.options.hover.animationDuration, lazy: true })
            }
            me._bufferedRender = false;
            me._bufferedRequest = null;
            return me
        },
        handleEvent: function(e) {
            var me = this,
                options = me.options || {},
                hoverOptions = options.hover,
                changed = false;
            me.lastActive = me.lastActive || [];
            if (e.type === 'mouseout') { me.active = [] } else { me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions) }
            helpers$1.callback(options.onHover || options.hover.onHover, [e.native, me.active], me);
            if (e.type === 'mouseup' || e.type === 'click') { if (options.onClick) { options.onClick.call(me, e.native, me.active) } }
            if (me.lastActive.length) { me.updateHoverStyle(me.lastActive, hoverOptions.mode, false) }
            if (me.active.length && hoverOptions.mode) { me.updateHoverStyle(me.active, hoverOptions.mode, true) }
            changed = !helpers$1.arrayEquals(me.active, me.lastActive);
            me.lastActive = me.active;
            return changed
        }
    });
    Chart.instances = {};
    var core_controller = Chart;
    Chart.Controller = Chart;
    Chart.types = {};
    helpers$1.configMerge = mergeConfig;
    helpers$1.scaleMerge = mergeScaleConfig;
    var core_helpers = function() {
        helpers$1.where = function(collection, filterCallback) {
            if (helpers$1.isArray(collection) && Array.prototype.filter) { return collection.filter(filterCallback) }
            var filtered = [];
            helpers$1.each(collection, function(item) { if (filterCallback(item)) { filtered.push(item) } });
            return filtered
        };
        helpers$1.findIndex = Array.prototype.findIndex ? function(array, callback, scope) { return array.findIndex(callback, scope) } : function(array, callback, scope) { scope = scope === undefined ? array : scope; for (var i = 0, ilen = array.length; i < ilen; ++i) { if (callback.call(scope, array[i], i, array)) { return i } } return -1 };
        helpers$1.findNextWhere = function(arrayToSearch, filterCallback, startIndex) { if (helpers$1.isNullOrUndef(startIndex)) { startIndex = -1 } for (var i = startIndex + 1; i < arrayToSearch.length; i++) { var currentItem = arrayToSearch[i]; if (filterCallback(currentItem)) { return currentItem } } };
        helpers$1.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) { if (helpers$1.isNullOrUndef(startIndex)) { startIndex = arrayToSearch.length } for (var i = startIndex - 1; i >= 0; i--) { var currentItem = arrayToSearch[i]; if (filterCallback(currentItem)) { return currentItem } } };
        helpers$1.isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n) };
        helpers$1.almostEquals = function(x, y, epsilon) { return Math.abs(x - y) < epsilon };
        helpers$1.almostWhole = function(x, epsilon) { var rounded = Math.round(x); return (((rounded - epsilon) < x) && ((rounded + epsilon) > x)) };
        helpers$1.max = function(array) { return array.reduce(function(max, value) { if (!isNaN(value)) { return Math.max(max, value) } return max }, Number.NEGATIVE_INFINITY) };
        helpers$1.min = function(array) { return array.reduce(function(min, value) { if (!isNaN(value)) { return Math.min(min, value) } return min }, Number.POSITIVE_INFINITY) };
        helpers$1.sign = Math.sign ? function(x) { return Math.sign(x) } : function(x) { x = +x; if (x === 0 || isNaN(x)) { return x } return x > 0 ? 1 : -1 };
        helpers$1.log10 = Math.log10 ? function(x) { return Math.log10(x) } : function(x) {
            var exponent = Math.log(x) * Math.LOG10E,
                powerOf10 = Math.round(exponent),
                isPowerOf10 = x === Math.pow(10, powerOf10);
            return isPowerOf10 ? powerOf10 : exponent
        };
        helpers$1.toRadians = function(degrees) { return degrees * (Math.PI / 180) };
        helpers$1.toDegrees = function(radians) { return radians * (180 / Math.PI) };
        helpers$1._decimalPlaces = function(x) {
            if (!helpers$1.isFinite(x)) { return }
            var e = 1,
                p = 0;
            while (Math.round(x * e) / e !== x) {
                e *= 10;
                p++
            }
            return p
        };
        helpers$1.getAngleFromPoint = function(centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x,
                distanceFromYCenter = anglePoint.y - centrePoint.y,
                radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter),
                angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
            if (angle < (-0.5 * Math.PI)) { angle += 2.0 * Math.PI }
            return { angle: angle, distance: radialDistanceFromCenter }
        };
        helpers$1.distanceBetweenPoints = function(pt1, pt2) { return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2)) };
        helpers$1.aliasPixel = function(pixelWidth) { return (pixelWidth % 2 === 0) ? 0 : 0.5 };
        helpers$1._alignPixel = function(chart, pixel, width) {
            var devicePixelRatio = chart.currentDevicePixelRatio,
                halfWidth = width / 2;
            return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth
        };
        helpers$1.splineCurve = function(firstPoint, middlePoint, afterPoint, t) {
            var previous = firstPoint.skip ? middlePoint : firstPoint,
                current = middlePoint,
                next = afterPoint.skip ? middlePoint : afterPoint,
                d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)),
                d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)),
                s01 = d01 / (d01 + d12),
                s12 = d12 / (d01 + d12);
            s01 = isNaN(s01) ? 0 : s01;
            s12 = isNaN(s12) ? 0 : s12;
            var fa = t * s01,
                fb = t * s12;
            return { previous: { x: current.x - fa * (next.x - previous.x), y: current.y - fa * (next.y - previous.y) }, next: { x: current.x + fb * (next.x - previous.x), y: current.y + fb * (next.y - previous.y) } }
        };
        helpers$1.EPSILON = Number.EPSILON || 1e-14;
        helpers$1.splineCurveMonotone = function(points) {
            var pointsWithTangents = (points || []).map(function(point) { return { model: point._model, deltaK: 0, mK: 0 } });
            var pointsLen = pointsWithTangents.length,
                i, pointBefore, pointCurrent, pointAfter;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) { continue }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointAfter && !pointAfter.model.skip) {
                    var slopeDeltaX = (pointAfter.model.x - pointCurrent.model.x);
                    pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0
                }
                if (!pointBefore || pointBefore.model.skip) { pointCurrent.mK = pointCurrent.deltaK } else if (!pointAfter || pointAfter.model.skip) { pointCurrent.mK = pointBefore.deltaK } else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) { pointCurrent.mK = 0 } else { pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2 }
            }
            var alphaK, betaK, tauK, squaredMagnitude;
            for (i = 0; i < pointsLen - 1; ++i) {
                pointCurrent = pointsWithTangents[i];
                pointAfter = pointsWithTangents[i + 1];
                if (pointCurrent.model.skip || pointAfter.model.skip) { continue }
                if (helpers$1.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) { pointCurrent.mK = pointAfter.mK = 0; continue }
                alphaK = pointCurrent.mK / pointCurrent.deltaK;
                betaK = pointAfter.mK / pointCurrent.deltaK;
                squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
                if (squaredMagnitude <= 9) { continue }
                tauK = 3 / Math.sqrt(squaredMagnitude);
                pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
                pointAfter.mK = betaK * tauK * pointCurrent.deltaK
            }
            var deltaX;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) { continue }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointBefore && !pointBefore.model.skip) {
                    deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
                    pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
                    pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK
                }
                if (pointAfter && !pointAfter.model.skip) {
                    deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
                    pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
                    pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK
                }
            }
        };
        helpers$1.nextItem = function(collection, index, loop) { if (loop) { return index >= collection.length - 1 ? collection[0] : collection[index + 1] } return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1] };
        helpers$1.previousItem = function(collection, index, loop) { if (loop) { return index <= 0 ? collection[collection.length - 1] : collection[index - 1] } return index <= 0 ? collection[0] : collection[index - 1] };
        helpers$1.niceNum = function(range, round) {
            var exponent = Math.floor(helpers$1.log10(range)),
                fraction = range / Math.pow(10, exponent),
                niceFraction;
            if (round) { if (fraction < 1.5) { niceFraction = 1 } else if (fraction < 3) { niceFraction = 2 } else if (fraction < 7) { niceFraction = 5 } else { niceFraction = 10 } } else if (fraction <= 1.0) { niceFraction = 1 } else if (fraction <= 2) { niceFraction = 2 } else if (fraction <= 5) { niceFraction = 5 } else { niceFraction = 10 }
            return niceFraction * Math.pow(10, exponent)
        };
        helpers$1.requestAnimFrame = (function() { if (typeof window === 'undefined') { return function(callback) { callback() } } return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { return window.setTimeout(callback, 1000 / 60) } }());
        helpers$1.getRelativePosition = function(evt, chart) {
            var mouseX, mouseY, e = evt.originalEvent || evt,
                canvas = evt.target || evt.srcElement,
                boundingRect = canvas.getBoundingClientRect(),
                touches = e.touches;
            if (touches && touches.length > 0) {
                mouseX = touches[0].clientX;
                mouseY = touches[0].clientY
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY
            }
            var paddingLeft = parseFloat(helpers$1.getStyle(canvas, 'padding-left')),
                paddingTop = parseFloat(helpers$1.getStyle(canvas, 'padding-top')),
                paddingRight = parseFloat(helpers$1.getStyle(canvas, 'padding-right')),
                paddingBottom = parseFloat(helpers$1.getStyle(canvas, 'padding-bottom')),
                width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight,
                height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;
            mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
            mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);
            return { x: mouseX, y: mouseY }
        };

        function parseMaxStyle(styleValue, node, parentProperty) { var valueInPixels; if (typeof styleValue === 'string') { valueInPixels = parseInt(styleValue, 10); if (styleValue.indexOf('%') !== -1) { valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty] } } else { valueInPixels = styleValue } return valueInPixels }

        function isConstrainedValue(value) { return value !== undefined && value !== null && value !== 'none' }

        function getConstraintDimension(domNode, maxStyle, percentageProperty) {
            var view = document.defaultView,
                parentNode = helpers$1._getParentNode(domNode),
                constrainedNode = view.getComputedStyle(domNode)[maxStyle],
                constrainedContainer = view.getComputedStyle(parentNode)[maxStyle],
                hasCNode = isConstrainedValue(constrainedNode),
                hasCContainer = isConstrainedValue(constrainedContainer),
                infinity = Number.POSITIVE_INFINITY;
            if (hasCNode || hasCContainer) { return Math.min(hasCNode ? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity, hasCContainer ? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity) }
            return 'none'
        }
        helpers$1.getConstraintWidth = function(domNode) { return getConstraintDimension(domNode, 'max-width', 'clientWidth') };
        helpers$1.getConstraintHeight = function(domNode) { return getConstraintDimension(domNode, 'max-height', 'clientHeight') };
        helpers$1._calculatePadding = function(container, padding, parentDimension) { padding = helpers$1.getStyle(container, padding); return padding.indexOf('%') > -1 ? parentDimension * parseInt(padding, 10) / 100 : parseInt(padding, 10) };
        helpers$1._getParentNode = function(domNode) { var parent = domNode.parentNode; if (parent && parent.toString() === '[object ShadowRoot]') { parent = parent.host } return parent };
        helpers$1.getMaximumWidth = function(domNode) {
            var container = helpers$1._getParentNode(domNode);
            if (!container) { return domNode.clientWidth }
            var clientWidth = container.clientWidth,
                paddingLeft = helpers$1._calculatePadding(container, 'padding-left', clientWidth),
                paddingRight = helpers$1._calculatePadding(container, 'padding-right', clientWidth),
                w = clientWidth - paddingLeft - paddingRight,
                cw = helpers$1.getConstraintWidth(domNode);
            return isNaN(cw) ? w : Math.min(w, cw)
        };
        helpers$1.getMaximumHeight = function(domNode) {
            var container = helpers$1._getParentNode(domNode);
            if (!container) { return domNode.clientHeight }
            var clientHeight = container.clientHeight,
                paddingTop = helpers$1._calculatePadding(container, 'padding-top', clientHeight),
                paddingBottom = helpers$1._calculatePadding(container, 'padding-bottom', clientHeight),
                h = clientHeight - paddingTop - paddingBottom,
                ch = helpers$1.getConstraintHeight(domNode);
            return isNaN(ch) ? h : Math.min(h, ch)
        };
        helpers$1.getStyle = function(el, property) { return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property) };
        helpers$1.retinaScale = function(chart, forceRatio) {
            var pixelRatio = chart.currentDevicePixelRatio = forceRatio || (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
            if (pixelRatio === 1) { return }
            var canvas = chart.canvas,
                height = chart.height,
                width = chart.width;
            canvas.height = height * pixelRatio;
            canvas.width = width * pixelRatio;
            chart.ctx.scale(pixelRatio, pixelRatio);
            if (!canvas.style.height && !canvas.style.width) {
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px'
            }
        };
        helpers$1.fontString = function(pixelSize, fontStyle, fontFamily) { return fontStyle + ' ' + pixelSize + 'px ' + fontFamily };
        helpers$1.longestText = function(ctx, font, arrayOfThings, cache) {
            cache = cache || {};
            var data = cache.data = cache.data || {},
                gc = cache.garbageCollect = cache.garbageCollect || [];
            if (cache.font !== font) {
                data = cache.data = {};
                gc = cache.garbageCollect = [];
                cache.font = font
            }
            ctx.font = font;
            var longest = 0;
            helpers$1.each(arrayOfThings, function(thing) { if (thing !== undefined && thing !== null && helpers$1.isArray(thing) !== true) { longest = helpers$1.measureText(ctx, data, gc, longest, thing) } else if (helpers$1.isArray(thing)) { helpers$1.each(thing, function(nestedThing) { if (nestedThing !== undefined && nestedThing !== null && !helpers$1.isArray(nestedThing)) { longest = helpers$1.measureText(ctx, data, gc, longest, nestedThing) } }) } });
            var gcLen = gc.length / 2;
            if (gcLen > arrayOfThings.length) {
                for (var i = 0; i < gcLen; i++) { delete data[gc[i]] }
                gc.splice(0, gcLen)
            }
            return longest
        };
        helpers$1.measureText = function(ctx, data, gc, longest, string) {
            var textWidth = data[string];
            if (!textWidth) {
                textWidth = data[string] = ctx.measureText(string).width;
                gc.push(string)
            }
            if (textWidth > longest) { longest = textWidth }
            return longest
        };
        helpers$1.numberOfLabelLines = function(arrayOfThings) {
            var numberOfLines = 1;
            helpers$1.each(arrayOfThings, function(thing) { if (helpers$1.isArray(thing)) { if (thing.length > numberOfLines) { numberOfLines = thing.length } } });
            return numberOfLines
        };
        helpers$1.color = !chartjsColor ? function(value) { console.error('Color.js not found!'); return value } : function(value) { if (value instanceof CanvasGradient) { value = core_defaults.global.defaultColor } return chartjsColor(value) };
        helpers$1.getHoverColor = function(colorValue) { return (colorValue instanceof CanvasPattern || colorValue instanceof CanvasGradient) ? colorValue : helpers$1.color(colorValue).saturate(0.5).darken(0.1).rgbString() }
    };

    function abstract() { throw new Error('This method is not implemented: either no adapter can be found or an incomplete integration was provided.') }

    function DateAdapter(options) { this.options = options || {} }
    helpers$1.extend(DateAdapter.prototype, { formats: abstract, parse: abstract, format: abstract, add: abstract, diff: abstract, startOf: abstract, endOf: abstract, _create: function(value) { return value } });
    DateAdapter.override = function(members) { helpers$1.extend(DateAdapter.prototype, members) };
    var _date = DateAdapter,
        core_adapters = { _date: _date };
    var core_ticks = {
        formatters: {
            values: function(value) { return helpers$1.isArray(value) ? value : '' + value },
            linear: function(tickValue, index, ticks) {
                var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];
                if (Math.abs(delta) > 1) { if (tickValue !== Math.floor(tickValue)) { delta = tickValue - Math.floor(tickValue) } }
                var logDelta = helpers$1.log10(Math.abs(delta)),
                    tickString = '';
                if (tickValue !== 0) {
                    var maxTick = Math.max(Math.abs(ticks[0]), Math.abs(ticks[ticks.length - 1]));
                    if (maxTick < 1e-4) {
                        var logTick = helpers$1.log10(Math.abs(tickValue));
                        tickString = tickValue.toExponential(Math.floor(logTick) - Math.floor(logDelta))
                    } else {
                        var numDecimal = -1 * Math.floor(logDelta);
                        numDecimal = Math.max(Math.min(numDecimal, 20), 0);
                        tickString = tickValue.toFixed(numDecimal)
                    }
                } else { tickString = '0' }
                return tickString
            },
            logarithmic: function(tickValue, index, ticks) { var remain = tickValue / (Math.pow(10, Math.floor(helpers$1.log10(tickValue)))); if (tickValue === 0) { return '0' } else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) { return tickValue.toExponential() } return '' }
        }
    };
    var valueOrDefault$9 = helpers$1.valueOrDefault,
        valueAtIndexOrDefault = helpers$1.valueAtIndexOrDefault;
    core_defaults._set('scale', { display: true, position: 'left', offset: false, gridLines: { display: true, color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1, drawBorder: true, drawOnChartArea: true, drawTicks: true, tickMarkLength: 10, zeroLineWidth: 1, zeroLineColor: 'rgba(0,0,0,0.25)', zeroLineBorderDash: [], zeroLineBorderDashOffset: 0.0, offsetGridLines: false, borderDash: [], borderDashOffset: 0.0 }, scaleLabel: { display: false, labelString: '', padding: { top: 4, bottom: 4 } }, ticks: { beginAtZero: false, minRotation: 0, maxRotation: 50, mirror: false, padding: 0, reverse: false, display: true, autoSkip: true, autoSkipPadding: 0, labelOffset: 0, callback: core_ticks.formatters.values, minor: {}, major: {} } });

    function labelsFromTicks(ticks) {
        var labels = [],
            i, ilen;
        for (i = 0, ilen = ticks.length; i < ilen; ++i) { labels.push(ticks[i].label) }
        return labels
    }

    function getPixelForGridLine(scale, index, offsetGridLines) { var lineValue = scale.getPixelForTick(index); if (offsetGridLines) { if (scale.getTicks().length === 1) { lineValue -= scale.isHorizontal() ? Math.max(lineValue - scale.left, scale.right - lineValue) : Math.max(lineValue - scale.top, scale.bottom - lineValue) } else if (index === 0) { lineValue -= (scale.getPixelForTick(1) - lineValue) / 2 } else { lineValue -= (lineValue - scale.getPixelForTick(index - 1)) / 2 } } return lineValue }

    function computeTextSize(context, tick, font) { return helpers$1.isArray(tick) ? helpers$1.longestText(context, font, tick) : context.measureText(tick).width }
    var core_scale = core_element.extend({
        getPadding: function() { var me = this; return { left: me.paddingLeft || 0, top: me.paddingTop || 0, right: me.paddingRight || 0, bottom: me.paddingBottom || 0 } },
        getTicks: function() { return this._ticks },
        mergeTicksOptions: function() { var ticks = this.options.ticks; if (ticks.minor === false) { ticks.minor = { display: false } } if (ticks.major === false) { ticks.major = { display: false } } for (var key in ticks) { if (key !== 'major' && key !== 'minor') { if (typeof ticks.minor[key] === 'undefined') { ticks.minor[key] = ticks[key] } if (typeof ticks.major[key] === 'undefined') { ticks.major[key] = ticks[key] } } } },
        beforeUpdate: function() { helpers$1.callback(this.options.beforeUpdate, [this]) },
        update: function(maxWidth, maxHeight, margins) {
            var me = this,
                i, ilen, labels, label, ticks, tick;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = helpers$1.extend({ left: 0, right: 0, top: 0, bottom: 0 }, margins);
            me._maxLabelLines = 0;
            me.longestLabelWidth = 0;
            me.longestTextCache = me.longestTextCache || {};
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeDataLimits();
            me.determineDataLimits();
            me.afterDataLimits();
            me.beforeBuildTicks();
            ticks = me.buildTicks() || [];
            ticks = me.afterBuildTicks(ticks) || ticks;
            me.beforeTickToLabelConversion();
            labels = me.convertTicksToLabels(ticks) || me.ticks;
            me.afterTickToLabelConversion();
            me.ticks = labels;
            for (i = 0, ilen = labels.length; i < ilen; ++i) {
                label = labels[i];
                tick = ticks[i];
                if (!tick) { ticks.push(tick = { label: label, major: false }) } else { tick.label = label }
            }
            me._ticks = ticks;
            me.beforeCalculateTickRotation();
            me.calculateTickRotation();
            me.afterCalculateTickRotation();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize
        },
        afterUpdate: function() { helpers$1.callback(this.options.afterUpdate, [this]) },
        beforeSetDimensions: function() { helpers$1.callback(this.options.beforeSetDimensions, [this]) },
        setDimensions: function() {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0
        },
        afterSetDimensions: function() { helpers$1.callback(this.options.afterSetDimensions, [this]) },
        beforeDataLimits: function() { helpers$1.callback(this.options.beforeDataLimits, [this]) },
        determineDataLimits: helpers$1.noop,
        afterDataLimits: function() { helpers$1.callback(this.options.afterDataLimits, [this]) },
        beforeBuildTicks: function() { helpers$1.callback(this.options.beforeBuildTicks, [this]) },
        buildTicks: helpers$1.noop,
        afterBuildTicks: function(ticks) {
            var me = this;
            if (helpers$1.isArray(ticks) && ticks.length) { return helpers$1.callback(me.options.afterBuildTicks, [me, ticks]) }
            me.ticks = helpers$1.callback(me.options.afterBuildTicks, [me, me.ticks]) || me.ticks;
            return ticks
        },
        beforeTickToLabelConversion: function() { helpers$1.callback(this.options.beforeTickToLabelConversion, [this]) },
        convertTicksToLabels: function() {
            var me = this,
                tickOpts = me.options.ticks;
            me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback, this)
        },
        afterTickToLabelConversion: function() { helpers$1.callback(this.options.afterTickToLabelConversion, [this]) },
        beforeCalculateTickRotation: function() { helpers$1.callback(this.options.beforeCalculateTickRotation, [this]) },
        calculateTickRotation: function() {
            var me = this,
                context = me.ctx,
                tickOpts = me.options.ticks,
                labels = labelsFromTicks(me._ticks),
                tickFont = helpers$1.options._parseFont(tickOpts);
            context.font = tickFont.string;
            var labelRotation = tickOpts.minRotation || 0;
            if (labels.length && me.options.display && me.isHorizontal()) {
                var originalLabelWidth = helpers$1.longestText(context, tickFont.string, labels, me.longestTextCache),
                    labelWidth = originalLabelWidth,
                    cosRotation, sinRotation, tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;
                while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
                    var angleRadians = helpers$1.toRadians(labelRotation);
                    cosRotation = Math.cos(angleRadians);
                    sinRotation = Math.sin(angleRadians);
                    if (sinRotation * originalLabelWidth > me.maxHeight) { labelRotation--; break }
                    labelRotation++;
                    labelWidth = cosRotation * originalLabelWidth
                }
            }
            me.labelRotation = labelRotation
        },
        afterCalculateTickRotation: function() { helpers$1.callback(this.options.afterCalculateTickRotation, [this]) },
        beforeFit: function() { helpers$1.callback(this.options.beforeFit, [this]) },
        fit: function() {
            var me = this,
                minSize = me.minSize = { width: 0, height: 0 };
            var labels = labelsFromTicks(me._ticks),
                opts = me.options,
                tickOpts = opts.ticks,
                scaleLabelOpts = opts.scaleLabel,
                gridLineOpts = opts.gridLines,
                display = me._isVisible(),
                position = opts.position,
                isHorizontal = me.isHorizontal(),
                parseFont = helpers$1.options._parseFont,
                tickFont = parseFont(tickOpts),
                tickMarkLength = opts.gridLines.tickMarkLength;
            if (isHorizontal) { minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth } else { minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0 }
            if (isHorizontal) { minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0 } else { minSize.height = me.maxHeight }
            if (scaleLabelOpts.display && display) {
                var scaleLabelFont = parseFont(scaleLabelOpts),
                    scaleLabelPadding = helpers$1.options.toPadding(scaleLabelOpts.padding),
                    deltaHeight = scaleLabelFont.lineHeight + scaleLabelPadding.height;
                if (isHorizontal) { minSize.height += deltaHeight } else { minSize.width += deltaHeight }
            }
            if (tickOpts.display && display) {
                var largestTextWidth = helpers$1.longestText(me.ctx, tickFont.string, labels, me.longestTextCache),
                    tallestLabelHeightInLines = helpers$1.numberOfLabelLines(labels),
                    lineSpace = tickFont.size * 0.5,
                    tickPadding = me.options.ticks.padding;
                me._maxLabelLines = tallestLabelHeightInLines;
                me.longestLabelWidth = largestTextWidth;
                if (isHorizontal) {
                    var angleRadians = helpers$1.toRadians(me.labelRotation),
                        cosRotation = Math.cos(angleRadians),
                        sinRotation = Math.sin(angleRadians),
                        labelHeight = (sinRotation * largestTextWidth) + (tickFont.lineHeight * tallestLabelHeightInLines) + lineSpace;
                    minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);
                    me.ctx.font = tickFont.string;
                    var firstLabelWidth = computeTextSize(me.ctx, labels[0], tickFont.string),
                        lastLabelWidth = computeTextSize(me.ctx, labels[labels.length - 1], tickFont.string),
                        offsetLeft = me.getPixelForTick(0) - me.left,
                        offsetRight = me.right - me.getPixelForTick(labels.length - 1),
                        paddingLeft, paddingRight;
                    if (me.labelRotation !== 0) {
                        paddingLeft = position === 'bottom' ? (cosRotation * firstLabelWidth) : (cosRotation * lineSpace);
                        paddingRight = position === 'bottom' ? (cosRotation * lineSpace) : (cosRotation * lastLabelWidth)
                    } else {
                        paddingLeft = firstLabelWidth / 2;
                        paddingRight = lastLabelWidth / 2
                    }
                    me.paddingLeft = Math.max(paddingLeft - offsetLeft, 0) + 3;
                    me.paddingRight = Math.max(paddingRight - offsetRight, 0) + 3
                } else {
                    if (tickOpts.mirror) { largestTextWidth = 0 } else { largestTextWidth += tickPadding + lineSpace }
                    minSize.width = Math.min(me.maxWidth, minSize.width + largestTextWidth);
                    me.paddingTop = tickFont.size / 2;
                    me.paddingBottom = tickFont.size / 2
                }
            }
            me.handleMargins();
            me.width = minSize.width;
            me.height = minSize.height
        },
        handleMargins: function() {
            var me = this;
            if (me.margins) {
                me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
                me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
                me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
                me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0)
            }
        },
        afterFit: function() { helpers$1.callback(this.options.afterFit, [this]) },
        isHorizontal: function() { return this.options.position === 'top' || this.options.position === 'bottom' },
        isFullWidth: function() { return (this.options.fullWidth) },
        getRightValue: function(rawValue) { if (helpers$1.isNullOrUndef(rawValue)) { return NaN } if ((typeof rawValue === 'number' || rawValue instanceof Number) && !isFinite(rawValue)) { return NaN } if (rawValue) { if (this.isHorizontal()) { if (rawValue.x !== undefined) { return this.getRightValue(rawValue.x) } } else if (rawValue.y !== undefined) { return this.getRightValue(rawValue.y) } } return rawValue },
        getLabelForIndex: helpers$1.noop,
        getPixelForValue: helpers$1.noop,
        getValueForPixel: helpers$1.noop,
        getPixelForTick: function(index) {
            var me = this,
                offset = me.options.offset;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight),
                    tickWidth = innerWidth / Math.max((me._ticks.length - (offset ? 0 : 1)), 1),
                    pixel = (tickWidth * index) + me.paddingLeft;
                if (offset) { pixel += tickWidth / 2 }
                var finalVal = me.left + pixel;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal
            }
            var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
            return me.top + (index * (innerHeight / (me._ticks.length - 1)))
        },
        getPixelForDecimal: function(decimal) {
            var me = this;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight),
                    valueOffset = (innerWidth * decimal) + me.paddingLeft,
                    finalVal = me.left + valueOffset;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal
            }
            return me.top + (decimal * me.height)
        },
        getBasePixel: function() { return this.getPixelForValue(this.getBaseValue()) },
        getBaseValue: function() {
            var me = this,
                min = me.min,
                max = me.max;
            return me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0
        },
        _autoSkip: function(ticks) {
            var me = this,
                isHorizontal = me.isHorizontal(),
                optionTicks = me.options.ticks.minor,
                tickCount = ticks.length,
                skipRatio = false,
                maxTicks = optionTicks.maxTicksLimit,
                ticksLength = me._tickSize() * (tickCount - 1),
                axisLength = isHorizontal ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.PaddingBottom),
                result = [],
                i, tick;
            if (ticksLength > axisLength) { skipRatio = 1 + Math.floor(ticksLength / axisLength) }
            if (tickCount > maxTicks) { skipRatio = Math.max(skipRatio, 1 + Math.floor(tickCount / maxTicks)) }
            for (i = 0; i < tickCount; i++) {
                tick = ticks[i];
                if (skipRatio > 1 && i % skipRatio > 0) { delete tick.label }
                result.push(tick)
            }
            return result
        },
        _tickSize: function() {
            var me = this,
                isHorizontal = me.isHorizontal(),
                optionTicks = me.options.ticks.minor,
                rot = helpers$1.toRadians(me.labelRotation),
                cos = Math.abs(Math.cos(rot)),
                sin = Math.abs(Math.sin(rot)),
                padding = optionTicks.autoSkipPadding || 0,
                w = (me.longestLabelWidth + padding) || 0,
                tickFont = helpers$1.options._parseFont(optionTicks),
                h = (me._maxLabelLines * tickFont.lineHeight + padding) || 0;
            return isHorizontal ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin
        },
        _isVisible: function() {
            var me = this,
                chart = me.chart,
                display = me.options.display,
                i, ilen, meta;
            if (display !== 'auto') { return !!display }
            for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) { if (chart.isDatasetVisible(i)) { meta = chart.getDatasetMeta(i); if (meta.xAxisID === me.id || meta.yAxisID === me.id) { return true } } }
            return false
        },
        draw: function(chartArea) {
            var me = this,
                options = me.options;
            if (!me._isVisible()) { return }
            var chart = me.chart,
                context = me.ctx,
                globalDefaults = core_defaults.global,
                defaultFontColor = globalDefaults.defaultFontColor,
                optionTicks = options.ticks.minor,
                optionMajorTicks = options.ticks.major || optionTicks,
                gridLines = options.gridLines,
                scaleLabel = options.scaleLabel,
                position = options.position,
                isRotated = me.labelRotation !== 0,
                isMirrored = optionTicks.mirror,
                isHorizontal = me.isHorizontal(),
                parseFont = helpers$1.options._parseFont,
                ticks = optionTicks.display && optionTicks.autoSkip ? me._autoSkip(me.getTicks()) : me.getTicks(),
                tickFontColor = valueOrDefault$9(optionTicks.fontColor, defaultFontColor),
                tickFont = parseFont(optionTicks),
                lineHeight = tickFont.lineHeight,
                majorTickFontColor = valueOrDefault$9(optionMajorTicks.fontColor, defaultFontColor),
                majorTickFont = parseFont(optionMajorTicks),
                tickPadding = optionTicks.padding,
                labelOffset = optionTicks.labelOffset,
                tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0,
                scaleLabelFontColor = valueOrDefault$9(scaleLabel.fontColor, defaultFontColor),
                scaleLabelFont = parseFont(scaleLabel),
                scaleLabelPadding = helpers$1.options.toPadding(scaleLabel.padding),
                labelRotationRadians = helpers$1.toRadians(me.labelRotation),
                itemsToDraw = [],
                axisWidth = gridLines.drawBorder ? valueAtIndexOrDefault(gridLines.lineWidth, 0, 0) : 0,
                alignPixel = helpers$1._alignPixel,
                borderValue, tickStart, tickEnd;
            if (position === 'top') {
                borderValue = alignPixel(chart, me.bottom, axisWidth);
                tickStart = me.bottom - tl;
                tickEnd = borderValue - axisWidth / 2
            } else if (position === 'bottom') {
                borderValue = alignPixel(chart, me.top, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.top + tl
            } else if (position === 'left') {
                borderValue = alignPixel(chart, me.right, axisWidth);
                tickStart = me.right - tl;
                tickEnd = borderValue - axisWidth / 2
            } else {
                borderValue = alignPixel(chart, me.left, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.left + tl
            }
            var epsilon = 0.0000001;
            helpers$1.each(ticks, function(tick, index) {
                if (helpers$1.isNullOrUndef(tick.label)) { return }
                var label = tick.label,
                    lineWidth, lineColor, borderDash, borderDashOffset;
                if (index === me.zeroLineIndex && options.offset === gridLines.offsetGridLines) {
                    lineWidth = gridLines.zeroLineWidth;
                    lineColor = gridLines.zeroLineColor;
                    borderDash = gridLines.zeroLineBorderDash || [];
                    borderDashOffset = gridLines.zeroLineBorderDashOffset || 0.0
                } else {
                    lineWidth = valueAtIndexOrDefault(gridLines.lineWidth, index);
                    lineColor = valueAtIndexOrDefault(gridLines.color, index);
                    borderDash = gridLines.borderDash || [];
                    borderDashOffset = gridLines.borderDashOffset || 0.0
                }
                var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY, textOffset, textAlign, labelCount = helpers$1.isArray(label) ? label.length : 1,
                    lineValue = getPixelForGridLine(me, index, gridLines.offsetGridLines);
                if (isHorizontal) {
                    var labelYOffset = tl + tickPadding;
                    if (lineValue < me.left - epsilon) { lineColor = 'rgba(0,0,0,0)' }
                    tx1 = tx2 = x1 = x2 = alignPixel(chart, lineValue, lineWidth);
                    ty1 = tickStart;
                    ty2 = tickEnd;
                    labelX = me.getPixelForTick(index) + labelOffset;
                    if (position === 'top') {
                        y1 = alignPixel(chart, chartArea.top, axisWidth) + axisWidth / 2;
                        y2 = chartArea.bottom;
                        textOffset = ((!isRotated ? 0.5 : 1) - labelCount) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'left';
                        labelY = me.bottom - labelYOffset
                    } else {
                        y1 = chartArea.top;
                        y2 = alignPixel(chart, chartArea.bottom, axisWidth) - axisWidth / 2;
                        textOffset = (!isRotated ? 0.5 : 0) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'right';
                        labelY = me.top + labelYOffset
                    }
                } else {
                    var labelXOffset = (isMirrored ? 0 : tl) + tickPadding;
                    if (lineValue < me.top - epsilon) { lineColor = 'rgba(0,0,0,0)' }
                    tx1 = tickStart;
                    tx2 = tickEnd;
                    ty1 = ty2 = y1 = y2 = alignPixel(chart, lineValue, lineWidth);
                    labelY = me.getPixelForTick(index) + labelOffset;
                    textOffset = (1 - labelCount) * lineHeight / 2;
                    if (position === 'left') {
                        x1 = alignPixel(chart, chartArea.left, axisWidth) + axisWidth / 2;
                        x2 = chartArea.right;
                        textAlign = isMirrored ? 'left' : 'right';
                        labelX = me.right - labelXOffset
                    } else {
                        x1 = chartArea.left;
                        x2 = alignPixel(chart, chartArea.right, axisWidth) - axisWidth / 2;
                        textAlign = isMirrored ? 'right' : 'left';
                        labelX = me.left + labelXOffset
                    }
                }
                itemsToDraw.push({ tx1: tx1, ty1: ty1, tx2: tx2, ty2: ty2, x1: x1, y1: y1, x2: x2, y2: y2, labelX: labelX, labelY: labelY, glWidth: lineWidth, glColor: lineColor, glBorderDash: borderDash, glBorderDashOffset: borderDashOffset, rotation: -1 * labelRotationRadians, label: label, major: tick.major, textOffset: textOffset, textAlign: textAlign })
            });
            helpers$1.each(itemsToDraw, function(itemToDraw) {
                var glWidth = itemToDraw.glWidth,
                    glColor = itemToDraw.glColor;
                if (gridLines.display && glWidth && glColor) {
                    context.save();
                    context.lineWidth = glWidth;
                    context.strokeStyle = glColor;
                    if (context.setLineDash) {
                        context.setLineDash(itemToDraw.glBorderDash);
                        context.lineDashOffset = itemToDraw.glBorderDashOffset
                    }
                    context.beginPath();
                    if (gridLines.drawTicks) {
                        context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
                        context.lineTo(itemToDraw.tx2, itemToDraw.ty2)
                    }
                    if (gridLines.drawOnChartArea) {
                        context.moveTo(itemToDraw.x1, itemToDraw.y1);
                        context.lineTo(itemToDraw.x2, itemToDraw.y2)
                    }
                    context.stroke();
                    context.restore()
                }
                if (optionTicks.display) {
                    context.save();
                    context.translate(itemToDraw.labelX, itemToDraw.labelY);
                    context.rotate(itemToDraw.rotation);
                    context.font = itemToDraw.major ? majorTickFont.string : tickFont.string;
                    context.fillStyle = itemToDraw.major ? majorTickFontColor : tickFontColor;
                    context.textBaseline = 'middle';
                    context.textAlign = itemToDraw.textAlign;
                    var label = itemToDraw.label,
                        y = itemToDraw.textOffset;
                    if (helpers$1.isArray(label)) {
                        for (var i = 0; i < label.length; ++i) {
                            context.fillText('' + label[i], 0, y);
                            y += lineHeight
                        }
                    } else { context.fillText(label, 0, y) }
                    context.restore()
                }
            });
            if (scaleLabel.display) {
                var scaleLabelX, scaleLabelY, rotation = 0,
                    halfLineHeight = scaleLabelFont.lineHeight / 2;
                if (isHorizontal) {
                    scaleLabelX = me.left + ((me.right - me.left) / 2);
                    scaleLabelY = position === 'bottom' ? me.bottom - halfLineHeight - scaleLabelPadding.bottom : me.top + halfLineHeight + scaleLabelPadding.top
                } else {
                    var isLeft = position === 'left';
                    scaleLabelX = isLeft ? me.left + halfLineHeight + scaleLabelPadding.top : me.right - halfLineHeight - scaleLabelPadding.top;
                    scaleLabelY = me.top + ((me.bottom - me.top) / 2);
                    rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI
                }
                context.save();
                context.translate(scaleLabelX, scaleLabelY);
                context.rotate(rotation);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = scaleLabelFontColor;
                context.font = scaleLabelFont.string;
                context.fillText(scaleLabel.labelString, 0, 0);
                context.restore()
            }
            if (axisWidth) {
                var firstLineWidth = axisWidth,
                    lastLineWidth = valueAtIndexOrDefault(gridLines.lineWidth, ticks.length - 1, 0),
                    x1, x2, y1, y2;
                if (isHorizontal) {
                    x1 = alignPixel(chart, me.left, firstLineWidth) - firstLineWidth / 2;
                    x2 = alignPixel(chart, me.right, lastLineWidth) + lastLineWidth / 2;
                    y1 = y2 = borderValue
                } else {
                    y1 = alignPixel(chart, me.top, firstLineWidth) - firstLineWidth / 2;
                    y2 = alignPixel(chart, me.bottom, lastLineWidth) + lastLineWidth / 2;
                    x1 = x2 = borderValue
                }
                context.lineWidth = axisWidth;
                context.strokeStyle = valueAtIndexOrDefault(gridLines.color, 0);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke()
            }
        }
    });
    var defaultConfig = { position: 'bottom' };
    var scale_category = core_scale.extend({
        getLabels: function() { var data = this.chart.data; return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels },
        determineDataLimits: function() {
            var me = this,
                labels = me.getLabels();
            me.minIndex = 0;
            me.maxIndex = labels.length - 1;
            var findIndex;
            if (me.options.ticks.min !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.min);
                me.minIndex = findIndex !== -1 ? findIndex : me.minIndex
            }
            if (me.options.ticks.max !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.max);
                me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex
            }
            me.min = labels[me.minIndex];
            me.max = labels[me.maxIndex]
        },
        buildTicks: function() {
            var me = this,
                labels = me.getLabels();
            me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1)
        },
        getLabelForIndex: function(index, datasetIndex) {
            var me = this,
                chart = me.chart;
            if (chart.getDatasetMeta(datasetIndex).controller._getValueScaleId() === me.id) { return me.getRightValue(chart.data.datasets[datasetIndex].data[index]) }
            return me.ticks[index - me.minIndex]
        },
        getPixelForValue: function(value, index) {
            var me = this,
                offset = me.options.offset,
                offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1)), 1),
                valueCategory;
            if (value !== undefined && value !== null) { valueCategory = me.isHorizontal() ? value.x : value.y }
            if (valueCategory !== undefined || (value !== undefined && isNaN(index))) {
                var labels = me.getLabels();
                value = valueCategory || value;
                var idx = labels.indexOf(value);
                index = idx !== -1 ? idx : index
            }
            if (me.isHorizontal()) {
                var valueWidth = me.width / offsetAmt,
                    widthOffset = (valueWidth * (index - me.minIndex));
                if (offset) { widthOffset += (valueWidth / 2) }
                return me.left + widthOffset
            }
            var valueHeight = me.height / offsetAmt,
                heightOffset = (valueHeight * (index - me.minIndex));
            if (offset) { heightOffset += (valueHeight / 2) }
            return me.top + heightOffset
        },
        getPixelForTick: function(index) { return this.getPixelForValue(this.ticks[index], index + this.minIndex, null) },
        getValueForPixel: function(pixel) {
            var me = this,
                offset = me.options.offset,
                value, offsetAmt = Math.max((me._ticks.length - (offset ? 0 : 1)), 1),
                horz = me.isHorizontal(),
                valueDimension = (horz ? me.width : me.height) / offsetAmt;
            pixel -= horz ? me.left : me.top;
            if (offset) { pixel -= (valueDimension / 2) }
            if (pixel <= 0) { value = 0 } else { value = Math.round(pixel / valueDimension) }
            return value + me.minIndex
        },
        getBasePixel: function() { return this.bottom }
    });
    var _defaults = defaultConfig;
    scale_category._defaults = _defaults;
    var noop = helpers$1.noop,
        isNullOrUndef = helpers$1.isNullOrUndef;

    function generateTicks(generationOptions, dataRange) {
        var ticks = [],
            MIN_SPACING = 1e-14,
            stepSize = generationOptions.stepSize,
            unit = stepSize || 1,
            maxNumSpaces = generationOptions.maxTicks - 1,
            min = generationOptions.min,
            max = generationOptions.max,
            precision = generationOptions.precision,
            rmin = dataRange.min,
            rmax = dataRange.max,
            spacing = helpers$1.niceNum((rmax - rmin) / maxNumSpaces / unit) * unit,
            factor, niceMin, niceMax, numSpaces;
        if (spacing < MIN_SPACING && isNullOrUndef(min) && isNullOrUndef(max)) { return [rmin, rmax] }
        numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
        if (numSpaces > maxNumSpaces) { spacing = helpers$1.niceNum(numSpaces * spacing / maxNumSpaces / unit) * unit }
        if (stepSize || isNullOrUndef(precision)) { factor = Math.pow(10, helpers$1._decimalPlaces(spacing)) } else {
            factor = Math.pow(10, precision);
            spacing = Math.ceil(spacing * factor) / factor
        }
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
        if (stepSize) { if (!isNullOrUndef(min) && helpers$1.almostWhole(min / spacing, spacing / 1000)) { niceMin = min } if (!isNullOrUndef(max) && helpers$1.almostWhole(max / spacing, spacing / 1000)) { niceMax = max } }
        numSpaces = (niceMax - niceMin) / spacing;
        if (helpers$1.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) { numSpaces = Math.round(numSpaces) } else { numSpaces = Math.ceil(numSpaces) }
        niceMin = Math.round(niceMin * factor) / factor;
        niceMax = Math.round(niceMax * factor) / factor;
        ticks.push(isNullOrUndef(min) ? niceMin : min);
        for (var j = 1; j < numSpaces; ++j) { ticks.push(Math.round((niceMin + j * spacing) * factor) / factor) }
        ticks.push(isNullOrUndef(max) ? niceMax : max);
        return ticks
    }
    var scale_linearbase = core_scale.extend({
        getRightValue: function(value) { if (typeof value === 'string') { return +value } return core_scale.prototype.getRightValue.call(this, value) },
        handleTickRangeOptions: function() {
            var me = this,
                opts = me.options,
                tickOpts = opts.ticks;
            if (tickOpts.beginAtZero) {
                var minSign = helpers$1.sign(me.min),
                    maxSign = helpers$1.sign(me.max);
                if (minSign < 0 && maxSign < 0) { me.max = 0 } else if (minSign > 0 && maxSign > 0) { me.min = 0 }
            }
            var setMin = tickOpts.min !== undefined || tickOpts.suggestedMin !== undefined,
                setMax = tickOpts.max !== undefined || tickOpts.suggestedMax !== undefined;
            if (tickOpts.min !== undefined) { me.min = tickOpts.min } else if (tickOpts.suggestedMin !== undefined) { if (me.min === null) { me.min = tickOpts.suggestedMin } else { me.min = Math.min(me.min, tickOpts.suggestedMin) } }
            if (tickOpts.max !== undefined) { me.max = tickOpts.max } else if (tickOpts.suggestedMax !== undefined) { if (me.max === null) { me.max = tickOpts.suggestedMax } else { me.max = Math.max(me.max, tickOpts.suggestedMax) } }
            if (setMin !== setMax) { if (me.min >= me.max) { if (setMin) { me.max = me.min + 1 } else { me.min = me.max - 1 } } }
            if (me.min === me.max) { me.max++; if (!tickOpts.beginAtZero) { me.min-- } }
        },
        getTickLimit: function() {
            var me = this,
                tickOpts = me.options.ticks,
                stepSize = tickOpts.stepSize,
                maxTicksLimit = tickOpts.maxTicksLimit,
                maxTicks;
            if (stepSize) { maxTicks = Math.ceil(me.max / stepSize) - Math.floor(me.min / stepSize) + 1 } else {
                maxTicks = me._computeTickLimit();
                maxTicksLimit = maxTicksLimit || 11
            }
            if (maxTicksLimit) { maxTicks = Math.min(maxTicksLimit, maxTicks) }
            return maxTicks
        },
        _computeTickLimit: function() { return Number.POSITIVE_INFINITY },
        handleDirectionalChanges: noop,
        buildTicks: function() {
            var me = this,
                opts = me.options,
                tickOpts = opts.ticks,
                maxTicks = me.getTickLimit();
            maxTicks = Math.max(2, maxTicks);
            var numericGeneratorOptions = { maxTicks: maxTicks, min: tickOpts.min, max: tickOpts.max, precision: tickOpts.precision, stepSize: helpers$1.valueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize) };
            var ticks = me.ticks = generateTicks(numericGeneratorOptions, me);
            me.handleDirectionalChanges();
            me.max = helpers$1.max(ticks);
            me.min = helpers$1.min(ticks);
            if (tickOpts.reverse) {
                ticks.reverse();
                me.start = me.max;
                me.end = me.min
            } else {
                me.start = me.min;
                me.end = me.max
            }
        },
        convertTicksToLabels: function() {
            var me = this;
            me.ticksAsNumbers = me.ticks.slice();
            me.zeroLineIndex = me.ticks.indexOf(0);
            core_scale.prototype.convertTicksToLabels.call(me)
        }
    });
    var defaultConfig$1 = { position: 'left', ticks: { callback: core_ticks.formatters.linear } };
    var scale_linear = scale_linearbase.extend({
        determineDataLimits: function() {
            var me = this,
                opts = me.options,
                chart = me.chart,
                data = chart.data,
                datasets = data.datasets,
                isHorizontal = me.isHorizontal(),
                DEFAULT_MIN = 0,
                DEFAULT_MAX = 1;

            function IDMatches(meta) { return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id }
            me.min = null;
            me.max = null;
            var hasStacks = opts.stacked;
            if (hasStacks === undefined) { helpers$1.each(datasets, function(dataset, datasetIndex) { if (hasStacks) { return } var meta = chart.getDatasetMeta(datasetIndex); if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) && meta.stack !== undefined) { hasStacks = true } }) }
            if (opts.stacked || hasStacks) {
                var valuesPerStack = {};
                helpers$1.each(datasets, function(dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex),
                        key = [meta.type, ((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''), meta.stack].join('.');
                    if (valuesPerStack[key] === undefined) { valuesPerStack[key] = { positiveValues: [], negativeValues: [] } }
                    var positiveValues = valuesPerStack[key].positiveValues,
                        negativeValues = valuesPerStack[key].negativeValues;
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers$1.each(dataset.data, function(rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden) { return }
                            positiveValues[index] = positiveValues[index] || 0;
                            negativeValues[index] = negativeValues[index] || 0;
                            if (opts.relativePoints) { positiveValues[index] = 100 } else if (value < 0) { negativeValues[index] += value } else { positiveValues[index] += value }
                        })
                    }
                });
                helpers$1.each(valuesPerStack, function(valuesForType) {
                    var values = valuesForType.positiveValues.concat(valuesForType.negativeValues),
                        minVal = helpers$1.min(values),
                        maxVal = helpers$1.max(values);
                    me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                    me.max = me.max === null ? maxVal : Math.max(me.max, maxVal)
                })
            } else { helpers$1.each(datasets, function(dataset, datasetIndex) { var meta = chart.getDatasetMeta(datasetIndex); if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) { helpers$1.each(dataset.data, function(rawValue, index) { var value = +me.getRightValue(rawValue); if (isNaN(value) || meta.data[index].hidden) { return } if (me.min === null) { me.min = value } else if (value < me.min) { me.min = value } if (me.max === null) { me.max = value } else if (value > me.max) { me.max = value } }) } }) }
            me.min = isFinite(me.min) && !isNaN(me.min) ? me.min : DEFAULT_MIN;
            me.max = isFinite(me.max) && !isNaN(me.max) ? me.max : DEFAULT_MAX;
            this.handleTickRangeOptions()
        },
        _computeTickLimit: function() {
            var me = this,
                tickFont;
            if (me.isHorizontal()) { return Math.ceil(me.width / 40) }
            tickFont = helpers$1.options._parseFont(me.options.ticks);
            return Math.ceil(me.height / tickFont.lineHeight)
        },
        handleDirectionalChanges: function() { if (!this.isHorizontal()) { this.ticks.reverse() } },
        getLabelForIndex: function(index, datasetIndex) { return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]) },
        getPixelForValue: function(value) {
            var me = this,
                start = me.start,
                rightValue = +me.getRightValue(value),
                pixel, range = me.end - start;
            if (me.isHorizontal()) { pixel = me.left + (me.width / range * (rightValue - start)) } else { pixel = me.bottom - (me.height / range * (rightValue - start)) }
            return pixel
        },
        getValueForPixel: function(pixel) {
            var me = this,
                isHorizontal = me.isHorizontal(),
                innerDimension = isHorizontal ? me.width : me.height,
                offset = (isHorizontal ? pixel - me.left : me.bottom - pixel) / innerDimension;
            return me.start + ((me.end - me.start) * offset)
        },
        getPixelForTick: function(index) { return this.getPixelForValue(this.ticksAsNumbers[index]) }
    });
    var _defaults$1 = defaultConfig$1;
    scale_linear._defaults = _defaults$1;
    var valueOrDefault$a = helpers$1.valueOrDefault;

    function generateTicks$1(generationOptions, dataRange) {
        var ticks = [],
            tickVal = valueOrDefault$a(generationOptions.min, Math.pow(10, Math.floor(helpers$1.log10(dataRange.min)))),
            endExp = Math.floor(helpers$1.log10(dataRange.max)),
            endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp)),
            exp, significand;
        if (tickVal === 0) {
            exp = Math.floor(helpers$1.log10(dataRange.minNotZero));
            significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));
            ticks.push(tickVal);
            tickVal = significand * Math.pow(10, exp)
        } else {
            exp = Math.floor(helpers$1.log10(tickVal));
            significand = Math.floor(tickVal / Math.pow(10, exp))
        }
        var precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
        do {
            ticks.push(tickVal);
            ++significand;
            if (significand === 10) {
                significand = 1;
                ++exp;
                precision = exp >= 0 ? 1 : precision
            }
            tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision
        } while (exp < endExp || (exp === endExp && significand < endSignificand));
        var lastTick = valueOrDefault$a(generationOptions.max, tickVal);
        ticks.push(lastTick);
        return ticks
    }
    var defaultConfig$2 = { position: 'left', ticks: { callback: core_ticks.formatters.logarithmic } };

    function nonNegativeOrDefault(value, defaultValue) { return helpers$1.isFinite(value) && value >= 0 ? value : defaultValue }
    var scale_logarithmic = core_scale.extend({
        determineDataLimits: function() {
            var me = this,
                opts = me.options,
                chart = me.chart,
                data = chart.data,
                datasets = data.datasets,
                isHorizontal = me.isHorizontal();

            function IDMatches(meta) { return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id }
            me.min = null;
            me.max = null;
            me.minNotZero = null;
            var hasStacks = opts.stacked;
            if (hasStacks === undefined) { helpers$1.each(datasets, function(dataset, datasetIndex) { if (hasStacks) { return } var meta = chart.getDatasetMeta(datasetIndex); if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) && meta.stack !== undefined) { hasStacks = true } }) }
            if (opts.stacked || hasStacks) {
                var valuesPerStack = {};
                helpers$1.each(datasets, function(dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex),
                        key = [meta.type, ((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''), meta.stack].join('.');
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        if (valuesPerStack[key] === undefined) { valuesPerStack[key] = [] }
                        helpers$1.each(dataset.data, function(rawValue, index) {
                            var values = valuesPerStack[key],
                                value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden || value < 0) { return }
                            values[index] = values[index] || 0;
                            values[index] += value
                        })
                    }
                });
                helpers$1.each(valuesPerStack, function(valuesForType) {
                    if (valuesForType.length > 0) {
                        var minVal = helpers$1.min(valuesForType),
                            maxVal = helpers$1.max(valuesForType);
                        me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                        me.max = me.max === null ? maxVal : Math.max(me.max, maxVal)
                    }
                })
            } else { helpers$1.each(datasets, function(dataset, datasetIndex) { var meta = chart.getDatasetMeta(datasetIndex); if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) { helpers$1.each(dataset.data, function(rawValue, index) { var value = +me.getRightValue(rawValue); if (isNaN(value) || meta.data[index].hidden || value < 0) { return } if (me.min === null) { me.min = value } else if (value < me.min) { me.min = value } if (me.max === null) { me.max = value } else if (value > me.max) { me.max = value } if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) { me.minNotZero = value } }) } }) }
            this.handleTickRangeOptions()
        },
        handleTickRangeOptions: function() {
            var me = this,
                tickOpts = me.options.ticks,
                DEFAULT_MIN = 1,
                DEFAULT_MAX = 10;
            me.min = nonNegativeOrDefault(tickOpts.min, me.min);
            me.max = nonNegativeOrDefault(tickOpts.max, me.max);
            if (me.min === me.max) {
                if (me.min !== 0 && me.min !== null) {
                    me.min = Math.pow(10, Math.floor(helpers$1.log10(me.min)) - 1);
                    me.max = Math.pow(10, Math.floor(helpers$1.log10(me.max)) + 1)
                } else {
                    me.min = DEFAULT_MIN;
                    me.max = DEFAULT_MAX
                }
            }
            if (me.min === null) { me.min = Math.pow(10, Math.floor(helpers$1.log10(me.max)) - 1) }
            if (me.max === null) { me.max = me.min !== 0 ? Math.pow(10, Math.floor(helpers$1.log10(me.min)) + 1) : DEFAULT_MAX }
            if (me.minNotZero === null) { if (me.min > 0) { me.minNotZero = me.min } else if (me.max < 1) { me.minNotZero = Math.pow(10, Math.floor(helpers$1.log10(me.max))) } else { me.minNotZero = DEFAULT_MIN } }
        },
        buildTicks: function() {
            var me = this,
                tickOpts = me.options.ticks,
                reverse = !me.isHorizontal(),
                generationOptions = { min: nonNegativeOrDefault(tickOpts.min), max: nonNegativeOrDefault(tickOpts.max) };
            var ticks = me.ticks = generateTicks$1(generationOptions, me);
            me.max = helpers$1.max(ticks);
            me.min = helpers$1.min(ticks);
            if (tickOpts.reverse) {
                reverse = !reverse;
                me.start = me.max;
                me.end = me.min
            } else {
                me.start = me.min;
                me.end = me.max
            }
            if (reverse) { ticks.reverse() }
        },
        convertTicksToLabels: function() {
            this.tickValues = this.ticks.slice();
            core_scale.prototype.convertTicksToLabels.call(this)
        },
        getLabelForIndex: function(index, datasetIndex) { return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]) },
        getPixelForTick: function(index) { return this.getPixelForValue(this.tickValues[index]) },
        _getFirstTickValue: function(value) {
            var exp = Math.floor(helpers$1.log10(value)),
                significand = Math.floor(value / Math.pow(10, exp));
            return significand * Math.pow(10, exp)
        },
        getPixelForValue: function(value) {
            var me = this,
                tickOpts = me.options.ticks,
                reverse = tickOpts.reverse,
                log10 = helpers$1.log10,
                firstTickValue = me._getFirstTickValue(me.minNotZero),
                offset = 0,
                innerDimension, pixel, start, end, sign;
            value = +me.getRightValue(value);
            if (reverse) {
                start = me.end;
                end = me.start;
                sign = -1
            } else {
                start = me.start;
                end = me.end;
                sign = 1
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                pixel = reverse ? me.right : me.left
            } else {
                innerDimension = me.height;
                sign *= -1;
                pixel = reverse ? me.top : me.bottom
            }
            if (value !== start) {
                if (start === 0) {
                    offset = valueOrDefault$a(tickOpts.fontSize, core_defaults.global.defaultFontSize);
                    innerDimension -= offset;
                    start = firstTickValue
                }
                if (value !== 0) { offset += innerDimension / (log10(end) - log10(start)) * (log10(value) - log10(start)) }
                pixel += sign * offset
            }
            return pixel
        },
        getValueForPixel: function(pixel) {
            var me = this,
                tickOpts = me.options.ticks,
                reverse = tickOpts.reverse,
                log10 = helpers$1.log10,
                firstTickValue = me._getFirstTickValue(me.minNotZero),
                innerDimension, start, end, value;
            if (reverse) {
                start = me.end;
                end = me.start
            } else {
                start = me.start;
                end = me.end
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                value = reverse ? me.right - pixel : pixel - me.left
            } else {
                innerDimension = me.height;
                value = reverse ? pixel - me.top : me.bottom - pixel
            }
            if (value !== start) {
                if (start === 0) {
                    var offset = valueOrDefault$a(tickOpts.fontSize, core_defaults.global.defaultFontSize);
                    value -= offset;
                    innerDimension -= offset;
                    start = firstTickValue
                }
                value *= log10(end) - log10(start);
                value /= innerDimension;
                value = Math.pow(10, log10(start) + value)
            }
            return value
        }
    });
    var _defaults$2 = defaultConfig$2;
    scale_logarithmic._defaults = _defaults$2;
    var valueOrDefault$b = helpers$1.valueOrDefault,
        valueAtIndexOrDefault$1 = helpers$1.valueAtIndexOrDefault,
        resolve$7 = helpers$1.options.resolve,
        defaultConfig$3 = { display: true, animate: true, position: 'chartArea', angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1, borderDash: [], borderDashOffset: 0.0 }, gridLines: { circular: false }, ticks: { showLabelBackdrop: true, backdropColor: 'rgba(255,255,255,0.75)', backdropPaddingY: 2, backdropPaddingX: 2, callback: core_ticks.formatters.linear }, pointLabels: { display: true, fontSize: 10, callback: function(label) { return label } } };

    function getValueCount(scale) { var opts = scale.options; return opts.angleLines.display || opts.pointLabels.display ? scale.chart.data.labels.length : 0 }

    function getTickBackdropHeight(opts) { var tickOpts = opts.ticks; if (tickOpts.display && opts.display) { return valueOrDefault$b(tickOpts.fontSize, core_defaults.global.defaultFontSize) + tickOpts.backdropPaddingY * 2 } return 0 }

    function measureLabelSize(ctx, lineHeight, label) { if (helpers$1.isArray(label)) { return { w: helpers$1.longestText(ctx, ctx.font, label), h: label.length * lineHeight } } return { w: ctx.measureText(label).width, h: lineHeight } }

    function determineLimits(angle, pos, size, min, max) { if (angle === min || angle === max) { return { start: pos - (size / 2), end: pos + (size / 2) } } else if (angle < min || angle > max) { return { start: pos - size, end: pos } } return { start: pos, end: pos + size } }

    function fitWithPointLabels(scale) {
        var plFont = helpers$1.options._parseFont(scale.options.pointLabels),
            furthestLimits = { l: 0, r: scale.width, t: 0, b: scale.height - scale.paddingTop };
        var furthestAngles = {},
            i, textSize, pointPosition;
        scale.ctx.font = plFont.string;
        scale._pointLabelSizes = [];
        var valueCount = getValueCount(scale);
        for (i = 0; i < valueCount; i++) {
            pointPosition = scale.getPointPosition(i, scale.drawingArea + 5);
            textSize = measureLabelSize(scale.ctx, plFont.lineHeight, scale.pointLabels[i] || '');
            scale._pointLabelSizes[i] = textSize;
            var angleRadians = scale.getIndexAngle(i),
                angle = helpers$1.toDegrees(angleRadians) % 360,
                hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180),
                vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
            if (hLimits.start < furthestLimits.l) {
                furthestLimits.l = hLimits.start;
                furthestAngles.l = angleRadians
            }
            if (hLimits.end > furthestLimits.r) {
                furthestLimits.r = hLimits.end;
                furthestAngles.r = angleRadians
            }
            if (vLimits.start < furthestLimits.t) {
                furthestLimits.t = vLimits.start;
                furthestAngles.t = angleRadians
            }
            if (vLimits.end > furthestLimits.b) {
                furthestLimits.b = vLimits.end;
                furthestAngles.b = angleRadians
            }
        }
        scale.setReductions(scale.drawingArea, furthestLimits, furthestAngles)
    }

    function getTextAlignForAngle(angle) { if (angle === 0 || angle === 180) { return 'center' } else if (angle < 180) { return 'left' } return 'right' }

    function fillText(ctx, text, position, lineHeight) {
        var y = position.y + lineHeight / 2,
            i, ilen;
        if (helpers$1.isArray(text)) {
            for (i = 0, ilen = text.length; i < ilen; ++i) {
                ctx.fillText(text[i], position.x, y);
                y += lineHeight
            }
        } else { ctx.fillText(text, position.x, y) }
    }

    function adjustPointPositionForLabelHeight(angle, textSize, position) { if (angle === 90 || angle === 270) { position.y -= (textSize.h / 2) } else if (angle > 270 || angle < 90) { position.y -= textSize.h } }

    function drawPointLabels(scale) {
        var ctx = scale.ctx,
            opts = scale.options,
            angleLineOpts = opts.angleLines,
            gridLineOpts = opts.gridLines,
            pointLabelOpts = opts.pointLabels,
            lineWidth = valueOrDefault$b(angleLineOpts.lineWidth, gridLineOpts.lineWidth),
            lineColor = valueOrDefault$b(angleLineOpts.color, gridLineOpts.color),
            tickBackdropHeight = getTickBackdropHeight(opts);
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        if (ctx.setLineDash) {
            ctx.setLineDash(resolve$7([angleLineOpts.borderDash, gridLineOpts.borderDash, []]));
            ctx.lineDashOffset = resolve$7([angleLineOpts.borderDashOffset, gridLineOpts.borderDashOffset, 0.0])
        }
        var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max),
            plFont = helpers$1.options._parseFont(pointLabelOpts);
        ctx.font = plFont.string;
        ctx.textBaseline = 'middle';
        for (var i = getValueCount(scale) - 1; i >= 0; i--) {
            if (angleLineOpts.display && lineWidth && lineColor) {
                var outerPosition = scale.getPointPosition(i, outerDistance);
                ctx.beginPath();
                ctx.moveTo(scale.xCenter, scale.yCenter);
                ctx.lineTo(outerPosition.x, outerPosition.y);
                ctx.stroke()
            }
            if (pointLabelOpts.display) {
                var extra = (i === 0 ? tickBackdropHeight / 2 : 0),
                    pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + 5),
                    pointLabelFontColor = valueAtIndexOrDefault$1(pointLabelOpts.fontColor, i, core_defaults.global.defaultFontColor);
                ctx.fillStyle = pointLabelFontColor;
                var angleRadians = scale.getIndexAngle(i),
                    angle = helpers$1.toDegrees(angleRadians);
                ctx.textAlign = getTextAlignForAngle(angle);
                adjustPointPositionForLabelHeight(angle, scale._pointLabelSizes[i], pointLabelPosition);
                fillText(ctx, scale.pointLabels[i] || '', pointLabelPosition, plFont.lineHeight)
            }
        }
        ctx.restore()
    }

    function drawRadiusLine(scale, gridLineOpts, radius, index) {
        var ctx = scale.ctx,
            circular = gridLineOpts.circular,
            valueCount = getValueCount(scale),
            lineColor = valueAtIndexOrDefault$1(gridLineOpts.color, index - 1),
            lineWidth = valueAtIndexOrDefault$1(gridLineOpts.lineWidth, index - 1),
            pointPosition;
        if ((!circular && !valueCount) || !lineColor || !lineWidth) { return }
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        if (ctx.setLineDash) {
            ctx.setLineDash(gridLineOpts.borderDash || []);
            ctx.lineDashOffset = gridLineOpts.borderDashOffset || 0.0
        }
        ctx.beginPath();
        if (circular) { ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2) } else {
            pointPosition = scale.getPointPosition(0, radius);
            ctx.moveTo(pointPosition.x, pointPosition.y);
            for (var i = 1; i < valueCount; i++) {
                pointPosition = scale.getPointPosition(i, radius);
                ctx.lineTo(pointPosition.x, pointPosition.y)
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore()
    }

    function numberOrZero(param) { return helpers$1.isNumber(param) ? param : 0 }
    var scale_radialLinear = scale_linearbase.extend({
        setDimensions: function() {
            var me = this;
            me.width = me.maxWidth;
            me.height = me.maxHeight;
            me.paddingTop = getTickBackdropHeight(me.options) / 2;
            me.xCenter = Math.floor(me.width / 2);
            me.yCenter = Math.floor((me.height - me.paddingTop) / 2);
            me.drawingArea = Math.min(me.height - me.paddingTop, me.width) / 2
        },
        determineDataLimits: function() {
            var me = this,
                chart = me.chart,
                min = Number.POSITIVE_INFINITY,
                max = Number.NEGATIVE_INFINITY;
            helpers$1.each(chart.data.datasets, function(dataset, datasetIndex) {
                if (chart.isDatasetVisible(datasetIndex)) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    helpers$1.each(dataset.data, function(rawValue, index) {
                        var value = +me.getRightValue(rawValue);
                        if (isNaN(value) || meta.data[index].hidden) { return }
                        min = Math.min(value, min);
                        max = Math.max(value, max)
                    })
                }
            });
            me.min = (min === Number.POSITIVE_INFINITY ? 0 : min);
            me.max = (max === Number.NEGATIVE_INFINITY ? 0 : max);
            me.handleTickRangeOptions()
        },
        _computeTickLimit: function() { return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options)) },
        convertTicksToLabels: function() {
            var me = this;
            scale_linearbase.prototype.convertTicksToLabels.call(me);
            me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me)
        },
        getLabelForIndex: function(index, datasetIndex) { return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]) },
        fit: function() {
            var me = this,
                opts = me.options;
            if (opts.display && opts.pointLabels.display) { fitWithPointLabels(me) } else { me.setCenterPoint(0, 0, 0, 0) }
        },
        setReductions: function(largestPossibleRadius, furthestLimits, furthestAngles) {
            var me = this,
                radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l),
                radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r),
                radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t),
                radiusReductionBottom = -Math.max(furthestLimits.b - (me.height - me.paddingTop), 0) / Math.cos(furthestAngles.b);
            radiusReductionLeft = numberOrZero(radiusReductionLeft);
            radiusReductionRight = numberOrZero(radiusReductionRight);
            radiusReductionTop = numberOrZero(radiusReductionTop);
            radiusReductionBottom = numberOrZero(radiusReductionBottom);
            me.drawingArea = Math.min(Math.floor(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2), Math.floor(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2));
            me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom)
        },
        setCenterPoint: function(leftMovement, rightMovement, topMovement, bottomMovement) {
            var me = this,
                maxRight = me.width - rightMovement - me.drawingArea,
                maxLeft = leftMovement + me.drawingArea,
                maxTop = topMovement + me.drawingArea,
                maxBottom = (me.height - me.paddingTop) - bottomMovement - me.drawingArea;
            me.xCenter = Math.floor(((maxLeft + maxRight) / 2) + me.left);
            me.yCenter = Math.floor(((maxTop + maxBottom) / 2) + me.top + me.paddingTop)
        },
        getIndexAngle: function(index) {
            var angleMultiplier = (Math.PI * 2) / getValueCount(this),
                startAngle = this.chart.options && this.chart.options.startAngle ? this.chart.options.startAngle : 0,
                startAngleRadians = startAngle * Math.PI * 2 / 360;
            return index * angleMultiplier + startAngleRadians
        },
        getDistanceFromCenterForValue: function(value) { var me = this; if (value === null) { return 0 } var scalingFactor = me.drawingArea / (me.max - me.min); if (me.options.ticks.reverse) { return (me.max - value) * scalingFactor } return (value - me.min) * scalingFactor },
        getPointPosition: function(index, distanceFromCenter) {
            var me = this,
                thisAngle = me.getIndexAngle(index) - (Math.PI / 2);
            return { x: Math.cos(thisAngle) * distanceFromCenter + me.xCenter, y: Math.sin(thisAngle) * distanceFromCenter + me.yCenter }
        },
        getPointPositionForValue: function(index, value) { return this.getPointPosition(index, this.getDistanceFromCenterForValue(value)) },
        getBasePosition: function() {
            var me = this,
                min = me.min,
                max = me.max;
            return me.getPointPositionForValue(0, me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0)
        },
        draw: function() {
            var me = this,
                opts = me.options,
                gridLineOpts = opts.gridLines,
                tickOpts = opts.ticks;
            if (opts.display) {
                var ctx = me.ctx,
                    startAngle = this.getIndexAngle(0),
                    tickFont = helpers$1.options._parseFont(tickOpts);
                if (opts.angleLines.display || opts.pointLabels.display) { drawPointLabels(me) }
                helpers$1.each(me.ticks, function(label, index) {
                    if (index > 0 || tickOpts.reverse) {
                        var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
                        if (gridLineOpts.display && index !== 0) { drawRadiusLine(me, gridLineOpts, yCenterOffset, index) }
                        if (tickOpts.display) {
                            var tickFontColor = valueOrDefault$b(tickOpts.fontColor, core_defaults.global.defaultFontColor);
                            ctx.font = tickFont.string;
                            ctx.save();
                            ctx.translate(me.xCenter, me.yCenter);
                            ctx.rotate(startAngle);
                            if (tickOpts.showLabelBackdrop) {
                                var labelWidth = ctx.measureText(label).width;
                                ctx.fillStyle = tickOpts.backdropColor;
                                ctx.fillRect(-labelWidth / 2 - tickOpts.backdropPaddingX, -yCenterOffset - tickFont.size / 2 - tickOpts.backdropPaddingY, labelWidth + tickOpts.backdropPaddingX * 2, tickFont.size + tickOpts.backdropPaddingY * 2)
                            }
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = tickFontColor;
                            ctx.fillText(label, 0, -yCenterOffset);
                            ctx.restore()
                        }
                    }
                })
            }
        }
    });
    var _defaults$3 = defaultConfig$3;
    scale_radialLinear._defaults = _defaults$3;
    var valueOrDefault$c = helpers$1.valueOrDefault,
        MIN_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991,
        MAX_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991,
        INTERVALS = { millisecond: { common: true, size: 1, steps: [1, 2, 5, 10, 20, 50, 100, 250, 500] }, second: { common: true, size: 1000, steps: [1, 2, 5, 10, 15, 30] }, minute: { common: true, size: 60000, steps: [1, 2, 5, 10, 15, 30] }, hour: { common: true, size: 3600000, steps: [1, 2, 3, 6, 12] }, day: { common: true, size: 86400000, steps: [1, 2, 5] }, week: { common: false, size: 604800000, steps: [1, 2, 3, 4] }, month: { common: true, size: 2.628e9, steps: [1, 2, 3] }, quarter: { common: false, size: 7.884e9, steps: [1, 2, 3, 4] }, year: { common: true, size: 3.154e10 } };
    var UNITS = Object.keys(INTERVALS);

    function sorter(a, b) { return a - b }

    function arrayUnique(items) {
        var hash = {},
            out = [],
            i, ilen, item;
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            item = items[i];
            if (!hash[item]) {
                hash[item] = true;
                out.push(item)
            }
        }
        return out
    }

    function buildLookupTable(timestamps, min, max, distribution) {
        if (distribution === 'linear' || !timestamps.length) { return [{ time: min, pos: 0 }, { time: max, pos: 1 }] }
        var table = [],
            items = [min],
            i, ilen, prev, curr, next;
        for (i = 0, ilen = timestamps.length; i < ilen; ++i) { curr = timestamps[i]; if (curr > min && curr < max) { items.push(curr) } }
        items.push(max);
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (prev === undefined || next === undefined || Math.round((next + prev) / 2) !== curr) { table.push({ time: curr, pos: i / (ilen - 1) }) }
        }
        return table
    }

    function lookup(table, key, value) {
        var lo = 0,
            hi = table.length - 1,
            mid, i0, i1;
        while (lo >= 0 && lo <= hi) {
            mid = (lo + hi) >> 1;
            i0 = table[mid - 1] || null;
            i1 = table[mid];
            if (!i0) { return { lo: null, hi: i1 } } else if (i1[key] < value) { lo = mid + 1 } else if (i0[key] > value) { hi = mid - 1 } else { return { lo: i0, hi: i1 } }
        }
        return { lo: i1, hi: null }
    }

    function interpolate$1(table, skey, sval, tkey) {
        var range = lookup(table, skey, sval),
            prev = !range.lo ? table[0] : !range.hi ? table[table.length - 2] : range.lo,
            next = !range.lo ? table[1] : !range.hi ? table[table.length - 1] : range.hi,
            span = next[skey] - prev[skey],
            ratio = span ? (sval - prev[skey]) / span : 0,
            offset = (next[tkey] - prev[tkey]) * ratio;
        return prev[tkey] + offset
    }

    function toTimestamp(scale, input) {
        var adapter = scale._adapter,
            options = scale.options.time,
            parser = options.parser,
            format = parser || options.format,
            value = input;
        if (typeof parser === 'function') { value = parser(value) }
        if (!helpers$1.isFinite(value)) { value = typeof format === 'string' ? adapter.parse(value, format) : adapter.parse(value) }
        if (value !== null) { return +value }
        if (!parser && typeof format === 'function') { value = format(input); if (!helpers$1.isFinite(value)) { value = adapter.parse(value) } }
        return value
    }

    function parse(scale, input) {
        if (helpers$1.isNullOrUndef(input)) { return null }
        var options = scale.options.time,
            value = toTimestamp(scale, scale.getRightValue(input));
        if (value === null) { return value }
        if (options.round) { value = +scale._adapter.startOf(value, options.round) }
        return value
    }

    function determineStepSize(min, max, unit, capacity) {
        var range = max - min,
            interval = INTERVALS[unit],
            milliseconds = interval.size,
            steps = interval.steps,
            i, ilen, factor;
        if (!steps) { return Math.ceil(range / (capacity * milliseconds)) }
        for (i = 0, ilen = steps.length; i < ilen; ++i) { factor = steps[i]; if (Math.ceil(range / (milliseconds * factor)) <= capacity) { break } }
        return factor
    }

    function determineUnitForAutoTicks(minUnit, min, max, capacity) {
        var ilen = UNITS.length,
            i, interval, factor;
        for (i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
            interval = INTERVALS[UNITS[i]];
            factor = interval.steps ? interval.steps[interval.steps.length - 1] : MAX_INTEGER;
            if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) { return UNITS[i] }
        }
        return UNITS[ilen - 1]
    }

    function determineUnitForFormatting(scale, ticks, minUnit, min, max) {
        var ilen = UNITS.length,
            i, unit;
        for (i = ilen - 1; i >= UNITS.indexOf(minUnit); i--) { unit = UNITS[i]; if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= ticks.length) { return unit } }
        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0]
    }

    function determineMajorUnit(unit) { for (var i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) { if (INTERVALS[UNITS[i]].common) { return UNITS[i] } } }

    function generate(scale, min, max, capacity) {
        var adapter = scale._adapter,
            options = scale.options,
            timeOpts = options.time,
            minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, capacity),
            major = determineMajorUnit(minor),
            stepSize = valueOrDefault$c(timeOpts.stepSize, timeOpts.unitStepSize),
            weekday = minor === 'week' ? timeOpts.isoWeekday : false,
            majorTicksEnabled = options.ticks.major.enabled,
            interval = INTERVALS[minor],
            first = min,
            last = max,
            ticks = [],
            time;
        if (!stepSize) { stepSize = determineStepSize(min, max, minor, capacity) }
        if (weekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
            last = +adapter.startOf(last, 'isoWeek', weekday)
        }
        first = +adapter.startOf(first, weekday ? 'day' : minor);
        last = +adapter.startOf(last, weekday ? 'day' : minor);
        if (last < max) { last = +adapter.add(last, 1, minor) }
        time = first;
        if (majorTicksEnabled && major && !weekday && !timeOpts.round) {
            time = +adapter.startOf(time, major);
            time = +adapter.add(time, ~~((first - time) / (interval.size * stepSize)) * stepSize, minor)
        }
        for (; time < last; time = +adapter.add(time, stepSize, minor)) { ticks.push(+time) }
        ticks.push(+time);
        return ticks
    }

    function computeOffsets(table, ticks, min, max, options) {
        var start = 0,
            end = 0,
            first, last;
        if (options.offset && ticks.length) { if (!options.time.min) { first = interpolate$1(table, 'time', ticks[0], 'pos'); if (ticks.length === 1) { start = 1 - first } else { start = (interpolate$1(table, 'time', ticks[1], 'pos') - first) / 2 } } if (!options.time.max) { last = interpolate$1(table, 'time', ticks[ticks.length - 1], 'pos'); if (ticks.length === 1) { end = last } else { end = (last - interpolate$1(table, 'time', ticks[ticks.length - 2], 'pos')) / 2 } } }
        return { start: start, end: end }
    }

    function ticksFromTimestamps(scale, values, majorUnit) {
        var ticks = [],
            i, ilen, value, major;
        for (i = 0, ilen = values.length; i < ilen; ++i) {
            value = values[i];
            major = majorUnit ? value === +scale._adapter.startOf(value, majorUnit) : false;
            ticks.push({ value: value, major: major })
        }
        return ticks
    }
    var defaultConfig$4 = { position: 'bottom', distribution: 'linear', bounds: 'data', adapters: {}, time: { parser: false, format: false, unit: false, round: false, displayFormat: false, isoWeekday: false, minUnit: 'millisecond', displayFormats: {} }, ticks: { autoSkip: false, source: 'auto', major: { enabled: false } } };
    var scale_time = core_scale.extend({
        initialize: function() {
            this.mergeTicksOptions();
            core_scale.prototype.initialize.call(this)
        },
        update: function() {
            var me = this,
                options = me.options,
                time = options.time || (options.time = {}),
                adapter = me._adapter = new core_adapters._date(options.adapters.date);
            if (time.format) { console.warn('options.time.format is deprecated and replaced by options.time.parser.') }
            helpers$1.mergeIf(time.displayFormats, adapter.formats());
            return core_scale.prototype.update.apply(me, arguments)
        },
        getRightValue: function(rawValue) { if (rawValue && rawValue.t !== undefined) { rawValue = rawValue.t } return core_scale.prototype.getRightValue.call(this, rawValue) },
        determineDataLimits: function() {
            var me = this,
                chart = me.chart,
                adapter = me._adapter,
                timeOpts = me.options.time,
                unit = timeOpts.unit || 'day',
                min = MAX_INTEGER,
                max = MIN_INTEGER,
                timestamps = [],
                datasets = [],
                labels = [],
                i, j, ilen, jlen, data, timestamp, dataLabels = chart.data.labels || [];
            for (i = 0, ilen = dataLabels.length; i < ilen; ++i) { labels.push(parse(me, dataLabels[i])) }
            for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                    data = chart.data.datasets[i].data;
                    if (helpers$1.isObject(data[0])) {
                        datasets[i] = [];
                        for (j = 0, jlen = data.length; j < jlen; ++j) {
                            timestamp = parse(me, data[j]);
                            timestamps.push(timestamp);
                            datasets[i][j] = timestamp
                        }
                    } else {
                        for (j = 0, jlen = labels.length; j < jlen; ++j) { timestamps.push(labels[j]) }
                        datasets[i] = labels.slice(0)
                    }
                } else { datasets[i] = [] }
            }
            if (labels.length) {
                labels = arrayUnique(labels).sort(sorter);
                min = Math.min(min, labels[0]);
                max = Math.max(max, labels[labels.length - 1])
            }
            if (timestamps.length) {
                timestamps = arrayUnique(timestamps).sort(sorter);
                min = Math.min(min, timestamps[0]);
                max = Math.max(max, timestamps[timestamps.length - 1])
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            min = min === MAX_INTEGER ? +adapter.startOf(Date.now(), unit) : min;
            max = max === MIN_INTEGER ? +adapter.endOf(Date.now(), unit) + 1 : max;
            me.min = Math.min(min, max);
            me.max = Math.max(min + 1, max);
            me._horizontal = me.isHorizontal();
            me._table = [];
            me._timestamps = { data: timestamps, datasets: datasets, labels: labels }
        },
        buildTicks: function() {
            var me = this,
                min = me.min,
                max = me.max,
                options = me.options,
                timeOpts = options.time,
                timestamps = [],
                ticks = [],
                i, ilen, timestamp;
            switch (options.ticks.source) {
                case 'data':
                    timestamps = me._timestamps.data;
                    break;
                case 'labels':
                    timestamps = me._timestamps.labels;
                    break;
                case 'auto':
                default:
                    timestamps = generate(me, min, max, me.getLabelCapacity(min), options)
            }
            if (options.bounds === 'ticks' && timestamps.length) {
                min = timestamps[0];
                max = timestamps[timestamps.length - 1]
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            for (i = 0, ilen = timestamps.length; i < ilen; ++i) { timestamp = timestamps[i]; if (timestamp >= min && timestamp <= max) { ticks.push(timestamp) } }
            me.min = min;
            me.max = max;
            me._unit = timeOpts.unit || determineUnitForFormatting(me, ticks, timeOpts.minUnit, me.min, me.max);
            me._majorUnit = determineMajorUnit(me._unit);
            me._table = buildLookupTable(me._timestamps.data, min, max, options.distribution);
            me._offsets = computeOffsets(me._table, ticks, min, max, options);
            if (options.ticks.reverse) { ticks.reverse() }
            return ticksFromTimestamps(me, ticks, me._majorUnit)
        },
        getLabelForIndex: function(index, datasetIndex) {
            var me = this,
                adapter = me._adapter,
                data = me.chart.data,
                timeOpts = me.options.time,
                label = data.labels && index < data.labels.length ? data.labels[index] : '',
                value = data.datasets[datasetIndex].data[index];
            if (helpers$1.isObject(value)) { label = me.getRightValue(value) }
            if (timeOpts.tooltipFormat) { return adapter.format(toTimestamp(me, label), timeOpts.tooltipFormat) }
            if (typeof label === 'string') { return label }
            return adapter.format(toTimestamp(me, label), timeOpts.displayFormats.datetime)
        },
        tickFormatFunction: function(time, index, ticks, format) {
            var me = this,
                adapter = me._adapter,
                options = me.options,
                formats = options.time.displayFormats,
                minorFormat = formats[me._unit],
                majorUnit = me._majorUnit,
                majorFormat = formats[majorUnit],
                majorTime = +adapter.startOf(time, majorUnit),
                majorTickOpts = options.ticks.major,
                major = majorTickOpts.enabled && majorUnit && majorFormat && time === majorTime,
                label = adapter.format(time, format ? format : major ? majorFormat : minorFormat),
                tickOpts = major ? majorTickOpts : options.ticks.minor,
                formatter = valueOrDefault$c(tickOpts.callback, tickOpts.userCallback);
            return formatter ? formatter(label, index, ticks) : label
        },
        convertTicksToLabels: function(ticks) {
            var labels = [],
                i, ilen;
            for (i = 0, ilen = ticks.length; i < ilen; ++i) { labels.push(this.tickFormatFunction(ticks[i].value, i, ticks)) }
            return labels
        },
        getPixelForOffset: function(time) {
            var me = this,
                isReverse = me.options.ticks.reverse,
                size = me._horizontal ? me.width : me.height,
                start = me._horizontal ? isReverse ? me.right : me.left : isReverse ? me.bottom : me.top,
                pos = interpolate$1(me._table, 'time', time, 'pos'),
                offset = size * (me._offsets.start + pos) / (me._offsets.start + 1 + me._offsets.end);
            return isReverse ? start - offset : start + offset
        },
        getPixelForValue: function(value, index, datasetIndex) {
            var me = this,
                time = null;
            if (index !== undefined && datasetIndex !== undefined) { time = me._timestamps.datasets[datasetIndex][index] }
            if (time === null) { time = parse(me, value) }
            if (time !== null) { return me.getPixelForOffset(time) }
        },
        getPixelForTick: function(index) { var ticks = this.getTicks(); return index >= 0 && index < ticks.length ? this.getPixelForOffset(ticks[index].value) : null },
        getValueForPixel: function(pixel) {
            var me = this,
                size = me._horizontal ? me.width : me.height,
                start = me._horizontal ? me.left : me.top,
                pos = (size ? (pixel - start) / size : 0) * (me._offsets.start + 1 + me._offsets.start) - me._offsets.end,
                time = interpolate$1(me._table, 'pos', pos, 'time');
            return me._adapter._create(time)
        },
        getLabelWidth: function(label) {
            var me = this,
                ticksOpts = me.options.ticks,
                tickLabelWidth = me.ctx.measureText(label).width,
                angle = helpers$1.toRadians(ticksOpts.maxRotation),
                cosRotation = Math.cos(angle),
                sinRotation = Math.sin(angle),
                tickFontSize = valueOrDefault$c(ticksOpts.fontSize, core_defaults.global.defaultFontSize);
            return (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation)
        },
        getLabelCapacity: function(exampleTime) {
            var me = this,
                format = me.options.time.displayFormats.millisecond,
                exampleLabel = me.tickFormatFunction(exampleTime, 0, [], format),
                tickLabelWidth = me.getLabelWidth(exampleLabel),
                innerWidth = me.isHorizontal() ? me.width : me.height,
                capacity = Math.floor(innerWidth / tickLabelWidth);
            return capacity > 0 ? capacity : 1
        }
    });
    var _defaults$4 = defaultConfig$4;
    scale_time._defaults = _defaults$4;
    var scales = { category: scale_category, linear: scale_linear, logarithmic: scale_logarithmic, radialLinear: scale_radialLinear, time: scale_time };
    var FORMATS = { datetime: 'MMM D, YYYY, h:mm:ss a', millisecond: 'h:mm:ss.SSS a', second: 'h:mm:ss a', minute: 'h:mm a', hour: 'hA', day: 'MMM D', week: 'll', month: 'MMM YYYY', quarter: '[Q]Q - YYYY', year: 'YYYY' };
    core_adapters._date.override(typeof moment === 'function' ? { _id: 'moment', formats: function() { return FORMATS }, parse: function(value, format) { if (typeof value === 'string' && typeof format === 'string') { value = moment(value, format) } else if (!(value instanceof moment)) { value = moment(value) } return value.isValid() ? value.valueOf() : null }, format: function(time, format) { return moment(time).format(format) }, add: function(time, amount, unit) { return moment(time).add(amount, unit).valueOf() }, diff: function(max, min, unit) { return moment.duration(moment(max).diff(moment(min))).as(unit) }, startOf: function(time, unit, weekday) { time = moment(time); if (unit === 'isoWeek') { return time.isoWeekday(weekday).valueOf() } return time.startOf(unit).valueOf() }, endOf: function(time, unit) { return moment(time).endOf(unit).valueOf() }, _create: function(time) { return moment(time) }, } : {});
    core_defaults._set('global', { plugins: { filler: { propagate: true } } });
    var mappers = {
        dataset: function(source) {
            var index = source.fill,
                chart = source.chart,
                meta = chart.getDatasetMeta(index),
                visible = meta && chart.isDatasetVisible(index),
                points = (visible && meta.dataset._children) || [],
                length = points.length || 0;
            return !length ? null : function(point, i) { return (i < length && points[i]._view) || null }
        },
        boundary: function(source) {
            var boundary = source.boundary,
                x = boundary ? boundary.x : null,
                y = boundary ? boundary.y : null;
            return function(point) { return { x: x === null ? point.x : x, y: y === null ? point.y : y, } }
        }
    };

    function decodeFill(el, index, count) {
        var model = el._model || {},
            fill = model.fill,
            target;
        if (fill === undefined) { fill = !!model.backgroundColor }
        if (fill === false || fill === null) { return false }
        if (fill === true) { return 'origin' }
        target = parseFloat(fill, 10);
        if (isFinite(target) && Math.floor(target) === target) { if (fill[0] === '-' || fill[0] === '+') { target = index + target } if (target === index || target < 0 || target >= count) { return false } return target }
        switch (fill) {
            case 'bottom':
                return 'start';
            case 'top':
                return 'end';
            case 'zero':
                return 'origin';
            case 'origin':
            case 'start':
            case 'end':
                return fill;
            default:
                return false
        }
    }

    function computeBoundary(source) {
        var model = source.el._model || {},
            scale = source.el._scale || {},
            fill = source.fill,
            target = null,
            horizontal;
        if (isFinite(fill)) { return null }
        if (fill === 'start') { target = model.scaleBottom === undefined ? scale.bottom : model.scaleBottom } else if (fill === 'end') { target = model.scaleTop === undefined ? scale.top : model.scaleTop } else if (model.scaleZero !== undefined) { target = model.scaleZero } else if (scale.getBasePosition) { target = scale.getBasePosition() } else if (scale.getBasePixel) { target = scale.getBasePixel() }
        if (target !== undefined && target !== null) { if (target.x !== undefined && target.y !== undefined) { return target } if (helpers$1.isFinite(target)) { horizontal = scale.isHorizontal(); return { x: horizontal ? target : null, y: horizontal ? null : target } } }
        return null
    }

    function resolveTarget(sources, index, propagate) {
        var source = sources[index],
            fill = source.fill,
            visited = [index],
            target;
        if (!propagate) { return fill }
        while (fill !== false && visited.indexOf(fill) === -1) {
            if (!isFinite(fill)) { return fill }
            target = sources[fill];
            if (!target) { return false }
            if (target.visible) { return fill }
            visited.push(fill);
            fill = target.fill
        }
        return false
    }

    function createMapper(source) {
        var fill = source.fill,
            type = 'dataset';
        if (fill === false) { return null }
        if (!isFinite(fill)) { type = 'boundary' }
        return mappers[type](source)
    }

    function isDrawable(point) { return point && !point.skip }

    function drawArea(ctx, curve0, curve1, len0, len1) {
        var i;
        if (!len0 || !len1) { return }
        ctx.moveTo(curve0[0].x, curve0[0].y);
        for (i = 1; i < len0; ++i) { helpers$1.canvas.lineTo(ctx, curve0[i - 1], curve0[i]) }
        ctx.lineTo(curve1[len1 - 1].x, curve1[len1 - 1].y);
        for (i = len1 - 1; i > 0; --i) { helpers$1.canvas.lineTo(ctx, curve1[i], curve1[i - 1], true) }
    }

    function doFill(ctx, points, mapper, view, color, loop) {
        var count = points.length,
            span = view.spanGaps,
            curve0 = [],
            curve1 = [],
            len0 = 0,
            len1 = 0,
            i, ilen, index, p0, p1, d0, d1;
        ctx.beginPath();
        for (i = 0, ilen = (count + !!loop); i < ilen; ++i) {
            index = i % count;
            p0 = points[index]._view;
            p1 = mapper(p0, index, view);
            d0 = isDrawable(p0);
            d1 = isDrawable(p1);
            if (d0 && d1) {
                len0 = curve0.push(p0);
                len1 = curve1.push(p1)
            } else if (len0 && len1) {
                if (!span) {
                    drawArea(ctx, curve0, curve1, len0, len1);
                    len0 = len1 = 0;
                    curve0 = [];
                    curve1 = []
                } else { if (d0) { curve0.push(p0) } if (d1) { curve1.push(p1) } }
            }
        }
        drawArea(ctx, curve0, curve1, len0, len1);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill()
    }
    var plugin_filler = {
        id: 'filler',
        afterDatasetsUpdate: function(chart, options) {
            var count = (chart.data.datasets || []).length,
                propagate = options.propagate,
                sources = [],
                meta, i, el, source;
            for (i = 0; i < count; ++i) {
                meta = chart.getDatasetMeta(i);
                el = meta.dataset;
                source = null;
                if (el && el._model && el instanceof elements.Line) { source = { visible: chart.isDatasetVisible(i), fill: decodeFill(el, i, count), chart: chart, el: el } }
                meta.$filler = source;
                sources.push(source)
            }
            for (i = 0; i < count; ++i) {
                source = sources[i];
                if (!source) { continue }
                source.fill = resolveTarget(sources, i, propagate);
                source.boundary = computeBoundary(source);
                source.mapper = createMapper(source)
            }
        },
        beforeDatasetDraw: function(chart, args) {
            var meta = args.meta.$filler;
            if (!meta) { return }
            var ctx = chart.ctx,
                el = meta.el,
                view = el._view,
                points = el._children || [],
                mapper = meta.mapper,
                color = view.backgroundColor || core_defaults.global.defaultColor;
            if (mapper && color && points.length) {
                helpers$1.canvas.clipArea(ctx, chart.chartArea);
                doFill(ctx, points, mapper, view, color, el._loop);
                helpers$1.canvas.unclipArea(ctx)
            }
        }
    };
    var noop$1 = helpers$1.noop,
        valueOrDefault$d = helpers$1.valueOrDefault;
    core_defaults._set('global', {
        legend: {
            display: true,
            position: 'top',
            fullWidth: true,
            reverse: false,
            weight: 1000,
            onClick: function(e, legendItem) {
                var index = legendItem.datasetIndex,
                    ci = this.chart,
                    meta = ci.getDatasetMeta(index);
                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                ci.update()
            },
            onHover: null,
            onLeave: null,
            labels: { boxWidth: 40, padding: 10, generateLabels: function(chart) { var data = chart.data; return helpers$1.isArray(data.datasets) ? data.datasets.map(function(dataset, i) { return { text: dataset.label, fillStyle: (!helpers$1.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]), hidden: !chart.isDatasetVisible(i), lineCap: dataset.borderCapStyle, lineDash: dataset.borderDash, lineDashOffset: dataset.borderDashOffset, lineJoin: dataset.borderJoinStyle, lineWidth: dataset.borderWidth, strokeStyle: dataset.borderColor, pointStyle: dataset.pointStyle, datasetIndex: i } }, this) : [] } }
        },
        legendCallback: function(chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            for (var i = 0; i < chart.data.datasets.length; i++) {
                text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
                if (chart.data.datasets[i].label) { text.push(chart.data.datasets[i].label) }
                text.push('</li>')
            }
            text.push('</ul>');
            return text.join('')
        }
    });

    function getBoxWidth(labelOpts, fontSize) { return labelOpts.usePointStyle && labelOpts.boxWidth > fontSize ? fontSize : labelOpts.boxWidth }
    var Legend = core_element.extend({
        initialize: function(config) {
            helpers$1.extend(this, config);
            this.legendHitBoxes = [];
            this._hoveredItem = null;
            this.doughnutMode = false
        },
        beforeUpdate: noop$1,
        update: function(maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize
        },
        afterUpdate: noop$1,
        beforeSetDimensions: noop$1,
        setDimensions: function() {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
            me.minSize = { width: 0, height: 0 }
        },
        afterSetDimensions: noop$1,
        beforeBuildLabels: noop$1,
        buildLabels: function() {
            var me = this,
                labelOpts = me.options.labels || {},
                legendItems = helpers$1.callback(labelOpts.generateLabels, [me.chart], me) || [];
            if (labelOpts.filter) { legendItems = legendItems.filter(function(item) { return labelOpts.filter(item, me.chart.data) }) }
            if (me.options.reverse) { legendItems.reverse() }
            me.legendItems = legendItems
        },
        afterBuildLabels: noop$1,
        beforeFit: noop$1,
        fit: function() {
            var me = this,
                opts = me.options,
                labelOpts = opts.labels,
                display = opts.display,
                ctx = me.ctx,
                labelFont = helpers$1.options._parseFont(labelOpts),
                fontSize = labelFont.size,
                hitboxes = me.legendHitBoxes = [],
                minSize = me.minSize,
                isHorizontal = me.isHorizontal();
            if (isHorizontal) {
                minSize.width = me.maxWidth;
                minSize.height = display ? 10 : 0
            } else {
                minSize.width = display ? 10 : 0;
                minSize.height = me.maxHeight
            }
            if (display) {
                ctx.font = labelFont.string;
                if (isHorizontal) {
                    var lineWidths = me.lineWidths = [0],
                        totalHeight = 0;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    helpers$1.each(me.legendItems, function(legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize),
                            width = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
                        if (i === 0 || lineWidths[lineWidths.length - 1] + width + labelOpts.padding > minSize.width) {
                            totalHeight += fontSize + labelOpts.padding;
                            lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = labelOpts.padding
                        }
                        hitboxes[i] = { left: 0, top: 0, width: width, height: fontSize };
                        lineWidths[lineWidths.length - 1] += width + labelOpts.padding
                    });
                    minSize.height += totalHeight
                } else {
                    var vPadding = labelOpts.padding,
                        columnWidths = me.columnWidths = [],
                        totalWidth = labelOpts.padding,
                        currentColWidth = 0,
                        currentColHeight = 0,
                        itemHeight = fontSize + vPadding;
                    helpers$1.each(me.legendItems, function(legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize),
                            itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
                        if (i > 0 && currentColHeight + itemHeight > minSize.height - vPadding) {
                            totalWidth += currentColWidth + labelOpts.padding;
                            columnWidths.push(currentColWidth);
                            currentColWidth = 0;
                            currentColHeight = 0
                        }
                        currentColWidth = Math.max(currentColWidth, itemWidth);
                        currentColHeight += itemHeight;
                        hitboxes[i] = { left: 0, top: 0, width: itemWidth, height: fontSize }
                    });
                    totalWidth += currentColWidth;
                    columnWidths.push(currentColWidth);
                    minSize.width += totalWidth
                }
            }
            me.width = minSize.width;
            me.height = minSize.height
        },
        afterFit: noop$1,
        isHorizontal: function() { return this.options.position === 'top' || this.options.position === 'bottom' },
        draw: function() {
            var me = this,
                opts = me.options,
                labelOpts = opts.labels,
                globalDefaults = core_defaults.global,
                defaultColor = globalDefaults.defaultColor,
                lineDefault = globalDefaults.elements.line,
                legendWidth = me.width,
                lineWidths = me.lineWidths;
            if (opts.display) {
                var ctx = me.ctx,
                    fontColor = valueOrDefault$d(labelOpts.fontColor, globalDefaults.defaultFontColor),
                    labelFont = helpers$1.options._parseFont(labelOpts),
                    fontSize = labelFont.size,
                    cursor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = fontColor;
                ctx.fillStyle = fontColor;
                ctx.font = labelFont.string;
                var boxWidth = getBoxWidth(labelOpts, fontSize),
                    hitboxes = me.legendHitBoxes,
                    drawLegendBox = function(x, y, legendItem) {
                        if (isNaN(boxWidth) || boxWidth <= 0) { return }
                        ctx.save();
                        var lineWidth = valueOrDefault$d(legendItem.lineWidth, lineDefault.borderWidth);
                        ctx.fillStyle = valueOrDefault$d(legendItem.fillStyle, defaultColor);
                        ctx.lineCap = valueOrDefault$d(legendItem.lineCap, lineDefault.borderCapStyle);
                        ctx.lineDashOffset = valueOrDefault$d(legendItem.lineDashOffset, lineDefault.borderDashOffset);
                        ctx.lineJoin = valueOrDefault$d(legendItem.lineJoin, lineDefault.borderJoinStyle);
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = valueOrDefault$d(legendItem.strokeStyle, defaultColor);
                        if (ctx.setLineDash) { ctx.setLineDash(valueOrDefault$d(legendItem.lineDash, lineDefault.borderDash)) }
                        if (opts.labels && opts.labels.usePointStyle) {
                            var radius = boxWidth * Math.SQRT2 / 2,
                                centerX = x + boxWidth / 2,
                                centerY = y + fontSize / 2;
                            helpers$1.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY)
                        } else {
                            if (lineWidth !== 0) { ctx.strokeRect(x, y, boxWidth, fontSize) }
                            ctx.fillRect(x, y, boxWidth, fontSize)
                        }
                        ctx.restore()
                    };
                var fillText = function(x, y, legendItem, textWidth) {
                    var halfFontSize = fontSize / 2,
                        xLeft = boxWidth + halfFontSize + x,
                        yMiddle = y + halfFontSize;
                    ctx.fillText(legendItem.text, xLeft, yMiddle);
                    if (legendItem.hidden) {
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.moveTo(xLeft, yMiddle);
                        ctx.lineTo(xLeft + textWidth, yMiddle);
                        ctx.stroke()
                    }
                };
                var isHorizontal = me.isHorizontal();
                if (isHorizontal) { cursor = { x: me.left + ((legendWidth - lineWidths[0]) / 2) + labelOpts.padding, y: me.top + labelOpts.padding, line: 0 } } else { cursor = { x: me.left + labelOpts.padding, y: me.top + labelOpts.padding, line: 0 } }
                var itemHeight = fontSize + labelOpts.padding;
                helpers$1.each(me.legendItems, function(legendItem, i) {
                    var textWidth = ctx.measureText(legendItem.text).width,
                        width = boxWidth + (fontSize / 2) + textWidth,
                        x = cursor.x,
                        y = cursor.y;
                    if (isHorizontal) {
                        if (i > 0 && x + width + labelOpts.padding > me.left + me.minSize.width) {
                            y = cursor.y += itemHeight;
                            cursor.line++;
                            x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2) + labelOpts.padding
                        }
                    } else if (i > 0 && y + itemHeight > me.top + me.minSize.height) {
                        x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
                        y = cursor.y = me.top + labelOpts.padding;
                        cursor.line++
                    }
                    drawLegendBox(x, y, legendItem);
                    hitboxes[i].left = x;
                    hitboxes[i].top = y;
                    fillText(x, y, legendItem, textWidth);
                    if (isHorizontal) { cursor.x += width + labelOpts.padding } else { cursor.y += itemHeight }
                })
            }
        },
        _getLegendItemAt: function(x, y) {
            var me = this,
                i, hitBox, lh;
            if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) { lh = me.legendHitBoxes; for (i = 0; i < lh.length; ++i) { hitBox = lh[i]; if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) { return me.legendItems[i] } } }
            return null
        },
        handleEvent: function(e) {
            var me = this,
                opts = me.options,
                type = e.type === 'mouseup' ? 'click' : e.type,
                hoveredItem;
            if (type === 'mousemove') { if (!opts.onHover && !opts.onLeave) { return } } else if (type === 'click') { if (!opts.onClick) { return } } else { return }
            hoveredItem = me._getLegendItemAt(e.x, e.y);
            if (type === 'click') { if (hoveredItem && opts.onClick) { opts.onClick.call(me, e.native, hoveredItem) } } else {
                if (opts.onLeave && hoveredItem !== me._hoveredItem) {
                    if (me._hoveredItem) { opts.onLeave.call(me, e.native, me._hoveredItem) }
                    me._hoveredItem = hoveredItem
                }
                if (opts.onHover && hoveredItem) { opts.onHover.call(me, e.native, hoveredItem) }
            }
        }
    });

    function createNewLegendAndAttach(chart, legendOpts) {
        var legend = new Legend({ ctx: chart.ctx, options: legendOpts, chart: chart });
        core_layouts.configure(chart, legend, legendOpts);
        core_layouts.addBox(chart, legend);
        chart.legend = legend
    }
    var plugin_legend = {
        id: 'legend',
        _element: Legend,
        beforeInit: function(chart) { var legendOpts = chart.options.legend; if (legendOpts) { createNewLegendAndAttach(chart, legendOpts) } },
        beforeUpdate: function(chart) {
            var legendOpts = chart.options.legend,
                legend = chart.legend;
            if (legendOpts) {
                helpers$1.mergeIf(legendOpts, core_defaults.global.legend);
                if (legend) {
                    core_layouts.configure(chart, legend, legendOpts);
                    legend.options = legendOpts
                } else { createNewLegendAndAttach(chart, legendOpts) }
            } else if (legend) {
                core_layouts.removeBox(chart, legend);
                delete chart.legend
            }
        },
        afterEvent: function(chart, e) { var legend = chart.legend; if (legend) { legend.handleEvent(e) } }
    };
    var noop$2 = helpers$1.noop;
    core_defaults._set('global', { title: { display: false, fontStyle: 'bold', fullWidth: true, padding: 10, position: 'top', text: '', weight: 2000 } });
    var Title = core_element.extend({
        initialize: function(config) {
            var me = this;
            helpers$1.extend(me, config);
            me.legendHitBoxes = []
        },
        beforeUpdate: noop$2,
        update: function(maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize
        },
        afterUpdate: noop$2,
        beforeSetDimensions: noop$2,
        setDimensions: function() {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
            me.minSize = { width: 0, height: 0 }
        },
        afterSetDimensions: noop$2,
        beforeBuildLabels: noop$2,
        buildLabels: noop$2,
        afterBuildLabels: noop$2,
        beforeFit: noop$2,
        fit: function() {
            var me = this,
                opts = me.options,
                display = opts.display,
                minSize = me.minSize,
                lineCount = helpers$1.isArray(opts.text) ? opts.text.length : 1,
                fontOpts = helpers$1.options._parseFont(opts),
                textSize = display ? (lineCount * fontOpts.lineHeight) + (opts.padding * 2) : 0;
            if (me.isHorizontal()) {
                minSize.width = me.maxWidth;
                minSize.height = textSize
            } else {
                minSize.width = textSize;
                minSize.height = me.maxHeight
            }
            me.width = minSize.width;
            me.height = minSize.height
        },
        afterFit: noop$2,
        isHorizontal: function() { var pos = this.options.position; return pos === 'top' || pos === 'bottom' },
        draw: function() {
            var me = this,
                ctx = me.ctx,
                opts = me.options;
            if (opts.display) {
                var fontOpts = helpers$1.options._parseFont(opts),
                    lineHeight = fontOpts.lineHeight,
                    offset = lineHeight / 2 + opts.padding,
                    rotation = 0,
                    top = me.top,
                    left = me.left,
                    bottom = me.bottom,
                    right = me.right,
                    maxWidth, titleX, titleY;
                ctx.fillStyle = helpers$1.valueOrDefault(opts.fontColor, core_defaults.global.defaultFontColor);
                ctx.font = fontOpts.string;
                if (me.isHorizontal()) {
                    titleX = left + ((right - left) / 2);
                    titleY = top + offset;
                    maxWidth = right - left
                } else {
                    titleX = opts.position === 'left' ? left + offset : right - offset;
                    titleY = top + ((bottom - top) / 2);
                    maxWidth = bottom - top;
                    rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5)
                }
                ctx.save();
                ctx.translate(titleX, titleY);
                ctx.rotate(rotation);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var text = opts.text;
                if (helpers$1.isArray(text)) {
                    var y = 0;
                    for (var i = 0; i < text.length; ++i) {
                        ctx.fillText(text[i], 0, y, maxWidth);
                        y += lineHeight
                    }
                } else { ctx.fillText(text, 0, 0, maxWidth) }
                ctx.restore()
            }
        }
    });

    function createNewTitleBlockAndAttach(chart, titleOpts) {
        var title = new Title({ ctx: chart.ctx, options: titleOpts, chart: chart });
        core_layouts.configure(chart, title, titleOpts);
        core_layouts.addBox(chart, title);
        chart.titleBlock = title
    }
    var plugin_title = {
        id: 'title',
        _element: Title,
        beforeInit: function(chart) { var titleOpts = chart.options.title; if (titleOpts) { createNewTitleBlockAndAttach(chart, titleOpts) } },
        beforeUpdate: function(chart) {
            var titleOpts = chart.options.title,
                titleBlock = chart.titleBlock;
            if (titleOpts) {
                helpers$1.mergeIf(titleOpts, core_defaults.global.title);
                if (titleBlock) {
                    core_layouts.configure(chart, titleBlock, titleOpts);
                    titleBlock.options = titleOpts
                } else { createNewTitleBlockAndAttach(chart, titleOpts) }
            } else if (titleBlock) {
                core_layouts.removeBox(chart, titleBlock);
                delete chart.titleBlock
            }
        }
    };
    var plugins = {},
        filler = plugin_filler,
        legend = plugin_legend,
        title = plugin_title;
    plugins.filler = filler;
    plugins.legend = legend;
    plugins.title = title;
    core_controller.helpers = helpers$1;
    core_helpers(core_controller);
    core_controller._adapters = core_adapters;
    core_controller.Animation = core_animation;
    core_controller.animationService = core_animations;
    core_controller.controllers = controllers;
    core_controller.DatasetController = core_datasetController;
    core_controller.defaults = core_defaults;
    core_controller.Element = core_element;
    core_controller.elements = elements;
    core_controller.Interaction = core_interaction;
    core_controller.layouts = core_layouts;
    core_controller.platform = platform;
    core_controller.plugins = core_plugins;
    core_controller.Scale = core_scale;
    core_controller.scaleService = core_scaleService;
    core_controller.Ticks = core_ticks;
    core_controller.Tooltip = core_tooltip;
    core_controller.helpers.each(scales, function(scale, type) { core_controller.scaleService.registerScaleType(type, scale, scale._defaults) });
    for (var k in plugins) { if (plugins.hasOwnProperty(k)) { core_controller.plugins.register(plugins[k]) } }
    core_controller.platform.initialize();
    var src = core_controller;
    if (typeof window !== 'undefined') { window.Chart = core_controller }
    core_controller.Chart = core_controller;
    core_controller.Legend = plugins.legend._element;
    core_controller.Title = plugins.title._element;
    core_controller.pluginService = core_controller.plugins;
    core_controller.PluginBase = core_controller.Element.extend({});
    core_controller.canvasHelpers = core_controller.helpers.canvas;
    core_controller.layoutService = core_controller.layouts;
    core_controller.LinearScaleBase = scale_linearbase;
    core_controller.helpers.each(['Bar', 'Bubble', 'Doughnut', 'Line', 'PolarArea', 'Radar', 'Scatter'], function(klass) { core_controller[klass] = function(ctx, cfg) { return new core_controller(ctx, core_controller.helpers.merge(cfg || {}, { type: klass.charAt(0).toLowerCase() + klass.slice(1) })) } });
    return src
})));