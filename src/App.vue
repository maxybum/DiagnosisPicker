

<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark" class="px-2" fixed="top">
        <b-navbar-brand href="#">DiagnosisPicker</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="mx-auto d-sm-none">

            <b-row class="mx-1 my-2">
              <TemplateSelect variant="dark"/>
            </b-row>

          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div>

    <b-container fluid id="app" class="mx-0 pt-4 mt-2 px-0">
      <router-view />
    </b-container>

  </div>

</template>

<script>
import TemplateSelect from '@/components/TemplateSelect.vue';

export default {
  components: {
    TemplateSelect
  }
}


</script>

<style scoped>

</style>
