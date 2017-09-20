import {Vector} from "./euclidean/Vector";
import {ElementTransformer} from "./svg/ElementTransformer";
import {SvgGraphicElement} from "./svg/SvgGraphicElement";

export = class ImageEditor {
  private _canvas: SvgGraphicElement;

  constructor(svgId: string) {
    this._canvas = new SvgGraphicElement(
      document.querySelector(`#${svgId}`) as SVGSVGElement);

    const self = this;
    const nativeCanvas = this._canvas.nativeElement;
    this._canvas.nativeElement.addEventListener("mousedown", (event) => {
      if (event.target instanceof SVGGraphicsElement) {
        const target = self._getElementContainer(event.target);

        if (target !== null) {
          const obj = new SvgGraphicElement(target);
          const editor = new ElementTransformer(obj);
        }
      }
    });
  }

  public _getElementContainer(elem: SVGGraphicsElement): SVGGraphicsElement {
    let ret = null;

    if (elem instanceof SVGGraphicsElement) {
      const root = elem.ownerSVGElement;

      if (root !== null) {
        ret = elem;
        if (elem.parentNode instanceof SVGGraphicsElement
          && elem.parentNode !== root) {
          ret = this._getElementContainer(elem.parentNode);
        }
      }
    }

    return ret;
  }
};
