import { createBrowserRouter, RouterProvider, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/HomePage';
import { TheaterListingPage } from '../pages/TheaterListingPage';
import { TheaterDetailsPage } from '../pages/TheaterDetailsPage';
import { BookingPage } from '../pages/BookingPage';
import { BookingSuccessPage, BookingFailurePage } from '../pages/BookingStatusPages';
import { NotFoundPage } from '../pages/NotFoundPage';
import { FaqPage, TermsPage, PrivacyPage } from '../pages/LegalPages';
import { ContactPage } from '../pages/ContactPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { OffersPage } from '../pages/OffersPage';
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
        path: 'theaters',
        element: <TheaterListingPage />,
      },
      {
        path: 'theaters/:theaterId',
        element: <TheaterDetailsPage />,
      },
      {
        path: 'theaters/:theaterId/rooms/:roomId',
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
        path: 'faqs',
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
        path: 'list-venue',
        element: <ListYourVenuePage />,
      },
      {
        path: 'list-your-venue',
        element: <ListYourVenuePage />,
      },
      {
        path: 'refund-policy',
        element: <PlaceholderPage title="Cancellation & Refund Policy" />,
      },
      
      {
        path: '*',
        element: <NotFoundPage />,
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
