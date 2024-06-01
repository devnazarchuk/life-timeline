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
    const date = urlParams.get('date');

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
            const unitDate = new Date(birthDate);
            unitDate.setDate(unitDate.getDate() + i * (unit === 'week' ? 7 : (unit === 'month' ? 30 : 365)));
            timeUnitDiv.classList.add("time-unit");
            timeUnitDiv.dataset.date = unitDate.toISOString().split('T')[0];
            if (i < unitsPassed) {
                timeUnitDiv.classList.add("past");
            } else if (i === unitsPassed) {
                timeUnitDiv.classList.add("present");
            }
            timeUnitDiv.addEventListener('click', () => {
                window.location.href = `/day?date=${unitDate.toISOString().split('T')[0]}&interval=${interval}`;
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

    const typeSelect = document.getElementById("type");
    const textContent = document.getElementById("textContent");
    const fileContent = document.getElementById("fileContent");

    typeSelect?.addEventListener("change", function() {
        const selectedType = typeSelect.value;
        if (selectedType === "text") {
            textContent.style.display = "block";
            fileContent.style.display = "none";
        } else if (selectedType) {
            textContent.style.display = "none";
            fileContent.style.display = "block";
        } else {
            textContent.style.display = "none";
            fileContent.style.display = "none";
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

    const addContentButton = document.getElementById("addContentButton");
    const contentForm = document.getElementById("contentForm");

    addContentButton?.addEventListener("click", function() {
        contentForm.style.display = "block";
        addContentButton.style.display = "none";
    });

    const dayDetails = document.getElementById("dayDetails");
    if (dayDetails && dateParam) {
        loadDayDetails(dateParam);
    }
});

async function loadDayDetails(date) {
    const dayDetails = document.getElementById("dayDetails");
    if (dayDetails) {
        dayDetails.innerHTML = '';
        try {
            const response = await fetch(`/events/${date}`);
            const events = await response.json();
            if (Array.isArray(events)) {
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
                        <button onclick="editEvent('${event._id}', '${event.type}', '${event.content}')">Редагувати</button>
                        <button onclick="deleteEvent('${event._id}')">Видалити</button>
                    `;
                    dayDetails.appendChild(eventDiv);
                });
            } else {
                console.error('Expected an array but received:', events);
            }
        } catch (error) {
            console.error('Error loading day details:', error);
        }
    }
}

async function loadEvents(date) {
    const eventsContainer = document.getElementById("eventsContainer");
    if (eventsContainer) {
        eventsContainer.innerHTML = '';
        try {
            const response = await fetch(`/events/${date}`);
            const events = await response.json();
            if (Array.isArray(events)) {
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
                        <button onclick="editEvent('${event._id}', '${event.type}', '${event.content}')">Редагувати</button>
                        <button onclick="deleteEvent('${event._id}')">Видалити</button>
                    `;
                    eventsContainer.appendChild(eventDiv);
                });
            } else {
                console.error('Expected an array but received:', events);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }
}

async function editEvent(id, type, content) {
    let newContent = '';
    if (type === 'text') {
        newContent = prompt('Введіть новий контент:', content);
    } else {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', async () => {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            const response = await fetch(`/events/${id}/file`, {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                alert('Подію оновлено успішно');
                location.reload();
            } else {
                alert('Помилка при оновленні події');
            }
        });
        fileInput.click();
        return;
    }

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
