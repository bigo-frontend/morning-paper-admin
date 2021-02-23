const state = {
  routes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  UPDATE_STATE: (state, payload) => {
    // eslint-disable-next-line no-unused-vars
    for (const key of Object.keys(payload)) {
      state[key] = payload[key];
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
