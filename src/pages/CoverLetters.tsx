import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCoverLetters } from '@/hooks/useCoverLetters';
import { useProfile } from '@/hooks/useProfile';
import { FileText, Download, Trash2, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CoverLettersPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const { coverLetters, loading, fetchCoverLetters, generateCoverLetter, deleteCoverLetter } = useCoverLetters();
  const { profile } = useProfile();

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('companyName') as string;
    const positionTitle = formData.get('positionTitle') as string;
    const jobDescription = formData.get('jobDescription') as string;
    const tone = formData.get('tone') as string;
    const prompt = formData.get('prompt') as string;

    const { data, error } = await generateCoverLetter({
      companyName,
      positionTitle,
      jobDescription,
      tone,
      prompt,
      userProfile: profile
    });

    if (error) {
      toast({
        title: "Error generating cover letter",
        description: "Please try again later.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter has been created.",
      });
      setShowDialog(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }
    setIsGenerating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteCoverLetter(id);
    if (error) {
      toast({
        title: "Error deleting cover letter",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cover letter deleted",
        description: "The cover letter has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cover Letters</h1>
          <p className="text-muted-foreground">Generate and manage your personalized cover letters</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Cover Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Cover Letter</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., Google"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionTitle">Position Title</Label>
                  <Input
                    id="positionTitle"
                    name="positionTitle"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the job description here..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Additional Instructions (Optional)</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Any specific points you'd like to highlight..."
                />
              </div>

              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Cover Letter'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : coverLetters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cover letters yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first AI-generated cover letter to get started.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cover Letter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {coverLetters.map((letter) => (
            <Card key={letter.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{letter.title}</CardTitle>
                    <CardDescription>
                      {letter.position_title} at {letter.company_name} • {letter.tone} tone
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(letter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{letter.content}</p>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Created {new Date(letter.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverLettersPage;