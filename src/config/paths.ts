export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  login: {
    path: '/auth/login',
    getHref: () => '/auth/login',
  },
  register: {
    path: '/auth/register',
    getHref: () => '/auth/register',
  },
} as const
