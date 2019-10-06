export class EventListener {
    constructor(event, callback, ...callbackArguments)
    {
        this.event = event;
        this.callback = callback;
        this.callbackArguments = [...callbackArguments];
    }
}
