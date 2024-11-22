import {DefaultOptions, SystemEvent} from '../constants'
import {annotate} from '../utils/functions/annotate'
import {createNewSpan} from '../utils/functions/createNewSpan'
import {getTokensByUI} from '../utils/functions/getTokensByUI'
import {getTokensByValue} from '../utils/functions/getTokensByValue'
import {toString} from '../utils/functions/toString'
import {useListener} from '../utils/hooks/useListener'
import {useStore} from '../utils/hooks/useStore'

//TODO upgrade to full members of react events to external
export function useSystemListeners() {
	const store = useStore()

	useListener(SystemEvent.Change, (event) => {
		const {onChange, options} = store.props

		if (!store.focus.target) return

		store.tokens[store.focus.index].label = store.focus.content

		onChange?.(toString(store.tokens, options))
		store.bus.send(SystemEvent.Parse)
		//bus.send(SystemEvent.CheckTrigger) TODO check on value change
	}, [])

	useListener(SystemEvent.Delete, ({token}) => {
		const {onChange, options} = store.props

		store.tokens.splice(store.tokens.indexOf(token), 1)

		onChange?.(toString(store.tokens, options))
	}, [])

	useListener(SystemEvent.Parse, (event) => {
		store.tokens = store.focus.target
			? getTokensByUI(store)
			: getTokensByValue(store)
	}, [])

	useListener(SystemEvent.Select, (event) => {
		const {Mark, onChange, options} = store.props
		const {mark, match: {option, span, index, source, node}} = event

		const annotation = annotate(option.markup ?? DefaultOptions[0].markup, mark.label, mark.value)
		const newSpan = createNewSpan(span, annotation, index, source)

		store.recovery = Mark
			? {caret: 0, anchor: store.input.next, isNext: true}
			: {caret: index + annotation.length, anchor: store.input}

		if (store.input.target) {
			store.input.content = newSpan
			store.tokens[store.input.index].label = newSpan

			store.focus.target = store.input.target
			store.input.clear()
			onChange?.(toString(store.tokens, options))
			store.bus.send(SystemEvent.Parse)
		}
	}, [])
}