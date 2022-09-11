//TODO refact caret
export class Caret {
    static get isSelectedPosition() {
        const selection = window.getSelection()
        if (!selection) return
        return selection.anchorOffset === selection.focusOffset
    }

    static getCurrentPosition() {
        return window.getSelection()?.anchorOffset ?? 0
    }

    static getCurrentPieceOfText() {
        return window.getSelection()?.anchorNode?.textContent ?? ""
    }

    static getAbsolutePosition() {
        const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect?.()
        if (rect)
            return {left: rect.left, top: rect.top + 20}
        return {left: 0, top: 0}
    }

    static setIndex(element: HTMLElement, offset: number) {
        const selection = window.getSelection()
        if (!selection?.anchorNode || !selection.rangeCount) return

        const range = selection.getRangeAt(0)
        range?.setStart(element.firstChild! || element, offset)
        range?.setEnd(element.firstChild! || element, offset)
    }

    static getCaretIndex(element: HTMLElement) {
        let position = 0;

        const selection = window.getSelection();
        // Check if there is a selection (i.e. cursor in place)
        if (!selection?.rangeCount) return position;

        // Store the original range
        const range = selection.getRangeAt(0);
        // Clone the range
        const preCaretRange = range.cloneRange();
        // Select all textual contents from the contenteditable element
        preCaretRange.selectNodeContents(element);
        // And set the range end to the original clicked position
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        // Return the text length from contenteditable start to the range end
        position = preCaretRange.toString().length;

        return position
    }

    static setCaretToEnd(element: HTMLElement | null) {
        if (!element) return
        const selection = window.getSelection();
        selection?.setPosition(element, 1)
    }


    static getIndex() {
        const selection = window.getSelection()
        return selection?.anchorOffset ?? NaN
    }

    static setIndex1(offset: number) {
        const selection = window.getSelection()
        if (!selection?.anchorNode || !selection.rangeCount) return

        const range = selection.getRangeAt(0)
        range?.setStart(range.startContainer.firstChild || range.startContainer, offset)
        range?.setEnd(range.startContainer.firstChild || range.startContainer, offset)
    }

    setCaretRightTo(element: HTMLElement, offset: number) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        range?.setStart(range.endContainer, offset)
        range?.setEnd(range.endContainer, offset)
    }
}