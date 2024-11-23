<template>
  <div class="m-4">
    
    <h1> {{ selectedTemplate.name }} </h1>


    <b-row>
      <b-col md="9" sm="12">
        <b-form-checkbox-group v-model="data" >
          <b-row class="">
              <b-col v-for="item, index in selectedTemplate.items" :key="index" md="4" sm="12" align-self="baseline">
                <b-card
                  :title="item.title"
                  class="mb-2"
                >
                  <b-form-checkbox
                    v-for="option, optIndex in item.checkboxes"
                    :key="optIndex"
                    :value="option"
                    :checked.sync="option.checked"
                    @change="val => onChange(val, option, item.checkboxes)"
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
      <b-col md="3" class="d-none d-md-inline">
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
          return this.data.map(m => m.code).join(", ")
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
      removeOptionsIfSelected(options) {
        options.forEach(opt => this.removeOptionIfSelected(opt));
      },
      removeOptionIfSelected(option) {
        const index = this.data.indexOf(option);
        console.log(option, index);
        if (index > -1) { 
          this.data.splice(index, 1); 
        }
      },
      onChange(selected, option, allSectionOptions) {

        var optionChecked = selected.indexOf(option) > -1;
        if(optionChecked && option.deselectAllIfSelected) {
          var optToremove = allSectionOptions.filter(f => !f.deselectAllIfSelected);
          this.removeOptionsIfSelected(optToremove);
        }

        if(optionChecked && !option.deselectAllIfSelected) {
          var optToremove = allSectionOptions.filter(f => f.deselectAllIfSelected);
          console.log(optToremove);
          this.removeOptionsIfSelected(optToremove);
        }


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
