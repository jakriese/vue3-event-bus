# vue3-event-bus
A simple event bus for Vue 3

## Initialization
After you've added the package to your project, you'll need to add the plugin to your Vue app with the `use()` method.

```
import eventbus from '@jakriese/vue3-event-bus';

const app = createApp(Root);
app.use(eventbus);
```

## Using with Options API
To use with the Options API, simply utilize the `busOn` and `busEmit` methods within your components (the plugin adds them as mixins). When using the Options API, the plugin handles keeping track of and removing event bus listeners when the component is unmounted.

#### busOn()
The `busOn()` method sets up a listener on the event bus, it accepts two parameters an event name and callback function. The callback function will be passed the payload if one is included in the emit event.

```
this.busOn('v-button:click', ({ id }) => {
  console.log(`a button with id ${id} was clicked!`);
});
```

#### busEmit()
The `busEmit()` method triggers an event on the event bus, it accepts two parameters an event name and a payload.

```
this.busEmit('v-button:click', { id: this.id });
```

## Using with Composition API
Using the event bus with the composition API is a little different, within the plugin the event bus instance is provided to the app, so it is necessary to inject it within the `setup()` function. Then we generate a unique id for the component and use that with the `on()`, `emit()`, and `destroy()` class methods.

#### Inject the Event Bus
```
import { inject } from 'vue'

export default {
  ...
  setup() {
    const eventBus = inject('eventBus');
  }
}
```

#### Generate a Unique ID
This is necessary for registering listeners and removing them when the component is unmounted.

```
setup() {
  const eventBus = inject('eventBus');
  const uid = eventBus.uid();
}
```

#### Add Listeners and Emitters
Don't forget to add the unique ID as the last parameter of the `on()` method.

```
setup() {
  const eventBus = inject('eventBus');
  const uid = eventBus.uid();

  const handleClick = (e) => {
    eventBus.emit('v-button:click', { event: e });
  }

  const callback = ({ event }) => {
    console.log(event);
  }

  onMounted(() => {
    eventBus.on('v-button:click', callback, uid);
  });
}
```

#### Remove Components Event Listeners when Unmounted
It's important to remove the event listeners when a component is unmounted, otherwise the event listeners will continue to accumulate and trigger even when the component no longer exists.
```
setup() {
  const eventBus = inject('eventBus');
  const uid = eventBus.uid();
  
  onUnmounted(() => {
    eventBus.destroy(uid);
  });
}
```
