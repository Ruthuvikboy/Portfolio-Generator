'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';

const initialFormData = {
  name: '',
  age: '',
  occupation: '',
  contactInformation: '',
  shortBio: '',
  skills: '',
  projects: [{name: '', description: ''}],
  photo: null,
};

export default function HomePage() {
  const [formData, setFormData] = useState(initialFormData);
  const {toast} = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleProjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    const projects = [...formData.projects];
    projects[index][name] = value;
    setFormData({...formData, projects});
  };

  const addProject = () => {
    setFormData({...formData, projects: [...formData.projects, {name: '', description: ''}]});
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, photo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.occupation || !formData.contactInformation || !formData.shortBio || !formData.skills || !formData.photo) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and upload a photo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim());

      // Store form data in local storage
      localStorage.setItem('portfolioData', JSON.stringify({
        ...formData,
        skills: skillsArray,
      }));

      toast({
        title: 'Details Saved',
        description: 'Your portfolio details have been saved. Redirecting to your portfolio...',
      });

      // Redirect to the portfolio page
      router.push('/portfolio');
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save portfolio details. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Portfolio Details</CardTitle>
          <CardDescription>Fill in the information to generate your professional portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactInformation">Contact Information</Label>
              <Input id="contactInformation" name="contactInformation" value={formData.contactInformation} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortBio">Short Bio</Label>
              <Textarea id="shortBio" name="shortBio" value={formData.shortBio} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
            </div>

            {formData.projects.map((project, index) => (
              <div key={index} className="grid gap-4 border p-4 rounded-md">
                <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                <div className="grid gap-2">
                  <Label htmlFor={`projectName-${index}`}>Project Name</Label>
                  <Input
                    id={`projectName-${index}`}
                    name="name"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, e)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`projectDescription-${index}`}>Project Description</Label>
                  <Textarea
                    id={`projectDescription-${index}`}
                    name="description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    className="min-h-[80px]"
                    required
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addProject}>Add Project</Button>

            <div className="grid gap-2">
              <Label htmlFor="photo">Photo</Label>
              <Input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} required />
            </div>
            <Button type="submit">Create Portfolio</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
