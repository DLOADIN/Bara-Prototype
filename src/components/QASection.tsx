import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, Lightbulb } from "lucide-react";

const popularTopics = [
  { name: "Dentists", category: "Health & Medical" },
  { name: "Family Law", category: "Legal" },
  { name: "Insurance", category: "Financial" },
  { name: "Auto Repair", category: "Automotive" },
  { name: "Home Improvement", category: "Home & Garden" },
  { name: "Dogs", category: "Pets" },
  { name: "Plumbing", category: "Home & Garden" }
];

export const QASection = () => {
  const { t } = useTranslation();

  const handleTopicClick = (topic: string) => {
    console.log(`Clicked on topic: ${topic}`);
    // Navigation logic would be implemented here
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Q&A Feature */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-yp-blue rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-yp-green rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-yp-yellow rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-yp-dark" />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="font-sf-text text-lg text-yp-dark">
                {t('qa.askQuestions')}
              </p>
              <p className="font-sf-text text-lg text-yp-dark">
                {t('qa.shareKnowledge')}
              </p>
              <p className="font-sf-text text-lg text-yp-dark">
                {t('qa.findAnswers')}
              </p>
            </div>

            <Button className="bg-yp-green hover:bg-yp-green/90 text-white font-sf-text font-semibold text-lg px-8 py-3 h-auto">
              {t('qa.askQuestion')}
            </Button>
          </div>

          {/* Right Side - Popular Topics */}
          <div>
            <h3 className="text-2xl font-sf-pro font-bold text-yp-dark mb-6">
              {t('qa.browsePopular')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularTopics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => handleTopicClick(topic.name)}
                  className="text-left p-4 bg-white border border-yp-gray-medium rounded-lg hover:border-yp-blue hover:bg-yp-gray-light transition-all duration-200 group"
                >
                  <h4 className="font-sf-text font-semibold text-yp-blue group-hover:text-yp-blue/80">
                    {topic.name}
                  </h4>
                  <p className="font-sf-text text-sm text-yp-gray-dark mt-1">
                    {topic.category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};