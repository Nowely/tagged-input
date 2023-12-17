import {createRef, useEffect} from 'react'
import {MarkStruct, Option, Piece} from '../../../types'
import {isAnnotated} from '../../../utils/checkers/isAnnotated'
import {isObject} from '../../../utils/checkers/isObject'
import LinkedList from '../../../utils/classes/LinkedList/LinkedList'
import {Parser} from '../../../utils/classes/Parser/Parser'
import {Store} from '../../../utils/classes/Store'
import {findGap} from '../../../utils/functions/findGap'
import {getClosestIndexes} from '../../../utils/functions/getClosestIndexes'
import {useStore} from '../../../utils/hooks/useStore'

export const useValueParser = () => {
	const store = useStore()
	const {value, options} = useStore(store => ({
		value: store.props.value,
		options: store.props.Mark ? store.props.options : undefined,
	}), true)

	useEffect(() => {
			if (store.changedNode)
				updateStateFromUI(store, options)
			else {
				updateStateFromValue(store, value, options)
			}
		}, [value, options]
	)
}

function updateStateFromValue(store: Store, value: string, options?: Option<MarkStruct>[]) {
	const ranges = getRangeMap(store)
	const gap = findGap(store.previousValue, value)
	store.previousValue = value

	console.log(gap)
	console.log(ranges)

	if (gap.left) {
		//Mark removing happen
		if (ranges.includes(gap.left) && gap.right && Math.abs(gap.left - gap.right) > 1) {
			const updatedIndex = ranges.indexOf(gap.left)
			updateByChangedNodes(store, updatedIndex - 1, updatedIndex)
			return
		}

		//Changing in label
		const [updatedIndex] = getClosestIndexes(ranges, gap.left)
		updateByChangedNode(store, updatedIndex)
		return
	}


	//Parse all string
	const tokens = Parser.split(value, options)()
	const nodeData = tokens.map(toNodeData)
	const pieces = LinkedList.from(nodeData)

	store.pieces = pieces
}

function getRangeMap(store: Store): number[] {
	let position = 0
	return store.pieces.map(node => {
		const length = isAnnotated(node.data.mark) ? node.data.mark.annotation.length : node.data.mark.label.length
		position += length
		return position - length
	}) ?? []
}

function toNodeData(piece: Piece) {
	return {
		mark: isObject(piece) ? piece : {label: piece},
		ref: createRef<HTMLElement>()
	}
}

function updateByChangedNodes(store: Store, index1: number, index2: number) {
	const node1 = store.pieces.getNode(index1)
	const node2 = store.pieces.getNode(index2)
	const newString = node1!.data.mark.label + node2!.data.mark.label
	const pieces = Parser.split(newString, store.props.options)()

	const nodeData = pieces.map(toNodeData)

	store.pieces.insertAfter(node2!, nodeData[0])
	node1!.remove()
	node2!.remove()
	store.pieces = store.pieces.shallowCopy()
}

function updateByChangedNode(store: Store, nodeIndex: number) {
	const node = store.pieces.getNode(nodeIndex)
	const pieces = Parser.split(node!.data.mark.label, store.props.options)()
	if (pieces.length===1) return

	const nodeData = pieces.map(toNodeData)

	store.pieces.insertsBefore(node!, nodeData)
	store.focusedNode = node!.next
	node!.remove()
	store.pieces = store.pieces.shallowCopy()
}

function updateStateFromUI(store: Store, options?: Option[]) {
	const pieces = Parser.split(store.changedNode!.data.mark.label, options)()
	if (pieces.length===1) return

	const nodeData = pieces.map(toNodeData)

	store.pieces.insertsBefore(store.changedNode!, nodeData)
	store.focusedNode = store.changedNode!.next
	store.changedNode!.remove()
	store.changedNode = undefined
	store.pieces = store.pieces.shallowCopy()
}

function updateByChangedValue(value: string, options?: Option[]) {
	const pieces = Parser.split(value, options)()
	const nodeData = pieces.map(toNodeData)
	return LinkedList.from(nodeData)
}
