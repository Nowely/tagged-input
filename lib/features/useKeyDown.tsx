import {KEYBOARD} from '../constants'
import {deleteMark} from '../utils/functions/deleteMark'
import {useDownOf} from '../utils/hooks/useDownOf'
import {useListener} from '../utils/hooks/useListener'
import {useStore} from '../utils/hooks/useStore'

//TODO Focus on mark and attribute for this
//TODO different rules for editable
export function useKeyDown() {
	const store = useStore()

	useDownOf(KEYBOARD.LEFT, shiftFocusPrev)
	useDownOf(KEYBOARD.RIGHT, shiftFocusNext)

	useDownOf(KEYBOARD.DELETE, deleteSelfMark)
	useDownOf(KEYBOARD.BACKSPACE, deleteSelfMark)

	useDownOf(KEYBOARD.DELETE, deleteNextMark)
	useDownOf(KEYBOARD.BACKSPACE, deletePrevMark)

	useListener('keydown', selectAllText, [])

	function shiftFocusPrev(event: KeyboardEvent) {
		const {focus} = store
		if (focus.isMark && !focus.isEditable || focus.isCaretAtBeginning) {
			const prev = focus.prev
			prev.focus()
			if (!prev.isFocused) {
				prev.prev.focus()
				event.preventDefault()
			}
			focus.setCaretToEnd()
		}
	}

	function shiftFocusNext(event: KeyboardEvent) {
		const {focus} = store
		if (focus.isMark && !focus.isEditable || focus.isCaretAtEnd) {
			const next = focus.next
			next.focus()
			if (!next.isFocused) {
				next.next.focus()
				event.preventDefault()
			}
		}
	}

	function deleteSelfMark() {
		if (store.focus.isMark)
			deleteMark('self', store)
	}

	function deletePrevMark(event: KeyboardEvent) {
		if (store.focus.isSpan && store.focus.isCaretAtBeginning && store.focus.prev.target) {
			event.preventDefault()
			deleteMark('prev', store)
		}
	}

	//TODO pass focus
	//TODO on && !store.focus.next.isEditable remove first symbol
	function deleteNextMark(event: KeyboardEvent) {
		if (store.focus.isSpan && store.focus.isCaretAtEnd && store.focus.next.target) {
			event.preventDefault()
			deleteMark('next', store)
		}
	}

	function selectAllText(event: KeyboardEvent) {
		if (event.ctrlKey && event.code === 'KeyA') {
			event.preventDefault()

			const selection = window.getSelection()
			const anchorNode = store.refs.container.current?.firstChild
			const focusNode = store.refs.container.current?.lastChild

			if (!selection || !anchorNode || !focusNode) return
			selection.setBaseAndExtent(anchorNode, 0, focusNode, 1)
		}
	}
}
