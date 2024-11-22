export const TemplatesDataStore = {
  namespaced: true,

  state: () => ({
    // Key, Value
    templatesDataStore: {

    }
  }),
  mutations: {
    setTemplateData(state, payload) {
      state.templatesDataStore[payload.key] = payload.data;
    },
    deleteTemplateData(state, key) {
      state.templatesDataStore[key] = null;
    }
  },
  actions: {
    getTemplateData({ state }, key) {
      var data = state.templatesDataStore[key];
      return data ? data : [];
    }
  },

  getters: {
    
  },
};

export default TemplatesDataStore;
