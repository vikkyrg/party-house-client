import { createBrowserRouter, RouterProvider, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { VerifyOtpPage } from '../pages/VerifyOtpPage';
import { CitiesPage } from '../pages/CitiesPage';
import { TheaterListingPage } from '../pages/TheaterListingPage';
import { TheaterDetailsPage } from '../pages/TheaterDetailsPage';
import { BookingPage } from '../pages/BookingPage';
import { BookingSuccessPage, BookingFailurePage } from '../pages/BookingStatusPages';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { FaqPage, TermsPage, PrivacyPage } from '../pages/LegalPages';
import { ContactPage } from '../pages/ContactPage';
import { ForgotPasswordPage, ResetPasswordPage } from '../pages/PasswordRecoveryPages';
import { AccountProfilePage } from '../pages/AccountProfilePage';
import { BookingDetailsPage } from '../pages/BookingDetailsPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { OffersPage } from '../pages/OffersPage';
import { InvoicePage } from '../pages/InvoicePage';
import { ReviewPage } from '../pages/ReviewPage';
import { HelpPage } from '../pages/HelpPage';
import { SitemapPage } from '../pages/SitemapPage';

// New Pages
import { ServicesPage } from '../pages/ServicesPage';
import { GalleryPage } from '../pages/GalleryPage';
import { BlogsPage } from '../pages/BlogsPage';
import { StoryDetailPage } from '../pages/StoryDetailPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { AboutPage } from '../pages/AboutPage';
import { FoundersPage } from '../pages/FoundersPage';
import { ListYourVenuePage } from '../pages/ListYourVenuePage';

function RouteErrorElement() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText || error.data?.message || 'We hit an unexpected issue.'
    : error instanceof Error
      ? error.message
      : 'We hit an unexpected issue.';

  return (
    <div className="min-h-screen bg-background px-4 py-24 text-center">
      <div className="mx-auto max-w-lg rounded-[28px] border border-error/20 bg-error/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <p className="eyebrow mb-4">Unexpected issue</p>
        <h1 className="text-3xl font-black text-white">Something went wrong</h1>
        <p className="mt-4 text-text-muted">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-black transition hover:bg-primary-hover"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'cities',
        element: <CitiesPage />,
      },
      {
        path: 'theaters',
        element: <TheaterListingPage />,
      },
      {
        path: 'theaters/:theaterId',
        element: <TheaterDetailsPage />,
      },
      {
        path: 'book/:theaterId',
        element: <BookingPage />,
      },
      {
        path: 'booking/success/:bookingId',
        element: <BookingSuccessPage />,
      },
      {
        path: 'booking/failure',
        element: <BookingFailurePage />,
      },
      {
        path: 'account',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'bookings',
            element: <MyBookingsPage />,
          },
          {
            path: 'bookings/:bookingId',
            element: <BookingDetailsPage />,
          },
          {
            path: 'bookings/:bookingId/invoice',
            element: <InvoicePage />,
          },
          {
            path: 'bookings/:bookingId/review',
            element: <ReviewPage />,
          },
          {
            path: 'profile',
            element: <AccountProfilePage />,
          },
        ]
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:eventSlug',
        element: <EventDetailsPage />,
      },
      {
        path: 'offers',
        element: <OffersPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'faq',
        element: <FaqPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },
      {
        path: 'sitemap',
        element: <SitemapPage />,
      },
      
      // Dynamic content pages
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'blogs',
        element: <BlogsPage />,
      },
      {
        path: 'blogs/:id',
        element: <StoryDetailPage />,
      },

      // Dropdown pages
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'founders',
        element: <FoundersPage />,
      },
      {
        path: 'franchise',
        element: <PlaceholderPage title="Franchise" />,
      },
      {
        path: 'list-venue',
        element: <ListYourVenuePage />,
      },
      {
        path: 'refund-policy',
        element: <PlaceholderPage title="Refund Policy" />,
      },
      {
        path: 'waitlist',
        element: <PlaceholderPage title="Join Waitlist" />,
      },
      
      {
        path: '*',
        element: <NotFoundPage />,
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtpPage />,
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
