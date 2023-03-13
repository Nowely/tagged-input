import {RefObject, useMemo, useState} from 'react'
import {KEY} from '../../constants'
import {useDownOf} from '../../utils/useDownOf'
import {useOverlay} from '../../utils/useOverlay'

export const Suggestions = () => {
    const {trigger, onSelect, style, ref} = useOverlay()
    const [active, setActive] = useState(NaN)
    const filtered = useMemo(
        () => trigger.option.data.filter(s => s.toLowerCase().indexOf(trigger.value.toLowerCase()) > -1),
        [trigger.value]
    )
    const length = filtered.length

    useDownOf(KEY.UP, event => {
        event.preventDefault()
        setActive(prevState => isNaN(prevState) ? 0 : (length + (prevState - 1) % length) % length)
    }, [length])

    useDownOf(KEY.DOWN, event => {
        event.preventDefault()
        setActive(prevState => isNaN(prevState) ? 0 : (prevState + 1) % length)
    }, [length])

    useDownOf(KEY.ENTER, event => {
        event.preventDefault()
        const suggestion = filtered[active]
        onSelect({label: suggestion, value: active.toString()})
    }, [filtered, active])

    if (!filtered.length) return null

    return (
        <ul ref={ref as RefObject<HTMLUListElement>} className="mk-suggestions" style={style}>
            {filtered.map((suggestion, index) => {
                const className = index === active ? 'mk-suggestion-active' : undefined

                return (
                    <li key={suggestion}
                        ref={el => className && el?.scrollIntoView(false)}
                        className={className}
                        onClick={_ => onSelect({label: suggestion, value: index.toString()})}
                        children={suggestion}
                    />
                )
            })}
        </ul>
    )
}