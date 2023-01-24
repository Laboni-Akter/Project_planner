<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      @click="logout"
      outlined
    >
     {{email}}
      <v-icon class="ml-1">mdi-export</v-icon>
    </v-btn>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      email: null,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-code-braces-box',
          title: 'Projects',
          to: '/'
        },
        {
          icon: 'mdi-account-group',
          title: 'Resources',
          to: '/resources'
        },
        {
          icon: 'mdi-repeat',
          title: 'Plans',
          to: '/plans'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Project Planner'
    }
  },
  mounted(){
    const user = localStorage.getItem('user');
    this.email = (JSON.parse(user)||{}).email;
  },
  methods: {
    logout(){
      localStorage.removeItem('user');
      this.$router.push('/auth');
    }
  }
}

</script>
