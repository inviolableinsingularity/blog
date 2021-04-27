// Combined reducer for auth and blog data for simplicity
// Production code would likely keep them separate for maintainability

export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const LOAD_BLOG = 'loadBlog';
export const LOAD_BLOGS = 'loadBlogs';

const INITIAL_STATE = {
  isAuthenticated: false,
  userId: null,
  userName: '',
  blog: {},
  blogs: [],
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        userId: action.userId,
        userName: action.userName,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        userName: '',
      };

    case LOAD_BLOG:
      return {
        ...state,
        blog: action.blog,
      };

    case LOAD_BLOGS:
      return {
        ...state,
        blogs: action.blogs,
      };

    default:
      return state;
  }
}

export const login = (userId, userName) => {
  return {
    type: LOGIN,
    userId,
    userName,
  }
};

export const logout = () => {
  return {
    type: LOGOUT,
  }
};

export const loadBlog = (blog) => {
  return {
    type: LOAD_BLOG,
    blog,
  }
};

export const loadBlogs = (blogs) => {
  return {
    type: LOAD_BLOGS,
    blogs,
  }
};

