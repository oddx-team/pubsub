export function usePubSub(): PubSub {
    const events: Record<string, PubSubHandler[]> = Object.create(null)
    function publish (event: string, ...data: PubSubData[]): void {
        if (!events[event]) return

        events[event]
            .forEach(
                (callback: PubSubHandler) => callback(...data))
    }
    function subscribe (event: string, callback: PubSubHandler): PubSubUnsubscribe {
        if (!events[event]) {
            events[event] = []
        }

        events[event].push(callback)

        const index = events[event].length - 1
        return function() {
            events[event].splice(index, 1)
        }
    }
    function clearAllSubscriptions(event: string): void {
        if (!event) return
        events[event] = []
    }
    function countSubscription(event: string): number {
        if (!event || !events[event]) return 0
        return events[event].length
    }
    return { publish, subscribe, clearAllSubscriptions, countSubscription }
}

export interface PubSub {
    publish (event: string, ...data: PubSubData[]): void
    subscribe (event: string, callback: PubSubHandler): PubSubUnsubscribe
    clearAllSubscriptions(event: string): void
    countSubscription(event: string): number
}

export type PubSubData = string | number | Record<any, any> | string[] | number[] |  any

export type PubSubHandler = (...data: PubSubData[]) => void
export type PubSubUnsubscribe = () => void

export default usePubSub
