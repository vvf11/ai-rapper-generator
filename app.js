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

// Примеры изображений для демонстрации (в реальном приложении здесь был бы API-запрос)
const sampleImages = [
    'assets/example1.jpg',
    'assets/example2.jpg',
    'assets/example3.jpg'
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

// Функция генерации рэпера
function generateRapper() {
    const prompt = promptInput.value.trim();
    
    // Проверка на наличие текста в промпте
    if (prompt === '') {
        showNotification('Пожалуйста, введите описание вашего рэп-персонажа', 'error');
        return;
    }
    
    // Показываем индикатор загрузки и секцию результата
    resultSection.classList.remove('hidden');
    loadingSpinner.style.display = 'flex';
    resultImage.style.display = 'none';
    
    // Скролл к секции результата
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Имитация задержки API (в реальном приложении здесь был бы запрос к API генерации изображений)
    setTimeout(() => {
        // Генерация случайного имени и описания
        generateCharacterInfo(prompt);
        
        // Выбор случайного изображения из образцов
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        resultImage.src = randomImage;
        
        // Скрываем индикатор загрузки и показываем изображение
        loadingSpinner.style.display = 'none';
        resultImage.style.display = 'block';
        
        // Уведомление
        showNotification('Персонаж успешно создан!', 'success');
    }, 2000); // 2 секунды для демонстрации
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
function downloadImage() {
    // Проверка, что изображение существует
    if (!resultImage.src || resultImage.style.display === 'none') {
        showNotification('Изображение еще не сгенерировано', 'error');
        return;
    }
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = `${characterName.textContent.replace(/\s+/g, '_')}_rapper.jpg`;
    link.click();
    
    showNotification('Скачивание изображения началось', 'success');
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
    // Проверяем, существует ли уже элемент уведомления
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Создаем элемент уведомления, если он не существует
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Добавляем стили для уведомления
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = 'var(--radius)';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Устанавливаем цвет в зависимости от типа
    if (type === 'error') {
        notification.style.backgroundColor = '#FF3B30';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
    }
    
    // Обновляем текст и показываем уведомление
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
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