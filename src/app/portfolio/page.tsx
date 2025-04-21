'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Icons} from '@/components/icons';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

const PortfolioPage = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve data from local storage
    const data = localStorage.getItem('portfolioData');
    if (data) {
      setPortfolioData(JSON.parse(data));
    } else {
      // Redirect to the form page if no data is found
      router.push('/');
    }
  }, [router]);

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const {name, age, occupation, contactInformation, shortBio, skills, projectDescriptions, photo} = portfolioData;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold">{name}</CardTitle>
                <CardDescription className="text-muted-foreground">{occupation}</CardDescription>
              </div>
              <Avatar className="w-20 h-20">
                {photo && <AvatarImage src={photo} alt={name} />}
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2">About Me</h2>
              <p>{shortBio}</p>
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <p>{contactInformation}</p>
            </section>

            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Projects</h2>
              <Accordion type="single" collapsible>
                {projectDescriptions.map((description: string, index: number) => (
                  <AccordionItem key={index} value={`project-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium">{`Project ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>{description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </CardContent>
        </Card>
        <TooltipProvider>
          <div className="flex justify-center mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
              <Button variant="outline" onClick={() => router.push('/')}>
                <Icons.edit className="w-4 h-4 mr-2" /> Edit Details
              </Button>
              </TooltipTrigger>
              <TooltipContent>
                Click here to edit your portfolio details
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PortfolioPage;
