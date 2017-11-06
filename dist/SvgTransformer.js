var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("dom/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sortNodes(nodes) {
        return nodes.sort(function (item0, item1) {
            var path0 = getNodePath(item0);
            var path1 = getNodePath(item1);
            var count0 = path0.length;
            var count1 = path1.length;
            var len = Math.min(count0, count1);
            for (var i = 0; i < len; i++) {
                if (path0[i] !== path1[i]) {
                    return path0[i] - path1[i];
                }
            }
            return count0 - count1;
        });
    }
    exports.sortNodes = sortNodes;
    function getNodePath(node) {
        var ret = [];
        var parentNode = node.parentNode;
        while (parentNode !== null && !document.isSameNode(parentNode)) {
            var childs = parentNode.childNodes;
            var length_1 = childs.length;
            var pos = 0;
            for (var i = 0; i < length_1; i++) {
                var childElement = childs[i];
                if (childElement.isSameNode(node)) {
                    pos = i;
                    break;
                }
            }
            ret.unshift(pos);
            node = parentNode;
            parentNode = node.parentNode;
        }
        return ret;
    }
});
define("euclidean/SquareMatrix", ["require", "exports", "euclidean/Matrix", "euclidean/Vector"], function (require, exports, Matrix_1, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SquareMatrix = (function (_super) {
        __extends(SquareMatrix, _super);
        function SquareMatrix() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            var _this = _super.apply(this, vectors) || this;
            if (_this.width !== _this.height) {
                throw new Error("The width and the height of [this] matrix must match");
            }
            return _this;
        }
        SquareMatrix.prototype.scale = function (value) {
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(_super.prototype.scale.call(this, value).vectors)))();
        };
        SquareMatrix.prototype.transpose = function () {
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(_super.prototype.transpose.call(this).vectors)))();
        };
        SquareMatrix.prototype.adjoint = function () {
            var _this = this;
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(this.vectors.map(function (vector, col) {
                return new (Vector_1.Vector.bind.apply(Vector_1.Vector, [void 0].concat(vector.coordinates.map(function (value, row) {
                    return _this._getCofactor(col, row);
                }))))();
            }))))().transpose();
        };
        SquareMatrix.prototype.determinant = function () {
            var _this = this;
            if (this.width === 1) {
                var v0 = this.vectors[0];
                var a0 = v0.coordinates[0];
                return a0;
            }
            else if (this.width === 2) {
                var _a = this.vectors, v0 = _a[0], v1 = _a[1];
                var _b = v0.coordinates, a00 = _b[0], a01 = _b[1];
                var _c = v1.coordinates, a10 = _c[0], a11 = _c[1];
                return a00 * a11 - a01 * a10;
            }
            else if (this.width === 3) {
                var _d = this.vectors, v0 = _d[0], v1 = _d[1], v2 = _d[2];
                var _e = v0.coordinates, a00 = _e[0], a01 = _e[1], a02 = _e[2];
                var _f = v1.coordinates, a10 = _f[0], a11 = _f[1], a12 = _f[2];
                var _g = v2.coordinates, a20 = _g[0], a21 = _g[1], a22 = _g[2];
                return (a00 * a11 * a22) + (a02 * a10 * a21) + (a01 * a12 * a20)
                    - (a02 * a11 * a20) - (a00 * a12 * a20) - (a01 * a10 * a22);
            }
            else {
                var vector = this.width > 0 ? this.vectors[0] : new Vector_1.Vector();
                var initVal = this.width > 0 ? 0 : 1;
                return vector.coordinates.reduce(function (prev, current, index) {
                    return prev + current * _this._getCofactor(0, index);
                }, initVal);
            }
        };
        SquareMatrix.prototype.inverse = function () {
            return this.adjoint().scale(1 / this.determinant());
        };
        SquareMatrix.prototype._getCofactor = function (col, row) {
            var sign = (col + row) % 2 > 0 ? -1 : +1;
            var m = new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(this.vectors.filter(function (vector, index) { return index !== col; }).map(function (vector, index) { return new (Vector_1.Vector.bind.apply(Vector_1.Vector, [void 0].concat(vector.coordinates.filter(function (value, i) { return i !== row; }))))(); }))))();
            return sign * m.determinant();
        };
        return SquareMatrix;
    }(Matrix_1.Matrix));
    exports.SquareMatrix = SquareMatrix;
});
define("euclidean/Transformation", ["require", "exports", "euclidean/SquareMatrix", "euclidean/Vector"], function (require, exports, SquareMatrix_1, Vector_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transformation = (function (_super) {
        __extends(Transformation, _super);
        function Transformation() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            var _this = _super.apply(this, vectors) || this;
            var test1 = vectors
                .slice(-1)
                .every(function (vector) { return vector.coordinates.slice(-1)[0] === 1; });
            if (!test1) {
                throw new Error("The last coordinate of the last vector must be 1");
            }
            var test2 = vectors
                .slice(0, -1)
                .every(function (vector) { return vector.coordinates.slice(-1)[0] === 0; });
            if (!test2) {
                throw new Error("The last coordinate of the first vectors must be 0");
            }
            return _this;
        }
        Transformation.prototype.inverse = function () {
            var vectors = _super.prototype.inverse.call(this).vectors;
            return new (Transformation.bind.apply(Transformation, [void 0].concat(vectors.slice(0, -1).map(function (vector) { return new (Vector_2.Vector.bind.apply(Vector_2.Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([0]))))(); }).concat(vectors.slice(-1).map(function (vector) { return new (Vector_2.Vector.bind.apply(Vector_2.Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([1]))))(); })))))();
        };
        Transformation.prototype.transform = function (t) {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(t.multiply(this).vectors)))();
        };
        return Transformation;
    }(SquareMatrix_1.SquareMatrix));
    exports.Transformation = Transformation;
});
define("euclidean/Vector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector = (function () {
        function Vector() {
            var coordinates = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coordinates[_i] = arguments[_i];
            }
            this.coordinates = coordinates;
        }
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return this.coordinates.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.transform = function (t) {
            var v = new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.concat([1]))))().multiply(t);
            return new (Vector.bind.apply(Vector, [void 0].concat(v.coordinates.slice(0, -1))))();
        };
        Vector.prototype.multiply = function (m) {
            var _this = this;
            if (m.width !== this.length) {
                throw new Error("The width of the matrix must match the length of the vector");
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(m.transpose().vectors.map(function (vector, index) {
                return vector.coordinates.reduce(function (prev, current, i) { return prev + current * _this.coordinates[i]; }, 0);
            }))))();
        };
        Vector.prototype.opposite = function () {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w) { return -w; }))))();
        };
        Vector.prototype.scale = function (value) {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w) { return value * w; }))))();
        };
        Vector.prototype.sum = function (vector) {
            if (this.length !== vector.length) {
                throw new Error("The vectors must have the same length");
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w, index) { return w + vector.coordinates[index]; }))))();
        };
        Vector.prototype.subtract = function (vector) {
            return this.sum(vector.opposite());
        };
        Vector.prototype.norm = function () {
            return Math.sqrt(this.coordinates.reduce(function (prev, w) {
                return prev + w * w;
            }, 0));
        };
        Vector.prototype.unit = function () {
            return this.scale(1 / this.norm());
        };
        Vector.prototype.toString = function () {
            return "[" + this.coordinates.join(", ") + "]";
        };
        return Vector;
    }());
    exports.Vector = Vector;
});
define("euclidean/Matrix", ["require", "exports", "euclidean/Vector"], function (require, exports, Vector_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Matrix = (function () {
        function Matrix() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            this.vectors = vectors;
            var height = this.height;
            if (!vectors.every(function (vector) { return vector.length === height; })) {
                throw new Error("All vectors must have the same length");
            }
        }
        Object.defineProperty(Matrix.prototype, "width", {
            get: function () {
                return this.vectors.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "height", {
            get: function () {
                return this.width > 0 ? this.vectors[0].length : 0;
            },
            enumerable: true,
            configurable: true
        });
        Matrix.prototype.scale = function (value) {
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector) { return vector.scale(value); }))))();
        };
        Matrix.prototype.transpose = function () {
            var height = this.height;
            var width = this.width;
            var vectors = [];
            for (var i = 0; i < height; i++) {
                var coords = [];
                for (var j = 0; j < width; j++) {
                    coords.push(this.vectors[j].coordinates[i]);
                }
                vectors.push(new (Vector_3.Vector.bind.apply(Vector_3.Vector, [void 0].concat(coords)))());
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(vectors)))();
        };
        Matrix.prototype.multiply = function (m) {
            var _this = this;
            if (this.width !== m.height) {
                throw new Error("The width of [this] matrix must match the height of the matrix");
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(m.vectors.map(function (vector) { return vector.multiply(_this); }))))();
        };
        Matrix.prototype.toString = function () {
            return this.vectors.map(function (vector) { return vector.toString(); }).join("\n");
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
});
define("euclidean/dim2/Vector", ["require", "exports", "euclidean/Vector"], function (require, exports, Vector_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(x, y) {
            return _super.call(this, x, y) || this;
        }
        Object.defineProperty(Vector.prototype, "x", {
            get: function () {
                return this.coordinates[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "y", {
            get: function () {
                return this.coordinates[1];
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.multiply = function (m) {
            var v = _super.prototype.multiply.call(this, m);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.transform = function (t) {
            var v = _super.prototype.transform.call(this, t);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.opposite = function () {
            var v = _super.prototype.opposite.call(this);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.scale = function (value) {
            var v = _super.prototype.scale.call(this, value);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.sum = function (vector) {
            var v = _super.prototype.sum.call(this, vector);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.subtract = function (vector) {
            var v = _super.prototype.subtract.call(this, vector);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        Vector.prototype.unit = function () {
            var v = _super.prototype.unit.call(this);
            var _a = v.coordinates, x = _a[0], y = _a[1];
            return new Vector(x, y);
        };
        return Vector;
    }(Vector_4.Vector));
    exports.Vector = Vector;
});
define("euclidean/dim2/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("euclidean/dim2/Transformation", ["require", "exports", "euclidean/Transformation", "euclidean/Vector", "euclidean/dim2/Vector"], function (require, exports, Transformation_1, Vector_5, Vector_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transformation = (function (_super) {
        __extends(Transformation, _super);
        function Transformation() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            var _this = this;
            if (vectors.length === 0) {
                vectors.push(new Vector_5.Vector(1, 0, 0));
                vectors.push(new Vector_5.Vector(0, 1, 0));
                vectors.push(new Vector_5.Vector(0, 0, 1));
            }
            _this = _super.apply(this, vectors) || this;
            return _this;
        }
        Transformation.createFromValues = function (a, b, c, d, e, f) {
            return new Transformation(new Vector_5.Vector(a, b, 0), new Vector_5.Vector(c, d, 0), new Vector_5.Vector(e, f, 1));
        };
        Object.defineProperty(Transformation.prototype, "info", {
            get: function () {
                var coordinates = this.vectors.map(function (v) { return v.coordinates; });
                var _a = [
                    coordinates[0][0], coordinates[0][1],
                    coordinates[1][0], coordinates[1][1],
                    coordinates[2][0], coordinates[2][1]
                ], a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
                var skewX = ((180 / Math.PI) * Math.atan2(d, c) - 90);
                var skewY = ((180 / Math.PI) * Math.atan2(b, a));
                return {
                    translateX: e,
                    translateY: f,
                    scaleX: Math.sqrt(a * a + b * b),
                    scaleY: Math.sqrt(c * c + d * d),
                    skewX: skewX,
                    skewY: skewY,
                    rotation: skewX
                };
            },
            enumerable: true,
            configurable: true
        });
        Transformation.prototype.transform = function (t) {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(_super.prototype.transform.call(this, t).vectors)))();
        };
        Transformation.prototype.inverse = function () {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(_super.prototype.inverse.call(this).vectors)))();
        };
        Transformation.prototype.translate = function (v) {
            return this.transform(new Transformation(new Vector_5.Vector(1, 0, 0), new Vector_5.Vector(0, 1, 0), new Vector_5.Vector(v.x, v.y, 1)));
        };
        Transformation.prototype.rotate = function (angle) {
            var ret = null;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            return this.transform(new Transformation(new Vector_5.Vector(cos, sin, 0), new Vector_5.Vector(-sin, cos, 0), new Vector_5.Vector(0, 0, 1)));
        };
        Transformation.prototype.scale = function (value) {
            var xScale = value instanceof Vector_6.Vector ? value.x : value;
            var yScale = value instanceof Vector_6.Vector ? value.y : value;
            return this.transform(new Transformation(new Vector_5.Vector(xScale, 0, 0), new Vector_5.Vector(0, yScale, 0), new Vector_5.Vector(0, 0, 1)));
        };
        Transformation.prototype.skew = function (value) {
            var xTan = value instanceof Vector_6.Vector ? Math.tan(value.x) : Math.tan(value);
            var yTan = value instanceof Vector_6.Vector ? Math.tan(value.y) : Math.tan(value);
            return this.transform(new Transformation(new Vector_5.Vector(1, yTan, 0), new Vector_5.Vector(xTan, 1, 0), new Vector_5.Vector(0, 0, 1)));
        };
        Transformation.prototype.toString = function () {
            var _a = this.vectors, v0 = _a[0], v1 = _a[1], v2 = _a[2];
            var _b = v0.coordinates, a = _b[0], b = _b[1];
            var _c = v1.coordinates, c = _c[0], d = _c[1];
            var _d = v2.coordinates, e = _d[0], f = _d[1];
            return "matrix(" + a + " " + b + " " + c + " " + d + " " + e + " " + f + ")";
        };
        return Transformation;
    }(Transformation_1.Transformation));
    exports.Transformation = Transformation;
});
define("svg/SvgElement", ["require", "exports", "svg/SvgGraphicElement"], function (require, exports, SvgGraphicElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SvgElement = (function () {
        function SvgElement(target, attributes) {
            if (attributes === void 0) { attributes = {}; }
            if (typeof target === "string") {
                this.nativeElement = document.createElementNS("http://www.w3.org/2000/svg", target.toString());
            }
            else {
                this.nativeElement = target;
            }
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    this.setAttr(key, attributes[key]);
                }
            }
        }
        Object.defineProperty(SvgElement.prototype, "ownerElement", {
            get: function () {
                return new SvgGraphicElement_1.SvgGraphicElement(this.nativeElement.ownerSVGElement);
            },
            enumerable: true,
            configurable: true
        });
        SvgElement.prototype.getAttr = function (name) {
            return this.nativeElement.getAttributeNS(null, name);
        };
        SvgElement.prototype.setAttr = function (name, value) {
            this.nativeElement.setAttributeNS(null, name, "" + value);
            return this;
        };
        SvgElement.prototype.removeAttr = function (name) {
            this.nativeElement.removeAttributeNS(null, name);
            return this;
        };
        SvgElement.prototype.insertBefore = function (element) {
            var nativeElement = this.nativeElement;
            var parentNode = nativeElement.parentNode;
            parentNode.insertBefore(element.nativeElement, nativeElement);
        };
        SvgElement.prototype.insertAfter = function (element) {
            var nativeElement = this.nativeElement;
            var parentNode = nativeElement.parentNode;
            parentNode.insertBefore(element.nativeElement, nativeElement.nextSibling);
        };
        SvgElement.prototype.prepend = function (element) {
            var firstChild = this.nativeElement.firstChild;
            if (firstChild) {
                this.nativeElement.insertBefore(element.nativeElement, firstChild);
            }
            else {
                this.append(element);
            }
        };
        SvgElement.prototype.append = function (element) {
            this.nativeElement.appendChild(element.nativeElement);
        };
        SvgElement.prototype.remove = function () {
            this.nativeElement.remove();
        };
        return SvgElement;
    }());
    exports.SvgElement = SvgElement;
});
define("svg/SvgGraphicElement", ["require", "exports", "euclidean/dim2/Transformation", "euclidean/dim2/Vector", "svg/SvgElement"], function (require, exports, Transformation_2, Vector_7, SvgElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SvgGraphicElement = (function (_super) {
        __extends(SvgGraphicElement, _super);
        function SvgGraphicElement(target, attributes) {
            if (attributes === void 0) { attributes = {}; }
            var _this = _super.call(this, target, attributes) || this;
            _this._isDraggingInit = false;
            _this._isDragging = false;
            _this._eventListeners = [];
            return _this;
        }
        Object.defineProperty(SvgGraphicElement.prototype, "boundingBox", {
            get: function () {
                var box = this.nativeElement.getBBox();
                return { x: box.x, y: box.y, width: box.width, height: box.height };
            },
            enumerable: true,
            configurable: true
        });
        SvgGraphicElement.prototype.onStartDragging = function (listener) {
            var self = this;
            if (!this._isDraggingInit) {
                this._initDragging();
            }
            this.nativeElement.addEventListener("mousedown", function (event) {
                var t = self._getClientTransformation();
                var p = new Vector_7.Vector(event.clientX, event.clientY).transform(t);
                listener.apply(self, [p]);
            });
            return this;
        };
        SvgGraphicElement.prototype.onDragging = function (listener) {
            var self = this;
            var eventListener = function (event) {
                if (self._isDragging) {
                    var t = self._getClientTransformation();
                    var p = new Vector_7.Vector(event.clientX, event.clientY).transform(t);
                    listener.apply(self, [p]);
                }
            };
            if (!this._isDraggingInit) {
                this._initDragging();
            }
            document.addEventListener("mousemove", eventListener);
            this._eventListeners.push(eventListener);
            return this;
        };
        SvgGraphicElement.prototype.onStopDragging = function (listener) {
            var self = this;
            if (!this._isDraggingInit) {
                this._initDragging();
            }
            this.nativeElement.addEventListener(self._stopDraggingEventName, function (event) { return listener.apply(self, [event.detail]); });
            return this;
        };
        Object.defineProperty(SvgGraphicElement.prototype, "transformation", {
            get: function () {
                var ret = new Transformation_2.Transformation();
                var t = this.nativeElement.transform.baseVal.consolidate();
                if (t !== undefined && t !== null) {
                    var m = t.matrix;
                    ret = Transformation_2.Transformation.createFromValues(m.a, m.b, m.c, m.d, m.e, m.f);
                }
                return ret;
            },
            set: function (value) {
                if (value === undefined || value === null) {
                    this.removeAttr("transform");
                }
                else {
                    this.setAttr("transform", value.toString());
                }
            },
            enumerable: true,
            configurable: true
        });
        SvgGraphicElement.prototype.transform = function (t) {
            this.setAttr("transform", this.transformation.transform(t).toString());
            return this;
        };
        SvgGraphicElement.prototype.remove = function () {
            var eventNames = ["mousemove", "mouseup", "mouseleave", "blur"];
            for (var _i = 0, eventNames_1 = eventNames; _i < eventNames_1.length; _i++) {
                var eventName = eventNames_1[_i];
                for (var _a = 0, _b = this._eventListeners; _a < _b.length; _a++) {
                    var listener = _b[_a];
                    document.removeEventListener(eventName, listener);
                }
            }
            _super.prototype.remove.call(this);
        };
        SvgGraphicElement.prototype._generateId = function () {
            var t = function (repeat) {
                if (repeat === void 0) { repeat = 1; }
                var ret = [];
                for (var i = 0; i < repeat; i++) {
                    ret.push(Math
                        .floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1));
                }
                return ret.join("");
            };
            return t(2) + "_" + t() + "_" + t() + "_" + t() + "_" + t(3);
        };
        SvgGraphicElement.prototype._initDragging = function () {
            var self = this;
            this._stopDraggingEventName = "stopdragging_" + this._generateId();
            this.nativeElement.addEventListener("mousedown", function (event) {
                self._isDragging = true;
            });
            for (var _i = 0, _a = ["mouseup", "mouseleave", "blur"]; _i < _a.length; _i++) {
                var eventName = _a[_i];
                var eventListener = function (event) {
                    if (self._isDragging) {
                        var t = self._getClientTransformation();
                        var p = event instanceof MouseEvent
                            ? new Vector_7.Vector(event.clientX, event.clientY).transform(t)
                            : null;
                        self.nativeElement.dispatchEvent(new CustomEvent(self._stopDraggingEventName, { detail: p }));
                    }
                    self._isDragging = false;
                };
                document.addEventListener(eventName, eventListener);
                this._eventListeners.push(eventListener);
            }
            this._isDraggingInit = true;
        };
        SvgGraphicElement.prototype._getClientTransformation = function () {
            var canvas = this.ownerElement;
            var ctm = canvas.nativeElement.getScreenCTM();
            return Transformation_2.Transformation.createFromValues(ctm.a, ctm.b, ctm.c, ctm.d, ctm.e, ctm.f).inverse();
        };
        SvgGraphicElement.prototype._getTransformValues = function () {
            var t = this.transformation;
            var _a = t.vectors, v0 = _a[0], v1 = _a[1], v2 = _a[2];
            var a = v0.coordinates[0];
            var b = v0.coordinates[1];
            var c = v1.coordinates[0];
            var d = v1.coordinates[1];
            var e = v2.coordinates[0];
            var f = v2.coordinates[1];
            return { a: a, b: b, c: c, d: d, e: e, f: f };
        };
        return SvgGraphicElement;
    }(SvgElement_1.SvgElement));
    exports.SvgGraphicElement = SvgGraphicElement;
});
define("SvgTransformer/Dragger", ["require", "exports", "svg/SvgGraphicElement"], function (require, exports, SvgGraphicElement_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dragger = (function (_super) {
        __extends(Dragger, _super);
        function Dragger() {
            var _this = _super.call(this, "rect") || this;
            _this._backgroundColor = "000";
            _this._opacity = 0;
            _this._isVisible = true;
            _this.nativeElement.style.cursor = "move";
            _this
                .setAttr("fill", _this._backgroundColor)
                .setAttr("opacity", _this._opacity);
            return _this;
        }
        Object.defineProperty(Dragger.prototype, "isVisible", {
            get: function () {
                return this._isVisible;
            },
            set: function (value) {
                this._isVisible = value;
                this.nativeElement.style.display = this._isVisible ? "inline" : "none";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dragger.prototype, "width", {
            get: function () {
                return parseInt(this.getAttr("width"), 10);
            },
            set: function (value) {
                this.setAttr("width", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dragger.prototype, "height", {
            get: function () {
                return parseInt(this.getAttr("height"), 10);
            },
            set: function (value) {
                this.setAttr("height", value);
            },
            enumerable: true,
            configurable: true
        });
        return Dragger;
    }(SvgGraphicElement_2.SvgGraphicElement));
    exports.Dragger = Dragger;
});
define("SvgTransformer/Handle", ["require", "exports", "euclidean/dim2/Vector", "svg/SvgGraphicElement"], function (require, exports, Vector_8, SvgGraphicElement_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Handle = (function (_super) {
        __extends(Handle, _super);
        function Handle(attributes) {
            if (attributes === void 0) { attributes = {}; }
            var _this = _super.call(this, "circle", attributes) || this;
            _this._fillColor = "transparent";
            _this._isVisible = true;
            _this.setAttr("fill", _this._fillColor);
            return _this;
        }
        Object.defineProperty(Handle.prototype, "isVisible", {
            get: function () {
                return this._isVisible;
            },
            set: function (value) {
                this._isVisible = value;
                this.nativeElement.style.display = this._isVisible ? "inline" : "none";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handle.prototype, "position", {
            get: function () {
                var x = parseInt(this.getAttr("cx"), 10);
                var y = parseInt(this.getAttr("cy"), 10);
                return new Vector_8.Vector(x, y);
            },
            set: function (value) {
                this
                    .setAttr("cx", value.x)
                    .setAttr("cy", value.y);
            },
            enumerable: true,
            configurable: true
        });
        return Handle;
    }(SvgGraphicElement_3.SvgGraphicElement));
    exports.Handle = Handle;
});
define("SvgTransformer/SvgGroup", ["require", "exports", "euclidean/dim2/Transformation", "euclidean/dim2/Vector"], function (require, exports, Transformation_3, Vector_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SvgGroup = (function () {
        function SvgGroup(elements) {
            this._elements = elements;
            if (elements.length < 1) {
                throw new Error("Argument error: number of elements lower than 1");
            }
            else if (elements.length > 1) {
                var points = this._getPoints(function (x, y, width, height) { return [
                    new Vector_9.Vector(x, y),
                    new Vector_9.Vector(x + width, y),
                    new Vector_9.Vector(x + width, y + height),
                    new Vector_9.Vector(x, y + height)
                ]; });
                var topLeftCorner = this._getTopLeftCorner(points);
                var bottomRightCorner = this._getBottomRightCorner(points);
                this._width = bottomRightCorner.x - topLeftCorner.x;
                this._height = bottomRightCorner.y - topLeftCorner.y;
                this._transformation = new Transformation_3.Transformation()
                    .translate(topLeftCorner);
            }
            else {
                var element = this._elements[0];
                var box = element.boundingBox;
                this._width = box.width;
                this._height = box.height;
                this._transformation = element.transformation;
            }
        }
        Object.defineProperty(SvgGroup.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgGroup.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgGroup.prototype, "transformation", {
            get: function () {
                return this._transformation;
            },
            set: function (value) {
                var t0 = this._transformation.inverse();
                for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    elem.transformation = elem.transformation.transform(t0).transform(value);
                }
                this._transformation = value;
            },
            enumerable: true,
            configurable: true
        });
        SvgGroup.prototype._getPoints = function (getCorners) {
            var points = [];
            var _loop_1 = function (element) {
                var t = element.transformation;
                var _a = element.boundingBox, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                var corners = getCorners(x, y, width, height);
                points.push.apply(points, corners.map(function (p) { return p.transform(t); }));
            };
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                _loop_1(element);
            }
            return points;
        };
        SvgGroup.prototype._getDiagonalCorner = function (points, comparator, initValue) {
            var _a = [0, 1].map(function (i) { return points
                .map(function (point) { return point.coordinates[i]; })
                .reduce(function (prev, curr) { return comparator(prev, curr); }, initValue); }), x = _a[0], y = _a[1];
            return new Vector_9.Vector(x, y);
        };
        SvgGroup.prototype._getTopLeftCorner = function (points) {
            return this._getDiagonalCorner(points, Math.min, Number.POSITIVE_INFINITY);
        };
        SvgGroup.prototype._getBottomRightCorner = function (points) {
            return this._getDiagonalCorner(points, Math.max, Number.NEGATIVE_INFINITY);
        };
        return SvgGroup;
    }());
    exports.SvgGroup = SvgGroup;
});
define("SvgTransformer/SvgPath", ["require", "exports", "svg/SvgGraphicElement"], function (require, exports, SvgGraphicElement_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SvgPath = (function (_super) {
        __extends(SvgPath, _super);
        function SvgPath(attributes) {
            if (attributes === void 0) { attributes = {}; }
            return _super.call(this, "path", attributes) || this;
        }
        SvgPath.prototype.moveTo = function (value) {
            this.setAttr("d", [this.getAttr("d") || "", "M" + value.x + " " + value.y].join(" "));
            return this;
        };
        SvgPath.prototype.lineTo = function (value) {
            this.setAttr("d", [this.getAttr("d") || "", "L" + value.x + " " + value.y].join(" "));
            return this;
        };
        SvgPath.prototype.close = function () {
            this.setAttr("d", [this.getAttr("d") || "", "Z"].join(" "));
            return this;
        };
        return SvgPath;
    }(SvgGraphicElement_4.SvgGraphicElement));
    exports.SvgPath = SvgPath;
});
define("SvgTransformer", ["require", "exports", "dom/utils", "euclidean/dim2/Transformation", "euclidean/dim2/Vector", "euclidean/SquareMatrix", "svg/SvgGraphicElement", "SvgTransformer/Dragger", "SvgTransformer/Handle", "SvgTransformer/SvgGroup", "SvgTransformer/SvgPath"], function (require, exports, utils_1, Transformation_4, Vector_10, SquareMatrix_2, SvgGraphicElement_5, Dragger_1, Handle_1, SvgGroup_1, SvgPath_1) {
    "use strict";
    function _getAdjacentAngle(p0, p1, p2) {
        var u = p1.subtract(p2);
        var u0 = u.unit();
        var u1 = new Vector_10.Vector(u0.y, -u0.x);
        var v = p0.subtract(p2);
        var m = new SquareMatrix_2.SquareMatrix(u0, u1);
        var w = v.multiply(m.inverse());
        return Math.atan2(w.y, w.x);
    }
    return (function () {
        function SvgTransformer() {
            this._necklength = 30;
            this._stroke = "black";
            this._strokeWidth = 2;
            this._handleRadius = 10;
            this._isVisible = false;
            this._isDraggable = true;
            this._isResizable = true;
            this._isAspectRatioPreserved = false;
            this._isRotable = true;
            this._elements = [];
        }
        Object.defineProperty(SvgTransformer.prototype, "elements", {
            get: function () {
                return this._elements.map(function (value) { return value.nativeElement; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "container", {
            get: function () {
                return this._container ? this._container.nativeElement : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "isVisible", {
            get: function () {
                return this._isVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "neckLength", {
            get: function () {
                return this._necklength;
            },
            set: function (value) {
                this._necklength = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "stroke", {
            get: function () {
                return this._stroke;
            },
            set: function (value) {
                this._stroke = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "strokeWidth", {
            get: function () {
                return this._strokeWidth;
            },
            set: function (value) {
                this._strokeWidth = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "handleRadius", {
            get: function () {
                return this._handleRadius;
            },
            set: function (value) {
                this._handleRadius = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "isDraggable", {
            get: function () {
                return this._isDraggable;
            },
            set: function (value) {
                this._isDraggable = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "isResizable", {
            get: function () {
                return this._isResizable;
            },
            set: function (value) {
                this._isResizable = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "isAspectRatioPreserved", {
            get: function () {
                return this._isAspectRatioPreserved;
            },
            set: function (value) {
                this._isAspectRatioPreserved = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SvgTransformer.prototype, "isRotable", {
            get: function () {
                return this._isRotable;
            },
            set: function (value) {
                this._isRotable = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        SvgTransformer.prototype.show = function (elements) {
            var items = elements instanceof Element ? [elements] : elements;
            var len = items.length;
            if (len === 0) {
                throw new Error("Argument error: zero elements");
            }
            this.hide();
            utils_1.sortNodes(items);
            this._canvas = null;
            this._elements = [];
            for (var i = 0; i < len; i++) {
                var elem = items[i];
                if (elem instanceof SVGGraphicsElement) {
                    var item = new SvgGraphicElement_5.SvgGraphicElement(elem);
                    var canvas = elem.ownerSVGElement;
                    if (!this._canvas) {
                        this._canvas = new SvgGraphicElement_5.SvgGraphicElement(canvas);
                    }
                    this._elements.push(item);
                }
                else {
                    throw new Error("Argument error: not a SVGGraphicsElement");
                }
            }
            var lastElement = this._elements[len - 1];
            this._target = new SvgGroup_1.SvgGroup(this._elements);
            this._container = new SvgGraphicElement_5.SvgGraphicElement("g");
            lastElement.insertAfter(this._container);
            this._createPath();
            this._createDragger();
            this._createRotateHandle();
            this._createResizeHandles();
            this._isVisible = true;
            this._update();
        };
        SvgTransformer.prototype.hide = function () {
            if (!this._isVisible) {
                return;
            }
            for (var orientation_1 in this._scaleHandles) {
                if (!this._scaleHandles.hasOwnProperty(orientation_1)) {
                    continue;
                }
                var handles = this._scaleHandles[orientation_1];
                for (var _i = 0, handles_1 = handles; _i < handles_1.length; _i++) {
                    var handle = handles_1[_i];
                    handle.remove();
                }
            }
            this._path.remove();
            this._dragger.remove();
            this._rotateHandle.remove();
            this._container.remove();
            this._isVisible = false;
        };
        SvgTransformer.prototype._update = function () {
            if (!this._isVisible) {
                return;
            }
            var width = this._target.width;
            var height = this._target.height;
            var t = this._target.transformation;
            this._dragger.transformation = t;
            this._dragger.isVisible = this._isDraggable;
            this._path.remove();
            this._createPath();
            this._rotateHandle.position = new Vector_10.Vector(width / 2, -this._necklength / t.info.scaleY).transform(t);
            this._rotateHandle.isVisible = this._isRotable;
            var orientations = {
                diagonal: [
                    new Vector_10.Vector(0, 0),
                    new Vector_10.Vector(width, 0),
                    new Vector_10.Vector(0, height),
                    new Vector_10.Vector(width, height)
                ],
                horizontal: [
                    new Vector_10.Vector(width, height / 2),
                    new Vector_10.Vector(0, height / 2)
                ],
                vertical: [
                    new Vector_10.Vector(width / 2, 0),
                    new Vector_10.Vector(width / 2, height)
                ]
            };
            for (var orientation_2 in orientations) {
                if (!orientations.hasOwnProperty(orientation_2)) {
                    continue;
                }
                var positions = orientations[orientation_2];
                var handles = this._scaleHandles[orientation_2];
                for (var i in handles) {
                    if (!handles.hasOwnProperty(i)) {
                        continue;
                    }
                    var position = positions[i];
                    var handle = handles[i];
                    handle.isVisible = this._isResizable &&
                        (orientation_2 === "diagonal" || !this._isAspectRatioPreserved);
                    handle.position = position.transform(t);
                }
            }
        };
        SvgTransformer.prototype._createPath = function () {
            var width = this._target.width;
            var height = this._target.height;
            var t = this._target.transformation;
            var p0 = new Vector_10.Vector(width / 2, -this._necklength / t.info.scaleY).transform(t);
            var p1 = new Vector_10.Vector(width / 2, 0).transform(t);
            var p2 = new Vector_10.Vector(0, 0).transform(t);
            var p3 = new Vector_10.Vector(0, height).transform(t);
            var p4 = new Vector_10.Vector(width, height).transform(t);
            var p5 = new Vector_10.Vector(width, 0).transform(t);
            this._path = new SvgPath_1.SvgPath({
                "stroke": this._stroke,
                "stroke-width": this._strokeWidth,
                "fill": "transparent"
            })
                .moveTo(p1)
                .lineTo(p2).lineTo(p3).lineTo(p4).lineTo(p5).lineTo(p1);
            if (this._isRotable) {
                this._path.lineTo(p0);
            }
            this._container.prepend(this._path);
        };
        SvgTransformer.prototype._createDragger = function () {
            var self = this;
            var width = this._target.width;
            var height = this._target.height;
            this._dragger = new Dragger_1.Dragger();
            this._dragger.width = width;
            this._dragger.height = height;
            this._container.append(this._dragger);
            var p0;
            var t0;
            this._dragger
                .onStartDragging(function (p) {
                t0 = self._target.transformation;
                p0 = p;
            })
                .onDragging(function (p1) {
                var v = p1.subtract(p0);
                self._target.transformation = t0.translate(v);
                self._update();
            });
        };
        SvgTransformer.prototype._createRotateHandle = function () {
            var self = this;
            var center;
            var p0;
            var t0;
            this._rotateHandle = new Handle_1.Handle({
                "r": this._handleRadius,
                "stroke": this._stroke,
                "stroke-width": this._strokeWidth
            });
            this._container.append(this._rotateHandle);
            this._rotateHandle
                .onStartDragging(function (p) {
                center = self._getCenter();
                t0 = self._target.transformation;
                p0 = p;
            })
                .onDragging(function (p1) {
                var c = center.transform(t0);
                var angle = _getAdjacentAngle(p0, p1, c);
                self._target.transformation = t0
                    .translate(c.opposite())
                    .rotate(angle)
                    .translate(c);
                self._update();
            });
        };
        SvgTransformer.prototype._createResizeHandles = function () {
            var self = this;
            var width = this._target.width;
            var height = this._target.height;
            var positionGroups = {
                diagonal: [
                    new Vector_10.Vector(0, 0),
                    new Vector_10.Vector(width, 0),
                    new Vector_10.Vector(0, height),
                    new Vector_10.Vector(width, height)
                ],
                horizontal: [
                    new Vector_10.Vector(width, height / 2),
                    new Vector_10.Vector(0, height / 2)
                ],
                vertical: [
                    new Vector_10.Vector(width / 2, 0),
                    new Vector_10.Vector(width / 2, height)
                ]
            };
            this._scaleHandles = {
                diagonal: [],
                horizontal: [],
                vertical: []
            };
            var _loop_2 = function (orientation_3) {
                var numHandles = orientation_3 === "diagonal" ? 4 : 2;
                var _loop_3 = function (i) {
                    var center;
                    var p0;
                    var t0;
                    var handle = new Handle_1.Handle({
                        "r": this_1._handleRadius,
                        "stroke": this_1._stroke,
                        "stroke-width": this_1._strokeWidth,
                        "fill": "transparent"
                    });
                    this_1._container.append(handle);
                    handle
                        .onStartDragging(function (p) {
                        center = self._getCenter();
                        t0 = self._target.transformation;
                        p0 = p;
                    })
                        .onDragging(function (p1) {
                        var c = center.transform(t0);
                        var v0 = p0.subtract(c);
                        var v1 = c.subtract(p1);
                        var norm0 = v0.norm();
                        var norm1 = v1.norm();
                        var scale = norm0 > 0 ? norm1 / norm0 : 1;
                        var value = new Vector_10.Vector(orientation_3 === "vertical" ? 1 : scale, orientation_3 === "horizontal" ? 1 : scale);
                        self._target.transformation = new Transformation_4.Transformation()
                            .translate(center.opposite())
                            .scale(value)
                            .translate(center)
                            .transform(t0);
                        self._update();
                    });
                    this_1._scaleHandles[orientation_3].push(handle);
                };
                for (var i = 0; i < numHandles; i++) {
                    _loop_3(i);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = ["diagonal", "horizontal", "vertical"]; _i < _a.length; _i++) {
                var orientation_3 = _a[_i];
                _loop_2(orientation_3);
            }
        };
        SvgTransformer.prototype._getCenter = function () {
            var width = this._target.width;
            var height = this._target.height;
            return new Vector_10.Vector(width / 2, height / 2);
        };
        return SvgTransformer;
    }());
});
define("euclidean/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("euclidean/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function rad2deg(angle) {
        return 180 * angle / Math.PI;
    }
    exports.rad2deg = rad2deg;
    function deg2rad(angle) {
        return Math.PI * angle / 180;
    }
    exports.deg2rad = deg2rad;
});
define("euclidean/dim2/Line", ["require", "exports", "euclidean/SquareMatrix", "euclidean/dim2/Transformation", "euclidean/dim2/Vector"], function (require, exports, SquareMatrix_3, Transformation_5, Vector_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Line = (function () {
        function Line(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
        Line.prototype.getParallel = function (p) {
            return new Line(p, this.direction);
        };
        Line.prototype.getPerpendicular = function (p) {
            return new Line(p, new Vector_11.Vector(-this.direction.y, this.direction.x));
        };
        Line.prototype.isParallel = function (l) {
            var v0 = this.direction;
            var v1 = l.direction;
            return v0.x * v1.y === v1.x * v0.y;
        };
        Line.prototype.getIntersection = function (l) {
            var _a = [this.origin, l.origin], p0 = _a[0], p1 = _a[1];
            var _b = [this.direction, l.direction], v0 = _b[0], v1 = _b[1];
            var m = new SquareMatrix_3.SquareMatrix(v0, v1.opposite());
            var v = p1.subtract(p0);
            var w = v.multiply(m.inverse());
            return p0.transform(new Transformation_5.Transformation().translate(v0.scale(w.x)));
        };
        return Line;
    }());
    exports.Line = Line;
});
