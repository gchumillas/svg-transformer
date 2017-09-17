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
define("euclidean/Matrix", ["require", "exports", "euclidean/Vector"], function (require, exports, Vector_1) {
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
                vectors.push(new (Vector_1.Vector.bind.apply(Vector_1.Vector, [void 0].concat(coords)))());
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
define("euclidean/SquareMatrix", ["require", "exports", "euclidean/Matrix", "euclidean/Vector"], function (require, exports, Matrix_1, Vector_2) {
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
                return new (Vector_2.Vector.bind.apply(Vector_2.Vector, [void 0].concat(vector.coordinates.map(function (value, row) {
                    return _this._getCofactor(col, row);
                }))))();
            }))))().transpose();
        };
        SquareMatrix.prototype.determinant = function () {
            var _this = this;
            var vector = this.width > 0 ? this.vectors[0] : new Vector_2.Vector();
            var initVal = this.width > 0 ? 0 : 1;
            return vector.coordinates.reduce(function (prev, current, index) {
                return prev + current * _this._getCofactor(0, index);
            }, initVal);
        };
        SquareMatrix.prototype.inverse = function () {
            return this.adjoint().scale(1 / this.determinant());
        };
        SquareMatrix.prototype._getCofactor = function (col, row) {
            var sign = (col + row) % 2 > 0 ? -1 : +1;
            var m = new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(this.vectors.filter(function (vector, index) { return index !== col; }).map(function (vector, index) { return new (Vector_2.Vector.bind.apply(Vector_2.Vector, [void 0].concat(vector.coordinates.filter(function (value, i) { return i !== row; }))))(); }))))();
            return sign * m.determinant();
        };
        return SquareMatrix;
    }(Matrix_1.Matrix));
    exports.SquareMatrix = SquareMatrix;
});
define("euclidean/Transformation", ["require", "exports", "euclidean/SquareMatrix", "euclidean/Vector"], function (require, exports, SquareMatrix_1, Vector_3) {
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
                .every(function (vector) { return vector.coordinates.slice(-1) === [1]; });
            if (!test1) {
                throw new Error("The last coordinate of the last vector must be 1");
            }
            var test2 = vectors
                .slice(0, -1)
                .every(function (vector) { return vector.coordinates.slice(-1) === [0]; });
            if (!test2) {
                throw new Error("The last coordinate of the first vectors must be 0");
            }
            return _this;
        }
        Transformation.prototype.inverse = function () {
            var vectors = _super.prototype.inverse.call(this).vectors;
            return new (Transformation.bind.apply(Transformation, [void 0].concat(vectors.slice(0, -1).map(function (vector) { return new (Vector_3.Vector.bind.apply(Vector_3.Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([0]))))(); }).concat(vectors.slice(-1).map(function (vector) { return new (Vector_3.Vector.bind.apply(Vector_3.Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([1]))))(); })))))();
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
        Transformation.prototype.transform = function (t) {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(_super.prototype.transform.call(this, t).vectors)))();
        };
        Transformation.prototype.inverse = function () {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(_super.prototype.inverse.call(this).vectors)))();
        };
        Transformation.prototype.translate = function (v) {
            return this.transform(new Transformation(new Vector_5.Vector(1, 0, 0), new Vector_5.Vector(0, 1, 0), new Vector_5.Vector(v.x, v.y, 1)));
        };
        Transformation.prototype.rotate = function (angle, params) {
            var ret = null;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var c = params !== undefined ? params.center : new Vector_6.Vector(0, 0);
            return this.transform(new Transformation(new Vector_5.Vector(cos, sin, 0), new Vector_5.Vector(-sin, cos, 0), new Vector_5.Vector((1 - cos) * c.x + sin * c.y, (1 - cos) * c.y - sin * c.x, 1)));
        };
        Transformation.prototype.scale = function (value, params) {
            var xScale = value instanceof Vector_6.Vector ? value.x : value;
            var yScale = value instanceof Vector_6.Vector ? value.y : value;
            var c = params !== undefined ? params.center : new Vector_6.Vector(0, 0);
            return this.transform(new Transformation(new Vector_5.Vector(xScale, 0, 0), new Vector_5.Vector(0, yScale, 0), new Vector_5.Vector((1 - xScale) * c.x, (1 - yScale) * c.y, 1)));
        };
        Transformation.prototype.skew = function (value, params) {
            var xTan = value instanceof Vector_6.Vector ? Math.tan(value.x) : Math.tan(value);
            var yTan = value instanceof Vector_6.Vector ? Math.tan(value.y) : Math.tan(value);
            var c = params !== undefined ? params.center : new Vector_6.Vector(0, 0);
            return this.transform(new Transformation(new Vector_5.Vector(1, yTan, 0), new Vector_5.Vector(xTan, 1, 0), new Vector_5.Vector(-xTan * c.y, -yTan * c.x, 1)));
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
        SvgElement.prototype.append = function (element) {
            this.nativeElement.appendChild(element.nativeElement);
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
            _this.isDraggingInit = false;
            _this.isDragging = false;
            return _this;
        }
        SvgGraphicElement.prototype.onStartDragging = function (listener) {
            var self = this;
            if (!this.isDraggingInit) {
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
            if (!this.isDraggingInit) {
                this._initDragging();
            }
            document.addEventListener("mousemove", function (event) {
                if (self.isDragging) {
                    var t = self._getClientTransformation();
                    var p = new Vector_7.Vector(event.clientX, event.clientY).transform(t);
                    listener.apply(self, [p]);
                }
            });
            return this;
        };
        SvgGraphicElement.prototype.onStopDragging = function (listener) {
            var self = this;
            if (!this.isDraggingInit) {
                this._initDragging();
            }
            this.nativeElement.addEventListener(self.stopDraggingEventName, function (event) { return listener.apply(self, [event.detail]); });
            return this;
        };
        Object.defineProperty(SvgGraphicElement.prototype, "transformation", {
            get: function () {
                var style = window.getComputedStyle(this.nativeElement, null);
                var value = style.getPropertyValue("transform");
                var matches = value.match(/^matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)$/);
                var ret = new Transformation_2.Transformation();
                if (matches !== null) {
                    var _a = matches
                        .filter(function (elem, index) { return index > 0; })
                        .map(function (match) { return parseFloat(match); }), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
                    ret = Transformation_2.Transformation.createFromValues(a, b, c, d, e, f);
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
        SvgGraphicElement.prototype.translate = function (value) {
            this.transform(new Transformation_2.Transformation().translate(value));
            return this;
        };
        SvgGraphicElement.prototype.rotate = function (angle, params) {
            var center = params !== undefined && params.center
                ? this._getCenter()
                : new Vector_7.Vector(0, 0);
            return this.transform(new Transformation_2.Transformation().rotate(angle, { center: center }));
        };
        SvgGraphicElement.prototype.scale = function (value, params) {
            var center = params !== undefined && params.center
                ? this._getCenter()
                : new Vector_7.Vector(0, 0);
            return this.transform(new Transformation_2.Transformation().scale(value, { center: center }));
        };
        SvgGraphicElement.prototype.skew = function (value, params) {
            var center = params !== undefined && params.center
                ? this._getCenter()
                : new Vector_7.Vector(0, 0);
            return this.transform(new Transformation_2.Transformation().skew(value, { center: center }));
        };
        SvgGraphicElement.prototype.getBoundingBox = function () {
            var box = this.nativeElement.getBBox();
            return { x: box.x, y: box.y, width: box.width, height: box.height };
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
            this.stopDraggingEventName = "stopdragging_" + this._generateId();
            this.nativeElement.addEventListener("mousedown", function (event) {
                self.isDragging = true;
            });
            for (var _i = 0, _a = ["mouseup", "mouseleave", "blur"]; _i < _a.length; _i++) {
                var eventName = _a[_i];
                document.addEventListener(eventName, function (event) {
                    if (self.isDragging) {
                        var t = self._getClientTransformation();
                        var p = event instanceof MouseEvent
                            ? new Vector_7.Vector(event.clientX, event.clientY).transform(t)
                            : null;
                        self.nativeElement.dispatchEvent(new CustomEvent(self.stopDraggingEventName, { detail: p }));
                    }
                    self.isDragging = false;
                });
            }
            this.isDraggingInit = true;
        };
        SvgGraphicElement.prototype._getCenter = function () {
            var box = this.getBoundingBox();
            var center = new Vector_7.Vector(box.x + box.width / 2, box.y + box.height / 2);
            return center.transform(this.transformation);
        };
        SvgGraphicElement.prototype._getClientTransformation = function () {
            var canvas = this.ownerElement;
            var ctm = canvas.nativeElement.getScreenCTM();
            return Transformation_2.Transformation.createFromValues(ctm.a, ctm.b, ctm.c, ctm.d, ctm.e, ctm.f).inverse();
        };
        return SvgGraphicElement;
    }(SvgElement_1.SvgElement));
    exports.SvgGraphicElement = SvgGraphicElement;
});
define("ImageEditor", ["require", "exports", "euclidean/Vector", "svg/SvgGraphicElement"], function (require, exports, Vector_8, SvgGraphicElement_2) {
    "use strict";
    return (function () {
        function ImageEditor() {
        }
        ImageEditor.prototype.test = function () {
            var elem = new SvgGraphicElement_2.SvgGraphicElement("g");
            console.log(elem);
            return new Vector_8.Vector(1, 2, 3);
        };
        return ImageEditor;
    }());
});
define("euclidean/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("euclidean/dim2/Line", ["require", "exports", "euclidean/SquareMatrix", "euclidean/dim2/Transformation", "euclidean/dim2/Vector"], function (require, exports, SquareMatrix_2, Transformation_3, Vector_9) {
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
            return new Line(p, new Vector_9.Vector(-this.direction.y, this.direction.x));
        };
        Line.prototype.isParallel = function (l) {
            var v0 = this.direction;
            var v1 = l.direction;
            return v0.x * v1.y === v1.x * v0.y;
        };
        Line.prototype.getIntersection = function (l) {
            var _a = [this.origin, l.origin], p0 = _a[0], p1 = _a[1];
            var _b = [this.direction, l.direction], v0 = _b[0], v1 = _b[1];
            var m = new SquareMatrix_2.SquareMatrix(v0, v1.opposite());
            var v = p1.subtract(p0);
            var w = v.multiply(m.inverse());
            return p0.transform(new Transformation_3.Transformation().translate(v0.scale(w.x)));
        };
        return Line;
    }());
    exports.Line = Line;
});
define("svg/SvgPath", ["require", "exports", "svg/SvgGraphicElement"], function (require, exports, SvgGraphicElement_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SvgPath = (function (_super) {
        __extends(SvgPath, _super);
        function SvgPath() {
            var _this = _super.call(this, "path") || this;
            _this.strokeColor = "black";
            _this.strokeWidth = 2;
            _this
                .setAttr("stroke", _this.strokeColor)
                .setAttr("stroke-width", _this.strokeWidth)
                .setAttr("fill", "transparent");
            return _this;
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
    }(SvgGraphicElement_3.SvgGraphicElement));
    exports.SvgPath = SvgPath;
});
define("svg/Transformer/Dragger", ["require", "exports", "euclidean/dim2/Vector", "svg/SvgGraphicElement"], function (require, exports, Vector_10, SvgGraphicElement_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dragger = (function (_super) {
        __extends(Dragger, _super);
        function Dragger() {
            var _this = _super.call(this, "rect") || this;
            _this
                .setAttr("fill", "000")
                .setAttr("opacity", 0);
            return _this;
        }
        Object.defineProperty(Dragger.prototype, "position", {
            get: function () {
                var x = parseInt(this.getAttr("x"), 10);
                var y = parseInt(this.getAttr("y"), 10);
                return new Vector_10.Vector(x, y);
            },
            set: function (value) {
                this
                    .setAttr("x", value.x)
                    .setAttr("y", value.y);
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
    }(SvgGraphicElement_4.SvgGraphicElement));
    exports.Dragger = Dragger;
});
define("svg/Transformer/Handle", ["require", "exports", "euclidean/dim2/Vector", "svg/SvgGraphicElement"], function (require, exports, Vector_11, SvgGraphicElement_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Handle = (function (_super) {
        __extends(Handle, _super);
        function Handle() {
            var _this = _super.call(this, "circle") || this;
            _this.radius = 10;
            _this.strokeColor = "black";
            _this.strokeWidth = 2;
            _this.fillColor = "transparent";
            _this
                .setAttr("r", _this.radius)
                .setAttr("stroke", _this.strokeColor)
                .setAttr("stroke-width", _this.strokeWidth)
                .setAttr("fill", _this.fillColor);
            return _this;
        }
        Object.defineProperty(Handle.prototype, "position", {
            get: function () {
                var x = parseInt(this.getAttr("cx"), 10);
                var y = parseInt(this.getAttr("cy"), 10);
                return new Vector_11.Vector(x, y);
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
    }(SvgGraphicElement_5.SvgGraphicElement));
    exports.Handle = Handle;
});
define("svg/Transformer", ["require", "exports", "euclidean/dim2/Transformation", "euclidean/dim2/Vector", "euclidean/SquareMatrix", "svg/SvgGraphicElement", "svg/SvgPath", "svg/Transformer/Dragger", "svg/Transformer/Handle"], function (require, exports, Transformation_4, Vector_12, SquareMatrix_3, SvgGraphicElement_6, SvgPath_1, Dragger_1, Handle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElementTransformer = (function () {
        function ElementTransformer(target) {
            this.target = target;
            var canvas = this.target.ownerElement;
            this.container = new SvgGraphicElement_6.SvgGraphicElement("g");
            this.container.transform(this.target.transformation);
            canvas.append(this.container);
            this._createPath();
            this._createDragger();
            this._createRotateHandle();
            this._createResizeHandles();
        }
        ElementTransformer.prototype._createPath = function () {
            var box = this.target.getBoundingBox();
            var path = new SvgPath_1.SvgPath()
                .moveTo(new Vector_12.Vector(box.x + box.width / 2, box.y - 30))
                .lineTo(new Vector_12.Vector(box.x + box.width / 2, box.y))
                .lineTo(new Vector_12.Vector(box.x, box.y))
                .lineTo(new Vector_12.Vector(box.x, box.y + box.height))
                .lineTo(new Vector_12.Vector(box.x + box.width, box.y + box.height))
                .lineTo(new Vector_12.Vector(box.x + box.width, box.y))
                .lineTo(new Vector_12.Vector(box.x + box.width / 2, box.y));
            this.container.append(path);
        };
        ElementTransformer.prototype._createDragger = function () {
            var self = this;
            var box = this.target.getBoundingBox();
            var p0;
            var t0;
            var dragger = new Dragger_1.Dragger();
            dragger.position = new Vector_12.Vector(box.x, box.y);
            dragger.width = box.width;
            dragger.height = box.height;
            this.container.append(dragger);
            dragger
                .onStartDragging(function (p) {
                t0 = self.container.transformation;
                p0 = p;
            })
                .onDragging(function (p1) {
                var v = p1.subtract(p0);
                self.container.transformation = t0.translate(v);
                self.target.transformation = self.container.transformation;
            });
        };
        ElementTransformer.prototype._createRotateHandle = function () {
            var self = this;
            var box = this.target.getBoundingBox();
            var center;
            var p0;
            var t0;
            var rotateHandle = new Handle_1.Handle();
            rotateHandle.position = new Vector_12.Vector(box.x + box.width / 2, box.y - 30);
            this.container.append(rotateHandle);
            rotateHandle
                .onStartDragging(function (p) {
                center = self._getCenter();
                t0 = self.container.transformation;
                p0 = p;
            })
                .onDragging(function (p1) {
                var angle = _getAdjacentAngle(p0, p1, center.transform(t0));
                self.container.transformation = t0.rotate(angle, { center: center.transform(t0) });
                self.target.transformation = self.container.transformation;
            });
        };
        ElementTransformer.prototype._createResizeHandles = function () {
            var self = this;
            var box = this.target.getBoundingBox();
            var positionGroups = {
                diagonal: [
                    new Vector_12.Vector(box.x, box.y),
                    new Vector_12.Vector(box.x + box.width, box.y),
                    new Vector_12.Vector(box.x, box.y + box.height),
                    new Vector_12.Vector(box.x + box.width, box.y + box.height)
                ],
                horizontal: [
                    new Vector_12.Vector(box.x + box.width, box.y + box.height / 2),
                    new Vector_12.Vector(box.x, box.y + box.height / 2)
                ],
                vertical: [
                    new Vector_12.Vector(box.x + box.width / 2, box.y),
                    new Vector_12.Vector(box.x + box.width / 2, box.y + box.height)
                ]
            };
            var _loop_1 = function (orientation_1) {
                if (!positionGroups.hasOwnProperty(orientation_1)) {
                    return "continue";
                }
                var positions = positionGroups[orientation_1];
                var _loop_2 = function (position) {
                    var center;
                    var p0;
                    var t0;
                    var handle = new Handle_1.Handle();
                    handle.position = position;
                    this_1.container.append(handle);
                    handle
                        .onStartDragging(function (p) {
                        center = self._getCenter();
                        t0 = self.container.transformation;
                        p0 = p;
                    })
                        .onDragging(function (p1) {
                        var c = center.transform(t0);
                        var v0 = p0.subtract(c);
                        var v1 = c.subtract(p1);
                        var norm0 = v0.norm();
                        var norm1 = v1.norm();
                        var scale = norm0 > 0 ? norm1 / norm0 : 1;
                        var value = new Vector_12.Vector(orientation_1 === "vertical" ? 1 : scale, orientation_1 === "horizontal" ? 1 : scale);
                        self.container.transformation = new Transformation_4.Transformation()
                            .scale(value, { center: center })
                            .transform(t0);
                        self.target.transformation = self.container.transformation;
                    });
                };
                for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
                    var position = positions_1[_i];
                    _loop_2(position);
                }
            };
            var this_1 = this;
            for (var orientation_1 in positionGroups) {
                _loop_1(orientation_1);
            }
        };
        ElementTransformer.prototype._getCenter = function () {
            var box = this.target.getBoundingBox();
            return new Vector_12.Vector(box.x + box.width / 2, box.y + box.width / 2);
        };
        return ElementTransformer;
    }());
    exports.ElementTransformer = ElementTransformer;
    function _getAdjacentAngle(p0, p1, p2) {
        var u = p1.subtract(p2);
        var u0 = u.unit();
        var u1 = new Vector_12.Vector(u0.y, -u0.x);
        var v = p0.subtract(p2);
        var m = new SquareMatrix_3.SquareMatrix(u0, u1);
        var w = v.multiply(m.inverse());
        return _getAngle(w);
    }
    function _getAngle(p) {
        var ret = NaN;
        var _a = [p.x, p.y], x = _a[0], y = _a[1];
        if (x > 0 && !(y < 0)) {
            ret = Math.atan(y / x);
        }
        else if (!(x > 0) && y > 0) {
            ret = x < 0
                ? Math.atan(y / x) + Math.PI
                : Math.PI / 2;
        }
        else if (x < 0 && !(y > 0)) {
            ret = Math.atan(y / x) + Math.PI;
        }
        else if (!(x < 0) && y < 0) {
            ret = x > 0
                ? Math.atan(y / x) + 2 * Math.PI
                : 3 * Math.PI / 2;
        }
        return ret;
    }
});
