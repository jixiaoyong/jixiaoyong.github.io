document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new DataManager();
    const confirmManager = new ConfirmManager({
        dialog: document.getElementById('confirm-dialog'),
        message: document.getElementById('confirm-message'),
        yesButton: document.getElementById('confirm-yes'),
        noButton: document.getElementById('confirm-no')
    });
    const toastManager = new ToastManager(document.getElementById('toast'));

    const prizeForm = document.getElementById('prize-form');
    const prizeNameInput = document.getElementById('prize-name');
    const prizeQuantityInput = document.getElementById('prize-quantity');
    const prizeList = document.getElementById('prize-list');

    const userForm = document.getElementById('user-form');
    const userNameInput = document.getElementById('user-name');
    const userList = document.getElementById('user-list');

    const clearDataButton = document.getElementById('clear-data');

    const prizeValidator = new FormValidator(prizeForm);
    const userValidator = new FormValidator(userForm);

    function renderPrizes() {
        prizeList.innerHTML = '';
        dataManager.getLotteryData().prizes.forEach((prize, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${prize.name} (x${prize.quantity})</span>
                <button data-index="${index}" class="delete-prize">删除</button>
            `;
            prizeList.appendChild(li);
        });
    }

    function renderUsers() {
        userList.innerHTML = '';
        dataManager.getLotteryData().users.forEach((user, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${user.name}</span>
                <button data-index="${index}" class="delete-user">删除</button>
            `;
            userList.appendChild(li);
        });
    }

    prizeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!prizeValidator.validate()) {
            toastManager.show('请填写所有必填项');
            return;
        }
        const name = prizeNameInput.value.trim();
        const quantity = parseInt(prizeQuantityInput.value.trim(), 10);
        dataManager.addPrize({ name, quantity });
        renderPrizes();
        prizeForm.reset();
        toastManager.show('奖品添加成功');
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!userValidator.validate()) {
            toastManager.show('请填写所有必填项');
            return;
        }
        const name = userNameInput.value.trim();
        dataManager.addUser({ name });
        renderUsers();
        userForm.reset();
        toastManager.show('人员添加成功');
    });

    prizeList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-prize')) {
            const index = e.target.dataset.index;
            confirmManager.show('确定要删除这个奖品吗？', () => {
                dataManager.deletePrize(index);
                renderPrizes();
                toastManager.show('奖品删除成功');
            });
        }
    });

    userList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-user')) {
            const index = e.target.dataset.index;
            confirmManager.show('确定要删除该用户吗？', () => {
                dataManager.deleteUser(index);
                renderUsers();
                toastManager.show('用户删除成功');
            });
        }
    });

    clearDataButton.addEventListener('click', () => {
        confirmManager.show('确定要清空所有数据吗？此操作不可逆！', () => {
            dataManager.clearAllData();
            renderPrizes();
            renderUsers();
            toastManager.show('所有数据已清空');
        });
    });

    renderPrizes();
    renderUsers();
});