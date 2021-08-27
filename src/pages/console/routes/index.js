import Dashboard from '../containers/Dashboard'
import NotFound from '../containers/NotFound'
import LogQuery from '../containers/LogQuery'
import EventSearch from '../containers/EventSearch'
import AuditingSearch from '../containers/AuditingSearch'
import Bill from '../containers/Bill'

export default [
  { path: '/404', component: NotFound, exact: true },
  { path: '/dashboard', component: Dashboard, exact: true },
  { path: `/logquery`, exact: true, component: LogQuery },
  { path: '/eventsearch', exact: true, component: EventSearch },
  { path: '/auditingsearch', exact: true, component: AuditingSearch },
  { path: '/bill', exact: true, component: Bill },
  {
    path: '/',
    redirect: { from: '/', to: '/dashboard', exact: true },
  },
  {
    path: '*',
    redirect: { from: '*', to: '/404', exact: true },
  },
]
