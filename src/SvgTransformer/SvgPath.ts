import {Point} from "../euclidean/dim2/Point";
import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class SvgPath extends SvgGraphicElement {

  constructor(attributes: {[key: string]: any} = {}) {
    super("path", attributes);
  }

  public moveTo(value: Point): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", `M${value.x} ${value.y}`].join(" "));

    return this;
  }

  public lineTo(value: Point): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", `L${value.x} ${value.y}`].join(" "));

    return this;
  }

  public close(): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", "Z"].join(" "));

    return this;
  }
}
