import { useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTraceUpdate(props: any): void {
    const prev = useRef(props);
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
    return undefined;
}
