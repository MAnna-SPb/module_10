const chatButton = document.getElementById('chat-button');
const chatBox = document.getElementById('chat-box');
const closeButton = document.querySelector('.chat__close-button');
const sendButton = document.querySelector('.send-button');
const geoButton = document.querySelector('.geo-button');
const chatInput = document.getElementById('chat-input');
const chatContent = document.querySelector('.chat__content');

// Подключаем эхо-сервер
const socket = new WebSocket('wss://echo.websocket.org/'); // Заменила сайт на приведенный в модуле, т.к. ссылка из задания не сработала - wss://echo-ws-service.herokuapp.com
// Обработчик открытия соединения
socket.addEventListener('open', (event) => {
    console.log('Соединение с WebSocket установлено', event);
});
socket.addEventListener('error', (event) => {
    console.log('Ошибка соединения с WebSocket', event);
});

// Открытие чата
chatButton.addEventListener('click', () => {
    chatButton.style.display = 'none';
    chatBox.style.display = 'flex'; // Изменено с grid на flex
});

// Закрытие чата
closeButton.addEventListener('click', () => {
    chatBox.style.display = 'none';
    chatButton.style.display = 'flex';
});

// Отправка сообщения
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        displayMessage(message, 'outgoing');
        socket.send(message);
        chatInput.value = '';
    }
});

// Отправка сообщения по кнопке Enter
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Получение геолокации
geoButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        displayMessage('Геолокация не поддерживается Вашим браузером', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            const mapLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            const linkElement = `<a href="${mapLink}" target="_blank">Моя геолокация</a>`;
            displayMessage(linkElement, 'outgoing');
            socket.send(JSON.stringify({latitude, longitude}));
        },
        (error) => {
            displayMessage(`Ошибка: ${error.message}`, 'error');
        });
});

// Получение сообщений от сервера
socket.addEventListener('message', (event) => {
    // Отправляем служебное сообщение в консоль
    if (event.data.includes('Request served by')) {
        console.log('Служебное сообщение: ', event.data);
        return;
    }
    // Проверяем, это JSON (геолокация) или обычное сообщение
    try {
        const data = JSON.parse(event.data);
        if (data.latitude && data.longitude) {
            return; // Не выводим ответ сервера на геолокацию
        }
    } catch (e) {
        // Это обычное текстовое сообщение - выводим как входящее
        setTimeout(() => {
            displayMessage(event.data, 'incoming');
        }, 1000);
    }
});

// Функция отображения сообщения
function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message', `message--${type}`);
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}