import { ref } from "vue";
function usePage() {
  const searchRef = ref();
  const contentRef = ref();
  const addModalRef = ref();
  const editModalRef = ref();
  function handleQueryClick(queryParams) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }
  function handleResetClick(queryParams) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }
  function handleAddClick() {
    addModalRef.value?.setModalVisible();
  }
  function handleEditClick(row) {
    editModalRef.value?.setModalVisible(row);
  }
  function handleSubmitClick() {
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData(queryParams, true);
  }
  function handleExportClick() {
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.exportPageData(queryParams);
  }
  function handleSearchClick() {
    searchRef.value?.toggleVisible();
  }
  function handleFilterChange(filterParams) {
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }
  return {
    searchRef,
    contentRef,
    addModalRef,
    editModalRef,
    handleQueryClick,
    handleResetClick,
    handleAddClick,
    handleEditClick,
    handleSubmitClick,
    handleExportClick,
    handleSearchClick,
    handleFilterChange
  };
}
var stdin_default = usePage;
export {
  stdin_default as default
};
