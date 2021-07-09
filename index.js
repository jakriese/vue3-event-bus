export default {
  install: (app) => {
    app.config.globalProperties.$eventBus = new EventTarget();

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
