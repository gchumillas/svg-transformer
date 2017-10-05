import {Point} from "../euclidean/dim2/Point";
import {Transformation} from "../euclidean/dim2/Transformation";
import {Vector} from "../euclidean/dim2/Vector";
import {SquareMatrix} from "../euclidean/SquareMatrix";
import {Dragger} from "./ElementTransformer/Dragger";
import {Handle} from "./ElementTransformer/Handle";
import {SvgElement} from "./SvgElement";
import {SvgGraphicElement} from "./SvgGraphicElement";
import {SvgPath} from "./SvgPath";

// A decorator class to 'transform' (resize, scale or rotate) an SVG element.
export class ElementTransformer {
  private _canvas: SvgGraphicElement;
  private _isVisible: boolean;
  private _elements: SvgGraphicElement[];
  private _container: SvgGraphicElement;
  private _path: SvgGraphicElement;
  private _dragger: Dragger;
  private _rotateHandle: Handle;
  private _scaleHandles: {
    [key: string]: Handle[],
    diagonal: Handle[],
    horizontal: Handle[],
    vertical: Handle[]};

  get elements(): SVGGraphicsElement[] {
    return this._elements.map((value) => value.nativeElement);
  }

  get container(): SVGGraphicsElement {
    return this._container.nativeElement;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  public show(elements: Element|Element[]|NodeListOf<Element>): void {
    const items = elements instanceof Element ? [elements] : elements;
    const len = items.length;

    if (len === 0) {
      throw new Error("Zero elements found in the list");
    }

    this.hide();

    this._canvas = null;
    this._elements = [];
    for (let i = 0; i < len; i++) {
      const elem = items[i];

      if (elem instanceof SVGGraphicsElement) {
        const item = new SvgGraphicElement(elem);
        const canvas = elem.ownerSVGElement;

        if (!this._canvas) {
          this._canvas = new SvgGraphicElement(canvas);
        } else if (!this._canvas.nativeElement.isSameNode(canvas)) {
          throw new Error("The elements must belong to the same SVG element");
        }

        this._elements.push(item);
      } else {
        const maxLen = 100;
        const ellipsis = "...";
        let outerHtml = elem.outerHTML || "";

        outerHtml = outerHtml.replace(/\s+/g, " ");
        if (outerHtml.length > maxLen) {
          outerHtml = outerHtml.substring(0, maxLen - ellipsis.length) +
            ellipsis;
        }

        throw Error(
          `The following element is not a SVGGraphicsElement: ${outerHtml}`);
      }
    }

    this._container = new SvgGraphicElement("g");
    this._canvas.append(this._container);

    // this._createPath();
    this._createDragger();
    this._createRotateHandle();
    this._createResizeHandles();
    this._update();

    this._isVisible = true;
  }

  public hide(): void {
    if (!this._isVisible) {
      return;
    }

    // removes scale handles
    for (const orientation in this._scaleHandles) {
      if (!this._scaleHandles.hasOwnProperty(orientation)) {
        continue;
      }

      const handles = this._scaleHandles[orientation];
      for (const handle of handles) {
        handle.remove();
      }
    }

    // this._path.remove();
    this._dragger.remove();
    this._rotateHandle.remove();
    this._container.remove();

    this._isVisible = false;
  }

  private _update(): void {
    const box = this._elements[0].boundingBox;
    const t = this._elements[0].transformation;

    this._dragger.transformation = this._elements[0].transformation;

    // redraws the path
    // this._path.remove();
    // this._createPath();

    // places rotate handle
    this._rotateHandle.position = new Vector(box.x + box.width / 2, box.y - 30)
      .transform(t);

    // places scale handles
    const orientations: {[key: string]: Vector[]} = {
      diagonal: [
        new Vector(box.x, box.y),
        new Vector(box.x + box.width, box.y),
        new Vector(box.x, box.y + box.height),
        new Vector(box.x + box.width, box.y + box.height)],
      horizontal: [
        new Vector(box.x + box.width, box.y + box.height / 2),
        new Vector(box.x, box.y + box.height / 2)],
      vertical: [
        new Vector(box.x + box.width / 2, box.y),
        new Vector(box.x + box.width / 2, box.y + box.height)]};
    for (const orientation in orientations) {
      if (!orientations.hasOwnProperty(orientation)) {
        continue;
      }

      const positions = orientations[orientation];
      const handles = this._scaleHandles[orientation];
      for (const i in handles) {
        if (!handles.hasOwnProperty(i)) {
          continue;
        }

        const position = positions[i];
        const handle = handles[i];

        handle.position = position.transform(t);
      }
    }
  }

  private _createPath(): void {
    const box = this._elements[0].boundingBox;
    const t = this._elements[0].transformation;

    // points of reference
    const p0 = new Vector(box.x + box.width / 2, box.y - 30).transform(t);
    const p1 = new Vector(box.x + box.width / 2, box.y).transform(t);
    const p2 = new Vector(box.x, box.y).transform(t);
    const p3 = new Vector(box.x, box.y + box.height).transform(t);
    const p4 = new Vector(box.x + box.width, box.y + box.height).transform(t);
    const p5 = new Vector(box.x + box.width, box.y).transform(t);

    // redraws the path
    this._path = new SvgPath()
      .moveTo(p0)
      .lineTo(p1).lineTo(p2).lineTo(p3).lineTo(p4).lineTo(p5).lineTo(p1);
    this._container.prepend(this._path);
  }

  // The 'dragger' is used to move the image. It consists of a transparent
  // rectangle placed over the image.
  private _createDragger(): void {
    const self = this;
    const box = this._elements[0].boundingBox;
    let p0: Point;
    let t0: Transformation;

    // creates a 'dragger' and places it over the image
    this._dragger = new Dragger();
    this._dragger.position = new Vector(box.x, box.y);
    this._dragger.width = box.width;
    this._dragger.height = box.height;
    this._container.append(this._dragger);

    this._dragger
      .onStartDragging((p) => {
        t0 = self._elements[0].transformation;
        p0 = p;
      })
      .onDragging((p1) => {
        const v = p1.subtract(p0);

        self._elements[0].transformation = t0.translate(v);
        self._update();
      });
  }

  // The 'Rotate handle' is ued to rotate the image. It is placed on the top of
  // the image.
  private _createRotateHandle(): void {
    const self = this;
    let center: Point;
    let p0: Point;
    let t0: Transformation;

    // creates a handle and places it on the top of the transformation tool
    this._rotateHandle = new Handle();
    this._container.append(this._rotateHandle);

    this._rotateHandle
      .onStartDragging((p) => {
        center = self._getCenter();
        t0 = self._elements[0].transformation;
        p0 = p;
      })
      .onDragging((p1) => {
        const c = center.transform(t0);
        const angle = _getAdjacentAngle(p0, p1, c);

        self._elements[0].transformation = t0
          .translate(c.opposite())
          .rotate(angle)
          .translate(c);
        self._update();
      });
  }

  private _createResizeHandles(): void {
    const self = this;

    // calculates the handle positions
    const box = this._elements[0].boundingBox;
    const positionGroups: {[key: string]: Vector[]} = {
      diagonal: [
        new Vector(box.x, box.y),
        new Vector(box.x + box.width, box.y),
        new Vector(box.x, box.y + box.height),
        new Vector(box.x + box.width, box.y + box.height)],
      horizontal: [
        new Vector(box.x + box.width, box.y + box.height / 2),
        new Vector(box.x, box.y + box.height / 2)],
      vertical: [
        new Vector(box.x + box.width / 2, box.y),
        new Vector(box.x + box.width / 2, box.y + box.height)]};

    this._scaleHandles = {
      diagonal: [],
      horizontal: [],
      vertical: []};
    for (const orientation of ["diagonal", "horizontal", "vertical"]) {
      const numHandles = orientation === "diagonal" ? 4 : 2;

      for (let i = 0; i < numHandles; i++) {
        let center: Point;
        let p0: Point;
        let t0: Transformation;

        const handle = new Handle();
        this._container.append(handle);

        handle
          .onStartDragging((p) => {
            center = self._getCenter();
            t0 = self._elements[0].transformation;
            p0 = p;
          })
          .onDragging((p1) => {
            const c = center.transform(t0);
            const v0 = p0.subtract(c);
            const v1 = c.subtract(p1);
            const norm0 = v0.norm();
            const norm1 = v1.norm();
            const scale = norm0 > 0 ? norm1 / norm0 : 1;
            const value = new Vector(
              orientation === "vertical" ? 1 : scale,
              orientation === "horizontal" ? 1 : scale);

            self._elements[0].transformation = new Transformation()
              .translate(center.opposite())
              .scale(value)
              .translate(center)
              .transform(t0);

            self._update();
          });

        this._scaleHandles[orientation].push(handle);
      }
    }
  }

  private _getCenter(): Point {
    const box = this._elements[0].boundingBox;

    return new Vector(box.x + box.width / 2, box.y + box.width / 2);
  }
}

// Gets the angle adjacent to [p2] of the triangle defined by
// [p0], [p1] and [p2] in the direction of the hands of a clock.
//
// Just imagine that the segment [p0, p2] is the hour hand and
// the segment [p1, p2] is the minute hand. This function calculates the
// angle enclosed between those two hands in the direction of the hands
// of a clock.
function _getAdjacentAngle(p0: Point, p1: Point, p2: Point): number {
  // creates an orthonormal reference system
  const u = p1.subtract(p2);
  const u0 = u.unit();
  const u1 = new Vector(u0.y, -u0.x);

  // expresses the vector [p2, p0] from the orthonormal reference system
  const v = p0.subtract(p2);
  const m = new SquareMatrix(u0, u1);
  const w = v.multiply(m.inverse());

  return Math.atan2(w.y, w.x);
}
