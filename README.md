#  EventBus class for managing events in JavaScript

## Installation

```bash
npm install @jsDesigners/event-bus
```

### In a browser

Download this repo and copy `src/eventbus.js` into your project's JavaScript asset folder.
Import the class instance using ES6 module import.

```js
import { EventBus } from '/your_js_assets_folder/eventbus.js';
```

You're ready to go.

# Usage

```js
class YourClassName {
    constructor() {
        this.eventBus = EventBus.create();  
    }
}

```

## API
### EventBus methods:
#### `addEventListener`
Add listener to EventBus

```js
addEventListener(eventName, callback, scope, ...args)
```
| Parameter     | Type          | Requirements   | Description                                 |
| :--------     | :---------    | :------------- | :------------------------------------------ |
| `eventName`   | `string`      | **Required**   | the name of event                           |
| `callback`    | `function`    | **Required**   | a listener's (handler's) function           |
| `scope`       | `object`      | **Required**   | the scope where the `callback` is defined   |
| `args`        | `...any`      | **Optional**   | additional arguments                        |

----
#### `removeEventListener`
Removes listener from EventBus
```js
removeEventListener(eventName, callback, scope)
```
| Parameter     | Type       | Requirements   | Description                                 |
| :--------     | :--------- | :------------- | :------------------------------------------ |
| `eventName`   | `string`   | **Required**   | the name of event                           |
| `callback`    | `function` | **Required**   | a listener's (handler's) function           |
| `scope`       | `object`   | **Required**   | the scope where the `callback` is defined   |

---
#### `has`
Checks if the passed event is registered in the EventBus
```js
has(eventName, callback, scope)
```
| Parameter     | Type          | Requirements   | Description                                 |
| :--------     | :-----------  | :------------- | :------------------------------------------ |
| `eventName`   | `string`      | **Required**   | the name of event                           |
| `callback`    | `function`    | **Required**   | a listener's (handler's) function           |
| `scope`       | `object`      | **Required**   | the scope where the `callback` is defined   |

---
#### `dispatch`

```js
dispatch(eventName, target, ...args)
```
| Parameter     | Type       | Requirements   | Description                                 |
| :--------     | :--------- | :------------- | :------------------------------------------ |
| `eventName`   | `string`   | **Required**   | the name of event                           |
| `target`      | `object`   | **Required**   | a listener's (handler's) function           |
| `args`        | `...any`   | **Optional**   | the scope where the `callback` is defined   |


#### `debug`

For debugging purpose only, it returns the added events as a string.

```js
console.log(eventBus.debug());
```

## Usage

```js
function myHandler(event) {
  console.log("myHandler eventName=" + event.name);
}
eventBus.addEventListener("my_event", myHandler);
eventBus.dispatch("my_event");
```

## Keeping the scope

```js
class TestClass1 {
    constructor() {
        this.className = "TestClass1";
        eventBus.addEventListener("callback_event", this.callback, this);
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
        eventBus.dispatch("callback_event", this);
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
        eventBus.addEventListener("custom_event", this.doSomething, this);
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
        eventBus.dispatch("custom_event", this, "javascript events", " are really useful");
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
eventBus.addEventListener('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
eventBus.removeEventListener('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
```

This is correct. Our callback function is the same function.

```js
var handler = function() {
    console.log('example callback');
};
eventBus.addEventListener('EXAMPLE_EVENT', handler);
eventBus.dispatch('EXAMPLE_EVENT');
eventBus.removeEventListener('EXAMPLE_EVENT', handler);
// Not dispatched since event was removed
eventBus.dispatch('EXAMPLE_EVENT');
```

## Examples

To run the examples you have to start a webserver at the root of this repository.

For example the built in PHP server:

    $ cd eventbus
    $ php -S localhost:9999
    
Now, open <http://localhost:9999/examples/> in your browser.

In the Console of Chrome DevTools you should see a few log entries.

# Authors:

This project is forked from [tbreuss/eventbus](https://github.com/tbreuss/eventbus)
And modified by [jsDesigners](https://github.com/jsDesigners) to be more CleanCode
(Naming of methods)

## Changelog

### Changed 
- Renamed methods in `EventBus` class
- Renamed or removed global variable from exports.
  The EventBus class should be exported instead of using global variables. 
  EventBus should be created as service (and/or to be a singleton) in code and should be used by dependency injection
  instead of new objects.
- Pushed to npm package repository and tagged with version to more comfortable using in other
  projects.
  
### In near Future ideas:
- Minimize methods arguments and add ability to pass an EventObject to methods instead of 
multiple arguments like below:

```js
class AddUserToGroupButtonClickedEvent extends CustomEvent {
    constructor(target) {
        super();
        this.name = 'add.user.to.group.clicked.event';       
        this.target = target;
    }
}
// ...
class UserLoggedEvent extends CustomEvent{
    constructor(target, userId) {
        super();
        this.name = 'user_logged_event';       
        this.target = target;
        this.userId = userId;            
    }
}
// ...
function handleClick(event) {
    this.eventBus.dispatch(new AddUserToGroupButtonClickedEvent(this))
}
// ...
function handleLogin(event) {
    this.eventBus.dispatch(new UserLoggedEvent(this, 'X5Y6Z7-Q1W2E3R4T5U8I9-HQF'))
}
```

or

```js
function handleLogin(event) {
    this.eventBus.dispatch({
        name: 'AddUserToGroupButtonClicked',
        caller: this,
        arguments: {userId: 'X5Y6Z7-Q1W2E3R4T5U8I9-HQF'}
    });
}
```
```