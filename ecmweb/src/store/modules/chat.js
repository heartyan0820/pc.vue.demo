import { store } from "@/store";
import { getActiveIndex } from "@/utils/auth";
const useChatStore = defineStore("chat", () => {
  const activeIndex = ref(0);
  const roomId = ref(0);
  const roomInfo = ref({});
  const orderInfo = ref(null);
  const roomType = ref(0);
  const quoteMessage = ref(null);
  const btnAiObj = ref(null);
  const router = ref("");
  const commandWord = ref("");
  const isSendAi = ref(false);
  const memberList = ref([]);
  const inputValue = ref("");
  const showExtraPanel = ref(false);
  const showEmojiPanel = ref(false);
  const showAt = ref(false);
  const activeIndexs = getActiveIndex();
  const toggleActiveIndex = (index) => {
    activeIndex.value = index;
  };
  const setRoomId = (id) => {
    roomId.value = id;
  };
  const setRoomType = (id) => {
    roomType.value = id;
  };
  const closeRoom = () => {
    activeIndex.value = 0;
    roomId.value = 0;
    showExtraPanel.value = false;
    showEmojiPanel.value = false;
    showAt.value = false;
    orderInfo.value = null;
  };
  const toggleExtraPanel = () => {
    showExtraPanel.value = !showExtraPanel.value;
    showEmojiPanel.value = false;
    showAt.value = false;
  };
  const toggleEmojiPanel = () => {
    showEmojiPanel.value = !showEmojiPanel.value;
    showExtraPanel.value = false;
    showAt.value = false;
  };
  const closeEmojiPanel = () => {
    showEmojiPanel.value = false;
  };
  const closeAllPanels = () => {
    showExtraPanel.value = false;
    showEmojiPanel.value = false;
    showAt.value = false;
  };
  const closeQuoteMessage = () => {
    quoteMessage.value = null;
  };
  return {
    roomId,
    activeIndex,
    roomInfo,
    quoteMessage,
    orderInfo,
    roomType,
    btnAiObj,
    router,
    commandWord,
    isSendAi,
    memberList,
    showAt,
    inputValue,
    toggleActiveIndex,
    setRoomId,
    setRoomType,
    closeRoom,
    showExtraPanel,
    toggleExtraPanel,
    showEmojiPanel,
    toggleEmojiPanel,
    closeEmojiPanel,
    closeAllPanels,
    closeQuoteMessage
  };
});
function useChatStoreHook() {
  return useChatStore(store);
}
export {
  useChatStore,
  useChatStoreHook
};
