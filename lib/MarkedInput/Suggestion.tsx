import React, {ReactNode, useEffect, useMemo, useState} from "react";
import "./style.css";
import {OverlayProps} from "./types";
import {KEY} from "./constants";

export interface SuggestionProps extends OverlayProps {
    suggestions: string[]
}

export const Suggestion = ({suggestions = ["a", "b", "c", "asdb", "heeell"], ...props}: SuggestionProps) => {
    const [active, setActive] = useState(0)

    const filtered = useMemo(
        () => suggestions.filter(s => s.toLowerCase().indexOf(props.word.toLowerCase()) > -1),
        [props.word]
    )

    const onClick = (e: any) => {
    }

    const onKeyDown = (e: any) => {
        switch (e.key) {
            case KEY.ENTER:
                return;
            case KEY.UP:
                if (active === 0) {
                    return;
                }
                setActive(prevState => prevState--)
                break
            case KEY.DOWN:
                if (active - 1 === filtered.length) {
                    return;
                }
                setActive(prevState => prevState++)
                break
        }
    }

    if (!filtered.length) return null

    return (
        <ul className="marked-suggestions" style={props.style}>
            {filtered.map((suggestion, index) => {
                let className;

                if (index === active) {
                    className = "marked-suggestion-active";
                }

                return (
                    <li key={suggestion}
                        className={className}
                        //onMouseOver={_ => setActive(index)}
                        onClick={onClick}
                        children={suggestion}
                    />
                );
            })}
        </ul>
    )
}