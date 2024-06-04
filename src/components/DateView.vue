<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Details for {{ date }}</h1>
    <div v-if="content.length">
      <div v-for="(item, index) in content" :key="index" class="mb-4">
        <div v-if="item.type === 'text'">{{ item.data }}</div>
        <div v-if="item.type === 'image'"><img :src="item.data" alt="User content" /></div>
        <div v-if="item.type === 'video'"><video controls :src="item.data"></video></div>
        <div v-if="item.type === 'music'"><audio controls :src="item.data"></audio></div>
        <button @click="deleteContent(index)" class="text-red-500">Delete</button>
      </div>
    </div>
    <div v-else>
      <p>No content for this date.</p>
    </div>
    <div class="mt-4">
      <button @click="addText" class="bg-blue-500 text-white px-4 py-2 rounded">Add Text</button>
      <button @click="addImage" class="bg-blue-500 text-white px-4 py-2 rounded">Add Image</button>
      <button @click="addVideo" class="bg-blue-500 text-white px-4 py-2 rounded">Add Video</button>
      <button @click="addMusic" class="bg-blue-500 text-white px-4 py-2 rounded">Add Music</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['date'],
  data() {
    return {
      content: [],
    };
  },
  methods: {
    addText() {
      const text = prompt('Enter text content:');
      if (text) {
        this.content.push({ type: 'text', data: text });
      }
    },
    addImage() {
      const imageUrl = prompt('Enter image URL:');
      if (imageUrl) {
        this.content.push({ type: 'image', data: imageUrl });
      }
    },
    addVideo() {
      const videoUrl = prompt('Enter video URL:');
      if (videoUrl) {
        this.content.push({ type: 'video', data: videoUrl });
      }
    },
    addMusic() {
      const musicUrl = prompt('Enter music URL:');
      if (musicUrl) {
        this.content.push({ type: 'music', data: musicUrl });
      }
    },
    deleteContent(index) {
      this.content.splice(index, 1);
    },
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
