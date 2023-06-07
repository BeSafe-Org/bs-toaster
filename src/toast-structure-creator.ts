import { CLOSE_ICON_SVG } from './svg';
import { ToastStructure } from './toast-structure';

type CloseButtonConditions = {
    showCloseButton: boolean,
    isCustomCloseIcon: boolean,
    closeIconSrc: string
}
type ToastStructureCreatorRequirments = {
    document: Document,
    closeButtonConditions: CloseButtonConditions
}

export class ToastStructureCreator {
    private static document: Document;

    public static createToastStructure(requirments: ToastStructureCreatorRequirments): ToastStructure {
        ToastStructureCreator.document = requirments.document;

        const toast = ToastStructureCreator.getToastElement();
        const toastVerticalLine = ToastStructureCreator.getToastVerticalLineElement(); // .
        const toastContentContainer = ToastStructureCreator.getToastContentContainerElement();
        const toastIcon = ToastStructureCreator.getToastIconElement(); // .
        const toastContentBody = ToastStructureCreator.getToastContentBodyElement(requirments.closeButtonConditions.showCloseButton);
        const toastMessage = ToastStructureCreator.getToastMessageElement(); // .
        const toastCloseButton = ToastStructureCreator.getToastCloseButtonElement(requirments.closeButtonConditions);

        toastContentBody.append(toastMessage);
        toastContentContainer.append(toastIcon.toastIconDiv);
        toastContentContainer.append(toastContentBody);
        if (requirments.closeButtonConditions.showCloseButton) toastContentContainer.append(toastCloseButton);
        toast.append(toastVerticalLine);
        toast.append(toastContentContainer);

        return new ToastStructure({
            toastStructure: toast,
            variables: {
                toastVerticalLine: toastVerticalLine,
                toastIconDiv: toastIcon.toastIconDiv,
                toastIconImg: toastIcon.toastIconImg,
                toastMessage: toastMessage,
                toastCloseButton: toastCloseButton
            }
        });
    }

    private static getToastElement(): HTMLDivElement {
        const toast = ToastStructureCreator.document.createElement('div');

        toast.style.width = '25rem';
        toast.style.height = '3.5rem';
        toast.style.padding = '0.5rem 0 0.5rem 0.5rem';
        toast.style.boxSizing = 'content-box';
        toast.style.borderRadius = '0.6rem';
        toast.style.backgroundColor = '#333333';
        toast.style.boxShadow = 'rgb(0 0 0 / 15%) 0px 0px 0.3rem 0.3rem';
        toast.style.display = 'flex';
        toast.style.justifyContent = 'center';
        toast.style.alignItems = 'center';
        toast.style.transition = 'bottom 50ms ease-in-out';
        toast.style.position = 'fixed';
        toast.style.bottom = '0.5rem';
        toast.style.left = '0.5rem';
        toast.style.zIndex = '1000';

        return toast;
    }

    private static getToastVerticalLineElement(): HTMLDivElement {
        const toastVerticalLine = ToastStructureCreator.document.createElement('div');

        toastVerticalLine.style.width = '0.3rem';
        toastVerticalLine.style.height = '100%';
        toastVerticalLine.style.borderRadius = '0.3rem';

        return toastVerticalLine;
    }

    private static getToastContentContainerElement(): HTMLDivElement {
        const toastContentContainer = ToastStructureCreator.document.createElement('div');

        toastContentContainer.style.width = 'calc(100% - 0.3rem)';
        toastContentContainer.style.display = 'flex';
        toastContentContainer.style.alignItems = 'center';

        return toastContentContainer;
    }

    private static getToastIconElement() {
        const toastIconDiv = ToastStructureCreator.document.createElement('div');

        toastIconDiv.style.margin = '0 1rem';
        toastIconDiv.style.display = 'flex';
        toastIconDiv.style.justifyContent = 'center';
        toastIconDiv.style.alignItems = 'center';

        const toastIconImg = ToastStructureCreator.document.createElement('img');
        const size = '2rem';
        toastIconImg.style.width = size;
        toastIconImg.style.height = size;

        return { toastIconDiv, toastIconImg };
    }

    private static getToastContentBodyElement(showCloseButton: boolean): HTMLDivElement {
        const toastContentBody = ToastStructureCreator.document.createElement('div');

        toastContentBody.style.width = showCloseButton ? 'calc(100% - 2rem - 2rem - 1.2rem - 2.4rem)' : 'calc(100% - 2rem - 2rem)';
        toastContentBody.style.paddingRight = showCloseButton ? '0' : '1.5ch';

        return toastContentBody;
    }

    private static getToastMessageElement(): HTMLDivElement {
        const toastMessage = ToastStructureCreator.document.createElement('div');

        toastMessage.style.color = '#FFFFFF';
        toastMessage.style.fontSize = '1rem';

        return toastMessage;
    }

    private static getToastCloseButtonElement(closeButtonConditions: CloseButtonConditions): HTMLDivElement {
        const toastCloseButton = ToastStructureCreator.document.createElement('div');

        toastCloseButton.style.padding = '0.2rem';
        toastCloseButton.style.margin = '0 1.2rem';
        toastCloseButton.style.display = 'flex';
        toastCloseButton.style.justifyContent = 'center';
        toastCloseButton.style.alignItems = 'center';
        toastCloseButton.style.cursor = 'pointer';

        if (closeButtonConditions.isCustomCloseIcon) {
            const img = ToastStructureCreator.document.createElement('img');

            img.src = closeButtonConditions.closeIconSrc;

            const size = '1.2rem';
            img.style.width = size;
            img.style.height = size;
            img.style.cursor = 'pointer';

            toastCloseButton.append(img);
        } else {
            toastCloseButton.insertAdjacentHTML('afterbegin', CLOSE_ICON_SVG);
        }
        return toastCloseButton;
    }
}
