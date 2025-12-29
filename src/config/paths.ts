export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  login: {
    path: '/login',
    getHref: () => '/login',
  },
  todos: {
    path: '/todos',
    getHref: () => '/todos',
  },
} as const
