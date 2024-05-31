document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("birthdateForm");
    const intervalContainer = document.getElementById("intervalContainer");
    const proceedButton = document.getElementById("proceedButton");

    form?.addEventListener("submit", function(event) {
        event.preventDefault();
        const birthdate = document.getElementById("birthdate").value;
        if (birthdate) {
            intervalContainer.style.display = "block";
        }
    });

    proceedButton?.addEventListener("click", function() {
        const birthdate = document.getElementById("birthdate").value;
        const interval = document.getElementById("interval").value;
        if (birthdate && interval) {
            window.location.href = `/timeline?birthdate=${birthdate}&interval=${interval}`;
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const birthdate = urlParams.get('birthdate');
    const interval = urlParams.get('interval');

    if (birthdate && interval) {
        const intervalSelect = document.getElementById("interval");
        intervalSelect.value = interval;
        
        const weeksContainer = document.getElementById("timelineContainer");
        const birthDate = new Date(birthdate);
        const currentDate = new Date();
        let totalUnits;
        let unitsPassed;
        let unit;

        switch (interval) {
            case 'weeks':
                totalUnits = 90 * 52;
                unitsPassed = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24 * 7));
                unit = 'week';
                break;
            case 'months':
                totalUnits = 90 * 12;
                unitsPassed = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24 * 30));
                unit = 'month';
                break;
            case 'years':
                totalUnits = 90;
                unitsPassed = currentDate.getFullYear() - birthDate.getFullYear();
                unit = 'year';
                break;
        }

        for (let i = 0; i < totalUnits; i++) {
            const timeUnitDiv = document.createElement("div");
            timeUnitDiv.classList.add("time-unit");
            if (i < unitsPassed) {
                timeUnitDiv.classList.add("past");
            } else if (i === unitsPassed) {
                timeUnitDiv.classList.add("present");
            }
            timeUnitDiv.addEventListener('click', () => {
                window.location.href = `/event?date=${new Date(birthDate).setDate(birthDate.getDate() + i * (unit === 'week' ? 7 : (unit === 'month' ? 30 : 365)))}`;
            });
            weeksContainer.appendChild(timeUnitDiv);
        }
    }

    const updateIntervalButton = document.getElementById("updateIntervalButton");
    updateIntervalButton?.addEventListener("click", function() {
        const newInterval = document.getElementById("interval").value;
        if (birthdate && newInterval) {
            window.location.href = `/timeline?birthdate=${birthdate}&interval=${newInterval}`;
        }
    });

    const searchButton = document.getElementById("searchButton");
    searchButton?.addEventListener("click", function() {
        const searchDate = document.getElementById("searchDate").value;
        if (searchDate) {
            const resultContainer = document.getElementById("resultContainer");
            resultContainer.innerHTML = `<p>Вибрана дата: ${searchDate}</p>`;
            // Додати код для відображення подій та взаємодії з вибраною датою
        }
    });

    const eventForm = document.getElementById("eventForm");
    eventForm?.addEventListener("submit", async function(event) {
        event.preventDefault();
        const formData = new FormData(eventForm);
        const response = await fetch('/events', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Подію додано успішно');
            const date = formData.get('date');
            loadEvents(date); // Завантажити події для поточної дати
        } else {
            alert('Помилка при додаванні події');
        }
    });

    const dateParam = urlParams.get('date');
    if (dateParam) {
        loadEvents(dateParam);
    }
});

async function loadEvents(date) {
    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = '';
    const response = await fetch(`/events/${date}`);
    const events = await response.json();
    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        let content;
        switch (event.type) {
            case 'image':
                content = `<img src="/uploads/${event.content}" alt="Image">`;
                break;
            case 'video':
                content = `<video controls src="/uploads/${event.content}"></video>`;
                break;
            case 'music':
                content = `<audio controls src="/uploads/${event.content}"></audio>`;
                break;
            default:
                content = event.content;
        }
        eventDiv.innerHTML = `
            <p>Тип: ${event.type}</p>
            <div>${content}</div>
            <button onclick="editEvent('${event._id}')">Редагувати</button>
            <button onclick="deleteEvent('${event._id}')">Видалити</button>
        `;
        eventsContainer.appendChild(eventDiv);
    });
}

async function editEvent(id) {
    const newContent = prompt('Введіть новий контент:');
    if (newContent) {
        const response = await fetch(`/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent })
        });

        if (response.ok) {
            alert('Подію оновлено успішно');
            location.reload();
        } else {
            alert('Помилка при оновленні події');
        }
    }
}

async function deleteEvent(id) {
    const response = await fetch(`/events/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Подію видалено успішно');
        location.reload();
    } else {
        alert('Помилка при видаленні події');
    }
}
