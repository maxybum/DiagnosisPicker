<template>
    <b-row>
        <b-list-group>
            <b-list-group-item 
                :active="templateIsActive(template)" 
                v-for="template in templates" 
                :key="template.name"
                @click="selectTemplate(template)">

                {{ template.name }}

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
    components: {
    },
    data() {
      return {
        data: []
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
                        var result = JSON.parse(e.target.result); // Парсимо JSON у об'єкт
                        console.log("JSON завантажено:", result);
                        this.addTemplate(result);
                    } catch (error) {
                        console.error("Помилка при обробці JSON:", error);
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