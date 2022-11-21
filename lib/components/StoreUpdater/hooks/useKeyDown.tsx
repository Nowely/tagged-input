import {KeyboardEvent, MutableRefObject} from "react";
import {Caret} from "../../../utils/Caret";
import {KEY} from "../../../constants";
import {Type} from "../../../types";
import {useStore} from "../../../utils";
import {Recovery} from "../../MarkedText/useFocusRecovery";
import {useDownOf} from "../../../utils/useDownOf";

export function useKeyDown() {
    const store = useStore()

    useDownOf(KEY.LEFT, event => {
        if (!isCaretInStart(event)) return

        const node = store.focusedNode?.prev
        const element = node?.data.ref?.current ?? node?.prev?.data.ref?.current
        element?.focus()
        Caret.setCaretToEnd(element)
        event.preventDefault()
    })

    useDownOf(KEY.RIGHT, event => {
        if (!isCaretInEnd(event)) return

        const node = store.focusedNode?.next
        const element = node?.data.ref?.current ?? node?.next?.data.ref?.current
        element?.focus()
        event.preventDefault()
    })

    useDownOf(KEY.DELETE, event => {
        if (!isCaretInEnd(event)) return

        const node = store.focusedNode?.next
        if (!node?.data.key) return

        const caretPosition = node.prev?.data.mark.label.length ?? 0
        store.recovery = {prevNodeData: node.prev?.prev?.data, caretPosition}
        store.bus.send(Type.Delete, {key: node.data.key})
        event.preventDefault()
    })

    useDownOf(KEY.BACKSPACE, event => {
        if (!isCaretInStart(event)) return

        const node = store.focusedNode?.prev
        if (!node?.data.key) return

        const caretPosition = node.prev?.data.mark.label.length ?? 0
        store.recovery = {prevNodeData: node.prev?.prev?.data, caretPosition}
        store.bus.send(Type.Delete, {key: node.data.key})
        event.preventDefault()
    })
}

function isCaretInStart(e: KeyboardEvent<HTMLSpanElement>) {
    const target = e.target as HTMLSpanElement
    const caretIndex = Caret.getCaretIndex(target);
    return caretIndex === 0;
}

function isCaretInEnd(event: KeyboardEvent<HTMLSpanElement>) {
    const target = event.target as HTMLSpanElement
    const caretIndex = Caret.getCaretIndex(target);
    return caretIndex === target.textContent?.length;
}
