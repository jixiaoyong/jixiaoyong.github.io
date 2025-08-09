// =================================================================================================
// FormValidator Class - 表单验证类
// =================================================================================================

class FormValidator {
  constructor() {
    this.errors = [];
  }

  // 验证组合表单
  validateGroupForm(groupName, items) {
    this.errors = [];

    // 验证组合名称
    if (!groupName || groupName.trim().length === 0) {
      this.errors.push("请输入组合名称");
    }

    // 验证选项列表
    if (!items || items.length === 0) {
      this.errors.push("请至少添加一个选项");
      return false;
    }

    // 验证每个选项
    items.forEach((item, index) => {
      if (!item.title || item.title.trim().length === 0) {
        this.errors.push(`第${index + 1}个选项缺少标题`);
      }
      // 描述字段为可选项，不需要验证
    });

    return this.errors.length === 0;
  }

  // 验证选项表单
  validateItemForm(itemForm) {
    const titleInput = itemForm.querySelector(".item-title");
    const descInput = itemForm.querySelector(".item-description");

    const titleValid = titleInput.value.trim().length > 0;
    // 描述字段为可选项，不需要验证

    titleInput.classList.toggle("invalid", !titleValid);
    descInput.classList.toggle("invalid", false); // 描述字段不显示验证错误

    return titleValid;
  }

  // 获取错误信息
  getErrors() {
    return this.errors;
  }

  // 获取第一个错误信息
  getFirstError() {
    return this.errors.length > 0 ? this.errors[0] : null;
  }

  // 清除错误
  clearErrors() {
    this.errors = [];
  }
}
