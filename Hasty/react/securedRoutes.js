import { lazy } from 'react';
import AddTemplate from '../components/newsletters/AddTemplate';
const ActiveDutyDashboard = lazy(() => import('../pages/dashboard/activeduty/ActiveDutyDashboard'));
const Apps = lazy(() => import('../pages/dashboard/apps/AppsDashboard'));
const Chat = lazy(() => import('../components/messages/chat/Chat'));
const CivilianDashboard = lazy(() => import('../pages/dashboard/civilian/CivilianDashboard'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Locations = lazy(() => import('../components/locations/Locations'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const GoogleAnalytics = lazy(() => import('../pages/googleanalytics/GoogleAnalytics'));
const LandlordDashboard = lazy(() => import('../pages/dashboard/landlord/LandlordDashboard'));
const Comments = lazy(() => import('../components/comments/Comments'));
const MilitaryProfiles = lazy(() => import('../components/military/MilitaryProfiles'));
const FileManager = lazy(() => import('../components/files/FileManager'));
const NewsletterSub = lazy(() => import('../components/newslettersubscription/NewsletterSubDash'));
const NewsletterTemplate = lazy(() => import('../components/newslettersubscription/NewsletterTemplate'));
const UserProfile = lazy(() => import('../pages/user/UserProfile'));
const ListingsMap = lazy(() => import('../components/listings/ListingsMap'));
const ListingWizard = lazy(() => import('../components/listings/ListingWizard'));
const VeteranDashboard = lazy(() => import('../pages/dashboard/veteran/VeteranDashboard'));
const VideoChat = lazy(() => import('../components/messages/videochat/VideoChat'));
const NewsletterTemplates = lazy(() => import('../components/newsletters/NewsletterTemplates'));
const Invoice = lazy(() => import('../components/payment/Invoice'));
const CheckoutButton = lazy(() => import('../components/payment/CheckoutButton'));
const PaymentSuccess = lazy(() => import('../components/payment/PaymentSuccess'));

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    icon: 'uil-home-alt',
    header: 'Navigation',
    children: [
      {
        path: '/dashboard/analytics',
        name: 'Analytics',
        element: GoogleAnalytics,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/activeduty',
        name: 'ActiveDutyDashboard',
        element: ActiveDutyDashboard,
        roles: ['Admin', 'Active Duty'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/civilian',
        name: 'CivilianDashboard',
        element: CivilianDashboard,
        roles: ['Admin', 'Civilian'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/newslettersubscriptions',
        name: 'Newsletter Subscriptions',
        element: NewsletterSub,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/newslettertemplates',
        name: 'Newsletter Templates',
        element: NewsletterTemplate,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/landlord',
        name: 'LandlordDashboard',
        element: LandlordDashboard,
        roles: ['Admin', 'Proprietor'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/dashboard/veteran',
        name: 'VeteranDashboard',
        element: VeteranDashboard,
        roles: ['Admin', 'Veteran'],
        exact: true,
        isAnonymous: false,
      },
    ],
  },
];

const militaryProfilesRoute = [
  {
    path: '/profiles/military/list',
    name: 'Military Profiles',
    element: MilitaryProfiles,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    exact: true,
    isAnonymous: false,
  },
];
const commentsRoutes = [
  {
    path: 'apps/comments',
    name: 'Comments',
    exact: true,
    element: Comments,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    isAnonymous: false,
  },
];
const paymentRoutes = [
  {
    path: '/checkout',
    name: 'Checkout',
    exact: true,
    element: CheckoutButton,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    isAnonymous: false,
  },
  {
    path: '/success',
    name: 'Payment Success',
    exact: true,
    element: PaymentSuccess,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    isAnonymous: false,
  },
  {
    path: '/invoice',
    name: 'Invoice',
    exact: true,
    element: Invoice,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    isAnonymous: false,
  },
];

const appRoutes = [
  {
    path: '/apps',
    name: 'Apps',
    element: Apps,
    icon: 'uil-home-alt',
    header: 'Apps',
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    children: [
      {
        path: '/apps/chat',
        name: 'Chat',
        element: Chat,
        roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/apps/file',
        name: 'File Manager',
        element: FileManager,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/apps/locations',
        name: 'Locations',
        element: Locations,
        roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
        exact: true,
        isAnonymous: false,
      },
      {
        path: '/apps/videochat',
        name: 'Video Chat',
        element: VideoChat,
        roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
        exact: true,
        isAnonymous: false,
      },
    ],
  },
];

const userRoutes = [
  {
    path: '/profile',
    name: 'Profile',
    element: UserProfile,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    exact: true,
    isAnonymous: false,
  },
];

const listingRoutes = [
  {
    path: '/listing/create',
    name: 'Listing Wizard',
    exact: true,
    element: ListingWizard,
    roles: ['Admin'],
    isAnonymous: false,
  },
  {
    path: '/listings/map',
    name: 'Listings Map',
    exact: true,
    element: ListingsMap,
    roles: ['Admin', 'Proprietor', 'Civilian', 'Active Duty', 'Veteran'],
    isAnonymous: false,
  },
];

const newsletterTemplatesRoutes = [
  {
    path: '/newslettertemplates',
    name: 'Newsletter Templates',
    exact: true,
    element: NewsletterTemplates,
    roles: ['Admin'],
    isAnonymous: false,
  },

  {
    path: '/templates/new',
    name: 'Create New Template',
    exact: true,
    element: AddTemplate,
    roles: ['Admin'],
    isAnonymous: false,
  },
  {
    path: '/templates/new/:id',
    name: 'Edit Template',
    exact: true,
    element: AddTemplate,
    roles: ['Admin'],
    isAnonymous: false,
  },
];

const errorRoutes = [
  {
    path: '*',
    name: 'Error - 404',
    element: PageNotFound,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
];

const allRoutes = [
  ...dashboardRoutes,
  ...errorRoutes,
  ...militaryProfilesRoute,
  ...commentsRoutes,
  ...appRoutes,
  ...userRoutes,
  ...listingRoutes,
  ...newsletterTemplatesRoutes,
  ...paymentRoutes,
];

export default allRoutes;
