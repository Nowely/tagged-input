import {assertAnnotated} from '../utils/functions/assertAnnotated'
import {useSelector} from '../utils/hooks/useSelector'
import {useNode} from '../utils/providers/NodeProvider'

export function Piece() {
	const {data} = useNode()
	const {options, Mark} = useSelector(store =>
		({options: store.props.options, Mark: store.props.Mark}), true)

	assertAnnotated(data.mark)

	const defaultProps = {label: data.mark.label, value: data.mark.value}
	const props = options[data.mark.optionIndex].initMark?.(defaultProps) ?? defaultProps

	//TODO correct typing
	// @ts-ignore
	return <Mark {...props}/>
}