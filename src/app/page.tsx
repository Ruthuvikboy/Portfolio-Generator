'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';

import {enhanceBio} from '@/ai/flows/enhance-bio';
import {suggestProjectDescriptions} from '@/ai/flows/suggest-project-descriptions';

const initialFormData = {
  name: '',
  age: '',
  occupation: '',
  contactInformation: '',
  shortBio: '',
  skills: '',
  projectDescriptions: '',
};

export default function Home() {
  const [formData, setFormData] = useState(initialFormData);
  const [previewData, setPreviewData] = useState(initialFormData);
  const [isEnhanceBioOpen, setIsEnhanceBioOpen] = useState(false);
  const [enhancedBio, setEnhancedBio] = useState('');
  const [isSuggestProjectDescriptionsOpen, setIsSuggestProjectDescriptionsOpen] = useState(false);
  const [suggestedProjectDescriptions, setSuggestedProjectDescriptions] = useState<string[]>([]);

  const {toast} = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleProjectDescriptionsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleLivePreview = () => {
    setPreviewData(formData);
    toast({
      title: 'Live Preview Updated',
      description: 'The portfolio preview has been updated with your latest changes.',
    });
  };

  const handleEnhanceBio = async () => {
    setIsEnhanceBioOpen(true);
    try {
      const result = await enhanceBio({
        name: formData.name,
        age: Number(formData.age),
        occupation: formData.occupation,
        contactInformation: formData.contactInformation,
        shortBio: formData.shortBio,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        projectDescriptions: formData.projectDescriptions.split('\n').map(desc => desc.trim()),
      });
      setEnhancedBio(result.enhancedBio);
    } catch (error: any) {
      console.error('Error enhancing bio:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to enhance bio. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSuggestProjectDescriptions = async () => {
    setIsSuggestProjectDescriptionsOpen(true);
    try {
      const descriptions = formData.projectDescriptions.split('\n').map(desc => desc.trim());
      const result = await suggestProjectDescriptions({projectDescriptions: descriptions});
      setSuggestedProjectDescriptions(result.improvedProjectDescriptions);
    } catch (error: any) {
      console.error('Error suggesting project descriptions:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to suggest project descriptions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadHTML = () => {
    // Basic HTML structure
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio - ${previewData.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .profile-section { padding: 20px; border-bottom: 1px solid #eee; }
          .skills-section, .projects-section { padding: 20px; }
          /* Add more styling here */
        </style>
      </head>
      <body>
        <div class="profile-section">
          <h1>${previewData.name}</h1>
          <h2>${previewData.occupation}</h2>
          <p>${previewData.shortBio}</p>
          <p>Contact: ${previewData.contactInformation}</p>
        </div>
        <div class="skills-section">
          <h3>Skills</h3>
          <ul>
            ${previewData.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}
          </ul>
        </div>
        <div class="projects-section">
          <h3>Projects</h3>
          <ul>
            ${previewData.projectDescriptions.split('\n').map(desc => `<li>${desc.trim()}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${previewData.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'HTML Portfolio Downloaded',
      description: 'Your portfolio has been downloaded as an HTML file.',
    });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      {/* Input Section */}
      <div className="w-full md:w-1/2 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Portfolio Details</CardTitle>
            <CardDescription>Fill in the information to generate your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactInformation">Contact Information</Label>
              <Input id="contactInformation" name="contactInformation" value={formData.contactInformation} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortBio">Short Bio</Label>
              <Textarea id="shortBio" name="shortBio" value={formData.shortBio} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" name="skills" value={formData.skills} onChange={handleSkillsChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDescriptions">Project Descriptions (one per line)</Label>
              <Textarea
                id="projectDescriptions"
                name="projectDescriptions"
                value={formData.projectDescriptions}
                onChange={handleProjectDescriptionsChange}
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleLivePreview}>Update Live Preview</Button>
            <Button variant="secondary" onClick={handleEnhanceBio}>Enhance Bio with AI</Button>
            <Button variant="secondary" onClick={handleSuggestProjectDescriptions}>
              Suggest Project Descriptions with AI
            </Button>
            <Button variant="destructive" onClick={handleDownloadHTML}>Download HTML</Button>

            {/* Enhance Bio Alert Dialog */}
            <AlertDialog open={isEnhanceBioOpen} onOpenChange={setIsEnhanceBioOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enhanced Bio</AlertDialogTitle>
                  <AlertDialogDescription>
                    Here's an AI-generated enhanced version of your bio:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4">{enhancedBio}</div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsEnhanceBioOpen(false)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Suggest Project Descriptions Alert Dialog */}
            <AlertDialog open={isSuggestProjectDescriptionsOpen} onOpenChange={setIsSuggestProjectDescriptionsOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Suggested Project Descriptions</AlertDialogTitle>
                  <AlertDialogDescription>
                    Here are AI-suggested improvements for your project descriptions:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4">
                  {suggestedProjectDescriptions.map((desc, index) => (
                    <p key={index} className="mb-2">
                      <strong>Project {index + 1}:</strong> {desc}
                    </p>
                  ))}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsSuggestProjectDescriptionsOpen(false)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      {/* Live Portfolio Preview Section */}
      <div className="w-full md:w-1/2 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Portfolio Preview</CardTitle>
            <CardDescription>This is how your portfolio will look.</CardDescription>
          </CardHeader>
          <CardContent>
            <h2>{previewData.name || 'Your Name'}</h2>
            <h3>{previewData.occupation || 'Your Occupation'}</h3>
            <p>{previewData.shortBio || 'Your Bio'}</p>
            <p>Contact: {previewData.contactInformation || 'Your Contact Info'}</p>
            <h4>Skills</h4>
            <ul>
              {(previewData.skills || '').split(',').map(skill => (
                <li key={skill.trim()}>{skill.trim()}</li>
              ))}
            </ul>
            <h4>Projects</h4>
            <ul>
              {(previewData.projectDescriptions || '').split('\n').map((desc, index) => (
                <li key={index}>{desc.trim()}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
