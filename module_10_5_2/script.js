const button = document.querySelector('.j-btn-test');

button.addEventListener('click', () => {
    // 1. Запускаем анимацию SVG
    button.classList.add('btn--magic');
    // 2. Через 2 секунды (после завершения анимации) показываем alert
    setTimeout(() => {
        // Получаем размеры экрана (окна браузера)
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        // Получаем размеры области просмотра (видимой части страницы)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Формируем и отправляем информационное сообщение
        const message = `Размер экрана: ${screenWidth}px x ${screenHeight}px.\n` +
            `Размер области просмотра: ${viewportWidth}px x ${viewportHeight}px.`;
        alert(message);
        // Убираем класс анимации после показа alert
        button.classList.remove('btn--magic');

    }, 1000);
});
