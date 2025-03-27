// Элементы DOM
const promptInput = document.getElementById('prompt-input');
const clearBtn = document.getElementById('clear-btn');
const generateBtn = document.getElementById('generate-btn');
const resultSection = document.getElementById('result-section');
const resultImage = document.getElementById('result-image');
const loadingSpinner = document.getElementById('loading-spinner');
const characterName = document.getElementById('character-name');
const characterDescription = document.getElementById('character-description');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

// Примеры изображений для демонстрации (использую онлайн-URL вместо локальных файлов)
const sampleImages = [
    'https://img.freepik.com/free-photo/ai-generated-concept-human_23-2150688409.jpg',
    'https://img.freepik.com/free-photo/stylish-man-wearing-sunglasses-suit-generated-by-ai_188544-30799.jpg',
    'https://img.freepik.com/free-photo/cyber-woman-with-neon-lights-her-face-ai-generated-image_268835-6395.jpg'
];

// Примеры имен для демонстрации
const rapperNames = [
    'FlowMaster',
    'LyricSmith',
    'QuantumVerse',
    'TechnoFlow',
    'CyberRhyme',
    'NeuroVerse',
    'PhantomFlow',
    'SyntaxError',
    'DataBeat',
    'LogicFlow'
];

// Максимальная длина промпта
const MAX_PROMPT_LENGTH = 500;

// Обработчик события для кнопки очистки
clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.focus();
});

// Обработчик события для кнопки генерации
generateBtn.addEventListener('click', generateRapper);

// Обработчик события для кнопки скачивания
downloadBtn.addEventListener('click', downloadImage);

// Обработчик события для кнопки "Поделиться"
shareBtn.addEventListener('click', shareImage);

// Обработчик события для ввода промпта
promptInput.addEventListener('input', () => {
    const length = promptInput.value.length;
    if (length > MAX_PROMPT_LENGTH) {
        promptInput.value = promptInput.value.slice(0, MAX_PROMPT_LENGTH);
        showNotification(`Максимальная длина промпта: ${MAX_PROMPT_LENGTH} символов`, 'error');
    }
});

// Обработчик офлайн/онлайн режима
window.addEventListener('online', () => {
    showNotification('Подключение восстановлено', 'success');
    generateBtn.disabled = false;
});

window.addEventListener('offline', () => {
    showNotification('Отсутствует подключение к интернету', 'error');
    generateBtn.disabled = true;
});

// Функция генерации рэпера
async function generateRapper() {
    const prompt = promptInput.value.trim();
    
    if (prompt === '') {
        showNotification('Пожалуйста, введите описание вашего рэп-персонажа', 'error');
        return;
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
        showNotification(`Максимальная длина промпта: ${MAX_PROMPT_LENGTH} символов`, 'error');
        return;
    }

    if (!navigator.onLine) {
        showNotification('Отсутствует подключение к интернету', 'error');
        return;
    }
    
    try {
        resultSection.classList.remove('hidden');
        loadingSpinner.style.display = 'flex';
        resultImage.style.display = 'none';
        
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // Добавляем обработчики для изображения
        resultImage.onerror = () => {
            loadingSpinner.style.display = 'none';
            showNotification('Ошибка загрузки изображения. Попробуйте еще раз.', 'error');
            // Устанавливаем fallback изображение
            resultImage.src = 'assets/fallback-image.jpg';
            resultImage.style.display = 'block';
        };

        resultImage.onload = () => {
            loadingSpinner.style.display = 'none';
            resultImage.style.display = 'block';
            showNotification('Персонаж успешно создан!', 'success');
        };
        
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        generateCharacterInfo(prompt);
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        resultImage.src = randomImage;
        
    } catch (error) {
        console.error('Ошибка при генерации:', error);
        showNotification('Произошла ошибка при генерации персонажа', 'error');
        loadingSpinner.style.display = 'none';
    }
}

// Функция для генерации информации о персонаже
function generateCharacterInfo(prompt) {
    // Генерация имени (в реальном приложении это делал бы AI на основе промпта)
    const randomName = rapperNames[Math.floor(Math.random() * rapperNames.length)];
    characterName.textContent = randomName;
    
    // Создание короткого описания на основе промпта
    // В реальном приложении это генерировалось бы с помощью AI
    const promptWords = prompt.split(' ');
    let description = '';
    
    if (promptWords.length > 20) {
        // Извлекаем ключевые слова из промпта
        const keywords = promptWords.filter(word => 
            word.length > 5 && 
            !['about', 'which', 'there', 'their', 'other', 'have', 'with'].includes(word.toLowerCase())
        ).slice(0, 5);
        
        description = `Уникальный AI рэпер с фокусом на ${keywords.join(', ')}. ` +
                     `Его стиль объединяет креативность и технику, создавая непревзойденные баттл-треки. ` +
                     `Готов к соревнованию на платформе Fraction AI.`;
    } else {
        description = `Уникальный AI рэпер, созданный на основе вашего промпта. ` +
                     `Мастер слова, готовый к рэп-баттлам на платформе Fraction AI.`;
    }
    
    characterDescription.textContent = description;
}

// Функция скачивания изображения
async function downloadImage() {
    try {
        if (!resultImage.src || resultImage.style.display === 'none') {
            showNotification('Изображение еще не сгенерировано', 'error');
            return;
        }

        // Проверяем валидность URL
        const url = new URL(resultImage.src);
        if (!['http:', 'https:'].includes(url.protocol)) {
            showNotification('Недопустимый URL изображения', 'error');
            return;
        }

        // Получаем изображение как Blob
        const response = await fetch(resultImage.src);
        if (!response.ok) {
            throw new Error('Ошибка загрузки изображения');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Создаем безопасное имя файла
        const safeName = characterName.textContent
            .replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')
            .toLowerCase();
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${safeName}_rapper.jpg`;
        link.click();

        // Очищаем URL
        window.URL.revokeObjectURL(blobUrl);
        
        showNotification('Скачивание изображения началось', 'success');
    } catch (error) {
        console.error('Ошибка при скачивании:', error);
        showNotification('Ошибка при скачивании изображения', 'error');
    }
}

// Функция для поделиться изображением
function shareImage() {
    // Проверка, что изображение существует
    if (!resultImage.src || resultImage.style.display === 'none') {
        showNotification('Изображение еще не сгенерировано', 'error');
        return;
    }
    
    // Проверка поддержки Web Share API
    if (navigator.share) {
        navigator.share({
            title: `AI Rapper: ${characterName.textContent}`,
            text: characterDescription.textContent,
            url: window.location.href
        })
        .then(() => showNotification('Успешно поделились!', 'success'))
        .catch(error => {
            console.error('Ошибка при попытке поделиться:', error);
            showNotification('Не удалось поделиться', 'error');
        });
    } else {
        // Если Web Share API не поддерживается, показываем диалог
        alert(`Поделитесь этим рэпером:\n\nИмя: ${characterName.textContent}\n\nОписание: ${characterDescription.textContent}`);
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    // Используем существующее уведомление или создаем новое
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Устанавливаем тип уведомления через класс
    notification.className = `notification ${type}`;
    
    // Обновляем текст
    notification.textContent = message;
    
    // Показываем уведомление
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Инициализация страницы
window.addEventListener('DOMContentLoaded', () => {
    // Примерный промпт для демонстрации
    const examplePrompt = `You are an elite rap battle artist with a razor-sharp wit and strategic wordplay, designed to dismantle your opponent's persona with devastating precision. Your style is aggressive yet witty, blending poetic elements with a fierce competitive edge.`;
    
    // Устанавливаем примерный промпт, если поле пустое
    if (promptInput.value.trim() === '') {
        promptInput.value = examplePrompt;
    }
}); 