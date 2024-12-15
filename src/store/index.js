import Vue from "vue";
import Vuex from "vuex";
import { Templates } from "@/store/modules/templates";
import { TemplatesDataStore } from "@/store/modules/templatesDataStore"
import { User } from "@/store/modules/user"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Templates,
    TemplatesDataStore,
    User
  },
});
