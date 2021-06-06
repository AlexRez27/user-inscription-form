import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    async getData ({ commit }, { entity, name = '' }) {
      await axios.get('https://www.universal-tutorial.com/api/getaccesstoken', {
        headers: {
          'api-token': 'FoRdt1JptX9fFscAwoQESzRdc5fzIpmVPldJ2BTkm96JLcN_EyNqYzBkdlMUNVKbr8U',
          'user-email': 'rezident027@gmail.com'
        }
      }).then((response) => {
        return axios.get(`https://www.universal-tutorial.com/api/${entity}/${name}`, {
          headers: {
            Authorization: `Bearer ${response.data.auth_token}`,
            Accept: 'application/json'
          }
        })
      })
        .then(
          (response) => {
            commit('showData', response.data)
          },
          (error) => { console.log(error) }
        )
    }
  },
  state: {
    data: []
  },
  mutations: {
    showData (state, data) {
      state.data = data
    }
  },
  getters: {
    dataList (state) {
      return state.data
    }
  }
})
