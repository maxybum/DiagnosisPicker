<template>
  <div class="m-4">
    
    <h1><template v-if="selectedTemplate.namePrefix">{{ selectedTemplate.namePrefix }} - </template> {{ selectedTemplate.name }} </h1>


    <b-row>
      <b-col md="9" sm="12">
        <b-form-checkbox-group v-model="selectedItems" v-if="renderTemplate">
          <b-row ref="flexContainer" class="flex-md-column" :style="{maxHeight: !isMobile ? containerHeight : 'auto' }">
              <b-col class="checkboxes-group px-1" v-for="item in selectedTemplate.items" :key="item.id" md="4" sm="12" align-self="baseline">
                  <b-card
                    :title="item.title"
                    class="mb-2"
                  >
                  
                    <b-form-checkbox
                      v-for="option in item.checkboxes"
                      :key="option.id"
                      :value="option"
                      @change="val => onChange(val, option, item.checkboxes)"
                      class="d-flex"
                      style="align-items: baseline;"
                    >
                        <div class="px-1"><b>{{ option.code }}</b> - {{ option.name }}</div>

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
      <b-col class="px-1" cols="12">
        <b-card
          class="mb-2"
        >
          <h4>Summary {{ selectedTemplate.showTodayDate ? todayDisplayText : '' }}</h4>
          <b-card-text>
            {{ displayData }}
          </b-card-text>
        
          <b-button href="#" class="mr-2" variant="primary" @click="copyToClipBoard(displayData)"> <b-icon-clipboard-plus/> </b-button>
          <b-button href="#" class="mx-2" variant="danger" @click="clearData"> <b-icon-x/> </b-button>

        </b-card>
      </b-col>
      <b-col v-if="showTotalScoresSection" class="px-1" cols="12">
        <b-card
          title="Total scores calculation"
          class="mb-2"
        >
          <b-card-text>

            <h5> Scores: {{ totalScores }} </h5>
            <b-list-group>

              <b-list-group-item  
                v-for="(row, index) in totalScoresCalculated" 
                :key="index" 
                :class="row.accepted ? 'text-success' : 'text-danger'">
                
                <b>{{ row.condition }}: </b> {{ row.conditionDescription }}

              </b-list-group-item>

            </b-list-group>

            <h5 class="pt-2"> Summary: {{ totalScoresCalculatedCopyText }} </h5>
          </b-card-text>
        
          <b-button 
            href="#" 
            class="mr-2" 
            variant="primary" 
            @click="copyToClipBoard(totalScoresCalculatedCopyText)"> 

            <b-icon-clipboard-plus/> 
          </b-button>

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
        selectedItems: [],
        containerHeight: "auto",
        renderTemplate: false
      }
    },
    computed: {
        ...mapState({
            selectedTemplate: state => state.Templates.currentSelectedTemplate,
        }),
        todayDisplayText() {
          return new Date().toLocaleDateString();
        },  
        displayData() {
          var valueString = this.getSortedSelectedItems().map(m => m.code).join(", ");
          return this.selectedTemplate.namePrefix ? `${this.selectedTemplate.namePrefix}: ${valueString}` : valueString;
        },
        isMobile() {
          if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
          } else {
            return false
          }
        },
        sortMap() {
          var result = [];

          this.selectedTemplate.items.forEach(item => {
            item.checkboxes.forEach(checkbox => {
              result.push(checkbox.id);
            });
          });

          return result;
        },
        showTotalScoresSection() {
          return this.selectedTemplate?.enableScoreCalculation;
        },
        totalScores() {
          if(!this.showTotalScoresSection) return;

          var scoresArray = this.selectedItems.map(m => m.score);

          if(scoresArray.length == 0)
            return 0;

          return scoresArray.reduce((acc, score) => acc + score, 0);
        },
        totalScoresCalculated() {
          if(!this.showTotalScoresSection) return;

          var result = [];

          if(!this.selectedTemplate.scoreCalculationMap) {
            result.push({
              condition: "Not Found",
              conditionDescription: "Conditions not found in template settings.",
              accepted: false
            });

            return result;
          } 

          for(var condition in this.selectedTemplate.scoreCalculationMap) {
            result.push({
              condition: condition,
              conditionDescription: this.selectedTemplate.scoreCalculationMap[condition],
              accepted: eval(condition.replaceAll("totalScores", this.totalScores))
            });
          }

          return result;
        },
        totalScoresCalculatedCopyText() {
          if(!this.showTotalScoresSection) return;

          return this.totalScoresCalculated.filter(f => f.accepted).map(m => m.conditionDescription).join(', ');
        }
    },
    mounted() {
      eventBus.$on('before-template-changed', () => {
        this.renderTemplate = false;
        this.containerHeight = "auto";
        this.setTemplateData({ key: this.selectedTemplate.id, data: this.selectedItems });
      });

      eventBus.$on('template-changed', () => {
        this.$store.dispatch("TemplatesDataStore/getTemplateData", this.selectedTemplate.id).then(data => { this.selectedItems = data; this.renderTemplate = true; });
      });

      this.renderTemplate = true;
    },
    watch: {
      renderTemplate(newVal) {
        if(newVal === true) {
          this.$nextTick(() => {
            this.reCalculateContainerHeight();
          });
        }
      }
    },
    methods: {
      getSortedSelectedItems() {
        var items = [...this.selectedItems]
        var result = [];

        this.sortMap.forEach(id => {
          var found = false;
          items = items.filter(function(item) {
              if(!found && item.id == id) {
                  result.push(item);
                  found = true;
                  return false;
              } else
                  return true;
          })
        });

        return result;
      },
      reCalculateContainerHeight() {
        var height = this.$refs.flexContainer.offsetHeight;
        if(height > 0) {
          this.containerHeight = `${height / 3 + 100}px` 
        } else {
          this.containerHeight = "auto";
        }
      },
      ...mapMutations({
        setTemplateData: 'TemplatesDataStore/setTemplateData'
      }),
      clearData() {
        this.setTemplateData({ key: this.selectedTemplate.name, data: [] });
        this.selectedItems = [];
      },  
      copyToClipBoard(textToCopy){
        var toCopy = textToCopy;

        if(this.selectedTemplate.addTodayDateToCopiedText) 
          toCopy = toCopy + " " + this.todayDisplayText;

        navigator.clipboard.writeText(toCopy);      
      },
      removeOptionsIfSelected(options) {
        options.forEach(opt => this.removeOptionIfSelected(opt));
      },
      removeOptionIfSelected(option) {
        const index = this.selectedItems.indexOf(option);
        if (index > -1) { 
          this.selectedItems.splice(index, 1); 
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
          this.removeOptionsIfSelected(optToremove);
        }

      }
    }
}
</script>

<style scoped>
.checkboxes-group{
  position: inherit
}
</style>