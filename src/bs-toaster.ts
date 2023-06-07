import { ToastStructure } from './toast-structure';
import { ToastStructureCreator } from './toast-structure-creator';

export type ToastType = 'error' | 'warning' | 'success' | 'information';
export type ToastBody = {
    message: string
}
type ToasterOptions = {
    showDuration?: number,
    limit?: number,
    showCloseButton?: boolean,
    imageSrc?: {
        errorIconSrc?: string,
        warningIconSrc?: string,
        successIconSrc?: string,
        informationIconSrc?: string,
        closeIconSrc?: string
    }
}
type NowShowingToastInfo = {
    position: number,
    toast: HTMLDivElement | null
}
type WaitingToastInfo = {
    toastType: ToastType,
    toastBody: ToastBody
}

export class BSToaster {
    /** In milliseconds (ms) */
    private static SHOW_DURATION: number;
    private static LIMIT: number;
    private static SHOW_CLOSE_BUTTON: boolean;
    private static ERROR_ICON_SRC: string;
    private static WARNING_ICON_SRC: string;
    private static SUCCESS_ICON_SRC: string;
    private static INFORMATION_ICON_SRC: string;
    private static CLOSE_ICON_SRC: string;
    private static document: Document;
    private static body: HTMLBodyElement;
    private static TOAST_STRUCTURE: ToastStructure;
    private static readonly nowShowing: NowShowingToastInfo[] = [];
    private static readonly waitingList: WaitingToastInfo[] = [];

    constructor(options?: ToasterOptions) {
        BSToaster.SHOW_DURATION = options?.showDuration || 4000;
        BSToaster.LIMIT = (options?.limit) ? (options.limit <= 0) ? 5 : options.limit : 5;
        BSToaster.SHOW_CLOSE_BUTTON = (options?.showCloseButton && true) ? true : false;
        BSToaster.ERROR_ICON_SRC = options?.imageSrc?.errorIconSrc || '';
        BSToaster.WARNING_ICON_SRC = options?.imageSrc?.warningIconSrc || '';
        BSToaster.SUCCESS_ICON_SRC = options?.imageSrc?.successIconSrc || '';
        BSToaster.INFORMATION_ICON_SRC = options?.imageSrc?.informationIconSrc || '';
        BSToaster.CLOSE_ICON_SRC = options?.imageSrc?.closeIconSrc || '';

        BSToaster.document = document;
        BSToaster.body = BSToaster.document.getElementsByTagName('body')[0];

        BSToaster.TOAST_STRUCTURE = ToastStructureCreator.createToastStructure({
            document: BSToaster.document,
            closeButtonConditions: {
                showCloseButton: BSToaster.SHOW_CLOSE_BUTTON,
                isCustomCloseIcon: BSToaster.CLOSE_ICON_SRC === '' ? false : true,
                closeIconSrc: BSToaster.CLOSE_ICON_SRC
            }
        });
    }

    private showNewToastMessage(toastType: ToastType, toastBody: ToastBody): void {
        if (BSToaster.nowShowing.length < BSToaster.LIMIT) {
            this.shiftExistingToasts();
            const willBeShown: NowShowingToastInfo = {
                position: 1,
                toast: null
            }
            willBeShown.toast = this.getNewToast(toastType, toastBody, willBeShown);
            BSToaster.nowShowing.push(willBeShown);
            BSToaster.body.insertAdjacentElement('beforeend', willBeShown.toast);
        } else {
            BSToaster.waitingList.push({
                toastType: toastType,
                toastBody: toastBody
            });
        }
    }

    private removeFromNowShowing(position: number) {
        const index = BSToaster.nowShowing.findIndex(item => item.position === position);
        BSToaster.nowShowing.splice(index, 1);
        this.checkWaitingList();
    }

    private checkWaitingList(): void {
        this.rearrangeToasters();
        if (BSToaster.waitingList.length > 0) {
            const waitingFirst = BSToaster.waitingList.shift();
            if (waitingFirst) this.showNewToastMessage(waitingFirst.toastType, waitingFirst.toastBody);
        }
    }

    private shiftExistingToasts(): void {
        BSToaster.nowShowing.forEach((item: NowShowingToastInfo) => {
            (item.toast as HTMLDivElement).style.bottom = `${0.5 + (5 * ((++item.position) - 1))}rem`;
        });
    }

    private rearrangeToasters(): void {
        let count = BSToaster.nowShowing.length;
        BSToaster.nowShowing.forEach((item: NowShowingToastInfo) => {
            item.position = count--;
            (item.toast as HTMLDivElement).style.bottom = `${0.5 + (5 * (item.position - 1))}rem`;
        });
    }

    private getNewToast(toastType: ToastType, toastBody: ToastBody, nowShowingInfo: NowShowingToastInfo): HTMLDivElement {
        const clonedNode = BSToaster.TOAST_STRUCTURE.cloneNewToast({
            toastType,
            toastBody,
            imageSrc: {
                errorIconSrc: BSToaster.ERROR_ICON_SRC,
                warningIconSrc: BSToaster.WARNING_ICON_SRC,
                successIconSrc: BSToaster.SUCCESS_ICON_SRC,
                informationIconSrc: BSToaster.INFORMATION_ICON_SRC,
            }
        })

        const destroyer: Function = this.initiateDestroyer(clonedNode.newToast, nowShowingInfo);
        const autoDestroyerRef = this.initiateAutoDestroyer(destroyer);
        if (BSToaster.SHOW_CLOSE_BUTTON) this.initiateManualDestroyer(clonedNode.toastCloseButton, autoDestroyerRef, destroyer);

        return clonedNode.newToast;
    }

    private initiateDestroyer(toast: HTMLDivElement, nowShowingInfo: NowShowingToastInfo): Function {
        return () => {
            this.removeFromNowShowing(nowShowingInfo.position);
            toast.remove();
        };
    }

    private initiateAutoDestroyer(destroyer: Function): NodeJS.Timeout {
        return setTimeout(() => {
            destroyer();
        }, BSToaster.SHOW_DURATION);
    }

    private initiateManualDestroyer(toastCloseButton: HTMLDivElement, autoDestroyerRef: NodeJS.Timeout, destroyer: Function): void {
        toastCloseButton.addEventListener('click', () => {
            clearTimeout(autoDestroyerRef);
            destroyer();
        });
    }

    public error(message: string): void {
        this.showNewToastMessage('error', { message });
    }

    public warn(message: string): void {
        this.showNewToastMessage('warning', { message });
    }

    public success(message: string): void {
        this.showNewToastMessage('success', { message });
    }

    public inform(message: string): void {
        this.showNewToastMessage('information', { message });
    }
}
