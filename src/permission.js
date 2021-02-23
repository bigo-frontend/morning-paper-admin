import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import getPageTitle from '@/utils/get-page-title';
import { constantRoutes } from '@/router';

store.commit('permission/SET_ROUTES', constantRoutes);

NProgress.configure({ showSpinner: false });

router.beforeEach(async(to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  next();
});

router.afterEach(() => {
  NProgress.done();
});
