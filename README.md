#  EventBus class for managing events in JavaScript

## Installation

### In a browser

Download this repo and copy `src/eventbus.js` into your project's JavaScript asset folder.
Import the class instance using ES6 module import.

```js
import { EventBus } from '/your_js_assets_folder/eventbus.js';
```

You're ready to go.

## API

### EventBus.`addEventListener`

```js
// Register EventListner to EventBus  
// @eventName - the name of event
// @callback - a handler's function
// @scope - the scope where the @callback is defined - ?
// @args - additional arguments
EventBus.addEventListener(eventName, callback, scope, ...args)
```

### EventBus.`removeEventListener`

```js
// Remove EventListener from EventBus
// @eventName - the name of event
// @callback - handler's function to remove
// @scope - the scope where the @callback is defined
EventBus.removeEventListener(eventName, callback, scope)
```

### EventBus.`has`

```js
// @eventName - the name of event
// @callback - handler's function
// @scope - the scope where the @callback is defined
EventBus.has(eventName, callback, scope)
```

### EventBus.`dispatch`

```js
// @eventName - the name of event
// @target - the caller (emitter
// @args - additional arguments
EventBus.dispatch(eventName, target, ...args)
```

### EventBus.`debug`

For debugging purpose only, it returns the added events as a string.

```js
console.log(EventBus.debug());
```

## Usage

```js
function myHandler(event) {
  console.log("myHandler eventName=" + event.name);
}
EventBus.addEventListener("my_event", myHandler);
EventBus.dispatch("my_event");
```

## Keeping the scope

```js
class TestClass1 {
    constructor() {
        this.className = "TestClass1";
        EventBus.addEventListener("callback_event", this.callback, this);
    }
    callback(event) {
        console.log(this.className + " / eventName: " + event.name + " / dispatcher: " + event.target.className);
    }
}

class TestClass2 {
    constructor() {
        this.className = "TestClass2";
    }
    dispatch() {
        EventBus.dispatch("callback_event", this);
    }
}

let t1 = new TestClass1();
let t2 = new TestClass2();
t2.dispatch();
```

## Passing additional parameters

```js
class TestClass1 {
    constructor() {
        this.className = "TestClass1";
        EventBus.addEventListener("custom_event", this.doSomething, this);
    }
    doSomething(event, param1, param2) {
        console.log(this.className + ".doSomething");
        console.log("eventName=" + event.name);
        console.log("params=" + param1 + param2);
        console.log("coming from=" + event.target.className);
    }
}

class TestClass2 {
    constructor() {
        this.className = "TestClass2";
    }
    ready() {
        EventBus.dispatch("custom_event", this, "javascript events", " are really useful");
    }
}

let t1 = new TestClass1();
let t2 = new TestClass2();

t2.ready();
```

## Using EventBus.removeEventListener

To remove an event handler you have to pass the same callback instance.

This is wrong and won't work because callback functions are different functions.

```js
EventBus.addEventListener('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
EventBus.removeEventListener('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
```

This is correct. Our callback function is the same function.

```js
var handler = function() {
    console.log('example callback');
};
EventBus.addEventListener('EXAMPLE_EVENT', handler);
EventBus.dispatch('EXAMPLE_EVENT');
EventBus.removeEventListener('EXAMPLE_EVENT', handler);
// Not dispatched since event was removed
EventBus.dispatch('EXAMPLE_EVENT');
```

## Examples

To run the examples you have to start a webserver at the root of this repository.

For example the built in PHP server:

    $ cd eventbus
    $ php -S localhost:9999
    
Now, open <http://localhost:9999/examples/> in your browser.

In the Console of Chrome DevTools you should see a few log entries.
