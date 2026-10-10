import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/utils/auth";
function useStomp(options = {}) {
  const defaultBrokerURL = import.meta.env.VITE_APP_WS_ENDPOINT || "";
  const defaultToken = getAccessToken();
  const brokerURL = ref(options.brokerURL ?? defaultBrokerURL);
  const token = options.token ?? defaultToken;
  const isConnected = ref(false);
  const subscriptions = /* @__PURE__ */ new Map();
  let client = ref(null);
  const initializeClient = () => {
    if (!brokerURL.value) {
      console.warn(
        "brokerURL is required. Please set the WebSocket URL in your .env file (VITE_APP_WS_ENDPOINT)."
      );
      return;
    }
    if (!client.value) {
      client.value = new Client({
        brokerURL: brokerURL.value,
        reconnectDelay: options.reconnectDelay ?? 5e3,
        debug: options.debug ? (msg) => console.log("[STOMP]", msg) : () => {
        },
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        heartbeatIncoming: 4e3,
        heartbeatOutgoing: 4e3
      });
      client.value.onConnect = (frame) => {
        isConnected.value = true;
        console.log("STOMP connected", frame);
      };
      client.value.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };
      client.value.onWebSocketClose = (evt) => {
        isConnected.value = false;
        console.warn("WebSocket closed", evt);
      };
    }
  };
  watch(brokerURL, (newURL, oldURL) => {
    if (newURL !== oldURL) {
      console.log(`brokerURL changed from ${oldURL} to ${newURL}`);
      if (client.value && client.value.connected) {
        client.value.deactivate();
      }
      brokerURL.value = newURL;
      initializeClient();
    }
  });
  onMounted(() => {
    console.log("useStomp onMounted initializeClient");
    initializeClient();
  });
  const connect = () => {
    if (client.value && (client.value.connected || client.value.active)) {
      console.log("Already connected or connecting, skipping connect() call.");
      return;
    }
    client.value?.activate();
  };
  const subscribe = (destination, callback) => {
    if (client.value) {
      const subscription = client.value.subscribe(destination, callback);
      subscriptions.set(subscription.id, subscription);
      return subscription.id;
    }
    return "";
  };
  const unsubscribe = (subscriptionId) => {
    const subscription = subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptions.delete(subscriptionId);
    }
  };
  const disconnect = () => {
    if (client.value && !(client.value.connected || client.value.active)) {
      console.log("Already disconnected, skipping disconnect() call.");
      return;
    }
    client.value?.deactivate();
    isConnected.value = false;
  };
  return {
    client,
    isConnected,
    connect,
    subscribe,
    unsubscribe,
    disconnect,
    brokerURL
  };
}
export {
  useStomp
};
