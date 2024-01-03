import {createRef} from 'react'
import {SystemEvent} from '../../constants'
import {DefaultedProps, MarkStruct, OverlayMatch, Recovery} from '../../types'
import {EventBus} from './EventBus'
import {KeyGenerator} from './KeyGenerator'
import {NodeProxy} from './NodeProxy'

export class Store {
	readonly bus = new EventBus()
	readonly key = new KeyGenerator()

	props: DefaultedProps
	readonly focus = new NodeProxy(undefined, this)
	//TODO rename to input node?

	readonly input = new NodeProxy(undefined, this)

	tokens: MarkStruct[] = []

	recovery?: Recovery

	readonly refs = {
		counter: 0,
		container: createRef<HTMLDivElement>(),
		overlay: createRef<HTMLElement>()
	}

	get currentIndex() {
		return this.refs.counter++ % this.tokens.length
	}

	previousValue?: string

	overlayMatch?: OverlayMatch

	static create(props: DefaultedProps) {
		return new Proxy(new Store(props), {
			set: setHandler
		})
	}

	private constructor(props: DefaultedProps) {
		this.props = props
	}
}

function setHandler(target: Store, prop: keyof Store, newValue: any, receiver: Store): boolean {
	if (prop === 'bus'
		|| prop === 'refs'
		|| prop === 'focus' || prop === 'currentIndex' || prop === 'input' || prop === 'key') return false

	target[prop] = newValue
	target.bus.send(SystemEvent.STORE_UPDATED, receiver)
	return true
}