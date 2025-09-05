import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, Users, BookOpen, Heart, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCoverLetters } from '@/hooks/useCoverLetters';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useAuth } from '@/hooks/useAuth';
import { useContacts } from '@/hooks/useContacts';
import { useSkills } from '@/hooks/useSkills';
import ChatBot from '@/components/ChatBot/ChatBot';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coverLetters } = useCoverLetters();
  const { jobApplications } = useJobApplications();
  const { contacts } = useContacts();
  const { skills } = useSkills();
  
  const stats = [
    { title: 'Cover Letters', value: coverLetters?.length.toString() || '0', icon: FileText, color: 'text-blue-600' },
    { title: 'Applications', value: jobApplications?.length.toString() || '0', icon: Briefcase, color: 'text-green-600' },
    { title: 'Contacts', value: contacts?.length.toString() || '0', icon: Users, color: 'text-purple-600' },
    { title: 'Skills Tracked', value: skills?.length.toString() || '0', icon: BookOpen, color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Create Cover Letter', description: 'Generate a personalized cover letter', icon: FileText, href: '/dashboard/cover-letters' },
    { title: 'Track Application', description: 'Add a new job application', icon: Briefcase, href: '/dashboard/applications' },
    { title: 'Add Contact', description: 'Expand your professional network', icon: Users, href: '/dashboard/networking' },
    { title: 'Daily Motivation', description: 'Get inspired for your job search', icon: Heart, href: '/dashboard/motivation' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0] || 'User'}!</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(action.href)}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); navigate(action.href); }}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobApplications && jobApplications.length > 0 ? (
              jobApplications.slice(0, 3).map((application, index) => (
                <div key={application.id} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                  <span className="text-muted-foreground">Applied to {application.position_title} at {application.company_name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No recent activity. Start by creating a cover letter or tracking a job application!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ChatBot />
    </div>
  );
};

export default DashboardHome;