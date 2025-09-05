import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Plus, Calendar as CalendarIcon, ExternalLink, Trash2, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface JobApplication {
  id: string;
  company_name: string;
  position_title: string;
  job_url: string | null;
  application_date: string | null;
  status: string;
  salary_range: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
}

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-500' },
    { value: 'interview', label: 'Interview', color: 'bg-yellow-500' },
    { value: 'offer', label: 'Offer', color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-500' }
  ];

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const applicationData = {
      user_id: user?.id,
      company_name: formData.get('companyName') as string,
      position_title: formData.get('positionTitle') as string,
      job_url: formData.get('jobUrl') as string || null,
      application_date: selectedDate?.toISOString().split('T')[0] || null,
      status: formData.get('status') as string,
      salary_range: formData.get('salaryRange') as string || null,
      location: formData.get('location') as string || null,
      notes: formData.get('notes') as string || null,
    };

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Application added!",
        description: "Your job application has been tracked.",
      });
      
      setShowDialog(false);
      setSelectedDate(undefined);
      (e.target as HTMLFormElement).reset();
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error adding application",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Application deleted",
        description: "The application has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting application",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Job Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., Google"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionTitle">Position Title *</Label>
                  <Input
                    id="positionTitle"
                    name="positionTitle"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  name="jobUrl"
                  type="url"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select name="status" defaultValue="applied">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Input
                    id="salaryRange"
                    name="salaryRange"
                    placeholder="e.g., $80k - $120k"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Remote, San Francisco"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about this application..."
                />
              </div>

              <Button type="submit" className="w-full">
                Add Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading applications...</div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your job applications to stay organized.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{application.position_title}</CardTitle>
                    <CardDescription>{application.company_name}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {statusOptions.find(opt => opt.value === application.status)?.label}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteApplication(application.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {application.application_date && (
                    <div>
                      <span className="font-medium text-muted-foreground">Applied:</span>
                      <p>{format(new Date(application.application_date), 'MMM d, yyyy')}</p>
                    </div>
                  )}
                  {application.salary_range && (
                    <div>
                      <span className="font-medium text-muted-foreground">Salary:</span>
                      <p>{application.salary_range}</p>
                    </div>
                  )}
                  {application.location && (
                    <div>
                      <span className="font-medium text-muted-foreground">Location:</span>
                      <p>{application.location}</p>
                    </div>
                  )}
                  {application.job_url && (
                    <div>
                      <span className="font-medium text-muted-foreground">Job URL:</span>
                      <a 
                        href={application.job_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        View Job <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
                {application.notes && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1">{application.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;