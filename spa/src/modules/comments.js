import { get, post } from '@/utils/api';

const { REPLY_LIMIT } = process.env;

export default {
  state: () => ({
    discussion: {
      incomplete: true,
      comments: [],
    },
    comments: {},
    // replies: null; https://forum.vuejs.org/t/vuex-best-practices-for-complex-objects/10143/51
    // users: null, https://github.com/paularmstrong/normalizr
  }),

  getters: {
    DISCUSSION: state => state.discussion,
    GET_COMMENT: state => id => state.comments[id],
  },

  mutations: {
    DESTROY_COMMENTS: (state) => {
      console.log('Destroying comments');
      state.comments = {};
      state.discussion.incomplete = true;
      state.discussion.comments = [];
    },
    APPEND_COMMENTS: (state, payload) => {
      const { comments, incomplete, userId } = payload;
      state.discussion.incomplete = incomplete;
      const commentIds = [];
      comments.forEach(comment => processComment(state, comment, commentIds, userId));
      state.discussion.comments = state.discussion.comments.concat(commentIds);
    },
    PREPEND_COMMENTS: (state, payload) => {
      const { comments, userId } = payload;
      const commentIds = [];
      comments.forEach(comment => processComment(state, comment, commentIds, userId));
      state.discussion.comments = commentIds.concat(state.discussion.comments);
    },
    SET_COMMENT_REPLIES: (state, payload) => {
      const { commentId, replies, replace } = payload;
      const comment = state.discussion.comments.find(x => x._id === commentId);
      if (comment) {
        if (!comment.replies || comment.replies.length === 0 || replace) {
          console.log('setting replies');
          comment.replies = replies;
        } else {
          console.log('appending replies');
          comment.replies = comment.replies.concat(replies);
        }
        comment.size = comment.replies.length;
        comment.showAll = true;
      } else {
        console.log(`Comment ${commentId} not found`);
      }
    },
    SET_VOTE: (state, payload) => {
      const { commentId, vote, userId, nickname } = payload;
      const comment = state.comments[commentId];
      if (!comment.votes) {
        comment.votes = [];
      }
      comment.votes.push({ vote, user: { nickname, id: userId } });

      if (vote === 1) {
        comment.up += 1;
      } else {
        comment.down += 1;
      }
    },
  },

  actions: {
    // pokryt stavy: nacteni nove diskuse, dalsi stranka, nacist nove komentare
    FETCH_COMMENTS: async (context, payload) => {
      console.log(`FETCH_COMMENTS ${payload}`);
      let url = `/items/${payload.itemId}/comments`;
      if (payload.lastSeen) {
        url += `?lr=id:${payload.lastSeen}`;
      }
      const response = await get('BFF', url, context);
      console.log(response.data); // todo remove
      const body = {
        comments: response.data.data.comments,
        incomplete: response.data.data.incomplete,
        userId: context.rootState.userId,
      };
      context.commit('APPEND_COMMENTS', body);
    },
    FETCH_REPLIES: async (context, payload) => {
      console.log(`FETCH_REPLIES ${payload}`);
      let url = `/items/${payload.itemId}/comments/${payload.commentId}/replies`;
      if (payload.lastSeen) {
        url += `?lr=id:${payload.lastSeen}`;
      }
      const response = await get('BFF', url, context);
      console.log(response.data); // todo remove
      if (response.data.success) {
        const body = { commentId: payload.commentId, replies: response.data.data.replies };
        context.commit('SET_COMMENT_REPLIES', body);
      }
    },
    ADD_COMMENT: async (context, payload) => {
      console.log('ADD_COMMENT', payload);
      const body = { text: payload.text, parentId: payload.parent };
      const response = await post('API', `/items/${payload.itemId}/comments`, body, context);
      console.log(response.data); // todo remove
      if (response.data.success) {
        const mutation = {
          comments: [response.data.data.comment],
        };
        context.commit('PREPEND_COMMENTS', mutation);

        // if (payload.parent) {
        //   mutation = {
        //     commentId: payload.parent,
        //     replies: response.data.data.replies,
        //     replace: true,
        //   };
        //   context.commit('SET_COMMENT_REPLIES', mutation);
        // }
      }
    },
    COMMENT_VOTE: async (context, payload) => {
      console.log('COMMENT_VOTE', payload);
      const body = { itemId: payload.itemId, vote: payload.vote };
      await post('API', `/comments/${payload.commentId}/votes`, body, context);
      const mutation = {
        commentId: payload.commentId,
        vote: payload.vote,
        userId: context.rootState.userId,
        nickname: context.rootState.userNickname,
      };
      context.commit('SET_VOTE', mutation);
    },
  },
};

function processComment(state, comment, commentIds, userId) {
  if (comment.replies) {
    const repliesIds = [];
    comment.replies.forEach((reply) => {
      reply.voted = hasVoted(reply.votes, userId);
      state.comments[reply._id] = reply;
      repliesIds.push(reply._id);
    });
    comment.replies = repliesIds;
    comment.allShown = comment.replies.length < REPLY_LIMIT;
  } else if (!comment.parentId) {
    comment.replies = [];
    comment.allShown = false;
  }
  comment.voted = hasVoted(comment.votes, userId);
  state.comments[comment._id] = comment;
  commentIds.push(comment._id);
}

function hasVoted(votes, userId) {
  if (!userId || !votes || votes.length === 0) {
    return false;
  }
  return votes.some(vote => vote.user.id === userId);
}

/*
  discussion: {
    incomplete: true,
    comments: ['abcd'],
  },
  comments: {
    abcd: {
      _id: 'abcd',
      text: 'Hello world',
      author: {},
      up: 1,
      down: 0,
      votes: [{vote: 1, user: {nickname: "jirka", id: "1e416vocls"}}],
      voted: true,
      allShown: true,
      replies: ['xyz'],
    },
    xyz: {
      _id: 'xyz',
      parentId: 'abcd',
      text: 'dlrow elloH',
      author: {},
      up: 0,
      down: 0,
      votes: [],
      voted: false,
    },
  },
*/
