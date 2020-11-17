import Vue from 'vue';
import { deleteApi, get, patch, post } from '@/utils/api';

export default {
  state: () => ({
    tags: null,
    tagCloud: null,
    itemsByTag: null,
    blog: null,
    itemPictures: [],
    content: null,
  }),
  getters: {
    TAGS: state => state.tags,
    TAG_CLOUD: state => state.tagCloud,
    ITEMS_BY_TAG: state => state.itemsByTag,
    BLOG: state => state.blog,
    ITEM_PICTURES: state => state.itemPictures,
    CONTENT: state => state.content,
  },
  mutations: {
    SET_TAGS: (state, payload) => {
      state.tags = payload;
    },
    SET_TAG_CLOUD: (state, payload) => {
      state.tagCloud = payload;
    },
    SET_ITEMS_BY_TAG: (state, payload) => {
      state.itemsByTag = payload;
    },
    SET_BLOG: (state, payload) => {
      state.blog = payload;
    },
    SET_ITEM_PICTURES: (state, payload) => {
      state.itemPictures = payload;
    },
    SET_CONTENT: (state, payload) => {
      state.content = payload;
    },
  },
  actions: {
    SHARE_LINK: async (context, payload) => {
      const body = {
        path: payload.path,
        service: payload.service,
        userId: context.getters.USER_ID,
      };
      return post('API', `/items/${payload.itemId}/share`, body);
    },
    FETCH_TAGS: async (context) => {
      Vue.$log.debug('FETCH_TAGS');
      const response = await get('API', '/misc/tags/', context);
      context.commit('SET_TAGS', response.data.data);
      return response.data.data;
    },
    FETCH_TAG_CLOUD: async (context) => {
      Vue.$log.debug('FETCH_TAG_CLOUD');
      const response = await get('API', '/misc/tags/cloud', context);
      context.commit('SET_TAG_CLOUD', response.data.data);
      return response.data.data;
    },
    FETCH_ITEMS_BY_TAG: async (context, payload) => {
      Vue.$log.debug('FETCH_ITEMS_BY_TAG');
      const response = await get('BFF', `/items/${payload}`, context);
      context.commit('SET_ITEMS_BY_TAG', response.data.data);
      return response.data.data;
    },
    FETCH_ITEM_PICTURES: async (context) => {
      Vue.$log.debug('FETCH_ITEM_PICTURES');
      const response = await get('API', '/items/pictures', context);
      context.commit('SET_ITEM_PICTURES', response.data.data);
      return response.data.data;
    },
    CREATE_BLOG: async (context, payload) => {
      Vue.$log.debug('CREATE_BLOG');
      const blog = await post('API', '/blog', payload, context);
      return blog.data.data;
    },
    UPDATE_BLOG: async (context, payload) => {
      Vue.$log.debug('UPDATE_BLOG');
      const { blogId } = payload;
      const blogData = await patch('API', `/blog/${blogId}/`, payload, context);
      const item = blogData.data.data;
      context.commit('SET_BLOG', item);
      return item;
    },
    FETCH_BLOG: async (context, payload) => {
      Vue.$log.debug('FETCH_BLOG');
      const blog = await get('API', `/blog/${payload.slug}`, context);
      context.commit('SET_BLOG', blog.data.data);
      return blog.data.data;
    },
    FETCH_CONTENT: async (context, payload) => {
      Vue.$log.debug(`FETCH_CONTENT ${payload.slug}`);
      if (context.state.content != null && payload.slug === context.state.content.info.slug) {
        return; // cached value recycled
      }
      context.commit('SET_CONTENT', null);
      const cmsData = await get('API', `/content/${payload.slug}`, context);
      const cms = cmsData.data.data;
      context.commit('SET_CONTENT', cms);
    },
    FETCH_CONTENTS: async (context) => {
      Vue.$log.debug('FETCH_CONTENTS');
      const response = await get('API', '/content', context);
      return response.data.data;
    },
    CREATE_CONTENT: async (context, payload) => {
      Vue.$log.debug('CREATE_CONTENT');
      const cmsData = await post('API', '/content', payload, context);
      return cmsData.data.data;
    },
    UPDATE_CONTENT: async (context, payload) => {
      Vue.$log.debug('UPDATE_CONTENT');
      const { cmsId } = payload;
      const cmsData = await patch('API', `/content/${cmsId}/`, payload, context);
      const item = cmsData.data.data;
      context.commit('SET_CONTENT', item);
      return item;
    },
    DELETE_CONTENT: async (context, payload) => {
      Vue.$log.debug('DELETE_CONTENT');
      const { cmsId } = payload;
      return deleteApi('API', `/content/${cmsId}/`, {}, context);
    },
    UPLOAD_IMAGE: async (context, payload) => {
      Vue.$log.debug('IMAGE_UPLOAD');
      const response = await post('API', '/uploadImage', payload, context);
      return response.data;
    },
    GET_ITEM_STREAM: async (context, payload) => {
      Vue.$log.debug(`GET_ITEM_STREAM ${JSON.stringify(payload)}`);
      const { start, size, tag } = payload;
      let url = `/item-stream?start=${start}&ps=${size}`;
      if (tag) {
        url = `${url}&tag=${tag}`;
      }
      const response = await get('API', url, context);
      return response.data.data;
    },
  },
};