import {Point} from "../../euclidean/dim2/Point";
import {Vector} from "../../euclidean/dim2/Vector";
import {SvgGraphicElement} from "./../SvgGraphicElement";

export class Dragger extends SvgGraphicElement {
  private _backgroundColor = "000";
  private _opacity = 0;

  constructor() {
    super("rect");

    this
      .setAttr("fill", this._backgroundColor)
      .setAttr("opacity", this._opacity);
  }

  get width(): number {
    return parseInt(this.getAttr("width"), 10);
  }

  set width(value: number) {
    this.setAttr("width", value);
  }

  get height(): number {
    return parseInt(this.getAttr("height"), 10);
  }

  set height(value: number) {
    this.setAttr("height", value);
  }
}
