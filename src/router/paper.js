import Layout from '@/layout';
import Paper from '@/views/paper/Index';

export default [{
  path: '/paper',
  component: Layout,
  name: 'paper',
  redirect: {
    name: 'paperIndex'
  },
  meta: {
    title: 'BIGO早报',
    icon: 'paper',
    permission: 'paper'
  },
  children: [{
    path: 'index',
    component: Paper,
    name: 'paperIndex',
    meta: {
      title: '早报发送',
      permission: 'paperIndex'
    }
  }]
}];

