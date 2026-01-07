export const paths = {
  dashboard: {
    path: '/',
    getHref: () => '/',
  },
  home: {
    path: '/todos',
    getHref: () => '/todos',
  },
  login: {
    path: '/auth/login',
    getHref: () => '/auth/login',
  },
  register: {
    path: '/auth/register',
    getHref: () => '/auth/register',
  },
  todoChallenge: {
    path: '/todo-challenge',
    getHref: () => '/todo-challenge',
  },
} as const
