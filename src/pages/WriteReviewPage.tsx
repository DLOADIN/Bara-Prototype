import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Store, MessageSquare, FileText } from "lucide-react";

export const WriteReviewPage = () => {
  return (
    <div className="min-h-screen bg-background font-sf-pro">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Illustration placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-80 h-48 bg-gradient-to-br from-yp-yellow/20 to-yp-blue/20 rounded-lg flex items-center justify-center">
                <div className="flex space-x-4">
                  <div className="bg-yp-yellow p-4 rounded-lg">
                    <Store className="w-8 h-8 text-yp-dark" />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <MessageSquare className="w-8 h-8 text-yp-blue" />
                  </div>
                  <div className="bg-yp-yellow p-4 rounded-lg">
                    <FileText className="w-8 h-8 text-yp-dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-yp-dark mb-4 font-sf-pro">
            <span className="text-yp-blue">Review</span> a Business and Help Others!
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-sf-text">
            Other people need your help finding good businesses.
          </p>
          <p className="text-xl text-gray-600 mb-8 font-sf-text">
            Write a review and share your experience.
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 mb-4 font-sf-text">
              Start your search by typing in the business name below.
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by business name..."
                  className="pl-10 h-12 text-base font-sf-text"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Location"
                  defaultValue="Kigali, Rwanda"
                  className="pl-10 h-12 text-base font-sf-text"
                />
              </div>
              <Button className="bg-yp-yellow hover:bg-yp-yellow/90 text-yp-dark px-8 h-12 font-sf-text font-semibold">
                FIND
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Steps Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Store className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-sf-pro">
                Find the Business
              </h3>
              <p className="text-gray-600 font-sf-text">
                Look for businesses by name and location.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-sf-pro">
                Rate and Review
              </h3>
              <p className="text-gray-600 font-sf-text">
                Businesses need your feedback, both good and bad, so they can improve or get props for a job well done.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-yp-blue" />
              </div>
              <h3 className="text-xl font-semibold text-yp-dark mb-3 font-sf-pro">
                Post It
              </h3>
              <p className="text-gray-600 font-sf-text">
                Share your experiences and feel good knowing that you are making a difference in your community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};