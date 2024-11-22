import Vue from 'vue';
import { eventBus } from '@/main';
import defaultTemplates from '@/templates/defaultTemplates.json'

export const Templates = {
  namespaced: true,

  state: () => ({
    templates: defaultTemplates,
    currentSelectedTemplate: defaultTemplates[0]
  }),
  mutations: {
    setCurrentTemplate(state, template) {
      eventBus.$emit('before-template-changed');
      Vue.set(state, 'currentSelectedTemplate', template);
      eventBus.$emit('template-changed');
    },
    addTemplate(state, template) {
      state.templates.push(template);
    },
    deleteTemplate(state, template) {
      console.log('eleteTemplate');
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
