<template>
    <div>
      <h1>Welcome to the Life Calendar</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div>
          <label for="gender">Gender:</label>
          <select id="gender" v-model="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label for="country">Country:</label>
          <select id="country" v-model="country" required>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
        <div>
          <label for="happiness">Happiness Level:</label>
          <input type="range" id="happiness" v-model="happinessLevel" min="0" max="100" />
          <span>{{ happinessLevel }}</span>
        </div>
        <div>
          <label for="birthdate">Birthdate:</label>
          <input type="date" id="birthdate" v-model="birthdate" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        gender: '',
        country: '',
        happinessLevel: 50,
        birthdate: ''
      };
    },
    methods: {
      submitForm() {
        this.$router.push({
          path: '/calendar',
          query: {
            name: this.name,
            gender: this.gender,
            country: this.country,
            happinessLevel: this.happinessLevel,
            birthdate: this.birthdate
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add appropriate styling here */
  </style>
  