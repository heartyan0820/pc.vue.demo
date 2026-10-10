import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ToothPositionList from "./index.vue";
describe("ToothPositionList", () => {
  it("renders the component with default props", () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [],
        orderNextWgClass: [],
        orderNextProduct: [],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".tooth-positions").exists()).toBe(true);
  });
  it("toggles tooth selection for upper jaw", async () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [],
        orderNextWgClass: [],
        orderNextProduct: [],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    const upperTooth = wrapper.findAll(".tooth-icon")[0];
    await upperTooth.trigger("click");
    expect(upperTooth.classes()).toContain("selected");
  });
  it("toggles tooth selection for lower jaw", async () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [],
        orderNextWgClass: [],
        orderNextProduct: [],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    const lowerTooth = wrapper.findAll(".tooth-icon")[16];
    await lowerTooth.trigger("click");
    expect(lowerTooth.classes()).toContain("selected");
  });
  it("emits setToothValue event when tooth is selected", async () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [],
        orderNextWgClass: [],
        orderNextProduct: [],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    const upperTooth = wrapper.findAll(".tooth-icon")[0];
    await upperTooth.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("setToothValue");
  });
  it("emits setClassValue event when button is clicked", async () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [{ id: 1, label: "Test" }],
        orderNextWgClass: [],
        orderNextProduct: [],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    const button = wrapper.find("el-button");
    await button.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("setClassValue");
  });
  it("updates orderToothForm when product is changed", async () => {
    const wrapper = mount(ToothPositionList, {
      props: {
        isAdditional: false,
        toothValue: [],
        isClassValue: 0,
        orderNextClass: [],
        orderNextWgClass: [],
        orderNextProduct: [{ value: "test", label: "Test" }],
        orderNextWgProduct: "",
        selectedButton: 0
      }
    });
    const radio = wrapper.find("el-radio");
    await radio.trigger("change");
    expect(wrapper.vm.orderToothForm.orderProductName).toBe("Test");
  });
});
