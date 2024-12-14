import Vue from 'vue';
import { eventBus } from '@/main';
import { generateTemplatesIds, generateTemplateIds } from '@/utils/templateIdsGenerator';
import defaultTemplates from '@/templates/defaultTemplates.json'

var defaultTemplatesWithIds = generateTemplatesIds(defaultTemplates);

export const Templates = {
  namespaced: true,

  state: () => ({
    templates: defaultTemplatesWithIds,
    currentSelectedTemplate: defaultTemplatesWithIds[0]
  }),
  mutations: {
    setCurrentTemplate(state, template) {
      eventBus.$emit('before-template-changed');
      Vue.set(state, 'currentSelectedTemplate', template);
      eventBus.$emit('template-changed');
    },
    addTemplate(state, template) {
      var templateWithIds = generateTemplateIds(template);
      state.templates.push(templateWithIds);
    },
    deleteTemplate(state, template) {
      const index = state.templates.indexOf(template);
      state.templates.splice(index, 1);
    }

  },
  actions: {

  },

  getters: {
    
  },
};

export default Templates;
