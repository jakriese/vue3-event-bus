export default {
  install: (app) => {
    class EventBus extends EventTarget {
      constructor() {
        super();
        this.instances = {};
      }

      // this was created by someone else, but I closed the window and now I can't find it...
      // so kudos to the mystery person who came up with this
      uid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }

      on(type, func, uid) {
        if (!(uid in this.instances)) this.instances[uid] = [];
        const callback = (e) => {
          func(e.detail);
        }
        this.instances[uid].push({ type, callback });
        this.addEventListener(type, callback);
        console.log(this.instances);
      }

      emit(type, payload) {
        const event = new CustomEvent(type, { detail: payload });
        this.dispatchEvent(event);
      }

      destroy(uid) {
        this.instances[uid].forEach(({type, callback}) => {
          this.removeEventListener(type, callback);
        });
        delete this.instances[uid];
      }
    }

    const eventBus = new EventBus();
    app.config.globalProperties.$eventBus = eventBus;

    app.provide('eventBus', eventBus);

    app.mixin({
      created() {
        this.$eventBusListeners = [];
      },
      beforeUnmount() {
        this.$eventBusListeners.forEach(({type, callback}) => {
          this.$eventBus.removeEventListener(type, callback);
        });
      },
      methods: {
        busOn(type, func) {
          const callback = (e) => {
            func.call(this, e.detail);
          }
          this.$eventBusListeners.push({ type, callback });
          this.$eventBus.addEventListener(type, callback);
        },
        busEmit(type, payload) {
          const event = new CustomEvent(type, { detail: payload });
          this.$eventBus.dispatchEvent(event);
        },
      },
    });
  }
}
