import { store } from "@/store";
import DictionaryAPI from "@/api/system/dict";
const useDictStore = defineStore("dict", () => {
  const dictionary = useStorage("dictionary", {});
  const setDictionary = (dict) => {
    dictionary.value[dict.code] = dict.dictDataList;
  };
  const loadDictionaries = async () => {
    const dictList = await DictionaryAPI.getOptions("all");
    dictList.forEach(setDictionary);
  };
  const getDictionary = (dictCode) => {
    return dictionary.value[dictCode] || [];
  };
  const clearDictionaryCache = () => {
    dictionary.value = {};
  };
  const updateDictionaryCache = async () => {
    clearDictionaryCache();
    await loadDictionaries();
  };
  return {
    dictionary,
    setDictionary,
    loadDictionaries,
    getDictionary,
    clearDictionaryCache,
    updateDictionaryCache
  };
});
function useDictStoreHook() {
  return useDictStore(store);
}
export {
  useDictStore,
  useDictStoreHook
};
