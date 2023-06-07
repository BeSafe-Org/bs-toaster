import { ToastBody, ToastType } from './bs-toaster';
import { ERROR_ICON_SVG, INFORMATION_ICON_SVG, SUCCESS_ICON_SVG, WARNING_ICON_SVG } from './svg';

type ToastStructureRequirments = {
    toastStructure: HTMLDivElement,
    variables: {
        toastVerticalLine: HTMLDivElement,
        toastIconDiv: HTMLDivElement,
        toastIconImg: HTMLImageElement,
        toastMessage: HTMLDivElement,
        toastCloseButton: HTMLDivElement
    }
}
type CloningRequirments = {
    toastType: ToastType,
    toastBody: ToastBody,
    imageSrc: {
        errorIconSrc: string,
        warningIconSrc: string,
        successIconSrc: string,
        informationIconSrc: string
    }
}

export class ToastStructure {
    private static readonly SVG = {
        errorIconSvg: ERROR_ICON_SVG,
        warningIconSvg: WARNING_ICON_SVG,
        successIconSvg: SUCCESS_ICON_SVG,
        informationIconSvg: INFORMATION_ICON_SVG,
    }

    private _requirments: ToastStructureRequirments;

    constructor(toastStructureRequirments: ToastStructureRequirments) {
        this._requirments = toastStructureRequirments;
    }

    public cloneNewToast(cloningRequirments: CloningRequirments) {
        this._requirments.variables.toastVerticalLine.style.backgroundColor = this.getToastColor(cloningRequirments.toastType);
        this.addToastIcon(cloningRequirments.imageSrc[`${cloningRequirments.toastType}IconSrc`], ToastStructure.SVG[`${cloningRequirments.toastType}IconSvg`]);
        this._requirments.variables.toastMessage.textContent = cloningRequirments.toastBody.message;
        const newToast = this._requirments.toastStructure.cloneNode(true) as HTMLDivElement;
        newToast.animate(
            [
                {
                    left: '-25.5rem',
                    opacity: '0'
                },
                {
                    left: '0.5rem',
                    opacity: '1'
                }
            ],
            {
                duration: 250,
                iterations: 1
            }
        );
        return {
            newToast: newToast,
            toastCloseButton: newToast.childNodes[1].childNodes[2] as HTMLDivElement
        };
    }

    private addToastIcon(imgSrc: string, svgSrc: string): void {
        if (imgSrc) {
            this._requirments.variables.toastIconImg.src = imgSrc;
            this._requirments.variables.toastIconDiv.replaceChildren(this._requirments.variables.toastIconImg);
        } else {
            this._requirments.variables.toastIconDiv.replaceChildren('');
            this._requirments.variables.toastIconDiv.insertAdjacentHTML('afterbegin', svgSrc);
        }
    }

    private getToastColor(toastType: ToastType): string {
        let color: string = '#29B2FF';
        switch (toastType) {
            case 'error':
                color = '#FF463A';
                break;
            case 'warning':
                color = '#FFC700';
                break;
            case 'success':
                color = '#00E549';
                break;
            case 'information':
                color = '#29B2FF';
                break;
        }
        return color;
    }
}
