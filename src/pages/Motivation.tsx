import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw, Quote, Target, Lightbulb, Star } from 'lucide-react';

const Motivation = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const motivationalQuotes = [
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Your limitation—it's only your imagination.",
      author: "Unknown"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "The harder you work for something, the greater you'll feel when you achieve it.",
      author: "Unknown"
    }
  ];

  const jobSearchTips = [
    {
      title: "Network Actively",
      description: "Reach out to professionals in your field. Most job opportunities come through networking.",
      icon: Target
    },
    {
      title: "Customize Your Applications",
      description: "Tailor your resume and cover letter for each position you apply for.",
      icon: Lightbulb
    },
    {
      title: "Practice Interview Skills",
      description: "Regular practice will boost your confidence and improve your performance.",
      icon: Star
    },
    {
      title: "Stay Consistent",
      description: "Set daily goals for job applications and stick to your routine.",
      icon: RefreshCw
    }
  ];

  const affirmations = [
    "I am qualified and deserving of great opportunities",
    "Every rejection brings me closer to the right job",
    "I have valuable skills that employers need",
    "I am resilient and can overcome any challenge",
    "My dream job is out there waiting for me",
    "I grow stronger with each application I send"
  ];

  const getNewQuote = () => {
    const newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(newIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Motivation</h1>
          <p className="text-muted-foreground">Stay inspired and focused on your career goals</p>
        </div>
        <Heart className="h-8 w-8 text-red-500" />
      </div>

      {/* Daily Quote */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Quote className="h-5 w-5 mr-2" />
            Quote of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-lg italic text-foreground mb-4">
            "{motivationalQuotes[currentQuote].text}"
          </blockquote>
          <p className="text-muted-foreground mb-4">— {motivationalQuotes[currentQuote].author}</p>
          <Button onClick={getNewQuote} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </CardContent>
      </Card>

      {/* Job Search Tips */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Job Search Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobSearchTips.map((tip, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <tip.icon className="h-5 w-5 mr-2 text-primary" />
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Affirmations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Daily Affirmations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affirmations.map((affirmation, index) => (
              <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <p className="text-sm">{affirmation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            This Week's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Application Goal</h3>
              <p className="text-muted-foreground">Apply to at least 5 positions that match your skills and interests.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Networking Goal</h3>
              <p className="text-muted-foreground">Reach out to 3 new professional contacts on LinkedIn.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Learning Goal</h3>
              <p className="text-muted-foreground">Spend 2 hours learning a new skill relevant to your target role.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Motivation;