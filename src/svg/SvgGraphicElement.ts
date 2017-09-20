import {Point} from "../euclidean/dim2/Point";
import {Transformation} from "../euclidean/dim2/Transformation";
import {Vector} from "../euclidean/dim2/Vector";
import {ITransformable} from "../euclidean/Transformation";
import {SvgElement} from "./SvgElement";

export class SvgGraphicElement
  extends SvgElement<SVGGraphicsElement>
  implements ITransformable {
  private _stopDraggingEventName: string;
  private _isDraggingInit: boolean = false;
  private _isDragging: boolean = false;

  constructor(
    target: string | SVGGraphicsElement,
    attributes: {[key: string]: any} = {}) {
    super(target, attributes);
  }

  public onStartDragging(listener: (init: Point) => void): SvgGraphicElement {
    const self = this;

    if (!this._isDraggingInit) {
      this._initDragging();
    }

    this.nativeElement.addEventListener("mousedown", (event) => {
      const t = self._getClientTransformation();
      const p = new Vector(event.clientX, event.clientY).transform(t);

      listener.apply(self, [p]);
    });

    return this;
  }

  public onDragging(listener: (p: Point) => void): SvgGraphicElement {
    const self = this;

    if (!this._isDraggingInit) {
      this._initDragging();
    }

    document.addEventListener("mousemove", (event) => {
      if (self._isDragging) {
        const t = self._getClientTransformation();
        const p = new Vector(event.clientX, event.clientY).transform(t);

        listener.apply(self, [p]);
      }
    });

    return this;
  }

  public onStopDragging(listener: (p: Point) => void): SvgGraphicElement {
    const self = this;

    if (!this._isDraggingInit) {
      this._initDragging();
    }

    this.nativeElement.addEventListener(
        self._stopDraggingEventName,
        (event: CustomEvent) => listener.apply(self, [event.detail]));

    return this;
  }

  get transformation(): Transformation {
    const style = window.getComputedStyle(this.nativeElement, null);
    const value = style.getPropertyValue("transform");
    const matches = value.match(
      /^matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)$/);
    let ret = new Transformation();

    if (matches !== null) {
      const [a, b, c, d, e, f] = matches
        .filter((elem, index) => index > 0)
        .map((match) => parseFloat(match));

      ret = Transformation.createFromValues(a, b, c, d, e, f);
    }

    return ret;
  }

  set transformation(value: Transformation) {
    if (value === undefined || value === null) {
      this.removeAttr("transform");
    } else {
      this.setAttr("transform", value.toString());
    }
  }

  public transform(t: Transformation): SvgGraphicElement {
    this.setAttr("transform", this.transformation.transform(t).toString());

    return this;
  }

  public translate(value: Vector): SvgGraphicElement {
    this.transform(new Transformation().translate(value));

    return this;
  }

  public rotate(angle: number, params?: {center: boolean}): SvgGraphicElement {
    const center = params !== undefined && params.center
      ? this._getCenter()
      : new Vector(0, 0);

    return this.transform(
      new Transformation().rotate(angle, {center}));
  }

  public scale(
    value: number|Vector, params?: {center: boolean}): SvgGraphicElement {
    const center = params !== undefined && params.center
      ? this._getCenter()
      : new Vector(0, 0);

    return this.transform(
      new Transformation().scale(value, {center}));
  }

  public skew(
    value: number|Vector, params?: {center: boolean}): SvgGraphicElement {
    const center = params !== undefined && params.center
      ? this._getCenter()
      : new Vector(0, 0);

    return this.transform(
      new Transformation().skew(value, {center}));
  }

  public getBoundingBox():
    {x: number, y: number, width: number, height: number} {
    const box = this.nativeElement.getBBox();

    return {x: box.x, y: box.y, width: box.width, height: box.height};
  }

  public remove(): void {
    this._isDragging = false;
    super.remove();
  }

  // Generates a random ID.
  //
  // Thanks to: https://stackoverflow.com/a/105074/1704895
  private _generateId(): string {
    const t = (repeat: number = 1) => {
      const ret = [];

      for (let i = 0; i < repeat; i++) {
        ret.push(Math
          .floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1));
      }

      return ret.join("");
    };

    return t(2) + "_" + t() + "_" + t() + "_" + t() + "_" + t(3);
  }

  // Initializes the dragging
  private _initDragging() {
    const self = this;

    this._stopDraggingEventName = `stopdragging_${this._generateId()}`;

    this.nativeElement.addEventListener("mousedown", (event) => {
      self._isDragging = true;
    });

    for (const eventName of ["mouseup", "mouseleave", "blur"]) {
      document.addEventListener(eventName, (event) => {
        if (self._isDragging) {
          const t = self._getClientTransformation();
          const p = event instanceof MouseEvent
            ? new Vector(event.clientX, event.clientY).transform(t)
            : null;

          self.nativeElement.dispatchEvent(
            new CustomEvent(self._stopDraggingEventName, {detail: p}));
        }

        self._isDragging = false;
      });
    }

    this._isDraggingInit = true;
  }

  // Gets the center from the parent's reference system.
  private _getCenter(): Point {
    const box = this.getBoundingBox();
    const center = new Vector(box.x + box.width / 2, box.y + box.height / 2);

    return center.transform(this.transformation);
  }

  private _getClientTransformation(): Transformation {
    const canvas = this.ownerElement;
    const ctm = canvas.nativeElement.getScreenCTM();

    return Transformation.createFromValues(
      ctm.a, ctm.b, ctm.c, ctm.d, ctm.e, ctm.f).inverse();
  }
}
