import {Point} from "../euclidean/dim2/Point";
import {Vector} from "../euclidean/dim2/Vector";
import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class Handle extends SvgGraphicElement {
  private _fillColor = "transparent";
  private _isVisible = true;

  constructor(attributes: {[key: string]: any} = {}) {
    super("circle", attributes);
    this.setAttr("fill", this._fillColor);
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
    this.nativeElement.style.display = this._isVisible ? "inline" : "none";
  }

  get position(): Point {
    const x = parseInt(this.getAttr("cx"), 10);
    const y = parseInt(this.getAttr("cy"), 10);

    return new Vector(x, y);
  }

  set position(value: Point) {
    this
      .setAttr("cx", value.x)
      .setAttr("cy", value.y);
  }
}
