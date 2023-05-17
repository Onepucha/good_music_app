<template>
  <q-dialog
    class="g-music-search-modal"
    :maximized="maximizedToggle"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card>
      <q-card-section>
        <q-input
          v-model="searchQuery"
          label="Search"
          :clearable="true"
          @keyup="search"
          @clear="clearSearch"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll">
        <div>
          <q-btn
            v-for="category in categories"
            :id="category.id"
            :key="category.id"
            :label="category.label"
            :color="category.active ? 'primary' : 'secondary'"
            @click="toggleFilter(category.id)"
          />
        </div>
        <div v-if="searchResults.length > 0">
          <p>{{ searchResults.length }} results found.</p>
          <div v-for="result in searchResults" :key="result.id">
            <p>{{ result.title }}</p>
            <p>{{ result.body }}</p>
          </div>
        </div>
        <div v-else>
          <p>No results found.</p>
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn label="Clear Filters" @click="clearFilters" />
        <q-btn v-close-popup label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const searchQuery = ref('')
const searchResults = ref([])
const maximizedToggle = ref(true)
const categories = ref([
  { id: 'category1', label: 'Category 1', active: false },
  { id: 'category2', label: 'Category 2', active: false },
  { id: 'category3', label: 'Category 3', active: false },
])

const search = async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
  const results = response.data.filter((result: any) => {
    // filter results based on active categories
    return categories.value.some((category) => {
      if (category.active) {
        return result.title.includes(category.label)
      }
      return true
    })
  })
  // filter results based on search query
  searchResults.value = results.filter((result: any) => {
    return result.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
}

const toggleFilter = (categoryId: string) => {
  const category: any = categories.value.find((c) => c.id === categoryId)
  category.active = !category.active
  search()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const clearFilters = () => {
  categories.value.forEach((category) => {
    category.active = false
  })
  search()
}
</script>

<style scoped></style>
