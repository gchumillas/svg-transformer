import {Transformation} from "./euclidean/dim2/Transformation";
import {Vector} from "./euclidean/dim2/Vector";
import {deg2rad} from "./euclidean/utils";
import {ElementTransformer} from "./svg/ElementTransformer";
import {SvgGroup} from "./svg/ElementTransformer/SvgGroup";
import {SvgGraphicElement} from "./svg/SvgGraphicElement";

export = class ImageEditor {
  private _canvas: SvgGraphicElement;
  private _transformer: ElementTransformer;

  constructor(svgId: string) {
    /*
    this._canvas = new SvgGraphicElement(
      document.querySelector(`#${svgId}`) as SVGSVGElement);*/

    /*
    const elem1 = new SvgGraphicElement(
      document.querySelector("#path1") as SVGGraphicsElement);
    const elem2 = new SvgGraphicElement(
      document.querySelector("#rect1") as SVGGraphicsElement);
    const g = new SvgGroup([elem1, elem2]);*/

    const elements = document.querySelectorAll(`#${svgId} > *`);
    const t = new ElementTransformer();
    t.show(elements);

    /*
    const self = this;
    const nativeCanvas = this._canvas.nativeElement;
    this._canvas.nativeElement.addEventListener("mousedown", (event) => {
      if (event.target instanceof SVGGraphicsElement) {
        const target = self._getElementContainer(event.target);
        const container = self._transformer
          ? self._transformer.container : null;

        if (!target || !target.isSameNode(container)) {
          // removes the current transformer, if applicable
          if (self._transformer) {
            self._transformer.hide();
          }
          self._transformer = null;

          if (target) {
            self._transformer = new ElementTransformer([target]);
          }
        }
      }
    });*/
  }

  public _getElementContainer(elem: SVGGraphicsElement): SVGGraphicsElement {
    let ret = null;

    if (elem instanceof SVGGraphicsElement) {
      const root = elem.ownerSVGElement;

      if (root) {
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
