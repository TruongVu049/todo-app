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
  new_todo: {
    path: '/new-todo',
    getHref: () => '/new-todo',
  },
} as const
