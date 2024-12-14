<template>
    <b-row>
        <b-list-group >
            <b-list-group-item 
                :active="templateIsActive(template)" 
                v-for="template in templates" 
                :key="template.id"
                @click="selectTemplate(template)"
                :variant="variant">

                <template v-if="template.namePrefix"> <b>{{ template.namePrefix }} </b> - </template>  {{ template.name }}

                <b-button href="#" variant="danger" @click="removeTemplate(template)"> <b-icon-x/> </b-button>

            </b-list-group-item>

            <b-list-group-item > 
                <input type="file" ref="fileInput" @change="loadJsonFileTemplate" accept="application/json" style="visibility: hidden; width: 0px; height: 0px;" />

                <b-button href="#" variant="success" @click="$refs.fileInput.click()" class="mx-2"> Add </b-button>
            </b-list-group-item>
        </b-list-group>
    </b-row>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

export default {
    name: 'TemplateSelect',
    props: ["variant"],
    components: {
    },
    data() {
      return {
      }
    },
    computed: {
        ...mapState({
            selectedTemplate: state => state.Templates.currentSelectedTemplate,
            templates: state => state.Templates.templates
        })        
    },
    mounted() {
        
    },
    methods: {
        ...mapMutations({
            setCurrentTemplate: 'Templates/setCurrentTemplate',
            addTemplate: 'Templates/addTemplate',
            deleteTemplate: 'Templates/deleteTemplate',
        }),
        removeTemplate(template) {
            this.deleteTemplate(template);
        },
        loadJsonFileTemplate(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        var result = JSON.parse(e.target.result);
                        this.addTemplate(result);
                    } catch (error) {
                        console.error("Error JSON file loading:", error);
                    }
                };
                reader.readAsText(file);
            }
        },
        selectTemplate(template) {
            this.setCurrentTemplate(template);
        },
        templateIsActive(template) {
            return template.name == this.selectedTemplate.name;
        }
    }
}
</script>