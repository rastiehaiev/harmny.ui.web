<template>
  <div>
    <w-icon @click.prevent="login('google')">mdi mdi-google</w-icon>
  </div>
</template>

<script>
export default {
  methods: {
    login(provider) {
      window.location.href = `http://localhost:9091/oauth2/authorize/${provider}?redirect_uri=http://localhost:5173/authenticated`
    },
  },
}
</script>
