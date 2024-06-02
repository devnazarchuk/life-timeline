<template>
    <div>
      <h1>{{ name }}'s Life Calendar</h1>
      <div id="calendar-controls">
        <button @click="setView('weeks')">Weeks</button>
        <button @click="setView('months')">Months</button>
        <button @click="setView('years')">Years</button>
      </div>
      <div id="calendar">
        <div v-for="week in totalWeeks" :key="week" :class="weekClass(week)">
          {{ week }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {},
        totalWeeks: 0,
        name: this.$route.query.name,
        gender: this.$route.query.gender,
        country: this.$route.query.country,
        happinessLevel: this.$route.query.happinessLevel,
        birthdate: new Date(this.$route.query.birthdate)
      };
    },
    created() {
      fetch(`http://localhost:8000/life-expectancy?country=${this.country}&gender=${this.gender}`)
        .then(response => response.json())
        .then(data => {
          const lifeExpectancy = data.lifeExpectancy;
          this.totalWeeks = lifeExpectancy * 52;
        });
    },
    methods: {
      setView(view) {
        // Implement view switching logic here
      },
      weekClass(week) {
        // Implement logic to set CSS class based on the week
        return 'week';
      }
    }
  };
  </script>
  
  <style scoped>
  #calendar {
    display: grid;
    grid-template-columns: repeat(52, 1fr);
    gap: 2px;
  }
  .week {
    width: 20px;
    height: 20px;
    background-color: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .week.past {
    background-color: black;
  }
  .week.present {
    background-color: green;
  }
  </style>
  