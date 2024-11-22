import {assertAnnotated} from '../utils/checkers/assertAnnotated'
import {useStore} from '../utils/hooks/useStore'
import {useToken} from '../utils/providers/TokenProvider'

export function Piece() {
	const node = useToken()
	const {options, Mark} = useStore(store =>
		({options: store.props.options, Mark: store.props.Mark}), true)

	assertAnnotated(node)

	const defaultProps = {label: node.label, value: node.value}
	const props = options[node.optionIndex].initMark?.(defaultProps) ?? defaultProps

	//TODO correct typing
	// @ts-ignore
	return <Mark {...props}/>
}