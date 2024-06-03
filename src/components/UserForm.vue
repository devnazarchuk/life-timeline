<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Welcome! Enter Your Details</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input type="text" v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
        <select v-model="gender" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Country</label>
        <input type="text" v-model="country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Happiness Level</label>
        <input type="range" v-model="happiness" min="0" max="100" class="w-full" />
        <span :class="{'text-green-500': happiness > 70, 'text-yellow-500': happiness > 30 && happiness <= 70, 'text-red-500': happiness <= 30}">{{ happiness }}%</span>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
        <div class="flex">
          <input type="number" v-model="day" min="1" max="31" placeholder="DD" class="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          <input type="number" v-model="month" min="1" max="12" placeholder="MM" class="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-2" required />
          <input type="number" v-model="year" min="1900" :max="new Date().getFullYear()" placeholder="YYYY" class="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: '',
      gender: 'male',
      country: '',
      happiness: 50,
      day: '',
      month: '',
      year: '',
    };
  },
  methods: {
    submitForm() {
      this.$router.push({
        name: 'Timeline',
        params: {
          name: this.name,
          gender: this.gender,
          country: this.country,
          happiness: this.happiness,
          birthdate: `${this.year}-${this.month}-${this.day}`,
        },
      });
    },
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
