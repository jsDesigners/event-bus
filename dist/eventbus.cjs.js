'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class NamedEvent {

    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }
}

class EventListener {
    constructor(event, callback, ...callbackArguments)
    {
        this.event = event;
        this.callback = callback;
        this.callbackArguments = [...callbackArguments];
    }
}

class EventBus {

    constructor() {
        this.events = {};
    }

    static create() {
        return eventBus;
    }

    /**
     * @param {string|NamedEvent} event
     * @return NamedEvent
     */
    _toEvent(event) {
        if (typeof event === 'string') {
            return  new NamedEvent(event);
        }

        return event;
    }

    /**
     * Adds listener to EventBus
     * @param {string|NamedEvent} event The name or NameEvent instance of the event to listen for
     * @param {function} callback Callback to call when event was triggered
     * @param  {...*} args Any number of args to be passed to the callback
     */
    addEventListener(event, callback, ...args) {
        event = this._toEvent(event);
        const eventName = event.getName();

        if (typeof this.events[eventName] === "undefined") { // Check if there is already event of this eventName registered
            this.events[eventName] = []; // If not, create array for it
        }
        const eventListener = new EventListener(event, callback, ...args);
        this.events[eventName].push(eventListener); // Finally push new event to events array
    }

    /**
     * Removes listener from EventBus
     * @param {string|NamedEvent} event The name of the event to remove
     * @param {function} callback Callback of the event to remove
     */
    removeEventListener(event, callback) {
        event = this._toEvent(event);
        const eventName = event.getName();

        if (typeof this.events[eventName] === "undefined") { // Check if event of this type exists
            return; // If not just return
        }

        // keep all elements that aren't equal to the passed event
        const filterFn = listener => listener.event.getName() !== event.getName() || listener.callback !== callback;
        this.events[eventName] = this.events[eventName].filter(filterFn);
    }

    /**
     * Checks if the passed event is registered in the EventBus
     * @param {string|NamedEvent} event Type of the to be checked event
     * @param {callback} callback Callback of the to be checked event\
     */
    has(event, callback) {
        event = this._toEvent(event);
        const eventName = event.getName();
        if (typeof this.events[eventName] === "undefined") { // Check if the passed eventName even exists
            return false; // If not, quit method
        }

        // If callback and scope are undefined then every registered event is match, thus any event of the eventName matches
        let numOfCallbacks = this.events[eventName].length;
        if (callback === undefined) { // If callback are not defined
            return numOfCallbacks > 0; // If there are any callbacks we can be sure it matches the passed one
        }

        const conditionFn = listener => {
            const callbackIsSame = listener.callback === callback; // Check if callback is equal to the one passed
            if (callbackIsSame) { // Check if current listener and passed listener are equal
                return true; // If so, break loop and return true
            }
        };
        return this.events[eventName].some(conditionFn);
    }

    /**
     * Dispatch is a function to emits an event addEventListener the EventBus
     * @param {string|NamedEvent} event Type of event to dispatch
     * @param {...any} args Any number of args to be passed to the callback
     */
    dispatch(event, ...args) {
        event = this._toEvent(event);
        const eventName = event.getName();

        if (typeof this.events[eventName] === "undefined") { // Check if any event of the passed eventName exists
            return; // If not, quit method
        }

        const listeners = this.events[eventName].slice(); // Little hack to clone array

        for (const listener of listeners) { // Iterate all events
            if (listener && listener.callback) { // Check if callback of event is set
                listener.scope = listener.callback.apply(listener.callback, [event, ...args, ...listener.callbackArguments]);
            }
        }
    }

    debug() {
        let str = "";
        for (const [name, listeners] of Object.entries(this.events)) {
            for (const listener of listeners) {
                let className = listener.scope || "Anonymous";
                str += `${className} listening for "${name}"\n`;
            }
        }
        return str;
    }

}

const eventBus = new EventBus();

exports.EventBus = EventBus;
exports.default = EventBus;
