import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight, MapPin, Calendar, Clock, ArrowLeft, CalendarDays, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

// Mock data for events with more details
const mockEvents = [
  {
    id: '1',
    title: 'African Tech Summit',
    date: 'Oct 15, 2023',
    time: '9:00 AM - 5:00 PM',
    location: 'Nairobi, Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1505373879543-15cdf5d1d1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    description: 'Join us for the largest gathering of tech innovators, entrepreneurs, and investors in Africa. This summit will feature keynote speeches, panel discussions, and networking opportunities.',
    organizer: 'Africa Tech Network',
    price: 'Free - $250',
    capacity: '1000 attendees',
    website: 'https://example.com/africatechsummit'
  },
  {
    id: '2',
    title: 'Afrobeat Music Festival',
    date: 'Nov 5, 2023',
    time: '6:00 PM - 11:00 PM',
    location: 'Lagos, Nigeria',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Music',
    description: 'Experience the best of Afrobeat music with performances from top artists across Africa. Food, drinks, and good vibes guaranteed!',
    organizer: 'Afrobeat Promotions',
    price: '$30 - $100',
    capacity: '5000 attendees',
    website: 'https://example.com/afrobeatfest'
  },
  {
    id: '3',
    title: 'African Art Exhibition',
    date: 'Nov 20, 2023',
    time: '10:00 AM - 6:00 PM',
    location: 'Cape Town, South Africa',
    imageUrl: 'https://images.unsplash.com/photo-1531913764164-f85c52d6e654?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Art',
    description: 'A showcase of contemporary African art featuring works from emerging and established artists across the continent.',
    organizer: 'African Art Collective',
    price: 'Free',
    capacity: '200 attendees per hour',
    website: 'https://example.com/africanart'
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    date: 'Dec 1, 2023',
    time: '1:00 PM - 5:00 PM',
    location: 'Accra, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Business',
    description: 'Witness the most innovative startups in Africa pitch their ideas to a panel of investors. Great networking opportunity!',
    organizer: 'Startup Africa',
    price: 'Free to attend',
    capacity: '300 seats',
    website: 'https://example.com/startuppitch'
  },
  {
    id: '5',
    title: 'African Food Festival',
    date: 'Dec 10, 2023',
    time: '11:00 AM - 8:00 PM',
    location: 'Dakar, Senegal',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Food',
    description: 'A culinary journey through the diverse flavors of Africa. Taste dishes from different regions and learn about African cuisine.',
    organizer: 'Taste of Africa',
    price: '$15 - $45',
    capacity: '2000 attendees',
    website: 'https://example.com/africanfoodfest'
  },
  {
    id: '6',
    title: 'Fashion Week Africa',
    date: 'Jan 15, 2024',
    time: '7:00 PM - 11:00 PM',
    location: 'Johannesburg, South Africa',
    imageUrl: 'https://images.unsplash.com/photo-1539109136884-43d0e9d63eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
    description: 'The premier fashion event showcasing the best of African design talent. Featuring runway shows, pop-up shops, and after-parties.',
    organizer: 'African Fashion Council',
    price: '$50 - $200',
    capacity: '800 attendees',
    website: 'https://example.com/africanfashionweek'
  }
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'technology', name: 'Technology' },
  { id: 'music', name: 'Music' },
  { id: 'art', name: 'Art' },
  { id: 'business', name: 'Business' },
  { id: 'food', name: 'Food' },
  { id: 'fashion', name: 'Fashion' },
];

// Event Detail Component
const EventDetail = ({ event, onBack }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <button 
      onClick={onBack}
      className="flex items-center text-brand-blue hover:text-brand-blue/80 mb-6 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back to Events
    </button>
    
    <div className="md:flex">
      <div className="md:flex-shrink-0">
        <img 
          className="h-64 w-full object-cover md:w-96" 
          src={event.imageUrl} 
          alt={event.title} 
        />
      </div>
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-brand-blue font-semibold">{event.category}</div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.title}</h1>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-600">{event.date} • {event.time}</p>
              <p className="text-sm text-gray-500">Add to calendar</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-600">{event.location}</p>
              <p className="text-sm text-gray-500">Get directions</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Organizer</p>
                <p className="text-gray-700">{event.organizer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-gray-700">{event.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="text-gray-700">{event.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a href={event.website} className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer">
                  Visit website
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button className="w-full bg-brand-blue hover:bg-brand-blue-hover">
              Get Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Events Page Component
const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const eventsPerPage = 6;

  // State for date range and sorting
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [sortBy, setSortBy] = useState('date-asc');

  // Filter events based on search, category, and date range
  const filteredEvents = React.useMemo(() => {
    return mockEvents
      .filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
                             event.category.toLowerCase() === selectedCategory.toLowerCase();
        
        // Convert event date to Date object for comparison
        const eventDate = new Date(event.date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        
        const matchesDateRange = (!fromDate || eventDate >= fromDate) && 
                              (!toDate || eventDate <= new Date(toDate.getTime() + 24 * 60 * 60 * 1000)); // Add 1 day to include the end date
        
        return matchesSearch && matchesCategory && matchesDateRange;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        switch(sortBy) {
          case 'date-asc':
            return dateA.getTime() - dateB.getTime();
          case 'date-desc':
            return dateB.getTime() - dateA.getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          default:
            return dateA.getTime() - dateB.getTime();
        }
      });
  }, [searchQuery, selectedCategory, dateRange, sortBy]);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle view event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    // Update URL without page reload
    navigate(`/events/${event.id}`, { replace: true });
  };

  // Handle back to events list
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    navigate('/events', { replace: true });
  };

  // Check if we're viewing a single event (for direct URL access)
  React.useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length === 3 && pathParts[1] === 'events' && pathParts[2] !== '') {
      const eventId = pathParts[2];
      const event = mockEvents.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, []);

  // If viewing a single event, show the event detail view
  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <EventDetail event={selectedEvent} onBack={handleBackToEvents} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Discover Amazing Events</h1>
            <p className="text-lg mb-8">Find and attend events that matter to you across Africa</p>
            
            {/* Simple Horizontal Filter Bar */}
            <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search events..."
                      className="pl-9 pr-3 py-2 h-10 w-full text-sm rounded-md border-0 bg-white/10 text-white placeholder-gray-300"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="min-w-[160px]">
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-10 text-sm rounded-md border-0 bg-white/10 text-white">
                      <Filter className="h-3.5 w-3.5 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-sm">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Input
                      type="date"
                      className="pl-3 pr-2 py-2 h-10 text-sm rounded-md border-0 bg-white/10 text-white w-[140px]"
                      value={dateRange.from}
                      onChange={(e) => {
                        setDateRange(prev => ({ ...prev, from: e.target.value }));
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <span className="text-white/50 text-sm">to</span>
                  <div className="relative">
                    <Input
                      type="date"
                      className="pl-3 pr-2 py-2 h-10 text-sm rounded-md border-0 bg-white/10 text-white w-[140px]"
                      value={dateRange.to}
                      min={dateRange.from}
                      onChange={(e) => {
                        setDateRange(prev => ({ ...prev, to: e.target.value }));
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="min-w-[160px]">
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-10 text-sm rounded-md border-0 bg-white/10 text-white">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-asc" className="text-sm">Date (Earliest First)</SelectItem>
                      <SelectItem value="date-desc" className="text-sm">Date (Latest First)</SelectItem>
                      <SelectItem value="title-asc" className="text-sm">Name (A-Z)</SelectItem>
                      <SelectItem value="title-desc" className="text-sm">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Upcoming Events
          </h1>
          {/* Events Grid */}
          {currentEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <div key={event.id} onClick={() => handleViewEvent(event)} className="cursor-pointer">
                    <EventCard
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      imageUrl={event.imageUrl}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full h-10 w-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => paginate(pageNum)}
                        className={`rounded-full h-10 w-10 ${
                          currentPage === pageNum ? 'bg-brand-blue hover:bg-brand-blue-hover text-white' : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full h-10 w-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;
