export const User = {
  namespaced: true,

  state: () => ({
    user: null
  }),

  mutations: {
    setUserInfo(state, payload) {
      state.user = payload;
    },
  },

  actions: {
    async getUserInfo ({ commit }) {
      const response = await fetch('/.auth/me');

      const payload = await response.json();

      const { clientPrincipal } = payload;

      commit('setUserInfo', clientPrincipal);
    }
  },

  getters: {
    
  }
};

export default User;
