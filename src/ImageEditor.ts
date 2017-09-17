import {Vector} from "./euclidean/Vector";
import {SvgGraphicElement} from "./svg/SvgGraphicElement";

export class ImageEditor {
  public test(): Vector {
    const elem = new SvgGraphicElement("g");
    console.log(elem); return new Vector(1, 2, 3);
  }
}
