<template>
    <v-app dark>
      <v-app-bar
        :clipped-left="clipped"
        fixed
        app
      >
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-app-bar>
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'DefaultLayout',
    data () {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        title: 'Project Planner'
      }
    }
  }
  </script>
  