import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight, MapPin, Calendar, Clock, ArrowLeft, CalendarDays, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { useEvents, useEventCategories } from '@/hooks/useEvents';
import { Event as DatabaseEvent } from '@/lib/eventsService';

export const EventsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedEvent, setSelectedEvent] = useState<DatabaseEvent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  // Use real data from database
  const { events, loading, searchEvents } = useEvents();
  const { categories } = useEventCategories();

  // Load events on component mount
  useEffect(() => {
    searchEvents({ limit: 100 });
  }, [searchEvents]);

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.venue_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.organizer_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const matchesStartDate = !startDate || new Date(event.start_date) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(event.end_date) <= new Date(endDate);
    
    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'location':
        return (a.city_name || '').localeCompare(b.city_name || '');
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleViewEvent = (event: DatabaseEvent) => {
    setSelectedEvent(event);
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  // Handle direct URL access to event details
  useEffect(() => {
    const eventId = window.location.pathname.split('/events/')[1];
    if (eventId && events.length > 0) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [events]);

  // Update URL when viewing event details
  useEffect(() => {
    if (selectedEvent) {
      navigate(`/events/${selectedEvent.id}`, { replace: true });
    } else {
      navigate('/events', { replace: true });
    }
  }, [selectedEvent, navigate]);

  // Event Detail Component
  const EventDetail = ({ event, onBack }: { event: DatabaseEvent; onBack: () => void }) => (
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
            src={event.event_image_url || event.images?.[0] || ''} 
            alt={event.title} 
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-brand-blue font-semibold">{event.category_name || event.category}</div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.title}</h1>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600">{new Date(event.start_date).toLocaleDateString()} • {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p className="text-sm text-gray-500">Add to calendar</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600">{event.venue_name || event.venue_address}</p>
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
                  <p className="text-gray-700">{event.organizer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-gray-700">{event.capacity || 'Unlimited'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href={event.website_url} className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer">
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

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <EventDetail event={selectedEvent} onBack={handleBackToList} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Amazing Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the latest events happening around the world. From concerts and sports to conferences and cultural events.
          </p>
        </div>
      </div>

      {/* Filters Section - Moved beneath hero */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events, venues, or organizers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : currentEvents.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {sortedEvents.length} Events Found
              </h2>
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, sortedEvents.length)} of {sortedEvents.length} events
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <div key={event.id} onClick={() => handleViewEvent(event)} className="cursor-pointer">
                  <EventCard
                    id={event.id}
                    title={event.title}
                    date={new Date(event.start_date).toLocaleDateString()}
                    time={`${new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    location={event.city_name ? `${event.city_name}, ${event.country_name}` : event.venue_address || ''}
                    imageUrl={event.event_image_url || ''}
                    category={event.category_name || event.category}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' || startDate || endDate
                ? 'Try adjusting your search criteria or filters.'
                : 'Check back later for upcoming events.'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || startDate || endDate) && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStartDate('');
                  setEndDate('');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};