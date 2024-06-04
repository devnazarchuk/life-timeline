<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Your Life Timeline</h1>
    <div class="flex justify-between items-center mb-4">
      <button @click="setInterval('week')" class="bg-blue-500 text-white px-4 py-2 rounded">Weeks</button>
      <button @click="setInterval('month')" class="bg-blue-500 text-white px-4 py-2 rounded">Months</button>
      <button @click="setInterval('year')" class="bg-blue-500 text-white px-4 py-2 rounded">Years</button>
    </div>
    <div class="grid grid-cols-10 gap-2">
      <div
        v-for="(period, index) in periods"
        :key="index"
        :class="{
          'bg-black': period === 'past',
          'bg-green-500': period === 'current',
          'bg-gray-200': period === 'future'
        }"
        class="w-10 h-10 border"
        @mouseover="showTooltip(index)"
        @mouseout="hideTooltip"
        @click="goToPeriod(index)">
        <span v-if="tooltipIndex === index">{{ getPeriodLabel(index) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['name', 'gender', 'country', 'happiness', 'birthdate'],
  data() {
    return {
      lifeExpectancy: 0,
      periods: [],
      interval: 'week',
      tooltipIndex: null,
    };
  },
  mounted() {
    this.calculateLifeExpectancy();
    this.generateTimeline();
  },
  methods: {
    calculateLifeExpectancy() {
      this.lifeExpectancy = this.gender === 'male' ? 75 : 80;
      this.lifeExpectancy += Math.floor(Math.random() * 4) + 5; // Add 5-8 years randomly
    },
    generateTimeline() {
      const birthDate = new Date(this.birthdate);
      const currentDate = new Date();
      const totalPeriods = this.lifeExpectancy * (this.interval === 'week' ? 52 : this.interval === 'month' ? 12 : 1);
      const elapsedPeriods = this.calculateElapsedPeriods(birthDate, currentDate);

      for (let i = 0; i < totalPeriods; i++) {
        if (i < elapsedPeriods) {
          this.periods.push('past');
        } else if (i === elapsedPeriods) {
          this.periods.push('current');
        } else {
          this.periods.push('future');
        }
      }
    },
    calculateElapsedPeriods(startDate, endDate) {
      const diff = endDate - startDate;
      if (this.interval === 'week') {
        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
      } else if (this.interval === 'month') {
        return Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
      } else {
        return Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
      }
    },
    setInterval(interval) {
      this.interval = interval;
      this.periods = [];
      this.generateTimeline();
    },
    showTooltip(index) {
      this.tooltipIndex = index;
    },
    hideTooltip() {
      this.tooltipIndex = null;
    },
    getPeriodLabel(index) {
      if (this.interval === 'week') {
        const weekNumber = index % 52;
        const yearNumber = Math.floor(index / 52);
        return `Week ${weekNumber + 1}, Year ${yearNumber + 1}`;
      } else if (this.interval === 'month') {
        const monthNumber = index % 12;
        const yearNumber = Math.floor(index / 12);
        return `Month ${monthNumber + 1}, Year ${yearNumber + 1}`;
      } else {
        return `Year ${index + 1}`;
      }
    },
    goToPeriod(index) {
      this.$router.push({ name: 'DateView', params: { date: this.getPeriodLabel(index) } });
    },
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
