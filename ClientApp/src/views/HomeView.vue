<template>
  <div class="m-4">
    
    <h1> {{ selectedTemplate.name }} </h1>


    <b-row>
      <b-col md="8" sm="12">
        <b-form-checkbox-group v-model="data" >
          <b-row class="">
              <b-col v-for="item, index in selectedTemplate.items" :key="index" md="4" sm="12">
                <b-card
                  :title="item.title"
                  class="mb-2"
                >
                  <b-form-checkbox
                    v-for="option in item.checkboxes"
                    :key="option.code"
                    :value="option.code"
                    @change="val => onChange(val, option.code)"
                  >
                    <b-card-text>
                      <b>{{ option.code }}</b> - {{ option.name }}
                    </b-card-text>
                  </b-form-checkbox>

                </b-card>
              </b-col>
          </b-row>
        </b-form-checkbox-group>

      </b-col>
      <b-col md="2" class="d-none d-md-inline">
        <TemplateSelect></TemplateSelect>
      </b-col>
    </b-row>
  
    <b-row>
      <b-col>
        <b-card
          title="Summary"
          class="mb-2"
        >
          <b-card-text>
            {{ displayData }}
          </b-card-text>
        
          <b-button href="#" class="mr-2" variant="primary" @click="copyToClipBoard(displayData)"> <b-icon-clipboard-plus/> </b-button>
          <b-button href="#" class="mx-2" variant="danger" @click="clearData"> <b-icon-x/> </b-button>

        </b-card>
      </b-col>
    </b-row>
    
  </div>
</template>

<script>
import TemplateSelect from '@/components/TemplateSelect.vue';
import { mapState, mapMutations } from 'vuex';
import { eventBus } from '@/main';

export default {
    name: 'HomeView',
    components: {
      TemplateSelect
    },
    data() {
      return {
        data: []
      }
    },
    computed: {
        ...mapState({
            selectedTemplate: state => state.Templates.currentSelectedTemplate,
        }),
        displayData() {
          return this.data.join(", ")
        }
    },
    mounted() {
      eventBus.$on('before-template-changed', () => {
        this.setTemplateData({ key: this.selectedTemplate.name, data: this.data });
      });

      eventBus.$on('template-changed', () => {
        this.$store.dispatch("TemplatesDataStore/getTemplateData", this.selectedTemplate.name).then(data => this.data = data);
      });
    },
    methods: {
      ...mapMutations({
        setTemplateData: 'TemplatesDataStore/setTemplateData'
      }),
      clearData() {
        this.setTemplateData({ key: this.selectedTemplate.name, data: [] });
        this.data = [];
      },  
      copyToClipBoard(textToCopy){
        navigator.clipboard.writeText(textToCopy);      
      },
      onChange(checked, code) {
        // if(checked) {
        //   this.data.push(code);
        // }

        // if(!checked) {
        //   const index = this.data.indexOf(code);
        //   if (index > -1) { // only splice array when item is found
        //     this.data.splice(index, 1); // 2nd parameter means remove one item only
        //   }
        // }
      }
    }
}
</script>
