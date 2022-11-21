import {isAnnotated, NodeProvider, useStore} from "../utils";
import {DefaultClass} from "../constants";
import {memo, useMemo} from "react";
import {Piece} from "./Piece";
import {EditableSpan} from "./EditableSpan";
import {useSelector} from "../utils/useSelector";

export const MarkedText = memo(() => {
    const store = useStore()
    const {className, style, pieces} = useSelector(state => ({
        className: state.className ? DefaultClass + " " + state.className : DefaultClass,
        style: state.style,
        pieces: state.pieces,
    }), true)

    const events = useMemo(() => store.bus.events, [])

    return (
        <div ref={store.containerRef} className={className} style={style} {...events}>
            {pieces.toArray().map((node) =>
                <NodeProvider key={node.key} value={node}>
                    {
                        isAnnotated(node.mark) ? <Piece/> : <EditableSpan/>
                    }
                </NodeProvider>
            )}
        </div>
    )
})

MarkedText.displayName = 'MarkedText'