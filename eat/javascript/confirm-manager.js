// =================================================================================================
// ConfirmManager Class - 确认对话框管理类
// =================================================================================================

class ConfirmManager {
  constructor() {
    this.currentModal = null;
  }

  // 显示确认对话框
  show(message, onConfirm, onCancel) {
    // 关闭之前的对话框
    if (this.currentModal) {
      this.hide();
    }

    const confirmModal = document.createElement("div");
    confirmModal.className = "confirm-modal modal";
    confirmModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    `;

    confirmModal.innerHTML = `
      <div class="modal-content confirm-content" style="
        background: var(--card-bg);
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 30px var(--shadow-heavy);
      ">
        <div class="confirm-message" style="
          text-align: center;
          margin-bottom: 20px;
          color: var(--text-dark);
          font-size: 1.1em;
        ">${Utils.escapeHtml(message)}</div>
        <div class="confirm-actions" style="
          display: flex;
          justify-content: center;
          gap: 15px;
        ">
          <button class="cancel-btn" style="
            background: var(--button-muted);
            color: var(--text-primary);
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            transition: all 0.3s ease;
          ">取消</button>
          <button class="confirm-btn" style="
            background: var(--button-danger);
            color: var(--text-primary);
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            transition: all 0.3s ease;
          ">确认</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);
    this.currentModal = confirmModal;

    const confirmBtn = confirmModal.querySelector(".confirm-btn");
    const cancelBtn = confirmModal.querySelector(".cancel-btn");

    const closeModal = () => {
      this.hide();
    };

    confirmBtn.addEventListener("click", () => {
      closeModal();
      if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener("click", () => {
      closeModal();
      if (onCancel) onCancel();
    });

    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) {
        closeModal();
        if (onCancel) onCancel();
      }
    });

    // 添加悬停效果
    [confirmBtn, cancelBtn].forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        btn.style.opacity = "0.8";
        btn.style.transform = "translateY(-1px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      });
    });
  }

  // 隐藏确认对话框
  hide() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
  }
}
