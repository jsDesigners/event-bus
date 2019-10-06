import test from 'ava';
import { EventBus } from './dist/eventbus.cjs';
import {NamedEvent} from "./dist/model/NamedEvent.cjs";



test.beforeEach(t => {
    t.context = {bus: new EventBus()};
});

test('works with a basic use-case', t => {
	let result = 'nope';
	t.context.bus.addEventListener('my-event', () => result = 'yep');
	t.context.bus.dispatch('my-event');
	t.is(result, 'yep');
});

test('works with an NamedEvent instance for basic use-case', t => {
    let result = 'nope';
    let namedEvent = new NamedEvent('my-event');
    t.context.bus.addEventListener(namedEvent, () => result = 'yep');
    t.context.bus.dispatch(namedEvent);
    t.is(result, 'yep');
});

test('can remove event handlers', t => {
  let result = 0;
  let handler = function() {
    result++;
  };
  t.context.bus.addEventListener('EXAMPLE_EVENT', handler);
  t.context.bus.dispatch('EXAMPLE_EVENT');
  t.context.bus.removeEventListener('EXAMPLE_EVENT', handler);
	// Not emitted since event was removed
  t.context.bus.dispatch('EXAMPLE_EVENT');
  t.is(result, 1);
});

test('can remove NamedEvent handlers', t => {
    let result = 0;
    let handler = function() {
        result++;
    };

    let namedEvent = new NamedEvent('EXAMPLE_EVENT');
    t.context.bus.addEventListener(namedEvent, handler);
    t.context.bus.dispatch(namedEvent);
    t.context.bus.removeEventListener(namedEvent, handler);
    // Not emitted since event was removed
    t.context.bus.dispatch(namedEvent);
    t.is(result, 1);
});

test('can keep other handlers while removing', t => {
  let result = 0;
  let handler1 = function() {
    result = 1;
  };
  let handler2 = function() {
    result = 2;
  };
  t.context.bus.addEventListener('EXAMPLE_EVENT1', handler1);
  t.context.bus.addEventListener('EXAMPLE_EVENT2', handler2);

  t.context.bus.removeEventListener('EXAMPLE_EVENT1', handler1);

  t.context.bus.dispatch('EXAMPLE_EVENT2');
  t.is(result, 2);
});

test('can keep other handlers while removing NamedEvent', t => {
    let result = 0;
    let handler1 = function() {
        result = 1;
    };
    let handler2 = function() {
        result = 2;
    };

    let namedEvent1 = new NamedEvent('EXAMPLE_EVENT1');
    let namedEvent2 = new NamedEvent('EXAMPLE_EVENT2');
    t.context.bus.addEventListener(namedEvent1, handler1);
    t.context.bus.addEventListener(namedEvent2, handler2);

    t.context.bus.removeEventListener(namedEvent1, handler1);

    t.context.bus.dispatch(namedEvent2);
    t.is(result, 2);
});


test('can check if handler exists', t => {
	let handler = () => console.log(1);
  t.context.bus.addEventListener('EXAMPLE_EVENT', handler);
  t.true(t.context.bus.has('EXAMPLE_EVENT', handler));
  t.false(t.context.bus.has('doesnt_exist', handler));
  t.false(t.context.bus.has('EXAMPLE_EVENT', () => console.log(1)));
  t.false(t.context.bus.has('doesnt_exist', () => console.log(1)));
});

test('can check if NamedEvent handler exists', t => {
    let handler = () => console.log(1);

    let namedEvent = new NamedEvent('EXAMPLE_EVENT');
    let doesntExistEvent = new NamedEvent('doesnt_exist');
    t.context.bus.addEventListener(namedEvent, handler);

    t.true(t.context.bus.has(namedEvent, handler));
    t.false(t.context.bus.has(doesntExistEvent, handler));
    t.false(t.context.bus.has(namedEvent , () => console.log(1)));
    t.false(t.context.bus.has(doesntExistEvent, () => console.log(1)));
});

test('can check if any handlers exists', t => {
	let handler = () => console.log(1);
  t.context.bus.addEventListener('EXAMPLE_EVENT', handler);
  t.true(t.context.bus.has('EXAMPLE_EVENT'));
  t.false(t.context.bus.has('doesnt_exist'));
});

test('can check if any NamedEvent handlers exists', t => {
    let handler = () => console.log(1);

    let namedEvent = new NamedEvent('EXAMPLE_EVENT');
    let doesntExistEvent = new NamedEvent('doesnt_exist');

    t.context.bus.addEventListener(namedEvent, handler);

    t.true(t.context.bus.has(namedEvent));
    t.false(t.context.bus.has(doesntExistEvent));
});


test('can dispatch a debug string', t => {
  t.context.bus.addEventListener('EXAMPLE_EVENT', () => console.log(1));
  t.context.bus.addEventListener('EXAMPLE_EVENT', () => console.log(1));
  t.is(t.context.bus.debug(), `Anonymous listening for "EXAMPLE_EVENT"\nAnonymous listening for "EXAMPLE_EVENT"\n`);
});

test('can dispatch NamedEvent a debug string', t => {
    let namedEvent = new NamedEvent('EXAMPLE_EVENT');
    t.context.bus.addEventListener(namedEvent, () => console.log(1));
    t.context.bus.addEventListener('EXAMPLE_EVENT', () => console.log(1));
    t.is(t.context.bus.debug(), `Anonymous listening for "EXAMPLE_EVENT"\nAnonymous listening for "EXAMPLE_EVENT"\n`);
});
