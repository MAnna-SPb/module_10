const containerButton = document.querySelector(".container__button");

// Отключаем дефолтный DnD
containerButton.ondragstart = () => false;

containerButton.addEventListener('mousedown', (e) => {
    // Добавляем CSS для плавного перемещения
    containerButton.style.transition = 'none';
    containerButton.style.willChange = 'transform';

    // Получаем начальные координаты курсора
    const startX = e.clientX;
    const startY = e.clientY;

    // Получаем текущее положение кнопки относительно viewport
    const rect = containerButton.getBoundingClientRect();
    const startLeft = rect.left;
    const startTop = rect.top;

    // Учитываем scroll страницы, чтобы кнопка не прыгала
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Устанавливаем начальное положение кнопки с учетом scroll
    containerButton.style.position = 'fixed';
    containerButton.style.left = (startLeft + scrollX) + 'px';
    containerButton.style.top = (startTop + scrollY) + 'px';
    containerButton.style.zIndex = 1000;
    containerButton.style.margin = '0'; // Убираем возможные отступы

    const moveAt = (e) => {
        // Вычисляем новые координаты
        const newX = startLeft + (e.clientX - startX);
        const newY = startTop + (e.clientY - startY);

        // Применяем новые координаты
        containerButton.style.left = newX + 'px';
        containerButton.style.top = newY + 'px';
    };

    const theEnd = () => {
        // Возвращаем transition
        containerButton.style.transition = 'transform 0.3s';
        document.removeEventListener('mousemove', moveAt);
        document.removeEventListener('mouseup', theEnd);
    };

    document.addEventListener('mousemove', moveAt);
    document.addEventListener('mouseup', theEnd);

    // Предотвращаем выделение текста при перетаскивании
    e.preventDefault();
});

// Обработчики hover без изменений
containerButton.addEventListener('mouseenter', () => {
    containerButton.classList.add('active');
});

containerButton.addEventListener('mouseleave', () => {
    containerButton.classList.remove('active');
});